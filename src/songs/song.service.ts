import { Injectable } from "@nestjs/common";
import { Response } from "express";
import ytdl from "ytdl-core";
import scdl from "soundcloud-downloader";
import * as fs from "fs";
import * as path from "path";
import { isPlaylistUrl, sanitizeFileName } from "../helper/helper";


@Injectable()
export class SongService {
  // Error messages for consistent responses
  static readonly ERR_INVALID_OR_MISSING_URL = "Invalid or missing URL.";
  static readonly ERR_MUSIC_ALREADY_DOWNLOADED =
    "Music with this URL has already been downloaded.";
    static readonly ERR_IS_PLAYLIST =
    "This is a playlist URL, please provide a video URL";

  async getMusicTitle(musicUrl: string): Promise<string> {
    /**
     * Retrieves the title of the music from a given URL. Supports both YouTube and SoundCloud URLs.
     * 
     * @param {string} musicUrl - The URL of the music.
     * @returns {Promise<string>} - The title of the music.
     * @throws {Error} - Throws an error if the URL is not valid for YouTube or SoundCloud.
     */
      if (ytdl.validateURL(musicUrl)) {
          const info = await ytdl.getInfo(musicUrl);
          return info.videoDetails.title;
      } else if (scdl.isValidUrl(musicUrl)) {
          const trackInfo = await scdl.getInfo(musicUrl);
          return trackInfo.title;
      } else {
          throw new Error("Invalid URL");
      }
  }

  async downloadSong(musicUrl: string, res: Response): Promise<any> {
    /**
     * Downloads a song from a given music URL. Supports both YouTube and SoundCloud URLs.
     * @param {string} musicUrl - The URL of the song to download.
     * @param {Response} res - The Express response object to send the response.
     * @returns {Promise<any>} - Resolves once the song is downloaded.
     */
    if (!musicUrl) {
      res.status(400).send(SongService.ERR_INVALID_OR_MISSING_URL);
      return;
    }

    if (isPlaylistUrl(musicUrl)) {
      res.status(400).send(SongService.ERR_IS_PLAYLIST);
      return;
    }

    const musicTitle = await this.getMusicTitle(musicUrl);
    const sanitizedTitle = sanitizeFileName(musicTitle, "mp3");
    const filePath = path.join(__dirname, "../../song", sanitizedTitle);
    

    if (fs.existsSync(filePath)) {
      res.status(400).send(SongService.ERR_MUSIC_ALREADY_DOWNLOADED);
      return;
    }

    let stream;
    const writeStream = fs.createWriteStream(filePath);

    if (ytdl.validateURL(musicUrl)) {
      stream = ytdl(musicUrl, { filter: "audioonly" }).pipe(writeStream);
    } else if (scdl.isValidUrl(musicUrl)) {
      stream = scdl
        .download(musicUrl)
        .then((stream) => stream.pipe(writeStream));
    } else {
      return res.status(400).send(SongService.ERR_INVALID_OR_MISSING_URL);
    }

    this.handleStreamEvents(writeStream, filePath, res);
  }

  handleStreamEvents(writeStream, filePath, res: Response) {
    /**
     * Handles the stream events, particularly 'finish' and 'error'. Provides the file for download upon completion
     * and handles potential errors during the download.
     * @param {WriteStream} writeStream - The writable stream used for downloading the music.
     * @param {string} filePath - The path where the downloaded file is saved.
     * @param {Response} res - The Express response object to send the response.
     */
    writeStream.on("finish", () => {
      res.download(filePath, (err) => {
        if (err) {
          console.error("Error providing the file:", err);
        } else {
          fs.unlinkSync(filePath); // Remove the file after download if needed
        }
      });
    });

    writeStream.on("error", (err) => {
      console.error("Error during download:", err);
      res.status(500).send("Error during download.");
    });
  }
}