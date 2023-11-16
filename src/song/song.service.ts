import { Model } from "mongoose"
import { Injectable, NotFoundException } from "@nestjs/common"
import { Response } from "express"
import ytdl from "ytdl-core"
import scdl from "soundcloud-downloader"
import * as fs from "fs"
import * as path from "path"
import { isPlaylistUrl, sanitizeFileName } from "../helper/helper"
import { InjectModel } from "@nestjs/mongoose"
import { Song, SongDocument } from "./song.schema"
import { randomUUID } from "crypto"
import {
    BlobServiceClient,
    StorageSharedKeyCredential,
} from "@azure/storage-blob"
import * as dotenv from "dotenv"
dotenv.config()
import { BadRequestError } from "../helper/errorManager"

@Injectable()
export class SongService {
    constructor(
        @InjectModel(Song.name)
        private songModel: Model<SongDocument>,
    ) {}

    async findAll(): Promise<Song[]> {
        return this.songModel.find().exec()
    }
    async create(song: Song): Promise<Song> {
        const createdSong = new this.songModel(song)
        return createdSong.save()
    }

    // Error messages for consistent responses
    static readonly ERR_INVALID_OR_MISSING_URL = "Invalid or missing URL."
    static readonly ERR_MUSIC_ALREADY_DOWNLOADED =
        "Music with this URL has already been downloaded."
    static readonly ERR_IS_PLAYLIST =
        "This is a playlist URL, please provide a video URL"

    async getMusicTitle(url: string): Promise<string> {
        /**
         * Retrieves the title of the music from a given URL. Supports both YouTube and SoundCloud URLs.
         *
         * @param {string} url - The URL of the music.
         * @returns {Promise<string>} - The title of the music.
         * @throws {Error} - Throws an error if the URL is not valid for YouTube or SoundCloud.
         */
        if (ytdl.validateURL(url)) {
            const info = await ytdl.getInfo(url)
            return info.videoDetails.title
        } else if (scdl.isValidUrl(url)) {
            const trackInfo = await scdl.getInfo(url)
            return trackInfo.title
        } else {
            throw new Error("Invalid URL")
        }
    }

    async downloadSong(
        url: string,
        title: string | undefined,
        res: Response,
    ): Promise<any> {
        /**
         * Downloads a song from a given music URL. Supports both YouTube and SoundCloud URLs.
         * @param {string} url - The URL of the song to download.
         * @param {string?} title - The title of the song to download.
         * @param {Response} res - The Express response object to send the response.
         * @returns {Promise<any>} - Resolves once the song is downloaded.
         */
        if (!url) {
            res.status(400).send(SongService.ERR_INVALID_OR_MISSING_URL)
            return
        }
        if (isPlaylistUrl(url)) {
            res.status(400).send(SongService.ERR_IS_PLAYLIST)
            return
        }
        const musicTitle = title ?? (await this.getMusicTitle(url))

        const sanitizedTitle = sanitizeFileName(musicTitle, "mp3")
        const blobName = path.basename(sanitizedTitle);

        if (await this.blobExists(blobName)) {
            const downloadUrl = this.getDownloadUrl(blobName);
            res.redirect(downloadUrl);
            return;
        }
        const filePath = path.join(__dirname, "../../downloads", sanitizedTitle)

        if (fs.existsSync(filePath)) {
            res.status(400).send(SongService.ERR_MUSIC_ALREADY_DOWNLOADED)
            return
        }

        let stream
        const writeStream = fs.createWriteStream(filePath)

        if (ytdl.validateURL(url)) {
            stream = ytdl(url, { filter: "audioonly" }).pipe(writeStream)
        } else if (scdl.isValidUrl(url)) {
            stream = scdl.download(url).then(stream => stream.pipe(writeStream))
        } else {
            return res.status(400).send(SongService.ERR_INVALID_OR_MISSING_URL)
        }
        this.handleStreamEvents(writeStream, filePath, res)

        const song: Song = {
            id: randomUUID(),
            title: musicTitle,
            filename: filePath,
            originalLink: url,
            popularity: 1,
        }
        await this.create(song)
    }


    getContainerClient() {
        const account = process.env.ACCOUNT;
        const accountKey = process.env.ACCOUNT_KEY;
        const containerName = process.env.CONTAINER_NAME;

        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`, sharedKeyCredential
        );

        return blobServiceClient.getContainerClient(containerName);
    }

    async blobExists(blobName: string): Promise<boolean> {
        const containerClient = this.getContainerClient();
        const blobClient = containerClient.getBlobClient(blobName);
        return blobClient.exists();
    }

    async uploadToAzureBlob(filePath) {
        const containerClient = this.getContainerClient();
        const blobName = path.basename(filePath)
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)

        await blockBlobClient.uploadFile(filePath)
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
            res.download(filePath, async err => {
                if (err) {
                    console.error("Error providing the file:", err)
                    throw new Error()
                } else {
                    await this.uploadToAzureBlob(filePath)
                    fs.unlinkSync(filePath)
                }
            })
        })

        writeStream.on("error", err => {
            console.error("Error during download:", err)
            res.status(500).send("Error during download.")
        })
    }

    getDownloadUrl(blobName) {
        const containerClient = this.getContainerClient();
    
        const blobClient = containerClient.getBlobClient(blobName);
        const sasToken = this.generateBlobSasToken(containerClient, blobName);
    
        return `${blobClient.url}?${sasToken}`;
    }
    
    generateBlobSasToken(containerClient, blobName) {
        const { StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require("@azure/storage-blob");
    
        const accountName = process.env.ACCOUNT;
        const accountKey = process.env.ACCOUNT_KEY;
        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    
        const sasOptions = {
            containerName: containerClient.containerName,
            blobName: blobName,
            startsOn: new Date(),
            expiresOn: new Date(new Date().valueOf() + 86400), // Le lien expire après 24 heures
            permissions: BlobSASPermissions.parse("r"), // Autorisation de lecture uniquement
        };
    
        const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
        return sasToken;
    }

    async getSongFromURL(url: string): Promise<Song | undefined> {
        return this.songModel.findOne({ originalLink: url })
    }

    async addPopularity(song: Song): Promise<Song> {
        const newSong = await this.songModel.findOneAndUpdate(
            { id: song.id },
            { popularity: song.popularity + 1 },
            { new: true },
        )
        if (!newSong) {
            throw BadRequestError("Cannot find song")
        }
        return newSong
    }
}
