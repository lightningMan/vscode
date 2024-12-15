import Foundation

struct Tag: Identifiable, Codable, Hashable {
    let id: UUID
    var name: String
    var color: TagColor

    init(name: String, color: TagColor = .blue) {
        self.id = UUID()
        self.name = name
        self.color = color
    }
}

enum TagColor: String, Codable, CaseIterable {
    case blue, green, red, yellow, purple, gray

    var colorName: String {
        switch self {
            case .blue: return "Blue"
            case .green: return "Green"
            case .red: return "Red"
            case .yellow: return "Yellow"
            case .purple: return "Purple"
            case .gray: return "Gray"
        }
    }
}
