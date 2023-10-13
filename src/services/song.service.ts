import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import ytdl from 'ytdl-core';
import scdl from 'soundcloud-downloader';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class SongService {

  // Method to generate a unique file name
  private generateUniqueFileName(url: string): string {
    return crypto.createHash('md5').update(url).digest('hex') + '.mp3';
  }

  async downloadSong(musicUrl: string, res: Response): Promise<any> {
    if (!musicUrl) {
      res.status(400).send('Invalid or missing URL.');
      return;
    }

    // Generate a unique file name from the URL
    const hashedFileName = this.generateUniqueFileName(musicUrl);
    const filePath = path.join(__dirname, '../../song', hashedFileName);

    // Check if the file already exists
    if (fs.existsSync(filePath)) {
      res.status(400).send('Music with this URL has already been downloaded.');
      return;
    }

    let stream;
    const writeStream = fs.createWriteStream(filePath);

    // Check if the URL is a YouTube or SoundCloud URL
    if (ytdl.validateURL(musicUrl)) {
        // Download from YouTube
        stream = ytdl(musicUrl, { filter: 'audioonly' }).pipe(writeStream)
      } else if (scdl.isValidUrl(musicUrl)) {
        // Download from SoundCloud
        stream = scdl.download(musicUrl).then(stream => stream.pipe(writeStream));
      } else {
        return res.status(400).send('Invalid URL.');
      }

    
    // When the download is finished, provide the file for download
    writeStream.on('finish', () => {
      res.download(filePath, (err) => {
        if (err) {
          console.log('Error while providing the file:', err);
        } else {
          // fs.unlinkSync(filePath); // Delete the file after download if needed
        }
      });
    });

    // In case of an error during download
    writeStream.on('error', (err) => {
      console.log('Error during download:', err);
      res.status(500).send('Error during download.');
    });
  }
}
