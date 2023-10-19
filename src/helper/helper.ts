export function sanitizeFileName(fileName: string, fileExtension: string): string {
    // Remplace les caractères non valides pour un nom de fichier par des underscores
    const sanitizedFileName = fileName.replace(/[<>:"/\\|?*]+/g, '_');
    return `${sanitizedFileName}.${fileExtension}`;
  }

export function isPlaylistUrl(url: string): boolean {
  /**
   * Determines whether the provided URL points to a playlist on either YouTube or SoundCloud.
   * @param {string} url - The URL to check.
   * @returns {boolean} - True if the URL points to a playlist, otherwise false.
   */
  const youtubePlaylistPattern = /youtube\.com\/playlist\?list=/;
  const soundcloudPlaylistPattern = /soundcloud\.com\/.*\/sets\//;
  return (
    youtubePlaylistPattern.test(url) || soundcloudPlaylistPattern.test(url)
  );
}