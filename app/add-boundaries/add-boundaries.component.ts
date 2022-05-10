import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MakingboundriesService } from 'src/shared/makingboundries.service';
import { DrawInterpolationService } from 'src/shared/draw-interpolation.service';


@Component({
  selector: 'app-add-boundaries',
  templateUrl: './add-boundaries.component.html',
  styleUrls: ['./add-boundaries.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddBoundariesComponent implements OnInit {
  imgW; imgH; diffInPer; width; height; redrawAgain = false;
  divwidth;
  divHeight;

  public imageInbytes = "";
  public btnnext: any = 'Next'; frameIndex; xPoints: string;
  yPoints: string; Overlaystyle: string = "none"; Iframe = [];
  iflag = 0; count = 1; isPlus = true;
  public Coordinate = [];
  Cord1 = [];
  max = [];

  constructor(private router: Router, private _makingboundries: MakingboundriesService, private _drawInterpolationService: DrawInterpolationService) {
  }
  ngOnInit() {
    this.Overlaystyle = 'block';
    this.calcImageWH();

    this.divwidth = this.width + "px";
    this.divHeight = this.height + "px";
    this.iflag = 0;
    this.frameIndex = sessionStorage.getItem("add");
    this.imageInbytes = sessionStorage.getItem("addframeImgbytes");

    this.getPreviewImages(this.frameIndex, this.imageInbytes);

    this.btnnext = "Proceed";
  }
  getPreviewImages(frameIndex, imgbytes) {
    this.Overlaystyle = 'block';
    this._makingboundries.makeBoundries(imgbytes, frameIndex, this.width, this.height, this.redrawAgain, this.isPlus);
    this.Overlaystyle = 'none';


  }

  finalsubmit() {
    

    if (this.redrawAgain == true) {
      this.redraw();
    }


    var frameIndex = JSON.parse(sessionStorage.getItem("getindeximages"))
    for (let i = 0; i < frameIndex.length - 1; i++) {
      this.connectDotsOverFrames(frameIndex[i].getindeximages, frameIndex[i + 1].getindeximages);

    }
    this.nevigateToBoundryPreview();
  }

  reset() {
    window.location.reload();
  }
  cancel()
  {
    this.router.navigate(['boundarypreview']);
  }
  connectDotsOverFrames(start, end) {
    this._drawInterpolationService.connectDotsOverFrames(start, end,'');
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
  redraw() {

    var frameIndexs = JSON.parse(sessionStorage.getItem("getindeximages"));
    var w = parseInt(sessionStorage.getItem("CanWidth"));
    var h = parseInt(sessionStorage.getItem("CanHeight"));
    this._makingboundries.makeNewBoundries(this.imageInbytes, this.frameIndex, w, h);

  }
  nevigateToBoundryPreview() {
    this.router.navigate(['boundarypreview']);

  }


}
