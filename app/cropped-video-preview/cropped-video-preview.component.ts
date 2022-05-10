import { Component, OnInit } from '@angular/core';
import { MediscanConstants } from '../../shared/mediscan-constants';
import { VideoplayerService } from 'src/shared/videoplayer.service';
import { Router } from '@angular/router';

import * as $ from 'jquery';
import { CroppedVideoPreviewService } from './cropped-video-preview.service';

@Component({
  selector: 'app-cropped-video-preview',
  templateUrl: './cropped-video-preview.component.html',
  styleUrls: ['./cropped-video-preview.component.css']
})
export class CroppedVideoPreviewComponent implements OnInit {

  titltevideoPreview = MediscanConstants.titltevideoPreview;

  interval: any;
  videobytes: any; filename: any; divDesc: boolean = false
  message: any; isPreviewbtn = true; fileUrl;
  progress: number = 5; logdata: string = "";
  Isprgbar = false; Overlaystyle: string = "none";
  constructor(private router: Router, private _videodownload: CroppedVideoPreviewService,
    private _videoplayerService: VideoplayerService, ) { }

  ngOnInit() {
    this.Overlaystyle = 'block';
    this.previewVideo();

    if (localStorage.getItem("uploadedfile") != "null") {
      this.message = MediscanConstants.MsgFetchinFile;

      this.startFetchingrprocess();
    }
    else { this.message = MediscanConstants.MsgPleaseUploadfile; }

  }
  cancel() {
    this.router.navigate(['guideframe']);
  }
  approve() {
    this.Overlaystyle = 'block';

    this._videodownload.CreateOkfile(localStorage.getItem("uploadedfile")).subscribe(
      response => {
        if (response !== undefined || response !== null) {
          if (response == true)
            alert("File submitted successfully");
          this.router.navigate(['videodownload']);
        }
      }
    );
  }

  showlog() {
    this._videodownload.showlog("good.log").subscribe(
      data => {
        if (data !== undefined || data !== null) {
          this.logdata = data.Value;
        }
      },
      (err) => {

      }
    );
  }
  startFetchingrprocess() {
    this.Isprgbar = false;
    this.interval = setInterval(() => {

      if (this.progress != 100) {
        this.progress += 2;
        this.message = MediscanConstants.MsgFetchinFile;

        this.previewVideo();
      } else {
        this.progress = 0;

      }
    }, 10000);


  }

  pauseFetchingProcess() {
    this.progress = 1;
    clearInterval(this.interval);
    this.startFetchingrprocess();
  }

  previewVideo() {
    let foldername = localStorage.getItem("uploadedfile");

    this._videodownload.getVideos(foldername).subscribe(
      videoslist => {
        if (videoslist !== undefined || videoslist !== null) {
          if (2 < videoslist.length) {
            clearInterval(this.interval);
            this.Isprgbar = false;
            
            this._videoplayerService.processVideo(videoslist,false);
            $('#divplay').trigger('click');
            this.divDesc = true;

            this.Overlaystyle = 'none';
            this.message = "";
            this.isPreviewbtn = false;
            //this.Overlaystyle = 'none';

          } else {
            this.message = MediscanConstants.MsgProcessfilenotready;
            this.isPreviewbtn = true;
            //this.Overlaystyle = 'none';
          }

        }
        else {
        }
      }, error => {
        this.message = MediscanConstants.MsgProcessfilenotready;
        this.isPreviewbtn = true;
      })
  }

}