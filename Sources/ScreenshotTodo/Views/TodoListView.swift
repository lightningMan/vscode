import SwiftUI

struct TodoListView: View {
    @EnvironmentObject var todoManager: TodoManager
    @State private var draggedItem: TodoItem?
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        List {
            ForEach(todoManager.todos) { todo in
                TodoItemView(todo: todo)
                    .listRowBackground(Color.clear)
                    .listRowSeparator(.hidden)
                    .onDrag {
                        self.draggedItem = todo
                        return NSItemProvider(object: todo.id.uuidString as NSString)
                    }
                    .onDrop(of: [.text], delegate: DropDelegate(item: todo, items: todoManager.todos,
                                                              draggedItem: $draggedItem,
                                                              todoManager: todoManager))
            }
            .animation(.spring(response: 0.3, dampingFraction: 0.8), value: todoManager.todos)
        }
        .listStyle(.inset)
        .background(Color.clear)
    }
}

struct TodoItemView: View {
    @EnvironmentObject var todoManager: TodoManager
    let todo: TodoItem
    @Environment(\.colorScheme) var colorScheme

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 12) {
                Button(action: {
                    withAnimation(.spring(response: 0.2)) {
                        todoManager.toggleTodo(todo)
                    }
                }) {
                    Image(systemName: todo.isCompleted ? "checkmark.circle.fill" : "circle")
                        .symbolRenderingMode(.hierarchical)
                        .foregroundStyle(Color.accentColor)
                        .font(.system(size: 16, weight: .medium))
                        .contentTransition(.symbolEffect(.replace))
                }
                .buttonStyle(.plain)
                .scaleEffect(todo.isCompleted ? 1.1 : 1.0)
                .animation(.spring(response: 0.2), value: todo.isCompleted)

                Text(todo.text)
                    .font(.system(size: 14))
                    .strikethrough(todo.isCompleted, color: .secondary)
                    .foregroundColor(todo.isCompleted ? .secondary : .primary)
                    .animation(.easeInOut, value: todo.isCompleted)

                Spacer()

                Button(action: {
                    withAnimation(.spring(response: 0.2)) {
                        todoManager.removeTodo(todo)
                    }
                }) {
                    Image(systemName: "trash")
                        .symbolRenderingMode(.hierarchical)
                        .foregroundStyle(.red)
                        .font(.system(size: 14))
                        .opacity(0.8)
                }
                .buttonStyle(.plain)
                .opacity(0.6)
                .scaleEffect(0.9)
                .hover { isHovered in
                    withAnimation(.spring(response: 0.2)) {
                        if isHovered {
                            self.opacity = 1.0
                            self.scaleEffect(1.1)
                        } else {
                            self.opacity = 0.6
                            self.scaleEffect(0.9)
                        }
                    }
                }
            }
            .padding(.horizontal, 8)

            if !todo.tags.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(Array(todo.tags)) { tag in
                            TagView(tag: tag)
                        }
                    }
                    .padding(.horizontal, 8)
                }
            }
        }
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(colorScheme == .dark ?
                    Color.white.opacity(0.05) :
                    Color.black.opacity(0.03))
                .opacity(draggedItem?.id == todo.id ? 0.5 : 1)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(Color.primary.opacity(0.1), lineWidth: 1)
        )
        .contentShape(Rectangle())
        .contextMenu {
            Menu {
                ForEach(todoManager.availableTags.filter { !todo.tags.contains($0) }) { tag in
                    Button(action: {
                        withAnimation(.spring(response: 0.2)) {
                            todoManager.addTag(tag, to: todo)
                        }
                    }) {
                        Label(tag.name, systemImage: "tag")
                    }
                }
            } label: {
                Label("Add Tag", systemImage: "tag.badge.plus")
            }

            if !todo.tags.isEmpty {
                Menu {
                    ForEach(Array(todo.tags)) { tag in
                        Button(role: .destructive, action: {
                            withAnimation(.spring(response: 0.2)) {
                                todoManager.removeTag(tag, from: todo)
                            }
                        }) {
                            Label(tag.name, systemImage: "tag.slash")
                        }
                    }
                } label: {
                    Label("Remove Tag", systemImage: "tag.slash")
                }
            }

            Divider()

            Button(role: .destructive, action: {
                withAnimation(.spring(response: 0.2)) {
                    todoManager.removeTodo(todo)
                }
            }) {
                Label("Delete Todo", systemImage: "trash")
            }
        }
    }
}

struct DropDelegate: DropDelegate {
    let item: TodoItem
    let items: [TodoItem]
    @Binding var draggedItem: TodoItem?
    let todoManager: TodoManager

    func performDrop(info: DropInfo) -> Bool {
        guard let draggedItem = self.draggedItem else { return false }
        todoManager.reorderTodo(draggedItem, to: item)
        self.draggedItem = nil
        return true
    }

    func dropEntered(info: DropInfo) {
        guard let draggedItem = self.draggedItem,
              draggedItem != item else { return }
        todoManager.moveTodo(draggedItem, to: item)
    }
}
