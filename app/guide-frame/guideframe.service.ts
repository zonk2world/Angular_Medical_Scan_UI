import { Injectable, Inject } from '@angular/core';
import { HttpHeaders, HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class GuideframeService {
  baseUrl: string = environment.baseUrl; 
  constructor(private _http: HttpClient) {

  }
  GetImages(foldername, pass): Observable<any> {

    const formData = new FormData();
    formData.append('imagefolder', foldername);
    formData.append('Pass', pass); 

    return this._http.post(this.baseUrl + 'api/GuidedFramesFiles/GetImages', formData);
   
  }
}
