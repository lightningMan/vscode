import SwiftUI

@main
struct ScreenshotTodoApp: App {
    @StateObject private var todoManager = TodoManager()
    @StateObject private var windowManager = WindowManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(todoManager)
                .environmentObject(windowManager)
        }
        .windowStyle(.hiddenTitleBar)
        .windowToolbarStyle(.unified)
        .defaultSize(width: 300, height: 400)
        .commands {
            CommandGroup(after: .appInfo) {
                Button("Take Screenshot") {
                    Task {
                        await todoManager.captureScreenshot()
                    }
                }.keyboardShortcut("s", modifiers: [.command, .shift])

                Button("Toggle Always on Top") {
                    windowManager.toggleAlwaysOnTop()
                }.keyboardShortcut("t", modifiers: [.command, .shift])
            }
        }
    }
}
