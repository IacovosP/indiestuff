import {
  Component,
  Injectable,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Injectable()
export class SharedService {
  @Output() fire: EventEmitter<any> = new EventEmitter();
  @Output() firePause: EventEmitter<any> = new EventEmitter();
  @Output() fireRestart: EventEmitter<any> = new EventEmitter();

  constructor() {
    console.log("shared service started");
  }

  change(value: any) {
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
