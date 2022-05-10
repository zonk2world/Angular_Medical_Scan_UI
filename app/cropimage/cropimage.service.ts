import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class CropimageService {
  private baseUrl = environment.baseUrl;
  constructor(private _http: HttpClient) {
    
  }

  getBoundriesPoints(Cords): Observable<any> {
    const formData = new FormData();
    formData.append('Cords', Cords);


    return this._http.post(this.baseUrl + 'api/MarkingBoundariesFiles/ReadCordinates', formData);

  }
  getSelectedFramebytes(frameIndex, foldername): Observable<any> {    
    
    const formData = new FormData();
    
    for (let i = 0; i < frameIndex.length; i++) {
      formData.append('getImagesIndex', frameIndex[i].getindeximages);
    }
    formData.append('folderName', foldername);
    return this._http.post(this.baseUrl + `api/MarkingBoundariesFiles/GetImagesIndex`, formData);

  }
  submitBoundriesNframes(getframes,boundaries, foldername): Observable<any> {

    const formData = new FormData(); 
    for (let i = 0; i < getframes.length; i++) {
      formData.append('getframes',getframes[i].getindeximages);
    }
    
    for (let i = 0; i < boundaries.length; i++) {
      formData.append('boundaries',JSON.stringify(boundaries[i]));
    }
    formData.append('foldername', foldername);

    const httpOption = {
      headers: new HttpHeaders({
       'Content-Type': 'application/x-www-form-urlencoded',
       'Accept': 'application/json',
      })
    }

    return this._http.post(this.baseUrl + 'api/MarkingBoundariesFiles/CreateboundaryFile',formData);

  }
}
