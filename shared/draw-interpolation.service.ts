import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DrawInterpolationService {
  midPoints: any = [];

  constructor() {}
  FindMidPoints(startPoint, endPoint, frm) {
    debugger;
    var midPoint = parseInt((endPoint - startPoint) / 2 + startPoint);
    var n = this.midPoints.includes(midPoint);
    if (!n) {
      sessionStorage.setItem(frm + midPoint.toString(), null);

      var lastcord = null;
      var tempcord1 = sessionStorage.getItem(frm + startPoint).split(",");
      var tempcord2 = sessionStorage.getItem(frm + endPoint).split(",");

      tempcord1.filter(Boolean);
      tempcord2.filter(Boolean);
      for (let ci = 0; ci < tempcord1.length - 1; ci += 2) {
        var cxy = this.interpolate(
          { x: parseFloat(tempcord1[ci]), y: parseFloat(tempcord1[ci + 1]) },
          { x: parseFloat(tempcord2[ci]), y: parseFloat(tempcord2[ci + 1]) },
          0.5
        );

        lastcord = sessionStorage.getItem(frm + midPoint.toString());
        if (cxy.x == "NaN" || cxy.x == NaN) {
          // console.log((frm + midPoint).toString()+"-"+ newb.toString())
          console.log(tempcord1.length.toString(), ci.toString());
        }
        if (cxy !== null && cxy.x !== NaN && cxy.y !== NaN) {
          var newb =
            lastcord != "null"
              ? lastcord + "," + cxy.x + "," + cxy.y
              : cxy.x + "," + cxy.y;

          sessionStorage.setItem(frm + midPoint.toString(), newb.toString());
        }
      }
    }
    return midPoint;
  }
  connectDotsOverFrames(start, end, frm) {
    var tempMidPoints = [];
    var newMidPoint = 0;
    var startPoint = start;
    var endPoint = end;
    this.midPoints = [];
    if (endPoint > startPoint) {
      while (this.midPoints.length < end - start + 1) {
        if (this.midPoints.length == 0) {
          this.midPoints.push(startPoint);
          this.midPoints.push(endPoint);

          newMidPoint = this.FindMidPoints(startPoint, endPoint, frm);
          if (newMidPoint > 0) {
            this.midPoints.push(newMidPoint);
          }
          this.midPoints.sort((a, b) => {
            return a - b;
          });
        } else {
          var tempMidPoints = [];
          for (let i = 0; i < this.midPoints.length - 1; i++) {
            newMidPoint = this.FindMidPoints(
              this.midPoints[i],
              this.midPoints[i + 1],
              frm
            );

            if (newMidPoint > 0) {
              // let alreadyExist = midPoints.Contains(newMidPoint);
              // if (!alreadyExist)
              tempMidPoints.push(newMidPoint);
            }
          }
          if (tempMidPoints.length > 0) {
            for (let i = 0; i < tempMidPoints.length; i++) {
              var n = this.midPoints.includes(tempMidPoints[i]);
              if (!n) this.midPoints.push(tempMidPoints[i]);
            }

            this.midPoints.sort((a, b) => {
              return a - b;
            });
          }
        }
      }
      //this.nevigateToBoundryPreview();
    }
  }
  interpolate(
    a,
    b,
    frac // points A and B, frac between 0 and 1
  ) {
    var nx = a.x + (b.x - a.x) * frac;
    var ny = a.y + (b.y - a.y) * frac;
    return { x: nx, y: ny };
  }
}
