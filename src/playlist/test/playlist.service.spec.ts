import { Response } from "express";
import { PlaylistService } from "../playlist.service";
import ytdl from "ytdl-core";
import * as ytpl from "ytpl";
import scdl from "soundcloud-downloader";
import * as archiver from "archiver";

const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("PlaylistService", () => {
  let service: PlaylistService;
  let res: Response;

  beforeEach(() => {
    service = new PlaylistService();
    res = mockResponse();
  });

  describe("downloadPlaylist", () => {
    it("should return 400 if no URL is provided", async () => {
      await service.downloadPlaylist(null, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid or missing URL.");
    });

    it("should return 400 if URL is a video", async () => {
      await service.downloadPlaylist("https://youtube.com/watch?v=abc", res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(PlaylistService.ERR_IS_VIDEO);
    });

    // it("should return 400 if the YouTube playlist is empty", async () => {
    //   await service.downloadPlaylist(
    //     "https://youtube.com/playlist?list=abc",
    //     res
    //   );
    //   expect(res.status).toHaveBeenCalledWith(400);
    //   expect(res.send).toHaveBeenCalledWith(
    //     "The playlist is empty or an error has occurred"
    //   );
    // });

    // it("should return 400 if the SoundCloud playlist is empty", async () => {
    //   await service.downloadPlaylist(
    //     "https://soundcloud.com/user/sets/playlist",
    //     res
    //   );
    //   expect(res.status).toHaveBeenCalledWith(400);
    //   expect(res.send).toHaveBeenCalledWith(
    //     "The playlist is empty or an error has occurred"
    //   );
    // });
  });
});
