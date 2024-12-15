// swift-tools-version:5.5
import PackageDescription

let package = Package(
    name: "ScreenshotTodo",
    platforms: [
        .macOS(.v12)
    ],
    products: [
        .executable(name: "ScreenshotTodo", targets: ["ScreenshotTodo"])
    ],
    dependencies: [],
    targets: [
        .executableTarget(
            name: "ScreenshotTodo",
            dependencies: [])
    ]
)
