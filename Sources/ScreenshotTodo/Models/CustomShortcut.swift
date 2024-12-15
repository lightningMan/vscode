import Foundation
import Carbon

struct CustomShortcut: Codable, Identifiable {
    let id: UUID
    var key: Int
    var modifiers: Int
    var action: ShortcutAction

    init(key: Int, modifiers: Int, action: ShortcutAction) {
        self.id = UUID()
        self.key = key
        self.modifiers = modifiers
        self.action = action
    }

    static let defaultScreenshotShortcut = CustomShortcut(
        key: kVK_ANSI_S,
        modifiers: cmdKey | shiftKey,
        action: .takeScreenshot
    )
}

enum ShortcutAction: String, Codable {
    case takeScreenshot
    case toggleWindow
    case quickAdd
}
