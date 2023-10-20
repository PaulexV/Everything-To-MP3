import { SongService } from '../song.service';
import { Response } from 'express'; // Assurez-vous d'importer le type Response d'Express
import ytdl from 'ytdl-core';
import scdl from 'soundcloud-downloader';
import fs from 'fs';
import path from 'path';

jest.mock('ytdl-core');
jest.mock('soundcloud-downloader');
jest.mock('fs', () => ({
    existsSync: jest.fn(),
    createWriteStream: jest.fn().mockReturnValue({
        on: jest.fn(),
        end: jest.fn()
    })
}));
jest.mock('path');

describe('SongService', () => {
  let service: SongService;

  beforeEach(() => {
    service = new SongService();
    jest.clearAllMocks();
  });

  describe('downloadSong', () => {
    it('test_downloadSong_MissingURL', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as unknown as Response;

      await service.downloadSong('', res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(SongService.ERR_INVALID_OR_MISSING_URL);
    });

    it('test_downloadSong_IsPlaylist', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as unknown as Response;

      const playlistUrl = 'https://youtube.com/playlist?list=XXX';
      await service.downloadSong(playlistUrl, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(SongService.ERR_IS_PLAYLIST);
    });

    it('test_downloadSong_AlreadyDownloaded', async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as unknown as Response;

      const validUrl = 'https://youtube-valid-url';
      fs.existsSync.mockReturnValueOnce(true);
      await service.downloadSong(validUrl, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(SongService.ERR_MUSIC_ALREADY_DOWNLOADED);
    });

    it('test_downloadSong_YoutubeValidURL', async () => {
      const res = {} as unknown as Response;
      const validUrl = 'https://youtube-valid-url';
      (ytdl.validateURL as jest.Mock).mockReturnValueOnce(true);
      fs.existsSync.mockReturnValueOnce(false);
      service.handleStreamEvents = jest.fn();
      await service.downloadSong(validUrl, res);
      expect(service.handleStreamEvents).toHaveBeenCalled();
    });

    it('test_downloadSong_SoundCloudValidURL', async () => {
      const res = {} as unknown as Response;
      const validUrl = 'https://soundcloud-valid-url';
      (ytdl.validateURL as jest.Mock).mockReturnValueOnce(false);
      (scdl.isValidUrl as jest.Mock).mockReturnValueOnce(true);
      fs.existsSync.mockReturnValueOnce(false);
      service.handleStreamEvents = jest.fn();
      await service.downloadSong(validUrl, res);
      expect(service.handleStreamEvents).toHaveBeenCalled();
    });

    it('test_downloadSong_InvalidURL', async () => {
      const res = {
               status: jest.fn().mockReturnThis(),
        send: jest.fn()
      } as unknown as Response;

      const invalidUrl = 'https://invalid-url';
      (ytdl.validateURL as jest.Mock).mockReturnValueOnce(false);
      (scdl.isValidUrl as jest.Mock).mockReturnValueOnce(false);

      await service.downloadSong(invalidUrl, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(SongService.ERR_INVALID_OR_MISSING_URL);
    });
  });
});

