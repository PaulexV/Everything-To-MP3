import { Injectable } from "@nestjs/common";
import { Response } from "express";
import ytdl from "ytdl-core";
import ytpl from "ytpl";
import scdl from "soundcloud-downloader";
import * as archiver from 'archiver';
import * as fs from "fs";
import * as path from "path";
import { isPlaylistUrl, sanitizeFileName } from "../helper/helper";

@Injectable()
export class PlaylistService {
    static readonly ERR_IS_VIDEO =
    "This is a video URL, please provide a playlist URL";

  async downloadPlaylist(playlistUrl: string, res: Response): Promise<void> {
    /**
     * Télécharge une playlist à partir d'une URL fournie (YouTube ou SoundCloud) et renvoie une archive ZIP contenant les fichiers audio.
     * 
     * @param {string} playlistUrl - L'URL de la playlist à télécharger.
     * @param {Response} res - L'objet de réponse Express.js pour envoyer des données au client.
     * @returns {Promise<void>} - Une promesse qui résout lorsque toutes les chansons ont été ajoutées à l'archive et que celle-ci a été finalisée.
     * @throws {Error} - Renvoie une erreur avec un code d'état 400 et un message approprié si l'URL est invalide, si elle pointe vers une vidéo ou si une erreur se produit lors de la récupération de la playlist.
     */
    if (!playlistUrl) {
      res.status(400).send("Invalid or missing URL.");
      return;
    }

    if (!isPlaylistUrl(playlistUrl)) {
      res.status(400).send(PlaylistService.ERR_IS_VIDEO);
      return;
    }

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    // archive.pipe(res);

    const tasks = [];

    if (ytpl.validateID(playlistUrl)) {
      const playlist = await ytpl(playlistUrl);
      res.attachment(sanitizeFileName(playlist.title, "zip"));
      if (playlist.items && playlist.items.length) {
        for (const item of playlist.items) {
          const fileName = sanitizeFileName(item.title, "mp3");
          const filePath = path.join(__dirname, "../../song", fileName);

          if (fs.existsSync(filePath)) {
            archive.append(fs.createReadStream(filePath), {
              name: fileName,
            });
          } else {
            const task = new Promise<void>(async (resolve) => {
              if (ytdl.validateURL(item.url)) {
                const stream = ytdl(item.url, { filter: "audioonly" });
                stream.pipe(fs.createWriteStream(filePath)).on("finish", () => {
                  archive.append(fs.createReadStream(filePath), {
                    name: fileName,
                  });
                  resolve(undefined);
                });
              }
            });
            tasks.push(task);
          }
        }
      } else {
        res.status(400).send("The playlist is empty or an error has occurred");
        return;
      }
    } else if (scdl.isValidUrl(playlistUrl)) {
      const tracks = await scdl.getSetInfo(playlistUrl);
      res.attachment(sanitizeFileName((tracks as any).title, "zip"));

      for (const track of tracks.tracks) {
        const musicUrl = track.permalink_url;
        const hashedFileName = sanitizeFileName(track.title, "mp3");
        const filePath = path.join(__dirname, "../../song", hashedFileName);

        if (fs.existsSync(filePath)) {
          archive.append(fs.createReadStream(filePath), {
            name: hashedFileName,
          });
        } else {
          const task = new Promise<void>(async (resolve) => {
            if (scdl.isValidUrl(musicUrl)) {
              const stream = await scdl.download(musicUrl);
              stream.pipe(fs.createWriteStream(filePath)).on("finish", () => {
                archive.append(fs.createReadStream(filePath), {
                  name: hashedFileName,
                });
                resolve(undefined);
              });
            }
          });
          tasks.push(task);
        }
      }
    } else {
      res.status(400).send("Invalid playlist URL.");
      return;
    }

    await Promise.all(tasks);

    archive.finalize();
  }
}

