import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserstudiesService {
private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }
  UserStudies() :Observable<any>
  {
    debugger
    var body={      
      'ID':localStorage.getItem('ID')
    };
    return this.http.post(this.baseUrl + 'api/UploadDownloadFiles/UserStudies', body);
  }
  DownloadUploadedVideo(data) :Observable<any>
  {
    debugger
    var body={      
      'ID':localStorage.getItem('ID'),
      'videoName':data,
      'studyname':localStorage.getItem('studyname')   
    };
    return this.http.post(this.baseUrl + 'api/UploadDownloadFiles/DownloadUploadedVideo', body);
  }
  DownloadMainProcessVideo(data) :Observable<any>
  {
    debugger
    var body={      
      'ID':localStorage.getItem('ID'),
      'finalVideo':data
    };
    return this.http.post(this.baseUrl + 'api/UploadDownloadFiles/DownloadMainProcessVideo', body);
  }
}
