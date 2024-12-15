import SwiftUI
import Vision
import AppKit

@MainActor
class TodoManager: ObservableObject {
    @Published var todos: [TodoItem] = []
    @Published var availableTags: [Tag] = []

    private let screenshotService = ScreenshotService()
    private let textRecognitionService = TextRecognitionService()
    private let storageService: StorageService

    init() {
        do {
            self.storageService = try StorageService()
            try loadData()
        } catch {
            print("Error initializing storage: \(error)")
            self.storageService = try! StorageService()
        }
    }

    private func loadData() throws {
        self.todos = try storageService.load(from: "todos.json")
        self.availableTags = try storageService.load(from: "tags.json")
    }

    private func saveData() {
        do {
            try storageService.save(todos, to: "todos.json")
            try storageService.save(availableTags, to: "tags.json")
            try storageService.backup()
        } catch {
            print("Error saving data: \(error)")
        }
    }

    func captureScreenshot() async {
        do {
            let screenshot = try await screenshotService.capture()
            let text = try await textRecognitionService.recognizeText(from: screenshot)
            let screenshotPath = try await saveScreenshot(screenshot)
            await MainActor.run {
                addTodo(text: text, screenshotPath: screenshotPath)
            }
        } catch {
            print("Error capturing screenshot: \(error)")
        }
    }

    private func saveScreenshot(_ image: NSImage) async throws -> String {
        let filename = "screenshot_\(Date().timeIntervalSince1970).png"
        let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("screenshots")
            .appendingPathComponent(filename)

        try FileManager.default.createDirectory(
            at: url.deletingLastPathComponent(),
            withIntermediateDirectories: true
        )

        if let tiffData = image.tiffRepresentation,
           let bitmapImage = NSBitmapImageRep(data: tiffData),
           let pngData = bitmapImage.representation(using: .png, properties: [:]) {
            try pngData.write(to: url)
            return url.path
        }
        throw NSError(domain: "Screenshot", code: -1, userInfo: [NSLocalizedDescriptionKey: "Failed to save screenshot"])
    }

    func addTodo(text: String, screenshotPath: String? = nil) {
        let todo = TodoItem(
            text: text,
            screenshotPath: screenshotPath,
            order: todos.count
        )
        todos.append(todo)
        saveData()
    }

    func toggleTodo(_ todo: TodoItem) {
        if let index = todos.firstIndex(where: { $0.id == todo.id }) {
            todos[index].isCompleted.toggle()
            saveData()
        }
    }

    func removeTodo(_ todo: TodoItem) {
        todos.removeAll { $0.id == todo.id }
        saveData()
    }

    func addTag(_ tag: Tag, to todo: TodoItem) {
        if let index = todos.firstIndex(where: { $0.id == todo.id }) {
            todos[index].tags.insert(tag)
            saveData()
        }
    }

    func removeTag(_ tag: Tag, from todo: TodoItem) {
        if let index = todos.firstIndex(where: { $0.id == todo.id }) {
            todos[index].tags.remove(tag)
            saveData()
        }
    }

    func reorderTodo(_ todo: TodoItem, to target: TodoItem) {
        guard let fromIndex = todos.firstIndex(where: { $0.id == todo.id }),
              let toIndex = todos.firstIndex(where: { $0.id == target.id }) else { return }

        let item = todos.remove(at: fromIndex)
        todos.insert(item, at: toIndex)

        for (index, todo) in todos.enumerated() {
            todos[index].order = index
        }

        saveData()
    }

    func moveTodo(_ todo: TodoItem, to target: TodoItem) {
        reorderTodo(todo, to: target)
    }
}
