import SwiftUI

struct ContentView: View {
    @EnvironmentObject var todoManager: TodoManager
    @EnvironmentObject var windowManager: WindowManager
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        VStack(spacing: 0) {
            TitleBarView()
            TodoListView()
        }
        .frame(
            minWidth: 250,
            idealWidth: windowManager.windowSize.width,
            maxWidth: .infinity,
            minHeight: 300,
            idealHeight: windowManager.windowSize.height,
            maxHeight: .infinity
        )
        .background(VisualEffectView(
            material: colorScheme == .dark ? .dark : .light,
            blendingMode: .behindWindow
        ))
        .ignoresSafeArea(.all, edges: .all)
        .animation(.easeOut(duration: 0.2), value: colorScheme)
        .animation(.spring(response: 0.3), value: windowManager.windowSize)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .shadow(radius: 10, x: 0, y: 5)
    }
}
