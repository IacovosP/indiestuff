import {Component, Injectable,Input,Output,EventEmitter} from "@angular/core";

@Injectable()
export class SharedService {
  @Output() fire: EventEmitter<any> = new EventEmitter();

   constructor() {
     console.log('shared service started');
   }

   change(value: any) {
    console.log('change started');
     this.fire.emit(value);
   }

   getEmittedValue() {
     return this.fire;
   }

}
