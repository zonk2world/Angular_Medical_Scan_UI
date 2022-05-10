import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment.prod';
import { Observable, pipe } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VideodownloadService {
  public progress: number;
  public message: string;
  private baseUrl: string = environment.baseUrl;  
  constructor(private _http: HttpClient) {
  }

  showlog(filespath): Observable<any> {
    

    const formData = new FormData();
    
      formData.append('logFiles', filespath);   

    return this._http.post(this.baseUrl + 'api/MarkingBoundariesFiles/ReadLogFiles', formData);
  }
  getVideos(fileName): Observable<any> {
    const formData = new FormData();    
    formData.append('foldername', fileName);     
   
    return this._http.post(this.baseUrl + 'api/UploadDownloadFiles/GetFinalVideo',formData);
 
  }
  resetVideo(fileName): Observable<any> {
    const formData = new FormData();    
      formData.append('fileName', fileName);     
   
    const uploadReq = new HttpRequest('DELETE', this.baseUrl + 'api/UploadDownloadFiles/DeleteVideo', formData, {
      reportProgress: true,
    });
    return this._http.request(uploadReq);
 
  }
}
