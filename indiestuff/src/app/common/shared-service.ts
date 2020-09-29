import {
  Component,
  Injectable,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { Track } from "@src/app/music-types/types";

@Injectable()
export class SharedService {
  @Output() fire: EventEmitter<any> = new EventEmitter();
  @Output() firePause: EventEmitter<any> = new EventEmitter();
  @Output() fireRestart: EventEmitter<any> = new EventEmitter();

  constructor() {
    console.log("shared service started");
  }

  change(value: {tracks: any[]; indexOfSongToPlay: number; trackListId: string; isAlbumView?: boolean, isArtistView?: boolean}) {
    console.log("change started");
    this.fire.emit(value);
  }

  pause() {
    console.log("paused event");
    this.firePause.emit();
  }

  restart() {
    console.log("restart event");
    this.fireRestart.emit();
  }

  getEmittedValue() {
    return this.fire;
  }

  getEmittedPause() {
    return this.firePause;
  }

  getEmittedRestart() {
    return this.fireRestart;
  }
}
