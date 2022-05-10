import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { VideodownloadService } from '../videodownload/videodownload.service';
import { MediscanConstants } from '../../shared/mediscan-constants';
import { VideoplayerService } from 'src/shared/videoplayer.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-videodownload',
  templateUrl: './videodownload.component.html',
  styleUrls: ['./videodownload.component.css']
})
export class VideodownloadComponent implements OnInit {
  titltevideoPreview = MediscanConstants.titltevideoPreview;

  interval: any;
  videobytes: any; filename: any; divDesc: boolean = false
  message: any; isPreviewbtn = false; fileUrl;
  progress: number = 5; logdata: string = "";
  Isprgbar = false;
  constructor(private _videodownload: VideodownloadService, private sanitizer: DomSanitizer,
    private _videoplayerService: VideoplayerService, ) { }

  ngOnInit() {
    //localStorage.setItem("uploadedfile","0_96e72");
    this.showlog();
   // this.previewVideo();
    this.startFetchingrprocess();
    if (localStorage.getItem("uploadedfile") != "null") {
      this.message = MediscanConstants.MainProcessOperating;


    }
    else { this.message = MediscanConstants.MsgPleaseUploadfile; }
  }
  showlog() {
    
    this._videodownload.showlog(localStorage.getItem("uploadedfile")).subscribe(
      data => {
        if (data !== undefined || data !== null) {
          this.logdata = data;

          this.Isprgbar = true;
          this.progress = data!="File Name Does Not Exist!!!"? parseInt(data) == 100 ? 95 : parseInt(data):5;

        }
      },
      (err) => {

      }
    );
  }
  startFetchingrprocess() {
    this.Isprgbar = true;
    this.interval = setInterval(() => {

      if (this.progress != 95) {
        //this.progress += 2;
        this.message = MediscanConstants.MainProcessOperating;

        this.showlog();
      } else {
        
        this.message="";
        this.previewVideo();
        this.message = "";
        this.isPreviewbtn = false;
        clearInterval(this.interval);
        this.Isprgbar=false;
      }
    }, 30000);


  }

  pauseFetchingProcess() {
    this.progress = 1;
    clearInterval(this.interval);
    this.startFetchingrprocess();
  }

  previewVideo() {
    this.progress = 100;
    
    clearInterval(this.interval);
    let foldername = localStorage.getItem("uploadedfile");
    
    this._videodownload.getVideos(foldername).subscribe(
      videoslist => {
        
        if (videoslist !== undefined || videoslist !== null) {
          if (2 < videoslist.length) {
            this.divDesc = true;
            clearInterval(this.interval);
            this.Isprgbar = false;
           
            this._videoplayerService.processVideo(videoslist,true);
            
            $('#divplay').trigger('click');
            
          
           
            this.message = "";
            this.isPreviewbtn = false;
            clearInterval(this.interval);
            this.Isprgbar = false;
          } else {
            this.message = MediscanConstants.MsgProcessfilenotready;
            this.isPreviewbtn = true;
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
