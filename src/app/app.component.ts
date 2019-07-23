import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { API_BASE_URL } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(){

  }

  ngOnInit() {
    
  }
}
