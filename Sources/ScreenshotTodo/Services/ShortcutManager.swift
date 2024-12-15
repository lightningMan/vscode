import Foundation
import Carbon
import AppKit

class ShortcutManager: ObservableObject {
    @Published var shortcuts: [CustomShortcut] = []
    private var eventMonitor: Any?

    init() {
        setupDefaultShortcuts()
        setupEventMonitor()
    }

    private func setupDefaultShortcuts() {
        shortcuts = [CustomShortcut.defaultScreenshotShortcut]
    }

    private func setupEventMonitor() {
        eventMonitor = NSEvent.addGlobalMonitorForEvents(matching: .keyDown) { [weak self] event in
            self?.handleKeyEvent(event)
        }
    }

    private func handleKeyEvent(_ event: NSEvent) {
        let modifiers = event.modifierFlags.rawValue
        let keyCode = Int(event.keyCode)

        if let shortcut = shortcuts.first(where: { $0.key == keyCode && $0.modifiers == modifiers }) {
            NotificationCenter.default.post(
                name: Notification.Name("ShortcutTriggered"),
                object: nil,
                userInfo: ["action": shortcut.action]
            )
        }
    }

    func addShortcut(_ shortcut: CustomShortcut) {
        shortcuts.append(shortcut)
    }

    func removeShortcut(_ shortcut: CustomShortcut) {
        shortcuts.removeAll { $0.id == shortcut.id }
    }

    deinit {
        if let monitor = eventMonitor {
            NSEvent.removeMonitor(monitor)
        }
    }
}
