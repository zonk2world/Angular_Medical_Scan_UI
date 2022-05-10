
/*
Smooth.js version 0.1.7

Turn arrays into smooth functions.

Copyright 2012 Spencer Cohen
Licensed under MIT license (see "Smooth.js MIT license.txt")
*/

/*Constants (these are accessible by Smooth.WHATEVER in user space)
*/
import { Injectable } from '@angular/core';
import { fabric } from 'fabric';
declare var $: any;
import * as $ from 'jquery';
import 'hammerjs';
declare var Hammer: any
@Injectable({
  providedIn: 'root'
})
export class MakingboundriesService {
  canvas2: any;
  testme: any;
  constructor() { }
  makeBoundries(imgsrc, frameIndex, Cwidth, Cheight, isRedraw, isPlus) {


    var AbstractInterpolator, CubicInterpolator, Enum, LinearInterpolator, NearestInterpolator, PI, SincFilterInterpolator,
      Smooth, clipClamp, clipMirror, clipPeriodic, defaultConfig, getColumn, getType, isValidNumber, k,
      makeLanczosWindow, makeScaledFunction, makeSincKernel, normalizeScaleTo, shallowCopy, sin, sinc, v,
      validateNumber, validateVector,
      addCurveSegment, canvas, changeCubicSlider, changeLanczosSlider, cx, distance, getHandlePoint, getHandles,
      getPoints, handleDoubleClick, hitTest, hit_cx, makeHandle, plotBox, plotBoxDoubleClick, redraw, smoothConfig, updateConfigBox,
      __slice = Array.prototype.slice, sortcord, sorted_points, redrawPoints,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function (child, parent) {

        for (var key in parent) {
          if (__hasProp.call(parent, key))
            child[key] = parent[key];
        } function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child;
      };

    var element = document.getElementById('plot-box');
    var ham = new Hammer(element);
    ham.get('doubletap').set({ time: 500 });
    (function () {
      function touchHandler(e) {
        var touches = e.changedTouches;
        var first = touches[0];
        var type = "";

        switch (e.type) {
          case "touchstart":
            type = "mousedown";
            break;
          case "touchmove":
            type = "mousemove";
            break;
          case "touchend":
            type = "mouseup";
            break;
          default:
            return;
        }
        var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent(type, true, true, window, 1, first.screenX, first.screenY, first.clientX, first.clientY, false, false, false, false, 0, null);

        first.target.dispatchEvent(simulatedEvent);
      }
      function init() {
        document.addEventListener("touchstart", touchHandler, true);
        document.addEventListener("touchmove", touchHandler, true);
        document.addEventListener("touchend", touchHandler, true);
        document.addEventListener("touchcancel", touchHandler, true);
      }

      init();
    })();


    plotBox = $('#plot-box');
    plotBox.empty();
    var img = new Image();
    img.src = imgsrc;
    img.onload = function () {

      cx.drawImage(img, 0, 0, Cwidth, Cheight);
    }

    Enum = {
      /*Interpolation methods
    */
      METHOD_NEAREST: 'nearest',
      METHOD_LINEAR: 'linear',
      METHOD_CUBIC: 'cubic',
      METHOD_LANCZOS: 'lanczos',
      METHOD_SINC: 'sinc',
      /*Input clipping modes
      */
      CLIP_CLAMP: 'clamp',
      CLIP_ZERO: 'zero',
      CLIP_PERIODIC: 'periodic',
      CLIP_MIRROR: 'mirror',
      /* Constants for control over the cubic interpolation tension
      */
      CUBIC_TENSION_DEFAULT: 0,
      CUBIC_TENSION_CATMULL_ROM: 0
    };
    defaultConfig = {
      method: Enum.METHOD_CUBIC,
      cubicTension: Enum.CUBIC_TENSION_DEFAULT,
      clip: Enum.CLIP_PERIODIC,
      scaleTo: 0,
      sincFilterSize: 2,
      sincWindow: void 0
    };


    plotBox = null;

    canvas = null;

    cx = null;

    hit_cx = null;
    smoothConfig = {
      method: 'cubic',
      clip: 'periodic',
      lanczosFilterSize: 2,
      cubicTension: 0
    };
    var img = new Image();
    img.src = imgsrc;

    ////////////////////////
    distance = function (a, b) {
      if (a !== undefined && b !== undefined)
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    };



    clipClamp = function (i, n) {
      return Math.max(0, Math.min(i, n - 1));
    };

    clipPeriodic = function (i, n) {
      i = i % n;
      if (i < 0) i += n;
      return i;
    };

    clipMirror = function (i, n) {
      var period;
      period = 2 * (n - 1);
      i = clipPeriodic(i, period);
      if (i > n - 1) i = period - i;
      return i;
    };




    /*
    Abstract scalar interpolation class which provides common functionality for all interpolators
    
    Subclasses must override interpolate().
    */

    AbstractInterpolator = (function () {

      function AbstractInterpolator(array, config) {
        this.array = array.slice(0);
        this.length = this.array.length;
        if (!(this.clipHelper = {
          clamp: this.clipHelperClamp,
          zero: this.clipHelperZero,
          periodic: this.clipHelperPeriodic,
          mirror: this.clipHelperMirror
        }[config.clip])) {
          throw "Invalid clip: " + config.clip;
        }
      }

      AbstractInterpolator.prototype.getClippedInput = function (i) {
        if ((0 <= i && i < this.length)) {
          return this.array[i];
        } else {
          return this.clipHelper(i);
        }
      };

      AbstractInterpolator.prototype.clipHelperClamp = function (i) {
        return this.array[clipClamp(i, this.length)];
      };

      AbstractInterpolator.prototype.clipHelperZero = function (i) {
        return 0;
      };

      AbstractInterpolator.prototype.clipHelperPeriodic = function (i) {
        return this.array[clipPeriodic(i, this.length)];
      };

      AbstractInterpolator.prototype.clipHelperMirror = function (i) {
        return this.array[clipMirror(i, this.length)];
      };

      AbstractInterpolator.prototype.interpolate = function (t) {
        throw 'Subclasses of AbstractInterpolator must override the interpolate() method.';
      };

      return AbstractInterpolator;

    })();
    NearestInterpolator = (function (_super) {
      __extends(NearestInterpolator, _super);
      function NearestInterpolator() {
        _super.apply(this, arguments);
      }
      NearestInterpolator.prototype.interpolate = function (t) {
        return this.getClippedInput(Math.round(t));
      };
      return NearestInterpolator;
    })(AbstractInterpolator);
    LinearInterpolator = (function (_super) {
      __extends(LinearInterpolator, _super);
      function LinearInterpolator() {
        _super.apply(this, arguments);
      }
      LinearInterpolator.prototype.interpolate = function (t) {
        var k;
        k = Math.floor(t);
        t -= k;
        return (1 - t) * this.getClippedInput(k) + t * this.getClippedInput(k + 1);
      };
      return LinearInterpolator;
    })(AbstractInterpolator);

    CubicInterpolator = (function (_super) {

      __extends(CubicInterpolator, _super);
      function CubicInterpolator(array, config) {
        this.tangentFactor = 1 - Math.max(0, Math.min(1, config.cubicTension));
        _super.apply(this, arguments);
      }
      CubicInterpolator.prototype.getTangent = function (k) {
        return this.tangentFactor * (this.getClippedInput(k + 1) - this.getClippedInput(k - 1)) / 2;
      };
      CubicInterpolator.prototype.interpolate = function (t) {

        var k, m, p, t2, t3;
        k = Math.floor(t);
        m = [this.getTangent(k), this.getTangent(k + 1)];
        p = [this.getClippedInput(k), this.getClippedInput(k + 1)];
        t -= k;
        t2 = t * t;
        t3 = t * t2;
        var count = 1;

        return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];

      };

      return CubicInterpolator;
    })(AbstractInterpolator);
    sin = Math.sin, PI = Math.PI;
    sinc = function (x) {
      if (x === 0) {
        return 1;
      } else {
        return sin(PI * x) / (PI * x);
      }
    };

    makeLanczosWindow = function (a) {
      return function (x) {
        return sinc(x / a);
      };
    };

    makeSincKernel = function (window) {
      return function (x) {
        return sinc(x) * window(x);
      };
    };
    SincFilterInterpolator = (function (_super) {
      __extends(SincFilterInterpolator, _super);
      function SincFilterInterpolator(array, config) {
        var window;
        //SincFilterInterpolator.__super__.constructor.apply(this, arguments);
        this.a = config.sincFilterSize;
        window = config.sincWindow;
        if (window == null) throw 'No sincWindow provided';
        this.kernel = makeSincKernel(window);
      }

      SincFilterInterpolator.prototype.interpolate = function (t) {
        var k, n, sum, _ref, _ref2;
        k = Math.floor(t);
        sum = 0;
        for (n = _ref = k - this.a + 1, _ref2 = k + this.a; _ref <= _ref2 ? n <= _ref2 : n >= _ref2; _ref <= _ref2 ? n++ : n--) {
          sum += this.kernel(t - n) * this.getClippedInput(n);
        }
        return sum;
      };
      return SincFilterInterpolator;
    })(AbstractInterpolator);
    getColumn = function (arr, i) {
      var row, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        row = arr[_i];
        _results.push(row[i]);
      }
      return _results;
    };
    makeScaledFunction = function (f, baseScale, scaleRange) {
      var scaleFactor, translation;
      if (scaleRange.join === '0,1') {
        return f;
      } else {
        scaleFactor = baseScale / (scaleRange[1] - scaleRange[0]);
        translation = scaleRange[0];
        return function (t) {
          return f(scaleFactor * (t - translation));
        };
      }
    };
    getType = function (x) {
      return Object.prototype.toString.call(x).slice('[object '.length, -1);
    };
    validateNumber = function (n) {
      if (isNaN(n)) throw 'NaN in Smooth() input';
      if (getType(n) !== 'Number') throw 'Non-number in Smooth() input';
      if (!isFinite(n)) throw 'Infinity in Smooth() input';
    };
    validateVector = function (v, dimension) {
      var n, _i, _len;
      if (getType(v) !== 'Array') throw 'Non-vector in Smooth() input';
      if (v.length !== dimension) throw 'Inconsistent dimension in Smooth() input';
      for (_i = 0, _len = v.length; _i < _len; _i++) {
        n = v[_i];
        validateNumber(n);
      }
    };
    isValidNumber = function (n) {
      return (getType(n) === 'Number') && isFinite(n) && !isNaN(n);
    };
    normalizeScaleTo = function (s) {
      var invalidErr;
      invalidErr = "scaleTo param must be number or array of two numbers";
      switch (getType(s)) {
        case 'Number':
          if (!isValidNumber(s)) throw invalidErr;
          s = [0, s];
          break;
        case 'Array':
          if (s.length !== 2) throw invalidErr;
          if (!(isValidNumber(s[0]) && isValidNumber(s[1]))) throw invalidErr;
          break;
        default:
          throw invalidErr;
      }
      return s;
    };
    shallowCopy = function (obj) {
      var copy, k, v;
      copy = {};
      for (k in obj) {
        if (!__hasProp.call(obj, k)) continue;
        v = obj[k];
        copy[k] = v;
      }
      return copy;
    };

    Smooth = function (arr, config) {
      var baseDomainEnd, dimension, i, interpolator, interpolatorClass, interpolators, k, n, properties, smoothFunc, v;
      if (config == null) config = {};
      properties = {};
      config = shallowCopy(config);
      properties.config = shallowCopy(config);
      if (config.scaleTo == null) config.scaleTo = config.period;
      if (config.sincFilterSize == null) {
        config.sincFilterSize = config.lanczosFilterSize;
      }
      for (k in defaultConfig) {
        if (!__hasProp.call(defaultConfig, k)) continue;
        v = defaultConfig[k];
        if (config[k] == null) config[k] = v;
      }
      if (!(interpolatorClass = {
        nearest: NearestInterpolator,
        linear: LinearInterpolator,
        cubic: CubicInterpolator,
        lanczos: SincFilterInterpolator,
        sinc: SincFilterInterpolator
      }[config.method])) {
        throw "Invalid method: " + config.method;
      }
      if (config.method === 'lanczos') {
        config.sincWindow = makeLanczosWindow(config.sincFilterSize);
      }
      //if (arr.length < 2) throw 'Array must have at least two elements';
      properties.count = arr.length;
      smoothFunc = (function () {
        var _i, _j, _len, _len2;
        switch (getType(arr[0])) {
          case 'Number':
            properties.dimension = 'scalar';
            if (Smooth.deepValidation) {
              for (_i = 0, _len = arr.length; _i < _len; _i++) {
                n = arr[_i];
                validateNumber(n);
              }
            }
            interpolator = new interpolatorClass(arr, config);
            return function (t) {
              return interpolator.interpolate(t);
            };
          case 'Array':
            properties.dimension = dimension = arr[0].length;
            if (!dimension) throw 'Vectors must be non-empty';
            if (Smooth.deepValidation) {
              for (_j = 0, _len2 = arr.length; _j < _len2; _j++) {
                v = arr[_j];
                validateVector(v, dimension);
              }
            }
            interpolators = (function () {
              var _results;
              _results = [];
              for (i = 0; 0 <= dimension ? i < dimension : i > dimension; 0 <= dimension ? i++ : i--) {
                _results.push(new interpolatorClass(getColumn(arr, i), config));
              }
              return _results;
            })();
            return function (t) {
              var interpolator, _k, _len3, _results;
              _results = [];
              for (_k = 0, _len3 = interpolators.length; _k < _len3; _k++) {
                interpolator = interpolators[_k];
                _results.push(interpolator.interpolate(t));
              }
              return _results;
            };
          default:
            throw "Invalid element type: " + (getType(arr[0]));
        }
      })();
      if (config.clip === 'periodic') {
        baseDomainEnd = arr.length;
      } else {
        baseDomainEnd = arr.length - 1;
      }
      config.scaleTo || (config.scaleTo = baseDomainEnd);
      properties.domain = normalizeScaleTo(config.scaleTo);
      smoothFunc = makeScaledFunction(smoothFunc, baseDomainEnd, properties.domain);
      properties.domain.sort();
      /*copy properties
      */
      for (k in properties) {
        if (!__hasProp.call(properties, k)) continue;
        v = properties[k];
        smoothFunc[k] = v;
      }
      return smoothFunc;
    };

    for (k in Enum) {
      if (!__hasProp.call(Enum, k)) continue;
      v = Enum[k];
      Smooth[k] = v;
    }

    Smooth.deepValidation = true;

    (typeof exports !== "undefined" && exports !== null ? exports : window).Smooth = Smooth;


    getHandles = function () {
      return plotBox.children('div.handle');
    };

    getHandlePoint = function (handle) {
      var left, top, _ref;
      _ref = $(handle).position(),
        top = _ref.top, left = _ref.left;
      return [left + 6, top + 6];
    };

    getPoints = function () {
      var handle, _i, _len, _ref, _results;
      _ref = getHandles();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handle = _ref[_i];
        _results.push(getHandlePoint(handle));
      }

      return _results;
    };

    makeHandle = function (x, y) {

      var handle;

      handle = $('<div/>').addClass('handle').appendTo(plotBox).css({
        left: x - 6,
        top: y - 6

      });
      handle.draggable(
        {
          drag: redraw,
          stop: redraw
        });
      handle.dblclick(function (ev) {

        return handleDoubleClick(handle);
      });

      handle.css({
        position: 'absolute'
      });
      redraw();
      return handle;
    };

    plotBoxDoubleClick = function (ev) {

      var img = new Image();
      img.src = imgsrc;
      img.onload = function () {

        cx.drawImage(img, 0, 0, Cwidth, Cheight);
      }
      /* Add a new handle at the clicked location
      */
      var first, last, middle, newHandle, newPoint, offset, segmentStartHandle, x, y, _i, _ref, _ref2;
      offset = plotBox.offset();

      _ref = [ev.pageX - offset.left, ev.pageY - offset.top], x = _ref[0], y = _ref[1];
      segmentStartHandle = getHandles()[hitTest(x, y)];
      newHandle = makeHandle(x, y);
      if (segmentStartHandle != null) {
        newHandle.insertAfter($(segmentStartHandle));
      } else {
        _ref2 = getPoints(), first = _ref2[0], middle = 4 <= _ref2.length ? __slice.call(_ref2, 1, _i = _ref2.length - 2) : (_i = 1, []), last = _ref2[_i++], newPoint = _ref2[_i++];
        if (distance(first, newPoint) < distance(last, newPoint)) {

          newHandle.insertBefore($(getHandles()[0]));
        }
      }
      redraw();
      return false;
    };

    handleDoubleClick = function (handle) {
      var img = new Image();
      img.src = imgsrc;
      img.onload = function () {
        cx.drawImage(img, 0, 0, Cwidth, Cheight);
      }
      handle.remove();

      redraw();
      return false;
    };

    updateConfigBox = function () {
      $('div.method-config').hide();
      return $("div#" + smoothConfig.method + "-config").show();
    };

    changeLanczosSlider = function (ev, ui) {
      smoothConfig.lanczosFilterSize = ui.value;
      $("#lanczosfiltersize").text(smoothConfig.lanczosFilterSize);
      return redraw();
    };

    changeCubicSlider = function (ev, ui) {

      smoothConfig.cubicTension = ui.value;
      $("#cubictension").text(smoothConfig.cubicTension.toFixed(1));
      return redraw();
    };

    addCurveSegment = function (context, i, points) {
      var averageLineLength, du, end, pieceCount, pieceLength, s, start, t, u, _ref, _ref2, _ref3;
      s = Smooth(points, smoothConfig);

      averageLineLength = 1;
      pieceCount = 2;
      for (t = 0, _ref = 1 / pieceCount; t < 1; t += _ref) {
        _ref2 = [s(i + t), s(i + t + 1 / pieceCount)], start = _ref2[0], end = _ref2[1];
        pieceLength = distance(start, end);
        du = averageLineLength / pieceLength;
        for (u = 0, _ref3 = 1 / pieceCount; 0 <= _ref3 ? u < _ref3 : u > _ref3; u += du) {

          if (points.length > 3) {
            sessionStorage.setItem("points" + (frameIndex).toString(), points)
          }
          //   var lastcord = sessionStorage.getItem("cord" + frameIndex);

          //   if (lastcord != null) {
          //     if (!lastcord.includes(s(i + t + u).toString())) {
          //       var newb = lastcord != "" ? lastcord + "," + s(i + t + u) : s(i + t + u);
          //       sessionStorage.setItem("cord" + frameIndex, newb.toString());
          //     }
          //   }
          //   else {
          //     sessionStorage.setItem("cord" + frameIndex, s(i + t + u).toString());
          //   }

          // }

          context.lineTo.apply(context, s(i + t + u));
        }
      }

      return context.lineTo.apply(context, s(i + 1));
    };

    redraw = function () {

      var img = new Image();
      img.src = imgsrc;
      var i, lastIndex, points;


      points = getPoints();

      if (points.length >= 4) {

        let temppoints = sorted_points(points);
        points = [];
        for (let i = 0; i < temppoints.length; i++) {
          points.push([temppoints[i].x, temppoints[i].y]);
        }

      }

      //
      if (points.length >= 4) {
        var s, numpoints, dsval;
        var bs = [];
        lastIndex = points.length - 1;
        if (smoothConfig.clip === 'periodic') lastIndex++;
        s = Smooth(points, smoothConfig);
        numpoints = 100;
        sessionStorage.setItem(frameIndex, '')
        sessionStorage.setItem("cord" + frameIndex, '')
        let i = 0;
        var firstbxy;

        for (let ds = 0; ds < lastIndex; ds += lastIndex / numpoints) {
          dsval = s(ds);
          bs.push(dsval);

          var lastcord = sessionStorage.getItem(frameIndex);
          if (lastcord == "") {
            firstbxy = dsval;
          }
          var newb = lastcord != "" ? lastcord + "," + dsval : dsval;

          sessionStorage.setItem(frameIndex, newb.toString());
          sessionStorage.setItem("cord" + frameIndex, newb.toString());
        }

        newb = lastcord + "," + firstbxy;
        sessionStorage.setItem("cord" + frameIndex, newb.toString());
      }

      //
      if (points.length >= 4) {
        cx.beginPath();
        cx.moveTo.apply(cx, points[0]);
        lastIndex = points.length - 1;
        if (smoothConfig.clip === 'periodic') lastIndex++;
        let i = 0;

        for (i = 0; 0 <= lastIndex ? i < lastIndex : i > lastIndex; 0 <= lastIndex ? i++ : i--) {
          addCurveSegment(cx, i, points);
        }
        img.onload = function () {
          cx.drawImage(img, 0, 0, Cwidth, Cheight);
          cx.lineWidth = 4;
          cx.strokeStyle = 'yellow';
          cx.lineJoin = 'round';
          cx.lineCap = 'round';
          return cx.stroke();
        }

        if (isRedraw == true) {

          redrawPoints();
        }
      }
    };
    redrawPoints = function () {

      var handles = $('.handle2');
      handles.remove();
      var bigPoints = getPoints();
      for (let i = 0; i < bigPoints.length; i++) {
        let nx, ny = 0

        if (sessionStorage.getItem('diff') == '100') {
          nx = (bigPoints[i][0] / 2) - 6;
          ny = (bigPoints[i][1] / 2) - 6;
        }
        else if (sessionStorage.getItem('diff') == '20' && isPlus == true) {
          nx = bigPoints[i][0] - ((bigPoints[i][0] / 100) * 20) - 6;
          ny = bigPoints[i][1] - ((bigPoints[i][1] / 100) * 20) - 6;
        }
        else if (sessionStorage.getItem('diff') == '20' && isPlus == false) {
          nx = bigPoints[i][0] + ((bigPoints[i][0] / 100) * 20) - 6;
          ny = bigPoints[i][1] + ((bigPoints[i][1] / 100) * 20) - 6;
        }
        else if (sessionStorage.getItem('diff') == '40' && isPlus == false) {
          nx = bigPoints[i][0] + ((bigPoints[i][0] / 100) * 40) - 6;
          ny = bigPoints[i][1] + ((bigPoints[i][1] / 100) * 40) - 6;
        }
        $('<div/>').addClass('handle2').appendTo(plotBox).css({
          left: nx,
          top: ny

        });
      }
    }
    sortcord = function () {
      var realpoints = getPoints();
      var newpoints = [];
      var xCords = [];
      var yCords = [];
      if (realpoints.length > 3) {
        for (let i = 0; i < realpoints.length; i++) {

          xCords[i] = realpoints[i].toString().split(',')[0];
          yCords[i] = realpoints[i].toString().split(',')[1];
        }
        let iIndex = 0;
        do {

          let minx = parseFloat(xCords[0]);
          let xCordsIndex = 0;
          for (let i = 0; i < xCords.length; i++) {
            if (parseFloat(xCords[i]) < minx) {
              minx = parseFloat(xCords[i]);
              xCordsIndex = i;
            }
          }

          newpoints.push([parseFloat(xCords[xCordsIndex]), parseFloat(yCords[xCordsIndex])]);
          xCords.splice(xCordsIndex, 1);
          yCords.splice(xCordsIndex, 1);

          iIndex++;
        } while (xCords.length > 0)
        return newpoints;
      }





    };
    sorted_points = function (points) {

      let pointsnew = [];
      for (let i = 0; i < points.length; i++) {
        const cords = {
          'x': points[i][0],
          'y': points[i][1]
        }
        pointsnew.push(cords);
      }

      var stringify_point = function (p) { return p.x + ',' + p.y; };
      var avg_points = function (pts) {
        var x = 0;
        var y = 0;
        for (let i = 0; i < pts.length; i++) {
          x += pts[i].x;
          y += pts[i].y;
        }
        return { x: x / pts.length, y: y / pts.length };
      }
      var center = avg_points(pointsnew);

      // calculate the angle between each point and the centerpoint, and sort by those angles
      var angles = {};
      for (let i = 0; i < pointsnew.length; i++) {
        angles[stringify_point(pointsnew[i])] = Math.atan2(pointsnew[i].x - center.x, pointsnew[i].y - center.y);
      }
      pointsnew.sort(function (p1, p2) {
        return angles[stringify_point(p1)] - angles[stringify_point(p2)];
      });

      return pointsnew;
    };

    hitTest = function (x, y) {

      var i = 0, points, _ref;
      points = getPoints();

      hit_cx.clearRect(0, 0, canvas.width(), canvas.height());
      _ref = points.length;
      sessionStorage.setItem("cord" + frameIndex, "");

      for (i = 0, _ref = points.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        hit_cx.beginPath();
        hit_cx.moveTo(hit_cx, points[i]);
        addCurveSegment(hit_cx, i, points);
        hit_cx.color = "#FFFFFF";
        hit_cx.lineWidth = 20;
        hit_cx.lineCap = 'round';
        hit_cx.lineJoin = 'round';
        hit_cx.stroke();
        if (hit_cx.getImageData(x, y, 1, 1).data[3] === 255) {
          return i;
        }
      }
    };

    $(function () {

      plotBox = $('#plot-box');
      var can1 = "<canvas id='can1' width=" + Cwidth + " height=" + Cheight + " style='cursor:crosshair;'/>"
      var can2 = "<canvas width=" + Cwidth + " height=" + Cheight + " />"
      canvas = $(can1).appendTo(plotBox);

      cx = canvas[0].getContext('2d');
      hit_cx = $(can2).css({
        display: 'none'
      }).appendTo(plotBox)[0].getContext('2d');
      plotBox.dblclick(plotBoxDoubleClick);
      //plotBox.addEventListener('dblclick',plotBoxDoubleClick );
      makeHandle(205, 55);
      makeHandle(301, 125);
      makeHandle(198, 126);
      makeHandle(304, 55);
      debugger
      redraw();
      $("#tension-slider").slider({
        min: 0,
        max: 1,
        step: .1,
        value: smoothConfig.cubicTension,
        slide: changeCubicSlider,
        change: changeCubicSlider
      });
      $("#lanczos-slider").slider({
        min: 2,
        max: 10,
        step: 1,
        value: smoothConfig.lanczosFilterSize,
        slide: changeLanczosSlider,
        change: changeLanczosSlider
      });
      $('#method').change(function () {
        smoothConfig.method = $('#method option:selected').val();
        updateConfigBox();
        return redraw();
      });
      $('#clip').change(function () {
        smoothConfig.clip = $('#clip option:selected').val();
        return redraw();
      });
      updateConfigBox();
      return redraw();
    });



  }
  makeNewBoundries(imgsrc, frameIndex, Cwidth, Cheight) {


    var AbstractInterpolator, CubicInterpolator, Enum, LinearInterpolator, NearestInterpolator, PI, SincFilterInterpolator,
      Smooth, clipClamp, clipMirror, clipPeriodic, defaultConfig, getColumn, getType, isValidNumber, k,
      makeLanczosWindow, makeScaledFunction, makeSincKernel, normalizeScaleTo, shallowCopy, sin, sinc, v,
      validateNumber, validateVector,
      addCurveSegment, canvas, changeCubicSlider, changeLanczosSlider, cx, distance, getHandlePoint, getHandles,
      getPoints, handleDoubleClick, hitTest, hit_cx, makeHandle, plotBox, plotBoxDoubleClick, redraw, smoothConfig, updateConfigBox,
      __slice = Array.prototype.slice, sortcord, sorted_points, redrawPoints,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function (child, parent) {

        for (var key in parent) {
          if (__hasProp.call(parent, key))
            child[key] = parent[key];
        } function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child;
      };

    var element = document.getElementById('plot-box');



    //plotBox = $('#plot-box');
    //plotBox.empty();
    var img = new Image();
    img.src = imgsrc;
    img.onload = function () {

      cx.drawImage(img, 0, 0, Cwidth, Cheight);
    }

    Enum = {
      /*Interpolation methods*/
      METHOD_CUBIC: 'cubic',
      CLIP_PERIODIC: 'periodic',
      /* Constants for control over the cubic interpolation tension */
      CUBIC_TENSION_DEFAULT: 0,
      CUBIC_TENSION_CATMULL_ROM: 0
    };
    defaultConfig = {
      method: Enum.METHOD_CUBIC,
      cubicTension: Enum.CUBIC_TENSION_DEFAULT,
      clip: Enum.CLIP_CLAMP,
      scaleTo: 0,
      sincWindow: void 0
    };


    plotBox = null;

    canvas = null;

    cx = null;

    hit_cx = null;
    smoothConfig = {
      method: 'cubic',
      clip: 'periodic',
      cubicTension: 0
    };
    var img = new Image();
    img.src = imgsrc;

    ////////////////////////
    distance = function (a, b) {
      if (a !== undefined && b !== undefined)
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    };



    clipClamp = function (i, n) {
      return Math.max(0, Math.min(i, n - 1));
    };

    clipPeriodic = function (i, n) {
      i = i % n;
      if (i < 0) i += n;
      return i;
    };

    clipMirror = function (i, n) {
      var period;
      period = 2 * (n - 1);
      i = clipPeriodic(i, period);
      if (i > n - 1) i = period - i;
      return i;
    };



    /*
      Abstract scalar interpolation class which provides common functionality for all interpolators
      
      Subclasses must override interpolate().
      */

    AbstractInterpolator = (function () {

      function AbstractInterpolator(array, config) {
        this.array = array.slice(0);
        this.length = this.array.length;
        if (!(this.clipHelper = {
          clamp: this.clipHelperClamp,
          zero: this.clipHelperZero,
          periodic: this.clipHelperPeriodic,
          mirror: this.clipHelperMirror
        }[config.clip])) {
          throw "Invalid clip: " + config.clip;
        }
      }

      AbstractInterpolator.prototype.getClippedInput = function (i) {
        if ((0 <= i && i < this.length)) {
          return this.array[i];
        } else {
          return this.clipHelper(i);
        }
      };

      AbstractInterpolator.prototype.clipHelperClamp = function (i) {
        return this.array[clipClamp(i, this.length)];
      };

      AbstractInterpolator.prototype.clipHelperZero = function (i) {
        return 0;
      };

      AbstractInterpolator.prototype.clipHelperPeriodic = function (i) {
        return this.array[clipPeriodic(i, this.length)];
      };

      AbstractInterpolator.prototype.clipHelperMirror = function (i) {
        return this.array[clipMirror(i, this.length)];
      };

      AbstractInterpolator.prototype.interpolate = function (t) {
        throw 'Subclasses of AbstractInterpolator must override the interpolate() method.';
      };

      return AbstractInterpolator;

    })();
    NearestInterpolator = (function (_super) {
      __extends(NearestInterpolator, _super);
      function NearestInterpolator() {
        _super.apply(this, arguments);
      }
      NearestInterpolator.prototype.interpolate = function (t) {
        return this.getClippedInput(Math.round(t));
      };
      return NearestInterpolator;
    })(AbstractInterpolator);
    LinearInterpolator = (function (_super) {
      __extends(LinearInterpolator, _super);
      function LinearInterpolator() {
        _super.apply(this, arguments);
      }
      LinearInterpolator.prototype.interpolate = function (t) {
        var k;
        k = Math.floor(t);
        t -= k;
        return (1 - t) * this.getClippedInput(k) + t * this.getClippedInput(k + 1);
      };
      return LinearInterpolator;
    })(AbstractInterpolator);

    CubicInterpolator = (function (_super) {

      __extends(CubicInterpolator, _super);
      function CubicInterpolator(array, config) {
        this.tangentFactor = 1 - Math.max(0, Math.min(1, config.cubicTension));
        _super.apply(this, arguments);
      }
      CubicInterpolator.prototype.getTangent = function (k) {
        return this.tangentFactor * (this.getClippedInput(k + 1) - this.getClippedInput(k - 1)) / 2;
      };
      CubicInterpolator.prototype.interpolate = function (t) {

        var k, m, p, t2, t3;
        k = Math.floor(t);
        m = [this.getTangent(k), this.getTangent(k + 1)];
        p = [this.getClippedInput(k), this.getClippedInput(k + 1)];
        t -= k;
        t2 = t * t;
        t3 = t * t2;
        var count = 1;

        return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];

      };

      return CubicInterpolator;
    })(AbstractInterpolator);
    sin = Math.sin, PI = Math.PI;
    sinc = function (x) {
      if (x === 0) {
        return 1;
      } else {
        return sin(PI * x) / (PI * x);
      }
    };

    makeLanczosWindow = function (a) {
      return function (x) {
        return sinc(x / a);
      };
    };

    makeSincKernel = function (window) {
      return function (x) {
        return sinc(x) * window(x);
      };
    };
    SincFilterInterpolator = (function (_super) {
      __extends(SincFilterInterpolator, _super);
      function SincFilterInterpolator(array, config) {

        _super.apply(this, arguments);
        this.a = config.sincFilterSize;
        window = config.sincWindow;
        if (!config.sincWindow) throw 'No sincWindow provided';
        this.kernel = makeSincKernel(config.sincWindow);
      }

      SincFilterInterpolator.prototype.interpolate = function (t) {
        var k, n, sum, _ref, _ref2;
        k = Math.floor(t);
        sum = 0;
        for (n = _ref = k - this.a + 1, _ref2 = k + this.a; _ref <= _ref2 ? n <= _ref2 : n >= _ref2; _ref <= _ref2 ? n++ : n--) {
          sum += this.kernel(t - n) * this.getClippedInput(n);
        }
        return sum;
      };
      return SincFilterInterpolator;
    })(AbstractInterpolator);
    getColumn = function (arr, i) {
      var row, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        row = arr[_i];
        _results.push(row[i]);
      }
      return _results;
    };
    makeScaledFunction = function (f, baseScale, scaleRange) {
      var scaleFactor, translation;
      if (scaleRange.join === '0,1') {
        return f;
      } else {
        scaleFactor = baseScale / (scaleRange[1] - scaleRange[0]);
        translation = scaleRange[0];
        return function (t) {
          return f(scaleFactor * (t - translation));
        };
      }
    };
    getType = function (x) {
      return Object.prototype.toString.call(x).slice('[object '.length, -1);
    };
    validateNumber = function (n) {
      if (isNaN(n)) throw 'NaN in Smooth() input';
      if (getType(n) !== 'Number') throw 'Non-number in Smooth() input';
      if (!isFinite(n)) throw 'Infinity in Smooth() input';
    };
    validateVector = function (v, dimension) {
      var n, _i, _len;
      if (getType(v) !== 'Array') throw 'Non-vector in Smooth() input';
      if (v.length !== dimension) throw 'Inconsistent dimension in Smooth() input';
      for (_i = 0, _len = v.length; _i < _len; _i++) {
        n = v[_i];
        validateNumber(n);
      }
    };
    isValidNumber = function (n) {
      return (getType(n) === 'Number') && isFinite(n) && !isNaN(n);
    };
    normalizeScaleTo = function (s) {
      var invalidErr;
      invalidErr = "scaleTo param must be number or array of two numbers";
      switch (getType(s)) {
        case 'Number':
          if (!isValidNumber(s)) throw invalidErr;
          s = [0, s];
          break;
        case 'Array':
          if (s.length !== 2) throw invalidErr;
          if (!(isValidNumber(s[0]) && isValidNumber(s[1]))) throw invalidErr;
          break;
        default:
          throw invalidErr;
      }
      return s;
    };
    shallowCopy = function (obj) {
      var copy, k, v;
      copy = {};
      for (k in obj) {
        if (!__hasProp.call(obj, k)) continue;
        v = obj[k];
        copy[k] = v;
      }
      return copy;
    };

    Smooth = function (arr, config) {
      var baseDomainEnd, dimension, i, interpolator, interpolatorClass, interpolators, k, n, properties, smoothFunc, v;
      if (config == null) config = {};
      properties = {};
      config = shallowCopy(config);
      properties.config = shallowCopy(config);
      if (config.scaleTo == null) config.scaleTo = config.period;
      if (config.sincFilterSize == null) {
        config.sincFilterSize = config.lanczosFilterSize;
      }
      for (k in defaultConfig) {
        if (!__hasProp.call(defaultConfig, k)) continue;
        v = defaultConfig[k];
        if (config[k] == null) config[k] = v;
      }
      if (!(interpolatorClass = {
        nearest: NearestInterpolator,
        linear: LinearInterpolator,
        cubic: CubicInterpolator,
        lanczos: SincFilterInterpolator,
        sinc: SincFilterInterpolator
      }[config.method])) {
        throw "Invalid method: " + config.method;
      }
      if (config.method === 'lanczos') {
        config.sincWindow = makeLanczosWindow(config.sincFilterSize);
      }
      if (arr.length < 1) throw 'Array must have at least two elements';
      properties.count = arr.length;
      smoothFunc = (function () {
        var _i, _j, _len, _len2;
        switch (getType(arr[0])) {
          case 'Number':
            properties.dimension = 'scalar';
            if (Smooth.deepValidation) {
              for (_i = 0, _len = arr.length; _i < _len; _i++) {
                n = arr[_i];
                validateNumber(n);
              }
            }
            interpolator = new interpolatorClass(arr, config);
            return function (t) {
              return interpolator.interpolate(t);
            };
          case 'Array':
            properties.dimension = dimension = arr[0].length;
            if (!dimension) throw 'Vectors must be non-empty';
            if (Smooth.deepValidation) {
              for (_j = 0, _len2 = arr.length; _j < _len2; _j++) {
                v = arr[_j];
                validateVector(v, dimension);
              }
            }
            interpolators = (function () {
              var _results;
              _results = [];
              for (i = 0; 0 <= dimension ? i < dimension : i > dimension; 0 <= dimension ? i++ : i--) {
                _results.push(new interpolatorClass(getColumn(arr, i), config));
              }
              return _results;
            })();
            return function (t) {
              var interpolator, _k, _len3, _results;
              _results = [];
              for (_k = 0, _len3 = interpolators.length; _k < _len3; _k++) {
                interpolator = interpolators[_k];
                _results.push(interpolator.interpolate(t));
              }
              return _results;
            };
          default:
            throw "Invalid element type: " + (getType(arr[0]));
        }
      })();
      if (config.clip === 'periodic') {
        baseDomainEnd = arr.length;
      } else {
        baseDomainEnd = arr.length - 1;
      }
      config.scaleTo || (config.scaleTo = baseDomainEnd);
      properties.domain = normalizeScaleTo(config.scaleTo);
      smoothFunc = makeScaledFunction(smoothFunc, baseDomainEnd, properties.domain);
      properties.domain.sort();
      /*copy properties
      */
      for (k in properties) {
        if (!__hasProp.call(properties, k)) continue;
        v = properties[k];
        smoothFunc[k] = v;
      }
      return smoothFunc;
    };

    for (k in Enum) {
      if (!__hasProp.call(Enum, k)) continue;
      v = Enum[k];
      Smooth[k] = v;
    }

    Smooth.deepValidation = true;

    (typeof exports !== "undefined" && exports !== null ? exports : window).Smooth = Smooth;

    getHandles = function () {
      return plotBox.children('div.handle2');
    };

    getHandlePoint = function (handle) {
      var left, top, _ref;
      _ref = $(handle).position(),
        top = _ref.top, left = _ref.left;
      return [left + 6, top + 6];
    };

    getPoints = function () {

      var handle, _i, _len, _ref, _results;
      _ref = getHandles();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handle = _ref[_i];
        _results.push(getHandlePoint(handle));
      }

      return _results;
    };

    makeHandle = function (x, y) {

      var handle;
      if (sessionStorage.getItem('diff') == '100') {

        let nx = (x / 2) - 6;
        let ny = (y / 2) - 6;
        $('<div/>').addClass('handle2').appendTo(plotBox).css({
          left: nx,
          top: ny

        });
      }
      else if (sessionStorage.getItem('diff') == '20') {

        let nx = ((x / 100) * 20) - 6;
        let ny = ((x / 100) * 20) - 6;
        $('<div/>').addClass('handle2').appendTo(plotBox).css({
          left: nx,
          top: ny

        });
      }
      handle = $('<div/>').addClass('handle').appendTo(plotBox).css({
        left: x - 6,
        top: y - 6

      });
      handle.draggable(
        {
          drag: redraw,
          stop: redraw
        });
      handle.dblclick(function (ev) {

        return handleDoubleClick(handle);
      });

      handle.css({
        position: 'absolute'
      });
      redraw();
      return handle;
    };

    plotBoxDoubleClick = function (ev) {

      var img = new Image();
      img.src = imgsrc;
      img.onload = function () {

        cx.drawImage(img, 0, 0, Cwidth, Cheight);
      }
      /* Add a new handle at the clicked location
      */
      var first, last, middle, newHandle, newPoint, offset, segmentStartHandle, x, y, _i, _ref, _ref2;
      offset = plotBox.offset();

      _ref = [ev.pageX - offset.left, ev.pageY - offset.top], x = _ref[0], y = _ref[1];
      segmentStartHandle = getHandles()[hitTest(x, y)];
      newHandle = makeHandle(x, y);
      if (segmentStartHandle != null) {
        newHandle.insertAfter($(segmentStartHandle));
      } else {
        _ref2 = getPoints(), first = _ref2[0], middle = 4 <= _ref2.length ? __slice.call(_ref2, 1, _i = _ref2.length - 2) : (_i = 1, []), last = _ref2[_i++], newPoint = _ref2[_i++];
        if (distance(first, newPoint) < distance(last, newPoint)) {

          newHandle.insertBefore($(getHandles()[0]));
        }
      }
      redraw();
      return false;
    };

    handleDoubleClick = function (handle) {
      var img = new Image();
      img.src = imgsrc;
      img.onload = function () {
        cx.drawImage(img, 0, 0, Cwidth, Cheight);
      }
      handle.remove();
      redraw();
      return false;
    };

    updateConfigBox = function () {
      $('div.method-config').hide();
      return $("div#" + smoothConfig.method + "-config").show();
    };

    changeLanczosSlider = function (ev, ui) {
      smoothConfig.lanczosFilterSize = ui.value;
      $("#lanczosfiltersize").text(smoothConfig.lanczosFilterSize);
      return redraw();
    };

    changeCubicSlider = function (ev, ui) {

      smoothConfig.cubicTension = ui.value;
      $("#cubictension").text(smoothConfig.cubicTension.toFixed(1));
      return redraw();
    };

    addCurveSegment = function (context, i, points) {
      var averageLineLength, du, end, pieceCount, pieceLength, s, start, t, u, _ref, _ref2, _ref3;
      s = Smooth(points, smoothConfig);

      averageLineLength = 1;
      pieceCount = 2;
      for (t = 0, _ref = 1 / pieceCount; t < 1; t += _ref) {
        _ref2 = [s(i + t), s(i + t + 1 / pieceCount)], start = _ref2[0], end = _ref2[1];
        pieceLength = distance(start, end);
        du = averageLineLength / pieceLength;
        for (u = 0, _ref3 = 1 / pieceCount; 0 <= _ref3 ? u < _ref3 : u > _ref3; u += du) {

          context.lineTo.apply(context, s(i + t + u));
        }
      }

      return context.lineTo.apply(context, s(i + 1));
    };

    redraw = function () {
      var img = new Image();
      img.src = imgsrc;
      var i, lastIndex, points;


      points = getPoints();
      if (points.length >= 4) {

        let temppoints = sorted_points(points);
        points = [];
        for (let i = 0; i < temppoints.length; i++) {
          points.push([temppoints[i].x, temppoints[i].y]);
        }

      }

      //unevn cord fix and set
      if (points.length >= 4) {
        var s, numpoints, dsval;
        var bs = [];
        lastIndex = points.length - 1;
        if (smoothConfig.clip === 'periodic') lastIndex++;
        s = Smooth(points, smoothConfig);
        numpoints = 100;
        sessionStorage.setItem("cord" + frameIndex, "")
        let i = 0;
        var firstbxy;
        var lastcord;
        debugger
        for (let ds = 0; ds < lastIndex; ds += lastIndex / numpoints) {

          dsval = s(ds);
          bs.push(dsval);

          lastcord = sessionStorage.getItem("cord" + frameIndex);
          if (lastcord == "") {
            firstbxy = dsval;
          }
          var newb = lastcord != "" ? lastcord + "," + dsval : dsval;

          sessionStorage.setItem("cord" + frameIndex, newb.toString());

        }

        newb = lastcord + "," + firstbxy;
        sessionStorage.setItem("cord" + frameIndex, newb.toString());

      }
      console.log(bs);
      debugger
      //
      if (points.length >= 4) {
        cx.beginPath();
        cx.moveTo.apply(cx, points[0]);
        lastIndex = points.length - 1;
        if (smoothConfig.clip === 'periodic') lastIndex++;
        let i = 0;


        for (i = 0; 0 <= lastIndex ? i < lastIndex : i > lastIndex; 0 <= lastIndex ? i++ : i--) {
          addCurveSegment(cx, i, points);
        }
        img.onload = function () {
          cx.drawImage(img, 0, 0, Cwidth, Cheight);
          cx.lineWidth = 4;
          cx.strokeStyle = 'yellow';
          cx.lineJoin = 'round';
          cx.lineCap = 'round';
          return cx.stroke();
        }


      }
    };
    sortcord = function () {
      var realpoints = getPoints();
      var newpoints = [];
      var xCords = [];
      var yCords = [];
      if (realpoints.length > 3) {
        for (let i = 0; i < realpoints.length; i++) {

          xCords[i] = realpoints[i].toString().split(',')[0];
          yCords[i] = realpoints[i].toString().split(',')[1];
        }
        let iIndex = 0;
        do {

          let minx = parseFloat(xCords[0]);
          let xCordsIndex = 0;
          for (let i = 0; i < xCords.length; i++) {
            if (parseFloat(xCords[i]) < minx) {
              minx = parseFloat(xCords[i]);
              xCordsIndex = i;
            }
          }

          newpoints.push([parseFloat(xCords[xCordsIndex]), parseFloat(yCords[xCordsIndex])]);
          xCords.splice(xCordsIndex, 1);
          yCords.splice(xCordsIndex, 1);

          iIndex++;
        } while (xCords.length > 0)
        return newpoints;
      }





    };
    sorted_points = function (points) {

      let pointsnew = [];
      for (let i = 0; i < points.length; i++) {
        const cords = {
          'x': points[i][0],
          'y': points[i][1]
        }
        pointsnew.push(cords);
      }

      var stringify_point = function (p) { return p.x + ',' + p.y; };
      var avg_points = function (pts) {
        var x = 0;
        var y = 0;
        for (let i = 0; i < pts.length; i++) {
          x += pts[i].x;
          y += pts[i].y;
        }
        return { x: x / pts.length, y: y / pts.length };
      }
      var center = avg_points(pointsnew);

      // calculate the angle between each point and the centerpoint, and sort by those angles
      var angles = {};
      for (let i = 0; i < pointsnew.length; i++) {
        angles[stringify_point(pointsnew[i])] = Math.atan2(pointsnew[i].x - center.x, pointsnew[i].y - center.y);
      }
      pointsnew.sort(function (p1, p2) {
        return angles[stringify_point(p1)] - angles[stringify_point(p2)];
      });

      return pointsnew;
    };

    hitTest = function (x, y) {

      var i = 0, points, _ref;
      points = getPoints();

      hit_cx.clearRect(0, 0, canvas.width(), canvas.height());
      _ref = points.length;
      sessionStorage.setItem("cord" + frameIndex, "");

      for (i = 0, _ref = points.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        hit_cx.beginPath();
        hit_cx.moveTo(hit_cx, points[i]);
        addCurveSegment(hit_cx, i, points);
        hit_cx.color = "#FFFFFF";
        hit_cx.lineWidth = 20;
        hit_cx.lineCap = 'round';
        hit_cx.lineJoin = 'round';
        hit_cx.stroke();
        if (hit_cx.getImageData(x, y, 1, 1).data[3] === 255) {
          return i;
        }
      }
    };

    $(function () {

      plotBox = $('#plot-box');
      var can1 = "<canvas id='can1' width=" + Cwidth + " height=" + Cheight + " style='cursor:crosshair;'/>"
      var can2 = "<canvas width=" + Cwidth + " height=" + Cheight + " />"
      canvas = $(can1).appendTo(plotBox);

      cx = canvas[0].getContext('2d');
      hit_cx = $(can2).css({
        display: 'none'
      }).appendTo(plotBox)[0].getContext('2d');
      plotBox.dblclick(plotBoxDoubleClick);
      //plotBox.addEventListener('dblclick',plotBoxDoubleClick );

      $("#tension-slider").slider({
        min: 0,
        max: 1,
        step: .1,
        value: smoothConfig.cubicTension,
        slide: changeCubicSlider,
        change: changeCubicSlider
      });
      $("#lanczos-slider").slider({
        min: 2,
        max: 10,
        step: 1,
        value: smoothConfig.lanczosFilterSize,
        slide: changeLanczosSlider,
        change: changeLanczosSlider
      });
      $('#method').change(function () {
        smoothConfig.method = $('#method option:selected').val();
        updateConfigBox();
        return redraw();
      });
      $('#clip').change(function () {
        smoothConfig.clip = $('#clip option:selected').val();
        return redraw();
      });
      updateConfigBox();
      return redraw();
    });



  }

  frameconntect(arr1, ifram) {


    var AbstractInterpolator, CubicInterpolator, Enum, LinearInterpolator, NearestInterpolator, PI, SincFilterInterpolator,
      Smooth, clipClamp, clipMirror, clipPeriodic, defaultConfig, getColumn, getType, isValidNumber, k,
      makeLanczosWindow, makeScaledFunction, makeSincKernel, normalizeScaleTo, shallowCopy, sin, sinc, v,
      validateNumber, validateVector,
      addCurveSegment, canvas, changeCubicSlider, changeLanczosSlider, cx, distance, getHandlePoint, getHandles,
      getPoints, handleDoubleClick, hitTest, hit_cx, makeHandle, plotBox, plotBoxDoubleClick, redraw, smoothConfig, updateConfigBox,
      __slice = Array.prototype.slice, sortcord, sorted_points, redrawPoints,
      __hasProp = Object.prototype.hasOwnProperty,
      __extends = function (child, parent) {

        for (var key in parent) {
          if (__hasProp.call(parent, key))
            child[key] = parent[key];
        } function ctor() {
          this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child;
      };

    var element = document.getElementById('plot-box');

    Enum = {
      /*Interpolation methods*/
      METHOD_CUBIC: 'cubic',
      CLIP_PERIODIC: 'periodic',
      /* Constants for control over the cubic interpolation tension */
      CUBIC_TENSION_DEFAULT: 0,
      CUBIC_TENSION_CATMULL_ROM: 0
    };
    defaultConfig = {
      method: Enum.METHOD_CUBIC,
      cubicTension: Enum.CUBIC_TENSION_DEFAULT,
      clip: Enum.CLIP_CLAMP,
      scaleTo: 0,
      sincWindow: void 0
    };


    plotBox = null;

    canvas = null;

    cx = null;

    hit_cx = null;
    smoothConfig = {
      method: 'cubic',
      clip: 'periodic',
      cubicTension: 0
    };


    ////////////////////////
    distance = function (a, b) {
      if (a !== undefined && b !== undefined)
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    };



    clipClamp = function (i, n) {
      return Math.max(0, Math.min(i, n - 1));
    };

    clipPeriodic = function (i, n) {
      i = i % n;
      if (i < 0) i += n;
      return i;
    };

    clipMirror = function (i, n) {
      var period;
      period = 2 * (n - 1);
      i = clipPeriodic(i, period);
      if (i > n - 1) i = period - i;
      return i;
    };



    /*
      Abstract scalar interpolation class which provides common functionality for all interpolators
      
      Subclasses must override interpolate().
      */

    AbstractInterpolator = (function () {

      function AbstractInterpolator(array, config) {
        this.array = array.slice(0);
        this.length = this.array.length;
        if (!(this.clipHelper = {
          clamp: this.clipHelperClamp,
          zero: this.clipHelperZero,
          periodic: this.clipHelperPeriodic,
          mirror: this.clipHelperMirror
        }[config.clip])) {
          throw "Invalid clip: " + config.clip;
        }
      }

      AbstractInterpolator.prototype.getClippedInput = function (i) {
        if ((0 <= i && i < this.length)) {
          return this.array[i];
        } else {
          return this.clipHelper(i);
        }
      };

      AbstractInterpolator.prototype.clipHelperClamp = function (i) {
        return this.array[clipClamp(i, this.length)];
      };

      AbstractInterpolator.prototype.clipHelperZero = function (i) {
        return 0;
      };

      AbstractInterpolator.prototype.clipHelperPeriodic = function (i) {
        return this.array[clipPeriodic(i, this.length)];
      };

      AbstractInterpolator.prototype.clipHelperMirror = function (i) {
        return this.array[clipMirror(i, this.length)];
      };

      AbstractInterpolator.prototype.interpolate = function (t) {
        throw 'Subclasses of AbstractInterpolator must override the interpolate() method.';
      };

      return AbstractInterpolator;

    })();
    NearestInterpolator = (function (_super) {
      __extends(NearestInterpolator, _super);
      function NearestInterpolator() {
        _super.apply(this, arguments);
      }
      NearestInterpolator.prototype.interpolate = function (t) {
        return this.getClippedInput(Math.round(t));
      };
      return NearestInterpolator;
    })(AbstractInterpolator);
    LinearInterpolator = (function (_super) {
      __extends(LinearInterpolator, _super);
      function LinearInterpolator() {
        _super.apply(this, arguments);
      }
      LinearInterpolator.prototype.interpolate = function (t) {
        var k;
        k = Math.floor(t);
        t -= k;
        return (1 - t) * this.getClippedInput(k) + t * this.getClippedInput(k + 1);
      };
      return LinearInterpolator;
    })(AbstractInterpolator);

    CubicInterpolator = (function (_super) {

      __extends(CubicInterpolator, _super);
      function CubicInterpolator(array, config) {
        this.tangentFactor = 1 - Math.max(0, Math.min(1, config.cubicTension));
        _super.apply(this, arguments);
      }
      CubicInterpolator.prototype.getTangent = function (k) {
        return this.tangentFactor * (this.getClippedInput(k + 1) - this.getClippedInput(k - 1)) / 2;
      };
      CubicInterpolator.prototype.interpolate = function (t) {

        var k, m, p, t2, t3;
        k = Math.floor(t);
        m = [this.getTangent(k), this.getTangent(k + 1)];
        p = [this.getClippedInput(k), this.getClippedInput(k + 1)];
        t -= k;
        t2 = t * t;
        t3 = t * t2;
        var count = 1;

        return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];

      };

      return CubicInterpolator;
    })(AbstractInterpolator);
    sin = Math.sin, PI = Math.PI;
    sinc = function (x) {
      if (x === 0) {
        return 1;
      } else {
        return sin(PI * x) / (PI * x);
      }
    };

    makeLanczosWindow = function (a) {
      return function (x) {
        return sinc(x / a);
      };
    };

    makeSincKernel = function (window) {
      return function (x) {
        return sinc(x) * window(x);
      };
    };
    SincFilterInterpolator = (function (_super) {
      __extends(SincFilterInterpolator, _super);
      function SincFilterInterpolator(array, config) {

        _super.apply(this, arguments);
        this.a = config.sincFilterSize;
        window = config.sincWindow;
        if (!config.sincWindow) throw 'No sincWindow provided';
        this.kernel = makeSincKernel(config.sincWindow);
      }

      SincFilterInterpolator.prototype.interpolate = function (t) {
        var k, n, sum, _ref, _ref2;
        k = Math.floor(t);
        sum = 0;
        for (n = _ref = k - this.a + 1, _ref2 = k + this.a; _ref <= _ref2 ? n <= _ref2 : n >= _ref2; _ref <= _ref2 ? n++ : n--) {
          sum += this.kernel(t - n) * this.getClippedInput(n);
        }
        return sum;
      };
      return SincFilterInterpolator;
    })(AbstractInterpolator);
    getColumn = function (arr, i) {
      var row, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        row = arr[_i];
        _results.push(row[i]);
      }
      return _results;
    };
    makeScaledFunction = function (f, baseScale, scaleRange) {
      var scaleFactor, translation;
      if (scaleRange.join === '0,1') {
        return f;
      } else {
        scaleFactor = baseScale / (scaleRange[1] - scaleRange[0]);
        translation = scaleRange[0];
        return function (t) {
          return f(scaleFactor * (t - translation));
        };
      }
    };
    getType = function (x) {
      return Object.prototype.toString.call(x).slice('[object '.length, -1);
    };
    validateNumber = function (n) {
      if (isNaN(n)) throw 'NaN in Smooth() input';
      if (getType(n) !== 'Number') throw 'Non-number in Smooth() input';
      if (!isFinite(n)) throw 'Infinity in Smooth() input';
    };
    validateVector = function (v, dimension) {
      var n, _i, _len;
      if (getType(v) !== 'Array') throw 'Non-vector in Smooth() input';
      if (v.length !== dimension) throw 'Inconsistent dimension in Smooth() input';
      for (_i = 0, _len = v.length; _i < _len; _i++) {
        n = v[_i];
        validateNumber(n);
      }
    };
    isValidNumber = function (n) {
      return (getType(n) === 'Number') && isFinite(n) && !isNaN(n);
    };
    normalizeScaleTo = function (s) {
      var invalidErr;
      invalidErr = "scaleTo param must be number or array of two numbers";
      switch (getType(s)) {
        case 'Number':
          if (!isValidNumber(s)) throw invalidErr;
          s = [0, s];
          break;
        case 'Array':
          if (s.length !== 2) throw invalidErr;
          if (!(isValidNumber(s[0]) && isValidNumber(s[1]))) throw invalidErr;
          break;
        default:
          throw invalidErr;
      }
      return s;
    };
    shallowCopy = function (obj) {
      var copy, k, v;
      copy = {};
      for (k in obj) {
        if (!__hasProp.call(obj, k)) continue;
        v = obj[k];
        copy[k] = v;
      }
      return copy;
    };

    Smooth = function (arr, config) {
      var baseDomainEnd, dimension, i, interpolator, interpolatorClass, interpolators, k, n, properties, smoothFunc, v;
      if (config == null) config = {};
      properties = {};
      config = shallowCopy(config);
      properties.config = shallowCopy(config);
      if (config.scaleTo == null) config.scaleTo = config.period;
      if (config.sincFilterSize == null) {
        config.sincFilterSize = config.lanczosFilterSize;
      }
      for (k in defaultConfig) {
        if (!__hasProp.call(defaultConfig, k)) continue;
        v = defaultConfig[k];
        if (config[k] == null) config[k] = v;
      }
      if (!(interpolatorClass = {
        nearest: NearestInterpolator,
        linear: LinearInterpolator,
        cubic: CubicInterpolator,
        lanczos: SincFilterInterpolator,
        sinc: SincFilterInterpolator
      }[config.method])) {
        throw "Invalid method: " + config.method;
      }
      if (config.method === 'lanczos') {
        config.sincWindow = makeLanczosWindow(config.sincFilterSize);
      }
      if (arr.length < 1) throw 'Array must have at least two elements';
      properties.count = arr.length;
      smoothFunc = (function () {
        var _i, _j, _len, _len2;
        switch (getType(arr[0])) {
          case 'Number':
            properties.dimension = 'scalar';
            if (Smooth.deepValidation) {
              for (_i = 0, _len = arr.length; _i < _len; _i++) {
                n = arr[_i];
                validateNumber(n);
              }
            }
            interpolator = new interpolatorClass(arr, config);
            return function (t) {
              return interpolator.interpolate(t);
            };
          case 'Array':
            properties.dimension = dimension = arr[0].length;
            if (!dimension) throw 'Vectors must be non-empty';
            if (Smooth.deepValidation) {
              for (_j = 0, _len2 = arr.length; _j < _len2; _j++) {
                v = arr[_j];
                validateVector(v, dimension);
              }
            }
            interpolators = (function () {

              var _results;
              _results = [];
              for (i = 0; 0 <= dimension ? i < dimension : i > dimension; 0 <= dimension ? i++ : i--) {
                _results.push(new interpolatorClass(getColumn(arr, i), config));
              }
              return _results;
            })();
            return function (t) {
              var interpolator, _k, _len3, _results;
              _results = [];
              for (_k = 0, _len3 = interpolators.length; _k < _len3; _k++) {
                interpolator = interpolators[_k];
                _results.push(interpolator.interpolate(t));
              }
              return _results;
            };
          default:
            throw "Invalid element type: " + (getType(arr[0]));
        }
      })();
      if (config.clip === 'periodic') {
        baseDomainEnd = arr.length;
      } else {
        baseDomainEnd = arr.length - 1;
      }
      config.scaleTo || (config.scaleTo = baseDomainEnd);
      properties.domain = normalizeScaleTo(config.scaleTo);
      smoothFunc = makeScaledFunction(smoothFunc, baseDomainEnd, properties.domain);
      properties.domain.sort();
      /*copy properties
      */
      for (k in properties) {
        if (!__hasProp.call(properties, k)) continue;
        v = properties[k];
        smoothFunc[k] = v;
      }
      return smoothFunc;
    };

    for (k in Enum) {
      if (!__hasProp.call(Enum, k)) continue;
      v = Enum[k];
      Smooth[k] = v;
    }

    Smooth.deepValidation = true;

    (typeof exports !== "undefined" && exports !== null ? exports : window).Smooth = Smooth;

    getHandles = function () {
      return plotBox.children('div.handle2');
    };

    getHandlePoint = function (handle) {
      var left, top, _ref;
      _ref = $(handle).position(),
        top = _ref.top, left = _ref.left;
      return [left + 6, top + 6];
    };

    getPoints = function () {

      var handle, _i, _len, _ref, _results;
      _ref = getHandles();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        handle = _ref[_i];
        _results.push(getHandlePoint(handle));
      }

      return _results;
    };

    makeHandle = function (x, y) {

      var handle;
      if (sessionStorage.getItem('diff') == '100') {

        let nx = (x / 2) - 6;
        let ny = (y / 2) - 6;
        $('<div/>').addClass('handle2').appendTo(plotBox).css({
          left: nx,
          top: ny

        });
      }
      else if (sessionStorage.getItem('diff') == '20') {

        let nx = ((x / 100) * 20) - 6;
        let ny = ((x / 100) * 20) - 6;
        $('<div/>').addClass('handle2').appendTo(plotBox).css({
          left: nx,
          top: ny

        });
      }
      handle = $('<div/>').addClass('handle').appendTo(plotBox).css({
        left: x - 6,
        top: y - 6

      });
      handle.draggable(
        {
          drag: redraw,
          stop: redraw
        });
      handle.dblclick(function (ev) {

        return handleDoubleClick(handle);
      });

      handle.css({
        position: 'absolute'
      });
      redraw();
      return handle;
    };

    plotBoxDoubleClick = function (ev) {


      /* Add a new handle at the clicked location
      */
      var first, last, middle, newHandle, newPoint, offset, segmentStartHandle, x, y, _i, _ref, _ref2;
      offset = plotBox.offset();

      _ref = [ev.pageX - offset.left, ev.pageY - offset.top], x = _ref[0], y = _ref[1];
      segmentStartHandle = getHandles()[hitTest(x, y)];
      newHandle = makeHandle(x, y);
      if (segmentStartHandle != null) {
        newHandle.insertAfter($(segmentStartHandle));
      } else {
        _ref2 = getPoints(), first = _ref2[0], middle = 4 <= _ref2.length ? __slice.call(_ref2, 1, _i = _ref2.length - 2) : (_i = 1, []), last = _ref2[_i++], newPoint = _ref2[_i++];
        if (distance(first, newPoint) < distance(last, newPoint)) {

          newHandle.insertBefore($(getHandles()[0]));
        }
      }
      redraw();
      return false;
    };

    handleDoubleClick = function (handle) {

      handle.remove();
      redraw();
      return false;
    };

    updateConfigBox = function () {
      $('div.method-config').hide();
      return $("div#" + smoothConfig.method + "-config").show();
    };

    changeLanczosSlider = function (ev, ui) {
      smoothConfig.lanczosFilterSize = ui.value;
      $("#lanczosfiltersize").text(smoothConfig.lanczosFilterSize);
      return redraw();
    };

    changeCubicSlider = function (ev, ui) {

      smoothConfig.cubicTension = ui.value;
      $("#cubictension").text(smoothConfig.cubicTension.toFixed(1));
      return redraw();
    };

    addCurveSegment = function (context, i, points) {

      var averageLineLength, du, end, pieceCount, pieceLength, s, start, t, u, _ref, _ref2, _ref3;
      s = Smooth(points, smoothConfig);

      averageLineLength = 1;
      pieceCount = 2;


      for (t = 0, _ref = 1 / pieceCount; t < 1; t += _ref) {

        _ref2 = [s(i + t), s(i + t + 1 / pieceCount)], start = _ref2[0], end = _ref2[1];
        pieceLength = distance(start, end);
        du = averageLineLength / pieceLength;


        for (u = 0, _ref3 = 1 / pieceCount; 0 <= _ref3 ? u < _ref3 : u > _ref3; u += du) {

          // if (points.length > 1) {
          // var lastcord = sessionStorage.getItem("cordC" + ifram);

          // if (lastcord != null) {
          //   if (!lastcord.includes(s(i + t + u).toString())) {

          //     var newb = lastcord != "" ? lastcord + "," + s(i + t + u) : s(i + t + u);
          //     sessionStorage.setItem("cordC" + ifram, newb.toString());

          //   }
          // }
          // else {
          // sessionStorage.setItem("cordC" + ifram, s(i + t + u).toString());

          //}

          //}

          context.lineTo.apply(context, s(i + t + u));
        }
      }

      return context.lineTo.apply(context, s(i + 1));
    };

    redraw = function () {

      var i, lastIndex, points;

      //sessionStorage.setItem("cordC", "")
      points = getPoints();
      if (points.length >= 1) {

        let temppoints = sorted_points(points);
        points = [];
        for (let i = 0; i < temppoints.length; i++) {
          points.push([temppoints[i].x, temppoints[i].y]);
        }

      }


      if (points.length >= 1) {
        cx.beginPath();
        cx.moveTo.apply(cx, points[0]);
        lastIndex = points.length - 1;
        if (smoothConfig.clip === 'periodic') lastIndex++;
        let i = 0;

        // sessionStorage.setItem("cordC", "");
        for (i = 0; 0 <= lastIndex ? i < lastIndex : i > lastIndex; 0 <= lastIndex ? i++ : i--) {
          addCurveSegment(cx, i, points);
        }



      }
    };
    sortcord = function () {
      var realpoints = arr1;
      var newpoints = [];
      var xCords = [];
      var yCords = [];
      if (realpoints.length > 1) {
        for (let i = 0; i < realpoints.length; i++) {

          xCords[i] = realpoints[i].toString().split(',')[0];
          yCords[i] = realpoints[i].toString().split(',')[1];
        }
        let iIndex = 0;
        do {

          let minx = parseFloat(xCords[0]);
          let xCordsIndex = 0;
          for (let i = 0; i < xCords.length; i++) {
            if (parseFloat(xCords[i]) < minx) {
              minx = parseFloat(xCords[i]);
              xCordsIndex = i;
            }
          }

          newpoints.push([parseFloat(xCords[xCordsIndex]), parseFloat(yCords[xCordsIndex])]);
          xCords.splice(xCordsIndex, 1);
          yCords.splice(xCordsIndex, 1);

          iIndex++;
        } while (xCords.length > 0)
        return newpoints;
      }





    };
    sorted_points = function (points) {

      let pointsnew = [];
      for (let i = 0; i < points.length; i++) {
        const cords = {
          'x': points[i][0],
          'y': points[i][1]
        }
        pointsnew.push(cords);
      }

      var stringify_point = function (p) { return p.x + ',' + p.y; };
      var avg_points = function (pts) {
        var x = 0;
        var y = 0;
        for (let i = 0; i < pts.length; i++) {
          x += pts[i].x;
          y += pts[i].y;
        }
        return { x: x / pts.length, y: y / pts.length };
      }
      var center = avg_points(pointsnew);

      // calculate the angle between each point and the centerpoint, and sort by those angles
      var angles = {};
      for (let i = 0; i < pointsnew.length; i++) {
        angles[stringify_point(pointsnew[i])] = Math.atan2(pointsnew[i].x - center.x, pointsnew[i].y - center.y);
      }
      pointsnew.sort(function (p1, p2) {
        return angles[stringify_point(p1)] - angles[stringify_point(p2)];
      });

      return pointsnew;
    };

    hitTest = function (x, y) {

      var i = 0, points, _ref;
      points = arr1;

      hit_cx.clearRect(0, 0, canvas.width(), canvas.height());
      _ref = points.length;
      //sessionStorage.setItem("cordC" ,  "");

      for (i = 0, _ref = points.length; 0 <= _ref ? i < _ref : i > _ref; 0 <= _ref ? i++ : i--) {
        hit_cx.beginPath();
        hit_cx.moveTo(hit_cx, points[i]);
        addCurveSegment(hit_cx, i, points);
        hit_cx.color = "#FFFFFF";
        hit_cx.lineWidth = 20;
        hit_cx.lineCap = 'round';
        hit_cx.lineJoin = 'round';
        hit_cx.stroke();
        if (hit_cx.getImageData(x, y, 1, 1).data[3] === 255) {
          return i;
        }
      }
    };

    $(function () {

      plotBox = $('#btntest');
      var can1 = "<canvas id='can12' width=600 height=480 style='cursor:crosshair;'/>"
      var can2 = "<canvas width=600 height=480 />"
      canvas = $(can1).appendTo(plotBox);

      cx = canvas[0].getContext('2d');
      hit_cx = $(can2).css({
        display: 'none'
      }).appendTo(plotBox)[0].getContext('2d');

      plotBox.dblclick(plotBoxDoubleClick);
      //plotBox.addEventListener('dblclick',plotBoxDoubleClick );

      $("#tension-slider").slider({
        min: 0,
        max: 1,
        step: .1,
        value: smoothConfig.cubicTension,
        slide: changeCubicSlider,
        change: changeCubicSlider
      });
      $("#lanczos-slider").slider({
        min: 2,
        max: 10,
        step: 1,
        value: smoothConfig.lanczosFilterSize,
        slide: changeLanczosSlider,
        change: changeLanczosSlider
      });
      $('#method').change(function () {
        smoothConfig.method = $('#method option:selected').val();
        updateConfigBox();
        return redraw();
      });
      $('#clip').change(function () {
        smoothConfig.clip = $('#clip option:selected').val();
        return redraw();
      });
      updateConfigBox();
      return redraw();
    });



  }

}
