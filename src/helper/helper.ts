import scdl from "soundcloud-downloader"
import ytdl from "ytdl-core"
import { BadRequestError } from "./errorManager"

export function sanitizeFileName(
    fileName: string,
    fileExtension: string,
): string {
    // Remplace les caractères non valides pour un nom de fichier par des underscores
    const sanitizedFileName = fileName.replace(/[<>:"/\\|?*]+/g, "_")
    return `${sanitizedFileName}.${fileExtension}`
}

export function isPlaylistUrl(url: string): boolean {
    /**
     * Determines whether the provided URL points to a playlist on either YouTube or SoundCloud.
     * @param {string} url - The URL to check.
     * @returns {boolean} - True if the URL points to a playlist, otherwise false.
     */
    const youtubePlaylistPattern = /youtube\.com\/playlist\?list=/
    const soundcloudPlaylistPattern = /soundcloud\.com\/.*\/sets\//
    return (
        youtubePlaylistPattern.test(url) || soundcloudPlaylistPattern.test(url)
    )
}

export const shortenUrl = (url: string): string => {
    const newURL = (new URL(url))
    if (ytdl.validateURL(url)) {
        const v = newURL.searchParams.get('v')
        newURL.search = ''
        newURL.searchParams.append('v', v)
    } else if (scdl.isValidUrl(url)) {
        newURL.search = ''
    } else {
        throw BadRequestError("Invalid URL")
    }
    return newURL.toString()
}