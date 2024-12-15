import Foundation
import CryptoKit

class StorageService {
    private let fileManager = FileManager.default
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()
    private let key: SymmetricKey

    init() throws {
        // Generate or load encryption key
        if let keyData = try? Data(contentsOf: getKeyURL()) {
            self.key = SymmetricKey(data: keyData)
        } else {
            self.key = SymmetricKey(size: .bits256)
            try self.saveEncryptionKey()
        }
    }

    private func getKeyURL() -> URL {
        let appSupport = fileManager.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        return appSupport.appendingPathComponent("encryption_key.dat")
    }

    private func saveEncryptionKey() throws {
        let keyData = key.withUnsafeBytes { Data($0) }
        try keyData.write(to: getKeyURL())
    }

    func save<T: Encodable>(_ item: T, to filename: String) throws {
        let data = try encoder.encode(item)
        let encrypted = try ChaChaPoly.seal(data, using: key)
        let url = getDocumentsDirectory().appendingPathComponent(filename)
        try encrypted.combined.write(to: url)
    }

    func load<T: Decodable>(from filename: String) throws -> T {
        let url = getDocumentsDirectory().appendingPathComponent(filename)
        let data = try Data(contentsOf: url)
        let box = try ChaChaPoly.SealedBox(combined: data)
        let decrypted = try ChaChaPoly.open(box, using: key)
        return try decoder.decode(T.self, from: decrypted)
    }

    private func getDocumentsDirectory() -> URL {
        fileManager.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }

    func backup() throws {
        let backupURL = getDocumentsDirectory().appendingPathComponent("backups")
        try fileManager.createDirectory(at: backupURL, withIntermediateDirectories: true)

        let timestamp = ISO8601DateFormatter().string(from: Date())
        let backupFile = backupURL.appendingPathComponent("backup_\(timestamp).zip")

        // Create backup archive
        try fileManager.zipItem(at: getDocumentsDirectory(), to: backupFile)
    }
}
