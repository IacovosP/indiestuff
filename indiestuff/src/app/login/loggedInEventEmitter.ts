import { Injectable, Output, EventEmitter } from "@angular/core";

@Injectable()
export class AuthStateEventEmitter {
  @Output() fire: EventEmitter<any> = new EventEmitter();

  constructor() {
    console.log("AuthStateEventEmitter started");
  }

  change(value: any) {
    console.log("change started");
    this.fire.emit(value);
  }

  getEmittedValue() {
    return this.fire;
  }
}
