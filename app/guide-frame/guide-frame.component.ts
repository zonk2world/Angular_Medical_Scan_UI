import { Component, ViewChild, ElementRef, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { environment } from '../../environments/environment';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { Router } from '@angular/router';
import { GuideframeService } from './guideframe.service';
import { CropimageService } from '../cropimage/cropimage.service';
@Component({
  selector: 'app-guide-frame',
  templateUrl: './guide-frame.component.html',
  styleUrls: ['./guide-frame.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class GuideFrameComponent implements OnInit {

  public frameIndex = [];
  @Input() public width = 450; //parseInt(sessionStorage.getItem("CanWidth"));
  @Input() public height = 350;//parseInt(sessionStorage.getItem("CanHeight"));
  hideScrollbar; disabled; xDisabled; yDisabled; leftNavDisabled = false;
  rightNavDisabled = false; index = 0; outpath = environment.outputfolderpath; firstimg: string
  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;
  @ViewChild('canvasEl') canvasEl: ElementRef;

  @ViewChild('ctrlimg') imageObj: ElementRef;
  @ViewChild('divmap') divmap: HTMLDivElement;
  private context: CanvasRenderingContext2D;
  objcanvasimg = new Image();
  objimagesNamelist: object;
  objimagesPathlist: object;
  interval: any;

  framelable = 1;

  guidedframe = 3; increase: number;
  on_frame: number = 0; end_frame: number = 0;
  ////
  image = new Image();
  ddStart = 1; ddEnd = 1; ddGuide = 3
  checkedList: any = []; Overlaystyle: string = "none";
  dynamicMaxwidth; WhoIsActive; Imgframe = [];
  totalFrames; indexList: any = '';
  framelist = [];
  constructor(private router: Router, private _cropimageService: CropimageService, private _guideframeService: GuideframeService, private element: ElementRef) { }
  ngOnInit() {
    this.checkedList = [];
    this.Overlaystyle = 'block';
    const canvasEl: HTMLCanvasElement = this.canvasEl.nativeElement;

    this.context = canvasEl.getContext('2d');
    this.image = new Image();
    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.ddGuide = 3
    this.image.onload = () => {
      this.context.drawImage(this.image, 0, 0, this.width, this.height);
    }

    this.getPreviewImages(localStorage.getItem("uploadedfile"));
    this.Overlaystyle = 'none';

    this.dynamicMaxwidth = this.width;
  }
  onCheckboxChange(event) {

    if (event.target.checked) {
      var fi = {
        'getindeximages': this.framelable
      }
      this.checkedList.push(fi);
    } else {
      for (var i = 0; i < this.checkedList.length; i++) {
        if (this.checkedList[i].getindeximages == this.framelable) {
          this.checkedList.splice(i, 1);

        }

      }
    }
    this.checkedList.sort((a, b) => {
      return a.getindeximages - b.getindeximages;
    });
    this.indexList = '';
    for (var i = 0; i < this.checkedList.length; i++) {
      //this.indexList = this.indexList + '<a href="javascript:void(0);" click="get('+this.checkedList[i].getindeximages+')">  <div  class="vl">' + this.checkedList[i].getindeximages + '</div></a>' ;
      this.indexList = this.indexList + '<div  class="vl">' + this.checkedList[i].getindeximages + '</div>';
    }

  }

  finalsubmit() {

    this.Overlaystyle = 'block';

    sessionStorage.setItem("getindeximages", JSON.stringify(this.checkedList));
    sessionStorage.setItem("iflag", '0');
    sessionStorage.setItem("frameIndex", "0");

    this.router.navigate(['drawboundaries']);
   // this.setPreviewImages(JSON.parse(sessionStorage.getItem("getindeximages")), localStorage.getItem("uploadedfile"));


  }
  setPreviewImages(frameIndexs, foldername) {

    this._cropimageService.getSelectedFramebytes(frameIndexs, foldername).subscribe(
      framelist => {
        if (framelist !== undefined || framelist !== null) {
          this.Imgframe = [];


        }
        else {

        }
      }//get error

    );

  }
  get(frm) {
    this.index = frm;
    this.ds.moveTo(frm);
   

  }
  next() {

    if (this.on_frame != this.end_frame) {
      this.on_frame++;
      this.framelable++;
      this.image.src = this.objimagesNamelist[this.on_frame].fileInBytes;
    }
  }
  prev() {
    if (this.on_frame != 0) {
      this.on_frame--;
      this.framelable--;
      this.image.src = this.objimagesNamelist[this.on_frame].fileInBytes;
    }
  }




  initailCanvaseSetup() {
    this.canvasInitialization();
    this.context.drawImage(this.imageObj.nativeElement, 0, 0, this.width, this.height);
  }

  loadimage(img: any, index: any) {

    this.canvasInitialization();
    this.image.src = img;

    this.framelable = index + 1;
    this.on_frame = index;
    this.WhoIsActive = index;
  }
  getPreviewImages(foldername) {

    this._guideframeService.GetImages(foldername, "2").subscribe(
      framelist => {
        if (framelist !== undefined || framelist !== null) {

          this.objimagesNamelist = framelist;
          this.image.src = this.objimagesNamelist[0].fileInBytes;
          this.totalFrames = framelist.length;
          this.markDefaultFrames(this.totalFrames);
        }
        else {

        }
      }//get error

    )
  }
  markDefaultFrames(totalFrames) {

    var fi = {
      'getindeximages': 1
    }
    this.checkedList.push(fi);
    fi = {
      'getindeximages': totalFrames
    }
    this.checkedList.push(fi);
    var mid = parseInt(Math.round(totalFrames / 2).toString());
    fi = {
      'getindeximages': mid
    }
    this.checkedList.push(fi);
    this.objimagesNamelist[0].IsSelected = true;
    this.objimagesNamelist[totalFrames - 1].IsSelected = true;
    this.objimagesNamelist[mid].IsSelected = true;

    // if (event.target.checked) {
    //   var fi = {
    //     'getindeximages': this.framelable
    //   }
    //   this.checkedList.push(fi);
    // } else {
    //   for (var i = 0; i < this.checkedList.length; i++) {
    //     if (this.checkedList[i].getindeximages == this.framelable) {
    //       this.checkedList.splice(i, 1);

    //     }

    //   }
    // }
    this.checkedList.sort((a, b) => {
      return a.getindeximages - b.getindeximages;
    });
    this.indexList = '';
    for (var i = 0; i < this.checkedList.length; i++) {
      //this.indexList = this.indexList + '<a href="javascript:void(0);" click="get('+this.checkedList[i].getindeximages+')">  <div  class="vl">' + this.checkedList[i].getindeximages + '</div></a>' ;
      this.indexList = this.indexList + '<div  class="vl">' + this.checkedList[i].getindeximages + '</div>';
    }

  }

  canvasInitialization() {
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    this.context.clearRect(0, 0, this.width, this.height)

  }
  toggleHideSB() {
    this.hideScrollbar = false;//!this.hideScrollbar;
  }

  toggleDisable() {
    this.disabled = false;//!this.disabled;
  }
  toggleXDisable() {
    this.xDisabled = false;//!this.xDisabled;
  }
  toggleYDisable() {
    this.yDisabled = false;//!this.yDisabled;
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

    this.index = idx;
  }
  onDragScrollInitialized() {

  }

}
