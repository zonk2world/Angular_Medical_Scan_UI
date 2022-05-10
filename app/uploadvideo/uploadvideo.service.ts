import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadvideoService {
  public progress: number;
  public message: string;
  private baseUrl: string = environment.baseUrl;
  constructor(private _http: HttpClient) {

  }

  upload(files,ipath): Observable<any> {
    

    const formData = new FormData();

    for (let file of files)
      formData.append('files', file);
      formData.append('ipath', ipath);

    const uploadReq = new HttpRequest('POST', this.baseUrl + 'api/UploadDownloadFiles/UploadVideos', formData, {
      reportProgress: true,
    });

    return this._http.request(uploadReq);
  }
  getVideos(fileName): Observable<any> {
    const formData = new FormData();    
    formData.append('getvideo', fileName);     
    const httpOption = {
      headers: new HttpHeaders({
       'Content-Type': 'application/json',
      
      })
    }
    return this._http.post(this.baseUrl + 'api/UploadDownloadFiles/GetVideos',formData);
 
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
