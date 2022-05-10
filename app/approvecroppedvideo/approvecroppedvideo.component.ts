import { Component, OnInit } from '@angular/core';
import { VideoplayerService } from 'src/shared/videoplayer.service';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { CropvideoService } from '../cropvideo/cropvideo.service';

@Component({
  selector: 'app-approvecroppedvideo',
  templateUrl: './approvecroppedvideo.component.html',
  styleUrls: ['./approvecroppedvideo.component.css']
})
export class ApprovecroppedvideoComponent implements OnInit {

  constructor(private _router:Router,private _cropvideoService: CropvideoService, private _videoplayerService: VideoplayerService) { }
  Overlaystyle: string = "none";
  divApprove = false;
  ngOnInit() {
    this.Overlaystyle = 'block';
    this.getPreviewImages();
    this.Overlaystyle = 'none';
  }
  getPreviewImages() {

    this._cropvideoService.GetImages(localStorage.getItem("uploadedfile"), "2").subscribe(
      imageslist => {
        if (imageslist !== undefined || imageslist !== null) {
          this.divApprove = true;
          this._videoplayerService.processVideo(imageslist,false);
          $('#divplay').trigger('click');

        }
        else {
          // this.Overlaystyle = 'none';
        }
      }//get error

    )
  }
  approve() {
    this._router.navigate(['guideframe']);
    
  }
  cancel() { 
    this._router.navigate(['cropvideo']);
  }
}
