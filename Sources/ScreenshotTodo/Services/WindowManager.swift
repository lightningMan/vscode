import SwiftUI
import AppKit

class WindowManager: ObservableObject {
    @Published var isAlwaysOnTop: Bool = false
    @Published var windowSize: CGSize = CGSize(width: 300, height: 400)

    func toggleAlwaysOnTop() {
        isAlwaysOnTop.toggle()
        if let window = NSApplication.shared.windows.first {
            window.level = isAlwaysOnTop ? .floating : .normal
        }
    }

    func resizeWindow(to size: CGSize) {
        windowSize = size
        if let window = NSApplication.shared.windows.first {
            window.setContentSize(size)
        }
    }
}
