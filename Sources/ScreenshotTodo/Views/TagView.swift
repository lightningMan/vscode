import SwiftUI

struct TagView: View {
    let tag: Tag
    @Environment(\.colorScheme) var colorScheme
    @State private var isHovered = false

    var body: some View {
        Text(tag.name)
            .font(.system(size: 11, weight: .medium))
            .padding(.horizontal, 6)
            .padding(.vertical, 2)
            .background(
                Capsule()
                    .fill(tagColor.opacity(colorScheme == .dark ? 0.2 : 0.15))
                    .overlay(
                        Capsule()
                            .stroke(tagColor.opacity(0.2), lineWidth: 1)
                    )
            )
            .foregroundColor(tagColor.opacity(colorScheme == .dark ? 0.9 : 0.8))
            .scaleEffect(isHovered ? 1.05 : 1.0)
            .animation(.spring(response: 0.2), value: isHovered)
            .onHover { hovering in
                isHovered = hovering
            }
    }

    private var tagColor: Color {
        switch tag.color {
        case .blue: return .accentColor
        case .green: return .green
        case .red: return .red
        case .yellow: return .yellow
        case .purple: return .purple
        case .gray: return .secondary
        }
    }
}
