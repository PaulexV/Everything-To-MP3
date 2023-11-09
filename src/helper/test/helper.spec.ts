import { sanitizeFileName, isPlaylistUrl } from "../helper"
import * as assert from "assert"

describe("sanitizeFileName", () => {
    it("should remove invalid characters and append file extension", () => {
        const result = sanitizeFileName("invalid:/file*name", "txt")
        assert.strictEqual(result, "invalid_file_name.txt")
    })

    it("should not modify valid file name", () => {
        const result = sanitizeFileName("validfilename", "txt")
        assert.strictEqual(result, "validfilename.txt")
    })
})

describe("isPlaylistUrl", () => {
    it("should return true for youtube playlist URL", () => {
        const result = isPlaylistUrl(
            "https://www.youtube.com/playlist?list=abc123",
        )
        assert.strictEqual(result, true)
    })

    it("should return true for soundcloud playlist URL", () => {
        const result = isPlaylistUrl(
            "https://soundcloud.com/username/sets/playlistname",
        )
        assert.strictEqual(result, true)
    })

    it("should return false for non-playlist URL", () => {
        const result = isPlaylistUrl("https://www.youtube.com/watch?v=abc123")
        assert.strictEqual(result, false)
    })
})
