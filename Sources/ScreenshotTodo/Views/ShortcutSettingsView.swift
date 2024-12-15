import SwiftUI

struct ShortcutSettingsView: View {
    @EnvironmentObject var shortcutManager: ShortcutManager
    @Environment(\.presentationMode) var presentationMode
    @State private var editingShortcut: CustomShortcut?

    var body: some View {
        NavigationView {
            List {
                ForEach(shortcutManager.shortcuts) { shortcut in
                    ShortcutRow(shortcut: shortcut)
                        .contextMenu {
                            Button("Edit") {
                                editingShortcut = shortcut
                            }
                            Button("Delete", role: .destructive) {
                                shortcutManager.removeShortcut(shortcut)
                            }
                        }
                }
            }
            .navigationTitle("Keyboard Shortcuts")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        presentationMode.wrappedValue.dismiss()
                    }
                }
            }
            .sheet(item: $editingShortcut) { shortcut in
                ShortcutEditView(shortcut: shortcut)
            }
        }
    }
}

struct ShortcutRow: View {
    let shortcut: CustomShortcut

    var body: some View {
        HStack {
            Text(shortcut.action.rawValue.capitalized)
            Spacer()
            Text(shortcutDescription)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }

    private var shortcutDescription: String {
        var desc = ""
        if shortcut.modifiers & cmdKey != 0 { desc += "⌘" }
        if shortcut.modifiers & shiftKey != 0 { desc += "⇧" }
        if shortcut.modifiers & optionKey != 0 { desc += "⌥" }
        if shortcut.modifiers & controlKey != 0 { desc += "⌃" }
        return desc + keyCodeToString(shortcut.key)
    }

    private func keyCodeToString(_ keyCode: Int) -> String {
        // Simplified mapping for common keys
        switch keyCode {
        case kVK_ANSI_S: return "S"
        case kVK_ANSI_P: return "P"
        case kVK_Space: return "Space"
        default: return "?"
        }
    }
}
