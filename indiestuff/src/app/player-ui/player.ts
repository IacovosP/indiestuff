// /*!
//  *  Howler.js Audio Player Demo
//  *  howlerjs.com
//  *
//  *  (c) 2013-2020, James Simpson of GoldFire Studios
//  *  goldfirestudios.com
//  *
//  *  MIT License
//  */
import { Howl, Howler } from "howler";
import { Playlist, Track } from "@src/app/music-types/types";
import playerEventEmitter from "./playerEmitter";
import httpClient from "../network/HttpClient";

export enum LoopState {
  "DEFAULT",
  "LOOP_PLAYLIST",
  "LOOP_TRACK",
}
class Player {
  private playlist;
  private currentlyPlayingIndex: number;
  private currentlyPlayingSound: any;
  public elapsedTimeInPercentage: number = 0; // 0-100
  public elapsedTimeInSeconds: number = 0;
  private playerClock: any; // interval
  private loopState: LoopState = LoopState.DEFAULT;
  private currentVolume: number = 0.5;
  private trackListId: string;
  private actualPlayedTimeOfCurrentTrackInSeconds: number = 0;
  private shouldReportEvent = true;

  constructor() {
    Howler.volume(this.currentVolume);
    this.startPlayerTimerLoop();
  }

  public setTrackListId(trackListId: string) {
    this.trackListId = trackListId;
  }

  private startPlayerTimerLoop() {
    this.playerClock = setInterval(() => {
      if (this.currentlyPlayingSound) {
        const currentTrackTime = this.currentlyPlayingSound.seek();
        if (typeof currentTrackTime === "number") {
          if (this.currentlyPlayingSound.playing()) {
            this.actualPlayedTimeOfCurrentTrackInSeconds += 0.01;
            if (
              this.actualPlayedTimeOfCurrentTrackInSeconds > 30 &&
              this.shouldReportEvent
            ) {
              this.reportEvent();
            }
          }
          this.elapsedTimeInPercentage =
            (currentTrackTime / player.getDurationOfSong()) * 100;
          this.elapsedTimeInSeconds = currentTrackTime;
        }
      }
    }, 10);
  }

  private reportEvent() {
    this.shouldReportEvent = false;
    if (this.playlist[this.currentlyPlayingIndex].isPlaylistView) {
      return;
    }
    httpClient.fetch(
      "event/add",
      JSON.stringify({
        trackId: this.playlist[this.currentlyPlayingIndex].id,
        artistId: this.playlist[this.currentlyPlayingIndex].artistId,
        albumId: this.playlist[this.currentlyPlayingIndex].albumId,
      }),
      "POST"
    );
  }

  public setPlaylist(playlist: Playlist, indexOfTrackToPlay: number = 0) {
    if (
      this.playlist &&
      this.currentlyPlayingIndex >= 0 &&
      this.playlist[this.currentlyPlayingIndex] &&
      this.playlist[this.currentlyPlayingIndex].howl
    ) {
      this.playlist[this.currentlyPlayingIndex].howl.stop();
    }

    this.playlist = playlist;
    this.currentlyPlayingIndex = indexOfTrackToPlay;
  }

  public getCurrentTrack() {
    if (this.currentlyPlayingIndex >= 0) {
      return this.playlist[this.currentlyPlayingIndex];
    }
    return "";
  }

  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  public play(indexOfTrackToPlay: number) {
    const data = this.playlist[indexOfTrackToPlay];
    const self = this;
    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      this.currentlyPlayingSound = data.howl;
    } else {
      this.currentlyPlayingSound = data.howl = new Howl({
        src: [
          `https://indie-music-test.s3.eu-west-2.amazonaws.com/${data.filename}`,
        ],
        html5: true,
        format: "mp3",
        volume: 0.5,
        onloaderror: function (error) {
          console.log("Error!", error);
        },
        onplay: function () {},
        onseek: function () {},
        onload: function () {
          data.howl.volume(self.currentVolume);
          self.actualPlayedTimeOfCurrentTrackInSeconds = 0;
          self.shouldReportEvent = true;
          console.log("loaded " + data.howl.duration());
        },
        onend: function () {
          console.log("Finished!");
          if (self.currentlyPlayingIndex === self.playlist.length - 1) {
            self.pause();
          } else if (
            self.loopState === LoopState.DEFAULT ||
            self.loopState === LoopState.LOOP_PLAYLIST
          ) {
            self.skip("next");
          } else if (self.loopState === LoopState.LOOP_TRACK) {
            self.playTrack();
          }
        },
        onpause: function () {},
        onstop: function () {},
      });
    }

    playerEventEmitter.change({
      indexOfTrackToPlay,
      trackListId: this.trackListId,
    });
    this.currentlyPlayingSound.play();

    // Keep track of the index we are currently playing.
    this.currentlyPlayingIndex = indexOfTrackToPlay;
  }

  public playTrack(indexOfTrackToPlay: number = this.currentlyPlayingIndex) {
    // Stop the current track.
    if (this.playlist[this.currentlyPlayingIndex].howl) {
      this.playlist[this.currentlyPlayingIndex].howl.stop();
    }

    this.currentlyPlayingSound = this.playlist[indexOfTrackToPlay].howl;

    this.currentlyPlayingSound.play();
  }

  // play after pause
  public restart() {
    this.currentlyPlayingSound = this.playlist[this.currentlyPlayingIndex].howl;
    playerEventEmitter.change({
      indexOfTrackToPlay: this.currentlyPlayingIndex,
      trackListId: this.trackListId,
    });

    this.currentlyPlayingSound.play();
  }

  public pause() {
    this.currentlyPlayingSound = this.playlist[this.currentlyPlayingIndex].howl;

    this.currentlyPlayingSound.pause();
    playerEventEmitter.change({
      indexOfTrackToPlay: this.currentlyPlayingIndex,
      trackListId: this.trackListId,
    });
  }

  /**
   * Seek to a new position in the currently playing track.
   * @param  {Number} per Percentage through the song to skip.
   */
  public seek(per: number) {
    // Get the Howl we want to manipulate.
    // Convert the percent into a seek position.
    if (this.currentlyPlayingSound) {
      this.currentlyPlayingSound.seek(
        this.currentlyPlayingSound.duration() * per
      );
    }
  }

  public getDurationOfSong() {
    return this.currentlyPlayingSound.duration();
  }

  public isPlayerPlaying() {
    if (this.currentlyPlayingSound) {
      return this.currentlyPlayingSound.playing();
    }
  }

  public toggleLoop(): LoopState {
    this.loopState = this.loopState < 2 ? this.loopState + 1 : 0;
    return this.loopState;
  }

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  public skip(direction: "next" | "prev") {
    // Get the next track based on the direction of the track.
    let index = 0;
    if (direction === "prev") {
      index = this.currentlyPlayingIndex && this.currentlyPlayingIndex - 1;
      if (index < 0) {
        index = this.playlist && this.playlist.length - 1;
      }
    } else {
      index = this.currentlyPlayingIndex + 1;
      if (this.playlist && index >= this.playlist.length) {
        index = 0;
      }
    }

    this.skipTo(index);
  }

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  private skipTo(index) {
    // Stop the current track.
    if (this.playlist[this.currentlyPlayingIndex].howl) {
      this.playlist[this.currentlyPlayingIndex].howl.stop();
    }
    // Play the new track.
    this.play(index);
  }
  /**
   * Set the volume and update the volume slider display.
   * @param  {Number} val Volume between 0 and 1.
   */
  public volume(value: number) {
    console.log("value: " + value);
    this.currentVolume = value;
    // Update the global volume (affecting all Howls).
    Howler.volume(value);
  }
}

const player = new Player();
export default player;

// export var Player = function(playlist) {
//   console.error("playlist: "+ JSON.stringify(playlist, null ,4));
//   this.playlist = playlist;
//   this.index = 0;
//
//   // Display the title of the first track.
//   // track.innerHTML = '1. ' + playlist[0].title;
//   //
//   // // Setup the playlist display.
//   // playlist.forEach(function(song) {
//   //   var div = document.createElement('div');
//   //   div.className = 'list-song';
//   //   div.innerHTML = song.title;
//   //   div.onclick = function() {
//   //     player.skipTo(playlist.indexOf(song));
//   //   };
//   //   list.appendChild(div);
//   // });
// };
// Player.prototype = {
//   /**
//    * Play a song in the playlist.
//    * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
//    */
//
//
//
//   /**
//    * The step called within requestAnimationFrame to update the playback position.
//    */
//   step: function() {
//     var self = this;
//
//     // Get the Howl we want to manipulate.
//     var sound = self.playlist[self.index].howl;
//
//     // Determine our current seek position.
//     var seek = sound.seek() || 0;
//     timer.innerHTML = self.formatTime(Math.round(seek));
//     progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';
//
//     // If the sound is still playing, continue stepping.
//     if (sound.playing()) {
//       requestAnimationFrame(self.step.bind(self));
//     }
//   },
//
//   /**
//    * Toggle the playlist display on/off.
//    */
//   togglePlaylist: function() {
//     var self = this;
//     var display = (playlist.style.display === 'block') ? 'none' : 'block';
//
//     setTimeout(function() {
//       playlist.style.display = display;
//     }, (display === 'block') ? 0 : 500);
//     playlist.className = (display === 'block') ? 'fadein' : 'fadeout';
//   },
//
//   /**
//    * Toggle the volume display on/off.
//    */
//   toggleVolume: function() {
//     var self = this;
//     var display = (volume.style.display === 'block') ? 'none' : 'block';
//
//     setTimeout(function() {
//       volume.style.display = display;
//     }, (display === 'block') ? 0 : 500);
//     volume.className = (display === 'block') ? 'fadein' : 'fadeout';
//   },
//
//   /**
//    * Format the time from seconds to M:SS.
//    * @param  {Number} secs Seconds to format.
//    * @return {String}      Formatted time.
//    */

// };
//
// // Setup our new audio player class and pass it the playlist.
// var player = new Player([
//   {
//     title: 'Rave Digger',
//     file: 'rave_digger',
//     howl: null
//   },
//   {
//     title: '80s Vibe',
//     file: '80s_vibe',
//     howl: null
//   },
//   {
//     title: 'Running Out',
//     file: 'running_out',
//     howl: null
//   }
// ]);
//
// // Bind our player controls.
// // playBtn.addEventListener('click', function() {
// //   player.play();
// // });
// // // pauseBtn.addEventListener('click', function() {
// // //   player.pause();
// // // });
// // prevBtn.addEventListener('click', function() {
// //   player.skip('prev');
// // });
// // nextBtn.addEventListener('click', function() {
// //   player.skip('next');
// // });
// // playlistBtn.addEventListener('click', function() {
// //   player.togglePlaylist();
// // });
// // playlist.addEventListener('click', function() {
// //   player.togglePlaylist();
// // });
// // volumeBtn.addEventListener('click', function() {
// //   player.toggleVolume();
// // });
// // volume.addEventListener('click', function() {
// //   player.toggleVolume();
// // });
//
// // Setup the event listeners to enable dragging of volume slider.
// // barEmpty.addEventListener('click', function(event) {
// //   var per = event.layerX / parseFloat(barEmpty.scrollWidth);
// //   player.volume(per);
// // });
// // sliderBtn.addEventListener('mousedown', function() {
// //   window.sliderDown = true;
// // });
// // sliderBtn.addEventListener('touchstart', function() {
// //   window.sliderDown = true;
// // });
// // volume.addEventListener('mouseup', function() {
// //   window.sliderDown = false;
// // });
// // volume.addEventListener('touchend', function() {
// //   window.sliderDown = false;
// // });
//
// // var move = function(event) {
// //   if (window.sliderDown) {
// //     var x = event.clientX || event.touches[0].clientX;
// //     var startX = window.innerWidth * 0.05;
// //     var layerX = x - startX;
// //     var per = Math.min(1, Math.max(0, layerX / parseFloat(barEmpty.scrollWidth)));
// //     player.volume(per);
// //   }
// // };
//
// // volume.addEventListener('mousemove', move);
// // volume.addEventListener('touchmove', move);
