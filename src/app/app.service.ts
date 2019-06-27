import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { API_BASE_URL } from './constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  public getMidiFiles(): any {
    const path = Location.joinWithSlash(API_BASE_URL, '/api/midi/files');
    return this.http.get(path);
  };

  public getMidiFile(filename: string): any {
    const path = Location.joinWithSlash(API_BASE_URL, `/tracks/${filename}`);
    return this.http.get(path, { responseType: 'text' });
  }


}
