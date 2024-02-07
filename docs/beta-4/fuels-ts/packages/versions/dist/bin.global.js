#!/usr/bin/env node
"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined")
      return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + x + '" is not supported');
  });
  var __commonJS = (cb, mod) => function __require2() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // ../../node_modules/.pnpm/color-name@1.1.4/node_modules/color-name/index.js
  var require_color_name = __commonJS({
    "../../node_modules/.pnpm/color-name@1.1.4/node_modules/color-name/index.js"(exports, module) {
      "use strict";
      module.exports = {
        "aliceblue": [240, 248, 255],
        "antiquewhite": [250, 235, 215],
        "aqua": [0, 255, 255],
        "aquamarine": [127, 255, 212],
        "azure": [240, 255, 255],
        "beige": [245, 245, 220],
        "bisque": [255, 228, 196],
        "black": [0, 0, 0],
        "blanchedalmond": [255, 235, 205],
        "blue": [0, 0, 255],
        "blueviolet": [138, 43, 226],
        "brown": [165, 42, 42],
        "burlywood": [222, 184, 135],
        "cadetblue": [95, 158, 160],
        "chartreuse": [127, 255, 0],
        "chocolate": [210, 105, 30],
        "coral": [255, 127, 80],
        "cornflowerblue": [100, 149, 237],
        "cornsilk": [255, 248, 220],
        "crimson": [220, 20, 60],
        "cyan": [0, 255, 255],
        "darkblue": [0, 0, 139],
        "darkcyan": [0, 139, 139],
        "darkgoldenrod": [184, 134, 11],
        "darkgray": [169, 169, 169],
        "darkgreen": [0, 100, 0],
        "darkgrey": [169, 169, 169],
        "darkkhaki": [189, 183, 107],
        "darkmagenta": [139, 0, 139],
        "darkolivegreen": [85, 107, 47],
        "darkorange": [255, 140, 0],
        "darkorchid": [153, 50, 204],
        "darkred": [139, 0, 0],
        "darksalmon": [233, 150, 122],
        "darkseagreen": [143, 188, 143],
        "darkslateblue": [72, 61, 139],
        "darkslategray": [47, 79, 79],
        "darkslategrey": [47, 79, 79],
        "darkturquoise": [0, 206, 209],
        "darkviolet": [148, 0, 211],
        "deeppink": [255, 20, 147],
        "deepskyblue": [0, 191, 255],
        "dimgray": [105, 105, 105],
        "dimgrey": [105, 105, 105],
        "dodgerblue": [30, 144, 255],
        "firebrick": [178, 34, 34],
        "floralwhite": [255, 250, 240],
        "forestgreen": [34, 139, 34],
        "fuchsia": [255, 0, 255],
        "gainsboro": [220, 220, 220],
        "ghostwhite": [248, 248, 255],
        "gold": [255, 215, 0],
        "goldenrod": [218, 165, 32],
        "gray": [128, 128, 128],
        "green": [0, 128, 0],
        "greenyellow": [173, 255, 47],
        "grey": [128, 128, 128],
        "honeydew": [240, 255, 240],
        "hotpink": [255, 105, 180],
        "indianred": [205, 92, 92],
        "indigo": [75, 0, 130],
        "ivory": [255, 255, 240],
        "khaki": [240, 230, 140],
        "lavender": [230, 230, 250],
        "lavenderblush": [255, 240, 245],
        "lawngreen": [124, 252, 0],
        "lemonchiffon": [255, 250, 205],
        "lightblue": [173, 216, 230],
        "lightcoral": [240, 128, 128],
        "lightcyan": [224, 255, 255],
        "lightgoldenrodyellow": [250, 250, 210],
        "lightgray": [211, 211, 211],
        "lightgreen": [144, 238, 144],
        "lightgrey": [211, 211, 211],
        "lightpink": [255, 182, 193],
        "lightsalmon": [255, 160, 122],
        "lightseagreen": [32, 178, 170],
        "lightskyblue": [135, 206, 250],
        "lightslategray": [119, 136, 153],
        "lightslategrey": [119, 136, 153],
        "lightsteelblue": [176, 196, 222],
        "lightyellow": [255, 255, 224],
        "lime": [0, 255, 0],
        "limegreen": [50, 205, 50],
        "linen": [250, 240, 230],
        "magenta": [255, 0, 255],
        "maroon": [128, 0, 0],
        "mediumaquamarine": [102, 205, 170],
        "mediumblue": [0, 0, 205],
        "mediumorchid": [186, 85, 211],
        "mediumpurple": [147, 112, 219],
        "mediumseagreen": [60, 179, 113],
        "mediumslateblue": [123, 104, 238],
        "mediumspringgreen": [0, 250, 154],
        "mediumturquoise": [72, 209, 204],
        "mediumvioletred": [199, 21, 133],
        "midnightblue": [25, 25, 112],
        "mintcream": [245, 255, 250],
        "mistyrose": [255, 228, 225],
        "moccasin": [255, 228, 181],
        "navajowhite": [255, 222, 173],
        "navy": [0, 0, 128],
        "oldlace": [253, 245, 230],
        "olive": [128, 128, 0],
        "olivedrab": [107, 142, 35],
        "orange": [255, 165, 0],
        "orangered": [255, 69, 0],
        "orchid": [218, 112, 214],
        "palegoldenrod": [238, 232, 170],
        "palegreen": [152, 251, 152],
        "paleturquoise": [175, 238, 238],
        "palevioletred": [219, 112, 147],
        "papayawhip": [255, 239, 213],
        "peachpuff": [255, 218, 185],
        "peru": [205, 133, 63],
        "pink": [255, 192, 203],
        "plum": [221, 160, 221],
        "powderblue": [176, 224, 230],
        "purple": [128, 0, 128],
        "rebeccapurple": [102, 51, 153],
        "red": [255, 0, 0],
        "rosybrown": [188, 143, 143],
        "royalblue": [65, 105, 225],
        "saddlebrown": [139, 69, 19],
        "salmon": [250, 128, 114],
        "sandybrown": [244, 164, 96],
        "seagreen": [46, 139, 87],
        "seashell": [255, 245, 238],
        "sienna": [160, 82, 45],
        "silver": [192, 192, 192],
        "skyblue": [135, 206, 235],
        "slateblue": [106, 90, 205],
        "slategray": [112, 128, 144],
        "slategrey": [112, 128, 144],
        "snow": [255, 250, 250],
        "springgreen": [0, 255, 127],
        "steelblue": [70, 130, 180],
        "tan": [210, 180, 140],
        "teal": [0, 128, 128],
        "thistle": [216, 191, 216],
        "tomato": [255, 99, 71],
        "turquoise": [64, 224, 208],
        "violet": [238, 130, 238],
        "wheat": [245, 222, 179],
        "white": [255, 255, 255],
        "whitesmoke": [245, 245, 245],
        "yellow": [255, 255, 0],
        "yellowgreen": [154, 205, 50]
      };
    }
  });

  // ../../node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/conversions.js
  var require_conversions = __commonJS({
    "../../node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/conversions.js"(exports, module) {
      var cssKeywords = require_color_name();
      var reverseKeywords = {};
      for (const key of Object.keys(cssKeywords)) {
        reverseKeywords[cssKeywords[key]] = key;
      }
      var convert = {
        rgb: { channels: 3, labels: "rgb" },
        hsl: { channels: 3, labels: "hsl" },
        hsv: { channels: 3, labels: "hsv" },
        hwb: { channels: 3, labels: "hwb" },
        cmyk: { channels: 4, labels: "cmyk" },
        xyz: { channels: 3, labels: "xyz" },
        lab: { channels: 3, labels: "lab" },
        lch: { channels: 3, labels: "lch" },
        hex: { channels: 1, labels: ["hex"] },
        keyword: { channels: 1, labels: ["keyword"] },
        ansi16: { channels: 1, labels: ["ansi16"] },
        ansi256: { channels: 1, labels: ["ansi256"] },
        hcg: { channels: 3, labels: ["h", "c", "g"] },
        apple: { channels: 3, labels: ["r16", "g16", "b16"] },
        gray: { channels: 1, labels: ["gray"] }
      };
      module.exports = convert;
      for (const model of Object.keys(convert)) {
        if (!("channels" in convert[model])) {
          throw new Error("missing channels property: " + model);
        }
        if (!("labels" in convert[model])) {
          throw new Error("missing channel labels property: " + model);
        }
        if (convert[model].labels.length !== convert[model].channels) {
          throw new Error("channel and label counts mismatch: " + model);
        }
        const { channels, labels } = convert[model];
        delete convert[model].channels;
        delete convert[model].labels;
        Object.defineProperty(convert[model], "channels", { value: channels });
        Object.defineProperty(convert[model], "labels", { value: labels });
      }
      convert.rgb.hsl = function(rgb) {
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        const delta = max - min;
        let h;
        let s;
        if (max === min) {
          h = 0;
        } else if (r === max) {
          h = (g - b) / delta;
        } else if (g === max) {
          h = 2 + (b - r) / delta;
        } else if (b === max) {
          h = 4 + (r - g) / delta;
        }
        h = Math.min(h * 60, 360);
        if (h < 0) {
          h += 360;
        }
        const l = (min + max) / 2;
        if (max === min) {
          s = 0;
        } else if (l <= 0.5) {
          s = delta / (max + min);
        } else {
          s = delta / (2 - max - min);
        }
        return [h, s * 100, l * 100];
      };
      convert.rgb.hsv = function(rgb) {
        let rdif;
        let gdif;
        let bdif;
        let h;
        let s;
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const v = Math.max(r, g, b);
        const diff = v - Math.min(r, g, b);
        const diffc = function(c) {
          return (v - c) / 6 / diff + 1 / 2;
        };
        if (diff === 0) {
          h = 0;
          s = 0;
        } else {
          s = diff / v;
          rdif = diffc(r);
          gdif = diffc(g);
          bdif = diffc(b);
          if (r === v) {
            h = bdif - gdif;
          } else if (g === v) {
            h = 1 / 3 + rdif - bdif;
          } else if (b === v) {
            h = 2 / 3 + gdif - rdif;
          }
          if (h < 0) {
            h += 1;
          } else if (h > 1) {
            h -= 1;
          }
        }
        return [
          h * 360,
          s * 100,
          v * 100
        ];
      };
      convert.rgb.hwb = function(rgb) {
        const r = rgb[0];
        const g = rgb[1];
        let b = rgb[2];
        const h = convert.rgb.hsl(rgb)[0];
        const w = 1 / 255 * Math.min(r, Math.min(g, b));
        b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
        return [h, w * 100, b * 100];
      };
      convert.rgb.cmyk = function(rgb) {
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const k = Math.min(1 - r, 1 - g, 1 - b);
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;
        return [c * 100, m * 100, y * 100, k * 100];
      };
      function comparativeDistance(x, y) {
        return (x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2 + (x[2] - y[2]) ** 2;
      }
      convert.rgb.keyword = function(rgb) {
        const reversed = reverseKeywords[rgb];
        if (reversed) {
          return reversed;
        }
        let currentClosestDistance = Infinity;
        let currentClosestKeyword;
        for (const keyword of Object.keys(cssKeywords)) {
          const value = cssKeywords[keyword];
          const distance = comparativeDistance(rgb, value);
          if (distance < currentClosestDistance) {
            currentClosestDistance = distance;
            currentClosestKeyword = keyword;
          }
        }
        return currentClosestKeyword;
      };
      convert.keyword.rgb = function(keyword) {
        return cssKeywords[keyword];
      };
      convert.rgb.xyz = function(rgb) {
        let r = rgb[0] / 255;
        let g = rgb[1] / 255;
        let b = rgb[2] / 255;
        r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
        g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
        b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;
        const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
        const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
        const z = r * 0.0193 + g * 0.1192 + b * 0.9505;
        return [x * 100, y * 100, z * 100];
      };
      convert.rgb.lab = function(rgb) {
        const xyz = convert.rgb.xyz(rgb);
        let x = xyz[0];
        let y = xyz[1];
        let z = xyz[2];
        x /= 95.047;
        y /= 100;
        z /= 108.883;
        x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
        y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
        z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
        const l = 116 * y - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);
        return [l, a, b];
      };
      convert.hsl.rgb = function(hsl) {
        const h = hsl[0] / 360;
        const s = hsl[1] / 100;
        const l = hsl[2] / 100;
        let t2;
        let t3;
        let val;
        if (s === 0) {
          val = l * 255;
          return [val, val, val];
        }
        if (l < 0.5) {
          t2 = l * (1 + s);
        } else {
          t2 = l + s - l * s;
        }
        const t1 = 2 * l - t2;
        const rgb = [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          t3 = h + 1 / 3 * -(i - 1);
          if (t3 < 0) {
            t3++;
          }
          if (t3 > 1) {
            t3--;
          }
          if (6 * t3 < 1) {
            val = t1 + (t2 - t1) * 6 * t3;
          } else if (2 * t3 < 1) {
            val = t2;
          } else if (3 * t3 < 2) {
            val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
          } else {
            val = t1;
          }
          rgb[i] = val * 255;
        }
        return rgb;
      };
      convert.hsl.hsv = function(hsl) {
        const h = hsl[0];
        let s = hsl[1] / 100;
        let l = hsl[2] / 100;
        let smin = s;
        const lmin = Math.max(l, 0.01);
        l *= 2;
        s *= l <= 1 ? l : 2 - l;
        smin *= lmin <= 1 ? lmin : 2 - lmin;
        const v = (l + s) / 2;
        const sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
        return [h, sv * 100, v * 100];
      };
      convert.hsv.rgb = function(hsv) {
        const h = hsv[0] / 60;
        const s = hsv[1] / 100;
        let v = hsv[2] / 100;
        const hi = Math.floor(h) % 6;
        const f = h - Math.floor(h);
        const p = 255 * v * (1 - s);
        const q = 255 * v * (1 - s * f);
        const t = 255 * v * (1 - s * (1 - f));
        v *= 255;
        switch (hi) {
          case 0:
            return [v, t, p];
          case 1:
            return [q, v, p];
          case 2:
            return [p, v, t];
          case 3:
            return [p, q, v];
          case 4:
            return [t, p, v];
          case 5:
            return [v, p, q];
        }
      };
      convert.hsv.hsl = function(hsv) {
        const h = hsv[0];
        const s = hsv[1] / 100;
        const v = hsv[2] / 100;
        const vmin = Math.max(v, 0.01);
        let sl;
        let l;
        l = (2 - s) * v;
        const lmin = (2 - s) * vmin;
        sl = s * vmin;
        sl /= lmin <= 1 ? lmin : 2 - lmin;
        sl = sl || 0;
        l /= 2;
        return [h, sl * 100, l * 100];
      };
      convert.hwb.rgb = function(hwb) {
        const h = hwb[0] / 360;
        let wh = hwb[1] / 100;
        let bl = hwb[2] / 100;
        const ratio = wh + bl;
        let f;
        if (ratio > 1) {
          wh /= ratio;
          bl /= ratio;
        }
        const i = Math.floor(6 * h);
        const v = 1 - bl;
        f = 6 * h - i;
        if ((i & 1) !== 0) {
          f = 1 - f;
        }
        const n = wh + f * (v - wh);
        let r;
        let g;
        let b;
        switch (i) {
          default:
          case 6:
          case 0:
            r = v;
            g = n;
            b = wh;
            break;
          case 1:
            r = n;
            g = v;
            b = wh;
            break;
          case 2:
            r = wh;
            g = v;
            b = n;
            break;
          case 3:
            r = wh;
            g = n;
            b = v;
            break;
          case 4:
            r = n;
            g = wh;
            b = v;
            break;
          case 5:
            r = v;
            g = wh;
            b = n;
            break;
        }
        return [r * 255, g * 255, b * 255];
      };
      convert.cmyk.rgb = function(cmyk) {
        const c = cmyk[0] / 100;
        const m = cmyk[1] / 100;
        const y = cmyk[2] / 100;
        const k = cmyk[3] / 100;
        const r = 1 - Math.min(1, c * (1 - k) + k);
        const g = 1 - Math.min(1, m * (1 - k) + k);
        const b = 1 - Math.min(1, y * (1 - k) + k);
        return [r * 255, g * 255, b * 255];
      };
      convert.xyz.rgb = function(xyz) {
        const x = xyz[0] / 100;
        const y = xyz[1] / 100;
        const z = xyz[2] / 100;
        let r;
        let g;
        let b;
        r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        g = x * -0.9689 + y * 1.8758 + z * 0.0415;
        b = x * 0.0557 + y * -0.204 + z * 1.057;
        r = r > 31308e-7 ? 1.055 * r ** (1 / 2.4) - 0.055 : r * 12.92;
        g = g > 31308e-7 ? 1.055 * g ** (1 / 2.4) - 0.055 : g * 12.92;
        b = b > 31308e-7 ? 1.055 * b ** (1 / 2.4) - 0.055 : b * 12.92;
        r = Math.min(Math.max(0, r), 1);
        g = Math.min(Math.max(0, g), 1);
        b = Math.min(Math.max(0, b), 1);
        return [r * 255, g * 255, b * 255];
      };
      convert.xyz.lab = function(xyz) {
        let x = xyz[0];
        let y = xyz[1];
        let z = xyz[2];
        x /= 95.047;
        y /= 100;
        z /= 108.883;
        x = x > 8856e-6 ? x ** (1 / 3) : 7.787 * x + 16 / 116;
        y = y > 8856e-6 ? y ** (1 / 3) : 7.787 * y + 16 / 116;
        z = z > 8856e-6 ? z ** (1 / 3) : 7.787 * z + 16 / 116;
        const l = 116 * y - 16;
        const a = 500 * (x - y);
        const b = 200 * (y - z);
        return [l, a, b];
      };
      convert.lab.xyz = function(lab) {
        const l = lab[0];
        const a = lab[1];
        const b = lab[2];
        let x;
        let y;
        let z;
        y = (l + 16) / 116;
        x = a / 500 + y;
        z = y - b / 200;
        const y2 = y ** 3;
        const x2 = x ** 3;
        const z2 = z ** 3;
        y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
        x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
        z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
        x *= 95.047;
        y *= 100;
        z *= 108.883;
        return [x, y, z];
      };
      convert.lab.lch = function(lab) {
        const l = lab[0];
        const a = lab[1];
        const b = lab[2];
        let h;
        const hr = Math.atan2(b, a);
        h = hr * 360 / 2 / Math.PI;
        if (h < 0) {
          h += 360;
        }
        const c = Math.sqrt(a * a + b * b);
        return [l, c, h];
      };
      convert.lch.lab = function(lch) {
        const l = lch[0];
        const c = lch[1];
        const h = lch[2];
        const hr = h / 360 * 2 * Math.PI;
        const a = c * Math.cos(hr);
        const b = c * Math.sin(hr);
        return [l, a, b];
      };
      convert.rgb.ansi16 = function(args, saturation = null) {
        const [r, g, b] = args;
        let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation;
        value = Math.round(value / 50);
        if (value === 0) {
          return 30;
        }
        let ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));
        if (value === 2) {
          ansi += 60;
        }
        return ansi;
      };
      convert.hsv.ansi16 = function(args) {
        return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
      };
      convert.rgb.ansi256 = function(args) {
        const r = args[0];
        const g = args[1];
        const b = args[2];
        if (r === g && g === b) {
          if (r < 8) {
            return 16;
          }
          if (r > 248) {
            return 231;
          }
          return Math.round((r - 8) / 247 * 24) + 232;
        }
        const ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
        return ansi;
      };
      convert.ansi16.rgb = function(args) {
        let color = args % 10;
        if (color === 0 || color === 7) {
          if (args > 50) {
            color += 3.5;
          }
          color = color / 10.5 * 255;
          return [color, color, color];
        }
        const mult = (~~(args > 50) + 1) * 0.5;
        const r = (color & 1) * mult * 255;
        const g = (color >> 1 & 1) * mult * 255;
        const b = (color >> 2 & 1) * mult * 255;
        return [r, g, b];
      };
      convert.ansi256.rgb = function(args) {
        if (args >= 232) {
          const c = (args - 232) * 10 + 8;
          return [c, c, c];
        }
        args -= 16;
        let rem;
        const r = Math.floor(args / 36) / 5 * 255;
        const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
        const b = rem % 6 / 5 * 255;
        return [r, g, b];
      };
      convert.rgb.hex = function(args) {
        const integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
        const string = integer.toString(16).toUpperCase();
        return "000000".substring(string.length) + string;
      };
      convert.hex.rgb = function(args) {
        const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!match) {
          return [0, 0, 0];
        }
        let colorString = match[0];
        if (match[0].length === 3) {
          colorString = colorString.split("").map((char) => {
            return char + char;
          }).join("");
        }
        const integer = parseInt(colorString, 16);
        const r = integer >> 16 & 255;
        const g = integer >> 8 & 255;
        const b = integer & 255;
        return [r, g, b];
      };
      convert.rgb.hcg = function(rgb) {
        const r = rgb[0] / 255;
        const g = rgb[1] / 255;
        const b = rgb[2] / 255;
        const max = Math.max(Math.max(r, g), b);
        const min = Math.min(Math.min(r, g), b);
        const chroma = max - min;
        let grayscale;
        let hue;
        if (chroma < 1) {
          grayscale = min / (1 - chroma);
        } else {
          grayscale = 0;
        }
        if (chroma <= 0) {
          hue = 0;
        } else if (max === r) {
          hue = (g - b) / chroma % 6;
        } else if (max === g) {
          hue = 2 + (b - r) / chroma;
        } else {
          hue = 4 + (r - g) / chroma;
        }
        hue /= 6;
        hue %= 1;
        return [hue * 360, chroma * 100, grayscale * 100];
      };
      convert.hsl.hcg = function(hsl) {
        const s = hsl[1] / 100;
        const l = hsl[2] / 100;
        const c = l < 0.5 ? 2 * s * l : 2 * s * (1 - l);
        let f = 0;
        if (c < 1) {
          f = (l - 0.5 * c) / (1 - c);
        }
        return [hsl[0], c * 100, f * 100];
      };
      convert.hsv.hcg = function(hsv) {
        const s = hsv[1] / 100;
        const v = hsv[2] / 100;
        const c = s * v;
        let f = 0;
        if (c < 1) {
          f = (v - c) / (1 - c);
        }
        return [hsv[0], c * 100, f * 100];
      };
      convert.hcg.rgb = function(hcg) {
        const h = hcg[0] / 360;
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
        if (c === 0) {
          return [g * 255, g * 255, g * 255];
        }
        const pure = [0, 0, 0];
        const hi = h % 1 * 6;
        const v = hi % 1;
        const w = 1 - v;
        let mg = 0;
        switch (Math.floor(hi)) {
          case 0:
            pure[0] = 1;
            pure[1] = v;
            pure[2] = 0;
            break;
          case 1:
            pure[0] = w;
            pure[1] = 1;
            pure[2] = 0;
            break;
          case 2:
            pure[0] = 0;
            pure[1] = 1;
            pure[2] = v;
            break;
          case 3:
            pure[0] = 0;
            pure[1] = w;
            pure[2] = 1;
            break;
          case 4:
            pure[0] = v;
            pure[1] = 0;
            pure[2] = 1;
            break;
          default:
            pure[0] = 1;
            pure[1] = 0;
            pure[2] = w;
        }
        mg = (1 - c) * g;
        return [
          (c * pure[0] + mg) * 255,
          (c * pure[1] + mg) * 255,
          (c * pure[2] + mg) * 255
        ];
      };
      convert.hcg.hsv = function(hcg) {
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
        const v = c + g * (1 - c);
        let f = 0;
        if (v > 0) {
          f = c / v;
        }
        return [hcg[0], f * 100, v * 100];
      };
      convert.hcg.hsl = function(hcg) {
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
        const l = g * (1 - c) + 0.5 * c;
        let s = 0;
        if (l > 0 && l < 0.5) {
          s = c / (2 * l);
        } else if (l >= 0.5 && l < 1) {
          s = c / (2 * (1 - l));
        }
        return [hcg[0], s * 100, l * 100];
      };
      convert.hcg.hwb = function(hcg) {
        const c = hcg[1] / 100;
        const g = hcg[2] / 100;
        const v = c + g * (1 - c);
        return [hcg[0], (v - c) * 100, (1 - v) * 100];
      };
      convert.hwb.hcg = function(hwb) {
        const w = hwb[1] / 100;
        const b = hwb[2] / 100;
        const v = 1 - b;
        const c = v - w;
        let g = 0;
        if (c < 1) {
          g = (v - c) / (1 - c);
        }
        return [hwb[0], c * 100, g * 100];
      };
      convert.apple.rgb = function(apple) {
        return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
      };
      convert.rgb.apple = function(rgb) {
        return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
      };
      convert.gray.rgb = function(args) {
        return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
      };
      convert.gray.hsl = function(args) {
        return [0, 0, args[0]];
      };
      convert.gray.hsv = convert.gray.hsl;
      convert.gray.hwb = function(gray) {
        return [0, 100, gray[0]];
      };
      convert.gray.cmyk = function(gray) {
        return [0, 0, 0, gray[0]];
      };
      convert.gray.lab = function(gray) {
        return [gray[0], 0, 0];
      };
      convert.gray.hex = function(gray) {
        const val = Math.round(gray[0] / 100 * 255) & 255;
        const integer = (val << 16) + (val << 8) + val;
        const string = integer.toString(16).toUpperCase();
        return "000000".substring(string.length) + string;
      };
      convert.rgb.gray = function(rgb) {
        const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
        return [val / 255 * 100];
      };
    }
  });

  // ../../node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/route.js
  var require_route = __commonJS({
    "../../node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/route.js"(exports, module) {
      var conversions = require_conversions();
      function buildGraph() {
        const graph = {};
        const models = Object.keys(conversions);
        for (let len = models.length, i = 0; i < len; i++) {
          graph[models[i]] = {
            // http://jsperf.com/1-vs-infinity
            // micro-opt, but this is simple.
            distance: -1,
            parent: null
          };
        }
        return graph;
      }
      function deriveBFS(fromModel) {
        const graph = buildGraph();
        const queue = [fromModel];
        graph[fromModel].distance = 0;
        while (queue.length) {
          const current = queue.pop();
          const adjacents = Object.keys(conversions[current]);
          for (let len = adjacents.length, i = 0; i < len; i++) {
            const adjacent = adjacents[i];
            const node = graph[adjacent];
            if (node.distance === -1) {
              node.distance = graph[current].distance + 1;
              node.parent = current;
              queue.unshift(adjacent);
            }
          }
        }
        return graph;
      }
      function link(from, to) {
        return function(args) {
          return to(from(args));
        };
      }
      function wrapConversion(toModel, graph) {
        const path = [graph[toModel].parent, toModel];
        let fn = conversions[graph[toModel].parent][toModel];
        let cur = graph[toModel].parent;
        while (graph[cur].parent) {
          path.unshift(graph[cur].parent);
          fn = link(conversions[graph[cur].parent][cur], fn);
          cur = graph[cur].parent;
        }
        fn.conversion = path;
        return fn;
      }
      module.exports = function(fromModel) {
        const graph = deriveBFS(fromModel);
        const conversion = {};
        const models = Object.keys(graph);
        for (let len = models.length, i = 0; i < len; i++) {
          const toModel = models[i];
          const node = graph[toModel];
          if (node.parent === null) {
            continue;
          }
          conversion[toModel] = wrapConversion(toModel, graph);
        }
        return conversion;
      };
    }
  });

  // ../../node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/index.js
  var require_color_convert = __commonJS({
    "../../node_modules/.pnpm/color-convert@2.0.1/node_modules/color-convert/index.js"(exports, module) {
      var conversions = require_conversions();
      var route = require_route();
      var convert = {};
      var models = Object.keys(conversions);
      function wrapRaw(fn) {
        const wrappedFn = function(...args) {
          const arg0 = args[0];
          if (arg0 === void 0 || arg0 === null) {
            return arg0;
          }
          if (arg0.length > 1) {
            args = arg0;
          }
          return fn(args);
        };
        if ("conversion" in fn) {
          wrappedFn.conversion = fn.conversion;
        }
        return wrappedFn;
      }
      function wrapRounded(fn) {
        const wrappedFn = function(...args) {
          const arg0 = args[0];
          if (arg0 === void 0 || arg0 === null) {
            return arg0;
          }
          if (arg0.length > 1) {
            args = arg0;
          }
          const result = fn(args);
          if (typeof result === "object") {
            for (let len = result.length, i = 0; i < len; i++) {
              result[i] = Math.round(result[i]);
            }
          }
          return result;
        };
        if ("conversion" in fn) {
          wrappedFn.conversion = fn.conversion;
        }
        return wrappedFn;
      }
      models.forEach((fromModel) => {
        convert[fromModel] = {};
        Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
        Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
        const routes = route(fromModel);
        const routeModels = Object.keys(routes);
        routeModels.forEach((toModel) => {
          const fn = routes[toModel];
          convert[fromModel][toModel] = wrapRounded(fn);
          convert[fromModel][toModel].raw = wrapRaw(fn);
        });
      });
      module.exports = convert;
    }
  });

  // ../../node_modules/.pnpm/ansi-styles@4.3.0/node_modules/ansi-styles/index.js
  var require_ansi_styles = __commonJS({
    "../../node_modules/.pnpm/ansi-styles@4.3.0/node_modules/ansi-styles/index.js"(exports, module) {
      "use strict";
      var wrapAnsi16 = (fn, offset) => (...args) => {
        const code = fn(...args);
        return `\x1B[${code + offset}m`;
      };
      var wrapAnsi256 = (fn, offset) => (...args) => {
        const code = fn(...args);
        return `\x1B[${38 + offset};5;${code}m`;
      };
      var wrapAnsi16m = (fn, offset) => (...args) => {
        const rgb = fn(...args);
        return `\x1B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
      };
      var ansi2ansi = (n) => n;
      var rgb2rgb = (r, g, b) => [r, g, b];
      var setLazyProperty = (object, property, get) => {
        Object.defineProperty(object, property, {
          get: () => {
            const value = get();
            Object.defineProperty(object, property, {
              value,
              enumerable: true,
              configurable: true
            });
            return value;
          },
          enumerable: true,
          configurable: true
        });
      };
      var colorConvert;
      var makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
        if (colorConvert === void 0) {
          colorConvert = require_color_convert();
        }
        const offset = isBackground ? 10 : 0;
        const styles = {};
        for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
          const name = sourceSpace === "ansi16" ? "ansi" : sourceSpace;
          if (sourceSpace === targetSpace) {
            styles[name] = wrap(identity, offset);
          } else if (typeof suite === "object") {
            styles[name] = wrap(suite[targetSpace], offset);
          }
        }
        return styles;
      };
      function assembleStyles() {
        const codes = /* @__PURE__ */ new Map();
        const styles = {
          modifier: {
            reset: [0, 0],
            // 21 isn't widely supported and 22 does the same thing
            bold: [1, 22],
            dim: [2, 22],
            italic: [3, 23],
            underline: [4, 24],
            inverse: [7, 27],
            hidden: [8, 28],
            strikethrough: [9, 29]
          },
          color: {
            black: [30, 39],
            red: [31, 39],
            green: [32, 39],
            yellow: [33, 39],
            blue: [34, 39],
            magenta: [35, 39],
            cyan: [36, 39],
            white: [37, 39],
            // Bright color
            blackBright: [90, 39],
            redBright: [91, 39],
            greenBright: [92, 39],
            yellowBright: [93, 39],
            blueBright: [94, 39],
            magentaBright: [95, 39],
            cyanBright: [96, 39],
            whiteBright: [97, 39]
          },
          bgColor: {
            bgBlack: [40, 49],
            bgRed: [41, 49],
            bgGreen: [42, 49],
            bgYellow: [43, 49],
            bgBlue: [44, 49],
            bgMagenta: [45, 49],
            bgCyan: [46, 49],
            bgWhite: [47, 49],
            // Bright color
            bgBlackBright: [100, 49],
            bgRedBright: [101, 49],
            bgGreenBright: [102, 49],
            bgYellowBright: [103, 49],
            bgBlueBright: [104, 49],
            bgMagentaBright: [105, 49],
            bgCyanBright: [106, 49],
            bgWhiteBright: [107, 49]
          }
        };
        styles.color.gray = styles.color.blackBright;
        styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
        styles.color.grey = styles.color.blackBright;
        styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;
        for (const [groupName, group] of Object.entries(styles)) {
          for (const [styleName, style] of Object.entries(group)) {
            styles[styleName] = {
              open: `\x1B[${style[0]}m`,
              close: `\x1B[${style[1]}m`
            };
            group[styleName] = styles[styleName];
            codes.set(style[0], style[1]);
          }
          Object.defineProperty(styles, groupName, {
            value: group,
            enumerable: false
          });
        }
        Object.defineProperty(styles, "codes", {
          value: codes,
          enumerable: false
        });
        styles.color.close = "\x1B[39m";
        styles.bgColor.close = "\x1B[49m";
        setLazyProperty(styles.color, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, false));
        setLazyProperty(styles.color, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, false));
        setLazyProperty(styles.color, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, false));
        setLazyProperty(styles.bgColor, "ansi", () => makeDynamicStyles(wrapAnsi16, "ansi16", ansi2ansi, true));
        setLazyProperty(styles.bgColor, "ansi256", () => makeDynamicStyles(wrapAnsi256, "ansi256", ansi2ansi, true));
        setLazyProperty(styles.bgColor, "ansi16m", () => makeDynamicStyles(wrapAnsi16m, "rgb", rgb2rgb, true));
        return styles;
      }
      Object.defineProperty(module, "exports", {
        enumerable: true,
        get: assembleStyles
      });
    }
  });

  // ../../node_modules/.pnpm/has-flag@4.0.0/node_modules/has-flag/index.js
  var require_has_flag = __commonJS({
    "../../node_modules/.pnpm/has-flag@4.0.0/node_modules/has-flag/index.js"(exports, module) {
      "use strict";
      module.exports = (flag, argv = process.argv) => {
        const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
        const position = argv.indexOf(prefix + flag);
        const terminatorPosition = argv.indexOf("--");
        return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
      };
    }
  });

  // ../../node_modules/.pnpm/supports-color@7.2.0/node_modules/supports-color/index.js
  var require_supports_color = __commonJS({
    "../../node_modules/.pnpm/supports-color@7.2.0/node_modules/supports-color/index.js"(exports, module) {
      "use strict";
      var os = __require("os");
      var tty = __require("tty");
      var hasFlag = require_has_flag();
      var { env } = process;
      var forceColor;
      if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
        forceColor = 0;
      } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
        forceColor = 1;
      }
      if ("FORCE_COLOR" in env) {
        if (env.FORCE_COLOR === "true") {
          forceColor = 1;
        } else if (env.FORCE_COLOR === "false") {
          forceColor = 0;
        } else {
          forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
        }
      }
      function translateLevel(level) {
        if (level === 0) {
          return false;
        }
        return {
          level,
          hasBasic: true,
          has256: level >= 2,
          has16m: level >= 3
        };
      }
      function supportsColor(haveStream, streamIsTTY) {
        if (forceColor === 0) {
          return 0;
        }
        if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
          return 3;
        }
        if (hasFlag("color=256")) {
          return 2;
        }
        if (haveStream && !streamIsTTY && forceColor === void 0) {
          return 0;
        }
        const min = forceColor || 0;
        if (env.TERM === "dumb") {
          return min;
        }
        if (process.platform === "win32") {
          const osRelease = os.release().split(".");
          if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
            return Number(osRelease[2]) >= 14931 ? 3 : 2;
          }
          return 1;
        }
        if ("CI" in env) {
          if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
            return 1;
          }
          return min;
        }
        if ("TEAMCITY_VERSION" in env) {
          return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
        }
        if (env.COLORTERM === "truecolor") {
          return 3;
        }
        if ("TERM_PROGRAM" in env) {
          const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
          switch (env.TERM_PROGRAM) {
            case "iTerm.app":
              return version >= 3 ? 3 : 2;
            case "Apple_Terminal":
              return 2;
          }
        }
        if (/-256(color)?$/i.test(env.TERM)) {
          return 2;
        }
        if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
          return 1;
        }
        if ("COLORTERM" in env) {
          return 1;
        }
        return min;
      }
      function getSupportLevel(stream) {
        const level = supportsColor(stream, stream && stream.isTTY);
        return translateLevel(level);
      }
      module.exports = {
        supportsColor: getSupportLevel,
        stdout: translateLevel(supportsColor(true, tty.isatty(1))),
        stderr: translateLevel(supportsColor(true, tty.isatty(2)))
      };
    }
  });

  // ../../node_modules/.pnpm/chalk@4.0.0/node_modules/chalk/source/util.js
  var require_util = __commonJS({
    "../../node_modules/.pnpm/chalk@4.0.0/node_modules/chalk/source/util.js"(exports, module) {
      "use strict";
      var stringReplaceAll = (string, substring, replacer) => {
        let index = string.indexOf(substring);
        if (index === -1) {
          return string;
        }
        const substringLength = substring.length;
        let endIndex = 0;
        let returnValue = "";
        do {
          returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
          endIndex = index + substringLength;
          index = string.indexOf(substring, endIndex);
        } while (index !== -1);
        returnValue += string.substr(endIndex);
        return returnValue;
      };
      var stringEncaseCRLFWithFirstIndex = (string, prefix, postfix, index) => {
        let endIndex = 0;
        let returnValue = "";
        do {
          const gotCR = string[index - 1] === "\r";
          returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
          endIndex = index + 1;
          index = string.indexOf("\n", endIndex);
        } while (index !== -1);
        returnValue += string.substr(endIndex);
        return returnValue;
      };
      module.exports = {
        stringReplaceAll,
        stringEncaseCRLFWithFirstIndex
      };
    }
  });

  // ../../node_modules/.pnpm/chalk@4.0.0/node_modules/chalk/source/templates.js
  var require_templates = __commonJS({
    "../../node_modules/.pnpm/chalk@4.0.0/node_modules/chalk/source/templates.js"(exports, module) {
      "use strict";
      var TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
      var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
      var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
      var ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;
      var ESCAPES = /* @__PURE__ */ new Map([
        ["n", "\n"],
        ["r", "\r"],
        ["t", "	"],
        ["b", "\b"],
        ["f", "\f"],
        ["v", "\v"],
        ["0", "\0"],
        ["\\", "\\"],
        ["e", "\x1B"],
        ["a", "\x07"]
      ]);
      function unescape(c) {
        const u = c[0] === "u";
        const bracket = c[1] === "{";
        if (u && !bracket && c.length === 5 || c[0] === "x" && c.length === 3) {
          return String.fromCharCode(parseInt(c.slice(1), 16));
        }
        if (u && bracket) {
          return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
        }
        return ESCAPES.get(c) || c;
      }
      function parseArguments(name, arguments_) {
        const results = [];
        const chunks = arguments_.trim().split(/\s*,\s*/g);
        let matches;
        for (const chunk of chunks) {
          const number = Number(chunk);
          if (!Number.isNaN(number)) {
            results.push(number);
          } else if (matches = chunk.match(STRING_REGEX)) {
            results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
          } else {
            throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
          }
        }
        return results;
      }
      function parseStyle(style) {
        STYLE_REGEX.lastIndex = 0;
        const results = [];
        let matches;
        while ((matches = STYLE_REGEX.exec(style)) !== null) {
          const name = matches[1];
          if (matches[2]) {
            const args = parseArguments(name, matches[2]);
            results.push([name].concat(args));
          } else {
            results.push([name]);
          }
        }
        return results;
      }
      function buildStyle(chalk, styles) {
        const enabled = {};
        for (const layer of styles) {
          for (const style of layer.styles) {
            enabled[style[0]] = layer.inverse ? null : style.slice(1);
          }
        }
        let current = chalk;
        for (const [styleName, styles2] of Object.entries(enabled)) {
          if (!Array.isArray(styles2)) {
            continue;
          }
          if (!(styleName in current)) {
            throw new Error(`Unknown Chalk style: ${styleName}`);
          }
          current = styles2.length > 0 ? current[styleName](...styles2) : current[styleName];
        }
        return current;
      }
      module.exports = (chalk, temporary) => {
        const styles = [];
        const chunks = [];
        let chunk = [];
        temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
          if (escapeCharacter) {
            chunk.push(unescape(escapeCharacter));
          } else if (style) {
            const string = chunk.join("");
            chunk = [];
            chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
            styles.push({ inverse, styles: parseStyle(style) });
          } else if (close) {
            if (styles.length === 0) {
              throw new Error("Found extraneous } in Chalk template literal");
            }
            chunks.push(buildStyle(chalk, styles)(chunk.join("")));
            chunk = [];
            styles.pop();
          } else {
            chunk.push(character);
          }
        });
        chunks.push(chunk.join(""));
        if (styles.length > 0) {
          const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`;
          throw new Error(errMessage);
        }
        return chunks.join("");
      };
    }
  });

  // ../../node_modules/.pnpm/chalk@4.0.0/node_modules/chalk/source/index.js
  var require_source = __commonJS({
    "../../node_modules/.pnpm/chalk@4.0.0/node_modules/chalk/source/index.js"(exports, module) {
      "use strict";
      var ansiStyles = require_ansi_styles();
      var { stdout: stdoutColor, stderr: stderrColor } = require_supports_color();
      var {
        stringReplaceAll,
        stringEncaseCRLFWithFirstIndex
      } = require_util();
      var levelMapping = [
        "ansi",
        "ansi",
        "ansi256",
        "ansi16m"
      ];
      var styles = /* @__PURE__ */ Object.create(null);
      var applyOptions = (object, options = {}) => {
        if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
          throw new Error("The `level` option should be an integer from 0 to 3");
        }
        const colorLevel = stdoutColor ? stdoutColor.level : 0;
        object.level = options.level === void 0 ? colorLevel : options.level;
      };
      var ChalkClass = class {
        constructor(options) {
          return chalkFactory(options);
        }
      };
      var chalkFactory = (options) => {
        const chalk2 = {};
        applyOptions(chalk2, options);
        chalk2.template = (...arguments_) => chalkTag(chalk2.template, ...arguments_);
        Object.setPrototypeOf(chalk2, Chalk.prototype);
        Object.setPrototypeOf(chalk2.template, chalk2);
        chalk2.template.constructor = () => {
          throw new Error("`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.");
        };
        chalk2.template.Instance = ChalkClass;
        return chalk2.template;
      };
      function Chalk(options) {
        return chalkFactory(options);
      }
      for (const [styleName, style] of Object.entries(ansiStyles)) {
        styles[styleName] = {
          get() {
            const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
            Object.defineProperty(this, styleName, { value: builder });
            return builder;
          }
        };
      }
      styles.visible = {
        get() {
          const builder = createBuilder(this, this._styler, true);
          Object.defineProperty(this, "visible", { value: builder });
          return builder;
        }
      };
      var usedModels = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
      for (const model of usedModels) {
        styles[model] = {
          get() {
            const { level } = this;
            return function(...arguments_) {
              const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
              return createBuilder(this, styler, this._isEmpty);
            };
          }
        };
      }
      for (const model of usedModels) {
        const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
        styles[bgModel] = {
          get() {
            const { level } = this;
            return function(...arguments_) {
              const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
              return createBuilder(this, styler, this._isEmpty);
            };
          }
        };
      }
      var proto = Object.defineProperties(() => {
      }, {
        ...styles,
        level: {
          enumerable: true,
          get() {
            return this._generator.level;
          },
          set(level) {
            this._generator.level = level;
          }
        }
      });
      var createStyler = (open, close, parent) => {
        let openAll;
        let closeAll;
        if (parent === void 0) {
          openAll = open;
          closeAll = close;
        } else {
          openAll = parent.openAll + open;
          closeAll = close + parent.closeAll;
        }
        return {
          open,
          close,
          openAll,
          closeAll,
          parent
        };
      };
      var createBuilder = (self, _styler, _isEmpty) => {
        const builder = (...arguments_) => {
          return applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
        };
        Object.setPrototypeOf(builder, proto);
        builder._generator = self;
        builder._styler = _styler;
        builder._isEmpty = _isEmpty;
        return builder;
      };
      var applyStyle = (self, string) => {
        if (self.level <= 0 || !string) {
          return self._isEmpty ? "" : string;
        }
        let styler = self._styler;
        if (styler === void 0) {
          return string;
        }
        const { openAll, closeAll } = styler;
        if (string.indexOf("\x1B") !== -1) {
          while (styler !== void 0) {
            string = stringReplaceAll(string, styler.close, styler.open);
            styler = styler.parent;
          }
        }
        const lfIndex = string.indexOf("\n");
        if (lfIndex !== -1) {
          string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
        }
        return openAll + string + closeAll;
      };
      var template;
      var chalkTag = (chalk2, ...strings) => {
        const [firstString] = strings;
        if (!Array.isArray(firstString)) {
          return strings.join(" ");
        }
        const arguments_ = strings.slice(1);
        const parts = [firstString.raw[0]];
        for (let i = 1; i < firstString.length; i++) {
          parts.push(
            String(arguments_[i - 1]).replace(/[{}\\]/g, "\\$&"),
            String(firstString.raw[i])
          );
        }
        if (template === void 0) {
          template = require_templates();
        }
        return template(chalk2, parts.join(""));
      };
      Object.defineProperties(Chalk.prototype, styles);
      var chalk = Chalk();
      chalk.supportsColor = stdoutColor;
      chalk.stderr = Chalk({ level: stderrColor ? stderrColor.level : 0 });
      chalk.stderr.supportsColor = stderrColor;
      module.exports = chalk;
    }
  });

  // ../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/styles.js
  var require_styles = __commonJS({
    "../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/styles.js"(exports, module) {
      var styles = {};
      module["exports"] = styles;
      var codes = {
        reset: [0, 0],
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29],
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        gray: [90, 39],
        grey: [90, 39],
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        // legacy styles for colors pre v1.0.0
        blackBG: [40, 49],
        redBG: [41, 49],
        greenBG: [42, 49],
        yellowBG: [43, 49],
        blueBG: [44, 49],
        magentaBG: [45, 49],
        cyanBG: [46, 49],
        whiteBG: [47, 49]
      };
      Object.keys(codes).forEach(function(key) {
        var val = codes[key];
        var style = styles[key] = [];
        style.open = "\x1B[" + val[0] + "m";
        style.close = "\x1B[" + val[1] + "m";
      });
    }
  });

  // ../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/system/supports-colors.js
  var require_supports_colors = __commonJS({
    "../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/system/supports-colors.js"(exports, module) {
      var argv = process.argv;
      module.exports = function() {
        if (argv.indexOf("--no-color") !== -1 || argv.indexOf("--color=false") !== -1) {
          return false;
        }
        if (argv.indexOf("--color") !== -1 || argv.indexOf("--color=true") !== -1 || argv.indexOf("--color=always") !== -1) {
          return true;
        }
        if (process.stdout && !process.stdout.isTTY) {
          return false;
        }
        if (process.platform === "win32") {
          return true;
        }
        if ("COLORTERM" in process.env) {
          return true;
        }
        if (process.env.TERM === "dumb") {
          return false;
        }
        if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(process.env.TERM)) {
          return true;
        }
        return false;
      }();
    }
  });

  // ../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/custom/trap.js
  var require_trap = __commonJS({
    "../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/custom/trap.js"(exports, module) {
      module["exports"] = function runTheTrap(text, options) {
        var result = "";
        text = text || "Run the trap, drop the bass";
        text = text.split("");
        var trap = {
          a: ["@", "\u0104", "\u023A", "\u0245", "\u0394", "\u039B", "\u0414"],
          b: ["\xDF", "\u0181", "\u0243", "\u026E", "\u03B2", "\u0E3F"],
          c: ["\xA9", "\u023B", "\u03FE"],
          d: ["\xD0", "\u018A", "\u0500", "\u0501", "\u0502", "\u0503"],
          e: ["\xCB", "\u0115", "\u018E", "\u0258", "\u03A3", "\u03BE", "\u04BC", "\u0A6C"],
          f: ["\u04FA"],
          g: ["\u0262"],
          h: ["\u0126", "\u0195", "\u04A2", "\u04BA", "\u04C7", "\u050A"],
          i: ["\u0F0F"],
          j: ["\u0134"],
          k: ["\u0138", "\u04A0", "\u04C3", "\u051E"],
          l: ["\u0139"],
          m: ["\u028D", "\u04CD", "\u04CE", "\u0520", "\u0521", "\u0D69"],
          n: ["\xD1", "\u014B", "\u019D", "\u0376", "\u03A0", "\u048A"],
          o: ["\xD8", "\xF5", "\xF8", "\u01FE", "\u0298", "\u047A", "\u05DD", "\u06DD", "\u0E4F"],
          p: ["\u01F7", "\u048E"],
          q: ["\u09CD"],
          r: ["\xAE", "\u01A6", "\u0210", "\u024C", "\u0280", "\u042F"],
          s: ["\xA7", "\u03DE", "\u03DF", "\u03E8"],
          t: ["\u0141", "\u0166", "\u0373"],
          u: ["\u01B1", "\u054D"],
          v: ["\u05D8"],
          w: ["\u0428", "\u0460", "\u047C", "\u0D70"],
          x: ["\u04B2", "\u04FE", "\u04FC", "\u04FD"],
          y: ["\xA5", "\u04B0", "\u04CB"],
          z: ["\u01B5", "\u0240"]
        };
        text.forEach(function(c) {
          c = c.toLowerCase();
          var chars = trap[c] || [" "];
          var rand = Math.floor(Math.random() * chars.length);
          if (typeof trap[c] !== "undefined") {
            result += trap[c][rand];
          } else {
            result += c;
          }
        });
        return result;
      };
    }
  });

  // ../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/custom/zalgo.js
  var require_zalgo = __commonJS({
    "../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/custom/zalgo.js"(exports, module) {
      module["exports"] = function zalgo(text, options) {
        text = text || "   he is here   ";
        var soul = {
          "up": [
            "\u030D",
            "\u030E",
            "\u0304",
            "\u0305",
            "\u033F",
            "\u0311",
            "\u0306",
            "\u0310",
            "\u0352",
            "\u0357",
            "\u0351",
            "\u0307",
            "\u0308",
            "\u030A",
            "\u0342",
            "\u0313",
            "\u0308",
            "\u034A",
            "\u034B",
            "\u034C",
            "\u0303",
            "\u0302",
            "\u030C",
            "\u0350",
            "\u0300",
            "\u0301",
            "\u030B",
            "\u030F",
            "\u0312",
            "\u0313",
            "\u0314",
            "\u033D",
            "\u0309",
            "\u0363",
            "\u0364",
            "\u0365",
            "\u0366",
            "\u0367",
            "\u0368",
            "\u0369",
            "\u036A",
            "\u036B",
            "\u036C",
            "\u036D",
            "\u036E",
            "\u036F",
            "\u033E",
            "\u035B",
            "\u0346",
            "\u031A"
          ],
          "down": [
            "\u0316",
            "\u0317",
            "\u0318",
            "\u0319",
            "\u031C",
            "\u031D",
            "\u031E",
            "\u031F",
            "\u0320",
            "\u0324",
            "\u0325",
            "\u0326",
            "\u0329",
            "\u032A",
            "\u032B",
            "\u032C",
            "\u032D",
            "\u032E",
            "\u032F",
            "\u0330",
            "\u0331",
            "\u0332",
            "\u0333",
            "\u0339",
            "\u033A",
            "\u033B",
            "\u033C",
            "\u0345",
            "\u0347",
            "\u0348",
            "\u0349",
            "\u034D",
            "\u034E",
            "\u0353",
            "\u0354",
            "\u0355",
            "\u0356",
            "\u0359",
            "\u035A",
            "\u0323"
          ],
          "mid": [
            "\u0315",
            "\u031B",
            "\u0300",
            "\u0301",
            "\u0358",
            "\u0321",
            "\u0322",
            "\u0327",
            "\u0328",
            "\u0334",
            "\u0335",
            "\u0336",
            "\u035C",
            "\u035D",
            "\u035E",
            "\u035F",
            "\u0360",
            "\u0362",
            "\u0338",
            "\u0337",
            "\u0361",
            " \u0489"
          ]
        }, all = [].concat(soul.up, soul.down, soul.mid), zalgo2 = {};
        function randomNumber(range) {
          var r = Math.floor(Math.random() * range);
          return r;
        }
        function is_char(character) {
          var bool = false;
          all.filter(function(i) {
            bool = i === character;
          });
          return bool;
        }
        function heComes(text2, options2) {
          var result = "", counts, l;
          options2 = options2 || {};
          options2["up"] = options2["up"] || true;
          options2["mid"] = options2["mid"] || true;
          options2["down"] = options2["down"] || true;
          options2["size"] = options2["size"] || "maxi";
          text2 = text2.split("");
          for (l in text2) {
            if (is_char(l)) {
              continue;
            }
            result = result + text2[l];
            counts = { "up": 0, "down": 0, "mid": 0 };
            switch (options2.size) {
              case "mini":
                counts.up = randomNumber(8);
                counts.min = randomNumber(2);
                counts.down = randomNumber(8);
                break;
              case "maxi":
                counts.up = randomNumber(16) + 3;
                counts.min = randomNumber(4) + 1;
                counts.down = randomNumber(64) + 3;
                break;
              default:
                counts.up = randomNumber(8) + 1;
                counts.mid = randomNumber(6) / 2;
                counts.down = randomNumber(8) + 1;
                break;
            }
            var arr = ["up", "mid", "down"];
            for (var d in arr) {
              var index = arr[d];
              for (var i = 0; i <= counts[index]; i++) {
                if (options2[index]) {
                  result = result + soul[index][randomNumber(soul[index].length)];
                }
              }
            }
          }
          return result;
        }
        return heComes(text);
      };
    }
  });

  // ../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/america.js
  var require_america = __commonJS({
    "../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/america.js"(exports, module) {
      var colors = require_colors();
      module["exports"] = function() {
        return function(letter, i, exploded) {
          if (letter === " ")
            return letter;
          switch (i % 3) {
            case 0:
              return colors.red(letter);
            case 1:
              return colors.white(letter);
            case 2:
              return colors.blue(letter);
          }
        };
      }();
    }
  });

  // ../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/zebra.js
  var require_zebra = __commonJS({
    "../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/zebra.js"(exports, module) {
      var colors = require_colors();
      module["exports"] = function(letter, i, exploded) {
        return i % 2 === 0 ? letter : colors.inverse(letter);
      };
    }
  });

  // ../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/rainbow.js
  var require_rainbow = __commonJS({
    "../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/rainbow.js"(exports, module) {
      var colors = require_colors();
      module["exports"] = function() {
        var rainbowColors = ["red", "yellow", "green", "blue", "magenta"];
        return function(letter, i, exploded) {
          if (letter === " ") {
            return letter;
          } else {
            return colors[rainbowColors[i++ % rainbowColors.length]](letter);
          }
        };
      }();
    }
  });

  // ../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/random.js
  var require_random = __commonJS({
    "../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/maps/random.js"(exports, module) {
      var colors = require_colors();
      module["exports"] = function() {
        var available = ["underline", "inverse", "grey", "yellow", "red", "green", "blue", "white", "cyan", "magenta"];
        return function(letter, i, exploded) {
          return letter === " " ? letter : colors[available[Math.round(Math.random() * (available.length - 1))]](letter);
        };
      }();
    }
  });

  // ../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/colors.js
  var require_colors = __commonJS({
    "../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/lib/colors.js"(exports, module) {
      var colors = {};
      module["exports"] = colors;
      colors.themes = {};
      var ansiStyles = colors.styles = require_styles();
      var defineProps = Object.defineProperties;
      colors.supportsColor = require_supports_colors();
      if (typeof colors.enabled === "undefined") {
        colors.enabled = colors.supportsColor;
      }
      colors.stripColors = colors.strip = function(str) {
        return ("" + str).replace(/\x1B\[\d+m/g, "");
      };
      var stylize = colors.stylize = function stylize2(str, style) {
        return ansiStyles[style].open + str + ansiStyles[style].close;
      };
      var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
      var escapeStringRegexp = function(str) {
        if (typeof str !== "string") {
          throw new TypeError("Expected a string");
        }
        return str.replace(matchOperatorsRe, "\\$&");
      };
      function build(_styles) {
        var builder = function builder2() {
          return applyStyle.apply(builder2, arguments);
        };
        builder._styles = _styles;
        builder.__proto__ = proto;
        return builder;
      }
      var styles = function() {
        var ret = {};
        ansiStyles.grey = ansiStyles.gray;
        Object.keys(ansiStyles).forEach(function(key) {
          ansiStyles[key].closeRe = new RegExp(escapeStringRegexp(ansiStyles[key].close), "g");
          ret[key] = {
            get: function() {
              return build(this._styles.concat(key));
            }
          };
        });
        return ret;
      }();
      var proto = defineProps(function colors2() {
      }, styles);
      function applyStyle() {
        var args = arguments;
        var argsLen = args.length;
        var str = argsLen !== 0 && String(arguments[0]);
        if (argsLen > 1) {
          for (var a = 1; a < argsLen; a++) {
            str += " " + args[a];
          }
        }
        if (!colors.enabled || !str) {
          return str;
        }
        var nestedStyles = this._styles;
        var i = nestedStyles.length;
        while (i--) {
          var code = ansiStyles[nestedStyles[i]];
          str = code.open + str.replace(code.closeRe, code.open) + code.close;
        }
        return str;
      }
      function applyTheme(theme) {
        for (var style in theme) {
          (function(style2) {
            colors[style2] = function(str) {
              return colors[theme[style2]](str);
            };
          })(style);
        }
      }
      colors.setTheme = function(theme) {
        if (typeof theme === "string") {
          try {
            colors.themes[theme] = __require(theme);
            applyTheme(colors.themes[theme]);
            return colors.themes[theme];
          } catch (err) {
            console.log(err);
            return err;
          }
        } else {
          applyTheme(theme);
        }
      };
      function init() {
        var ret = {};
        Object.keys(styles).forEach(function(name) {
          ret[name] = {
            get: function() {
              return build([name]);
            }
          };
        });
        return ret;
      }
      var sequencer = function sequencer2(map2, str) {
        var exploded = str.split(""), i = 0;
        exploded = exploded.map(map2);
        return exploded.join("");
      };
      colors.trap = require_trap();
      colors.zalgo = require_zalgo();
      colors.maps = {};
      colors.maps.america = require_america();
      colors.maps.zebra = require_zebra();
      colors.maps.rainbow = require_rainbow();
      colors.maps.random = require_random();
      for (map in colors.maps) {
        (function(map2) {
          colors[map2] = function(str) {
            return sequencer(colors.maps[map2], str);
          };
        })(map);
      }
      var map;
      defineProps(colors, init());
    }
  });

  // ../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/safe.js
  var require_safe = __commonJS({
    "../../node_modules/.pnpm/colors@1.0.3/node_modules/colors/safe.js"(exports, module) {
      var colors = require_colors();
      module["exports"] = colors;
    }
  });

  // ../../node_modules/.pnpm/cli-table@0.3.11/node_modules/cli-table/lib/utils.js
  var require_utils = __commonJS({
    "../../node_modules/.pnpm/cli-table@0.3.11/node_modules/cli-table/lib/utils.js"(exports) {
      exports.repeat = function(str, times) {
        return Array(times + 1).join(str);
      };
      exports.pad = function(str, len, pad, dir) {
        if (len + 1 >= str.length)
          switch (dir) {
            case "left":
              str = Array(len + 1 - str.length).join(pad) + str;
              break;
            case "both":
              var right = Math.ceil((padlen = len - str.length) / 2);
              var left = padlen - right;
              str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
              break;
            default:
              str = str + Array(len + 1 - str.length).join(pad);
          }
        ;
        return str;
      };
      exports.truncate = function(str, length, chr) {
        chr = chr || "\u2026";
        return str.length >= length ? str.substr(0, length - chr.length) + chr : str;
      };
      function options(defaults, opts) {
        for (var p in opts) {
          if (p === "__proto__" || p === "constructor" || p === "prototype") {
            continue;
          }
          if (opts[p] && opts[p].constructor && opts[p].constructor === Object) {
            defaults[p] = defaults[p] || {};
            options(defaults[p], opts[p]);
          } else {
            defaults[p] = opts[p];
          }
        }
        return defaults;
      }
      exports.options = options;
      exports.strlen = function(str) {
        var code = /\u001b\[(?:\d*;){0,5}\d*m/g;
        var stripped = ("" + str).replace(code, "");
        var split = stripped.split("\n");
        return split.reduce(function(memo, s) {
          return s.length > memo ? s.length : memo;
        }, 0);
      };
    }
  });

  // ../../node_modules/.pnpm/cli-table@0.3.11/node_modules/cli-table/lib/index.js
  var require_lib = __commonJS({
    "../../node_modules/.pnpm/cli-table@0.3.11/node_modules/cli-table/lib/index.js"(exports, module) {
      var colors = require_safe();
      var utils = require_utils();
      var repeat = utils.repeat;
      var truncate = utils.truncate;
      var pad = utils.pad;
      function Table(options) {
        this.options = utils.options({
          chars: {
            "top": "\u2500",
            "top-mid": "\u252C",
            "top-left": "\u250C",
            "top-right": "\u2510",
            "bottom": "\u2500",
            "bottom-mid": "\u2534",
            "bottom-left": "\u2514",
            "bottom-right": "\u2518",
            "left": "\u2502",
            "left-mid": "\u251C",
            "mid": "\u2500",
            "mid-mid": "\u253C",
            "right": "\u2502",
            "right-mid": "\u2524",
            "middle": "\u2502"
          },
          truncate: "\u2026",
          colWidths: [],
          colAligns: [],
          style: {
            "padding-left": 1,
            "padding-right": 1,
            head: ["red"],
            border: ["grey"],
            compact: false
          },
          head: []
        }, options);
        if (options && options.rows) {
          for (var i = 0; i < options.rows.length; i++) {
            this.push(options.rows[i]);
          }
        }
      }
      Table.prototype.__proto__ = Array.prototype;
      Table.prototype.__defineGetter__("width", function() {
        var str = this.toString().split("\n");
        if (str.length)
          return str[0].length;
        return 0;
      });
      Table.prototype.render;
      Table.prototype.toString = function() {
        var ret = "", options = this.options, style = options.style, head = options.head, chars = options.chars, truncater = options.truncate, colWidths = options.colWidths || new Array(this.head.length), totalWidth = 0;
        if (!head.length && !this.length)
          return "";
        if (!colWidths.length) {
          var all_rows = this.slice(0);
          if (head.length) {
            all_rows = all_rows.concat([head]);
          }
          ;
          all_rows.forEach(function(cells) {
            if (typeof cells === "object" && cells.length) {
              extractColumnWidths(cells);
            } else {
              var header_cell = Object.keys(cells)[0], value_cell = cells[header_cell];
              colWidths[0] = Math.max(colWidths[0] || 0, get_width(header_cell) || 0);
              if (typeof value_cell === "object" && value_cell.length) {
                extractColumnWidths(value_cell, 1);
              } else {
                colWidths[1] = Math.max(colWidths[1] || 0, get_width(value_cell) || 0);
              }
            }
          });
        }
        ;
        totalWidth = (colWidths.length == 1 ? colWidths[0] : colWidths.reduce(
          function(a, b) {
            return a + b;
          }
        )) + colWidths.length + 1;
        function extractColumnWidths(arr, offset) {
          var offset = offset || 0;
          arr.forEach(function(cell, i) {
            colWidths[i + offset] = Math.max(colWidths[i + offset] || 0, get_width(cell) || 0);
          });
        }
        ;
        function get_width(obj) {
          return typeof obj == "object" && obj.width != void 0 ? obj.width : (typeof obj == "object" ? utils.strlen(obj.text) : utils.strlen(obj)) + (style["padding-left"] || 0) + (style["padding-right"] || 0);
        }
        function line(line2, left, right, intersection) {
          var width = 0, line2 = left + repeat(line2, totalWidth - 2) + right;
          colWidths.forEach(function(w, i) {
            if (i == colWidths.length - 1)
              return;
            width += w + 1;
            line2 = line2.substr(0, width) + intersection + line2.substr(width + 1);
          });
          return applyStyles(options.style.border, line2);
        }
        ;
        function lineTop() {
          var l2 = line(
            chars.top,
            chars["top-left"] || chars.top,
            chars["top-right"] || chars.top,
            chars["top-mid"]
          );
          if (l2)
            ret += l2 + "\n";
        }
        ;
        function generateRow(items, style2) {
          var cells = [], max_height = 0;
          if (!Array.isArray(items) && typeof items === "object") {
            var key = Object.keys(items)[0], value = items[key], first_cell_head = true;
            if (Array.isArray(value)) {
              items = value;
              items.unshift(key);
            } else {
              items = [key, value];
            }
          }
          items.forEach(function(item, i) {
            var contents = item.toString().split("\n").reduce(function(memo, l2) {
              memo.push(string(l2, i));
              return memo;
            }, []);
            var height = contents.length;
            if (height > max_height) {
              max_height = height;
            }
            ;
            cells.push({ contents, height });
          });
          var lines = new Array(max_height);
          cells.forEach(function(cell, i) {
            cell.contents.forEach(function(line2, j2) {
              if (!lines[j2]) {
                lines[j2] = [];
              }
              ;
              if (style2 || first_cell_head && i === 0 && options.style.head) {
                line2 = applyStyles(options.style.head, line2);
              }
              lines[j2].push(line2);
            });
            for (var j = cell.height, l2 = max_height; j < l2; j++) {
              if (!lines[j]) {
                lines[j] = [];
              }
              ;
              lines[j].push(string("", i));
            }
          });
          var ret2 = "";
          lines.forEach(function(line2, index) {
            if (ret2.length > 0) {
              ret2 += "\n" + applyStyles(options.style.border, chars.left);
            }
            ret2 += line2.join(applyStyles(options.style.border, chars.middle)) + applyStyles(options.style.border, chars.right);
          });
          return applyStyles(options.style.border, chars.left) + ret2;
        }
        ;
        function applyStyles(styles, subject) {
          if (!subject)
            return "";
          styles.forEach(function(style2) {
            subject = colors[style2](subject);
          });
          return subject;
        }
        ;
        function string(str, index) {
          var str = String(typeof str == "object" && str.text ? str.text : str), length = utils.strlen(str), width = colWidths[index] - (style["padding-left"] || 0) - (style["padding-right"] || 0), align = options.colAligns[index] || "left";
          return repeat(" ", style["padding-left"] || 0) + (length == width ? str : length < width ? pad(str, width + (str.length - length), " ", align == "left" ? "right" : align == "middle" ? "both" : "left") : truncater ? truncate(str, width, truncater) : str) + repeat(" ", style["padding-right"] || 0);
        }
        ;
        if (head.length) {
          lineTop();
          ret += generateRow(head, style.head) + "\n";
        }
        if (this.length)
          this.forEach(function(cells, i) {
            if (!head.length && i == 0)
              lineTop();
            else {
              if (!style.compact || i < !!head.length ? 1 : cells.length == 0) {
                var l2 = line(
                  chars.mid,
                  chars["left-mid"],
                  chars["right-mid"],
                  chars["mid-mid"]
                );
                if (l2)
                  ret += l2 + "\n";
              }
            }
            if (cells.hasOwnProperty("length") && !cells.length) {
              return;
            } else {
              ret += generateRow(cells) + "\n";
            }
            ;
          });
        var l = line(
          chars.bottom,
          chars["bottom-left"] || chars.bottom,
          chars["bottom-right"] || chars.bottom,
          chars["bottom-mid"]
        );
        if (l)
          ret += l;
        else
          ret = ret.slice(0, -1);
        return ret;
      };
      module.exports = Table;
      module.exports.version = "0.0.1";
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/constants.js
  var require_constants = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/constants.js"(exports, module) {
      var SEMVER_SPEC_VERSION = "2.0.0";
      var MAX_LENGTH = 256;
      var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
      9007199254740991;
      var MAX_SAFE_COMPONENT_LENGTH = 16;
      module.exports = {
        SEMVER_SPEC_VERSION,
        MAX_LENGTH,
        MAX_SAFE_INTEGER,
        MAX_SAFE_COMPONENT_LENGTH
      };
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/debug.js
  var require_debug = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/debug.js"(exports, module) {
      var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
      };
      module.exports = debug;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/re.js
  var require_re = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/re.js"(exports, module) {
      var { MAX_SAFE_COMPONENT_LENGTH } = require_constants();
      var debug = require_debug();
      exports = module.exports = {};
      var re = exports.re = [];
      var src = exports.src = [];
      var t = exports.t = {};
      var R = 0;
      var createToken = (name, value, isGlobal) => {
        const index = R++;
        debug(name, index, value);
        t[name] = index;
        src[index] = value;
        re[index] = new RegExp(value, isGlobal ? "g" : void 0);
      };
      createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*");
      createToken("NUMERICIDENTIFIERLOOSE", "[0-9]+");
      createToken("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-][a-zA-Z0-9-]*");
      createToken("MAINVERSION", `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})`);
      createToken("MAINVERSIONLOOSE", `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`);
      createToken("PRERELEASEIDENTIFIER", `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
      createToken("PRERELEASEIDENTIFIERLOOSE", `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
      createToken("PRERELEASE", `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
      createToken("PRERELEASELOOSE", `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
      createToken("BUILDIDENTIFIER", "[0-9A-Za-z-]+");
      createToken("BUILD", `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
      createToken("FULLPLAIN", `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
      createToken("FULL", `^${src[t.FULLPLAIN]}$`);
      createToken("LOOSEPLAIN", `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
      createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`);
      createToken("GTLT", "((?:<|>)?=?)");
      createToken("XRANGEIDENTIFIERLOOSE", `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
      createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
      createToken("XRANGEPLAIN", `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?)?)?`);
      createToken("XRANGEPLAINLOOSE", `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?)?)?`);
      createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
      createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
      createToken("COERCE", `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:$|[^\\d])`);
      createToken("COERCERTL", src[t.COERCE], true);
      createToken("LONETILDE", "(?:~>?)");
      createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true);
      exports.tildeTrimReplace = "$1~";
      createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
      createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
      createToken("LONECARET", "(?:\\^)");
      createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true);
      exports.caretTrimReplace = "$1^";
      createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
      createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
      createToken("COMPARATORLOOSE", `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
      createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
      createToken("COMPARATORTRIM", `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
      exports.comparatorTrimReplace = "$1$2$3";
      createToken("HYPHENRANGE", `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`);
      createToken("HYPHENRANGELOOSE", `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${src[t.XRANGEPLAINLOOSE]})\\s*$`);
      createToken("STAR", "(<|>)?=?\\s*\\*");
      createToken("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$");
      createToken("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/parse-options.js
  var require_parse_options = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/parse-options.js"(exports, module) {
      var opts = ["includePrerelease", "loose", "rtl"];
      var parseOptions = (options) => !options ? {} : typeof options !== "object" ? { loose: true } : opts.filter((k) => options[k]).reduce((o, k) => {
        o[k] = true;
        return o;
      }, {});
      module.exports = parseOptions;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/identifiers.js
  var require_identifiers = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/identifiers.js"(exports, module) {
      var numeric = /^[0-9]+$/;
      var compareIdentifiers = (a, b) => {
        const anum = numeric.test(a);
        const bnum = numeric.test(b);
        if (anum && bnum) {
          a = +a;
          b = +b;
        }
        return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
      };
      var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a);
      module.exports = {
        compareIdentifiers,
        rcompareIdentifiers
      };
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/semver.js
  var require_semver = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/semver.js"(exports, module) {
      var debug = require_debug();
      var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
      var { re, t } = require_re();
      var parseOptions = require_parse_options();
      var { compareIdentifiers } = require_identifiers();
      var SemVer = class {
        constructor(version, options) {
          options = parseOptions(options);
          if (version instanceof SemVer) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) {
              return version;
            } else {
              version = version.version;
            }
          } else if (typeof version !== "string") {
            throw new TypeError(`Invalid Version: ${version}`);
          }
          if (version.length > MAX_LENGTH) {
            throw new TypeError(
              `version is longer than ${MAX_LENGTH} characters`
            );
          }
          debug("SemVer", version, options);
          this.options = options;
          this.loose = !!options.loose;
          this.includePrerelease = !!options.includePrerelease;
          const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
          if (!m) {
            throw new TypeError(`Invalid Version: ${version}`);
          }
          this.raw = version;
          this.major = +m[1];
          this.minor = +m[2];
          this.patch = +m[3];
          if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
            throw new TypeError("Invalid major version");
          }
          if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
            throw new TypeError("Invalid minor version");
          }
          if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
            throw new TypeError("Invalid patch version");
          }
          if (!m[4]) {
            this.prerelease = [];
          } else {
            this.prerelease = m[4].split(".").map((id) => {
              if (/^[0-9]+$/.test(id)) {
                const num = +id;
                if (num >= 0 && num < MAX_SAFE_INTEGER) {
                  return num;
                }
              }
              return id;
            });
          }
          this.build = m[5] ? m[5].split(".") : [];
          this.format();
        }
        format() {
          this.version = `${this.major}.${this.minor}.${this.patch}`;
          if (this.prerelease.length) {
            this.version += `-${this.prerelease.join(".")}`;
          }
          return this.version;
        }
        toString() {
          return this.version;
        }
        compare(other) {
          debug("SemVer.compare", this.version, this.options, other);
          if (!(other instanceof SemVer)) {
            if (typeof other === "string" && other === this.version) {
              return 0;
            }
            other = new SemVer(other, this.options);
          }
          if (other.version === this.version) {
            return 0;
          }
          return this.compareMain(other) || this.comparePre(other);
        }
        compareMain(other) {
          if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
          }
          return compareIdentifiers(this.major, other.major) || compareIdentifiers(this.minor, other.minor) || compareIdentifiers(this.patch, other.patch);
        }
        comparePre(other) {
          if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
          }
          if (this.prerelease.length && !other.prerelease.length) {
            return -1;
          } else if (!this.prerelease.length && other.prerelease.length) {
            return 1;
          } else if (!this.prerelease.length && !other.prerelease.length) {
            return 0;
          }
          let i = 0;
          do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            debug("prerelease compare", i, a, b);
            if (a === void 0 && b === void 0) {
              return 0;
            } else if (b === void 0) {
              return 1;
            } else if (a === void 0) {
              return -1;
            } else if (a === b) {
              continue;
            } else {
              return compareIdentifiers(a, b);
            }
          } while (++i);
        }
        compareBuild(other) {
          if (!(other instanceof SemVer)) {
            other = new SemVer(other, this.options);
          }
          let i = 0;
          do {
            const a = this.build[i];
            const b = other.build[i];
            debug("prerelease compare", i, a, b);
            if (a === void 0 && b === void 0) {
              return 0;
            } else if (b === void 0) {
              return 1;
            } else if (a === void 0) {
              return -1;
            } else if (a === b) {
              continue;
            } else {
              return compareIdentifiers(a, b);
            }
          } while (++i);
        }
        // preminor will bump the version up to the next minor release, and immediately
        // down to pre-release. premajor and prepatch work the same way.
        inc(release, identifier) {
          switch (release) {
            case "premajor":
              this.prerelease.length = 0;
              this.patch = 0;
              this.minor = 0;
              this.major++;
              this.inc("pre", identifier);
              break;
            case "preminor":
              this.prerelease.length = 0;
              this.patch = 0;
              this.minor++;
              this.inc("pre", identifier);
              break;
            case "prepatch":
              this.prerelease.length = 0;
              this.inc("patch", identifier);
              this.inc("pre", identifier);
              break;
            case "prerelease":
              if (this.prerelease.length === 0) {
                this.inc("patch", identifier);
              }
              this.inc("pre", identifier);
              break;
            case "major":
              if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) {
                this.major++;
              }
              this.minor = 0;
              this.patch = 0;
              this.prerelease = [];
              break;
            case "minor":
              if (this.patch !== 0 || this.prerelease.length === 0) {
                this.minor++;
              }
              this.patch = 0;
              this.prerelease = [];
              break;
            case "patch":
              if (this.prerelease.length === 0) {
                this.patch++;
              }
              this.prerelease = [];
              break;
            case "pre":
              if (this.prerelease.length === 0) {
                this.prerelease = [0];
              } else {
                let i = this.prerelease.length;
                while (--i >= 0) {
                  if (typeof this.prerelease[i] === "number") {
                    this.prerelease[i]++;
                    i = -2;
                  }
                }
                if (i === -1) {
                  this.prerelease.push(0);
                }
              }
              if (identifier) {
                if (compareIdentifiers(this.prerelease[0], identifier) === 0) {
                  if (isNaN(this.prerelease[1])) {
                    this.prerelease = [identifier, 0];
                  }
                } else {
                  this.prerelease = [identifier, 0];
                }
              }
              break;
            default:
              throw new Error(`invalid increment argument: ${release}`);
          }
          this.format();
          this.raw = this.version;
          return this;
        }
      };
      module.exports = SemVer;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/parse.js
  var require_parse = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/parse.js"(exports, module) {
      var { MAX_LENGTH } = require_constants();
      var { re, t } = require_re();
      var SemVer = require_semver();
      var parseOptions = require_parse_options();
      var parse = (version, options) => {
        options = parseOptions(options);
        if (version instanceof SemVer) {
          return version;
        }
        if (typeof version !== "string") {
          return null;
        }
        if (version.length > MAX_LENGTH) {
          return null;
        }
        const r = options.loose ? re[t.LOOSE] : re[t.FULL];
        if (!r.test(version)) {
          return null;
        }
        try {
          return new SemVer(version, options);
        } catch (er) {
          return null;
        }
      };
      module.exports = parse;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/valid.js
  var require_valid = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/valid.js"(exports, module) {
      var parse = require_parse();
      var valid = (version, options) => {
        const v = parse(version, options);
        return v ? v.version : null;
      };
      module.exports = valid;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/clean.js
  var require_clean = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/clean.js"(exports, module) {
      var parse = require_parse();
      var clean = (version, options) => {
        const s = parse(version.trim().replace(/^[=v]+/, ""), options);
        return s ? s.version : null;
      };
      module.exports = clean;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/inc.js
  var require_inc = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/inc.js"(exports, module) {
      var SemVer = require_semver();
      var inc = (version, release, options, identifier) => {
        if (typeof options === "string") {
          identifier = options;
          options = void 0;
        }
        try {
          return new SemVer(
            version instanceof SemVer ? version.version : version,
            options
          ).inc(release, identifier).version;
        } catch (er) {
          return null;
        }
      };
      module.exports = inc;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare.js
  var require_compare = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare.js"(exports, module) {
      var SemVer = require_semver();
      var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
      module.exports = compare;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/eq.js
  var require_eq = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/eq.js"(exports, module) {
      var compare = require_compare();
      var eq = (a, b, loose) => compare(a, b, loose) === 0;
      module.exports = eq;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/diff.js
  var require_diff = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/diff.js"(exports, module) {
      var parse = require_parse();
      var eq = require_eq();
      var diff = (version1, version2) => {
        if (eq(version1, version2)) {
          return null;
        } else {
          const v1 = parse(version1);
          const v2 = parse(version2);
          const hasPre = v1.prerelease.length || v2.prerelease.length;
          const prefix = hasPre ? "pre" : "";
          const defaultResult = hasPre ? "prerelease" : "";
          for (const key in v1) {
            if (key === "major" || key === "minor" || key === "patch") {
              if (v1[key] !== v2[key]) {
                return prefix + key;
              }
            }
          }
          return defaultResult;
        }
      };
      module.exports = diff;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/major.js
  var require_major = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/major.js"(exports, module) {
      var SemVer = require_semver();
      var major = (a, loose) => new SemVer(a, loose).major;
      module.exports = major;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/minor.js
  var require_minor = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/minor.js"(exports, module) {
      var SemVer = require_semver();
      var minor = (a, loose) => new SemVer(a, loose).minor;
      module.exports = minor;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/patch.js
  var require_patch = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/patch.js"(exports, module) {
      var SemVer = require_semver();
      var patch = (a, loose) => new SemVer(a, loose).patch;
      module.exports = patch;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/prerelease.js
  var require_prerelease = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/prerelease.js"(exports, module) {
      var parse = require_parse();
      var prerelease = (version, options) => {
        const parsed = parse(version, options);
        return parsed && parsed.prerelease.length ? parsed.prerelease : null;
      };
      module.exports = prerelease;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/rcompare.js
  var require_rcompare = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/rcompare.js"(exports, module) {
      var compare = require_compare();
      var rcompare = (a, b, loose) => compare(b, a, loose);
      module.exports = rcompare;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare-loose.js
  var require_compare_loose = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare-loose.js"(exports, module) {
      var compare = require_compare();
      var compareLoose = (a, b) => compare(a, b, true);
      module.exports = compareLoose;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare-build.js
  var require_compare_build = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare-build.js"(exports, module) {
      var SemVer = require_semver();
      var compareBuild = (a, b, loose) => {
        const versionA = new SemVer(a, loose);
        const versionB = new SemVer(b, loose);
        return versionA.compare(versionB) || versionA.compareBuild(versionB);
      };
      module.exports = compareBuild;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/sort.js
  var require_sort = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/sort.js"(exports, module) {
      var compareBuild = require_compare_build();
      var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
      module.exports = sort;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/rsort.js
  var require_rsort = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/rsort.js"(exports, module) {
      var compareBuild = require_compare_build();
      var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
      module.exports = rsort;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/gt.js
  var require_gt = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/gt.js"(exports, module) {
      var compare = require_compare();
      var gt = (a, b, loose) => compare(a, b, loose) > 0;
      module.exports = gt;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/lt.js
  var require_lt = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/lt.js"(exports, module) {
      var compare = require_compare();
      var lt = (a, b, loose) => compare(a, b, loose) < 0;
      module.exports = lt;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/neq.js
  var require_neq = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/neq.js"(exports, module) {
      var compare = require_compare();
      var neq = (a, b, loose) => compare(a, b, loose) !== 0;
      module.exports = neq;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/gte.js
  var require_gte = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/gte.js"(exports, module) {
      var compare = require_compare();
      var gte = (a, b, loose) => compare(a, b, loose) >= 0;
      module.exports = gte;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/lte.js
  var require_lte = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/lte.js"(exports, module) {
      var compare = require_compare();
      var lte = (a, b, loose) => compare(a, b, loose) <= 0;
      module.exports = lte;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/cmp.js
  var require_cmp = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/cmp.js"(exports, module) {
      var eq = require_eq();
      var neq = require_neq();
      var gt = require_gt();
      var gte = require_gte();
      var lt = require_lt();
      var lte = require_lte();
      var cmp = (a, op, b, loose) => {
        switch (op) {
          case "===":
            if (typeof a === "object") {
              a = a.version;
            }
            if (typeof b === "object") {
              b = b.version;
            }
            return a === b;
          case "!==":
            if (typeof a === "object") {
              a = a.version;
            }
            if (typeof b === "object") {
              b = b.version;
            }
            return a !== b;
          case "":
          case "=":
          case "==":
            return eq(a, b, loose);
          case "!=":
            return neq(a, b, loose);
          case ">":
            return gt(a, b, loose);
          case ">=":
            return gte(a, b, loose);
          case "<":
            return lt(a, b, loose);
          case "<=":
            return lte(a, b, loose);
          default:
            throw new TypeError(`Invalid operator: ${op}`);
        }
      };
      module.exports = cmp;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/coerce.js
  var require_coerce = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/coerce.js"(exports, module) {
      var SemVer = require_semver();
      var parse = require_parse();
      var { re, t } = require_re();
      var coerce = (version, options) => {
        if (version instanceof SemVer) {
          return version;
        }
        if (typeof version === "number") {
          version = String(version);
        }
        if (typeof version !== "string") {
          return null;
        }
        options = options || {};
        let match = null;
        if (!options.rtl) {
          match = version.match(re[t.COERCE]);
        } else {
          let next;
          while ((next = re[t.COERCERTL].exec(version)) && (!match || match.index + match[0].length !== version.length)) {
            if (!match || next.index + next[0].length !== match.index + match[0].length) {
              match = next;
            }
            re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
          }
          re[t.COERCERTL].lastIndex = -1;
        }
        if (match === null) {
          return null;
        }
        return parse(`${match[2]}.${match[3] || "0"}.${match[4] || "0"}`, options);
      };
      module.exports = coerce;
    }
  });

  // ../../node_modules/.pnpm/yallist@4.0.0/node_modules/yallist/iterator.js
  var require_iterator = __commonJS({
    "../../node_modules/.pnpm/yallist@4.0.0/node_modules/yallist/iterator.js"(exports, module) {
      "use strict";
      module.exports = function(Yallist) {
        Yallist.prototype[Symbol.iterator] = function* () {
          for (let walker = this.head; walker; walker = walker.next) {
            yield walker.value;
          }
        };
      };
    }
  });

  // ../../node_modules/.pnpm/yallist@4.0.0/node_modules/yallist/yallist.js
  var require_yallist = __commonJS({
    "../../node_modules/.pnpm/yallist@4.0.0/node_modules/yallist/yallist.js"(exports, module) {
      "use strict";
      module.exports = Yallist;
      Yallist.Node = Node;
      Yallist.create = Yallist;
      function Yallist(list) {
        var self = this;
        if (!(self instanceof Yallist)) {
          self = new Yallist();
        }
        self.tail = null;
        self.head = null;
        self.length = 0;
        if (list && typeof list.forEach === "function") {
          list.forEach(function(item) {
            self.push(item);
          });
        } else if (arguments.length > 0) {
          for (var i = 0, l = arguments.length; i < l; i++) {
            self.push(arguments[i]);
          }
        }
        return self;
      }
      Yallist.prototype.removeNode = function(node) {
        if (node.list !== this) {
          throw new Error("removing node which does not belong to this list");
        }
        var next = node.next;
        var prev = node.prev;
        if (next) {
          next.prev = prev;
        }
        if (prev) {
          prev.next = next;
        }
        if (node === this.head) {
          this.head = next;
        }
        if (node === this.tail) {
          this.tail = prev;
        }
        node.list.length--;
        node.next = null;
        node.prev = null;
        node.list = null;
        return next;
      };
      Yallist.prototype.unshiftNode = function(node) {
        if (node === this.head) {
          return;
        }
        if (node.list) {
          node.list.removeNode(node);
        }
        var head = this.head;
        node.list = this;
        node.next = head;
        if (head) {
          head.prev = node;
        }
        this.head = node;
        if (!this.tail) {
          this.tail = node;
        }
        this.length++;
      };
      Yallist.prototype.pushNode = function(node) {
        if (node === this.tail) {
          return;
        }
        if (node.list) {
          node.list.removeNode(node);
        }
        var tail = this.tail;
        node.list = this;
        node.prev = tail;
        if (tail) {
          tail.next = node;
        }
        this.tail = node;
        if (!this.head) {
          this.head = node;
        }
        this.length++;
      };
      Yallist.prototype.push = function() {
        for (var i = 0, l = arguments.length; i < l; i++) {
          push(this, arguments[i]);
        }
        return this.length;
      };
      Yallist.prototype.unshift = function() {
        for (var i = 0, l = arguments.length; i < l; i++) {
          unshift(this, arguments[i]);
        }
        return this.length;
      };
      Yallist.prototype.pop = function() {
        if (!this.tail) {
          return void 0;
        }
        var res = this.tail.value;
        this.tail = this.tail.prev;
        if (this.tail) {
          this.tail.next = null;
        } else {
          this.head = null;
        }
        this.length--;
        return res;
      };
      Yallist.prototype.shift = function() {
        if (!this.head) {
          return void 0;
        }
        var res = this.head.value;
        this.head = this.head.next;
        if (this.head) {
          this.head.prev = null;
        } else {
          this.tail = null;
        }
        this.length--;
        return res;
      };
      Yallist.prototype.forEach = function(fn, thisp) {
        thisp = thisp || this;
        for (var walker = this.head, i = 0; walker !== null; i++) {
          fn.call(thisp, walker.value, i, this);
          walker = walker.next;
        }
      };
      Yallist.prototype.forEachReverse = function(fn, thisp) {
        thisp = thisp || this;
        for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
          fn.call(thisp, walker.value, i, this);
          walker = walker.prev;
        }
      };
      Yallist.prototype.get = function(n) {
        for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
          walker = walker.next;
        }
        if (i === n && walker !== null) {
          return walker.value;
        }
      };
      Yallist.prototype.getReverse = function(n) {
        for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
          walker = walker.prev;
        }
        if (i === n && walker !== null) {
          return walker.value;
        }
      };
      Yallist.prototype.map = function(fn, thisp) {
        thisp = thisp || this;
        var res = new Yallist();
        for (var walker = this.head; walker !== null; ) {
          res.push(fn.call(thisp, walker.value, this));
          walker = walker.next;
        }
        return res;
      };
      Yallist.prototype.mapReverse = function(fn, thisp) {
        thisp = thisp || this;
        var res = new Yallist();
        for (var walker = this.tail; walker !== null; ) {
          res.push(fn.call(thisp, walker.value, this));
          walker = walker.prev;
        }
        return res;
      };
      Yallist.prototype.reduce = function(fn, initial) {
        var acc;
        var walker = this.head;
        if (arguments.length > 1) {
          acc = initial;
        } else if (this.head) {
          walker = this.head.next;
          acc = this.head.value;
        } else {
          throw new TypeError("Reduce of empty list with no initial value");
        }
        for (var i = 0; walker !== null; i++) {
          acc = fn(acc, walker.value, i);
          walker = walker.next;
        }
        return acc;
      };
      Yallist.prototype.reduceReverse = function(fn, initial) {
        var acc;
        var walker = this.tail;
        if (arguments.length > 1) {
          acc = initial;
        } else if (this.tail) {
          walker = this.tail.prev;
          acc = this.tail.value;
        } else {
          throw new TypeError("Reduce of empty list with no initial value");
        }
        for (var i = this.length - 1; walker !== null; i--) {
          acc = fn(acc, walker.value, i);
          walker = walker.prev;
        }
        return acc;
      };
      Yallist.prototype.toArray = function() {
        var arr = new Array(this.length);
        for (var i = 0, walker = this.head; walker !== null; i++) {
          arr[i] = walker.value;
          walker = walker.next;
        }
        return arr;
      };
      Yallist.prototype.toArrayReverse = function() {
        var arr = new Array(this.length);
        for (var i = 0, walker = this.tail; walker !== null; i++) {
          arr[i] = walker.value;
          walker = walker.prev;
        }
        return arr;
      };
      Yallist.prototype.slice = function(from, to) {
        to = to || this.length;
        if (to < 0) {
          to += this.length;
        }
        from = from || 0;
        if (from < 0) {
          from += this.length;
        }
        var ret = new Yallist();
        if (to < from || to < 0) {
          return ret;
        }
        if (from < 0) {
          from = 0;
        }
        if (to > this.length) {
          to = this.length;
        }
        for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
          walker = walker.next;
        }
        for (; walker !== null && i < to; i++, walker = walker.next) {
          ret.push(walker.value);
        }
        return ret;
      };
      Yallist.prototype.sliceReverse = function(from, to) {
        to = to || this.length;
        if (to < 0) {
          to += this.length;
        }
        from = from || 0;
        if (from < 0) {
          from += this.length;
        }
        var ret = new Yallist();
        if (to < from || to < 0) {
          return ret;
        }
        if (from < 0) {
          from = 0;
        }
        if (to > this.length) {
          to = this.length;
        }
        for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
          walker = walker.prev;
        }
        for (; walker !== null && i > from; i--, walker = walker.prev) {
          ret.push(walker.value);
        }
        return ret;
      };
      Yallist.prototype.splice = function(start, deleteCount, ...nodes) {
        if (start > this.length) {
          start = this.length - 1;
        }
        if (start < 0) {
          start = this.length + start;
        }
        for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
          walker = walker.next;
        }
        var ret = [];
        for (var i = 0; walker && i < deleteCount; i++) {
          ret.push(walker.value);
          walker = this.removeNode(walker);
        }
        if (walker === null) {
          walker = this.tail;
        }
        if (walker !== this.head && walker !== this.tail) {
          walker = walker.prev;
        }
        for (var i = 0; i < nodes.length; i++) {
          walker = insert(this, walker, nodes[i]);
        }
        return ret;
      };
      Yallist.prototype.reverse = function() {
        var head = this.head;
        var tail = this.tail;
        for (var walker = head; walker !== null; walker = walker.prev) {
          var p = walker.prev;
          walker.prev = walker.next;
          walker.next = p;
        }
        this.head = tail;
        this.tail = head;
        return this;
      };
      function insert(self, node, value) {
        var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);
        if (inserted.next === null) {
          self.tail = inserted;
        }
        if (inserted.prev === null) {
          self.head = inserted;
        }
        self.length++;
        return inserted;
      }
      function push(self, item) {
        self.tail = new Node(item, self.tail, null, self);
        if (!self.head) {
          self.head = self.tail;
        }
        self.length++;
      }
      function unshift(self, item) {
        self.head = new Node(item, null, self.head, self);
        if (!self.tail) {
          self.tail = self.head;
        }
        self.length++;
      }
      function Node(value, prev, next, list) {
        if (!(this instanceof Node)) {
          return new Node(value, prev, next, list);
        }
        this.list = list;
        this.value = value;
        if (prev) {
          prev.next = this;
          this.prev = prev;
        } else {
          this.prev = null;
        }
        if (next) {
          next.prev = this;
          this.next = next;
        } else {
          this.next = null;
        }
      }
      try {
        require_iterator()(Yallist);
      } catch (er) {
      }
    }
  });

  // ../../node_modules/.pnpm/lru-cache@6.0.0/node_modules/lru-cache/index.js
  var require_lru_cache = __commonJS({
    "../../node_modules/.pnpm/lru-cache@6.0.0/node_modules/lru-cache/index.js"(exports, module) {
      "use strict";
      var Yallist = require_yallist();
      var MAX = Symbol("max");
      var LENGTH = Symbol("length");
      var LENGTH_CALCULATOR = Symbol("lengthCalculator");
      var ALLOW_STALE = Symbol("allowStale");
      var MAX_AGE = Symbol("maxAge");
      var DISPOSE = Symbol("dispose");
      var NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet");
      var LRU_LIST = Symbol("lruList");
      var CACHE = Symbol("cache");
      var UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet");
      var naiveLength = () => 1;
      var LRUCache = class {
        constructor(options) {
          if (typeof options === "number")
            options = { max: options };
          if (!options)
            options = {};
          if (options.max && (typeof options.max !== "number" || options.max < 0))
            throw new TypeError("max must be a non-negative number");
          const max = this[MAX] = options.max || Infinity;
          const lc = options.length || naiveLength;
          this[LENGTH_CALCULATOR] = typeof lc !== "function" ? naiveLength : lc;
          this[ALLOW_STALE] = options.stale || false;
          if (options.maxAge && typeof options.maxAge !== "number")
            throw new TypeError("maxAge must be a number");
          this[MAX_AGE] = options.maxAge || 0;
          this[DISPOSE] = options.dispose;
          this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
          this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
          this.reset();
        }
        // resize the cache when the max changes.
        set max(mL) {
          if (typeof mL !== "number" || mL < 0)
            throw new TypeError("max must be a non-negative number");
          this[MAX] = mL || Infinity;
          trim(this);
        }
        get max() {
          return this[MAX];
        }
        set allowStale(allowStale) {
          this[ALLOW_STALE] = !!allowStale;
        }
        get allowStale() {
          return this[ALLOW_STALE];
        }
        set maxAge(mA) {
          if (typeof mA !== "number")
            throw new TypeError("maxAge must be a non-negative number");
          this[MAX_AGE] = mA;
          trim(this);
        }
        get maxAge() {
          return this[MAX_AGE];
        }
        // resize the cache when the lengthCalculator changes.
        set lengthCalculator(lC) {
          if (typeof lC !== "function")
            lC = naiveLength;
          if (lC !== this[LENGTH_CALCULATOR]) {
            this[LENGTH_CALCULATOR] = lC;
            this[LENGTH] = 0;
            this[LRU_LIST].forEach((hit) => {
              hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
              this[LENGTH] += hit.length;
            });
          }
          trim(this);
        }
        get lengthCalculator() {
          return this[LENGTH_CALCULATOR];
        }
        get length() {
          return this[LENGTH];
        }
        get itemCount() {
          return this[LRU_LIST].length;
        }
        rforEach(fn, thisp) {
          thisp = thisp || this;
          for (let walker = this[LRU_LIST].tail; walker !== null; ) {
            const prev = walker.prev;
            forEachStep(this, fn, walker, thisp);
            walker = prev;
          }
        }
        forEach(fn, thisp) {
          thisp = thisp || this;
          for (let walker = this[LRU_LIST].head; walker !== null; ) {
            const next = walker.next;
            forEachStep(this, fn, walker, thisp);
            walker = next;
          }
        }
        keys() {
          return this[LRU_LIST].toArray().map((k) => k.key);
        }
        values() {
          return this[LRU_LIST].toArray().map((k) => k.value);
        }
        reset() {
          if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
            this[LRU_LIST].forEach((hit) => this[DISPOSE](hit.key, hit.value));
          }
          this[CACHE] = /* @__PURE__ */ new Map();
          this[LRU_LIST] = new Yallist();
          this[LENGTH] = 0;
        }
        dump() {
          return this[LRU_LIST].map((hit) => isStale(this, hit) ? false : {
            k: hit.key,
            v: hit.value,
            e: hit.now + (hit.maxAge || 0)
          }).toArray().filter((h) => h);
        }
        dumpLru() {
          return this[LRU_LIST];
        }
        set(key, value, maxAge) {
          maxAge = maxAge || this[MAX_AGE];
          if (maxAge && typeof maxAge !== "number")
            throw new TypeError("maxAge must be a number");
          const now = maxAge ? Date.now() : 0;
          const len = this[LENGTH_CALCULATOR](value, key);
          if (this[CACHE].has(key)) {
            if (len > this[MAX]) {
              del(this, this[CACHE].get(key));
              return false;
            }
            const node = this[CACHE].get(key);
            const item = node.value;
            if (this[DISPOSE]) {
              if (!this[NO_DISPOSE_ON_SET])
                this[DISPOSE](key, item.value);
            }
            item.now = now;
            item.maxAge = maxAge;
            item.value = value;
            this[LENGTH] += len - item.length;
            item.length = len;
            this.get(key);
            trim(this);
            return true;
          }
          const hit = new Entry(key, value, len, now, maxAge);
          if (hit.length > this[MAX]) {
            if (this[DISPOSE])
              this[DISPOSE](key, value);
            return false;
          }
          this[LENGTH] += hit.length;
          this[LRU_LIST].unshift(hit);
          this[CACHE].set(key, this[LRU_LIST].head);
          trim(this);
          return true;
        }
        has(key) {
          if (!this[CACHE].has(key))
            return false;
          const hit = this[CACHE].get(key).value;
          return !isStale(this, hit);
        }
        get(key) {
          return get(this, key, true);
        }
        peek(key) {
          return get(this, key, false);
        }
        pop() {
          const node = this[LRU_LIST].tail;
          if (!node)
            return null;
          del(this, node);
          return node.value;
        }
        del(key) {
          del(this, this[CACHE].get(key));
        }
        load(arr) {
          this.reset();
          const now = Date.now();
          for (let l = arr.length - 1; l >= 0; l--) {
            const hit = arr[l];
            const expiresAt = hit.e || 0;
            if (expiresAt === 0)
              this.set(hit.k, hit.v);
            else {
              const maxAge = expiresAt - now;
              if (maxAge > 0) {
                this.set(hit.k, hit.v, maxAge);
              }
            }
          }
        }
        prune() {
          this[CACHE].forEach((value, key) => get(this, key, false));
        }
      };
      var get = (self, key, doUse) => {
        const node = self[CACHE].get(key);
        if (node) {
          const hit = node.value;
          if (isStale(self, hit)) {
            del(self, node);
            if (!self[ALLOW_STALE])
              return void 0;
          } else {
            if (doUse) {
              if (self[UPDATE_AGE_ON_GET])
                node.value.now = Date.now();
              self[LRU_LIST].unshiftNode(node);
            }
          }
          return hit.value;
        }
      };
      var isStale = (self, hit) => {
        if (!hit || !hit.maxAge && !self[MAX_AGE])
          return false;
        const diff = Date.now() - hit.now;
        return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
      };
      var trim = (self) => {
        if (self[LENGTH] > self[MAX]) {
          for (let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null; ) {
            const prev = walker.prev;
            del(self, walker);
            walker = prev;
          }
        }
      };
      var del = (self, node) => {
        if (node) {
          const hit = node.value;
          if (self[DISPOSE])
            self[DISPOSE](hit.key, hit.value);
          self[LENGTH] -= hit.length;
          self[CACHE].delete(hit.key);
          self[LRU_LIST].removeNode(node);
        }
      };
      var Entry = class {
        constructor(key, value, length, now, maxAge) {
          this.key = key;
          this.value = value;
          this.length = length;
          this.now = now;
          this.maxAge = maxAge || 0;
        }
      };
      var forEachStep = (self, fn, node, thisp) => {
        let hit = node.value;
        if (isStale(self, hit)) {
          del(self, node);
          if (!self[ALLOW_STALE])
            hit = void 0;
        }
        if (hit)
          fn.call(thisp, hit.value, hit.key, self);
      };
      module.exports = LRUCache;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/range.js
  var require_range = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/range.js"(exports, module) {
      var Range = class {
        constructor(range, options) {
          options = parseOptions(options);
          if (range instanceof Range) {
            if (range.loose === !!options.loose && range.includePrerelease === !!options.includePrerelease) {
              return range;
            } else {
              return new Range(range.raw, options);
            }
          }
          if (range instanceof Comparator) {
            this.raw = range.value;
            this.set = [[range]];
            this.format();
            return this;
          }
          this.options = options;
          this.loose = !!options.loose;
          this.includePrerelease = !!options.includePrerelease;
          this.raw = range;
          this.set = range.split("||").map((r) => this.parseRange(r.trim())).filter((c) => c.length);
          if (!this.set.length) {
            throw new TypeError(`Invalid SemVer Range: ${range}`);
          }
          if (this.set.length > 1) {
            const first = this.set[0];
            this.set = this.set.filter((c) => !isNullSet(c[0]));
            if (this.set.length === 0) {
              this.set = [first];
            } else if (this.set.length > 1) {
              for (const c of this.set) {
                if (c.length === 1 && isAny(c[0])) {
                  this.set = [c];
                  break;
                }
              }
            }
          }
          this.format();
        }
        format() {
          this.range = this.set.map((comps) => {
            return comps.join(" ").trim();
          }).join("||").trim();
          return this.range;
        }
        toString() {
          return this.range;
        }
        parseRange(range) {
          range = range.trim();
          const memoOpts = Object.keys(this.options).join(",");
          const memoKey = `parseRange:${memoOpts}:${range}`;
          const cached = cache.get(memoKey);
          if (cached) {
            return cached;
          }
          const loose = this.options.loose;
          const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE];
          range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
          debug("hyphen replace", range);
          range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace);
          debug("comparator trim", range);
          range = range.replace(re[t.TILDETRIM], tildeTrimReplace);
          range = range.replace(re[t.CARETTRIM], caretTrimReplace);
          range = range.split(/\s+/).join(" ");
          let rangeList = range.split(" ").map((comp) => parseComparator(comp, this.options)).join(" ").split(/\s+/).map((comp) => replaceGTE0(comp, this.options));
          if (loose) {
            rangeList = rangeList.filter((comp) => {
              debug("loose invalid filter", comp, this.options);
              return !!comp.match(re[t.COMPARATORLOOSE]);
            });
          }
          debug("range list", rangeList);
          const rangeMap = /* @__PURE__ */ new Map();
          const comparators = rangeList.map((comp) => new Comparator(comp, this.options));
          for (const comp of comparators) {
            if (isNullSet(comp)) {
              return [comp];
            }
            rangeMap.set(comp.value, comp);
          }
          if (rangeMap.size > 1 && rangeMap.has("")) {
            rangeMap.delete("");
          }
          const result = [...rangeMap.values()];
          cache.set(memoKey, result);
          return result;
        }
        intersects(range, options) {
          if (!(range instanceof Range)) {
            throw new TypeError("a Range is required");
          }
          return this.set.some((thisComparators) => {
            return isSatisfiable(thisComparators, options) && range.set.some((rangeComparators) => {
              return isSatisfiable(rangeComparators, options) && thisComparators.every((thisComparator) => {
                return rangeComparators.every((rangeComparator) => {
                  return thisComparator.intersects(rangeComparator, options);
                });
              });
            });
          });
        }
        // if ANY of the sets match ALL of its comparators, then pass
        test(version) {
          if (!version) {
            return false;
          }
          if (typeof version === "string") {
            try {
              version = new SemVer(version, this.options);
            } catch (er) {
              return false;
            }
          }
          for (let i = 0; i < this.set.length; i++) {
            if (testSet(this.set[i], version, this.options)) {
              return true;
            }
          }
          return false;
        }
      };
      module.exports = Range;
      var LRU = require_lru_cache();
      var cache = new LRU({ max: 1e3 });
      var parseOptions = require_parse_options();
      var Comparator = require_comparator();
      var debug = require_debug();
      var SemVer = require_semver();
      var {
        re,
        t,
        comparatorTrimReplace,
        tildeTrimReplace,
        caretTrimReplace
      } = require_re();
      var isNullSet = (c) => c.value === "<0.0.0-0";
      var isAny = (c) => c.value === "";
      var isSatisfiable = (comparators, options) => {
        let result = true;
        const remainingComparators = comparators.slice();
        let testComparator = remainingComparators.pop();
        while (result && remainingComparators.length) {
          result = remainingComparators.every((otherComparator) => {
            return testComparator.intersects(otherComparator, options);
          });
          testComparator = remainingComparators.pop();
        }
        return result;
      };
      var parseComparator = (comp, options) => {
        debug("comp", comp, options);
        comp = replaceCarets(comp, options);
        debug("caret", comp);
        comp = replaceTildes(comp, options);
        debug("tildes", comp);
        comp = replaceXRanges(comp, options);
        debug("xrange", comp);
        comp = replaceStars(comp, options);
        debug("stars", comp);
        return comp;
      };
      var isX = (id) => !id || id.toLowerCase() === "x" || id === "*";
      var replaceTildes = (comp, options) => comp.trim().split(/\s+/).map((c) => {
        return replaceTilde(c, options);
      }).join(" ");
      var replaceTilde = (comp, options) => {
        const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE];
        return comp.replace(r, (_, M, m, p, pr) => {
          debug("tilde", comp, _, M, m, p, pr);
          let ret;
          if (isX(M)) {
            ret = "";
          } else if (isX(m)) {
            ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
          } else if (isX(p)) {
            ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
          } else if (pr) {
            debug("replaceTilde pr", pr);
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
          } else {
            ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`;
          }
          debug("tilde return", ret);
          return ret;
        });
      };
      var replaceCarets = (comp, options) => comp.trim().split(/\s+/).map((c) => {
        return replaceCaret(c, options);
      }).join(" ");
      var replaceCaret = (comp, options) => {
        debug("caret", comp, options);
        const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET];
        const z = options.includePrerelease ? "-0" : "";
        return comp.replace(r, (_, M, m, p, pr) => {
          debug("caret", comp, _, M, m, p, pr);
          let ret;
          if (isX(M)) {
            ret = "";
          } else if (isX(m)) {
            ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
          } else if (isX(p)) {
            if (M === "0") {
              ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
            } else {
              ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
            }
          } else if (pr) {
            debug("replaceCaret pr", pr);
            if (M === "0") {
              if (m === "0") {
                ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`;
              } else {
                ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`;
              }
            } else {
              ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`;
            }
          } else {
            debug("no pr");
            if (M === "0") {
              if (m === "0") {
                ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`;
              } else {
                ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`;
              }
            } else {
              ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`;
            }
          }
          debug("caret return", ret);
          return ret;
        });
      };
      var replaceXRanges = (comp, options) => {
        debug("replaceXRanges", comp, options);
        return comp.split(/\s+/).map((c) => {
          return replaceXRange(c, options);
        }).join(" ");
      };
      var replaceXRange = (comp, options) => {
        comp = comp.trim();
        const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE];
        return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
          debug("xRange", comp, ret, gtlt, M, m, p, pr);
          const xM = isX(M);
          const xm = xM || isX(m);
          const xp = xm || isX(p);
          const anyX = xp;
          if (gtlt === "=" && anyX) {
            gtlt = "";
          }
          pr = options.includePrerelease ? "-0" : "";
          if (xM) {
            if (gtlt === ">" || gtlt === "<") {
              ret = "<0.0.0-0";
            } else {
              ret = "*";
            }
          } else if (gtlt && anyX) {
            if (xm) {
              m = 0;
            }
            p = 0;
            if (gtlt === ">") {
              gtlt = ">=";
              if (xm) {
                M = +M + 1;
                m = 0;
                p = 0;
              } else {
                m = +m + 1;
                p = 0;
              }
            } else if (gtlt === "<=") {
              gtlt = "<";
              if (xm) {
                M = +M + 1;
              } else {
                m = +m + 1;
              }
            }
            if (gtlt === "<") {
              pr = "-0";
            }
            ret = `${gtlt + M}.${m}.${p}${pr}`;
          } else if (xm) {
            ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
          } else if (xp) {
            ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`;
          }
          debug("xRange return", ret);
          return ret;
        });
      };
      var replaceStars = (comp, options) => {
        debug("replaceStars", comp, options);
        return comp.trim().replace(re[t.STAR], "");
      };
      var replaceGTE0 = (comp, options) => {
        debug("replaceGTE0", comp, options);
        return comp.trim().replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "");
      };
      var hyphenReplace = (incPr) => ($0, from, fM, fm, fp, fpr, fb, to, tM, tm, tp, tpr, tb) => {
        if (isX(fM)) {
          from = "";
        } else if (isX(fm)) {
          from = `>=${fM}.0.0${incPr ? "-0" : ""}`;
        } else if (isX(fp)) {
          from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`;
        } else if (fpr) {
          from = `>=${from}`;
        } else {
          from = `>=${from}${incPr ? "-0" : ""}`;
        }
        if (isX(tM)) {
          to = "";
        } else if (isX(tm)) {
          to = `<${+tM + 1}.0.0-0`;
        } else if (isX(tp)) {
          to = `<${tM}.${+tm + 1}.0-0`;
        } else if (tpr) {
          to = `<=${tM}.${tm}.${tp}-${tpr}`;
        } else if (incPr) {
          to = `<${tM}.${tm}.${+tp + 1}-0`;
        } else {
          to = `<=${to}`;
        }
        return `${from} ${to}`.trim();
      };
      var testSet = (set, version, options) => {
        for (let i = 0; i < set.length; i++) {
          if (!set[i].test(version)) {
            return false;
          }
        }
        if (version.prerelease.length && !options.includePrerelease) {
          for (let i = 0; i < set.length; i++) {
            debug(set[i].semver);
            if (set[i].semver === Comparator.ANY) {
              continue;
            }
            if (set[i].semver.prerelease.length > 0) {
              const allowed = set[i].semver;
              if (allowed.major === version.major && allowed.minor === version.minor && allowed.patch === version.patch) {
                return true;
              }
            }
          }
          return false;
        }
        return true;
      };
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/comparator.js
  var require_comparator = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/comparator.js"(exports, module) {
      var ANY = Symbol("SemVer ANY");
      var Comparator = class {
        static get ANY() {
          return ANY;
        }
        constructor(comp, options) {
          options = parseOptions(options);
          if (comp instanceof Comparator) {
            if (comp.loose === !!options.loose) {
              return comp;
            } else {
              comp = comp.value;
            }
          }
          debug("comparator", comp, options);
          this.options = options;
          this.loose = !!options.loose;
          this.parse(comp);
          if (this.semver === ANY) {
            this.value = "";
          } else {
            this.value = this.operator + this.semver.version;
          }
          debug("comp", this);
        }
        parse(comp) {
          const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
          const m = comp.match(r);
          if (!m) {
            throw new TypeError(`Invalid comparator: ${comp}`);
          }
          this.operator = m[1] !== void 0 ? m[1] : "";
          if (this.operator === "=") {
            this.operator = "";
          }
          if (!m[2]) {
            this.semver = ANY;
          } else {
            this.semver = new SemVer(m[2], this.options.loose);
          }
        }
        toString() {
          return this.value;
        }
        test(version) {
          debug("Comparator.test", version, this.options.loose);
          if (this.semver === ANY || version === ANY) {
            return true;
          }
          if (typeof version === "string") {
            try {
              version = new SemVer(version, this.options);
            } catch (er) {
              return false;
            }
          }
          return cmp(version, this.operator, this.semver, this.options);
        }
        intersects(comp, options) {
          if (!(comp instanceof Comparator)) {
            throw new TypeError("a Comparator is required");
          }
          if (!options || typeof options !== "object") {
            options = {
              loose: !!options,
              includePrerelease: false
            };
          }
          if (this.operator === "") {
            if (this.value === "") {
              return true;
            }
            return new Range(comp.value, options).test(this.value);
          } else if (comp.operator === "") {
            if (comp.value === "") {
              return true;
            }
            return new Range(this.value, options).test(comp.semver);
          }
          const sameDirectionIncreasing = (this.operator === ">=" || this.operator === ">") && (comp.operator === ">=" || comp.operator === ">");
          const sameDirectionDecreasing = (this.operator === "<=" || this.operator === "<") && (comp.operator === "<=" || comp.operator === "<");
          const sameSemVer = this.semver.version === comp.semver.version;
          const differentDirectionsInclusive = (this.operator === ">=" || this.operator === "<=") && (comp.operator === ">=" || comp.operator === "<=");
          const oppositeDirectionsLessThan = cmp(this.semver, "<", comp.semver, options) && (this.operator === ">=" || this.operator === ">") && (comp.operator === "<=" || comp.operator === "<");
          const oppositeDirectionsGreaterThan = cmp(this.semver, ">", comp.semver, options) && (this.operator === "<=" || this.operator === "<") && (comp.operator === ">=" || comp.operator === ">");
          return sameDirectionIncreasing || sameDirectionDecreasing || sameSemVer && differentDirectionsInclusive || oppositeDirectionsLessThan || oppositeDirectionsGreaterThan;
        }
      };
      module.exports = Comparator;
      var parseOptions = require_parse_options();
      var { re, t } = require_re();
      var cmp = require_cmp();
      var debug = require_debug();
      var SemVer = require_semver();
      var Range = require_range();
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/satisfies.js
  var require_satisfies = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/satisfies.js"(exports, module) {
      var Range = require_range();
      var satisfies = (version, range, options) => {
        try {
          range = new Range(range, options);
        } catch (er) {
          return false;
        }
        return range.test(version);
      };
      module.exports = satisfies;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/to-comparators.js
  var require_to_comparators = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/to-comparators.js"(exports, module) {
      var Range = require_range();
      var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
      module.exports = toComparators;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/max-satisfying.js
  var require_max_satisfying = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/max-satisfying.js"(exports, module) {
      var SemVer = require_semver();
      var Range = require_range();
      var maxSatisfying = (versions, range, options) => {
        let max = null;
        let maxSV = null;
        let rangeObj = null;
        try {
          rangeObj = new Range(range, options);
        } catch (er) {
          return null;
        }
        versions.forEach((v) => {
          if (rangeObj.test(v)) {
            if (!max || maxSV.compare(v) === -1) {
              max = v;
              maxSV = new SemVer(max, options);
            }
          }
        });
        return max;
      };
      module.exports = maxSatisfying;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/min-satisfying.js
  var require_min_satisfying = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/min-satisfying.js"(exports, module) {
      var SemVer = require_semver();
      var Range = require_range();
      var minSatisfying = (versions, range, options) => {
        let min = null;
        let minSV = null;
        let rangeObj = null;
        try {
          rangeObj = new Range(range, options);
        } catch (er) {
          return null;
        }
        versions.forEach((v) => {
          if (rangeObj.test(v)) {
            if (!min || minSV.compare(v) === 1) {
              min = v;
              minSV = new SemVer(min, options);
            }
          }
        });
        return min;
      };
      module.exports = minSatisfying;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/min-version.js
  var require_min_version = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/min-version.js"(exports, module) {
      var SemVer = require_semver();
      var Range = require_range();
      var gt = require_gt();
      var minVersion = (range, loose) => {
        range = new Range(range, loose);
        let minver = new SemVer("0.0.0");
        if (range.test(minver)) {
          return minver;
        }
        minver = new SemVer("0.0.0-0");
        if (range.test(minver)) {
          return minver;
        }
        minver = null;
        for (let i = 0; i < range.set.length; ++i) {
          const comparators = range.set[i];
          let setMin = null;
          comparators.forEach((comparator) => {
            const compver = new SemVer(comparator.semver.version);
            switch (comparator.operator) {
              case ">":
                if (compver.prerelease.length === 0) {
                  compver.patch++;
                } else {
                  compver.prerelease.push(0);
                }
                compver.raw = compver.format();
              case "":
              case ">=":
                if (!setMin || gt(compver, setMin)) {
                  setMin = compver;
                }
                break;
              case "<":
              case "<=":
                break;
              default:
                throw new Error(`Unexpected operation: ${comparator.operator}`);
            }
          });
          if (setMin && (!minver || gt(minver, setMin))) {
            minver = setMin;
          }
        }
        if (minver && range.test(minver)) {
          return minver;
        }
        return null;
      };
      module.exports = minVersion;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/valid.js
  var require_valid2 = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/valid.js"(exports, module) {
      var Range = require_range();
      var validRange = (range, options) => {
        try {
          return new Range(range, options).range || "*";
        } catch (er) {
          return null;
        }
      };
      module.exports = validRange;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/outside.js
  var require_outside = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/outside.js"(exports, module) {
      var SemVer = require_semver();
      var Comparator = require_comparator();
      var { ANY } = Comparator;
      var Range = require_range();
      var satisfies = require_satisfies();
      var gt = require_gt();
      var lt = require_lt();
      var lte = require_lte();
      var gte = require_gte();
      var outside = (version, range, hilo, options) => {
        version = new SemVer(version, options);
        range = new Range(range, options);
        let gtfn, ltefn, ltfn, comp, ecomp;
        switch (hilo) {
          case ">":
            gtfn = gt;
            ltefn = lte;
            ltfn = lt;
            comp = ">";
            ecomp = ">=";
            break;
          case "<":
            gtfn = lt;
            ltefn = gte;
            ltfn = gt;
            comp = "<";
            ecomp = "<=";
            break;
          default:
            throw new TypeError('Must provide a hilo val of "<" or ">"');
        }
        if (satisfies(version, range, options)) {
          return false;
        }
        for (let i = 0; i < range.set.length; ++i) {
          const comparators = range.set[i];
          let high = null;
          let low = null;
          comparators.forEach((comparator) => {
            if (comparator.semver === ANY) {
              comparator = new Comparator(">=0.0.0");
            }
            high = high || comparator;
            low = low || comparator;
            if (gtfn(comparator.semver, high.semver, options)) {
              high = comparator;
            } else if (ltfn(comparator.semver, low.semver, options)) {
              low = comparator;
            }
          });
          if (high.operator === comp || high.operator === ecomp) {
            return false;
          }
          if ((!low.operator || low.operator === comp) && ltefn(version, low.semver)) {
            return false;
          } else if (low.operator === ecomp && ltfn(version, low.semver)) {
            return false;
          }
        }
        return true;
      };
      module.exports = outside;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/gtr.js
  var require_gtr = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/gtr.js"(exports, module) {
      var outside = require_outside();
      var gtr = (version, range, options) => outside(version, range, ">", options);
      module.exports = gtr;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/ltr.js
  var require_ltr = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/ltr.js"(exports, module) {
      var outside = require_outside();
      var ltr = (version, range, options) => outside(version, range, "<", options);
      module.exports = ltr;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/intersects.js
  var require_intersects = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/intersects.js"(exports, module) {
      var Range = require_range();
      var intersects = (r1, r2, options) => {
        r1 = new Range(r1, options);
        r2 = new Range(r2, options);
        return r1.intersects(r2);
      };
      module.exports = intersects;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/simplify.js
  var require_simplify = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/simplify.js"(exports, module) {
      var satisfies = require_satisfies();
      var compare = require_compare();
      module.exports = (versions, range, options) => {
        const set = [];
        let first = null;
        let prev = null;
        const v = versions.sort((a, b) => compare(a, b, options));
        for (const version of v) {
          const included = satisfies(version, range, options);
          if (included) {
            prev = version;
            if (!first) {
              first = version;
            }
          } else {
            if (prev) {
              set.push([first, prev]);
            }
            prev = null;
            first = null;
          }
        }
        if (first) {
          set.push([first, null]);
        }
        const ranges = [];
        for (const [min, max] of set) {
          if (min === max) {
            ranges.push(min);
          } else if (!max && min === v[0]) {
            ranges.push("*");
          } else if (!max) {
            ranges.push(`>=${min}`);
          } else if (min === v[0]) {
            ranges.push(`<=${max}`);
          } else {
            ranges.push(`${min} - ${max}`);
          }
        }
        const simplified = ranges.join(" || ");
        const original = typeof range.raw === "string" ? range.raw : String(range);
        return simplified.length < original.length ? simplified : range;
      };
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/subset.js
  var require_subset = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/subset.js"(exports, module) {
      var Range = require_range();
      var Comparator = require_comparator();
      var { ANY } = Comparator;
      var satisfies = require_satisfies();
      var compare = require_compare();
      var subset = (sub, dom, options = {}) => {
        if (sub === dom) {
          return true;
        }
        sub = new Range(sub, options);
        dom = new Range(dom, options);
        let sawNonNull = false;
        OUTER:
          for (const simpleSub of sub.set) {
            for (const simpleDom of dom.set) {
              const isSub = simpleSubset(simpleSub, simpleDom, options);
              sawNonNull = sawNonNull || isSub !== null;
              if (isSub) {
                continue OUTER;
              }
            }
            if (sawNonNull) {
              return false;
            }
          }
        return true;
      };
      var simpleSubset = (sub, dom, options) => {
        if (sub === dom) {
          return true;
        }
        if (sub.length === 1 && sub[0].semver === ANY) {
          if (dom.length === 1 && dom[0].semver === ANY) {
            return true;
          } else if (options.includePrerelease) {
            sub = [new Comparator(">=0.0.0-0")];
          } else {
            sub = [new Comparator(">=0.0.0")];
          }
        }
        if (dom.length === 1 && dom[0].semver === ANY) {
          if (options.includePrerelease) {
            return true;
          } else {
            dom = [new Comparator(">=0.0.0")];
          }
        }
        const eqSet = /* @__PURE__ */ new Set();
        let gt, lt;
        for (const c of sub) {
          if (c.operator === ">" || c.operator === ">=") {
            gt = higherGT(gt, c, options);
          } else if (c.operator === "<" || c.operator === "<=") {
            lt = lowerLT(lt, c, options);
          } else {
            eqSet.add(c.semver);
          }
        }
        if (eqSet.size > 1) {
          return null;
        }
        let gtltComp;
        if (gt && lt) {
          gtltComp = compare(gt.semver, lt.semver, options);
          if (gtltComp > 0) {
            return null;
          } else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<=")) {
            return null;
          }
        }
        for (const eq of eqSet) {
          if (gt && !satisfies(eq, String(gt), options)) {
            return null;
          }
          if (lt && !satisfies(eq, String(lt), options)) {
            return null;
          }
          for (const c of dom) {
            if (!satisfies(eq, String(c), options)) {
              return false;
            }
          }
          return true;
        }
        let higher, lower;
        let hasDomLT, hasDomGT;
        let needDomLTPre = lt && !options.includePrerelease && lt.semver.prerelease.length ? lt.semver : false;
        let needDomGTPre = gt && !options.includePrerelease && gt.semver.prerelease.length ? gt.semver : false;
        if (needDomLTPre && needDomLTPre.prerelease.length === 1 && lt.operator === "<" && needDomLTPre.prerelease[0] === 0) {
          needDomLTPre = false;
        }
        for (const c of dom) {
          hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">=";
          hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<=";
          if (gt) {
            if (needDomGTPre) {
              if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomGTPre.major && c.semver.minor === needDomGTPre.minor && c.semver.patch === needDomGTPre.patch) {
                needDomGTPre = false;
              }
            }
            if (c.operator === ">" || c.operator === ">=") {
              higher = higherGT(gt, c, options);
              if (higher === c && higher !== gt) {
                return false;
              }
            } else if (gt.operator === ">=" && !satisfies(gt.semver, String(c), options)) {
              return false;
            }
          }
          if (lt) {
            if (needDomLTPre) {
              if (c.semver.prerelease && c.semver.prerelease.length && c.semver.major === needDomLTPre.major && c.semver.minor === needDomLTPre.minor && c.semver.patch === needDomLTPre.patch) {
                needDomLTPre = false;
              }
            }
            if (c.operator === "<" || c.operator === "<=") {
              lower = lowerLT(lt, c, options);
              if (lower === c && lower !== lt) {
                return false;
              }
            } else if (lt.operator === "<=" && !satisfies(lt.semver, String(c), options)) {
              return false;
            }
          }
          if (!c.operator && (lt || gt) && gtltComp !== 0) {
            return false;
          }
        }
        if (gt && hasDomLT && !lt && gtltComp !== 0) {
          return false;
        }
        if (lt && hasDomGT && !gt && gtltComp !== 0) {
          return false;
        }
        if (needDomGTPre || needDomLTPre) {
          return false;
        }
        return true;
      };
      var higherGT = (a, b, options) => {
        if (!a) {
          return b;
        }
        const comp = compare(a.semver, b.semver, options);
        return comp > 0 ? a : comp < 0 ? b : b.operator === ">" && a.operator === ">=" ? b : a;
      };
      var lowerLT = (a, b, options) => {
        if (!a) {
          return b;
        }
        const comp = compare(a.semver, b.semver, options);
        return comp < 0 ? a : comp > 0 ? b : b.operator === "<" && a.operator === "<=" ? b : a;
      };
      module.exports = subset;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/index.js
  var require_semver2 = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/index.js"(exports, module) {
      var internalRe = require_re();
      var constants = require_constants();
      var SemVer = require_semver();
      var identifiers = require_identifiers();
      var parse = require_parse();
      var valid = require_valid();
      var clean = require_clean();
      var inc = require_inc();
      var diff = require_diff();
      var major = require_major();
      var minor = require_minor();
      var patch = require_patch();
      var prerelease = require_prerelease();
      var compare = require_compare();
      var rcompare = require_rcompare();
      var compareLoose = require_compare_loose();
      var compareBuild = require_compare_build();
      var sort = require_sort();
      var rsort = require_rsort();
      var gt = require_gt();
      var lt = require_lt();
      var eq = require_eq();
      var neq = require_neq();
      var gte = require_gte();
      var lte = require_lte();
      var cmp = require_cmp();
      var coerce = require_coerce();
      var Comparator = require_comparator();
      var Range = require_range();
      var satisfies = require_satisfies();
      var toComparators = require_to_comparators();
      var maxSatisfying = require_max_satisfying();
      var minSatisfying = require_min_satisfying();
      var minVersion = require_min_version();
      var validRange = require_valid2();
      var outside = require_outside();
      var gtr = require_gtr();
      var ltr = require_ltr();
      var intersects = require_intersects();
      var simplifyRange = require_simplify();
      var subset = require_subset();
      module.exports = {
        parse,
        valid,
        clean,
        inc,
        diff,
        major,
        minor,
        patch,
        prerelease,
        compare,
        rcompare,
        compareLoose,
        compareBuild,
        sort,
        rsort,
        gt,
        lt,
        eq,
        neq,
        gte,
        lte,
        cmp,
        coerce,
        Comparator,
        Range,
        satisfies,
        toComparators,
        maxSatisfying,
        minSatisfying,
        minVersion,
        validRange,
        outside,
        gtr,
        ltr,
        intersects,
        simplifyRange,
        subset,
        SemVer,
        re: internalRe.re,
        src: internalRe.src,
        tokens: internalRe.t,
        SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
        compareIdentifiers: identifiers.compareIdentifiers,
        rcompareIdentifiers: identifiers.rcompareIdentifiers
      };
    }
  });

  // src/cli.ts
  var import_chalk3 = __toESM(require_source());
  var import_cli_table = __toESM(require_lib());

  // src/lib/colorizeUserVersion.ts
  var import_chalk = __toESM(require_source());
  var colorizeUserVersion = (params) => {
    const { version, isGt, isOk } = params;
    if (isGt) {
      return (0, import_chalk.cyan)(version);
    }
    if (isOk) {
      return (0, import_chalk.green)(version);
    }
    return (0, import_chalk.red)(version);
  };

  // src/lib/compareSystemVersions.ts
  var import_semver = __toESM(require_semver2());

  // src/lib/getBuiltinVersions.ts
  function getBuiltinVersions() {
    return {
      FORC: "0.46.1",
      FUEL_CORE: "0.20.8",
      FUELS: "0.69.1"
    };
  }

  // src/lib/compareSystemVersions.ts
  function compareSystemVersions(params) {
    const { systemForcVersion, systemFuelCoreVersion } = params;
    const versions = getBuiltinVersions();
    const systemForcIsGt = import_semver.default.gt(systemForcVersion, versions.FORC);
    const systemFuelCoreIsGt = import_semver.default.gt(systemFuelCoreVersion, versions.FUEL_CORE);
    const systemForcIsEq = import_semver.default.eq(systemForcVersion, versions.FORC);
    const systemFuelCoreIsEq = import_semver.default.eq(systemFuelCoreVersion, versions.FUEL_CORE);
    return {
      systemForcIsGt,
      systemFuelCoreIsGt,
      systemForcIsEq,
      systemFuelCoreIsEq
    };
  }

  // src/lib/fuelUpLink.ts
  var fuelUpLink = "https://github.com/fuellabs/fuelup";

  // src/lib/getSystemVersions.ts
  var import_chalk2 = __toESM(require_source());
  var import_child_process = __require("child_process");
  var stdio = "ignore";
  function getSystemForc() {
    let systemForcVersion = null;
    let error = null;
    try {
      const reg = /[^0-9.]+/g;
      systemForcVersion = (0, import_child_process.execSync)("forc --version", { stdio }).toString().replace(reg, "");
    } catch (err) {
      error = err;
    }
    return {
      error,
      systemForcVersion
    };
  }
  function getSystemFuelCore() {
    let systemFuelCoreVersion = null;
    let error = null;
    try {
      const reg = /[^0-9.]+/g;
      systemFuelCoreVersion = (0, import_child_process.execSync)("fuel-core --version", { stdio }).toString().replace(reg, "");
    } catch (err) {
      error = err;
    }
    return {
      error,
      systemFuelCoreVersion
    };
  }
  function getSystemVersions() {
    const { error } = console;
    const { error: errorForc, systemForcVersion } = getSystemForc();
    const { error: errorCore, systemFuelCoreVersion } = getSystemFuelCore();
    const err = errorForc ?? errorCore;
    if (err) {
      error("Make sure you have Forc and Fuel-Core installed.");
      error(`  ${(0, import_chalk2.green)(fuelUpLink)}`);
      throw err;
    }
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      systemForcVersion,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      systemFuelCoreVersion
    };
  }

  // src/cli.ts
  function runVersions() {
    const { error, info } = console;
    const supportedVersions = getBuiltinVersions();
    const cliTable = new import_cli_table.default({
      head: ["", (0, import_chalk3.bold)("Supported"), (0, import_chalk3.bold)(`Yours / System`)]
    });
    const { systemForcVersion, systemFuelCoreVersion } = getSystemVersions();
    const comparisons = compareSystemVersions({
      systemForcVersion,
      systemFuelCoreVersion
    });
    const userForcColorized = colorizeUserVersion({
      version: systemForcVersion,
      isGt: comparisons.systemForcIsGt,
      isOk: comparisons.systemForcIsEq
    });
    const userFuelCoreColorized = colorizeUserVersion({
      version: systemFuelCoreVersion,
      isGt: comparisons.systemFuelCoreIsGt,
      isOk: comparisons.systemFuelCoreIsEq
    });
    cliTable.push(["Forc", supportedVersions.FORC, userForcColorized]);
    cliTable.push(["Fuel-Core", supportedVersions.FUEL_CORE, userFuelCoreColorized]);
    const someIsGt = comparisons.systemForcIsGt || comparisons.systemFuelCoreIsGt;
    const bothAreExact = comparisons.systemForcIsEq && comparisons.systemFuelCoreIsEq;
    if (someIsGt) {
      info(`Your system's components are newer than the ones supported!`);
      info(cliTable.toString());
      process.exit(0);
    } else if (bothAreExact) {
      info(`You have all the right versions! \u26A1`);
      info(cliTable.toString());
      process.exit(0);
    } else {
      error(`You're using outdated versions \u2014 update them with:`);
      error(`  ${(0, import_chalk3.green)(fuelUpLink)}`);
      error(cliTable.toString());
      process.exit(1);
    }
  }

  // src/bin.ts
  runVersions();
})();
//# sourceMappingURL=bin.global.js.map