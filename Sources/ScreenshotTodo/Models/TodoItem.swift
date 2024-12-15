import Foundation

struct TodoItem: Identifiable, Codable {
    let id: UUID
    var text: String
    var isCompleted: Bool
    var createdAt: Date
    var tags: Set<Tag>
    var screenshotPath: String?
    var order: Int

    init(text: String, tags: Set<Tag> = [], screenshotPath: String? = nil, order: Int) {
        self.id = UUID()
        self.text = text
        self.isCompleted = false
        self.createdAt = Date()
        self.tags = tags
        self.screenshotPath = screenshotPath
        self.order = order
    }
}
