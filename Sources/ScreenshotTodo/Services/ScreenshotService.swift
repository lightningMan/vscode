import AppKit
import Vision

class ScreenshotService {
    func capture() async throws -> NSImage {
        // Request screen capture permission if needed
        let hasPermission = CGPreflightScreenCaptureAccess()
        if !hasPermission {
            CGRequestScreenCaptureAccess()
        }

        guard let screenshot = CGWindowListCreateImage(
            .zero,
            .optionOnScreenOnly,
            kCGNullWindowID,
            .bestResolution
        ) else {
            throw ScreenshotError.captureFailed
        }

        return NSImage(cgImage: screenshot, size: .zero)
    }
}

enum ScreenshotError: Error {
    case captureFailed
}
