import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { CropimageService } from "../cropimage/cropimage.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-cropimage",
  templateUrl: "./cropimage.component.html",
  styleUrls: ["./cropimage.component.css"],
})
export class CropimageComponent implements OnInit {
  @Input() public width = parseInt(sessionStorage.getItem("CanWidth"));
  @Input() public height = parseInt(sessionStorage.getItem("CanHeight"));
  @ViewChild("canvas") canvas: ElementRef;
  public cords = [];
  public TempBoundriescords = [];
  public FinalBoundriescords = [];

  image = new Image();
  IsCroped: Boolean = false;
  IsUndo: Boolean = false;
  xPoints: string;
  yPoints: string;
  pointCount: number = 0;
  private cx: CanvasRenderingContext2D;
  code;
  point;
  style;
  drag: any = null;
  dPoint;
  interval;
  progress;
  xCord: any;
  yCord: any;
  frameIndex: number = 0;
  public btnnext: any = "Next";
  Overlaystyle: string = "none";
  frameInd = [];
  objimagesNamelist: any;
  framelist: any;
  Iframe = [];
  constructor(
    private router: Router,
    private _cropimageService: CropimageService
  ) {}
  ngOnInit() {
    this.Overlaystyle = "block";
    this.btnnext = "Next";
    this.pageloadsetting();
    //
    this.getPreviewImages(
      JSON.parse(sessionStorage.getItem("getindeximages")),
      localStorage.getItem("uploadedfile")
    );
    this.Overlaystyle = "none";
  }

  finalsubmit() {
    this.Overlaystyle = "block";
    this.Iframe = [];
    var storedNames = JSON.parse(sessionStorage.getItem("getindeximages"));
    for (let i = 0; i < storedNames.length; i++) {
      var framecolc = {
        getframes: storedNames[i].getindeximages,
      };
      this.Iframe.push(framecolc);
    }

    this._cropimageService
      .submitBoundriesNframes(
        this.Iframe,
        this.FinalBoundriescords,
        localStorage.getItem("uploadedfile")
      )
      .subscribe(
        (framelist) => {
          if (framelist !== undefined || framelist !== null) {
            alert("File submitted successfully");
            this.router.navigate(["croppedvideopreview"]);
          } else {
          }
        } //get error
      );
  }
  getPreviewImages(frameIndexs, foldername) {
    this._cropimageService
      .getSelectedFramebytes(frameIndexs, foldername)
      .subscribe(
        (framelist) => {
          if (framelist !== undefined || framelist !== null) {
            this.objimagesNamelist = framelist;
            this.image.src = this.objimagesNamelist[0].fileInBytes;
            this.framelist = framelist;
          } else {
          }
        } //get error
      );
  }

  nextimage() {
    for (let i = 0; i < this.TempBoundriescords.length; i++) {
      var boundriescords1 = {
        boundaries: this.TempBoundriescords[i].boundaries,
      };
      this.FinalBoundriescords.push(boundriescords1);
    }
    this.TempBoundriescords = [];

    if (this.btnnext == "Submit") {
      this.finalsubmit();
    } else {
      this.frameIndex++;
      this.image.src = this.objimagesNamelist[this.frameIndex].fileInBytes;
      if (this.frameIndex == this.objimagesNamelist.length - 1) {
        this.btnnext = "Submit";
      }
      this.xPoints = "";
      this.yPoints = "";
    }
  }

  putDot(event) {
    this.drawCoordinates(event.layerX, event.layerY);
    var cols = {
      x: event.layerX,
      y: event.layerY,
    };
    this.cords.push(cols);
    this.xPoints = this.xPoints + " " + event.layerX;
    this.yPoints = this.yPoints + " " + event.layerY;
    this.pointCount++;
  }
  draw() {
    this.drawBoudries(this.xPoints + this.yPoints);
    this.cords = [];
  }

  drawBoudries(Value) {
    this.TempBoundriescords = [];
    this.Overlaystyle = "block";
    this._cropimageService.getBoundriesPoints(Value).subscribe(
      (data) => {
        if (data !== undefined || data !== null) {
          for (let i = 0; i < data.Value.Cords.length; i++) {
            this.drawline(
              data.Value.Cords[i].split(",")[0],
              data.Value.Cords[i].split(",")[1]
            );

            var boundriescords1 = {
              boundaries: data.Value.Cords[i].split(",")[0],
            };
            this.TempBoundriescords.push(boundriescords1);
            var boundriescords2 = {
              boundaries: data.Value.Cords[i].split(",")[1],
            };
            this.TempBoundriescords.push(boundriescords2);
          }

          for (let i = 0; i < data.Value.DotCords.length; i++) {
            this.drawCoordinates(
              data.Value.DotCords[1].split(",")[0],
              data.Value.DotCords[1].split(",")[1]
            );
            var cols = {
              x: data.Value.DotCords[1].split(",")[0],
              y: data.Value.DotCords[1].split(",")[1],
            };
            this.cords.push(cols);
          }
          this.Overlaystyle = "none";
        }
      },
      (err) => {
        this.Overlaystyle = "none";
      }
    );
  }

  pageloadsetting() {
    this.xPoints = "";
    this.yPoints = "";
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext("2d");
    this.image = new Image();
    canvasEl.width = this.width;
    canvasEl.height = this.height;
    this.cx.lineWidth = 1;
    this.cx.lineCap = "round";
    this.cx.strokeStyle = "#FF0000";
    this.IsCroped = false;
    this.image.onload = () => {
      this.cx.drawImage(this.image, 0, 0, this.width, this.height);
    };
  }

  resetDraw() {
    this.cx.clearRect(0, 0, this.width, this.height);
    this.xPoints = "";
    this.yPoints = "";
    this.image.src = this.objimagesNamelist[this.frameIndex].fileInBytes;
  }

  drawline(x, y) {
    this.cx.arc(x, y, 0, 7, 7);
    this.cx.stroke();
  }
  drawCoordinates(x, y) {
    var pointSize = 5;
    this.cx.fillStyle = "#ff2626"; // Red color

    this.cx.beginPath();
    this.cx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    this.cx.fill();
  }
  frameBaundrySumit() {}
}
