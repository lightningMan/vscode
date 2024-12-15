import Vision
import AppKit

class TextRecognitionService {
    func recognizeText(from image: NSImage) async throws -> String {
        guard let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
            throw TextRecognitionError.invalidImage
        }


        let requestHandler = VNImageRequestHandler(cgImage: cgImage)
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate

        try await requestHandler.perform([request])

        guard let observations = request.results else {
            throw TextRecognitionError.noResults
        }

        return observations
            .compactMap { $0.topCandidates(1).first?.string }
            .joined(separator: "\n")
    }
}

enum TextRecognitionError: Error {
    case invalidImage
    case noResults
}
