import SwiftUI

struct TitleBarView: View {
    @EnvironmentObject var windowManager: WindowManager
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        HStack {
            HStack(spacing: 8) {
                Circle()
                    .fill(Color.red)
                    .frame(width: 12, height: 12)
                Circle()
                    .fill(Color.yellow)
                    .frame(width: 12, height: 12)
                Circle()
                    .fill(Color.green)
                    .frame(width: 12, height: 12)
            }
            .padding(.leading, 4)

            Text("Screenshot Todo")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(.primary)

            Spacer()

            Toggle("置顶", isOn: $windowManager.isAlwaysOnTop)
                .toggleStyle(.switch)
                .controlSize(.small)
                .font(.system(size: 12))
                .onChange(of: windowManager.isAlwaysOnTop) { _ in
                    windowManager.toggleAlwaysOnTop()
                }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(VisualEffectView(
            material: colorScheme == .dark ? .titlebar : .headerView,
            blendingMode: .withinWindow
        ))
        .animation(.easeOut(duration: 0.2), value: colorScheme)
    }
}
