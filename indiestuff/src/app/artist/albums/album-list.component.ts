import { Component, OnInit, Input } from '@angular/core';
import { AlbumLite } from '@src/app/music-types/types';

@Component({
    selector: 'app-artist-albums',
    templateUrl: './album-list.component.html',
    styleUrls: ['./album-list.component.css']
})
export class AlbumListComponent implements OnInit {
    @Input() albums: AlbumLite[];

    constructor() {}

    ngOnInit() {}
}
