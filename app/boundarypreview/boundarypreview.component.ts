import { Component, ViewChild, ElementRef, OnInit, Input } from '@angular/core';

import { environment } from '../../environments/environment';
import { DragScrollComponent } from 'ngx-drag-scroll';

import { Router } from '@angular/router';
import { CropvideoService } from '../cropvideo/cropvideo.service';
import { DrawInterpolationService } from 'src/shared/draw-interpolation.service';
import { CropimageService } from '../cropimage/cropimage.service';
@Component({
  selector: 'app-boundarypreview',
  templateUrl: './boundarypreview.component.html',
  styleUrls: ['./boundarypreview.component.css']
})
export class BoundarypreviewComponent implements OnInit {
  //
  imgW; imgH; diffInPer; redrawAgain = false; isPlus = true;
  //
  @Input() public width = 600;
  @Input() public height = 480;
  hideScrollbar; disabled; xDisabled; yDisabled; leftNavDisabled = false;
  rightNavDisabled = false; outpath = environment.outputfolderpath; firstimg: string
  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;
  @ViewChild('canvasEl') canvasEl: ElementRef;

  @ViewChild('ctrlimg') imageObj: ElementRef;
  outputfolerpath = environment.outputfolderpath;
  private context: CanvasRenderingContext2D;
  objcanvasimg = new Image();
  objimagesNamelist: any;


  public cords = [];
  IsCroped: Boolean = false;
  IsUndo: Boolean = false;
  xPoints: string;
  yPoints: string;
  pointCount: number = 0;
  fend = 1;


  on_frame: number = 0; end_frame: number = 0;
  ddStart: any = 1; ddEnd: any = 1;
  image = new Image();
  canvas: any;
  rect: any; Overlaystyle: string = "none";
  rangeValue: number = 10; frameList: any = [];
  frame_Title_Range_Index = 1; frameImageIndex = 0;
  FinalBoundriescords=[];
    constructor(private router: Router, private _downloadservice: CropvideoService, private element: ElementRef, private _drawInterpolationService: DrawInterpolationService, private _cropimageService: CropimageService) { }
  ngOnInit() {
    this.Overlaystyle = 'block';
    this.frameList = JSON.parse(sessionStorage.getItem("getindeximages"));

    const canvasEl: HTMLCanvasElement = this.canvasEl.nativeElement;
    this.context = canvasEl.getContext('2d');
    this.calcImageWH();

    this.getPreviewImages();
    // this.drawBaundries();
    this.Overlaystyle = 'none';

    canvasEl.width = this.width;
    canvasEl.height = this.height;
   
  }

  finalsubmit() {
    this.Overlaystyle = 'block';
    this.frameList = JSON.parse(sessionStorage.getItem("getindeximages"));
   
    for (let i = 0; i < this.frameList.length - 1; i++) {
     this._drawInterpolationService.connectDotsOverFrames(this.frameList[i].getindeximages, this.frameList[i + 1].getindeximages,'cord');
     
    }
    for (let i = 1; i <= this.frameList[this.frameList.length - 1].getindeximages; i++) {
      var bxy = sessionStorage.getItem('cord'+i.toString()).split(',');
     console.log(bxy);
     console.log(bxy.length);
     console.log(i)
      var TempBoundriescords=[];
      for(let ixy=0;ixy<bxy.length;ixy++)
      {
        
       
        TempBoundriescords.push(bxy[ixy]);
      }
      var boundriescords1 = {
        "boundaries":TempBoundriescords
     };
      
       this.FinalBoundriescords.push(boundriescords1);
    }
   // alert("File submitted successfully");
   //this.router.navigate(['videodownload']);
    this._cropimageService.submitBoundriesNframes(this.frameList, this.FinalBoundriescords, localStorage.getItem("uploadedfile")).subscribe(
      framelist => {
        if (framelist !== undefined || framelist !== null) {

          alert("File submitted successfully");
          this.router.navigate(['videodownload']);

        }
        else {

        }
      }//get error

    )
  }



  getPreviewImages() {

    this._downloadservice.GetImages(localStorage.getItem("uploadedfile"), "2").subscribe(
      imageslist => {
        if (imageslist !== undefined || imageslist !== null) {
          //this.drawBaundries();
          this.objimagesNamelist = imageslist;

          this.ddStart = 1;
          this.ddEnd = this.objimagesNamelist.length;
          this.frame_Title_Range_Index = 1;
          this.image.onload = () => {

            this.context.drawImage(this.image, 0, 0, this.width, this.height);

            this.drawBaundries(this.frame_Title_Range_Index);
            this.drawdots(this.frame_Title_Range_Index);
          }

          this.image.src = this.objimagesNamelist[0].fileInBytes;

          if (window.innerWidth < 450) {
            this.canvas.setZoom(0.6);
          }
          this.Overlaystyle = 'none';
        }
        else {
          this.Overlaystyle = 'none';
        }
      }//get error

    )
  }
  play() {
    this.frameImageIndex = 0;
    this.frame_Title_Range_Index = 1;


    var interval = setInterval(() => {

      if (this.frameImageIndex < parseInt(this.ddEnd)) {

        this.image.src = this.objimagesNamelist[this.frameImageIndex].fileInBytes;


        this.frameImageIndex++;
        if (this.frame_Title_Range_Index < this.ddEnd) { this.frame_Title_Range_Index++; }
        this.drawBaundries(this.frame_Title_Range_Index);
        this.drawdots(this.frame_Title_Range_Index);
        //this.context.globalCompositeOperation = "saurce-over";
      }
      else {
        clearInterval(interval);

      }
    }, 10);

  }

  drawBaundries(indx) {
    var bxy;

    bxy = sessionStorage.getItem((indx).toString()).toString().split(',');

    //this.context.setTransform(1, 0, 0, 1, 0, 0)
    //this.context.clearRect(0, 0, this.width, this.height)
    //this.context.globalCompositeOperation = "saurce-over";
    this.context.lineWidth = 3;
    this.context.lineCap = 'round';
    this.context.strokeStyle = 'yellow';
    this.context.setLineDash([2, 4]);
    this.context.beginPath();
    this.context.moveTo(bxy[0], bxy[1]);

    for (let i = 2; i < bxy.length - 2; i += 2) {
      this.context.lineTo(bxy[i], bxy[i + 1]);
      this.context.stroke();
    }

    this.context.lineTo(bxy[0], bxy[1]);
    this.context.stroke();



  }
  drawdots(frameImageIndex) {

    if (sessionStorage.getItem('points' + (frameImageIndex).toString()) !== null) {

      var dots = sessionStorage.getItem('points' + (frameImageIndex).toString()).toString().split(',');

      for (let i = 0; i < dots.length; i += 2) {
        //this.context.globalCompositeOperation = "destination-over";
        this.context.lineWidth = 1;
        this.context.lineCap = 'round';
        this.context.strokeStyle = 'red';
        this.context.fillStyle = "red"; //red
        this.context.beginPath();

        this.context.arc(parseFloat(dots[i]), parseFloat(dots[i + 1]), 5, 0, 2 * Math.PI);

        this.context.stroke();
        this.context.fill();
        //this.context.globalCompositeOperation = "saurce-over";

      }

    }

  }
  cancel() {
    this.router.navigate(['cropvideo']);
  }

  rangechange(index) {

    this.drawEvent(index);

  }
  gotoFrame(index) {
    this.drawEvent(index);
  }
  drawEvent(index) {
    this.image.src = this.objimagesNamelist[index - 1].fileInBytes;
    this.drawBaundries(index);
    this.drawdots(index);
    this.frame_Title_Range_Index = index;
    this.frameImageIndex = index - 1;
  }

  toggleHideSB() {
    this.hideScrollbar = !this.hideScrollbar;
  }

  toggleDisable() {
    this.disabled = !this.disabled;
  }
  toggleXDisable() {
    this.xDisabled = !this.xDisabled;
  }
  toggleYDisable() {
    this.yDisabled = !this.yDisabled;
  }

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

  leftBoundStat(reachesLeftBound: boolean) {
    this.leftNavDisabled = reachesLeftBound;
  }

  rightBoundStat(reachesRightBound: boolean) {
    this.rightNavDisabled = reachesRightBound;
  }

  onSnapAnimationFinished() {
  }

  onIndexChanged(idx) {
    this.frameImageIndex = idx;

  }

  onDragScrollInitialized() {

  }


  calcImageWH() {

    this.imgW = parseInt(sessionStorage.getItem("CanWidth"));
    this.imgH = parseInt(sessionStorage.getItem("CanHeight"));

    if (window.innerWidth >= 1366) {
      if (this.imgW <= 350) {

        this.diffInPer = (this.imgW / this.imgW) * 100;
        this.width = this.imgW + (this.imgW / 100) * this.diffInPer;
        this.height = this.imgH + (this.imgH / 100) * this.diffInPer;
        sessionStorage.setItem('diff', this.diffInPer);
        this.redrawAgain = true;

      }
      else if (this.imgW <= 400) {

        this.diffInPer = (this.imgW / this.imgW) * 20;
        this.width = this.imgW + (this.imgW / 100) * this.diffInPer;
        this.height = this.imgH + (this.imgH / 100) * this.diffInPer;
        sessionStorage.setItem('diff', this.diffInPer);
        this.redrawAgain = true;

      }
      else if (this.imgW <= 600) {


        this.width = this.imgW;
        this.height = this.imgH;
        this.redrawAgain = false;

      }

    }
    else if (window.innerWidth == 441) {

      if (this.imgW <= 200) {

        this.diffInPer = (this.imgW / this.imgW) * 100;
        this.width = this.imgW + (this.imgW / 100) * this.diffInPer;
        this.height = this.imgH + (this.imgH / 100) * this.diffInPer;
        sessionStorage.setItem('diff', this.diffInPer);
        this.redrawAgain = true;
      }
      else if (this.imgW <= 350) {

        this.diffInPer = (this.imgW / this.imgW) * 20;
        this.width = this.imgW + (this.imgW / 100) * this.diffInPer;
        this.height = this.imgH + (this.imgH / 100) * this.diffInPer;
        sessionStorage.setItem('diff', this.diffInPer);
        this.redrawAgain = true;
      }
      else if (this.imgW > 441 && this.imgW <= 500) {

        this.diffInPer = (this.imgW / this.imgW) * 20;
        this.width = this.imgW - (this.imgW / 100) * this.diffInPer;
        this.height = this.imgH - (this.imgH / 100) * this.diffInPer;
        sessionStorage.setItem('diff', this.diffInPer);
        this.redrawAgain = true;
        this.isPlus = false;
      }
      else if (this.imgW > 500 && this.imgW < 650) {

        this.diffInPer = (this.imgW / this.imgW) * 40;
        this.width = this.imgW - (this.imgW / 100) * this.diffInPer;
        this.height = this.imgH - (this.imgH / 100) * this.diffInPer;
        sessionStorage.setItem('diff', this.diffInPer);
        this.redrawAgain = true;
        this.isPlus = false;
      }
      else {
        this.width = this.imgW;
        this.height = this.imgH;
        this.redrawAgain = false
      }
    }
  }
  addFrameBoundary() {

    sessionStorage.setItem("add", this.frame_Title_Range_Index.toString());
    sessionStorage.setItem("addframeImgbytes", this.objimagesNamelist[this.frame_Title_Range_Index - 1].fileInBytes);
    this.frameList = JSON.parse(sessionStorage.getItem("getindeximages"));
    var fi = {
      'getindeximages': this.frame_Title_Range_Index
    }
    this.frameList.push(fi);
    this.frameList.sort((a, b) => {
      return a.getindeximages - b.getindeximages;
    });
    sessionStorage.setItem("getindeximages", JSON.stringify(this.frameList));
    this.router.navigate(['addboundaries']);
  }
  deleteFrameBoundary(index) {
    if (this.validateFrameBeforDelete(index)) {
      this.frameList = JSON.parse(sessionStorage.getItem("getindeximages"));
      for (let i = 0; i < this.frameList.length; i++) {
        if (this.frameList[i].getindeximages == index) {
          this.frameList.splice(i, 1);
          sessionStorage.setItem('points' + (index).toString(), null);
        }
      }
      this.frameList.sort((a, b) => {
        return a.getindeximages - b.getindeximages;
      });
      sessionStorage.setItem("getindeximages", JSON.stringify(this.frameList));
      var frameIndex = JSON.parse(sessionStorage.getItem("getindeximages"))
      for (let i = 0; i < frameIndex.length - 1; i++) {
        this._drawInterpolationService.connectDotsOverFrames(frameIndex[i].getindeximages, frameIndex[i + 1].getindeximages,'cord');
      }
      alert('Frame boundary deleted successfully ');
      window.location.reload();
    }
    else {
      alert('You cant delete this frame boundary');
    }
  }
  validateFrameBeforDelete(index) {
    this.frameList = JSON.parse(sessionStorage.getItem("getindeximages"));
    if (this.frameList[0].getindeximages == index || this.frameList[this.frameList.length - 1].getindeximages == index) {
      return false
    }
    return true;
  }
}
