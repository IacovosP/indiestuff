import {
  Component,
  Injectable,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

export interface PlayerChangeEvent {
  indexOfTrackToPlay: number;
  trackListId: string;
}
export class PlayerEventEmitter {
  @Output() fire: EventEmitter<any> = new EventEmitter();

  constructor() {
    console.log("player shared service started");
  }

  change(value: PlayerChangeEvent) {
    console.log("player change started " + value);
    this.fire.emit(value);
  }

  getEmittedValue() {
    console.log("this emitted value " + this.fire);
    return this.fire;
  }
}

const playerEventEmitter = new PlayerEventEmitter();
export default playerEventEmitter;
