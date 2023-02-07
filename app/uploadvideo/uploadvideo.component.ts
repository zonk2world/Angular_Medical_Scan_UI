import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { UploadvideoService } from "./uploadvideo.service";
import { HttpClient, HttpEventType, HttpResponse } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { MediscanConstants } from "../../shared/mediscan-constants";
import { VideoplayerService } from "src/shared/videoplayer.service";
import * as $ from "jquery";
import { Router } from "@angular/router";

@Component({
  selector: "app-uploadvideo",
  templateUrl: "./uploadvideo.component.html",
  styleUrls: ["./uploadvideo.component.css"],
})
export class UploadvideoComponent implements OnInit {
  temppath = environment.temppath;
  objvideosNamelist: any;
  objvideosPathlist: any;
  progress: number;
  Iscustomplayer: boolean = false;
  message: string;
  prevideoUrl: string = "";
  IsUploadDivactive = true;
  hdnvideos: any;
  submitcntrl: any;
  classuploadmsg: string;
  IsValid: boolean = false;
  Overlaystyle: string = "none";

  constructor(
    private router: Router,
    private _upload: UploadvideoService,
    private _videoplayerService: VideoplayerService,
    private _http: HttpClient
  ) {}
  element: HTMLElement;

  ngOnInit() {
    this.Overlaystyle = "none";
    this.IsValid = false;
    localStorage.setItem("uploadedfile", null);
    localStorage.setItem("result", null);
    // this.IsUploadDivactive = false;
    // this.classuploadmsg = MediscanConstants.ClassError;
    //   this.message = MediscanConstants.MsgPleaseSelectRightformat;
  }
  guide() {
    this.router.navigate(["guideframe"]);
  }

  previewvideo(file, ipath) {
    this.Overlaystyle = "block";
    if (ipath == MediscanConstants.ipathtemp) {
      if (!this.isValidatefromfile(file)) {
        return;
      }
    } else {
      this.classuploadmsg = MediscanConstants.ClassError;
      this.message = MediscanConstants.MsgPleaseSelectRightformat;
    }

    this.message = "";
    this.hdnvideos = file;

    this.IsUploadDivactive = false;
    this.Iscustomplayer = true;
    this._upload.upload(file, ipath).subscribe(
      (event) => {
        if (event.type == HttpEventType.UploadProgress) {
          const percentDone = Math.round((100 * event.loaded) / event.total);
          this.progress = percentDone;
          this.classuploadmsg = MediscanConstants.ClassSuccess;
          if (ipath == MediscanConstants.ipathtemp) {
            this.message = MediscanConstants.MsgWaitforpreviewmsg;
          }
        } else if (event instanceof HttpResponse) {
          if (ipath == MediscanConstants.ipathtemp) {
            this.IsUploadDivactive = false;
            localStorage.setItem(
              "uploadedfile",
              event.body[0].name.split(".")[0]
            );

            // this._videoplayerService.processVideo(event.body,false);
            // $('#divplay').trigger('click');
            // this.submitcntrl = true;
            // this.classuploadmsg = MediscanConstants.ClassSuccess;
            // this.message = MediscanConstants.MsgFilereadyforprocess;
            this.videoSubmission(this.hdnvideos, "1");
            this.Overlaystyle = "none";
          }
        }
      },
      (err) => {
        this.classuploadmsg = MediscanConstants.ClassError;
        this.message = MediscanConstants.MsgUploadError;
        this.Overlaystyle = "none";
      }
    );
  }
  videoSubmission(file, ipath) {
    this.IsUploadDivactive = true;
    this.Iscustomplayer = false;
    this.message = "";
    this.objvideosNamelist = false;
    this.submitcntrl = false;

    this.classuploadmsg = MediscanConstants.ClassSuccess;
    localStorage.getItem("uploadedfile");
    this.objvideosNamelist = false;
    this.submitcntrl = false;
    this.IsUploadDivactive = true;

    this.message = MediscanConstants.MsgFileuploadedSuccessfully;
    this.router.navigate(["cropvideo"]);
  }

  isValidatefromEvent(event) {
    let isVideoOk = false;
    if (event !== undefined && event !== null) {
      if (event.target.files.length > 0) {
        var mimetype = event.target.files[0].type;
        if (
          mimetype != MediscanConstants.mimeavi &&
          mimetype != MediscanConstants.mimemp4 &&
          mimetype != MediscanConstants.mimemj2 &&
          event.target.files[0].name.split(".")[1] !=
            MediscanConstants.extmj2 &&
          event.target.files[0].name.split(".")[1] !=
            MediscanConstants.extavi &&
          event.target.files[0].name.split(".")[1] != MediscanConstants.extmp4
        ) {
          this.classuploadmsg = MediscanConstants.ClassError;
          this.message = MediscanConstants.MsgPleaseSelectRightformat;
        } else {
          this.message = "";
          isVideoOk = true;
        }
      }
    }
    return isVideoOk;
  }
  isValidatefromfile(file) {
    let isVideoOk = false;
    if (file.length > 0) {
      if (
        file[0].name.split(".")[1] != MediscanConstants.extavi &&
        file[0].name.split(".")[1] != MediscanConstants.extmj2 &&
        file[0].name.split(".")[1] != MediscanConstants.extmp4
      ) {
        this.classuploadmsg = MediscanConstants.ClassError;
        this.message = MediscanConstants.MsgPleaseSelectRightformat;
      } else {
        isVideoOk = true;
      }
    } else {
      this.message = MediscanConstants.MsgPleaseSelectRightformat;
    }
    return isVideoOk;
  }

  reset() {
    //
    this.IsUploadDivactive = true;
    this.objvideosNamelist = null;
    this.message = "";
    this.Iscustomplayer = false;
    localStorage.setItem("uploadedfile", null);
    localStorage.setItem("result", null);
    this.submitcntrl = false;
  }
  renderMp4(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = (event) => {
      this.objvideosNamelist = reader.result;
      this.IsUploadDivactive = false;
      this.submitcntrl = true;
    };
  }

  /* TODO 
  
  // previewVideo(fileName) {

  //   this._upload.getVideos(fileName).subscribe(
  //     videoslist => {
  //       if (videoslist !== undefined || videoslist !== null) {
  //         this.objvideosNamelist = videoslist.Value[0].VideoName;

  //       }
  //       else {
  //       }
  //     }
  //   )
  // }
  resetall() {
    this._upload.resetVideo(localStorage.getItem("uploadedfile")).subscribe(
      event => {
        if (event.type == HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * event.loaded / event.total);
          this.progress = percentDone;
        }
        else if (event instanceof HttpResponse) {
          this.IsUploadDivactive = true;
          this.objvideosNamelist = null;
          this.classuploadmsg = MediscanConstants.ClassSuccess;         
        }
      },
      (err) => {
        this.classuploadmsg = MediscanConstants.ClassError;;
        this.message =MediscanConstants.MsgResetError ;
      }
    );
  }
   */
  // convertavitomp4() {
  //   //var ffmpeg = require('ffmpeg');

  //   try {
  //     new ffmpeg('D:/drop.avi', function (err, video) {
  //       if (!err) {
  //         console.log('The video is ready to be processed');
  //       } else {
  //         console.log('Error: ' + err);
  //       }
  //     });
  //   } catch (e) {
  //     console.log(e.code);
  //     console.log(e.msg);
  //   }
  // }
}
