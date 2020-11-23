import { AlbumPageComponent } from "../album-page.component";
import { ActivatedRoute, Router, UrlSerializer } from "@angular/router";
import defaultHttpClient from "@src/app/network/DefaultHttpClient";
import { of } from "rxjs";

jasmine.getEnv().allowRespy(true);

describe("AlbumPageComponent", () => {
  let route;
  const albumResponse = Promise.resolve({
    id: "someAlbumId",
    title: "someAlbum",
    durationInSeconds: 100,
    tracks: [
      {
        title: "someTrack",
      },
    ],
    album_image_filename: "someImage.com",
    isSingle: false,
  });
  let getAlbumPromise;

  beforeEach(() => {
    getAlbumPromise = spyOn(defaultHttpClient, "fetch");
    route = new ActivatedRoute();
    route.params = of({ id: "testId" });
    route.snapshot = { params: { id: "testId" } };
  });

  afterEach(() => {
    getAlbumPromise.calls.reset();
  });

  it("should fetch album when initialised", async () => {
    getAlbumPromise.and.returnValue(albumResponse);
    const comp = new AlbumPageComponent(route);
    comp.ngOnInit();
    await getAlbumPromise;
    expect(getAlbumPromise).toHaveBeenCalledWith("album/testId");
    expect(comp.album as any).toEqual({
      tracks: [
        {
          title: "someTrack",
        },
      ],
      id: "someAlbumId",
      title: "someAlbum",
      durationInSeconds: 100,
      album_image_filename:
        "https://indie-image-test.s3.eu-west-2.amazonaws.com/someImage.com",
      isSingle: false,
    });
    //   comp.clicked();
    //   expect(comp.isOn).toBe(true, 'on after click');
    //   comp.clicked();
    //   expect(comp.isOn).toBe(false, 'off after second click');
  });

  it("should log error when fetch rejects on initialisation", async () => {
    spyOn(defaultHttpClient, "fetch").and.rejectWith(new Error("Error"));
    const consoleSpy = spyOn(console, "error");
    const comp = new AlbumPageComponent(route);
    comp.ngOnInit();
    await flushPromise();
    expect(comp.album).not.toBeDefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      "error in getting album: Error: Error"
    );
  });
});

async function flushPromise() {
  await Promise.resolve();
  await Promise.resolve();
}
