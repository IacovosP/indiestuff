import { AlbumPageComponent } from "../album-page.component";
import { ActivatedRoute } from "@angular/router";
import httpClient from "@src/app/network/HttpClient";
import {  of } from "rxjs";

jasmine.getEnv().allowRespy(true);

describe('AlbumPageComponent', () => {
    let route;
    let albumResponse = Promise.resolve({
        title: "someAlbum",
        durationInSeconds: 100,
        tracks: [{
            name: "someTrack"
        }],
        album_image_filename: "someImage.com"

    });
    let getAlbumPromise;

    beforeEach(() => {
        getAlbumPromise = spyOn(httpClient, "fetch");
        route = new ActivatedRoute();
        route.params = of({id:"testId"});
        route.snapshot = {params: {id:"testId"}};
    });

    afterEach(() => {
        getAlbumPromise.calls.reset();
    });

    it('should fetch album when initialised', async () => {
        getAlbumPromise.and.returnValue(albumResponse);
        const comp = new AlbumPageComponent(route);
        comp.ngOnInit();
        await getAlbumPromise;
        expect(comp.album as any).toEqual({
            tracks: [{
                name: "someTrack",
                fileName: undefined,
                albumName: 'someAlbum',
                durationInSec: undefined
            }],
            imageUrl: "https://indie-image-test.s3.eu-west-2.amazonaws.com/someImage.com",
            title: "someAlbum",
            durationInSeconds: 100,
            album_image_filename: "someImage.com"
        });
        //   comp.clicked();
        //   expect(comp.isOn).toBe(true, 'on after click');
        //   comp.clicked();
        //   expect(comp.isOn).toBe(false, 'off after second click');
    });

    it('should log error when fetch rejects on initialisation', async () => {
        spyOn(httpClient, "fetch").and.rejectWith(new Error("Error"));
        const consoleSpy = spyOn(console, "error");
        const comp = new AlbumPageComponent(route);
        comp.ngOnInit();
        await flushPromise();
        expect(comp.album).not.toBeDefined();
        expect(consoleSpy).toHaveBeenCalledWith("error in getting album: Error: Error");
    });
  });

  async function flushPromise() {
    await Promise.resolve();
    await Promise.resolve();
  }