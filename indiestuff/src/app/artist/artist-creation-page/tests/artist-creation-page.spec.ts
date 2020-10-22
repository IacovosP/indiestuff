import { ArtistCreationPageComponent } from "../artist-creation-page.component";
import { MatDialogModule } from "@angular/material/dialog";
import { TestBed, async } from "@angular/core/testing";
import { of } from "rxjs";
import { SharedService } from "@src/app/common/shared-service";
import playerEventEmitter from "@src/app/player-ui/playerEmitter";
import { TrackInterface } from "@apistuff";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";

describe("artist-creation-page", () => {
  let artistCreationPage: ArtistCreationPageComponent;
  let sharedService: SharedService;
  let dialogSpy: jasmine.Spy;
  let dialogRefSpyObj = jasmine.createSpyObj({
    afterClosed: of({}),
    close: null,
  });
  dialogRefSpyObj.componentInstance = { body: "" }; // attach componentInstance to the spy object...

  const mockTracks: TrackInterface[] = [
    {
      title: "someTrack",
      durationInSec: 20,
      filename: "someFileName",
      id: "someUid",
      positionInAlbum: 2,
    },
  ];
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [ArtistCreationPageComponent, SharedService],
    });
    artistCreationPage = TestBed.get(ArtistCreationPageComponent);
    sharedService = TestBed.get(SharedService);
    // dialogSpy = spyOn(TestBed.get(MatDialogModule), 'open').and.returnValue(dialogRefSpyObj);
  });
  describe("playSong", () => {
    beforeEach(() => {
      spyOn(sharedService, "change");
      spyOn(sharedService, "restart");
      spyOn(sharedService, "pause");
    });

    it("should call player shared service with change when play is selected ", () => {
      artistCreationPage.ngOnInit();
      expect(artistCreationPage).toBeDefined();

      (artistCreationPage as any).tracks = mockTracks;

      artistCreationPage.playSong(2);

      expect(sharedService.change).toHaveBeenCalledWith({
        tracks: mockTracks,
        indexOfSongToPlay: 2,
      });
    });

    it("should call restart when player isPaused and indexOfSongToPlay is the same as the current song index", () => {
      artistCreationPage.ngOnInit();
      expect(artistCreationPage).toBeDefined();

      (artistCreationPage as any).tracks = mockTracks;
      (artistCreationPage as any).isPaused = true;
      (artistCreationPage as any).indexOfSongPlaying = 2;

      artistCreationPage.playSong(2);

      expect(sharedService.restart).toHaveBeenCalled();
    });
  });

  describe("when playSharedService fires call changeIndexOfSongPlaying", () => {
    beforeEach(() => {
      artistCreationPage.ngOnInit();
      expect(artistCreationPage).toBeDefined();

      (artistCreationPage as any).isPaused = true;
      (artistCreationPage as any).indexOfSongPlaying = 2;
    });

    it("should change isPaused when song to play is already playing", () => {
      expect(artistCreationPage.isPaused).toBe(true);

      playerEventEmitter.change({
        indexOfTrackToPlay: 2,
        trackListId: "someId",
      });

      expect(artistCreationPage.isPaused).toBe(false);
    });

    it("should change isPaused when song to play is already playing", () => {
      (artistCreationPage as any).isPaused = false;
      expect(artistCreationPage.isPaused).toBe(false);

      playerEventEmitter.change({
        indexOfTrackToPlay: 2,
        trackListId: "someId",
      });

      expect(artistCreationPage.isPaused).toBe(true);
    });

    it("should set isPaused from true to false when song to play is different than the current", () => {
      (artistCreationPage as any).isPaused = true;
      expect(artistCreationPage.isPaused).toBe(true);

      playerEventEmitter.change({
        indexOfTrackToPlay: 3,
        trackListId: "someId",
      });

      expect(artistCreationPage.isPaused).toBe(false);
    });

    it("should set isPaused from false to false when song to play is different than the current", () => {
      (artistCreationPage as any).isPaused = false;
      expect(artistCreationPage.isPaused).toBe(false);

      playerEventEmitter.change({
        indexOfTrackToPlay: 3,
        trackListId: "someId",
      });

      expect(artistCreationPage.isPaused).toBe(false);
    });
  });

  describe("imageUpload", () => {
    let mockFetch;
    beforeEach(() => {
      mockFetch = spyOn(global, "fetch").and.callFake(() => {
        return Promise.resolve({}) as any;
      });
      spyOn(FileReader.prototype, "readAsDataURL").and.callFake(() => {});
    });

    it("should call fetch with formData", () => {
      artistCreationPage.ngOnInit();

      const file = new File([new ArrayBuffer(2e5)], "test-file.jpg", {
        lastModified: null,
        type: "image/jpeg",
      });
      const files = [file];
      (files as any).item = () => file;
      const event = {
        target: {
          files,
        },
      };

      artistCreationPage.imageUpload(event);

      const formData = new FormData();
      formData.append("myFile", file);

      const requestInit: RequestInit = {
        body: formData,
        method: "POST",
      };
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:5000/upload/image",
        requestInit
      );
    });
  });

  describe("onFormSubmit", () => {
    beforeEach(() => {
      spyOn(defaultHttpClient, "fetch").and.callFake(() => {
        return Promise.resolve();
      });
    });

    it("should call fetch with album value", () => {
      artistCreationPage.ngOnInit();
      const mockDate = new Date();
      artistCreationPage.newAlbum = {
        title: "someTitle",
        tracks: mockTracks,
        colour: "someColour",
        album_image_filename: "someFileName",
        releaseDate: mockDate,
        durationInSec: 100,
      };

      artistCreationPage.updateColor("newColour");
      artistCreationPage.onFormSubmit(
        { value: { title: "newTitle" }, valid: true },
        {} as Event
      );

      expect(defaultHttpClient.fetch).toHaveBeenCalledWith(
        "album/create",
        JSON.stringify({
          newAlbum: {
            title: "newTitle",
            tracks: mockTracks,
            colour: "newColour",
            album_image_filename: "someFileName",
            releaseDate: mockDate,
            durationInSec: 100,
          },
        }),
        "POST"
      );
    });
  });
});
