import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { AI_API_URL } from './constants';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private http: HttpClient) { }

  public getAllInformation() {
    const url = Location.joinWithSlash(AI_API_URL, "/api/v1/information/all")
    return this.http.get(url);
  }

  public generateMusic(options: any) {
    const url = Location.joinWithSlash(AI_API_URL, "/api/v1/generate");
    return this.http.post(url, options, {responseType: 'text'});
  }
}
