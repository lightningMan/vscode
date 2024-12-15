import SwiftUI
import AppKit

struct VisualEffectView: NSViewRepresentable {
    let material: NSVisualEffectView.Material
    let blendingMode: NSVisualEffectView.BlendingMode
    var emphasized: Bool = false

    func makeNSView(context: Context) -> NSVisualEffectView {
        let view = NSVisualEffectView()
        view.material = material
        view.blendingMode = blendingMode
        view.state = .active
        view.isEmphasized = emphasized
        return view
    }

    func updateNSView(_ nsView: NSVisualEffectView, context: Context) {
        nsView.material = material
        nsView.blendingMode = blendingMode
        nsView.isEmphasized = emphasized
    }
}

extension VisualEffectView {
    static var titlebar: Self {
        VisualEffectView(material: .titlebar, blendingMode: .withinWindow, emphasized: true)
    }

    static var contentBackground: Self {
        VisualEffectView(material: .contentBackground, blendingMode: .behindWindow)
    }

    static var menu: Self {
        VisualEffectView(material: .menu, blendingMode: .withinWindow)
    }

    static var sidebar: Self {
        VisualEffectView(material: .sidebar, blendingMode: .withinWindow)
    }
}
