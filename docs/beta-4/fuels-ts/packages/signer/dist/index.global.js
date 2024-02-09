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

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/constants.js
  var require_constants = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/constants.js"(exports, module2) {
      var SEMVER_SPEC_VERSION = "2.0.0";
      var MAX_LENGTH = 256;
      var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
      9007199254740991;
      var MAX_SAFE_COMPONENT_LENGTH = 16;
      module2.exports = {
        SEMVER_SPEC_VERSION,
        MAX_LENGTH,
        MAX_SAFE_INTEGER,
        MAX_SAFE_COMPONENT_LENGTH
      };
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/debug.js
  var require_debug = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/debug.js"(exports, module2) {
      var debug = typeof process === "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args) => console.error("SEMVER", ...args) : () => {
      };
      module2.exports = debug;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/re.js
  var require_re = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/re.js"(exports, module2) {
      var { MAX_SAFE_COMPONENT_LENGTH } = require_constants();
      var debug = require_debug();
      exports = module2.exports = {};
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
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/parse-options.js"(exports, module2) {
      var opts = ["includePrerelease", "loose", "rtl"];
      var parseOptions = (options) => !options ? {} : typeof options !== "object" ? { loose: true } : opts.filter((k) => options[k]).reduce((o, k) => {
        o[k] = true;
        return o;
      }, {});
      module2.exports = parseOptions;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/identifiers.js
  var require_identifiers = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/internal/identifiers.js"(exports, module2) {
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
      module2.exports = {
        compareIdentifiers,
        rcompareIdentifiers
      };
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/semver.js
  var require_semver = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/semver.js"(exports, module2) {
      var debug = require_debug();
      var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants();
      var { re, t } = require_re();
      var parseOptions = require_parse_options();
      var { compareIdentifiers } = require_identifiers();
      var SemVer = class {
        constructor(version2, options) {
          options = parseOptions(options);
          if (version2 instanceof SemVer) {
            if (version2.loose === !!options.loose && version2.includePrerelease === !!options.includePrerelease) {
              return version2;
            } else {
              version2 = version2.version;
            }
          } else if (typeof version2 !== "string") {
            throw new TypeError(`Invalid Version: ${version2}`);
          }
          if (version2.length > MAX_LENGTH) {
            throw new TypeError(
              `version is longer than ${MAX_LENGTH} characters`
            );
          }
          debug("SemVer", version2, options);
          this.options = options;
          this.loose = !!options.loose;
          this.includePrerelease = !!options.includePrerelease;
          const m = version2.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL]);
          if (!m) {
            throw new TypeError(`Invalid Version: ${version2}`);
          }
          this.raw = version2;
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
      module2.exports = SemVer;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/parse.js
  var require_parse = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/parse.js"(exports, module2) {
      var { MAX_LENGTH } = require_constants();
      var { re, t } = require_re();
      var SemVer = require_semver();
      var parseOptions = require_parse_options();
      var parse = (version2, options) => {
        options = parseOptions(options);
        if (version2 instanceof SemVer) {
          return version2;
        }
        if (typeof version2 !== "string") {
          return null;
        }
        if (version2.length > MAX_LENGTH) {
          return null;
        }
        const r = options.loose ? re[t.LOOSE] : re[t.FULL];
        if (!r.test(version2)) {
          return null;
        }
        try {
          return new SemVer(version2, options);
        } catch (er) {
          return null;
        }
      };
      module2.exports = parse;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/valid.js
  var require_valid = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/valid.js"(exports, module2) {
      var parse = require_parse();
      var valid = (version2, options) => {
        const v = parse(version2, options);
        return v ? v.version : null;
      };
      module2.exports = valid;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/clean.js
  var require_clean = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/clean.js"(exports, module2) {
      var parse = require_parse();
      var clean = (version2, options) => {
        const s = parse(version2.trim().replace(/^[=v]+/, ""), options);
        return s ? s.version : null;
      };
      module2.exports = clean;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/inc.js
  var require_inc = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/inc.js"(exports, module2) {
      var SemVer = require_semver();
      var inc = (version2, release, options, identifier) => {
        if (typeof options === "string") {
          identifier = options;
          options = void 0;
        }
        try {
          return new SemVer(
            version2 instanceof SemVer ? version2.version : version2,
            options
          ).inc(release, identifier).version;
        } catch (er) {
          return null;
        }
      };
      module2.exports = inc;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare.js
  var require_compare = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare.js"(exports, module2) {
      var SemVer = require_semver();
      var compare = (a, b, loose) => new SemVer(a, loose).compare(new SemVer(b, loose));
      module2.exports = compare;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/eq.js
  var require_eq = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/eq.js"(exports, module2) {
      var compare = require_compare();
      var eq = (a, b, loose) => compare(a, b, loose) === 0;
      module2.exports = eq;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/diff.js
  var require_diff = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/diff.js"(exports, module2) {
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
      module2.exports = diff;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/major.js
  var require_major = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/major.js"(exports, module2) {
      var SemVer = require_semver();
      var major = (a, loose) => new SemVer(a, loose).major;
      module2.exports = major;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/minor.js
  var require_minor = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/minor.js"(exports, module2) {
      var SemVer = require_semver();
      var minor = (a, loose) => new SemVer(a, loose).minor;
      module2.exports = minor;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/patch.js
  var require_patch = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/patch.js"(exports, module2) {
      var SemVer = require_semver();
      var patch = (a, loose) => new SemVer(a, loose).patch;
      module2.exports = patch;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/prerelease.js
  var require_prerelease = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/prerelease.js"(exports, module2) {
      var parse = require_parse();
      var prerelease = (version2, options) => {
        const parsed = parse(version2, options);
        return parsed && parsed.prerelease.length ? parsed.prerelease : null;
      };
      module2.exports = prerelease;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/rcompare.js
  var require_rcompare = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/rcompare.js"(exports, module2) {
      var compare = require_compare();
      var rcompare = (a, b, loose) => compare(b, a, loose);
      module2.exports = rcompare;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare-loose.js
  var require_compare_loose = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare-loose.js"(exports, module2) {
      var compare = require_compare();
      var compareLoose = (a, b) => compare(a, b, true);
      module2.exports = compareLoose;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare-build.js
  var require_compare_build = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/compare-build.js"(exports, module2) {
      var SemVer = require_semver();
      var compareBuild = (a, b, loose) => {
        const versionA = new SemVer(a, loose);
        const versionB = new SemVer(b, loose);
        return versionA.compare(versionB) || versionA.compareBuild(versionB);
      };
      module2.exports = compareBuild;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/sort.js
  var require_sort = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/sort.js"(exports, module2) {
      var compareBuild = require_compare_build();
      var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose));
      module2.exports = sort;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/rsort.js
  var require_rsort = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/rsort.js"(exports, module2) {
      var compareBuild = require_compare_build();
      var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
      module2.exports = rsort;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/gt.js
  var require_gt = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/gt.js"(exports, module2) {
      var compare = require_compare();
      var gt = (a, b, loose) => compare(a, b, loose) > 0;
      module2.exports = gt;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/lt.js
  var require_lt = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/lt.js"(exports, module2) {
      var compare = require_compare();
      var lt = (a, b, loose) => compare(a, b, loose) < 0;
      module2.exports = lt;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/neq.js
  var require_neq = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/neq.js"(exports, module2) {
      var compare = require_compare();
      var neq = (a, b, loose) => compare(a, b, loose) !== 0;
      module2.exports = neq;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/gte.js
  var require_gte = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/gte.js"(exports, module2) {
      var compare = require_compare();
      var gte = (a, b, loose) => compare(a, b, loose) >= 0;
      module2.exports = gte;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/lte.js
  var require_lte = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/lte.js"(exports, module2) {
      var compare = require_compare();
      var lte = (a, b, loose) => compare(a, b, loose) <= 0;
      module2.exports = lte;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/cmp.js
  var require_cmp = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/cmp.js"(exports, module2) {
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
      module2.exports = cmp;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/coerce.js
  var require_coerce = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/coerce.js"(exports, module2) {
      var SemVer = require_semver();
      var parse = require_parse();
      var { re, t } = require_re();
      var coerce = (version2, options) => {
        if (version2 instanceof SemVer) {
          return version2;
        }
        if (typeof version2 === "number") {
          version2 = String(version2);
        }
        if (typeof version2 !== "string") {
          return null;
        }
        options = options || {};
        let match = null;
        if (!options.rtl) {
          match = version2.match(re[t.COERCE]);
        } else {
          let next;
          while ((next = re[t.COERCERTL].exec(version2)) && (!match || match.index + match[0].length !== version2.length)) {
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
      module2.exports = coerce;
    }
  });

  // ../../node_modules/.pnpm/yallist@4.0.0/node_modules/yallist/iterator.js
  var require_iterator = __commonJS({
    "../../node_modules/.pnpm/yallist@4.0.0/node_modules/yallist/iterator.js"(exports, module2) {
      "use strict";
      module2.exports = function(Yallist) {
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
    "../../node_modules/.pnpm/yallist@4.0.0/node_modules/yallist/yallist.js"(exports, module2) {
      "use strict";
      module2.exports = Yallist;
      Yallist.Node = Node;
      Yallist.create = Yallist;
      function Yallist(list) {
        var self2 = this;
        if (!(self2 instanceof Yallist)) {
          self2 = new Yallist();
        }
        self2.tail = null;
        self2.head = null;
        self2.length = 0;
        if (list && typeof list.forEach === "function") {
          list.forEach(function(item) {
            self2.push(item);
          });
        } else if (arguments.length > 0) {
          for (var i = 0, l = arguments.length; i < l; i++) {
            self2.push(arguments[i]);
          }
        }
        return self2;
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
      function insert(self2, node, value) {
        var inserted = node === self2.head ? new Node(value, null, node, self2) : new Node(value, node, node.next, self2);
        if (inserted.next === null) {
          self2.tail = inserted;
        }
        if (inserted.prev === null) {
          self2.head = inserted;
        }
        self2.length++;
        return inserted;
      }
      function push(self2, item) {
        self2.tail = new Node(item, self2.tail, null, self2);
        if (!self2.head) {
          self2.head = self2.tail;
        }
        self2.length++;
      }
      function unshift(self2, item) {
        self2.head = new Node(item, null, self2.head, self2);
        if (!self2.tail) {
          self2.tail = self2.head;
        }
        self2.length++;
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
    "../../node_modules/.pnpm/lru-cache@6.0.0/node_modules/lru-cache/index.js"(exports, module2) {
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
      var get = (self2, key, doUse) => {
        const node = self2[CACHE].get(key);
        if (node) {
          const hit = node.value;
          if (isStale(self2, hit)) {
            del(self2, node);
            if (!self2[ALLOW_STALE])
              return void 0;
          } else {
            if (doUse) {
              if (self2[UPDATE_AGE_ON_GET])
                node.value.now = Date.now();
              self2[LRU_LIST].unshiftNode(node);
            }
          }
          return hit.value;
        }
      };
      var isStale = (self2, hit) => {
        if (!hit || !hit.maxAge && !self2[MAX_AGE])
          return false;
        const diff = Date.now() - hit.now;
        return hit.maxAge ? diff > hit.maxAge : self2[MAX_AGE] && diff > self2[MAX_AGE];
      };
      var trim = (self2) => {
        if (self2[LENGTH] > self2[MAX]) {
          for (let walker = self2[LRU_LIST].tail; self2[LENGTH] > self2[MAX] && walker !== null; ) {
            const prev = walker.prev;
            del(self2, walker);
            walker = prev;
          }
        }
      };
      var del = (self2, node) => {
        if (node) {
          const hit = node.value;
          if (self2[DISPOSE])
            self2[DISPOSE](hit.key, hit.value);
          self2[LENGTH] -= hit.length;
          self2[CACHE].delete(hit.key);
          self2[LRU_LIST].removeNode(node);
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
      var forEachStep = (self2, fn, node, thisp) => {
        let hit = node.value;
        if (isStale(self2, hit)) {
          del(self2, node);
          if (!self2[ALLOW_STALE])
            hit = void 0;
        }
        if (hit)
          fn.call(thisp, hit.value, hit.key, self2);
      };
      module2.exports = LRUCache;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/range.js
  var require_range = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/range.js"(exports, module2) {
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
        test(version2) {
          if (!version2) {
            return false;
          }
          if (typeof version2 === "string") {
            try {
              version2 = new SemVer(version2, this.options);
            } catch (er) {
              return false;
            }
          }
          for (let i = 0; i < this.set.length; i++) {
            if (testSet(this.set[i], version2, this.options)) {
              return true;
            }
          }
          return false;
        }
      };
      module2.exports = Range;
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
      var testSet = (set, version2, options) => {
        for (let i = 0; i < set.length; i++) {
          if (!set[i].test(version2)) {
            return false;
          }
        }
        if (version2.prerelease.length && !options.includePrerelease) {
          for (let i = 0; i < set.length; i++) {
            debug(set[i].semver);
            if (set[i].semver === Comparator.ANY) {
              continue;
            }
            if (set[i].semver.prerelease.length > 0) {
              const allowed = set[i].semver;
              if (allowed.major === version2.major && allowed.minor === version2.minor && allowed.patch === version2.patch) {
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
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/classes/comparator.js"(exports, module2) {
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
        test(version2) {
          debug("Comparator.test", version2, this.options.loose);
          if (this.semver === ANY || version2 === ANY) {
            return true;
          }
          if (typeof version2 === "string") {
            try {
              version2 = new SemVer(version2, this.options);
            } catch (er) {
              return false;
            }
          }
          return cmp(version2, this.operator, this.semver, this.options);
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
      module2.exports = Comparator;
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
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/functions/satisfies.js"(exports, module2) {
      var Range = require_range();
      var satisfies = (version2, range, options) => {
        try {
          range = new Range(range, options);
        } catch (er) {
          return false;
        }
        return range.test(version2);
      };
      module2.exports = satisfies;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/to-comparators.js
  var require_to_comparators = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/to-comparators.js"(exports, module2) {
      var Range = require_range();
      var toComparators = (range, options) => new Range(range, options).set.map((comp) => comp.map((c) => c.value).join(" ").trim().split(" "));
      module2.exports = toComparators;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/max-satisfying.js
  var require_max_satisfying = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/max-satisfying.js"(exports, module2) {
      var SemVer = require_semver();
      var Range = require_range();
      var maxSatisfying = (versions2, range, options) => {
        let max = null;
        let maxSV = null;
        let rangeObj = null;
        try {
          rangeObj = new Range(range, options);
        } catch (er) {
          return null;
        }
        versions2.forEach((v) => {
          if (rangeObj.test(v)) {
            if (!max || maxSV.compare(v) === -1) {
              max = v;
              maxSV = new SemVer(max, options);
            }
          }
        });
        return max;
      };
      module2.exports = maxSatisfying;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/min-satisfying.js
  var require_min_satisfying = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/min-satisfying.js"(exports, module2) {
      var SemVer = require_semver();
      var Range = require_range();
      var minSatisfying = (versions2, range, options) => {
        let min = null;
        let minSV = null;
        let rangeObj = null;
        try {
          rangeObj = new Range(range, options);
        } catch (er) {
          return null;
        }
        versions2.forEach((v) => {
          if (rangeObj.test(v)) {
            if (!min || minSV.compare(v) === 1) {
              min = v;
              minSV = new SemVer(min, options);
            }
          }
        });
        return min;
      };
      module2.exports = minSatisfying;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/min-version.js
  var require_min_version = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/min-version.js"(exports, module2) {
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
      module2.exports = minVersion;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/valid.js
  var require_valid2 = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/valid.js"(exports, module2) {
      var Range = require_range();
      var validRange = (range, options) => {
        try {
          return new Range(range, options).range || "*";
        } catch (er) {
          return null;
        }
      };
      module2.exports = validRange;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/outside.js
  var require_outside = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/outside.js"(exports, module2) {
      var SemVer = require_semver();
      var Comparator = require_comparator();
      var { ANY } = Comparator;
      var Range = require_range();
      var satisfies = require_satisfies();
      var gt = require_gt();
      var lt = require_lt();
      var lte = require_lte();
      var gte = require_gte();
      var outside = (version2, range, hilo, options) => {
        version2 = new SemVer(version2, options);
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
        if (satisfies(version2, range, options)) {
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
          if ((!low.operator || low.operator === comp) && ltefn(version2, low.semver)) {
            return false;
          } else if (low.operator === ecomp && ltfn(version2, low.semver)) {
            return false;
          }
        }
        return true;
      };
      module2.exports = outside;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/gtr.js
  var require_gtr = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/gtr.js"(exports, module2) {
      var outside = require_outside();
      var gtr = (version2, range, options) => outside(version2, range, ">", options);
      module2.exports = gtr;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/ltr.js
  var require_ltr = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/ltr.js"(exports, module2) {
      var outside = require_outside();
      var ltr = (version2, range, options) => outside(version2, range, "<", options);
      module2.exports = ltr;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/intersects.js
  var require_intersects = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/intersects.js"(exports, module2) {
      var Range = require_range();
      var intersects = (r1, r2, options) => {
        r1 = new Range(r1, options);
        r2 = new Range(r2, options);
        return r1.intersects(r2);
      };
      module2.exports = intersects;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/simplify.js
  var require_simplify = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/simplify.js"(exports, module2) {
      var satisfies = require_satisfies();
      var compare = require_compare();
      module2.exports = (versions2, range, options) => {
        const set = [];
        let first = null;
        let prev = null;
        const v = versions2.sort((a, b) => compare(a, b, options));
        for (const version2 of v) {
          const included = satisfies(version2, range, options);
          if (included) {
            prev = version2;
            if (!first) {
              first = version2;
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
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/ranges/subset.js"(exports, module2) {
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
      module2.exports = subset;
    }
  });

  // ../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/index.js
  var require_semver2 = __commonJS({
    "../../node_modules/.pnpm/semver@7.3.8/node_modules/semver/index.js"(exports, module2) {
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
      module2.exports = {
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

  // ../../node_modules/.pnpm/bech32@2.0.0/node_modules/bech32/dist/index.js
  var require_dist = __commonJS({
    "../../node_modules/.pnpm/bech32@2.0.0/node_modules/bech32/dist/index.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.bech32m = exports.bech32 = void 0;
      var ALPHABET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
      var ALPHABET_MAP = {};
      for (let z = 0; z < ALPHABET.length; z++) {
        const x = ALPHABET.charAt(z);
        ALPHABET_MAP[x] = z;
      }
      function polymodStep(pre) {
        const b = pre >> 25;
        return (pre & 33554431) << 5 ^ -(b >> 0 & 1) & 996825010 ^ -(b >> 1 & 1) & 642813549 ^ -(b >> 2 & 1) & 513874426 ^ -(b >> 3 & 1) & 1027748829 ^ -(b >> 4 & 1) & 705979059;
      }
      function prefixChk(prefix) {
        let chk = 1;
        for (let i = 0; i < prefix.length; ++i) {
          const c = prefix.charCodeAt(i);
          if (c < 33 || c > 126)
            return "Invalid prefix (" + prefix + ")";
          chk = polymodStep(chk) ^ c >> 5;
        }
        chk = polymodStep(chk);
        for (let i = 0; i < prefix.length; ++i) {
          const v = prefix.charCodeAt(i);
          chk = polymodStep(chk) ^ v & 31;
        }
        return chk;
      }
      function convert(data, inBits, outBits, pad) {
        let value = 0;
        let bits = 0;
        const maxV = (1 << outBits) - 1;
        const result = [];
        for (let i = 0; i < data.length; ++i) {
          value = value << inBits | data[i];
          bits += inBits;
          while (bits >= outBits) {
            bits -= outBits;
            result.push(value >> bits & maxV);
          }
        }
        if (pad) {
          if (bits > 0) {
            result.push(value << outBits - bits & maxV);
          }
        } else {
          if (bits >= inBits)
            return "Excess padding";
          if (value << outBits - bits & maxV)
            return "Non-zero padding";
        }
        return result;
      }
      function toWords(bytes2) {
        return convert(bytes2, 8, 5, true);
      }
      function fromWordsUnsafe(words) {
        const res = convert(words, 5, 8, false);
        if (Array.isArray(res))
          return res;
      }
      function fromWords(words) {
        const res = convert(words, 5, 8, false);
        if (Array.isArray(res))
          return res;
        throw new Error(res);
      }
      function getLibraryFromEncoding(encoding) {
        let ENCODING_CONST;
        if (encoding === "bech32") {
          ENCODING_CONST = 1;
        } else {
          ENCODING_CONST = 734539939;
        }
        function encode(prefix, words, LIMIT) {
          LIMIT = LIMIT || 90;
          if (prefix.length + 7 + words.length > LIMIT)
            throw new TypeError("Exceeds length limit");
          prefix = prefix.toLowerCase();
          let chk = prefixChk(prefix);
          if (typeof chk === "string")
            throw new Error(chk);
          let result = prefix + "1";
          for (let i = 0; i < words.length; ++i) {
            const x = words[i];
            if (x >> 5 !== 0)
              throw new Error("Non 5-bit word");
            chk = polymodStep(chk) ^ x;
            result += ALPHABET.charAt(x);
          }
          for (let i = 0; i < 6; ++i) {
            chk = polymodStep(chk);
          }
          chk ^= ENCODING_CONST;
          for (let i = 0; i < 6; ++i) {
            const v = chk >> (5 - i) * 5 & 31;
            result += ALPHABET.charAt(v);
          }
          return result;
        }
        function __decode(str, LIMIT) {
          LIMIT = LIMIT || 90;
          if (str.length < 8)
            return str + " too short";
          if (str.length > LIMIT)
            return "Exceeds length limit";
          const lowered = str.toLowerCase();
          const uppered = str.toUpperCase();
          if (str !== lowered && str !== uppered)
            return "Mixed-case string " + str;
          str = lowered;
          const split2 = str.lastIndexOf("1");
          if (split2 === -1)
            return "No separator character for " + str;
          if (split2 === 0)
            return "Missing prefix for " + str;
          const prefix = str.slice(0, split2);
          const wordChars = str.slice(split2 + 1);
          if (wordChars.length < 6)
            return "Data too short";
          let chk = prefixChk(prefix);
          if (typeof chk === "string")
            return chk;
          const words = [];
          for (let i = 0; i < wordChars.length; ++i) {
            const c = wordChars.charAt(i);
            const v = ALPHABET_MAP[c];
            if (v === void 0)
              return "Unknown character " + c;
            chk = polymodStep(chk) ^ v;
            if (i + 6 >= wordChars.length)
              continue;
            words.push(v);
          }
          if (chk !== ENCODING_CONST)
            return "Invalid checksum for " + str;
          return { prefix, words };
        }
        function decodeUnsafe(str, LIMIT) {
          const res = __decode(str, LIMIT);
          if (typeof res === "object")
            return res;
        }
        function decode(str, LIMIT) {
          const res = __decode(str, LIMIT);
          if (typeof res === "object")
            return res;
          throw new Error(res);
        }
        return {
          decodeUnsafe,
          decode,
          encode,
          toWords,
          fromWordsUnsafe,
          fromWords
        };
      }
      exports.bech32 = getLibraryFromEncoding("bech32");
      exports.bech32m = getLibraryFromEncoding("bech32m");
    }
  });

  // ../../node_modules/.pnpm/bn.js@5.2.1/node_modules/bn.js/lib/bn.js
  var require_bn = __commonJS({
    "../../node_modules/.pnpm/bn.js@5.2.1/node_modules/bn.js/lib/bn.js"(exports, module2) {
      (function(module3, exports2) {
        "use strict";
        function assert3(val, msg) {
          if (!val)
            throw new Error(msg || "Assertion failed");
        }
        function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
        function BN2(number2, base, endian) {
          if (BN2.isBN(number2)) {
            return number2;
          }
          this.negative = 0;
          this.words = null;
          this.length = 0;
          this.red = null;
          if (number2 !== null) {
            if (base === "le" || base === "be") {
              endian = base;
              base = 10;
            }
            this._init(number2 || 0, base || 10, endian || "be");
          }
        }
        if (typeof module3 === "object") {
          module3.exports = BN2;
        } else {
          exports2.BN = BN2;
        }
        BN2.BN = BN2;
        BN2.wordSize = 26;
        var Buffer2;
        try {
          if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") {
            Buffer2 = window.Buffer;
          } else {
            Buffer2 = __require("buffer").Buffer;
          }
        } catch (e) {
        }
        BN2.isBN = function isBN(num) {
          if (num instanceof BN2) {
            return true;
          }
          return num !== null && typeof num === "object" && num.constructor.wordSize === BN2.wordSize && Array.isArray(num.words);
        };
        BN2.max = function max(left, right) {
          if (left.cmp(right) > 0)
            return left;
          return right;
        };
        BN2.min = function min(left, right) {
          if (left.cmp(right) < 0)
            return left;
          return right;
        };
        BN2.prototype._init = function init(number2, base, endian) {
          if (typeof number2 === "number") {
            return this._initNumber(number2, base, endian);
          }
          if (typeof number2 === "object") {
            return this._initArray(number2, base, endian);
          }
          if (base === "hex") {
            base = 16;
          }
          assert3(base === (base | 0) && base >= 2 && base <= 36);
          number2 = number2.toString().replace(/\s+/g, "");
          var start = 0;
          if (number2[0] === "-") {
            start++;
            this.negative = 1;
          }
          if (start < number2.length) {
            if (base === 16) {
              this._parseHex(number2, start, endian);
            } else {
              this._parseBase(number2, base, start);
              if (endian === "le") {
                this._initArray(this.toArray(), base, endian);
              }
            }
          }
        };
        BN2.prototype._initNumber = function _initNumber(number2, base, endian) {
          if (number2 < 0) {
            this.negative = 1;
            number2 = -number2;
          }
          if (number2 < 67108864) {
            this.words = [number2 & 67108863];
            this.length = 1;
          } else if (number2 < 4503599627370496) {
            this.words = [
              number2 & 67108863,
              number2 / 67108864 & 67108863
            ];
            this.length = 2;
          } else {
            assert3(number2 < 9007199254740992);
            this.words = [
              number2 & 67108863,
              number2 / 67108864 & 67108863,
              1
            ];
            this.length = 3;
          }
          if (endian !== "le")
            return;
          this._initArray(this.toArray(), base, endian);
        };
        BN2.prototype._initArray = function _initArray(number2, base, endian) {
          assert3(typeof number2.length === "number");
          if (number2.length <= 0) {
            this.words = [0];
            this.length = 1;
            return this;
          }
          this.length = Math.ceil(number2.length / 3);
          this.words = new Array(this.length);
          for (var i = 0; i < this.length; i++) {
            this.words[i] = 0;
          }
          var j, w;
          var off = 0;
          if (endian === "be") {
            for (i = number2.length - 1, j = 0; i >= 0; i -= 3) {
              w = number2[i] | number2[i - 1] << 8 | number2[i - 2] << 16;
              this.words[j] |= w << off & 67108863;
              this.words[j + 1] = w >>> 26 - off & 67108863;
              off += 24;
              if (off >= 26) {
                off -= 26;
                j++;
              }
            }
          } else if (endian === "le") {
            for (i = 0, j = 0; i < number2.length; i += 3) {
              w = number2[i] | number2[i + 1] << 8 | number2[i + 2] << 16;
              this.words[j] |= w << off & 67108863;
              this.words[j + 1] = w >>> 26 - off & 67108863;
              off += 24;
              if (off >= 26) {
                off -= 26;
                j++;
              }
            }
          }
          return this._strip();
        };
        function parseHex4Bits(string, index) {
          var c = string.charCodeAt(index);
          if (c >= 48 && c <= 57) {
            return c - 48;
          } else if (c >= 65 && c <= 70) {
            return c - 55;
          } else if (c >= 97 && c <= 102) {
            return c - 87;
          } else {
            assert3(false, "Invalid character in " + string);
          }
        }
        function parseHexByte(string, lowerBound, index) {
          var r = parseHex4Bits(string, index);
          if (index - 1 >= lowerBound) {
            r |= parseHex4Bits(string, index - 1) << 4;
          }
          return r;
        }
        BN2.prototype._parseHex = function _parseHex(number2, start, endian) {
          this.length = Math.ceil((number2.length - start) / 6);
          this.words = new Array(this.length);
          for (var i = 0; i < this.length; i++) {
            this.words[i] = 0;
          }
          var off = 0;
          var j = 0;
          var w;
          if (endian === "be") {
            for (i = number2.length - 1; i >= start; i -= 2) {
              w = parseHexByte(number2, start, i) << off;
              this.words[j] |= w & 67108863;
              if (off >= 18) {
                off -= 18;
                j += 1;
                this.words[j] |= w >>> 26;
              } else {
                off += 8;
              }
            }
          } else {
            var parseLength = number2.length - start;
            for (i = parseLength % 2 === 0 ? start + 1 : start; i < number2.length; i += 2) {
              w = parseHexByte(number2, start, i) << off;
              this.words[j] |= w & 67108863;
              if (off >= 18) {
                off -= 18;
                j += 1;
                this.words[j] |= w >>> 26;
              } else {
                off += 8;
              }
            }
          }
          this._strip();
        };
        function parseBase(str, start, end, mul) {
          var r = 0;
          var b = 0;
          var len = Math.min(str.length, end);
          for (var i = start; i < len; i++) {
            var c = str.charCodeAt(i) - 48;
            r *= mul;
            if (c >= 49) {
              b = c - 49 + 10;
            } else if (c >= 17) {
              b = c - 17 + 10;
            } else {
              b = c;
            }
            assert3(c >= 0 && b < mul, "Invalid character");
            r += b;
          }
          return r;
        }
        BN2.prototype._parseBase = function _parseBase(number2, base, start) {
          this.words = [0];
          this.length = 1;
          for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base) {
            limbLen++;
          }
          limbLen--;
          limbPow = limbPow / base | 0;
          var total = number2.length - start;
          var mod = total % limbLen;
          var end = Math.min(total, total - mod) + start;
          var word = 0;
          for (var i = start; i < end; i += limbLen) {
            word = parseBase(number2, i, i + limbLen, base);
            this.imuln(limbPow);
            if (this.words[0] + word < 67108864) {
              this.words[0] += word;
            } else {
              this._iaddn(word);
            }
          }
          if (mod !== 0) {
            var pow = 1;
            word = parseBase(number2, i, number2.length, base);
            for (i = 0; i < mod; i++) {
              pow *= base;
            }
            this.imuln(pow);
            if (this.words[0] + word < 67108864) {
              this.words[0] += word;
            } else {
              this._iaddn(word);
            }
          }
          this._strip();
        };
        BN2.prototype.copy = function copy(dest) {
          dest.words = new Array(this.length);
          for (var i = 0; i < this.length; i++) {
            dest.words[i] = this.words[i];
          }
          dest.length = this.length;
          dest.negative = this.negative;
          dest.red = this.red;
        };
        function move(dest, src) {
          dest.words = src.words;
          dest.length = src.length;
          dest.negative = src.negative;
          dest.red = src.red;
        }
        BN2.prototype._move = function _move(dest) {
          move(dest, this);
        };
        BN2.prototype.clone = function clone() {
          var r = new BN2(null);
          this.copy(r);
          return r;
        };
        BN2.prototype._expand = function _expand(size) {
          while (this.length < size) {
            this.words[this.length++] = 0;
          }
          return this;
        };
        BN2.prototype._strip = function strip() {
          while (this.length > 1 && this.words[this.length - 1] === 0) {
            this.length--;
          }
          return this._normSign();
        };
        BN2.prototype._normSign = function _normSign() {
          if (this.length === 1 && this.words[0] === 0) {
            this.negative = 0;
          }
          return this;
        };
        if (typeof Symbol !== "undefined" && typeof Symbol.for === "function") {
          try {
            BN2.prototype[Symbol.for("nodejs.util.inspect.custom")] = inspect;
          } catch (e) {
            BN2.prototype.inspect = inspect;
          }
        } else {
          BN2.prototype.inspect = inspect;
        }
        function inspect() {
          return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
        }
        var zeros = [
          "",
          "0",
          "00",
          "000",
          "0000",
          "00000",
          "000000",
          "0000000",
          "00000000",
          "000000000",
          "0000000000",
          "00000000000",
          "000000000000",
          "0000000000000",
          "00000000000000",
          "000000000000000",
          "0000000000000000",
          "00000000000000000",
          "000000000000000000",
          "0000000000000000000",
          "00000000000000000000",
          "000000000000000000000",
          "0000000000000000000000",
          "00000000000000000000000",
          "000000000000000000000000",
          "0000000000000000000000000"
        ];
        var groupSizes = [
          0,
          0,
          25,
          16,
          12,
          11,
          10,
          9,
          8,
          8,
          7,
          7,
          7,
          7,
          6,
          6,
          6,
          6,
          6,
          6,
          6,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5
        ];
        var groupBases = [
          0,
          0,
          33554432,
          43046721,
          16777216,
          48828125,
          60466176,
          40353607,
          16777216,
          43046721,
          1e7,
          19487171,
          35831808,
          62748517,
          7529536,
          11390625,
          16777216,
          24137569,
          34012224,
          47045881,
          64e6,
          4084101,
          5153632,
          6436343,
          7962624,
          9765625,
          11881376,
          14348907,
          17210368,
          20511149,
          243e5,
          28629151,
          33554432,
          39135393,
          45435424,
          52521875,
          60466176
        ];
        BN2.prototype.toString = function toString(base, padding) {
          base = base || 10;
          padding = padding | 0 || 1;
          var out;
          if (base === 16 || base === "hex") {
            out = "";
            var off = 0;
            var carry = 0;
            for (var i = 0; i < this.length; i++) {
              var w = this.words[i];
              var word = ((w << off | carry) & 16777215).toString(16);
              carry = w >>> 24 - off & 16777215;
              off += 2;
              if (off >= 26) {
                off -= 26;
                i--;
              }
              if (carry !== 0 || i !== this.length - 1) {
                out = zeros[6 - word.length] + word + out;
              } else {
                out = word + out;
              }
            }
            if (carry !== 0) {
              out = carry.toString(16) + out;
            }
            while (out.length % padding !== 0) {
              out = "0" + out;
            }
            if (this.negative !== 0) {
              out = "-" + out;
            }
            return out;
          }
          if (base === (base | 0) && base >= 2 && base <= 36) {
            var groupSize = groupSizes[base];
            var groupBase = groupBases[base];
            out = "";
            var c = this.clone();
            c.negative = 0;
            while (!c.isZero()) {
              var r = c.modrn(groupBase).toString(base);
              c = c.idivn(groupBase);
              if (!c.isZero()) {
                out = zeros[groupSize - r.length] + r + out;
              } else {
                out = r + out;
              }
            }
            if (this.isZero()) {
              out = "0" + out;
            }
            while (out.length % padding !== 0) {
              out = "0" + out;
            }
            if (this.negative !== 0) {
              out = "-" + out;
            }
            return out;
          }
          assert3(false, "Base should be between 2 and 36");
        };
        BN2.prototype.toNumber = function toNumber2() {
          var ret = this.words[0];
          if (this.length === 2) {
            ret += this.words[1] * 67108864;
          } else if (this.length === 3 && this.words[2] === 1) {
            ret += 4503599627370496 + this.words[1] * 67108864;
          } else if (this.length > 2) {
            assert3(false, "Number can only safely store up to 53 bits");
          }
          return this.negative !== 0 ? -ret : ret;
        };
        BN2.prototype.toJSON = function toJSON() {
          return this.toString(16, 2);
        };
        if (Buffer2) {
          BN2.prototype.toBuffer = function toBuffer(endian, length) {
            return this.toArrayLike(Buffer2, endian, length);
          };
        }
        BN2.prototype.toArray = function toArray(endian, length) {
          return this.toArrayLike(Array, endian, length);
        };
        var allocate = function allocate2(ArrayType, size) {
          if (ArrayType.allocUnsafe) {
            return ArrayType.allocUnsafe(size);
          }
          return new ArrayType(size);
        };
        BN2.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
          this._strip();
          var byteLength = this.byteLength();
          var reqLength = length || Math.max(1, byteLength);
          assert3(byteLength <= reqLength, "byte array longer than desired length");
          assert3(reqLength > 0, "Requested array length <= 0");
          var res = allocate(ArrayType, reqLength);
          var postfix = endian === "le" ? "LE" : "BE";
          this["_toArrayLike" + postfix](res, byteLength);
          return res;
        };
        BN2.prototype._toArrayLikeLE = function _toArrayLikeLE(res, byteLength) {
          var position = 0;
          var carry = 0;
          for (var i = 0, shift = 0; i < this.length; i++) {
            var word = this.words[i] << shift | carry;
            res[position++] = word & 255;
            if (position < res.length) {
              res[position++] = word >> 8 & 255;
            }
            if (position < res.length) {
              res[position++] = word >> 16 & 255;
            }
            if (shift === 6) {
              if (position < res.length) {
                res[position++] = word >> 24 & 255;
              }
              carry = 0;
              shift = 0;
            } else {
              carry = word >>> 24;
              shift += 2;
            }
          }
          if (position < res.length) {
            res[position++] = carry;
            while (position < res.length) {
              res[position++] = 0;
            }
          }
        };
        BN2.prototype._toArrayLikeBE = function _toArrayLikeBE(res, byteLength) {
          var position = res.length - 1;
          var carry = 0;
          for (var i = 0, shift = 0; i < this.length; i++) {
            var word = this.words[i] << shift | carry;
            res[position--] = word & 255;
            if (position >= 0) {
              res[position--] = word >> 8 & 255;
            }
            if (position >= 0) {
              res[position--] = word >> 16 & 255;
            }
            if (shift === 6) {
              if (position >= 0) {
                res[position--] = word >> 24 & 255;
              }
              carry = 0;
              shift = 0;
            } else {
              carry = word >>> 24;
              shift += 2;
            }
          }
          if (position >= 0) {
            res[position--] = carry;
            while (position >= 0) {
              res[position--] = 0;
            }
          }
        };
        if (Math.clz32) {
          BN2.prototype._countBits = function _countBits(w) {
            return 32 - Math.clz32(w);
          };
        } else {
          BN2.prototype._countBits = function _countBits(w) {
            var t = w;
            var r = 0;
            if (t >= 4096) {
              r += 13;
              t >>>= 13;
            }
            if (t >= 64) {
              r += 7;
              t >>>= 7;
            }
            if (t >= 8) {
              r += 4;
              t >>>= 4;
            }
            if (t >= 2) {
              r += 2;
              t >>>= 2;
            }
            return r + t;
          };
        }
        BN2.prototype._zeroBits = function _zeroBits(w) {
          if (w === 0)
            return 26;
          var t = w;
          var r = 0;
          if ((t & 8191) === 0) {
            r += 13;
            t >>>= 13;
          }
          if ((t & 127) === 0) {
            r += 7;
            t >>>= 7;
          }
          if ((t & 15) === 0) {
            r += 4;
            t >>>= 4;
          }
          if ((t & 3) === 0) {
            r += 2;
            t >>>= 2;
          }
          if ((t & 1) === 0) {
            r++;
          }
          return r;
        };
        BN2.prototype.bitLength = function bitLength() {
          var w = this.words[this.length - 1];
          var hi = this._countBits(w);
          return (this.length - 1) * 26 + hi;
        };
        function toBitArray(num) {
          var w = new Array(num.bitLength());
          for (var bit = 0; bit < w.length; bit++) {
            var off = bit / 26 | 0;
            var wbit = bit % 26;
            w[bit] = num.words[off] >>> wbit & 1;
          }
          return w;
        }
        BN2.prototype.zeroBits = function zeroBits() {
          if (this.isZero())
            return 0;
          var r = 0;
          for (var i = 0; i < this.length; i++) {
            var b = this._zeroBits(this.words[i]);
            r += b;
            if (b !== 26)
              break;
          }
          return r;
        };
        BN2.prototype.byteLength = function byteLength() {
          return Math.ceil(this.bitLength() / 8);
        };
        BN2.prototype.toTwos = function toTwos2(width) {
          if (this.negative !== 0) {
            return this.abs().inotn(width).iaddn(1);
          }
          return this.clone();
        };
        BN2.prototype.fromTwos = function fromTwos2(width) {
          if (this.testn(width - 1)) {
            return this.notn(width).iaddn(1).ineg();
          }
          return this.clone();
        };
        BN2.prototype.isNeg = function isNeg() {
          return this.negative !== 0;
        };
        BN2.prototype.neg = function neg() {
          return this.clone().ineg();
        };
        BN2.prototype.ineg = function ineg() {
          if (!this.isZero()) {
            this.negative ^= 1;
          }
          return this;
        };
        BN2.prototype.iuor = function iuor(num) {
          while (this.length < num.length) {
            this.words[this.length++] = 0;
          }
          for (var i = 0; i < num.length; i++) {
            this.words[i] = this.words[i] | num.words[i];
          }
          return this._strip();
        };
        BN2.prototype.ior = function ior(num) {
          assert3((this.negative | num.negative) === 0);
          return this.iuor(num);
        };
        BN2.prototype.or = function or(num) {
          if (this.length > num.length)
            return this.clone().ior(num);
          return num.clone().ior(this);
        };
        BN2.prototype.uor = function uor(num) {
          if (this.length > num.length)
            return this.clone().iuor(num);
          return num.clone().iuor(this);
        };
        BN2.prototype.iuand = function iuand(num) {
          var b;
          if (this.length > num.length) {
            b = num;
          } else {
            b = this;
          }
          for (var i = 0; i < b.length; i++) {
            this.words[i] = this.words[i] & num.words[i];
          }
          this.length = b.length;
          return this._strip();
        };
        BN2.prototype.iand = function iand(num) {
          assert3((this.negative | num.negative) === 0);
          return this.iuand(num);
        };
        BN2.prototype.and = function and(num) {
          if (this.length > num.length)
            return this.clone().iand(num);
          return num.clone().iand(this);
        };
        BN2.prototype.uand = function uand(num) {
          if (this.length > num.length)
            return this.clone().iuand(num);
          return num.clone().iuand(this);
        };
        BN2.prototype.iuxor = function iuxor(num) {
          var a;
          var b;
          if (this.length > num.length) {
            a = this;
            b = num;
          } else {
            a = num;
            b = this;
          }
          for (var i = 0; i < b.length; i++) {
            this.words[i] = a.words[i] ^ b.words[i];
          }
          if (this !== a) {
            for (; i < a.length; i++) {
              this.words[i] = a.words[i];
            }
          }
          this.length = a.length;
          return this._strip();
        };
        BN2.prototype.ixor = function ixor(num) {
          assert3((this.negative | num.negative) === 0);
          return this.iuxor(num);
        };
        BN2.prototype.xor = function xor(num) {
          if (this.length > num.length)
            return this.clone().ixor(num);
          return num.clone().ixor(this);
        };
        BN2.prototype.uxor = function uxor(num) {
          if (this.length > num.length)
            return this.clone().iuxor(num);
          return num.clone().iuxor(this);
        };
        BN2.prototype.inotn = function inotn(width) {
          assert3(typeof width === "number" && width >= 0);
          var bytesNeeded = Math.ceil(width / 26) | 0;
          var bitsLeft = width % 26;
          this._expand(bytesNeeded);
          if (bitsLeft > 0) {
            bytesNeeded--;
          }
          for (var i = 0; i < bytesNeeded; i++) {
            this.words[i] = ~this.words[i] & 67108863;
          }
          if (bitsLeft > 0) {
            this.words[i] = ~this.words[i] & 67108863 >> 26 - bitsLeft;
          }
          return this._strip();
        };
        BN2.prototype.notn = function notn(width) {
          return this.clone().inotn(width);
        };
        BN2.prototype.setn = function setn(bit, val) {
          assert3(typeof bit === "number" && bit >= 0);
          var off = bit / 26 | 0;
          var wbit = bit % 26;
          this._expand(off + 1);
          if (val) {
            this.words[off] = this.words[off] | 1 << wbit;
          } else {
            this.words[off] = this.words[off] & ~(1 << wbit);
          }
          return this._strip();
        };
        BN2.prototype.iadd = function iadd(num) {
          var r;
          if (this.negative !== 0 && num.negative === 0) {
            this.negative = 0;
            r = this.isub(num);
            this.negative ^= 1;
            return this._normSign();
          } else if (this.negative === 0 && num.negative !== 0) {
            num.negative = 0;
            r = this.isub(num);
            num.negative = 1;
            return r._normSign();
          }
          var a, b;
          if (this.length > num.length) {
            a = this;
            b = num;
          } else {
            a = num;
            b = this;
          }
          var carry = 0;
          for (var i = 0; i < b.length; i++) {
            r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
            this.words[i] = r & 67108863;
            carry = r >>> 26;
          }
          for (; carry !== 0 && i < a.length; i++) {
            r = (a.words[i] | 0) + carry;
            this.words[i] = r & 67108863;
            carry = r >>> 26;
          }
          this.length = a.length;
          if (carry !== 0) {
            this.words[this.length] = carry;
            this.length++;
          } else if (a !== this) {
            for (; i < a.length; i++) {
              this.words[i] = a.words[i];
            }
          }
          return this;
        };
        BN2.prototype.add = function add2(num) {
          var res;
          if (num.negative !== 0 && this.negative === 0) {
            num.negative = 0;
            res = this.sub(num);
            num.negative ^= 1;
            return res;
          } else if (num.negative === 0 && this.negative !== 0) {
            this.negative = 0;
            res = num.sub(this);
            this.negative = 1;
            return res;
          }
          if (this.length > num.length)
            return this.clone().iadd(num);
          return num.clone().iadd(this);
        };
        BN2.prototype.isub = function isub(num) {
          if (num.negative !== 0) {
            num.negative = 0;
            var r = this.iadd(num);
            num.negative = 1;
            return r._normSign();
          } else if (this.negative !== 0) {
            this.negative = 0;
            this.iadd(num);
            this.negative = 1;
            return this._normSign();
          }
          var cmp = this.cmp(num);
          if (cmp === 0) {
            this.negative = 0;
            this.length = 1;
            this.words[0] = 0;
            return this;
          }
          var a, b;
          if (cmp > 0) {
            a = this;
            b = num;
          } else {
            a = num;
            b = this;
          }
          var carry = 0;
          for (var i = 0; i < b.length; i++) {
            r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
            carry = r >> 26;
            this.words[i] = r & 67108863;
          }
          for (; carry !== 0 && i < a.length; i++) {
            r = (a.words[i] | 0) + carry;
            carry = r >> 26;
            this.words[i] = r & 67108863;
          }
          if (carry === 0 && i < a.length && a !== this) {
            for (; i < a.length; i++) {
              this.words[i] = a.words[i];
            }
          }
          this.length = Math.max(this.length, i);
          if (a !== this) {
            this.negative = 1;
          }
          return this._strip();
        };
        BN2.prototype.sub = function sub(num) {
          return this.clone().isub(num);
        };
        function smallMulTo(self2, num, out) {
          out.negative = num.negative ^ self2.negative;
          var len = self2.length + num.length | 0;
          out.length = len;
          len = len - 1 | 0;
          var a = self2.words[0] | 0;
          var b = num.words[0] | 0;
          var r = a * b;
          var lo = r & 67108863;
          var carry = r / 67108864 | 0;
          out.words[0] = lo;
          for (var k = 1; k < len; k++) {
            var ncarry = carry >>> 26;
            var rword = carry & 67108863;
            var maxJ = Math.min(k, num.length - 1);
            for (var j = Math.max(0, k - self2.length + 1); j <= maxJ; j++) {
              var i = k - j | 0;
              a = self2.words[i] | 0;
              b = num.words[j] | 0;
              r = a * b + rword;
              ncarry += r / 67108864 | 0;
              rword = r & 67108863;
            }
            out.words[k] = rword | 0;
            carry = ncarry | 0;
          }
          if (carry !== 0) {
            out.words[k] = carry | 0;
          } else {
            out.length--;
          }
          return out._strip();
        }
        var comb10MulTo = function comb10MulTo2(self2, num, out) {
          var a = self2.words;
          var b = num.words;
          var o = out.words;
          var c = 0;
          var lo;
          var mid;
          var hi;
          var a0 = a[0] | 0;
          var al0 = a0 & 8191;
          var ah0 = a0 >>> 13;
          var a1 = a[1] | 0;
          var al1 = a1 & 8191;
          var ah1 = a1 >>> 13;
          var a2 = a[2] | 0;
          var al2 = a2 & 8191;
          var ah2 = a2 >>> 13;
          var a3 = a[3] | 0;
          var al3 = a3 & 8191;
          var ah3 = a3 >>> 13;
          var a4 = a[4] | 0;
          var al4 = a4 & 8191;
          var ah4 = a4 >>> 13;
          var a5 = a[5] | 0;
          var al5 = a5 & 8191;
          var ah5 = a5 >>> 13;
          var a6 = a[6] | 0;
          var al6 = a6 & 8191;
          var ah6 = a6 >>> 13;
          var a7 = a[7] | 0;
          var al7 = a7 & 8191;
          var ah7 = a7 >>> 13;
          var a8 = a[8] | 0;
          var al8 = a8 & 8191;
          var ah8 = a8 >>> 13;
          var a9 = a[9] | 0;
          var al9 = a9 & 8191;
          var ah9 = a9 >>> 13;
          var b0 = b[0] | 0;
          var bl0 = b0 & 8191;
          var bh0 = b0 >>> 13;
          var b1 = b[1] | 0;
          var bl1 = b1 & 8191;
          var bh1 = b1 >>> 13;
          var b2 = b[2] | 0;
          var bl2 = b2 & 8191;
          var bh2 = b2 >>> 13;
          var b3 = b[3] | 0;
          var bl3 = b3 & 8191;
          var bh3 = b3 >>> 13;
          var b4 = b[4] | 0;
          var bl4 = b4 & 8191;
          var bh4 = b4 >>> 13;
          var b5 = b[5] | 0;
          var bl5 = b5 & 8191;
          var bh5 = b5 >>> 13;
          var b6 = b[6] | 0;
          var bl6 = b6 & 8191;
          var bh6 = b6 >>> 13;
          var b7 = b[7] | 0;
          var bl7 = b7 & 8191;
          var bh7 = b7 >>> 13;
          var b8 = b[8] | 0;
          var bl8 = b8 & 8191;
          var bh8 = b8 >>> 13;
          var b9 = b[9] | 0;
          var bl9 = b9 & 8191;
          var bh9 = b9 >>> 13;
          out.negative = self2.negative ^ num.negative;
          out.length = 19;
          lo = Math.imul(al0, bl0);
          mid = Math.imul(al0, bh0);
          mid = mid + Math.imul(ah0, bl0) | 0;
          hi = Math.imul(ah0, bh0);
          var w0 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
          w0 &= 67108863;
          lo = Math.imul(al1, bl0);
          mid = Math.imul(al1, bh0);
          mid = mid + Math.imul(ah1, bl0) | 0;
          hi = Math.imul(ah1, bh0);
          lo = lo + Math.imul(al0, bl1) | 0;
          mid = mid + Math.imul(al0, bh1) | 0;
          mid = mid + Math.imul(ah0, bl1) | 0;
          hi = hi + Math.imul(ah0, bh1) | 0;
          var w1 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
          w1 &= 67108863;
          lo = Math.imul(al2, bl0);
          mid = Math.imul(al2, bh0);
          mid = mid + Math.imul(ah2, bl0) | 0;
          hi = Math.imul(ah2, bh0);
          lo = lo + Math.imul(al1, bl1) | 0;
          mid = mid + Math.imul(al1, bh1) | 0;
          mid = mid + Math.imul(ah1, bl1) | 0;
          hi = hi + Math.imul(ah1, bh1) | 0;
          lo = lo + Math.imul(al0, bl2) | 0;
          mid = mid + Math.imul(al0, bh2) | 0;
          mid = mid + Math.imul(ah0, bl2) | 0;
          hi = hi + Math.imul(ah0, bh2) | 0;
          var w2 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
          w2 &= 67108863;
          lo = Math.imul(al3, bl0);
          mid = Math.imul(al3, bh0);
          mid = mid + Math.imul(ah3, bl0) | 0;
          hi = Math.imul(ah3, bh0);
          lo = lo + Math.imul(al2, bl1) | 0;
          mid = mid + Math.imul(al2, bh1) | 0;
          mid = mid + Math.imul(ah2, bl1) | 0;
          hi = hi + Math.imul(ah2, bh1) | 0;
          lo = lo + Math.imul(al1, bl2) | 0;
          mid = mid + Math.imul(al1, bh2) | 0;
          mid = mid + Math.imul(ah1, bl2) | 0;
          hi = hi + Math.imul(ah1, bh2) | 0;
          lo = lo + Math.imul(al0, bl3) | 0;
          mid = mid + Math.imul(al0, bh3) | 0;
          mid = mid + Math.imul(ah0, bl3) | 0;
          hi = hi + Math.imul(ah0, bh3) | 0;
          var w3 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
          w3 &= 67108863;
          lo = Math.imul(al4, bl0);
          mid = Math.imul(al4, bh0);
          mid = mid + Math.imul(ah4, bl0) | 0;
          hi = Math.imul(ah4, bh0);
          lo = lo + Math.imul(al3, bl1) | 0;
          mid = mid + Math.imul(al3, bh1) | 0;
          mid = mid + Math.imul(ah3, bl1) | 0;
          hi = hi + Math.imul(ah3, bh1) | 0;
          lo = lo + Math.imul(al2, bl2) | 0;
          mid = mid + Math.imul(al2, bh2) | 0;
          mid = mid + Math.imul(ah2, bl2) | 0;
          hi = hi + Math.imul(ah2, bh2) | 0;
          lo = lo + Math.imul(al1, bl3) | 0;
          mid = mid + Math.imul(al1, bh3) | 0;
          mid = mid + Math.imul(ah1, bl3) | 0;
          hi = hi + Math.imul(ah1, bh3) | 0;
          lo = lo + Math.imul(al0, bl4) | 0;
          mid = mid + Math.imul(al0, bh4) | 0;
          mid = mid + Math.imul(ah0, bl4) | 0;
          hi = hi + Math.imul(ah0, bh4) | 0;
          var w4 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
          w4 &= 67108863;
          lo = Math.imul(al5, bl0);
          mid = Math.imul(al5, bh0);
          mid = mid + Math.imul(ah5, bl0) | 0;
          hi = Math.imul(ah5, bh0);
          lo = lo + Math.imul(al4, bl1) | 0;
          mid = mid + Math.imul(al4, bh1) | 0;
          mid = mid + Math.imul(ah4, bl1) | 0;
          hi = hi + Math.imul(ah4, bh1) | 0;
          lo = lo + Math.imul(al3, bl2) | 0;
          mid = mid + Math.imul(al3, bh2) | 0;
          mid = mid + Math.imul(ah3, bl2) | 0;
          hi = hi + Math.imul(ah3, bh2) | 0;
          lo = lo + Math.imul(al2, bl3) | 0;
          mid = mid + Math.imul(al2, bh3) | 0;
          mid = mid + Math.imul(ah2, bl3) | 0;
          hi = hi + Math.imul(ah2, bh3) | 0;
          lo = lo + Math.imul(al1, bl4) | 0;
          mid = mid + Math.imul(al1, bh4) | 0;
          mid = mid + Math.imul(ah1, bl4) | 0;
          hi = hi + Math.imul(ah1, bh4) | 0;
          lo = lo + Math.imul(al0, bl5) | 0;
          mid = mid + Math.imul(al0, bh5) | 0;
          mid = mid + Math.imul(ah0, bl5) | 0;
          hi = hi + Math.imul(ah0, bh5) | 0;
          var w5 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
          w5 &= 67108863;
          lo = Math.imul(al6, bl0);
          mid = Math.imul(al6, bh0);
          mid = mid + Math.imul(ah6, bl0) | 0;
          hi = Math.imul(ah6, bh0);
          lo = lo + Math.imul(al5, bl1) | 0;
          mid = mid + Math.imul(al5, bh1) | 0;
          mid = mid + Math.imul(ah5, bl1) | 0;
          hi = hi + Math.imul(ah5, bh1) | 0;
          lo = lo + Math.imul(al4, bl2) | 0;
          mid = mid + Math.imul(al4, bh2) | 0;
          mid = mid + Math.imul(ah4, bl2) | 0;
          hi = hi + Math.imul(ah4, bh2) | 0;
          lo = lo + Math.imul(al3, bl3) | 0;
          mid = mid + Math.imul(al3, bh3) | 0;
          mid = mid + Math.imul(ah3, bl3) | 0;
          hi = hi + Math.imul(ah3, bh3) | 0;
          lo = lo + Math.imul(al2, bl4) | 0;
          mid = mid + Math.imul(al2, bh4) | 0;
          mid = mid + Math.imul(ah2, bl4) | 0;
          hi = hi + Math.imul(ah2, bh4) | 0;
          lo = lo + Math.imul(al1, bl5) | 0;
          mid = mid + Math.imul(al1, bh5) | 0;
          mid = mid + Math.imul(ah1, bl5) | 0;
          hi = hi + Math.imul(ah1, bh5) | 0;
          lo = lo + Math.imul(al0, bl6) | 0;
          mid = mid + Math.imul(al0, bh6) | 0;
          mid = mid + Math.imul(ah0, bl6) | 0;
          hi = hi + Math.imul(ah0, bh6) | 0;
          var w6 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
          w6 &= 67108863;
          lo = Math.imul(al7, bl0);
          mid = Math.imul(al7, bh0);
          mid = mid + Math.imul(ah7, bl0) | 0;
          hi = Math.imul(ah7, bh0);
          lo = lo + Math.imul(al6, bl1) | 0;
          mid = mid + Math.imul(al6, bh1) | 0;
          mid = mid + Math.imul(ah6, bl1) | 0;
          hi = hi + Math.imul(ah6, bh1) | 0;
          lo = lo + Math.imul(al5, bl2) | 0;
          mid = mid + Math.imul(al5, bh2) | 0;
          mid = mid + Math.imul(ah5, bl2) | 0;
          hi = hi + Math.imul(ah5, bh2) | 0;
          lo = lo + Math.imul(al4, bl3) | 0;
          mid = mid + Math.imul(al4, bh3) | 0;
          mid = mid + Math.imul(ah4, bl3) | 0;
          hi = hi + Math.imul(ah4, bh3) | 0;
          lo = lo + Math.imul(al3, bl4) | 0;
          mid = mid + Math.imul(al3, bh4) | 0;
          mid = mid + Math.imul(ah3, bl4) | 0;
          hi = hi + Math.imul(ah3, bh4) | 0;
          lo = lo + Math.imul(al2, bl5) | 0;
          mid = mid + Math.imul(al2, bh5) | 0;
          mid = mid + Math.imul(ah2, bl5) | 0;
          hi = hi + Math.imul(ah2, bh5) | 0;
          lo = lo + Math.imul(al1, bl6) | 0;
          mid = mid + Math.imul(al1, bh6) | 0;
          mid = mid + Math.imul(ah1, bl6) | 0;
          hi = hi + Math.imul(ah1, bh6) | 0;
          lo = lo + Math.imul(al0, bl7) | 0;
          mid = mid + Math.imul(al0, bh7) | 0;
          mid = mid + Math.imul(ah0, bl7) | 0;
          hi = hi + Math.imul(ah0, bh7) | 0;
          var w7 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
          w7 &= 67108863;
          lo = Math.imul(al8, bl0);
          mid = Math.imul(al8, bh0);
          mid = mid + Math.imul(ah8, bl0) | 0;
          hi = Math.imul(ah8, bh0);
          lo = lo + Math.imul(al7, bl1) | 0;
          mid = mid + Math.imul(al7, bh1) | 0;
          mid = mid + Math.imul(ah7, bl1) | 0;
          hi = hi + Math.imul(ah7, bh1) | 0;
          lo = lo + Math.imul(al6, bl2) | 0;
          mid = mid + Math.imul(al6, bh2) | 0;
          mid = mid + Math.imul(ah6, bl2) | 0;
          hi = hi + Math.imul(ah6, bh2) | 0;
          lo = lo + Math.imul(al5, bl3) | 0;
          mid = mid + Math.imul(al5, bh3) | 0;
          mid = mid + Math.imul(ah5, bl3) | 0;
          hi = hi + Math.imul(ah5, bh3) | 0;
          lo = lo + Math.imul(al4, bl4) | 0;
          mid = mid + Math.imul(al4, bh4) | 0;
          mid = mid + Math.imul(ah4, bl4) | 0;
          hi = hi + Math.imul(ah4, bh4) | 0;
          lo = lo + Math.imul(al3, bl5) | 0;
          mid = mid + Math.imul(al3, bh5) | 0;
          mid = mid + Math.imul(ah3, bl5) | 0;
          hi = hi + Math.imul(ah3, bh5) | 0;
          lo = lo + Math.imul(al2, bl6) | 0;
          mid = mid + Math.imul(al2, bh6) | 0;
          mid = mid + Math.imul(ah2, bl6) | 0;
          hi = hi + Math.imul(ah2, bh6) | 0;
          lo = lo + Math.imul(al1, bl7) | 0;
          mid = mid + Math.imul(al1, bh7) | 0;
          mid = mid + Math.imul(ah1, bl7) | 0;
          hi = hi + Math.imul(ah1, bh7) | 0;
          lo = lo + Math.imul(al0, bl8) | 0;
          mid = mid + Math.imul(al0, bh8) | 0;
          mid = mid + Math.imul(ah0, bl8) | 0;
          hi = hi + Math.imul(ah0, bh8) | 0;
          var w8 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
          w8 &= 67108863;
          lo = Math.imul(al9, bl0);
          mid = Math.imul(al9, bh0);
          mid = mid + Math.imul(ah9, bl0) | 0;
          hi = Math.imul(ah9, bh0);
          lo = lo + Math.imul(al8, bl1) | 0;
          mid = mid + Math.imul(al8, bh1) | 0;
          mid = mid + Math.imul(ah8, bl1) | 0;
          hi = hi + Math.imul(ah8, bh1) | 0;
          lo = lo + Math.imul(al7, bl2) | 0;
          mid = mid + Math.imul(al7, bh2) | 0;
          mid = mid + Math.imul(ah7, bl2) | 0;
          hi = hi + Math.imul(ah7, bh2) | 0;
          lo = lo + Math.imul(al6, bl3) | 0;
          mid = mid + Math.imul(al6, bh3) | 0;
          mid = mid + Math.imul(ah6, bl3) | 0;
          hi = hi + Math.imul(ah6, bh3) | 0;
          lo = lo + Math.imul(al5, bl4) | 0;
          mid = mid + Math.imul(al5, bh4) | 0;
          mid = mid + Math.imul(ah5, bl4) | 0;
          hi = hi + Math.imul(ah5, bh4) | 0;
          lo = lo + Math.imul(al4, bl5) | 0;
          mid = mid + Math.imul(al4, bh5) | 0;
          mid = mid + Math.imul(ah4, bl5) | 0;
          hi = hi + Math.imul(ah4, bh5) | 0;
          lo = lo + Math.imul(al3, bl6) | 0;
          mid = mid + Math.imul(al3, bh6) | 0;
          mid = mid + Math.imul(ah3, bl6) | 0;
          hi = hi + Math.imul(ah3, bh6) | 0;
          lo = lo + Math.imul(al2, bl7) | 0;
          mid = mid + Math.imul(al2, bh7) | 0;
          mid = mid + Math.imul(ah2, bl7) | 0;
          hi = hi + Math.imul(ah2, bh7) | 0;
          lo = lo + Math.imul(al1, bl8) | 0;
          mid = mid + Math.imul(al1, bh8) | 0;
          mid = mid + Math.imul(ah1, bl8) | 0;
          hi = hi + Math.imul(ah1, bh8) | 0;
          lo = lo + Math.imul(al0, bl9) | 0;
          mid = mid + Math.imul(al0, bh9) | 0;
          mid = mid + Math.imul(ah0, bl9) | 0;
          hi = hi + Math.imul(ah0, bh9) | 0;
          var w9 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
          w9 &= 67108863;
          lo = Math.imul(al9, bl1);
          mid = Math.imul(al9, bh1);
          mid = mid + Math.imul(ah9, bl1) | 0;
          hi = Math.imul(ah9, bh1);
          lo = lo + Math.imul(al8, bl2) | 0;
          mid = mid + Math.imul(al8, bh2) | 0;
          mid = mid + Math.imul(ah8, bl2) | 0;
          hi = hi + Math.imul(ah8, bh2) | 0;
          lo = lo + Math.imul(al7, bl3) | 0;
          mid = mid + Math.imul(al7, bh3) | 0;
          mid = mid + Math.imul(ah7, bl3) | 0;
          hi = hi + Math.imul(ah7, bh3) | 0;
          lo = lo + Math.imul(al6, bl4) | 0;
          mid = mid + Math.imul(al6, bh4) | 0;
          mid = mid + Math.imul(ah6, bl4) | 0;
          hi = hi + Math.imul(ah6, bh4) | 0;
          lo = lo + Math.imul(al5, bl5) | 0;
          mid = mid + Math.imul(al5, bh5) | 0;
          mid = mid + Math.imul(ah5, bl5) | 0;
          hi = hi + Math.imul(ah5, bh5) | 0;
          lo = lo + Math.imul(al4, bl6) | 0;
          mid = mid + Math.imul(al4, bh6) | 0;
          mid = mid + Math.imul(ah4, bl6) | 0;
          hi = hi + Math.imul(ah4, bh6) | 0;
          lo = lo + Math.imul(al3, bl7) | 0;
          mid = mid + Math.imul(al3, bh7) | 0;
          mid = mid + Math.imul(ah3, bl7) | 0;
          hi = hi + Math.imul(ah3, bh7) | 0;
          lo = lo + Math.imul(al2, bl8) | 0;
          mid = mid + Math.imul(al2, bh8) | 0;
          mid = mid + Math.imul(ah2, bl8) | 0;
          hi = hi + Math.imul(ah2, bh8) | 0;
          lo = lo + Math.imul(al1, bl9) | 0;
          mid = mid + Math.imul(al1, bh9) | 0;
          mid = mid + Math.imul(ah1, bl9) | 0;
          hi = hi + Math.imul(ah1, bh9) | 0;
          var w10 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
          w10 &= 67108863;
          lo = Math.imul(al9, bl2);
          mid = Math.imul(al9, bh2);
          mid = mid + Math.imul(ah9, bl2) | 0;
          hi = Math.imul(ah9, bh2);
          lo = lo + Math.imul(al8, bl3) | 0;
          mid = mid + Math.imul(al8, bh3) | 0;
          mid = mid + Math.imul(ah8, bl3) | 0;
          hi = hi + Math.imul(ah8, bh3) | 0;
          lo = lo + Math.imul(al7, bl4) | 0;
          mid = mid + Math.imul(al7, bh4) | 0;
          mid = mid + Math.imul(ah7, bl4) | 0;
          hi = hi + Math.imul(ah7, bh4) | 0;
          lo = lo + Math.imul(al6, bl5) | 0;
          mid = mid + Math.imul(al6, bh5) | 0;
          mid = mid + Math.imul(ah6, bl5) | 0;
          hi = hi + Math.imul(ah6, bh5) | 0;
          lo = lo + Math.imul(al5, bl6) | 0;
          mid = mid + Math.imul(al5, bh6) | 0;
          mid = mid + Math.imul(ah5, bl6) | 0;
          hi = hi + Math.imul(ah5, bh6) | 0;
          lo = lo + Math.imul(al4, bl7) | 0;
          mid = mid + Math.imul(al4, bh7) | 0;
          mid = mid + Math.imul(ah4, bl7) | 0;
          hi = hi + Math.imul(ah4, bh7) | 0;
          lo = lo + Math.imul(al3, bl8) | 0;
          mid = mid + Math.imul(al3, bh8) | 0;
          mid = mid + Math.imul(ah3, bl8) | 0;
          hi = hi + Math.imul(ah3, bh8) | 0;
          lo = lo + Math.imul(al2, bl9) | 0;
          mid = mid + Math.imul(al2, bh9) | 0;
          mid = mid + Math.imul(ah2, bl9) | 0;
          hi = hi + Math.imul(ah2, bh9) | 0;
          var w11 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
          w11 &= 67108863;
          lo = Math.imul(al9, bl3);
          mid = Math.imul(al9, bh3);
          mid = mid + Math.imul(ah9, bl3) | 0;
          hi = Math.imul(ah9, bh3);
          lo = lo + Math.imul(al8, bl4) | 0;
          mid = mid + Math.imul(al8, bh4) | 0;
          mid = mid + Math.imul(ah8, bl4) | 0;
          hi = hi + Math.imul(ah8, bh4) | 0;
          lo = lo + Math.imul(al7, bl5) | 0;
          mid = mid + Math.imul(al7, bh5) | 0;
          mid = mid + Math.imul(ah7, bl5) | 0;
          hi = hi + Math.imul(ah7, bh5) | 0;
          lo = lo + Math.imul(al6, bl6) | 0;
          mid = mid + Math.imul(al6, bh6) | 0;
          mid = mid + Math.imul(ah6, bl6) | 0;
          hi = hi + Math.imul(ah6, bh6) | 0;
          lo = lo + Math.imul(al5, bl7) | 0;
          mid = mid + Math.imul(al5, bh7) | 0;
          mid = mid + Math.imul(ah5, bl7) | 0;
          hi = hi + Math.imul(ah5, bh7) | 0;
          lo = lo + Math.imul(al4, bl8) | 0;
          mid = mid + Math.imul(al4, bh8) | 0;
          mid = mid + Math.imul(ah4, bl8) | 0;
          hi = hi + Math.imul(ah4, bh8) | 0;
          lo = lo + Math.imul(al3, bl9) | 0;
          mid = mid + Math.imul(al3, bh9) | 0;
          mid = mid + Math.imul(ah3, bl9) | 0;
          hi = hi + Math.imul(ah3, bh9) | 0;
          var w12 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
          w12 &= 67108863;
          lo = Math.imul(al9, bl4);
          mid = Math.imul(al9, bh4);
          mid = mid + Math.imul(ah9, bl4) | 0;
          hi = Math.imul(ah9, bh4);
          lo = lo + Math.imul(al8, bl5) | 0;
          mid = mid + Math.imul(al8, bh5) | 0;
          mid = mid + Math.imul(ah8, bl5) | 0;
          hi = hi + Math.imul(ah8, bh5) | 0;
          lo = lo + Math.imul(al7, bl6) | 0;
          mid = mid + Math.imul(al7, bh6) | 0;
          mid = mid + Math.imul(ah7, bl6) | 0;
          hi = hi + Math.imul(ah7, bh6) | 0;
          lo = lo + Math.imul(al6, bl7) | 0;
          mid = mid + Math.imul(al6, bh7) | 0;
          mid = mid + Math.imul(ah6, bl7) | 0;
          hi = hi + Math.imul(ah6, bh7) | 0;
          lo = lo + Math.imul(al5, bl8) | 0;
          mid = mid + Math.imul(al5, bh8) | 0;
          mid = mid + Math.imul(ah5, bl8) | 0;
          hi = hi + Math.imul(ah5, bh8) | 0;
          lo = lo + Math.imul(al4, bl9) | 0;
          mid = mid + Math.imul(al4, bh9) | 0;
          mid = mid + Math.imul(ah4, bl9) | 0;
          hi = hi + Math.imul(ah4, bh9) | 0;
          var w13 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
          w13 &= 67108863;
          lo = Math.imul(al9, bl5);
          mid = Math.imul(al9, bh5);
          mid = mid + Math.imul(ah9, bl5) | 0;
          hi = Math.imul(ah9, bh5);
          lo = lo + Math.imul(al8, bl6) | 0;
          mid = mid + Math.imul(al8, bh6) | 0;
          mid = mid + Math.imul(ah8, bl6) | 0;
          hi = hi + Math.imul(ah8, bh6) | 0;
          lo = lo + Math.imul(al7, bl7) | 0;
          mid = mid + Math.imul(al7, bh7) | 0;
          mid = mid + Math.imul(ah7, bl7) | 0;
          hi = hi + Math.imul(ah7, bh7) | 0;
          lo = lo + Math.imul(al6, bl8) | 0;
          mid = mid + Math.imul(al6, bh8) | 0;
          mid = mid + Math.imul(ah6, bl8) | 0;
          hi = hi + Math.imul(ah6, bh8) | 0;
          lo = lo + Math.imul(al5, bl9) | 0;
          mid = mid + Math.imul(al5, bh9) | 0;
          mid = mid + Math.imul(ah5, bl9) | 0;
          hi = hi + Math.imul(ah5, bh9) | 0;
          var w14 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
          w14 &= 67108863;
          lo = Math.imul(al9, bl6);
          mid = Math.imul(al9, bh6);
          mid = mid + Math.imul(ah9, bl6) | 0;
          hi = Math.imul(ah9, bh6);
          lo = lo + Math.imul(al8, bl7) | 0;
          mid = mid + Math.imul(al8, bh7) | 0;
          mid = mid + Math.imul(ah8, bl7) | 0;
          hi = hi + Math.imul(ah8, bh7) | 0;
          lo = lo + Math.imul(al7, bl8) | 0;
          mid = mid + Math.imul(al7, bh8) | 0;
          mid = mid + Math.imul(ah7, bl8) | 0;
          hi = hi + Math.imul(ah7, bh8) | 0;
          lo = lo + Math.imul(al6, bl9) | 0;
          mid = mid + Math.imul(al6, bh9) | 0;
          mid = mid + Math.imul(ah6, bl9) | 0;
          hi = hi + Math.imul(ah6, bh9) | 0;
          var w15 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
          w15 &= 67108863;
          lo = Math.imul(al9, bl7);
          mid = Math.imul(al9, bh7);
          mid = mid + Math.imul(ah9, bl7) | 0;
          hi = Math.imul(ah9, bh7);
          lo = lo + Math.imul(al8, bl8) | 0;
          mid = mid + Math.imul(al8, bh8) | 0;
          mid = mid + Math.imul(ah8, bl8) | 0;
          hi = hi + Math.imul(ah8, bh8) | 0;
          lo = lo + Math.imul(al7, bl9) | 0;
          mid = mid + Math.imul(al7, bh9) | 0;
          mid = mid + Math.imul(ah7, bl9) | 0;
          hi = hi + Math.imul(ah7, bh9) | 0;
          var w16 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
          w16 &= 67108863;
          lo = Math.imul(al9, bl8);
          mid = Math.imul(al9, bh8);
          mid = mid + Math.imul(ah9, bl8) | 0;
          hi = Math.imul(ah9, bh8);
          lo = lo + Math.imul(al8, bl9) | 0;
          mid = mid + Math.imul(al8, bh9) | 0;
          mid = mid + Math.imul(ah8, bl9) | 0;
          hi = hi + Math.imul(ah8, bh9) | 0;
          var w17 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
          w17 &= 67108863;
          lo = Math.imul(al9, bl9);
          mid = Math.imul(al9, bh9);
          mid = mid + Math.imul(ah9, bl9) | 0;
          hi = Math.imul(ah9, bh9);
          var w18 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
          w18 &= 67108863;
          o[0] = w0;
          o[1] = w1;
          o[2] = w2;
          o[3] = w3;
          o[4] = w4;
          o[5] = w5;
          o[6] = w6;
          o[7] = w7;
          o[8] = w8;
          o[9] = w9;
          o[10] = w10;
          o[11] = w11;
          o[12] = w12;
          o[13] = w13;
          o[14] = w14;
          o[15] = w15;
          o[16] = w16;
          o[17] = w17;
          o[18] = w18;
          if (c !== 0) {
            o[19] = c;
            out.length++;
          }
          return out;
        };
        if (!Math.imul) {
          comb10MulTo = smallMulTo;
        }
        function bigMulTo(self2, num, out) {
          out.negative = num.negative ^ self2.negative;
          out.length = self2.length + num.length;
          var carry = 0;
          var hncarry = 0;
          for (var k = 0; k < out.length - 1; k++) {
            var ncarry = hncarry;
            hncarry = 0;
            var rword = carry & 67108863;
            var maxJ = Math.min(k, num.length - 1);
            for (var j = Math.max(0, k - self2.length + 1); j <= maxJ; j++) {
              var i = k - j;
              var a = self2.words[i] | 0;
              var b = num.words[j] | 0;
              var r = a * b;
              var lo = r & 67108863;
              ncarry = ncarry + (r / 67108864 | 0) | 0;
              lo = lo + rword | 0;
              rword = lo & 67108863;
              ncarry = ncarry + (lo >>> 26) | 0;
              hncarry += ncarry >>> 26;
              ncarry &= 67108863;
            }
            out.words[k] = rword;
            carry = ncarry;
            ncarry = hncarry;
          }
          if (carry !== 0) {
            out.words[k] = carry;
          } else {
            out.length--;
          }
          return out._strip();
        }
        function jumboMulTo(self2, num, out) {
          return bigMulTo(self2, num, out);
        }
        BN2.prototype.mulTo = function mulTo(num, out) {
          var res;
          var len = this.length + num.length;
          if (this.length === 10 && num.length === 10) {
            res = comb10MulTo(this, num, out);
          } else if (len < 63) {
            res = smallMulTo(this, num, out);
          } else if (len < 1024) {
            res = bigMulTo(this, num, out);
          } else {
            res = jumboMulTo(this, num, out);
          }
          return res;
        };
        function FFTM(x, y) {
          this.x = x;
          this.y = y;
        }
        FFTM.prototype.makeRBT = function makeRBT(N) {
          var t = new Array(N);
          var l = BN2.prototype._countBits(N) - 1;
          for (var i = 0; i < N; i++) {
            t[i] = this.revBin(i, l, N);
          }
          return t;
        };
        FFTM.prototype.revBin = function revBin(x, l, N) {
          if (x === 0 || x === N - 1)
            return x;
          var rb = 0;
          for (var i = 0; i < l; i++) {
            rb |= (x & 1) << l - i - 1;
            x >>= 1;
          }
          return rb;
        };
        FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
          for (var i = 0; i < N; i++) {
            rtws[i] = rws[rbt[i]];
            itws[i] = iws[rbt[i]];
          }
        };
        FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
          this.permute(rbt, rws, iws, rtws, itws, N);
          for (var s = 1; s < N; s <<= 1) {
            var l = s << 1;
            var rtwdf = Math.cos(2 * Math.PI / l);
            var itwdf = Math.sin(2 * Math.PI / l);
            for (var p = 0; p < N; p += l) {
              var rtwdf_ = rtwdf;
              var itwdf_ = itwdf;
              for (var j = 0; j < s; j++) {
                var re = rtws[p + j];
                var ie = itws[p + j];
                var ro = rtws[p + j + s];
                var io = itws[p + j + s];
                var rx = rtwdf_ * ro - itwdf_ * io;
                io = rtwdf_ * io + itwdf_ * ro;
                ro = rx;
                rtws[p + j] = re + ro;
                itws[p + j] = ie + io;
                rtws[p + j + s] = re - ro;
                itws[p + j + s] = ie - io;
                if (j !== l) {
                  rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                  itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                  rtwdf_ = rx;
                }
              }
            }
          }
        };
        FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
          var N = Math.max(m, n) | 1;
          var odd = N & 1;
          var i = 0;
          for (N = N / 2 | 0; N; N = N >>> 1) {
            i++;
          }
          return 1 << i + 1 + odd;
        };
        FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
          if (N <= 1)
            return;
          for (var i = 0; i < N / 2; i++) {
            var t = rws[i];
            rws[i] = rws[N - i - 1];
            rws[N - i - 1] = t;
            t = iws[i];
            iws[i] = -iws[N - i - 1];
            iws[N - i - 1] = -t;
          }
        };
        FFTM.prototype.normalize13b = function normalize13b(ws, N) {
          var carry = 0;
          for (var i = 0; i < N / 2; i++) {
            var w = Math.round(ws[2 * i + 1] / N) * 8192 + Math.round(ws[2 * i] / N) + carry;
            ws[i] = w & 67108863;
            if (w < 67108864) {
              carry = 0;
            } else {
              carry = w / 67108864 | 0;
            }
          }
          return ws;
        };
        FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
          var carry = 0;
          for (var i = 0; i < len; i++) {
            carry = carry + (ws[i] | 0);
            rws[2 * i] = carry & 8191;
            carry = carry >>> 13;
            rws[2 * i + 1] = carry & 8191;
            carry = carry >>> 13;
          }
          for (i = 2 * len; i < N; ++i) {
            rws[i] = 0;
          }
          assert3(carry === 0);
          assert3((carry & ~8191) === 0);
        };
        FFTM.prototype.stub = function stub(N) {
          var ph = new Array(N);
          for (var i = 0; i < N; i++) {
            ph[i] = 0;
          }
          return ph;
        };
        FFTM.prototype.mulp = function mulp(x, y, out) {
          var N = 2 * this.guessLen13b(x.length, y.length);
          var rbt = this.makeRBT(N);
          var _ = this.stub(N);
          var rws = new Array(N);
          var rwst = new Array(N);
          var iwst = new Array(N);
          var nrws = new Array(N);
          var nrwst = new Array(N);
          var niwst = new Array(N);
          var rmws = out.words;
          rmws.length = N;
          this.convert13b(x.words, x.length, rws, N);
          this.convert13b(y.words, y.length, nrws, N);
          this.transform(rws, _, rwst, iwst, N, rbt);
          this.transform(nrws, _, nrwst, niwst, N, rbt);
          for (var i = 0; i < N; i++) {
            var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
            iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
            rwst[i] = rx;
          }
          this.conjugate(rwst, iwst, N);
          this.transform(rwst, iwst, rmws, _, N, rbt);
          this.conjugate(rmws, _, N);
          this.normalize13b(rmws, N);
          out.negative = x.negative ^ y.negative;
          out.length = x.length + y.length;
          return out._strip();
        };
        BN2.prototype.mul = function mul(num) {
          var out = new BN2(null);
          out.words = new Array(this.length + num.length);
          return this.mulTo(num, out);
        };
        BN2.prototype.mulf = function mulf(num) {
          var out = new BN2(null);
          out.words = new Array(this.length + num.length);
          return jumboMulTo(this, num, out);
        };
        BN2.prototype.imul = function imul(num) {
          return this.clone().mulTo(num, this);
        };
        BN2.prototype.imuln = function imuln(num) {
          var isNegNum = num < 0;
          if (isNegNum)
            num = -num;
          assert3(typeof num === "number");
          assert3(num < 67108864);
          var carry = 0;
          for (var i = 0; i < this.length; i++) {
            var w = (this.words[i] | 0) * num;
            var lo = (w & 67108863) + (carry & 67108863);
            carry >>= 26;
            carry += w / 67108864 | 0;
            carry += lo >>> 26;
            this.words[i] = lo & 67108863;
          }
          if (carry !== 0) {
            this.words[i] = carry;
            this.length++;
          }
          return isNegNum ? this.ineg() : this;
        };
        BN2.prototype.muln = function muln(num) {
          return this.clone().imuln(num);
        };
        BN2.prototype.sqr = function sqr() {
          return this.mul(this);
        };
        BN2.prototype.isqr = function isqr() {
          return this.imul(this.clone());
        };
        BN2.prototype.pow = function pow(num) {
          var w = toBitArray(num);
          if (w.length === 0)
            return new BN2(1);
          var res = this;
          for (var i = 0; i < w.length; i++, res = res.sqr()) {
            if (w[i] !== 0)
              break;
          }
          if (++i < w.length) {
            for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
              if (w[i] === 0)
                continue;
              res = res.mul(q);
            }
          }
          return res;
        };
        BN2.prototype.iushln = function iushln(bits) {
          assert3(typeof bits === "number" && bits >= 0);
          var r = bits % 26;
          var s = (bits - r) / 26;
          var carryMask = 67108863 >>> 26 - r << 26 - r;
          var i;
          if (r !== 0) {
            var carry = 0;
            for (i = 0; i < this.length; i++) {
              var newCarry = this.words[i] & carryMask;
              var c = (this.words[i] | 0) - newCarry << r;
              this.words[i] = c | carry;
              carry = newCarry >>> 26 - r;
            }
            if (carry) {
              this.words[i] = carry;
              this.length++;
            }
          }
          if (s !== 0) {
            for (i = this.length - 1; i >= 0; i--) {
              this.words[i + s] = this.words[i];
            }
            for (i = 0; i < s; i++) {
              this.words[i] = 0;
            }
            this.length += s;
          }
          return this._strip();
        };
        BN2.prototype.ishln = function ishln(bits) {
          assert3(this.negative === 0);
          return this.iushln(bits);
        };
        BN2.prototype.iushrn = function iushrn(bits, hint, extended) {
          assert3(typeof bits === "number" && bits >= 0);
          var h;
          if (hint) {
            h = (hint - hint % 26) / 26;
          } else {
            h = 0;
          }
          var r = bits % 26;
          var s = Math.min((bits - r) / 26, this.length);
          var mask2 = 67108863 ^ 67108863 >>> r << r;
          var maskedWords = extended;
          h -= s;
          h = Math.max(0, h);
          if (maskedWords) {
            for (var i = 0; i < s; i++) {
              maskedWords.words[i] = this.words[i];
            }
            maskedWords.length = s;
          }
          if (s === 0) {
          } else if (this.length > s) {
            this.length -= s;
            for (i = 0; i < this.length; i++) {
              this.words[i] = this.words[i + s];
            }
          } else {
            this.words[0] = 0;
            this.length = 1;
          }
          var carry = 0;
          for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
            var word = this.words[i] | 0;
            this.words[i] = carry << 26 - r | word >>> r;
            carry = word & mask2;
          }
          if (maskedWords && carry !== 0) {
            maskedWords.words[maskedWords.length++] = carry;
          }
          if (this.length === 0) {
            this.words[0] = 0;
            this.length = 1;
          }
          return this._strip();
        };
        BN2.prototype.ishrn = function ishrn(bits, hint, extended) {
          assert3(this.negative === 0);
          return this.iushrn(bits, hint, extended);
        };
        BN2.prototype.shln = function shln(bits) {
          return this.clone().ishln(bits);
        };
        BN2.prototype.ushln = function ushln(bits) {
          return this.clone().iushln(bits);
        };
        BN2.prototype.shrn = function shrn(bits) {
          return this.clone().ishrn(bits);
        };
        BN2.prototype.ushrn = function ushrn(bits) {
          return this.clone().iushrn(bits);
        };
        BN2.prototype.testn = function testn(bit) {
          assert3(typeof bit === "number" && bit >= 0);
          var r = bit % 26;
          var s = (bit - r) / 26;
          var q = 1 << r;
          if (this.length <= s)
            return false;
          var w = this.words[s];
          return !!(w & q);
        };
        BN2.prototype.imaskn = function imaskn(bits) {
          assert3(typeof bits === "number" && bits >= 0);
          var r = bits % 26;
          var s = (bits - r) / 26;
          assert3(this.negative === 0, "imaskn works only with positive numbers");
          if (this.length <= s) {
            return this;
          }
          if (r !== 0) {
            s++;
          }
          this.length = Math.min(s, this.length);
          if (r !== 0) {
            var mask2 = 67108863 ^ 67108863 >>> r << r;
            this.words[this.length - 1] &= mask2;
          }
          return this._strip();
        };
        BN2.prototype.maskn = function maskn(bits) {
          return this.clone().imaskn(bits);
        };
        BN2.prototype.iaddn = function iaddn(num) {
          assert3(typeof num === "number");
          assert3(num < 67108864);
          if (num < 0)
            return this.isubn(-num);
          if (this.negative !== 0) {
            if (this.length === 1 && (this.words[0] | 0) <= num) {
              this.words[0] = num - (this.words[0] | 0);
              this.negative = 0;
              return this;
            }
            this.negative = 0;
            this.isubn(num);
            this.negative = 1;
            return this;
          }
          return this._iaddn(num);
        };
        BN2.prototype._iaddn = function _iaddn(num) {
          this.words[0] += num;
          for (var i = 0; i < this.length && this.words[i] >= 67108864; i++) {
            this.words[i] -= 67108864;
            if (i === this.length - 1) {
              this.words[i + 1] = 1;
            } else {
              this.words[i + 1]++;
            }
          }
          this.length = Math.max(this.length, i + 1);
          return this;
        };
        BN2.prototype.isubn = function isubn(num) {
          assert3(typeof num === "number");
          assert3(num < 67108864);
          if (num < 0)
            return this.iaddn(-num);
          if (this.negative !== 0) {
            this.negative = 0;
            this.iaddn(num);
            this.negative = 1;
            return this;
          }
          this.words[0] -= num;
          if (this.length === 1 && this.words[0] < 0) {
            this.words[0] = -this.words[0];
            this.negative = 1;
          } else {
            for (var i = 0; i < this.length && this.words[i] < 0; i++) {
              this.words[i] += 67108864;
              this.words[i + 1] -= 1;
            }
          }
          return this._strip();
        };
        BN2.prototype.addn = function addn(num) {
          return this.clone().iaddn(num);
        };
        BN2.prototype.subn = function subn(num) {
          return this.clone().isubn(num);
        };
        BN2.prototype.iabs = function iabs() {
          this.negative = 0;
          return this;
        };
        BN2.prototype.abs = function abs() {
          return this.clone().iabs();
        };
        BN2.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
          var len = num.length + shift;
          var i;
          this._expand(len);
          var w;
          var carry = 0;
          for (i = 0; i < num.length; i++) {
            w = (this.words[i + shift] | 0) + carry;
            var right = (num.words[i] | 0) * mul;
            w -= right & 67108863;
            carry = (w >> 26) - (right / 67108864 | 0);
            this.words[i + shift] = w & 67108863;
          }
          for (; i < this.length - shift; i++) {
            w = (this.words[i + shift] | 0) + carry;
            carry = w >> 26;
            this.words[i + shift] = w & 67108863;
          }
          if (carry === 0)
            return this._strip();
          assert3(carry === -1);
          carry = 0;
          for (i = 0; i < this.length; i++) {
            w = -(this.words[i] | 0) + carry;
            carry = w >> 26;
            this.words[i] = w & 67108863;
          }
          this.negative = 1;
          return this._strip();
        };
        BN2.prototype._wordDiv = function _wordDiv(num, mode) {
          var shift = this.length - num.length;
          var a = this.clone();
          var b = num;
          var bhi = b.words[b.length - 1] | 0;
          var bhiBits = this._countBits(bhi);
          shift = 26 - bhiBits;
          if (shift !== 0) {
            b = b.ushln(shift);
            a.iushln(shift);
            bhi = b.words[b.length - 1] | 0;
          }
          var m = a.length - b.length;
          var q;
          if (mode !== "mod") {
            q = new BN2(null);
            q.length = m + 1;
            q.words = new Array(q.length);
            for (var i = 0; i < q.length; i++) {
              q.words[i] = 0;
            }
          }
          var diff = a.clone()._ishlnsubmul(b, 1, m);
          if (diff.negative === 0) {
            a = diff;
            if (q) {
              q.words[m] = 1;
            }
          }
          for (var j = m - 1; j >= 0; j--) {
            var qj = (a.words[b.length + j] | 0) * 67108864 + (a.words[b.length + j - 1] | 0);
            qj = Math.min(qj / bhi | 0, 67108863);
            a._ishlnsubmul(b, qj, j);
            while (a.negative !== 0) {
              qj--;
              a.negative = 0;
              a._ishlnsubmul(b, 1, j);
              if (!a.isZero()) {
                a.negative ^= 1;
              }
            }
            if (q) {
              q.words[j] = qj;
            }
          }
          if (q) {
            q._strip();
          }
          a._strip();
          if (mode !== "div" && shift !== 0) {
            a.iushrn(shift);
          }
          return {
            div: q || null,
            mod: a
          };
        };
        BN2.prototype.divmod = function divmod(num, mode, positive) {
          assert3(!num.isZero());
          if (this.isZero()) {
            return {
              div: new BN2(0),
              mod: new BN2(0)
            };
          }
          var div, mod, res;
          if (this.negative !== 0 && num.negative === 0) {
            res = this.neg().divmod(num, mode);
            if (mode !== "mod") {
              div = res.div.neg();
            }
            if (mode !== "div") {
              mod = res.mod.neg();
              if (positive && mod.negative !== 0) {
                mod.iadd(num);
              }
            }
            return {
              div,
              mod
            };
          }
          if (this.negative === 0 && num.negative !== 0) {
            res = this.divmod(num.neg(), mode);
            if (mode !== "mod") {
              div = res.div.neg();
            }
            return {
              div,
              mod: res.mod
            };
          }
          if ((this.negative & num.negative) !== 0) {
            res = this.neg().divmod(num.neg(), mode);
            if (mode !== "div") {
              mod = res.mod.neg();
              if (positive && mod.negative !== 0) {
                mod.isub(num);
              }
            }
            return {
              div: res.div,
              mod
            };
          }
          if (num.length > this.length || this.cmp(num) < 0) {
            return {
              div: new BN2(0),
              mod: this
            };
          }
          if (num.length === 1) {
            if (mode === "div") {
              return {
                div: this.divn(num.words[0]),
                mod: null
              };
            }
            if (mode === "mod") {
              return {
                div: null,
                mod: new BN2(this.modrn(num.words[0]))
              };
            }
            return {
              div: this.divn(num.words[0]),
              mod: new BN2(this.modrn(num.words[0]))
            };
          }
          return this._wordDiv(num, mode);
        };
        BN2.prototype.div = function div(num) {
          return this.divmod(num, "div", false).div;
        };
        BN2.prototype.mod = function mod(num) {
          return this.divmod(num, "mod", false).mod;
        };
        BN2.prototype.umod = function umod(num) {
          return this.divmod(num, "mod", true).mod;
        };
        BN2.prototype.divRound = function divRound(num) {
          var dm = this.divmod(num);
          if (dm.mod.isZero())
            return dm.div;
          var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
          var half = num.ushrn(1);
          var r2 = num.andln(1);
          var cmp = mod.cmp(half);
          if (cmp < 0 || r2 === 1 && cmp === 0)
            return dm.div;
          return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
        };
        BN2.prototype.modrn = function modrn(num) {
          var isNegNum = num < 0;
          if (isNegNum)
            num = -num;
          assert3(num <= 67108863);
          var p = (1 << 26) % num;
          var acc = 0;
          for (var i = this.length - 1; i >= 0; i--) {
            acc = (p * acc + (this.words[i] | 0)) % num;
          }
          return isNegNum ? -acc : acc;
        };
        BN2.prototype.modn = function modn(num) {
          return this.modrn(num);
        };
        BN2.prototype.idivn = function idivn(num) {
          var isNegNum = num < 0;
          if (isNegNum)
            num = -num;
          assert3(num <= 67108863);
          var carry = 0;
          for (var i = this.length - 1; i >= 0; i--) {
            var w = (this.words[i] | 0) + carry * 67108864;
            this.words[i] = w / num | 0;
            carry = w % num;
          }
          this._strip();
          return isNegNum ? this.ineg() : this;
        };
        BN2.prototype.divn = function divn(num) {
          return this.clone().idivn(num);
        };
        BN2.prototype.egcd = function egcd(p) {
          assert3(p.negative === 0);
          assert3(!p.isZero());
          var x = this;
          var y = p.clone();
          if (x.negative !== 0) {
            x = x.umod(p);
          } else {
            x = x.clone();
          }
          var A = new BN2(1);
          var B = new BN2(0);
          var C = new BN2(0);
          var D = new BN2(1);
          var g = 0;
          while (x.isEven() && y.isEven()) {
            x.iushrn(1);
            y.iushrn(1);
            ++g;
          }
          var yp = y.clone();
          var xp = x.clone();
          while (!x.isZero()) {
            for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1)
              ;
            if (i > 0) {
              x.iushrn(i);
              while (i-- > 0) {
                if (A.isOdd() || B.isOdd()) {
                  A.iadd(yp);
                  B.isub(xp);
                }
                A.iushrn(1);
                B.iushrn(1);
              }
            }
            for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
              ;
            if (j > 0) {
              y.iushrn(j);
              while (j-- > 0) {
                if (C.isOdd() || D.isOdd()) {
                  C.iadd(yp);
                  D.isub(xp);
                }
                C.iushrn(1);
                D.iushrn(1);
              }
            }
            if (x.cmp(y) >= 0) {
              x.isub(y);
              A.isub(C);
              B.isub(D);
            } else {
              y.isub(x);
              C.isub(A);
              D.isub(B);
            }
          }
          return {
            a: C,
            b: D,
            gcd: y.iushln(g)
          };
        };
        BN2.prototype._invmp = function _invmp(p) {
          assert3(p.negative === 0);
          assert3(!p.isZero());
          var a = this;
          var b = p.clone();
          if (a.negative !== 0) {
            a = a.umod(p);
          } else {
            a = a.clone();
          }
          var x1 = new BN2(1);
          var x2 = new BN2(0);
          var delta = b.clone();
          while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
            for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1)
              ;
            if (i > 0) {
              a.iushrn(i);
              while (i-- > 0) {
                if (x1.isOdd()) {
                  x1.iadd(delta);
                }
                x1.iushrn(1);
              }
            }
            for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
              ;
            if (j > 0) {
              b.iushrn(j);
              while (j-- > 0) {
                if (x2.isOdd()) {
                  x2.iadd(delta);
                }
                x2.iushrn(1);
              }
            }
            if (a.cmp(b) >= 0) {
              a.isub(b);
              x1.isub(x2);
            } else {
              b.isub(a);
              x2.isub(x1);
            }
          }
          var res;
          if (a.cmpn(1) === 0) {
            res = x1;
          } else {
            res = x2;
          }
          if (res.cmpn(0) < 0) {
            res.iadd(p);
          }
          return res;
        };
        BN2.prototype.gcd = function gcd(num) {
          if (this.isZero())
            return num.abs();
          if (num.isZero())
            return this.abs();
          var a = this.clone();
          var b = num.clone();
          a.negative = 0;
          b.negative = 0;
          for (var shift = 0; a.isEven() && b.isEven(); shift++) {
            a.iushrn(1);
            b.iushrn(1);
          }
          do {
            while (a.isEven()) {
              a.iushrn(1);
            }
            while (b.isEven()) {
              b.iushrn(1);
            }
            var r = a.cmp(b);
            if (r < 0) {
              var t = a;
              a = b;
              b = t;
            } else if (r === 0 || b.cmpn(1) === 0) {
              break;
            }
            a.isub(b);
          } while (true);
          return b.iushln(shift);
        };
        BN2.prototype.invm = function invm(num) {
          return this.egcd(num).a.umod(num);
        };
        BN2.prototype.isEven = function isEven() {
          return (this.words[0] & 1) === 0;
        };
        BN2.prototype.isOdd = function isOdd() {
          return (this.words[0] & 1) === 1;
        };
        BN2.prototype.andln = function andln(num) {
          return this.words[0] & num;
        };
        BN2.prototype.bincn = function bincn(bit) {
          assert3(typeof bit === "number");
          var r = bit % 26;
          var s = (bit - r) / 26;
          var q = 1 << r;
          if (this.length <= s) {
            this._expand(s + 1);
            this.words[s] |= q;
            return this;
          }
          var carry = q;
          for (var i = s; carry !== 0 && i < this.length; i++) {
            var w = this.words[i] | 0;
            w += carry;
            carry = w >>> 26;
            w &= 67108863;
            this.words[i] = w;
          }
          if (carry !== 0) {
            this.words[i] = carry;
            this.length++;
          }
          return this;
        };
        BN2.prototype.isZero = function isZero() {
          return this.length === 1 && this.words[0] === 0;
        };
        BN2.prototype.cmpn = function cmpn(num) {
          var negative = num < 0;
          if (this.negative !== 0 && !negative)
            return -1;
          if (this.negative === 0 && negative)
            return 1;
          this._strip();
          var res;
          if (this.length > 1) {
            res = 1;
          } else {
            if (negative) {
              num = -num;
            }
            assert3(num <= 67108863, "Number is too big");
            var w = this.words[0] | 0;
            res = w === num ? 0 : w < num ? -1 : 1;
          }
          if (this.negative !== 0)
            return -res | 0;
          return res;
        };
        BN2.prototype.cmp = function cmp(num) {
          if (this.negative !== 0 && num.negative === 0)
            return -1;
          if (this.negative === 0 && num.negative !== 0)
            return 1;
          var res = this.ucmp(num);
          if (this.negative !== 0)
            return -res | 0;
          return res;
        };
        BN2.prototype.ucmp = function ucmp(num) {
          if (this.length > num.length)
            return 1;
          if (this.length < num.length)
            return -1;
          var res = 0;
          for (var i = this.length - 1; i >= 0; i--) {
            var a = this.words[i] | 0;
            var b = num.words[i] | 0;
            if (a === b)
              continue;
            if (a < b) {
              res = -1;
            } else if (a > b) {
              res = 1;
            }
            break;
          }
          return res;
        };
        BN2.prototype.gtn = function gtn(num) {
          return this.cmpn(num) === 1;
        };
        BN2.prototype.gt = function gt(num) {
          return this.cmp(num) === 1;
        };
        BN2.prototype.gten = function gten(num) {
          return this.cmpn(num) >= 0;
        };
        BN2.prototype.gte = function gte(num) {
          return this.cmp(num) >= 0;
        };
        BN2.prototype.ltn = function ltn(num) {
          return this.cmpn(num) === -1;
        };
        BN2.prototype.lt = function lt(num) {
          return this.cmp(num) === -1;
        };
        BN2.prototype.lten = function lten(num) {
          return this.cmpn(num) <= 0;
        };
        BN2.prototype.lte = function lte(num) {
          return this.cmp(num) <= 0;
        };
        BN2.prototype.eqn = function eqn(num) {
          return this.cmpn(num) === 0;
        };
        BN2.prototype.eq = function eq(num) {
          return this.cmp(num) === 0;
        };
        BN2.red = function red(num) {
          return new Red(num);
        };
        BN2.prototype.toRed = function toRed(ctx) {
          assert3(!this.red, "Already a number in reduction context");
          assert3(this.negative === 0, "red works only with positives");
          return ctx.convertTo(this)._forceRed(ctx);
        };
        BN2.prototype.fromRed = function fromRed() {
          assert3(this.red, "fromRed works only with numbers in reduction context");
          return this.red.convertFrom(this);
        };
        BN2.prototype._forceRed = function _forceRed(ctx) {
          this.red = ctx;
          return this;
        };
        BN2.prototype.forceRed = function forceRed(ctx) {
          assert3(!this.red, "Already a number in reduction context");
          return this._forceRed(ctx);
        };
        BN2.prototype.redAdd = function redAdd(num) {
          assert3(this.red, "redAdd works only with red numbers");
          return this.red.add(this, num);
        };
        BN2.prototype.redIAdd = function redIAdd(num) {
          assert3(this.red, "redIAdd works only with red numbers");
          return this.red.iadd(this, num);
        };
        BN2.prototype.redSub = function redSub(num) {
          assert3(this.red, "redSub works only with red numbers");
          return this.red.sub(this, num);
        };
        BN2.prototype.redISub = function redISub(num) {
          assert3(this.red, "redISub works only with red numbers");
          return this.red.isub(this, num);
        };
        BN2.prototype.redShl = function redShl(num) {
          assert3(this.red, "redShl works only with red numbers");
          return this.red.shl(this, num);
        };
        BN2.prototype.redMul = function redMul(num) {
          assert3(this.red, "redMul works only with red numbers");
          this.red._verify2(this, num);
          return this.red.mul(this, num);
        };
        BN2.prototype.redIMul = function redIMul(num) {
          assert3(this.red, "redMul works only with red numbers");
          this.red._verify2(this, num);
          return this.red.imul(this, num);
        };
        BN2.prototype.redSqr = function redSqr() {
          assert3(this.red, "redSqr works only with red numbers");
          this.red._verify1(this);
          return this.red.sqr(this);
        };
        BN2.prototype.redISqr = function redISqr() {
          assert3(this.red, "redISqr works only with red numbers");
          this.red._verify1(this);
          return this.red.isqr(this);
        };
        BN2.prototype.redSqrt = function redSqrt() {
          assert3(this.red, "redSqrt works only with red numbers");
          this.red._verify1(this);
          return this.red.sqrt(this);
        };
        BN2.prototype.redInvm = function redInvm() {
          assert3(this.red, "redInvm works only with red numbers");
          this.red._verify1(this);
          return this.red.invm(this);
        };
        BN2.prototype.redNeg = function redNeg() {
          assert3(this.red, "redNeg works only with red numbers");
          this.red._verify1(this);
          return this.red.neg(this);
        };
        BN2.prototype.redPow = function redPow(num) {
          assert3(this.red && !num.red, "redPow(normalNum)");
          this.red._verify1(this);
          return this.red.pow(this, num);
        };
        var primes = {
          k256: null,
          p224: null,
          p192: null,
          p25519: null
        };
        function MPrime(name, p) {
          this.name = name;
          this.p = new BN2(p, 16);
          this.n = this.p.bitLength();
          this.k = new BN2(1).iushln(this.n).isub(this.p);
          this.tmp = this._tmp();
        }
        MPrime.prototype._tmp = function _tmp() {
          var tmp = new BN2(null);
          tmp.words = new Array(Math.ceil(this.n / 13));
          return tmp;
        };
        MPrime.prototype.ireduce = function ireduce(num) {
          var r = num;
          var rlen;
          do {
            this.split(r, this.tmp);
            r = this.imulK(r);
            r = r.iadd(this.tmp);
            rlen = r.bitLength();
          } while (rlen > this.n);
          var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
          if (cmp === 0) {
            r.words[0] = 0;
            r.length = 1;
          } else if (cmp > 0) {
            r.isub(this.p);
          } else {
            if (r.strip !== void 0) {
              r.strip();
            } else {
              r._strip();
            }
          }
          return r;
        };
        MPrime.prototype.split = function split2(input, out) {
          input.iushrn(this.n, 0, out);
        };
        MPrime.prototype.imulK = function imulK(num) {
          return num.imul(this.k);
        };
        function K256() {
          MPrime.call(
            this,
            "k256",
            "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
          );
        }
        inherits(K256, MPrime);
        K256.prototype.split = function split2(input, output2) {
          var mask2 = 4194303;
          var outLen = Math.min(input.length, 9);
          for (var i = 0; i < outLen; i++) {
            output2.words[i] = input.words[i];
          }
          output2.length = outLen;
          if (input.length <= 9) {
            input.words[0] = 0;
            input.length = 1;
            return;
          }
          var prev = input.words[9];
          output2.words[output2.length++] = prev & mask2;
          for (i = 10; i < input.length; i++) {
            var next = input.words[i] | 0;
            input.words[i - 10] = (next & mask2) << 4 | prev >>> 22;
            prev = next;
          }
          prev >>>= 22;
          input.words[i - 10] = prev;
          if (prev === 0 && input.length > 10) {
            input.length -= 10;
          } else {
            input.length -= 9;
          }
        };
        K256.prototype.imulK = function imulK(num) {
          num.words[num.length] = 0;
          num.words[num.length + 1] = 0;
          num.length += 2;
          var lo = 0;
          for (var i = 0; i < num.length; i++) {
            var w = num.words[i] | 0;
            lo += w * 977;
            num.words[i] = lo & 67108863;
            lo = w * 64 + (lo / 67108864 | 0);
          }
          if (num.words[num.length - 1] === 0) {
            num.length--;
            if (num.words[num.length - 1] === 0) {
              num.length--;
            }
          }
          return num;
        };
        function P224() {
          MPrime.call(
            this,
            "p224",
            "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
          );
        }
        inherits(P224, MPrime);
        function P192() {
          MPrime.call(
            this,
            "p192",
            "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
          );
        }
        inherits(P192, MPrime);
        function P25519() {
          MPrime.call(
            this,
            "25519",
            "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
          );
        }
        inherits(P25519, MPrime);
        P25519.prototype.imulK = function imulK(num) {
          var carry = 0;
          for (var i = 0; i < num.length; i++) {
            var hi = (num.words[i] | 0) * 19 + carry;
            var lo = hi & 67108863;
            hi >>>= 26;
            num.words[i] = lo;
            carry = hi;
          }
          if (carry !== 0) {
            num.words[num.length++] = carry;
          }
          return num;
        };
        BN2._prime = function prime(name) {
          if (primes[name])
            return primes[name];
          var prime2;
          if (name === "k256") {
            prime2 = new K256();
          } else if (name === "p224") {
            prime2 = new P224();
          } else if (name === "p192") {
            prime2 = new P192();
          } else if (name === "p25519") {
            prime2 = new P25519();
          } else {
            throw new Error("Unknown prime " + name);
          }
          primes[name] = prime2;
          return prime2;
        };
        function Red(m) {
          if (typeof m === "string") {
            var prime = BN2._prime(m);
            this.m = prime.p;
            this.prime = prime;
          } else {
            assert3(m.gtn(1), "modulus must be greater than 1");
            this.m = m;
            this.prime = null;
          }
        }
        Red.prototype._verify1 = function _verify1(a) {
          assert3(a.negative === 0, "red works only with positives");
          assert3(a.red, "red works only with red numbers");
        };
        Red.prototype._verify2 = function _verify2(a, b) {
          assert3((a.negative | b.negative) === 0, "red works only with positives");
          assert3(
            a.red && a.red === b.red,
            "red works only with red numbers"
          );
        };
        Red.prototype.imod = function imod(a) {
          if (this.prime)
            return this.prime.ireduce(a)._forceRed(this);
          move(a, a.umod(this.m)._forceRed(this));
          return a;
        };
        Red.prototype.neg = function neg(a) {
          if (a.isZero()) {
            return a.clone();
          }
          return this.m.sub(a)._forceRed(this);
        };
        Red.prototype.add = function add2(a, b) {
          this._verify2(a, b);
          var res = a.add(b);
          if (res.cmp(this.m) >= 0) {
            res.isub(this.m);
          }
          return res._forceRed(this);
        };
        Red.prototype.iadd = function iadd(a, b) {
          this._verify2(a, b);
          var res = a.iadd(b);
          if (res.cmp(this.m) >= 0) {
            res.isub(this.m);
          }
          return res;
        };
        Red.prototype.sub = function sub(a, b) {
          this._verify2(a, b);
          var res = a.sub(b);
          if (res.cmpn(0) < 0) {
            res.iadd(this.m);
          }
          return res._forceRed(this);
        };
        Red.prototype.isub = function isub(a, b) {
          this._verify2(a, b);
          var res = a.isub(b);
          if (res.cmpn(0) < 0) {
            res.iadd(this.m);
          }
          return res;
        };
        Red.prototype.shl = function shl(a, num) {
          this._verify1(a);
          return this.imod(a.ushln(num));
        };
        Red.prototype.imul = function imul(a, b) {
          this._verify2(a, b);
          return this.imod(a.imul(b));
        };
        Red.prototype.mul = function mul(a, b) {
          this._verify2(a, b);
          return this.imod(a.mul(b));
        };
        Red.prototype.isqr = function isqr(a) {
          return this.imul(a, a.clone());
        };
        Red.prototype.sqr = function sqr(a) {
          return this.mul(a, a);
        };
        Red.prototype.sqrt = function sqrt(a) {
          if (a.isZero())
            return a.clone();
          var mod3 = this.m.andln(3);
          assert3(mod3 % 2 === 1);
          if (mod3 === 3) {
            var pow = this.m.add(new BN2(1)).iushrn(2);
            return this.pow(a, pow);
          }
          var q = this.m.subn(1);
          var s = 0;
          while (!q.isZero() && q.andln(1) === 0) {
            s++;
            q.iushrn(1);
          }
          assert3(!q.isZero());
          var one = new BN2(1).toRed(this);
          var nOne = one.redNeg();
          var lpow = this.m.subn(1).iushrn(1);
          var z = this.m.bitLength();
          z = new BN2(2 * z * z).toRed(this);
          while (this.pow(z, lpow).cmp(nOne) !== 0) {
            z.redIAdd(nOne);
          }
          var c = this.pow(z, q);
          var r = this.pow(a, q.addn(1).iushrn(1));
          var t = this.pow(a, q);
          var m = s;
          while (t.cmp(one) !== 0) {
            var tmp = t;
            for (var i = 0; tmp.cmp(one) !== 0; i++) {
              tmp = tmp.redSqr();
            }
            assert3(i < m);
            var b = this.pow(c, new BN2(1).iushln(m - i - 1));
            r = r.redMul(b);
            c = b.redSqr();
            t = t.redMul(c);
            m = i;
          }
          return r;
        };
        Red.prototype.invm = function invm(a) {
          var inv = a._invmp(this.m);
          if (inv.negative !== 0) {
            inv.negative = 0;
            return this.imod(inv).redNeg();
          } else {
            return this.imod(inv);
          }
        };
        Red.prototype.pow = function pow(a, num) {
          if (num.isZero())
            return new BN2(1).toRed(this);
          if (num.cmpn(1) === 0)
            return a.clone();
          var windowSize = 4;
          var wnd = new Array(1 << windowSize);
          wnd[0] = new BN2(1).toRed(this);
          wnd[1] = a;
          for (var i = 2; i < wnd.length; i++) {
            wnd[i] = this.mul(wnd[i - 1], a);
          }
          var res = wnd[0];
          var current = 0;
          var currentLen = 0;
          var start = num.bitLength() % 26;
          if (start === 0) {
            start = 26;
          }
          for (i = num.length - 1; i >= 0; i--) {
            var word = num.words[i];
            for (var j = start - 1; j >= 0; j--) {
              var bit = word >> j & 1;
              if (res !== wnd[0]) {
                res = this.sqr(res);
              }
              if (bit === 0 && current === 0) {
                currentLen = 0;
                continue;
              }
              current <<= 1;
              current |= bit;
              currentLen++;
              if (currentLen !== windowSize && (i !== 0 || j !== 0))
                continue;
              res = this.mul(res, wnd[current]);
              currentLen = 0;
              current = 0;
            }
            start = 26;
          }
          return res;
        };
        Red.prototype.convertTo = function convertTo(num) {
          var r = num.umod(this.m);
          return r === num ? r.clone() : r;
        };
        Red.prototype.convertFrom = function convertFrom(num) {
          var res = num.clone();
          res.red = null;
          return res;
        };
        BN2.mont = function mont(num) {
          return new Mont(num);
        };
        function Mont(m) {
          Red.call(this, m);
          this.shift = this.m.bitLength();
          if (this.shift % 26 !== 0) {
            this.shift += 26 - this.shift % 26;
          }
          this.r = new BN2(1).iushln(this.shift);
          this.r2 = this.imod(this.r.sqr());
          this.rinv = this.r._invmp(this.m);
          this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
          this.minv = this.minv.umod(this.r);
          this.minv = this.r.sub(this.minv);
        }
        inherits(Mont, Red);
        Mont.prototype.convertTo = function convertTo(num) {
          return this.imod(num.ushln(this.shift));
        };
        Mont.prototype.convertFrom = function convertFrom(num) {
          var r = this.imod(num.mul(this.rinv));
          r.red = null;
          return r;
        };
        Mont.prototype.imul = function imul(a, b) {
          if (a.isZero() || b.isZero()) {
            a.words[0] = 0;
            a.length = 1;
            return a;
          }
          var t = a.imul(b);
          var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
          var u = t.isub(c).iushrn(this.shift);
          var res = u;
          if (u.cmp(this.m) >= 0) {
            res = u.isub(this.m);
          } else if (u.cmpn(0) < 0) {
            res = u.iadd(this.m);
          }
          return res._forceRed(this);
        };
        Mont.prototype.mul = function mul(a, b) {
          if (a.isZero() || b.isZero())
            return new BN2(0)._forceRed(this);
          var t = a.mul(b);
          var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
          var u = t.isub(c).iushrn(this.shift);
          var res = u;
          if (u.cmp(this.m) >= 0) {
            res = u.isub(this.m);
          } else if (u.cmpn(0) < 0) {
            res = u.iadd(this.m);
          }
          return res._forceRed(this);
        };
        Mont.prototype.invm = function invm(a) {
          var res = this.imod(a._invmp(this.m).mul(this.r2));
          return res._forceRed(this);
        };
      })(typeof module2 === "undefined" || module2, exports);
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/package.json
  var require_package = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/package.json"(exports, module2) {
      module2.exports = {
        name: "elliptic",
        version: "6.5.4",
        description: "EC cryptography",
        main: "lib/elliptic.js",
        files: [
          "lib"
        ],
        scripts: {
          lint: "eslint lib test",
          "lint:fix": "npm run lint -- --fix",
          unit: "istanbul test _mocha --reporter=spec test/index.js",
          test: "npm run lint && npm run unit",
          version: "grunt dist && git add dist/"
        },
        repository: {
          type: "git",
          url: "git@github.com:indutny/elliptic"
        },
        keywords: [
          "EC",
          "Elliptic",
          "curve",
          "Cryptography"
        ],
        author: "Fedor Indutny <fedor@indutny.com>",
        license: "MIT",
        bugs: {
          url: "https://github.com/indutny/elliptic/issues"
        },
        homepage: "https://github.com/indutny/elliptic",
        devDependencies: {
          brfs: "^2.0.2",
          coveralls: "^3.1.0",
          eslint: "^7.6.0",
          grunt: "^1.2.1",
          "grunt-browserify": "^5.3.0",
          "grunt-cli": "^1.3.2",
          "grunt-contrib-connect": "^3.0.0",
          "grunt-contrib-copy": "^1.0.0",
          "grunt-contrib-uglify": "^5.0.0",
          "grunt-mocha-istanbul": "^5.0.2",
          "grunt-saucelabs": "^9.0.1",
          istanbul: "^0.4.5",
          mocha: "^8.0.1"
        },
        dependencies: {
          "bn.js": "^4.11.9",
          brorand: "^1.1.0",
          "hash.js": "^1.0.0",
          "hmac-drbg": "^1.0.1",
          inherits: "^2.0.4",
          "minimalistic-assert": "^1.0.1",
          "minimalistic-crypto-utils": "^1.0.1"
        }
      };
    }
  });

  // ../../node_modules/.pnpm/bn.js@4.12.0/node_modules/bn.js/lib/bn.js
  var require_bn2 = __commonJS({
    "../../node_modules/.pnpm/bn.js@4.12.0/node_modules/bn.js/lib/bn.js"(exports, module2) {
      (function(module3, exports2) {
        "use strict";
        function assert3(val, msg) {
          if (!val)
            throw new Error(msg || "Assertion failed");
        }
        function inherits(ctor, superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function() {
          };
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
        function BN2(number2, base, endian) {
          if (BN2.isBN(number2)) {
            return number2;
          }
          this.negative = 0;
          this.words = null;
          this.length = 0;
          this.red = null;
          if (number2 !== null) {
            if (base === "le" || base === "be") {
              endian = base;
              base = 10;
            }
            this._init(number2 || 0, base || 10, endian || "be");
          }
        }
        if (typeof module3 === "object") {
          module3.exports = BN2;
        } else {
          exports2.BN = BN2;
        }
        BN2.BN = BN2;
        BN2.wordSize = 26;
        var Buffer2;
        try {
          if (typeof window !== "undefined" && typeof window.Buffer !== "undefined") {
            Buffer2 = window.Buffer;
          } else {
            Buffer2 = __require("buffer").Buffer;
          }
        } catch (e) {
        }
        BN2.isBN = function isBN(num) {
          if (num instanceof BN2) {
            return true;
          }
          return num !== null && typeof num === "object" && num.constructor.wordSize === BN2.wordSize && Array.isArray(num.words);
        };
        BN2.max = function max(left, right) {
          if (left.cmp(right) > 0)
            return left;
          return right;
        };
        BN2.min = function min(left, right) {
          if (left.cmp(right) < 0)
            return left;
          return right;
        };
        BN2.prototype._init = function init(number2, base, endian) {
          if (typeof number2 === "number") {
            return this._initNumber(number2, base, endian);
          }
          if (typeof number2 === "object") {
            return this._initArray(number2, base, endian);
          }
          if (base === "hex") {
            base = 16;
          }
          assert3(base === (base | 0) && base >= 2 && base <= 36);
          number2 = number2.toString().replace(/\s+/g, "");
          var start = 0;
          if (number2[0] === "-") {
            start++;
            this.negative = 1;
          }
          if (start < number2.length) {
            if (base === 16) {
              this._parseHex(number2, start, endian);
            } else {
              this._parseBase(number2, base, start);
              if (endian === "le") {
                this._initArray(this.toArray(), base, endian);
              }
            }
          }
        };
        BN2.prototype._initNumber = function _initNumber(number2, base, endian) {
          if (number2 < 0) {
            this.negative = 1;
            number2 = -number2;
          }
          if (number2 < 67108864) {
            this.words = [number2 & 67108863];
            this.length = 1;
          } else if (number2 < 4503599627370496) {
            this.words = [
              number2 & 67108863,
              number2 / 67108864 & 67108863
            ];
            this.length = 2;
          } else {
            assert3(number2 < 9007199254740992);
            this.words = [
              number2 & 67108863,
              number2 / 67108864 & 67108863,
              1
            ];
            this.length = 3;
          }
          if (endian !== "le")
            return;
          this._initArray(this.toArray(), base, endian);
        };
        BN2.prototype._initArray = function _initArray(number2, base, endian) {
          assert3(typeof number2.length === "number");
          if (number2.length <= 0) {
            this.words = [0];
            this.length = 1;
            return this;
          }
          this.length = Math.ceil(number2.length / 3);
          this.words = new Array(this.length);
          for (var i = 0; i < this.length; i++) {
            this.words[i] = 0;
          }
          var j, w;
          var off = 0;
          if (endian === "be") {
            for (i = number2.length - 1, j = 0; i >= 0; i -= 3) {
              w = number2[i] | number2[i - 1] << 8 | number2[i - 2] << 16;
              this.words[j] |= w << off & 67108863;
              this.words[j + 1] = w >>> 26 - off & 67108863;
              off += 24;
              if (off >= 26) {
                off -= 26;
                j++;
              }
            }
          } else if (endian === "le") {
            for (i = 0, j = 0; i < number2.length; i += 3) {
              w = number2[i] | number2[i + 1] << 8 | number2[i + 2] << 16;
              this.words[j] |= w << off & 67108863;
              this.words[j + 1] = w >>> 26 - off & 67108863;
              off += 24;
              if (off >= 26) {
                off -= 26;
                j++;
              }
            }
          }
          return this.strip();
        };
        function parseHex4Bits(string, index) {
          var c = string.charCodeAt(index);
          if (c >= 65 && c <= 70) {
            return c - 55;
          } else if (c >= 97 && c <= 102) {
            return c - 87;
          } else {
            return c - 48 & 15;
          }
        }
        function parseHexByte(string, lowerBound, index) {
          var r = parseHex4Bits(string, index);
          if (index - 1 >= lowerBound) {
            r |= parseHex4Bits(string, index - 1) << 4;
          }
          return r;
        }
        BN2.prototype._parseHex = function _parseHex(number2, start, endian) {
          this.length = Math.ceil((number2.length - start) / 6);
          this.words = new Array(this.length);
          for (var i = 0; i < this.length; i++) {
            this.words[i] = 0;
          }
          var off = 0;
          var j = 0;
          var w;
          if (endian === "be") {
            for (i = number2.length - 1; i >= start; i -= 2) {
              w = parseHexByte(number2, start, i) << off;
              this.words[j] |= w & 67108863;
              if (off >= 18) {
                off -= 18;
                j += 1;
                this.words[j] |= w >>> 26;
              } else {
                off += 8;
              }
            }
          } else {
            var parseLength = number2.length - start;
            for (i = parseLength % 2 === 0 ? start + 1 : start; i < number2.length; i += 2) {
              w = parseHexByte(number2, start, i) << off;
              this.words[j] |= w & 67108863;
              if (off >= 18) {
                off -= 18;
                j += 1;
                this.words[j] |= w >>> 26;
              } else {
                off += 8;
              }
            }
          }
          this.strip();
        };
        function parseBase(str, start, end, mul) {
          var r = 0;
          var len = Math.min(str.length, end);
          for (var i = start; i < len; i++) {
            var c = str.charCodeAt(i) - 48;
            r *= mul;
            if (c >= 49) {
              r += c - 49 + 10;
            } else if (c >= 17) {
              r += c - 17 + 10;
            } else {
              r += c;
            }
          }
          return r;
        }
        BN2.prototype._parseBase = function _parseBase(number2, base, start) {
          this.words = [0];
          this.length = 1;
          for (var limbLen = 0, limbPow = 1; limbPow <= 67108863; limbPow *= base) {
            limbLen++;
          }
          limbLen--;
          limbPow = limbPow / base | 0;
          var total = number2.length - start;
          var mod = total % limbLen;
          var end = Math.min(total, total - mod) + start;
          var word = 0;
          for (var i = start; i < end; i += limbLen) {
            word = parseBase(number2, i, i + limbLen, base);
            this.imuln(limbPow);
            if (this.words[0] + word < 67108864) {
              this.words[0] += word;
            } else {
              this._iaddn(word);
            }
          }
          if (mod !== 0) {
            var pow = 1;
            word = parseBase(number2, i, number2.length, base);
            for (i = 0; i < mod; i++) {
              pow *= base;
            }
            this.imuln(pow);
            if (this.words[0] + word < 67108864) {
              this.words[0] += word;
            } else {
              this._iaddn(word);
            }
          }
          this.strip();
        };
        BN2.prototype.copy = function copy(dest) {
          dest.words = new Array(this.length);
          for (var i = 0; i < this.length; i++) {
            dest.words[i] = this.words[i];
          }
          dest.length = this.length;
          dest.negative = this.negative;
          dest.red = this.red;
        };
        BN2.prototype.clone = function clone() {
          var r = new BN2(null);
          this.copy(r);
          return r;
        };
        BN2.prototype._expand = function _expand(size) {
          while (this.length < size) {
            this.words[this.length++] = 0;
          }
          return this;
        };
        BN2.prototype.strip = function strip() {
          while (this.length > 1 && this.words[this.length - 1] === 0) {
            this.length--;
          }
          return this._normSign();
        };
        BN2.prototype._normSign = function _normSign() {
          if (this.length === 1 && this.words[0] === 0) {
            this.negative = 0;
          }
          return this;
        };
        BN2.prototype.inspect = function inspect() {
          return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
        };
        var zeros = [
          "",
          "0",
          "00",
          "000",
          "0000",
          "00000",
          "000000",
          "0000000",
          "00000000",
          "000000000",
          "0000000000",
          "00000000000",
          "000000000000",
          "0000000000000",
          "00000000000000",
          "000000000000000",
          "0000000000000000",
          "00000000000000000",
          "000000000000000000",
          "0000000000000000000",
          "00000000000000000000",
          "000000000000000000000",
          "0000000000000000000000",
          "00000000000000000000000",
          "000000000000000000000000",
          "0000000000000000000000000"
        ];
        var groupSizes = [
          0,
          0,
          25,
          16,
          12,
          11,
          10,
          9,
          8,
          8,
          7,
          7,
          7,
          7,
          6,
          6,
          6,
          6,
          6,
          6,
          6,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5,
          5
        ];
        var groupBases = [
          0,
          0,
          33554432,
          43046721,
          16777216,
          48828125,
          60466176,
          40353607,
          16777216,
          43046721,
          1e7,
          19487171,
          35831808,
          62748517,
          7529536,
          11390625,
          16777216,
          24137569,
          34012224,
          47045881,
          64e6,
          4084101,
          5153632,
          6436343,
          7962624,
          9765625,
          11881376,
          14348907,
          17210368,
          20511149,
          243e5,
          28629151,
          33554432,
          39135393,
          45435424,
          52521875,
          60466176
        ];
        BN2.prototype.toString = function toString(base, padding) {
          base = base || 10;
          padding = padding | 0 || 1;
          var out;
          if (base === 16 || base === "hex") {
            out = "";
            var off = 0;
            var carry = 0;
            for (var i = 0; i < this.length; i++) {
              var w = this.words[i];
              var word = ((w << off | carry) & 16777215).toString(16);
              carry = w >>> 24 - off & 16777215;
              if (carry !== 0 || i !== this.length - 1) {
                out = zeros[6 - word.length] + word + out;
              } else {
                out = word + out;
              }
              off += 2;
              if (off >= 26) {
                off -= 26;
                i--;
              }
            }
            if (carry !== 0) {
              out = carry.toString(16) + out;
            }
            while (out.length % padding !== 0) {
              out = "0" + out;
            }
            if (this.negative !== 0) {
              out = "-" + out;
            }
            return out;
          }
          if (base === (base | 0) && base >= 2 && base <= 36) {
            var groupSize = groupSizes[base];
            var groupBase = groupBases[base];
            out = "";
            var c = this.clone();
            c.negative = 0;
            while (!c.isZero()) {
              var r = c.modn(groupBase).toString(base);
              c = c.idivn(groupBase);
              if (!c.isZero()) {
                out = zeros[groupSize - r.length] + r + out;
              } else {
                out = r + out;
              }
            }
            if (this.isZero()) {
              out = "0" + out;
            }
            while (out.length % padding !== 0) {
              out = "0" + out;
            }
            if (this.negative !== 0) {
              out = "-" + out;
            }
            return out;
          }
          assert3(false, "Base should be between 2 and 36");
        };
        BN2.prototype.toNumber = function toNumber2() {
          var ret = this.words[0];
          if (this.length === 2) {
            ret += this.words[1] * 67108864;
          } else if (this.length === 3 && this.words[2] === 1) {
            ret += 4503599627370496 + this.words[1] * 67108864;
          } else if (this.length > 2) {
            assert3(false, "Number can only safely store up to 53 bits");
          }
          return this.negative !== 0 ? -ret : ret;
        };
        BN2.prototype.toJSON = function toJSON() {
          return this.toString(16);
        };
        BN2.prototype.toBuffer = function toBuffer(endian, length) {
          assert3(typeof Buffer2 !== "undefined");
          return this.toArrayLike(Buffer2, endian, length);
        };
        BN2.prototype.toArray = function toArray(endian, length) {
          return this.toArrayLike(Array, endian, length);
        };
        BN2.prototype.toArrayLike = function toArrayLike(ArrayType, endian, length) {
          var byteLength = this.byteLength();
          var reqLength = length || Math.max(1, byteLength);
          assert3(byteLength <= reqLength, "byte array longer than desired length");
          assert3(reqLength > 0, "Requested array length <= 0");
          this.strip();
          var littleEndian = endian === "le";
          var res = new ArrayType(reqLength);
          var b, i;
          var q = this.clone();
          if (!littleEndian) {
            for (i = 0; i < reqLength - byteLength; i++) {
              res[i] = 0;
            }
            for (i = 0; !q.isZero(); i++) {
              b = q.andln(255);
              q.iushrn(8);
              res[reqLength - i - 1] = b;
            }
          } else {
            for (i = 0; !q.isZero(); i++) {
              b = q.andln(255);
              q.iushrn(8);
              res[i] = b;
            }
            for (; i < reqLength; i++) {
              res[i] = 0;
            }
          }
          return res;
        };
        if (Math.clz32) {
          BN2.prototype._countBits = function _countBits(w) {
            return 32 - Math.clz32(w);
          };
        } else {
          BN2.prototype._countBits = function _countBits(w) {
            var t = w;
            var r = 0;
            if (t >= 4096) {
              r += 13;
              t >>>= 13;
            }
            if (t >= 64) {
              r += 7;
              t >>>= 7;
            }
            if (t >= 8) {
              r += 4;
              t >>>= 4;
            }
            if (t >= 2) {
              r += 2;
              t >>>= 2;
            }
            return r + t;
          };
        }
        BN2.prototype._zeroBits = function _zeroBits(w) {
          if (w === 0)
            return 26;
          var t = w;
          var r = 0;
          if ((t & 8191) === 0) {
            r += 13;
            t >>>= 13;
          }
          if ((t & 127) === 0) {
            r += 7;
            t >>>= 7;
          }
          if ((t & 15) === 0) {
            r += 4;
            t >>>= 4;
          }
          if ((t & 3) === 0) {
            r += 2;
            t >>>= 2;
          }
          if ((t & 1) === 0) {
            r++;
          }
          return r;
        };
        BN2.prototype.bitLength = function bitLength() {
          var w = this.words[this.length - 1];
          var hi = this._countBits(w);
          return (this.length - 1) * 26 + hi;
        };
        function toBitArray(num) {
          var w = new Array(num.bitLength());
          for (var bit = 0; bit < w.length; bit++) {
            var off = bit / 26 | 0;
            var wbit = bit % 26;
            w[bit] = (num.words[off] & 1 << wbit) >>> wbit;
          }
          return w;
        }
        BN2.prototype.zeroBits = function zeroBits() {
          if (this.isZero())
            return 0;
          var r = 0;
          for (var i = 0; i < this.length; i++) {
            var b = this._zeroBits(this.words[i]);
            r += b;
            if (b !== 26)
              break;
          }
          return r;
        };
        BN2.prototype.byteLength = function byteLength() {
          return Math.ceil(this.bitLength() / 8);
        };
        BN2.prototype.toTwos = function toTwos2(width) {
          if (this.negative !== 0) {
            return this.abs().inotn(width).iaddn(1);
          }
          return this.clone();
        };
        BN2.prototype.fromTwos = function fromTwos2(width) {
          if (this.testn(width - 1)) {
            return this.notn(width).iaddn(1).ineg();
          }
          return this.clone();
        };
        BN2.prototype.isNeg = function isNeg() {
          return this.negative !== 0;
        };
        BN2.prototype.neg = function neg() {
          return this.clone().ineg();
        };
        BN2.prototype.ineg = function ineg() {
          if (!this.isZero()) {
            this.negative ^= 1;
          }
          return this;
        };
        BN2.prototype.iuor = function iuor(num) {
          while (this.length < num.length) {
            this.words[this.length++] = 0;
          }
          for (var i = 0; i < num.length; i++) {
            this.words[i] = this.words[i] | num.words[i];
          }
          return this.strip();
        };
        BN2.prototype.ior = function ior(num) {
          assert3((this.negative | num.negative) === 0);
          return this.iuor(num);
        };
        BN2.prototype.or = function or(num) {
          if (this.length > num.length)
            return this.clone().ior(num);
          return num.clone().ior(this);
        };
        BN2.prototype.uor = function uor(num) {
          if (this.length > num.length)
            return this.clone().iuor(num);
          return num.clone().iuor(this);
        };
        BN2.prototype.iuand = function iuand(num) {
          var b;
          if (this.length > num.length) {
            b = num;
          } else {
            b = this;
          }
          for (var i = 0; i < b.length; i++) {
            this.words[i] = this.words[i] & num.words[i];
          }
          this.length = b.length;
          return this.strip();
        };
        BN2.prototype.iand = function iand(num) {
          assert3((this.negative | num.negative) === 0);
          return this.iuand(num);
        };
        BN2.prototype.and = function and(num) {
          if (this.length > num.length)
            return this.clone().iand(num);
          return num.clone().iand(this);
        };
        BN2.prototype.uand = function uand(num) {
          if (this.length > num.length)
            return this.clone().iuand(num);
          return num.clone().iuand(this);
        };
        BN2.prototype.iuxor = function iuxor(num) {
          var a;
          var b;
          if (this.length > num.length) {
            a = this;
            b = num;
          } else {
            a = num;
            b = this;
          }
          for (var i = 0; i < b.length; i++) {
            this.words[i] = a.words[i] ^ b.words[i];
          }
          if (this !== a) {
            for (; i < a.length; i++) {
              this.words[i] = a.words[i];
            }
          }
          this.length = a.length;
          return this.strip();
        };
        BN2.prototype.ixor = function ixor(num) {
          assert3((this.negative | num.negative) === 0);
          return this.iuxor(num);
        };
        BN2.prototype.xor = function xor(num) {
          if (this.length > num.length)
            return this.clone().ixor(num);
          return num.clone().ixor(this);
        };
        BN2.prototype.uxor = function uxor(num) {
          if (this.length > num.length)
            return this.clone().iuxor(num);
          return num.clone().iuxor(this);
        };
        BN2.prototype.inotn = function inotn(width) {
          assert3(typeof width === "number" && width >= 0);
          var bytesNeeded = Math.ceil(width / 26) | 0;
          var bitsLeft = width % 26;
          this._expand(bytesNeeded);
          if (bitsLeft > 0) {
            bytesNeeded--;
          }
          for (var i = 0; i < bytesNeeded; i++) {
            this.words[i] = ~this.words[i] & 67108863;
          }
          if (bitsLeft > 0) {
            this.words[i] = ~this.words[i] & 67108863 >> 26 - bitsLeft;
          }
          return this.strip();
        };
        BN2.prototype.notn = function notn(width) {
          return this.clone().inotn(width);
        };
        BN2.prototype.setn = function setn(bit, val) {
          assert3(typeof bit === "number" && bit >= 0);
          var off = bit / 26 | 0;
          var wbit = bit % 26;
          this._expand(off + 1);
          if (val) {
            this.words[off] = this.words[off] | 1 << wbit;
          } else {
            this.words[off] = this.words[off] & ~(1 << wbit);
          }
          return this.strip();
        };
        BN2.prototype.iadd = function iadd(num) {
          var r;
          if (this.negative !== 0 && num.negative === 0) {
            this.negative = 0;
            r = this.isub(num);
            this.negative ^= 1;
            return this._normSign();
          } else if (this.negative === 0 && num.negative !== 0) {
            num.negative = 0;
            r = this.isub(num);
            num.negative = 1;
            return r._normSign();
          }
          var a, b;
          if (this.length > num.length) {
            a = this;
            b = num;
          } else {
            a = num;
            b = this;
          }
          var carry = 0;
          for (var i = 0; i < b.length; i++) {
            r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
            this.words[i] = r & 67108863;
            carry = r >>> 26;
          }
          for (; carry !== 0 && i < a.length; i++) {
            r = (a.words[i] | 0) + carry;
            this.words[i] = r & 67108863;
            carry = r >>> 26;
          }
          this.length = a.length;
          if (carry !== 0) {
            this.words[this.length] = carry;
            this.length++;
          } else if (a !== this) {
            for (; i < a.length; i++) {
              this.words[i] = a.words[i];
            }
          }
          return this;
        };
        BN2.prototype.add = function add2(num) {
          var res;
          if (num.negative !== 0 && this.negative === 0) {
            num.negative = 0;
            res = this.sub(num);
            num.negative ^= 1;
            return res;
          } else if (num.negative === 0 && this.negative !== 0) {
            this.negative = 0;
            res = num.sub(this);
            this.negative = 1;
            return res;
          }
          if (this.length > num.length)
            return this.clone().iadd(num);
          return num.clone().iadd(this);
        };
        BN2.prototype.isub = function isub(num) {
          if (num.negative !== 0) {
            num.negative = 0;
            var r = this.iadd(num);
            num.negative = 1;
            return r._normSign();
          } else if (this.negative !== 0) {
            this.negative = 0;
            this.iadd(num);
            this.negative = 1;
            return this._normSign();
          }
          var cmp = this.cmp(num);
          if (cmp === 0) {
            this.negative = 0;
            this.length = 1;
            this.words[0] = 0;
            return this;
          }
          var a, b;
          if (cmp > 0) {
            a = this;
            b = num;
          } else {
            a = num;
            b = this;
          }
          var carry = 0;
          for (var i = 0; i < b.length; i++) {
            r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
            carry = r >> 26;
            this.words[i] = r & 67108863;
          }
          for (; carry !== 0 && i < a.length; i++) {
            r = (a.words[i] | 0) + carry;
            carry = r >> 26;
            this.words[i] = r & 67108863;
          }
          if (carry === 0 && i < a.length && a !== this) {
            for (; i < a.length; i++) {
              this.words[i] = a.words[i];
            }
          }
          this.length = Math.max(this.length, i);
          if (a !== this) {
            this.negative = 1;
          }
          return this.strip();
        };
        BN2.prototype.sub = function sub(num) {
          return this.clone().isub(num);
        };
        function smallMulTo(self2, num, out) {
          out.negative = num.negative ^ self2.negative;
          var len = self2.length + num.length | 0;
          out.length = len;
          len = len - 1 | 0;
          var a = self2.words[0] | 0;
          var b = num.words[0] | 0;
          var r = a * b;
          var lo = r & 67108863;
          var carry = r / 67108864 | 0;
          out.words[0] = lo;
          for (var k = 1; k < len; k++) {
            var ncarry = carry >>> 26;
            var rword = carry & 67108863;
            var maxJ = Math.min(k, num.length - 1);
            for (var j = Math.max(0, k - self2.length + 1); j <= maxJ; j++) {
              var i = k - j | 0;
              a = self2.words[i] | 0;
              b = num.words[j] | 0;
              r = a * b + rword;
              ncarry += r / 67108864 | 0;
              rword = r & 67108863;
            }
            out.words[k] = rword | 0;
            carry = ncarry | 0;
          }
          if (carry !== 0) {
            out.words[k] = carry | 0;
          } else {
            out.length--;
          }
          return out.strip();
        }
        var comb10MulTo = function comb10MulTo2(self2, num, out) {
          var a = self2.words;
          var b = num.words;
          var o = out.words;
          var c = 0;
          var lo;
          var mid;
          var hi;
          var a0 = a[0] | 0;
          var al0 = a0 & 8191;
          var ah0 = a0 >>> 13;
          var a1 = a[1] | 0;
          var al1 = a1 & 8191;
          var ah1 = a1 >>> 13;
          var a2 = a[2] | 0;
          var al2 = a2 & 8191;
          var ah2 = a2 >>> 13;
          var a3 = a[3] | 0;
          var al3 = a3 & 8191;
          var ah3 = a3 >>> 13;
          var a4 = a[4] | 0;
          var al4 = a4 & 8191;
          var ah4 = a4 >>> 13;
          var a5 = a[5] | 0;
          var al5 = a5 & 8191;
          var ah5 = a5 >>> 13;
          var a6 = a[6] | 0;
          var al6 = a6 & 8191;
          var ah6 = a6 >>> 13;
          var a7 = a[7] | 0;
          var al7 = a7 & 8191;
          var ah7 = a7 >>> 13;
          var a8 = a[8] | 0;
          var al8 = a8 & 8191;
          var ah8 = a8 >>> 13;
          var a9 = a[9] | 0;
          var al9 = a9 & 8191;
          var ah9 = a9 >>> 13;
          var b0 = b[0] | 0;
          var bl0 = b0 & 8191;
          var bh0 = b0 >>> 13;
          var b1 = b[1] | 0;
          var bl1 = b1 & 8191;
          var bh1 = b1 >>> 13;
          var b2 = b[2] | 0;
          var bl2 = b2 & 8191;
          var bh2 = b2 >>> 13;
          var b3 = b[3] | 0;
          var bl3 = b3 & 8191;
          var bh3 = b3 >>> 13;
          var b4 = b[4] | 0;
          var bl4 = b4 & 8191;
          var bh4 = b4 >>> 13;
          var b5 = b[5] | 0;
          var bl5 = b5 & 8191;
          var bh5 = b5 >>> 13;
          var b6 = b[6] | 0;
          var bl6 = b6 & 8191;
          var bh6 = b6 >>> 13;
          var b7 = b[7] | 0;
          var bl7 = b7 & 8191;
          var bh7 = b7 >>> 13;
          var b8 = b[8] | 0;
          var bl8 = b8 & 8191;
          var bh8 = b8 >>> 13;
          var b9 = b[9] | 0;
          var bl9 = b9 & 8191;
          var bh9 = b9 >>> 13;
          out.negative = self2.negative ^ num.negative;
          out.length = 19;
          lo = Math.imul(al0, bl0);
          mid = Math.imul(al0, bh0);
          mid = mid + Math.imul(ah0, bl0) | 0;
          hi = Math.imul(ah0, bh0);
          var w0 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w0 >>> 26) | 0;
          w0 &= 67108863;
          lo = Math.imul(al1, bl0);
          mid = Math.imul(al1, bh0);
          mid = mid + Math.imul(ah1, bl0) | 0;
          hi = Math.imul(ah1, bh0);
          lo = lo + Math.imul(al0, bl1) | 0;
          mid = mid + Math.imul(al0, bh1) | 0;
          mid = mid + Math.imul(ah0, bl1) | 0;
          hi = hi + Math.imul(ah0, bh1) | 0;
          var w1 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w1 >>> 26) | 0;
          w1 &= 67108863;
          lo = Math.imul(al2, bl0);
          mid = Math.imul(al2, bh0);
          mid = mid + Math.imul(ah2, bl0) | 0;
          hi = Math.imul(ah2, bh0);
          lo = lo + Math.imul(al1, bl1) | 0;
          mid = mid + Math.imul(al1, bh1) | 0;
          mid = mid + Math.imul(ah1, bl1) | 0;
          hi = hi + Math.imul(ah1, bh1) | 0;
          lo = lo + Math.imul(al0, bl2) | 0;
          mid = mid + Math.imul(al0, bh2) | 0;
          mid = mid + Math.imul(ah0, bl2) | 0;
          hi = hi + Math.imul(ah0, bh2) | 0;
          var w2 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w2 >>> 26) | 0;
          w2 &= 67108863;
          lo = Math.imul(al3, bl0);
          mid = Math.imul(al3, bh0);
          mid = mid + Math.imul(ah3, bl0) | 0;
          hi = Math.imul(ah3, bh0);
          lo = lo + Math.imul(al2, bl1) | 0;
          mid = mid + Math.imul(al2, bh1) | 0;
          mid = mid + Math.imul(ah2, bl1) | 0;
          hi = hi + Math.imul(ah2, bh1) | 0;
          lo = lo + Math.imul(al1, bl2) | 0;
          mid = mid + Math.imul(al1, bh2) | 0;
          mid = mid + Math.imul(ah1, bl2) | 0;
          hi = hi + Math.imul(ah1, bh2) | 0;
          lo = lo + Math.imul(al0, bl3) | 0;
          mid = mid + Math.imul(al0, bh3) | 0;
          mid = mid + Math.imul(ah0, bl3) | 0;
          hi = hi + Math.imul(ah0, bh3) | 0;
          var w3 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w3 >>> 26) | 0;
          w3 &= 67108863;
          lo = Math.imul(al4, bl0);
          mid = Math.imul(al4, bh0);
          mid = mid + Math.imul(ah4, bl0) | 0;
          hi = Math.imul(ah4, bh0);
          lo = lo + Math.imul(al3, bl1) | 0;
          mid = mid + Math.imul(al3, bh1) | 0;
          mid = mid + Math.imul(ah3, bl1) | 0;
          hi = hi + Math.imul(ah3, bh1) | 0;
          lo = lo + Math.imul(al2, bl2) | 0;
          mid = mid + Math.imul(al2, bh2) | 0;
          mid = mid + Math.imul(ah2, bl2) | 0;
          hi = hi + Math.imul(ah2, bh2) | 0;
          lo = lo + Math.imul(al1, bl3) | 0;
          mid = mid + Math.imul(al1, bh3) | 0;
          mid = mid + Math.imul(ah1, bl3) | 0;
          hi = hi + Math.imul(ah1, bh3) | 0;
          lo = lo + Math.imul(al0, bl4) | 0;
          mid = mid + Math.imul(al0, bh4) | 0;
          mid = mid + Math.imul(ah0, bl4) | 0;
          hi = hi + Math.imul(ah0, bh4) | 0;
          var w4 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w4 >>> 26) | 0;
          w4 &= 67108863;
          lo = Math.imul(al5, bl0);
          mid = Math.imul(al5, bh0);
          mid = mid + Math.imul(ah5, bl0) | 0;
          hi = Math.imul(ah5, bh0);
          lo = lo + Math.imul(al4, bl1) | 0;
          mid = mid + Math.imul(al4, bh1) | 0;
          mid = mid + Math.imul(ah4, bl1) | 0;
          hi = hi + Math.imul(ah4, bh1) | 0;
          lo = lo + Math.imul(al3, bl2) | 0;
          mid = mid + Math.imul(al3, bh2) | 0;
          mid = mid + Math.imul(ah3, bl2) | 0;
          hi = hi + Math.imul(ah3, bh2) | 0;
          lo = lo + Math.imul(al2, bl3) | 0;
          mid = mid + Math.imul(al2, bh3) | 0;
          mid = mid + Math.imul(ah2, bl3) | 0;
          hi = hi + Math.imul(ah2, bh3) | 0;
          lo = lo + Math.imul(al1, bl4) | 0;
          mid = mid + Math.imul(al1, bh4) | 0;
          mid = mid + Math.imul(ah1, bl4) | 0;
          hi = hi + Math.imul(ah1, bh4) | 0;
          lo = lo + Math.imul(al0, bl5) | 0;
          mid = mid + Math.imul(al0, bh5) | 0;
          mid = mid + Math.imul(ah0, bl5) | 0;
          hi = hi + Math.imul(ah0, bh5) | 0;
          var w5 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w5 >>> 26) | 0;
          w5 &= 67108863;
          lo = Math.imul(al6, bl0);
          mid = Math.imul(al6, bh0);
          mid = mid + Math.imul(ah6, bl0) | 0;
          hi = Math.imul(ah6, bh0);
          lo = lo + Math.imul(al5, bl1) | 0;
          mid = mid + Math.imul(al5, bh1) | 0;
          mid = mid + Math.imul(ah5, bl1) | 0;
          hi = hi + Math.imul(ah5, bh1) | 0;
          lo = lo + Math.imul(al4, bl2) | 0;
          mid = mid + Math.imul(al4, bh2) | 0;
          mid = mid + Math.imul(ah4, bl2) | 0;
          hi = hi + Math.imul(ah4, bh2) | 0;
          lo = lo + Math.imul(al3, bl3) | 0;
          mid = mid + Math.imul(al3, bh3) | 0;
          mid = mid + Math.imul(ah3, bl3) | 0;
          hi = hi + Math.imul(ah3, bh3) | 0;
          lo = lo + Math.imul(al2, bl4) | 0;
          mid = mid + Math.imul(al2, bh4) | 0;
          mid = mid + Math.imul(ah2, bl4) | 0;
          hi = hi + Math.imul(ah2, bh4) | 0;
          lo = lo + Math.imul(al1, bl5) | 0;
          mid = mid + Math.imul(al1, bh5) | 0;
          mid = mid + Math.imul(ah1, bl5) | 0;
          hi = hi + Math.imul(ah1, bh5) | 0;
          lo = lo + Math.imul(al0, bl6) | 0;
          mid = mid + Math.imul(al0, bh6) | 0;
          mid = mid + Math.imul(ah0, bl6) | 0;
          hi = hi + Math.imul(ah0, bh6) | 0;
          var w6 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w6 >>> 26) | 0;
          w6 &= 67108863;
          lo = Math.imul(al7, bl0);
          mid = Math.imul(al7, bh0);
          mid = mid + Math.imul(ah7, bl0) | 0;
          hi = Math.imul(ah7, bh0);
          lo = lo + Math.imul(al6, bl1) | 0;
          mid = mid + Math.imul(al6, bh1) | 0;
          mid = mid + Math.imul(ah6, bl1) | 0;
          hi = hi + Math.imul(ah6, bh1) | 0;
          lo = lo + Math.imul(al5, bl2) | 0;
          mid = mid + Math.imul(al5, bh2) | 0;
          mid = mid + Math.imul(ah5, bl2) | 0;
          hi = hi + Math.imul(ah5, bh2) | 0;
          lo = lo + Math.imul(al4, bl3) | 0;
          mid = mid + Math.imul(al4, bh3) | 0;
          mid = mid + Math.imul(ah4, bl3) | 0;
          hi = hi + Math.imul(ah4, bh3) | 0;
          lo = lo + Math.imul(al3, bl4) | 0;
          mid = mid + Math.imul(al3, bh4) | 0;
          mid = mid + Math.imul(ah3, bl4) | 0;
          hi = hi + Math.imul(ah3, bh4) | 0;
          lo = lo + Math.imul(al2, bl5) | 0;
          mid = mid + Math.imul(al2, bh5) | 0;
          mid = mid + Math.imul(ah2, bl5) | 0;
          hi = hi + Math.imul(ah2, bh5) | 0;
          lo = lo + Math.imul(al1, bl6) | 0;
          mid = mid + Math.imul(al1, bh6) | 0;
          mid = mid + Math.imul(ah1, bl6) | 0;
          hi = hi + Math.imul(ah1, bh6) | 0;
          lo = lo + Math.imul(al0, bl7) | 0;
          mid = mid + Math.imul(al0, bh7) | 0;
          mid = mid + Math.imul(ah0, bl7) | 0;
          hi = hi + Math.imul(ah0, bh7) | 0;
          var w7 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w7 >>> 26) | 0;
          w7 &= 67108863;
          lo = Math.imul(al8, bl0);
          mid = Math.imul(al8, bh0);
          mid = mid + Math.imul(ah8, bl0) | 0;
          hi = Math.imul(ah8, bh0);
          lo = lo + Math.imul(al7, bl1) | 0;
          mid = mid + Math.imul(al7, bh1) | 0;
          mid = mid + Math.imul(ah7, bl1) | 0;
          hi = hi + Math.imul(ah7, bh1) | 0;
          lo = lo + Math.imul(al6, bl2) | 0;
          mid = mid + Math.imul(al6, bh2) | 0;
          mid = mid + Math.imul(ah6, bl2) | 0;
          hi = hi + Math.imul(ah6, bh2) | 0;
          lo = lo + Math.imul(al5, bl3) | 0;
          mid = mid + Math.imul(al5, bh3) | 0;
          mid = mid + Math.imul(ah5, bl3) | 0;
          hi = hi + Math.imul(ah5, bh3) | 0;
          lo = lo + Math.imul(al4, bl4) | 0;
          mid = mid + Math.imul(al4, bh4) | 0;
          mid = mid + Math.imul(ah4, bl4) | 0;
          hi = hi + Math.imul(ah4, bh4) | 0;
          lo = lo + Math.imul(al3, bl5) | 0;
          mid = mid + Math.imul(al3, bh5) | 0;
          mid = mid + Math.imul(ah3, bl5) | 0;
          hi = hi + Math.imul(ah3, bh5) | 0;
          lo = lo + Math.imul(al2, bl6) | 0;
          mid = mid + Math.imul(al2, bh6) | 0;
          mid = mid + Math.imul(ah2, bl6) | 0;
          hi = hi + Math.imul(ah2, bh6) | 0;
          lo = lo + Math.imul(al1, bl7) | 0;
          mid = mid + Math.imul(al1, bh7) | 0;
          mid = mid + Math.imul(ah1, bl7) | 0;
          hi = hi + Math.imul(ah1, bh7) | 0;
          lo = lo + Math.imul(al0, bl8) | 0;
          mid = mid + Math.imul(al0, bh8) | 0;
          mid = mid + Math.imul(ah0, bl8) | 0;
          hi = hi + Math.imul(ah0, bh8) | 0;
          var w8 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w8 >>> 26) | 0;
          w8 &= 67108863;
          lo = Math.imul(al9, bl0);
          mid = Math.imul(al9, bh0);
          mid = mid + Math.imul(ah9, bl0) | 0;
          hi = Math.imul(ah9, bh0);
          lo = lo + Math.imul(al8, bl1) | 0;
          mid = mid + Math.imul(al8, bh1) | 0;
          mid = mid + Math.imul(ah8, bl1) | 0;
          hi = hi + Math.imul(ah8, bh1) | 0;
          lo = lo + Math.imul(al7, bl2) | 0;
          mid = mid + Math.imul(al7, bh2) | 0;
          mid = mid + Math.imul(ah7, bl2) | 0;
          hi = hi + Math.imul(ah7, bh2) | 0;
          lo = lo + Math.imul(al6, bl3) | 0;
          mid = mid + Math.imul(al6, bh3) | 0;
          mid = mid + Math.imul(ah6, bl3) | 0;
          hi = hi + Math.imul(ah6, bh3) | 0;
          lo = lo + Math.imul(al5, bl4) | 0;
          mid = mid + Math.imul(al5, bh4) | 0;
          mid = mid + Math.imul(ah5, bl4) | 0;
          hi = hi + Math.imul(ah5, bh4) | 0;
          lo = lo + Math.imul(al4, bl5) | 0;
          mid = mid + Math.imul(al4, bh5) | 0;
          mid = mid + Math.imul(ah4, bl5) | 0;
          hi = hi + Math.imul(ah4, bh5) | 0;
          lo = lo + Math.imul(al3, bl6) | 0;
          mid = mid + Math.imul(al3, bh6) | 0;
          mid = mid + Math.imul(ah3, bl6) | 0;
          hi = hi + Math.imul(ah3, bh6) | 0;
          lo = lo + Math.imul(al2, bl7) | 0;
          mid = mid + Math.imul(al2, bh7) | 0;
          mid = mid + Math.imul(ah2, bl7) | 0;
          hi = hi + Math.imul(ah2, bh7) | 0;
          lo = lo + Math.imul(al1, bl8) | 0;
          mid = mid + Math.imul(al1, bh8) | 0;
          mid = mid + Math.imul(ah1, bl8) | 0;
          hi = hi + Math.imul(ah1, bh8) | 0;
          lo = lo + Math.imul(al0, bl9) | 0;
          mid = mid + Math.imul(al0, bh9) | 0;
          mid = mid + Math.imul(ah0, bl9) | 0;
          hi = hi + Math.imul(ah0, bh9) | 0;
          var w9 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w9 >>> 26) | 0;
          w9 &= 67108863;
          lo = Math.imul(al9, bl1);
          mid = Math.imul(al9, bh1);
          mid = mid + Math.imul(ah9, bl1) | 0;
          hi = Math.imul(ah9, bh1);
          lo = lo + Math.imul(al8, bl2) | 0;
          mid = mid + Math.imul(al8, bh2) | 0;
          mid = mid + Math.imul(ah8, bl2) | 0;
          hi = hi + Math.imul(ah8, bh2) | 0;
          lo = lo + Math.imul(al7, bl3) | 0;
          mid = mid + Math.imul(al7, bh3) | 0;
          mid = mid + Math.imul(ah7, bl3) | 0;
          hi = hi + Math.imul(ah7, bh3) | 0;
          lo = lo + Math.imul(al6, bl4) | 0;
          mid = mid + Math.imul(al6, bh4) | 0;
          mid = mid + Math.imul(ah6, bl4) | 0;
          hi = hi + Math.imul(ah6, bh4) | 0;
          lo = lo + Math.imul(al5, bl5) | 0;
          mid = mid + Math.imul(al5, bh5) | 0;
          mid = mid + Math.imul(ah5, bl5) | 0;
          hi = hi + Math.imul(ah5, bh5) | 0;
          lo = lo + Math.imul(al4, bl6) | 0;
          mid = mid + Math.imul(al4, bh6) | 0;
          mid = mid + Math.imul(ah4, bl6) | 0;
          hi = hi + Math.imul(ah4, bh6) | 0;
          lo = lo + Math.imul(al3, bl7) | 0;
          mid = mid + Math.imul(al3, bh7) | 0;
          mid = mid + Math.imul(ah3, bl7) | 0;
          hi = hi + Math.imul(ah3, bh7) | 0;
          lo = lo + Math.imul(al2, bl8) | 0;
          mid = mid + Math.imul(al2, bh8) | 0;
          mid = mid + Math.imul(ah2, bl8) | 0;
          hi = hi + Math.imul(ah2, bh8) | 0;
          lo = lo + Math.imul(al1, bl9) | 0;
          mid = mid + Math.imul(al1, bh9) | 0;
          mid = mid + Math.imul(ah1, bl9) | 0;
          hi = hi + Math.imul(ah1, bh9) | 0;
          var w10 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w10 >>> 26) | 0;
          w10 &= 67108863;
          lo = Math.imul(al9, bl2);
          mid = Math.imul(al9, bh2);
          mid = mid + Math.imul(ah9, bl2) | 0;
          hi = Math.imul(ah9, bh2);
          lo = lo + Math.imul(al8, bl3) | 0;
          mid = mid + Math.imul(al8, bh3) | 0;
          mid = mid + Math.imul(ah8, bl3) | 0;
          hi = hi + Math.imul(ah8, bh3) | 0;
          lo = lo + Math.imul(al7, bl4) | 0;
          mid = mid + Math.imul(al7, bh4) | 0;
          mid = mid + Math.imul(ah7, bl4) | 0;
          hi = hi + Math.imul(ah7, bh4) | 0;
          lo = lo + Math.imul(al6, bl5) | 0;
          mid = mid + Math.imul(al6, bh5) | 0;
          mid = mid + Math.imul(ah6, bl5) | 0;
          hi = hi + Math.imul(ah6, bh5) | 0;
          lo = lo + Math.imul(al5, bl6) | 0;
          mid = mid + Math.imul(al5, bh6) | 0;
          mid = mid + Math.imul(ah5, bl6) | 0;
          hi = hi + Math.imul(ah5, bh6) | 0;
          lo = lo + Math.imul(al4, bl7) | 0;
          mid = mid + Math.imul(al4, bh7) | 0;
          mid = mid + Math.imul(ah4, bl7) | 0;
          hi = hi + Math.imul(ah4, bh7) | 0;
          lo = lo + Math.imul(al3, bl8) | 0;
          mid = mid + Math.imul(al3, bh8) | 0;
          mid = mid + Math.imul(ah3, bl8) | 0;
          hi = hi + Math.imul(ah3, bh8) | 0;
          lo = lo + Math.imul(al2, bl9) | 0;
          mid = mid + Math.imul(al2, bh9) | 0;
          mid = mid + Math.imul(ah2, bl9) | 0;
          hi = hi + Math.imul(ah2, bh9) | 0;
          var w11 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w11 >>> 26) | 0;
          w11 &= 67108863;
          lo = Math.imul(al9, bl3);
          mid = Math.imul(al9, bh3);
          mid = mid + Math.imul(ah9, bl3) | 0;
          hi = Math.imul(ah9, bh3);
          lo = lo + Math.imul(al8, bl4) | 0;
          mid = mid + Math.imul(al8, bh4) | 0;
          mid = mid + Math.imul(ah8, bl4) | 0;
          hi = hi + Math.imul(ah8, bh4) | 0;
          lo = lo + Math.imul(al7, bl5) | 0;
          mid = mid + Math.imul(al7, bh5) | 0;
          mid = mid + Math.imul(ah7, bl5) | 0;
          hi = hi + Math.imul(ah7, bh5) | 0;
          lo = lo + Math.imul(al6, bl6) | 0;
          mid = mid + Math.imul(al6, bh6) | 0;
          mid = mid + Math.imul(ah6, bl6) | 0;
          hi = hi + Math.imul(ah6, bh6) | 0;
          lo = lo + Math.imul(al5, bl7) | 0;
          mid = mid + Math.imul(al5, bh7) | 0;
          mid = mid + Math.imul(ah5, bl7) | 0;
          hi = hi + Math.imul(ah5, bh7) | 0;
          lo = lo + Math.imul(al4, bl8) | 0;
          mid = mid + Math.imul(al4, bh8) | 0;
          mid = mid + Math.imul(ah4, bl8) | 0;
          hi = hi + Math.imul(ah4, bh8) | 0;
          lo = lo + Math.imul(al3, bl9) | 0;
          mid = mid + Math.imul(al3, bh9) | 0;
          mid = mid + Math.imul(ah3, bl9) | 0;
          hi = hi + Math.imul(ah3, bh9) | 0;
          var w12 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w12 >>> 26) | 0;
          w12 &= 67108863;
          lo = Math.imul(al9, bl4);
          mid = Math.imul(al9, bh4);
          mid = mid + Math.imul(ah9, bl4) | 0;
          hi = Math.imul(ah9, bh4);
          lo = lo + Math.imul(al8, bl5) | 0;
          mid = mid + Math.imul(al8, bh5) | 0;
          mid = mid + Math.imul(ah8, bl5) | 0;
          hi = hi + Math.imul(ah8, bh5) | 0;
          lo = lo + Math.imul(al7, bl6) | 0;
          mid = mid + Math.imul(al7, bh6) | 0;
          mid = mid + Math.imul(ah7, bl6) | 0;
          hi = hi + Math.imul(ah7, bh6) | 0;
          lo = lo + Math.imul(al6, bl7) | 0;
          mid = mid + Math.imul(al6, bh7) | 0;
          mid = mid + Math.imul(ah6, bl7) | 0;
          hi = hi + Math.imul(ah6, bh7) | 0;
          lo = lo + Math.imul(al5, bl8) | 0;
          mid = mid + Math.imul(al5, bh8) | 0;
          mid = mid + Math.imul(ah5, bl8) | 0;
          hi = hi + Math.imul(ah5, bh8) | 0;
          lo = lo + Math.imul(al4, bl9) | 0;
          mid = mid + Math.imul(al4, bh9) | 0;
          mid = mid + Math.imul(ah4, bl9) | 0;
          hi = hi + Math.imul(ah4, bh9) | 0;
          var w13 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w13 >>> 26) | 0;
          w13 &= 67108863;
          lo = Math.imul(al9, bl5);
          mid = Math.imul(al9, bh5);
          mid = mid + Math.imul(ah9, bl5) | 0;
          hi = Math.imul(ah9, bh5);
          lo = lo + Math.imul(al8, bl6) | 0;
          mid = mid + Math.imul(al8, bh6) | 0;
          mid = mid + Math.imul(ah8, bl6) | 0;
          hi = hi + Math.imul(ah8, bh6) | 0;
          lo = lo + Math.imul(al7, bl7) | 0;
          mid = mid + Math.imul(al7, bh7) | 0;
          mid = mid + Math.imul(ah7, bl7) | 0;
          hi = hi + Math.imul(ah7, bh7) | 0;
          lo = lo + Math.imul(al6, bl8) | 0;
          mid = mid + Math.imul(al6, bh8) | 0;
          mid = mid + Math.imul(ah6, bl8) | 0;
          hi = hi + Math.imul(ah6, bh8) | 0;
          lo = lo + Math.imul(al5, bl9) | 0;
          mid = mid + Math.imul(al5, bh9) | 0;
          mid = mid + Math.imul(ah5, bl9) | 0;
          hi = hi + Math.imul(ah5, bh9) | 0;
          var w14 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w14 >>> 26) | 0;
          w14 &= 67108863;
          lo = Math.imul(al9, bl6);
          mid = Math.imul(al9, bh6);
          mid = mid + Math.imul(ah9, bl6) | 0;
          hi = Math.imul(ah9, bh6);
          lo = lo + Math.imul(al8, bl7) | 0;
          mid = mid + Math.imul(al8, bh7) | 0;
          mid = mid + Math.imul(ah8, bl7) | 0;
          hi = hi + Math.imul(ah8, bh7) | 0;
          lo = lo + Math.imul(al7, bl8) | 0;
          mid = mid + Math.imul(al7, bh8) | 0;
          mid = mid + Math.imul(ah7, bl8) | 0;
          hi = hi + Math.imul(ah7, bh8) | 0;
          lo = lo + Math.imul(al6, bl9) | 0;
          mid = mid + Math.imul(al6, bh9) | 0;
          mid = mid + Math.imul(ah6, bl9) | 0;
          hi = hi + Math.imul(ah6, bh9) | 0;
          var w15 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w15 >>> 26) | 0;
          w15 &= 67108863;
          lo = Math.imul(al9, bl7);
          mid = Math.imul(al9, bh7);
          mid = mid + Math.imul(ah9, bl7) | 0;
          hi = Math.imul(ah9, bh7);
          lo = lo + Math.imul(al8, bl8) | 0;
          mid = mid + Math.imul(al8, bh8) | 0;
          mid = mid + Math.imul(ah8, bl8) | 0;
          hi = hi + Math.imul(ah8, bh8) | 0;
          lo = lo + Math.imul(al7, bl9) | 0;
          mid = mid + Math.imul(al7, bh9) | 0;
          mid = mid + Math.imul(ah7, bl9) | 0;
          hi = hi + Math.imul(ah7, bh9) | 0;
          var w16 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w16 >>> 26) | 0;
          w16 &= 67108863;
          lo = Math.imul(al9, bl8);
          mid = Math.imul(al9, bh8);
          mid = mid + Math.imul(ah9, bl8) | 0;
          hi = Math.imul(ah9, bh8);
          lo = lo + Math.imul(al8, bl9) | 0;
          mid = mid + Math.imul(al8, bh9) | 0;
          mid = mid + Math.imul(ah8, bl9) | 0;
          hi = hi + Math.imul(ah8, bh9) | 0;
          var w17 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w17 >>> 26) | 0;
          w17 &= 67108863;
          lo = Math.imul(al9, bl9);
          mid = Math.imul(al9, bh9);
          mid = mid + Math.imul(ah9, bl9) | 0;
          hi = Math.imul(ah9, bh9);
          var w18 = (c + lo | 0) + ((mid & 8191) << 13) | 0;
          c = (hi + (mid >>> 13) | 0) + (w18 >>> 26) | 0;
          w18 &= 67108863;
          o[0] = w0;
          o[1] = w1;
          o[2] = w2;
          o[3] = w3;
          o[4] = w4;
          o[5] = w5;
          o[6] = w6;
          o[7] = w7;
          o[8] = w8;
          o[9] = w9;
          o[10] = w10;
          o[11] = w11;
          o[12] = w12;
          o[13] = w13;
          o[14] = w14;
          o[15] = w15;
          o[16] = w16;
          o[17] = w17;
          o[18] = w18;
          if (c !== 0) {
            o[19] = c;
            out.length++;
          }
          return out;
        };
        if (!Math.imul) {
          comb10MulTo = smallMulTo;
        }
        function bigMulTo(self2, num, out) {
          out.negative = num.negative ^ self2.negative;
          out.length = self2.length + num.length;
          var carry = 0;
          var hncarry = 0;
          for (var k = 0; k < out.length - 1; k++) {
            var ncarry = hncarry;
            hncarry = 0;
            var rword = carry & 67108863;
            var maxJ = Math.min(k, num.length - 1);
            for (var j = Math.max(0, k - self2.length + 1); j <= maxJ; j++) {
              var i = k - j;
              var a = self2.words[i] | 0;
              var b = num.words[j] | 0;
              var r = a * b;
              var lo = r & 67108863;
              ncarry = ncarry + (r / 67108864 | 0) | 0;
              lo = lo + rword | 0;
              rword = lo & 67108863;
              ncarry = ncarry + (lo >>> 26) | 0;
              hncarry += ncarry >>> 26;
              ncarry &= 67108863;
            }
            out.words[k] = rword;
            carry = ncarry;
            ncarry = hncarry;
          }
          if (carry !== 0) {
            out.words[k] = carry;
          } else {
            out.length--;
          }
          return out.strip();
        }
        function jumboMulTo(self2, num, out) {
          var fftm = new FFTM();
          return fftm.mulp(self2, num, out);
        }
        BN2.prototype.mulTo = function mulTo(num, out) {
          var res;
          var len = this.length + num.length;
          if (this.length === 10 && num.length === 10) {
            res = comb10MulTo(this, num, out);
          } else if (len < 63) {
            res = smallMulTo(this, num, out);
          } else if (len < 1024) {
            res = bigMulTo(this, num, out);
          } else {
            res = jumboMulTo(this, num, out);
          }
          return res;
        };
        function FFTM(x, y) {
          this.x = x;
          this.y = y;
        }
        FFTM.prototype.makeRBT = function makeRBT(N) {
          var t = new Array(N);
          var l = BN2.prototype._countBits(N) - 1;
          for (var i = 0; i < N; i++) {
            t[i] = this.revBin(i, l, N);
          }
          return t;
        };
        FFTM.prototype.revBin = function revBin(x, l, N) {
          if (x === 0 || x === N - 1)
            return x;
          var rb = 0;
          for (var i = 0; i < l; i++) {
            rb |= (x & 1) << l - i - 1;
            x >>= 1;
          }
          return rb;
        };
        FFTM.prototype.permute = function permute(rbt, rws, iws, rtws, itws, N) {
          for (var i = 0; i < N; i++) {
            rtws[i] = rws[rbt[i]];
            itws[i] = iws[rbt[i]];
          }
        };
        FFTM.prototype.transform = function transform(rws, iws, rtws, itws, N, rbt) {
          this.permute(rbt, rws, iws, rtws, itws, N);
          for (var s = 1; s < N; s <<= 1) {
            var l = s << 1;
            var rtwdf = Math.cos(2 * Math.PI / l);
            var itwdf = Math.sin(2 * Math.PI / l);
            for (var p = 0; p < N; p += l) {
              var rtwdf_ = rtwdf;
              var itwdf_ = itwdf;
              for (var j = 0; j < s; j++) {
                var re = rtws[p + j];
                var ie = itws[p + j];
                var ro = rtws[p + j + s];
                var io = itws[p + j + s];
                var rx = rtwdf_ * ro - itwdf_ * io;
                io = rtwdf_ * io + itwdf_ * ro;
                ro = rx;
                rtws[p + j] = re + ro;
                itws[p + j] = ie + io;
                rtws[p + j + s] = re - ro;
                itws[p + j + s] = ie - io;
                if (j !== l) {
                  rx = rtwdf * rtwdf_ - itwdf * itwdf_;
                  itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
                  rtwdf_ = rx;
                }
              }
            }
          }
        };
        FFTM.prototype.guessLen13b = function guessLen13b(n, m) {
          var N = Math.max(m, n) | 1;
          var odd = N & 1;
          var i = 0;
          for (N = N / 2 | 0; N; N = N >>> 1) {
            i++;
          }
          return 1 << i + 1 + odd;
        };
        FFTM.prototype.conjugate = function conjugate(rws, iws, N) {
          if (N <= 1)
            return;
          for (var i = 0; i < N / 2; i++) {
            var t = rws[i];
            rws[i] = rws[N - i - 1];
            rws[N - i - 1] = t;
            t = iws[i];
            iws[i] = -iws[N - i - 1];
            iws[N - i - 1] = -t;
          }
        };
        FFTM.prototype.normalize13b = function normalize13b(ws, N) {
          var carry = 0;
          for (var i = 0; i < N / 2; i++) {
            var w = Math.round(ws[2 * i + 1] / N) * 8192 + Math.round(ws[2 * i] / N) + carry;
            ws[i] = w & 67108863;
            if (w < 67108864) {
              carry = 0;
            } else {
              carry = w / 67108864 | 0;
            }
          }
          return ws;
        };
        FFTM.prototype.convert13b = function convert13b(ws, len, rws, N) {
          var carry = 0;
          for (var i = 0; i < len; i++) {
            carry = carry + (ws[i] | 0);
            rws[2 * i] = carry & 8191;
            carry = carry >>> 13;
            rws[2 * i + 1] = carry & 8191;
            carry = carry >>> 13;
          }
          for (i = 2 * len; i < N; ++i) {
            rws[i] = 0;
          }
          assert3(carry === 0);
          assert3((carry & ~8191) === 0);
        };
        FFTM.prototype.stub = function stub(N) {
          var ph = new Array(N);
          for (var i = 0; i < N; i++) {
            ph[i] = 0;
          }
          return ph;
        };
        FFTM.prototype.mulp = function mulp(x, y, out) {
          var N = 2 * this.guessLen13b(x.length, y.length);
          var rbt = this.makeRBT(N);
          var _ = this.stub(N);
          var rws = new Array(N);
          var rwst = new Array(N);
          var iwst = new Array(N);
          var nrws = new Array(N);
          var nrwst = new Array(N);
          var niwst = new Array(N);
          var rmws = out.words;
          rmws.length = N;
          this.convert13b(x.words, x.length, rws, N);
          this.convert13b(y.words, y.length, nrws, N);
          this.transform(rws, _, rwst, iwst, N, rbt);
          this.transform(nrws, _, nrwst, niwst, N, rbt);
          for (var i = 0; i < N; i++) {
            var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
            iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
            rwst[i] = rx;
          }
          this.conjugate(rwst, iwst, N);
          this.transform(rwst, iwst, rmws, _, N, rbt);
          this.conjugate(rmws, _, N);
          this.normalize13b(rmws, N);
          out.negative = x.negative ^ y.negative;
          out.length = x.length + y.length;
          return out.strip();
        };
        BN2.prototype.mul = function mul(num) {
          var out = new BN2(null);
          out.words = new Array(this.length + num.length);
          return this.mulTo(num, out);
        };
        BN2.prototype.mulf = function mulf(num) {
          var out = new BN2(null);
          out.words = new Array(this.length + num.length);
          return jumboMulTo(this, num, out);
        };
        BN2.prototype.imul = function imul(num) {
          return this.clone().mulTo(num, this);
        };
        BN2.prototype.imuln = function imuln(num) {
          assert3(typeof num === "number");
          assert3(num < 67108864);
          var carry = 0;
          for (var i = 0; i < this.length; i++) {
            var w = (this.words[i] | 0) * num;
            var lo = (w & 67108863) + (carry & 67108863);
            carry >>= 26;
            carry += w / 67108864 | 0;
            carry += lo >>> 26;
            this.words[i] = lo & 67108863;
          }
          if (carry !== 0) {
            this.words[i] = carry;
            this.length++;
          }
          return this;
        };
        BN2.prototype.muln = function muln(num) {
          return this.clone().imuln(num);
        };
        BN2.prototype.sqr = function sqr() {
          return this.mul(this);
        };
        BN2.prototype.isqr = function isqr() {
          return this.imul(this.clone());
        };
        BN2.prototype.pow = function pow(num) {
          var w = toBitArray(num);
          if (w.length === 0)
            return new BN2(1);
          var res = this;
          for (var i = 0; i < w.length; i++, res = res.sqr()) {
            if (w[i] !== 0)
              break;
          }
          if (++i < w.length) {
            for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
              if (w[i] === 0)
                continue;
              res = res.mul(q);
            }
          }
          return res;
        };
        BN2.prototype.iushln = function iushln(bits) {
          assert3(typeof bits === "number" && bits >= 0);
          var r = bits % 26;
          var s = (bits - r) / 26;
          var carryMask = 67108863 >>> 26 - r << 26 - r;
          var i;
          if (r !== 0) {
            var carry = 0;
            for (i = 0; i < this.length; i++) {
              var newCarry = this.words[i] & carryMask;
              var c = (this.words[i] | 0) - newCarry << r;
              this.words[i] = c | carry;
              carry = newCarry >>> 26 - r;
            }
            if (carry) {
              this.words[i] = carry;
              this.length++;
            }
          }
          if (s !== 0) {
            for (i = this.length - 1; i >= 0; i--) {
              this.words[i + s] = this.words[i];
            }
            for (i = 0; i < s; i++) {
              this.words[i] = 0;
            }
            this.length += s;
          }
          return this.strip();
        };
        BN2.prototype.ishln = function ishln(bits) {
          assert3(this.negative === 0);
          return this.iushln(bits);
        };
        BN2.prototype.iushrn = function iushrn(bits, hint, extended) {
          assert3(typeof bits === "number" && bits >= 0);
          var h;
          if (hint) {
            h = (hint - hint % 26) / 26;
          } else {
            h = 0;
          }
          var r = bits % 26;
          var s = Math.min((bits - r) / 26, this.length);
          var mask2 = 67108863 ^ 67108863 >>> r << r;
          var maskedWords = extended;
          h -= s;
          h = Math.max(0, h);
          if (maskedWords) {
            for (var i = 0; i < s; i++) {
              maskedWords.words[i] = this.words[i];
            }
            maskedWords.length = s;
          }
          if (s === 0) {
          } else if (this.length > s) {
            this.length -= s;
            for (i = 0; i < this.length; i++) {
              this.words[i] = this.words[i + s];
            }
          } else {
            this.words[0] = 0;
            this.length = 1;
          }
          var carry = 0;
          for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
            var word = this.words[i] | 0;
            this.words[i] = carry << 26 - r | word >>> r;
            carry = word & mask2;
          }
          if (maskedWords && carry !== 0) {
            maskedWords.words[maskedWords.length++] = carry;
          }
          if (this.length === 0) {
            this.words[0] = 0;
            this.length = 1;
          }
          return this.strip();
        };
        BN2.prototype.ishrn = function ishrn(bits, hint, extended) {
          assert3(this.negative === 0);
          return this.iushrn(bits, hint, extended);
        };
        BN2.prototype.shln = function shln(bits) {
          return this.clone().ishln(bits);
        };
        BN2.prototype.ushln = function ushln(bits) {
          return this.clone().iushln(bits);
        };
        BN2.prototype.shrn = function shrn(bits) {
          return this.clone().ishrn(bits);
        };
        BN2.prototype.ushrn = function ushrn(bits) {
          return this.clone().iushrn(bits);
        };
        BN2.prototype.testn = function testn(bit) {
          assert3(typeof bit === "number" && bit >= 0);
          var r = bit % 26;
          var s = (bit - r) / 26;
          var q = 1 << r;
          if (this.length <= s)
            return false;
          var w = this.words[s];
          return !!(w & q);
        };
        BN2.prototype.imaskn = function imaskn(bits) {
          assert3(typeof bits === "number" && bits >= 0);
          var r = bits % 26;
          var s = (bits - r) / 26;
          assert3(this.negative === 0, "imaskn works only with positive numbers");
          if (this.length <= s) {
            return this;
          }
          if (r !== 0) {
            s++;
          }
          this.length = Math.min(s, this.length);
          if (r !== 0) {
            var mask2 = 67108863 ^ 67108863 >>> r << r;
            this.words[this.length - 1] &= mask2;
          }
          return this.strip();
        };
        BN2.prototype.maskn = function maskn(bits) {
          return this.clone().imaskn(bits);
        };
        BN2.prototype.iaddn = function iaddn(num) {
          assert3(typeof num === "number");
          assert3(num < 67108864);
          if (num < 0)
            return this.isubn(-num);
          if (this.negative !== 0) {
            if (this.length === 1 && (this.words[0] | 0) < num) {
              this.words[0] = num - (this.words[0] | 0);
              this.negative = 0;
              return this;
            }
            this.negative = 0;
            this.isubn(num);
            this.negative = 1;
            return this;
          }
          return this._iaddn(num);
        };
        BN2.prototype._iaddn = function _iaddn(num) {
          this.words[0] += num;
          for (var i = 0; i < this.length && this.words[i] >= 67108864; i++) {
            this.words[i] -= 67108864;
            if (i === this.length - 1) {
              this.words[i + 1] = 1;
            } else {
              this.words[i + 1]++;
            }
          }
          this.length = Math.max(this.length, i + 1);
          return this;
        };
        BN2.prototype.isubn = function isubn(num) {
          assert3(typeof num === "number");
          assert3(num < 67108864);
          if (num < 0)
            return this.iaddn(-num);
          if (this.negative !== 0) {
            this.negative = 0;
            this.iaddn(num);
            this.negative = 1;
            return this;
          }
          this.words[0] -= num;
          if (this.length === 1 && this.words[0] < 0) {
            this.words[0] = -this.words[0];
            this.negative = 1;
          } else {
            for (var i = 0; i < this.length && this.words[i] < 0; i++) {
              this.words[i] += 67108864;
              this.words[i + 1] -= 1;
            }
          }
          return this.strip();
        };
        BN2.prototype.addn = function addn(num) {
          return this.clone().iaddn(num);
        };
        BN2.prototype.subn = function subn(num) {
          return this.clone().isubn(num);
        };
        BN2.prototype.iabs = function iabs() {
          this.negative = 0;
          return this;
        };
        BN2.prototype.abs = function abs() {
          return this.clone().iabs();
        };
        BN2.prototype._ishlnsubmul = function _ishlnsubmul(num, mul, shift) {
          var len = num.length + shift;
          var i;
          this._expand(len);
          var w;
          var carry = 0;
          for (i = 0; i < num.length; i++) {
            w = (this.words[i + shift] | 0) + carry;
            var right = (num.words[i] | 0) * mul;
            w -= right & 67108863;
            carry = (w >> 26) - (right / 67108864 | 0);
            this.words[i + shift] = w & 67108863;
          }
          for (; i < this.length - shift; i++) {
            w = (this.words[i + shift] | 0) + carry;
            carry = w >> 26;
            this.words[i + shift] = w & 67108863;
          }
          if (carry === 0)
            return this.strip();
          assert3(carry === -1);
          carry = 0;
          for (i = 0; i < this.length; i++) {
            w = -(this.words[i] | 0) + carry;
            carry = w >> 26;
            this.words[i] = w & 67108863;
          }
          this.negative = 1;
          return this.strip();
        };
        BN2.prototype._wordDiv = function _wordDiv(num, mode) {
          var shift = this.length - num.length;
          var a = this.clone();
          var b = num;
          var bhi = b.words[b.length - 1] | 0;
          var bhiBits = this._countBits(bhi);
          shift = 26 - bhiBits;
          if (shift !== 0) {
            b = b.ushln(shift);
            a.iushln(shift);
            bhi = b.words[b.length - 1] | 0;
          }
          var m = a.length - b.length;
          var q;
          if (mode !== "mod") {
            q = new BN2(null);
            q.length = m + 1;
            q.words = new Array(q.length);
            for (var i = 0; i < q.length; i++) {
              q.words[i] = 0;
            }
          }
          var diff = a.clone()._ishlnsubmul(b, 1, m);
          if (diff.negative === 0) {
            a = diff;
            if (q) {
              q.words[m] = 1;
            }
          }
          for (var j = m - 1; j >= 0; j--) {
            var qj = (a.words[b.length + j] | 0) * 67108864 + (a.words[b.length + j - 1] | 0);
            qj = Math.min(qj / bhi | 0, 67108863);
            a._ishlnsubmul(b, qj, j);
            while (a.negative !== 0) {
              qj--;
              a.negative = 0;
              a._ishlnsubmul(b, 1, j);
              if (!a.isZero()) {
                a.negative ^= 1;
              }
            }
            if (q) {
              q.words[j] = qj;
            }
          }
          if (q) {
            q.strip();
          }
          a.strip();
          if (mode !== "div" && shift !== 0) {
            a.iushrn(shift);
          }
          return {
            div: q || null,
            mod: a
          };
        };
        BN2.prototype.divmod = function divmod(num, mode, positive) {
          assert3(!num.isZero());
          if (this.isZero()) {
            return {
              div: new BN2(0),
              mod: new BN2(0)
            };
          }
          var div, mod, res;
          if (this.negative !== 0 && num.negative === 0) {
            res = this.neg().divmod(num, mode);
            if (mode !== "mod") {
              div = res.div.neg();
            }
            if (mode !== "div") {
              mod = res.mod.neg();
              if (positive && mod.negative !== 0) {
                mod.iadd(num);
              }
            }
            return {
              div,
              mod
            };
          }
          if (this.negative === 0 && num.negative !== 0) {
            res = this.divmod(num.neg(), mode);
            if (mode !== "mod") {
              div = res.div.neg();
            }
            return {
              div,
              mod: res.mod
            };
          }
          if ((this.negative & num.negative) !== 0) {
            res = this.neg().divmod(num.neg(), mode);
            if (mode !== "div") {
              mod = res.mod.neg();
              if (positive && mod.negative !== 0) {
                mod.isub(num);
              }
            }
            return {
              div: res.div,
              mod
            };
          }
          if (num.length > this.length || this.cmp(num) < 0) {
            return {
              div: new BN2(0),
              mod: this
            };
          }
          if (num.length === 1) {
            if (mode === "div") {
              return {
                div: this.divn(num.words[0]),
                mod: null
              };
            }
            if (mode === "mod") {
              return {
                div: null,
                mod: new BN2(this.modn(num.words[0]))
              };
            }
            return {
              div: this.divn(num.words[0]),
              mod: new BN2(this.modn(num.words[0]))
            };
          }
          return this._wordDiv(num, mode);
        };
        BN2.prototype.div = function div(num) {
          return this.divmod(num, "div", false).div;
        };
        BN2.prototype.mod = function mod(num) {
          return this.divmod(num, "mod", false).mod;
        };
        BN2.prototype.umod = function umod(num) {
          return this.divmod(num, "mod", true).mod;
        };
        BN2.prototype.divRound = function divRound(num) {
          var dm = this.divmod(num);
          if (dm.mod.isZero())
            return dm.div;
          var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;
          var half = num.ushrn(1);
          var r2 = num.andln(1);
          var cmp = mod.cmp(half);
          if (cmp < 0 || r2 === 1 && cmp === 0)
            return dm.div;
          return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
        };
        BN2.prototype.modn = function modn(num) {
          assert3(num <= 67108863);
          var p = (1 << 26) % num;
          var acc = 0;
          for (var i = this.length - 1; i >= 0; i--) {
            acc = (p * acc + (this.words[i] | 0)) % num;
          }
          return acc;
        };
        BN2.prototype.idivn = function idivn(num) {
          assert3(num <= 67108863);
          var carry = 0;
          for (var i = this.length - 1; i >= 0; i--) {
            var w = (this.words[i] | 0) + carry * 67108864;
            this.words[i] = w / num | 0;
            carry = w % num;
          }
          return this.strip();
        };
        BN2.prototype.divn = function divn(num) {
          return this.clone().idivn(num);
        };
        BN2.prototype.egcd = function egcd(p) {
          assert3(p.negative === 0);
          assert3(!p.isZero());
          var x = this;
          var y = p.clone();
          if (x.negative !== 0) {
            x = x.umod(p);
          } else {
            x = x.clone();
          }
          var A = new BN2(1);
          var B = new BN2(0);
          var C = new BN2(0);
          var D = new BN2(1);
          var g = 0;
          while (x.isEven() && y.isEven()) {
            x.iushrn(1);
            y.iushrn(1);
            ++g;
          }
          var yp = y.clone();
          var xp = x.clone();
          while (!x.isZero()) {
            for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1)
              ;
            if (i > 0) {
              x.iushrn(i);
              while (i-- > 0) {
                if (A.isOdd() || B.isOdd()) {
                  A.iadd(yp);
                  B.isub(xp);
                }
                A.iushrn(1);
                B.iushrn(1);
              }
            }
            for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
              ;
            if (j > 0) {
              y.iushrn(j);
              while (j-- > 0) {
                if (C.isOdd() || D.isOdd()) {
                  C.iadd(yp);
                  D.isub(xp);
                }
                C.iushrn(1);
                D.iushrn(1);
              }
            }
            if (x.cmp(y) >= 0) {
              x.isub(y);
              A.isub(C);
              B.isub(D);
            } else {
              y.isub(x);
              C.isub(A);
              D.isub(B);
            }
          }
          return {
            a: C,
            b: D,
            gcd: y.iushln(g)
          };
        };
        BN2.prototype._invmp = function _invmp(p) {
          assert3(p.negative === 0);
          assert3(!p.isZero());
          var a = this;
          var b = p.clone();
          if (a.negative !== 0) {
            a = a.umod(p);
          } else {
            a = a.clone();
          }
          var x1 = new BN2(1);
          var x2 = new BN2(0);
          var delta = b.clone();
          while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
            for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1)
              ;
            if (i > 0) {
              a.iushrn(i);
              while (i-- > 0) {
                if (x1.isOdd()) {
                  x1.iadd(delta);
                }
                x1.iushrn(1);
              }
            }
            for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1)
              ;
            if (j > 0) {
              b.iushrn(j);
              while (j-- > 0) {
                if (x2.isOdd()) {
                  x2.iadd(delta);
                }
                x2.iushrn(1);
              }
            }
            if (a.cmp(b) >= 0) {
              a.isub(b);
              x1.isub(x2);
            } else {
              b.isub(a);
              x2.isub(x1);
            }
          }
          var res;
          if (a.cmpn(1) === 0) {
            res = x1;
          } else {
            res = x2;
          }
          if (res.cmpn(0) < 0) {
            res.iadd(p);
          }
          return res;
        };
        BN2.prototype.gcd = function gcd(num) {
          if (this.isZero())
            return num.abs();
          if (num.isZero())
            return this.abs();
          var a = this.clone();
          var b = num.clone();
          a.negative = 0;
          b.negative = 0;
          for (var shift = 0; a.isEven() && b.isEven(); shift++) {
            a.iushrn(1);
            b.iushrn(1);
          }
          do {
            while (a.isEven()) {
              a.iushrn(1);
            }
            while (b.isEven()) {
              b.iushrn(1);
            }
            var r = a.cmp(b);
            if (r < 0) {
              var t = a;
              a = b;
              b = t;
            } else if (r === 0 || b.cmpn(1) === 0) {
              break;
            }
            a.isub(b);
          } while (true);
          return b.iushln(shift);
        };
        BN2.prototype.invm = function invm(num) {
          return this.egcd(num).a.umod(num);
        };
        BN2.prototype.isEven = function isEven() {
          return (this.words[0] & 1) === 0;
        };
        BN2.prototype.isOdd = function isOdd() {
          return (this.words[0] & 1) === 1;
        };
        BN2.prototype.andln = function andln(num) {
          return this.words[0] & num;
        };
        BN2.prototype.bincn = function bincn(bit) {
          assert3(typeof bit === "number");
          var r = bit % 26;
          var s = (bit - r) / 26;
          var q = 1 << r;
          if (this.length <= s) {
            this._expand(s + 1);
            this.words[s] |= q;
            return this;
          }
          var carry = q;
          for (var i = s; carry !== 0 && i < this.length; i++) {
            var w = this.words[i] | 0;
            w += carry;
            carry = w >>> 26;
            w &= 67108863;
            this.words[i] = w;
          }
          if (carry !== 0) {
            this.words[i] = carry;
            this.length++;
          }
          return this;
        };
        BN2.prototype.isZero = function isZero() {
          return this.length === 1 && this.words[0] === 0;
        };
        BN2.prototype.cmpn = function cmpn(num) {
          var negative = num < 0;
          if (this.negative !== 0 && !negative)
            return -1;
          if (this.negative === 0 && negative)
            return 1;
          this.strip();
          var res;
          if (this.length > 1) {
            res = 1;
          } else {
            if (negative) {
              num = -num;
            }
            assert3(num <= 67108863, "Number is too big");
            var w = this.words[0] | 0;
            res = w === num ? 0 : w < num ? -1 : 1;
          }
          if (this.negative !== 0)
            return -res | 0;
          return res;
        };
        BN2.prototype.cmp = function cmp(num) {
          if (this.negative !== 0 && num.negative === 0)
            return -1;
          if (this.negative === 0 && num.negative !== 0)
            return 1;
          var res = this.ucmp(num);
          if (this.negative !== 0)
            return -res | 0;
          return res;
        };
        BN2.prototype.ucmp = function ucmp(num) {
          if (this.length > num.length)
            return 1;
          if (this.length < num.length)
            return -1;
          var res = 0;
          for (var i = this.length - 1; i >= 0; i--) {
            var a = this.words[i] | 0;
            var b = num.words[i] | 0;
            if (a === b)
              continue;
            if (a < b) {
              res = -1;
            } else if (a > b) {
              res = 1;
            }
            break;
          }
          return res;
        };
        BN2.prototype.gtn = function gtn(num) {
          return this.cmpn(num) === 1;
        };
        BN2.prototype.gt = function gt(num) {
          return this.cmp(num) === 1;
        };
        BN2.prototype.gten = function gten(num) {
          return this.cmpn(num) >= 0;
        };
        BN2.prototype.gte = function gte(num) {
          return this.cmp(num) >= 0;
        };
        BN2.prototype.ltn = function ltn(num) {
          return this.cmpn(num) === -1;
        };
        BN2.prototype.lt = function lt(num) {
          return this.cmp(num) === -1;
        };
        BN2.prototype.lten = function lten(num) {
          return this.cmpn(num) <= 0;
        };
        BN2.prototype.lte = function lte(num) {
          return this.cmp(num) <= 0;
        };
        BN2.prototype.eqn = function eqn(num) {
          return this.cmpn(num) === 0;
        };
        BN2.prototype.eq = function eq(num) {
          return this.cmp(num) === 0;
        };
        BN2.red = function red(num) {
          return new Red(num);
        };
        BN2.prototype.toRed = function toRed(ctx) {
          assert3(!this.red, "Already a number in reduction context");
          assert3(this.negative === 0, "red works only with positives");
          return ctx.convertTo(this)._forceRed(ctx);
        };
        BN2.prototype.fromRed = function fromRed() {
          assert3(this.red, "fromRed works only with numbers in reduction context");
          return this.red.convertFrom(this);
        };
        BN2.prototype._forceRed = function _forceRed(ctx) {
          this.red = ctx;
          return this;
        };
        BN2.prototype.forceRed = function forceRed(ctx) {
          assert3(!this.red, "Already a number in reduction context");
          return this._forceRed(ctx);
        };
        BN2.prototype.redAdd = function redAdd(num) {
          assert3(this.red, "redAdd works only with red numbers");
          return this.red.add(this, num);
        };
        BN2.prototype.redIAdd = function redIAdd(num) {
          assert3(this.red, "redIAdd works only with red numbers");
          return this.red.iadd(this, num);
        };
        BN2.prototype.redSub = function redSub(num) {
          assert3(this.red, "redSub works only with red numbers");
          return this.red.sub(this, num);
        };
        BN2.prototype.redISub = function redISub(num) {
          assert3(this.red, "redISub works only with red numbers");
          return this.red.isub(this, num);
        };
        BN2.prototype.redShl = function redShl(num) {
          assert3(this.red, "redShl works only with red numbers");
          return this.red.shl(this, num);
        };
        BN2.prototype.redMul = function redMul(num) {
          assert3(this.red, "redMul works only with red numbers");
          this.red._verify2(this, num);
          return this.red.mul(this, num);
        };
        BN2.prototype.redIMul = function redIMul(num) {
          assert3(this.red, "redMul works only with red numbers");
          this.red._verify2(this, num);
          return this.red.imul(this, num);
        };
        BN2.prototype.redSqr = function redSqr() {
          assert3(this.red, "redSqr works only with red numbers");
          this.red._verify1(this);
          return this.red.sqr(this);
        };
        BN2.prototype.redISqr = function redISqr() {
          assert3(this.red, "redISqr works only with red numbers");
          this.red._verify1(this);
          return this.red.isqr(this);
        };
        BN2.prototype.redSqrt = function redSqrt() {
          assert3(this.red, "redSqrt works only with red numbers");
          this.red._verify1(this);
          return this.red.sqrt(this);
        };
        BN2.prototype.redInvm = function redInvm() {
          assert3(this.red, "redInvm works only with red numbers");
          this.red._verify1(this);
          return this.red.invm(this);
        };
        BN2.prototype.redNeg = function redNeg() {
          assert3(this.red, "redNeg works only with red numbers");
          this.red._verify1(this);
          return this.red.neg(this);
        };
        BN2.prototype.redPow = function redPow(num) {
          assert3(this.red && !num.red, "redPow(normalNum)");
          this.red._verify1(this);
          return this.red.pow(this, num);
        };
        var primes = {
          k256: null,
          p224: null,
          p192: null,
          p25519: null
        };
        function MPrime(name, p) {
          this.name = name;
          this.p = new BN2(p, 16);
          this.n = this.p.bitLength();
          this.k = new BN2(1).iushln(this.n).isub(this.p);
          this.tmp = this._tmp();
        }
        MPrime.prototype._tmp = function _tmp() {
          var tmp = new BN2(null);
          tmp.words = new Array(Math.ceil(this.n / 13));
          return tmp;
        };
        MPrime.prototype.ireduce = function ireduce(num) {
          var r = num;
          var rlen;
          do {
            this.split(r, this.tmp);
            r = this.imulK(r);
            r = r.iadd(this.tmp);
            rlen = r.bitLength();
          } while (rlen > this.n);
          var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
          if (cmp === 0) {
            r.words[0] = 0;
            r.length = 1;
          } else if (cmp > 0) {
            r.isub(this.p);
          } else {
            if (r.strip !== void 0) {
              r.strip();
            } else {
              r._strip();
            }
          }
          return r;
        };
        MPrime.prototype.split = function split2(input, out) {
          input.iushrn(this.n, 0, out);
        };
        MPrime.prototype.imulK = function imulK(num) {
          return num.imul(this.k);
        };
        function K256() {
          MPrime.call(
            this,
            "k256",
            "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
          );
        }
        inherits(K256, MPrime);
        K256.prototype.split = function split2(input, output2) {
          var mask2 = 4194303;
          var outLen = Math.min(input.length, 9);
          for (var i = 0; i < outLen; i++) {
            output2.words[i] = input.words[i];
          }
          output2.length = outLen;
          if (input.length <= 9) {
            input.words[0] = 0;
            input.length = 1;
            return;
          }
          var prev = input.words[9];
          output2.words[output2.length++] = prev & mask2;
          for (i = 10; i < input.length; i++) {
            var next = input.words[i] | 0;
            input.words[i - 10] = (next & mask2) << 4 | prev >>> 22;
            prev = next;
          }
          prev >>>= 22;
          input.words[i - 10] = prev;
          if (prev === 0 && input.length > 10) {
            input.length -= 10;
          } else {
            input.length -= 9;
          }
        };
        K256.prototype.imulK = function imulK(num) {
          num.words[num.length] = 0;
          num.words[num.length + 1] = 0;
          num.length += 2;
          var lo = 0;
          for (var i = 0; i < num.length; i++) {
            var w = num.words[i] | 0;
            lo += w * 977;
            num.words[i] = lo & 67108863;
            lo = w * 64 + (lo / 67108864 | 0);
          }
          if (num.words[num.length - 1] === 0) {
            num.length--;
            if (num.words[num.length - 1] === 0) {
              num.length--;
            }
          }
          return num;
        };
        function P224() {
          MPrime.call(
            this,
            "p224",
            "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
          );
        }
        inherits(P224, MPrime);
        function P192() {
          MPrime.call(
            this,
            "p192",
            "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
          );
        }
        inherits(P192, MPrime);
        function P25519() {
          MPrime.call(
            this,
            "25519",
            "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
          );
        }
        inherits(P25519, MPrime);
        P25519.prototype.imulK = function imulK(num) {
          var carry = 0;
          for (var i = 0; i < num.length; i++) {
            var hi = (num.words[i] | 0) * 19 + carry;
            var lo = hi & 67108863;
            hi >>>= 26;
            num.words[i] = lo;
            carry = hi;
          }
          if (carry !== 0) {
            num.words[num.length++] = carry;
          }
          return num;
        };
        BN2._prime = function prime(name) {
          if (primes[name])
            return primes[name];
          var prime2;
          if (name === "k256") {
            prime2 = new K256();
          } else if (name === "p224") {
            prime2 = new P224();
          } else if (name === "p192") {
            prime2 = new P192();
          } else if (name === "p25519") {
            prime2 = new P25519();
          } else {
            throw new Error("Unknown prime " + name);
          }
          primes[name] = prime2;
          return prime2;
        };
        function Red(m) {
          if (typeof m === "string") {
            var prime = BN2._prime(m);
            this.m = prime.p;
            this.prime = prime;
          } else {
            assert3(m.gtn(1), "modulus must be greater than 1");
            this.m = m;
            this.prime = null;
          }
        }
        Red.prototype._verify1 = function _verify1(a) {
          assert3(a.negative === 0, "red works only with positives");
          assert3(a.red, "red works only with red numbers");
        };
        Red.prototype._verify2 = function _verify2(a, b) {
          assert3((a.negative | b.negative) === 0, "red works only with positives");
          assert3(
            a.red && a.red === b.red,
            "red works only with red numbers"
          );
        };
        Red.prototype.imod = function imod(a) {
          if (this.prime)
            return this.prime.ireduce(a)._forceRed(this);
          return a.umod(this.m)._forceRed(this);
        };
        Red.prototype.neg = function neg(a) {
          if (a.isZero()) {
            return a.clone();
          }
          return this.m.sub(a)._forceRed(this);
        };
        Red.prototype.add = function add2(a, b) {
          this._verify2(a, b);
          var res = a.add(b);
          if (res.cmp(this.m) >= 0) {
            res.isub(this.m);
          }
          return res._forceRed(this);
        };
        Red.prototype.iadd = function iadd(a, b) {
          this._verify2(a, b);
          var res = a.iadd(b);
          if (res.cmp(this.m) >= 0) {
            res.isub(this.m);
          }
          return res;
        };
        Red.prototype.sub = function sub(a, b) {
          this._verify2(a, b);
          var res = a.sub(b);
          if (res.cmpn(0) < 0) {
            res.iadd(this.m);
          }
          return res._forceRed(this);
        };
        Red.prototype.isub = function isub(a, b) {
          this._verify2(a, b);
          var res = a.isub(b);
          if (res.cmpn(0) < 0) {
            res.iadd(this.m);
          }
          return res;
        };
        Red.prototype.shl = function shl(a, num) {
          this._verify1(a);
          return this.imod(a.ushln(num));
        };
        Red.prototype.imul = function imul(a, b) {
          this._verify2(a, b);
          return this.imod(a.imul(b));
        };
        Red.prototype.mul = function mul(a, b) {
          this._verify2(a, b);
          return this.imod(a.mul(b));
        };
        Red.prototype.isqr = function isqr(a) {
          return this.imul(a, a.clone());
        };
        Red.prototype.sqr = function sqr(a) {
          return this.mul(a, a);
        };
        Red.prototype.sqrt = function sqrt(a) {
          if (a.isZero())
            return a.clone();
          var mod3 = this.m.andln(3);
          assert3(mod3 % 2 === 1);
          if (mod3 === 3) {
            var pow = this.m.add(new BN2(1)).iushrn(2);
            return this.pow(a, pow);
          }
          var q = this.m.subn(1);
          var s = 0;
          while (!q.isZero() && q.andln(1) === 0) {
            s++;
            q.iushrn(1);
          }
          assert3(!q.isZero());
          var one = new BN2(1).toRed(this);
          var nOne = one.redNeg();
          var lpow = this.m.subn(1).iushrn(1);
          var z = this.m.bitLength();
          z = new BN2(2 * z * z).toRed(this);
          while (this.pow(z, lpow).cmp(nOne) !== 0) {
            z.redIAdd(nOne);
          }
          var c = this.pow(z, q);
          var r = this.pow(a, q.addn(1).iushrn(1));
          var t = this.pow(a, q);
          var m = s;
          while (t.cmp(one) !== 0) {
            var tmp = t;
            for (var i = 0; tmp.cmp(one) !== 0; i++) {
              tmp = tmp.redSqr();
            }
            assert3(i < m);
            var b = this.pow(c, new BN2(1).iushln(m - i - 1));
            r = r.redMul(b);
            c = b.redSqr();
            t = t.redMul(c);
            m = i;
          }
          return r;
        };
        Red.prototype.invm = function invm(a) {
          var inv = a._invmp(this.m);
          if (inv.negative !== 0) {
            inv.negative = 0;
            return this.imod(inv).redNeg();
          } else {
            return this.imod(inv);
          }
        };
        Red.prototype.pow = function pow(a, num) {
          if (num.isZero())
            return new BN2(1).toRed(this);
          if (num.cmpn(1) === 0)
            return a.clone();
          var windowSize = 4;
          var wnd = new Array(1 << windowSize);
          wnd[0] = new BN2(1).toRed(this);
          wnd[1] = a;
          for (var i = 2; i < wnd.length; i++) {
            wnd[i] = this.mul(wnd[i - 1], a);
          }
          var res = wnd[0];
          var current = 0;
          var currentLen = 0;
          var start = num.bitLength() % 26;
          if (start === 0) {
            start = 26;
          }
          for (i = num.length - 1; i >= 0; i--) {
            var word = num.words[i];
            for (var j = start - 1; j >= 0; j--) {
              var bit = word >> j & 1;
              if (res !== wnd[0]) {
                res = this.sqr(res);
              }
              if (bit === 0 && current === 0) {
                currentLen = 0;
                continue;
              }
              current <<= 1;
              current |= bit;
              currentLen++;
              if (currentLen !== windowSize && (i !== 0 || j !== 0))
                continue;
              res = this.mul(res, wnd[current]);
              currentLen = 0;
              current = 0;
            }
            start = 26;
          }
          return res;
        };
        Red.prototype.convertTo = function convertTo(num) {
          var r = num.umod(this.m);
          return r === num ? r.clone() : r;
        };
        Red.prototype.convertFrom = function convertFrom(num) {
          var res = num.clone();
          res.red = null;
          return res;
        };
        BN2.mont = function mont(num) {
          return new Mont(num);
        };
        function Mont(m) {
          Red.call(this, m);
          this.shift = this.m.bitLength();
          if (this.shift % 26 !== 0) {
            this.shift += 26 - this.shift % 26;
          }
          this.r = new BN2(1).iushln(this.shift);
          this.r2 = this.imod(this.r.sqr());
          this.rinv = this.r._invmp(this.m);
          this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
          this.minv = this.minv.umod(this.r);
          this.minv = this.r.sub(this.minv);
        }
        inherits(Mont, Red);
        Mont.prototype.convertTo = function convertTo(num) {
          return this.imod(num.ushln(this.shift));
        };
        Mont.prototype.convertFrom = function convertFrom(num) {
          var r = this.imod(num.mul(this.rinv));
          r.red = null;
          return r;
        };
        Mont.prototype.imul = function imul(a, b) {
          if (a.isZero() || b.isZero()) {
            a.words[0] = 0;
            a.length = 1;
            return a;
          }
          var t = a.imul(b);
          var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
          var u = t.isub(c).iushrn(this.shift);
          var res = u;
          if (u.cmp(this.m) >= 0) {
            res = u.isub(this.m);
          } else if (u.cmpn(0) < 0) {
            res = u.iadd(this.m);
          }
          return res._forceRed(this);
        };
        Mont.prototype.mul = function mul(a, b) {
          if (a.isZero() || b.isZero())
            return new BN2(0)._forceRed(this);
          var t = a.mul(b);
          var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
          var u = t.isub(c).iushrn(this.shift);
          var res = u;
          if (u.cmp(this.m) >= 0) {
            res = u.isub(this.m);
          } else if (u.cmpn(0) < 0) {
            res = u.iadd(this.m);
          }
          return res._forceRed(this);
        };
        Mont.prototype.invm = function invm(a) {
          var res = this.imod(a._invmp(this.m).mul(this.r2));
          return res._forceRed(this);
        };
      })(typeof module2 === "undefined" || module2, exports);
    }
  });

  // ../../node_modules/.pnpm/minimalistic-assert@1.0.1/node_modules/minimalistic-assert/index.js
  var require_minimalistic_assert = __commonJS({
    "../../node_modules/.pnpm/minimalistic-assert@1.0.1/node_modules/minimalistic-assert/index.js"(exports, module2) {
      module2.exports = assert3;
      function assert3(val, msg) {
        if (!val)
          throw new Error(msg || "Assertion failed");
      }
      assert3.equal = function assertEqual(l, r, msg) {
        if (l != r)
          throw new Error(msg || "Assertion failed: " + l + " != " + r);
      };
    }
  });

  // ../../node_modules/.pnpm/minimalistic-crypto-utils@1.0.1/node_modules/minimalistic-crypto-utils/lib/utils.js
  var require_utils = __commonJS({
    "../../node_modules/.pnpm/minimalistic-crypto-utils@1.0.1/node_modules/minimalistic-crypto-utils/lib/utils.js"(exports) {
      "use strict";
      var utils = exports;
      function toArray(msg, enc) {
        if (Array.isArray(msg))
          return msg.slice();
        if (!msg)
          return [];
        var res = [];
        if (typeof msg !== "string") {
          for (var i = 0; i < msg.length; i++)
            res[i] = msg[i] | 0;
          return res;
        }
        if (enc === "hex") {
          msg = msg.replace(/[^a-z0-9]+/ig, "");
          if (msg.length % 2 !== 0)
            msg = "0" + msg;
          for (var i = 0; i < msg.length; i += 2)
            res.push(parseInt(msg[i] + msg[i + 1], 16));
        } else {
          for (var i = 0; i < msg.length; i++) {
            var c = msg.charCodeAt(i);
            var hi = c >> 8;
            var lo = c & 255;
            if (hi)
              res.push(hi, lo);
            else
              res.push(lo);
          }
        }
        return res;
      }
      utils.toArray = toArray;
      function zero2(word) {
        if (word.length === 1)
          return "0" + word;
        else
          return word;
      }
      utils.zero2 = zero2;
      function toHex(msg) {
        var res = "";
        for (var i = 0; i < msg.length; i++)
          res += zero2(msg[i].toString(16));
        return res;
      }
      utils.toHex = toHex;
      utils.encode = function encode(arr, enc) {
        if (enc === "hex")
          return toHex(arr);
        else
          return arr;
      };
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/utils.js
  var require_utils2 = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/utils.js"(exports) {
      "use strict";
      var utils = exports;
      var BN2 = require_bn2();
      var minAssert = require_minimalistic_assert();
      var minUtils = require_utils();
      utils.assert = minAssert;
      utils.toArray = minUtils.toArray;
      utils.zero2 = minUtils.zero2;
      utils.toHex = minUtils.toHex;
      utils.encode = minUtils.encode;
      function getNAF(num, w, bits) {
        var naf = new Array(Math.max(num.bitLength(), bits) + 1);
        naf.fill(0);
        var ws = 1 << w + 1;
        var k = num.clone();
        for (var i = 0; i < naf.length; i++) {
          var z;
          var mod = k.andln(ws - 1);
          if (k.isOdd()) {
            if (mod > (ws >> 1) - 1)
              z = (ws >> 1) - mod;
            else
              z = mod;
            k.isubn(z);
          } else {
            z = 0;
          }
          naf[i] = z;
          k.iushrn(1);
        }
        return naf;
      }
      utils.getNAF = getNAF;
      function getJSF(k1, k2) {
        var jsf = [
          [],
          []
        ];
        k1 = k1.clone();
        k2 = k2.clone();
        var d1 = 0;
        var d2 = 0;
        var m8;
        while (k1.cmpn(-d1) > 0 || k2.cmpn(-d2) > 0) {
          var m14 = k1.andln(3) + d1 & 3;
          var m24 = k2.andln(3) + d2 & 3;
          if (m14 === 3)
            m14 = -1;
          if (m24 === 3)
            m24 = -1;
          var u1;
          if ((m14 & 1) === 0) {
            u1 = 0;
          } else {
            m8 = k1.andln(7) + d1 & 7;
            if ((m8 === 3 || m8 === 5) && m24 === 2)
              u1 = -m14;
            else
              u1 = m14;
          }
          jsf[0].push(u1);
          var u2;
          if ((m24 & 1) === 0) {
            u2 = 0;
          } else {
            m8 = k2.andln(7) + d2 & 7;
            if ((m8 === 3 || m8 === 5) && m14 === 2)
              u2 = -m24;
            else
              u2 = m24;
          }
          jsf[1].push(u2);
          if (2 * d1 === u1 + 1)
            d1 = 1 - d1;
          if (2 * d2 === u2 + 1)
            d2 = 1 - d2;
          k1.iushrn(1);
          k2.iushrn(1);
        }
        return jsf;
      }
      utils.getJSF = getJSF;
      function cachedProperty(obj, name, computer) {
        var key = "_" + name;
        obj.prototype[name] = function cachedProperty2() {
          return this[key] !== void 0 ? this[key] : this[key] = computer.call(this);
        };
      }
      utils.cachedProperty = cachedProperty;
      function parseBytes(bytes2) {
        return typeof bytes2 === "string" ? utils.toArray(bytes2, "hex") : bytes2;
      }
      utils.parseBytes = parseBytes;
      function intFromLE(bytes2) {
        return new BN2(bytes2, "hex", "le");
      }
      utils.intFromLE = intFromLE;
    }
  });

  // ../../node_modules/.pnpm/brorand@1.1.0/node_modules/brorand/index.js
  var require_brorand = __commonJS({
    "../../node_modules/.pnpm/brorand@1.1.0/node_modules/brorand/index.js"(exports, module2) {
      var r;
      module2.exports = function rand(len) {
        if (!r)
          r = new Rand(null);
        return r.generate(len);
      };
      function Rand(rand) {
        this.rand = rand;
      }
      module2.exports.Rand = Rand;
      Rand.prototype.generate = function generate(len) {
        return this._rand(len);
      };
      Rand.prototype._rand = function _rand(n) {
        if (this.rand.getBytes)
          return this.rand.getBytes(n);
        var res = new Uint8Array(n);
        for (var i = 0; i < res.length; i++)
          res[i] = this.rand.getByte();
        return res;
      };
      if (typeof self === "object") {
        if (self.crypto && self.crypto.getRandomValues) {
          Rand.prototype._rand = function _rand(n) {
            var arr = new Uint8Array(n);
            self.crypto.getRandomValues(arr);
            return arr;
          };
        } else if (self.msCrypto && self.msCrypto.getRandomValues) {
          Rand.prototype._rand = function _rand(n) {
            var arr = new Uint8Array(n);
            self.msCrypto.getRandomValues(arr);
            return arr;
          };
        } else if (typeof window === "object") {
          Rand.prototype._rand = function() {
            throw new Error("Not implemented yet");
          };
        }
      } else {
        try {
          crypto4 = __require("crypto");
          if (typeof crypto4.randomBytes !== "function")
            throw new Error("Not supported");
          Rand.prototype._rand = function _rand(n) {
            return crypto4.randomBytes(n);
          };
        } catch (e) {
        }
      }
      var crypto4;
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curve/base.js
  var require_base = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curve/base.js"(exports, module2) {
      "use strict";
      var BN2 = require_bn2();
      var utils = require_utils2();
      var getNAF = utils.getNAF;
      var getJSF = utils.getJSF;
      var assert3 = utils.assert;
      function BaseCurve(type, conf) {
        this.type = type;
        this.p = new BN2(conf.p, 16);
        this.red = conf.prime ? BN2.red(conf.prime) : BN2.mont(this.p);
        this.zero = new BN2(0).toRed(this.red);
        this.one = new BN2(1).toRed(this.red);
        this.two = new BN2(2).toRed(this.red);
        this.n = conf.n && new BN2(conf.n, 16);
        this.g = conf.g && this.pointFromJSON(conf.g, conf.gRed);
        this._wnafT1 = new Array(4);
        this._wnafT2 = new Array(4);
        this._wnafT3 = new Array(4);
        this._wnafT4 = new Array(4);
        this._bitLength = this.n ? this.n.bitLength() : 0;
        var adjustCount = this.n && this.p.div(this.n);
        if (!adjustCount || adjustCount.cmpn(100) > 0) {
          this.redN = null;
        } else {
          this._maxwellTrick = true;
          this.redN = this.n.toRed(this.red);
        }
      }
      module2.exports = BaseCurve;
      BaseCurve.prototype.point = function point() {
        throw new Error("Not implemented");
      };
      BaseCurve.prototype.validate = function validate() {
        throw new Error("Not implemented");
      };
      BaseCurve.prototype._fixedNafMul = function _fixedNafMul(p, k) {
        assert3(p.precomputed);
        var doubles = p._getDoubles();
        var naf = getNAF(k, 1, this._bitLength);
        var I = (1 << doubles.step + 1) - (doubles.step % 2 === 0 ? 2 : 1);
        I /= 3;
        var repr = [];
        var j;
        var nafW;
        for (j = 0; j < naf.length; j += doubles.step) {
          nafW = 0;
          for (var l = j + doubles.step - 1; l >= j; l--)
            nafW = (nafW << 1) + naf[l];
          repr.push(nafW);
        }
        var a = this.jpoint(null, null, null);
        var b = this.jpoint(null, null, null);
        for (var i = I; i > 0; i--) {
          for (j = 0; j < repr.length; j++) {
            nafW = repr[j];
            if (nafW === i)
              b = b.mixedAdd(doubles.points[j]);
            else if (nafW === -i)
              b = b.mixedAdd(doubles.points[j].neg());
          }
          a = a.add(b);
        }
        return a.toP();
      };
      BaseCurve.prototype._wnafMul = function _wnafMul(p, k) {
        var w = 4;
        var nafPoints = p._getNAFPoints(w);
        w = nafPoints.wnd;
        var wnd = nafPoints.points;
        var naf = getNAF(k, w, this._bitLength);
        var acc = this.jpoint(null, null, null);
        for (var i = naf.length - 1; i >= 0; i--) {
          for (var l = 0; i >= 0 && naf[i] === 0; i--)
            l++;
          if (i >= 0)
            l++;
          acc = acc.dblp(l);
          if (i < 0)
            break;
          var z = naf[i];
          assert3(z !== 0);
          if (p.type === "affine") {
            if (z > 0)
              acc = acc.mixedAdd(wnd[z - 1 >> 1]);
            else
              acc = acc.mixedAdd(wnd[-z - 1 >> 1].neg());
          } else {
            if (z > 0)
              acc = acc.add(wnd[z - 1 >> 1]);
            else
              acc = acc.add(wnd[-z - 1 >> 1].neg());
          }
        }
        return p.type === "affine" ? acc.toP() : acc;
      };
      BaseCurve.prototype._wnafMulAdd = function _wnafMulAdd(defW, points, coeffs, len, jacobianResult) {
        var wndWidth = this._wnafT1;
        var wnd = this._wnafT2;
        var naf = this._wnafT3;
        var max = 0;
        var i;
        var j;
        var p;
        for (i = 0; i < len; i++) {
          p = points[i];
          var nafPoints = p._getNAFPoints(defW);
          wndWidth[i] = nafPoints.wnd;
          wnd[i] = nafPoints.points;
        }
        for (i = len - 1; i >= 1; i -= 2) {
          var a = i - 1;
          var b = i;
          if (wndWidth[a] !== 1 || wndWidth[b] !== 1) {
            naf[a] = getNAF(coeffs[a], wndWidth[a], this._bitLength);
            naf[b] = getNAF(coeffs[b], wndWidth[b], this._bitLength);
            max = Math.max(naf[a].length, max);
            max = Math.max(naf[b].length, max);
            continue;
          }
          var comb = [
            points[a],
            /* 1 */
            null,
            /* 3 */
            null,
            /* 5 */
            points[b]
            /* 7 */
          ];
          if (points[a].y.cmp(points[b].y) === 0) {
            comb[1] = points[a].add(points[b]);
            comb[2] = points[a].toJ().mixedAdd(points[b].neg());
          } else if (points[a].y.cmp(points[b].y.redNeg()) === 0) {
            comb[1] = points[a].toJ().mixedAdd(points[b]);
            comb[2] = points[a].add(points[b].neg());
          } else {
            comb[1] = points[a].toJ().mixedAdd(points[b]);
            comb[2] = points[a].toJ().mixedAdd(points[b].neg());
          }
          var index = [
            -3,
            /* -1 -1 */
            -1,
            /* -1 0 */
            -5,
            /* -1 1 */
            -7,
            /* 0 -1 */
            0,
            /* 0 0 */
            7,
            /* 0 1 */
            5,
            /* 1 -1 */
            1,
            /* 1 0 */
            3
            /* 1 1 */
          ];
          var jsf = getJSF(coeffs[a], coeffs[b]);
          max = Math.max(jsf[0].length, max);
          naf[a] = new Array(max);
          naf[b] = new Array(max);
          for (j = 0; j < max; j++) {
            var ja = jsf[0][j] | 0;
            var jb = jsf[1][j] | 0;
            naf[a][j] = index[(ja + 1) * 3 + (jb + 1)];
            naf[b][j] = 0;
            wnd[a] = comb;
          }
        }
        var acc = this.jpoint(null, null, null);
        var tmp = this._wnafT4;
        for (i = max; i >= 0; i--) {
          var k = 0;
          while (i >= 0) {
            var zero = true;
            for (j = 0; j < len; j++) {
              tmp[j] = naf[j][i] | 0;
              if (tmp[j] !== 0)
                zero = false;
            }
            if (!zero)
              break;
            k++;
            i--;
          }
          if (i >= 0)
            k++;
          acc = acc.dblp(k);
          if (i < 0)
            break;
          for (j = 0; j < len; j++) {
            var z = tmp[j];
            p;
            if (z === 0)
              continue;
            else if (z > 0)
              p = wnd[j][z - 1 >> 1];
            else if (z < 0)
              p = wnd[j][-z - 1 >> 1].neg();
            if (p.type === "affine")
              acc = acc.mixedAdd(p);
            else
              acc = acc.add(p);
          }
        }
        for (i = 0; i < len; i++)
          wnd[i] = null;
        if (jacobianResult)
          return acc;
        else
          return acc.toP();
      };
      function BasePoint(curve, type) {
        this.curve = curve;
        this.type = type;
        this.precomputed = null;
      }
      BaseCurve.BasePoint = BasePoint;
      BasePoint.prototype.eq = function eq() {
        throw new Error("Not implemented");
      };
      BasePoint.prototype.validate = function validate() {
        return this.curve.validate(this);
      };
      BaseCurve.prototype.decodePoint = function decodePoint(bytes2, enc) {
        bytes2 = utils.toArray(bytes2, enc);
        var len = this.p.byteLength();
        if ((bytes2[0] === 4 || bytes2[0] === 6 || bytes2[0] === 7) && bytes2.length - 1 === 2 * len) {
          if (bytes2[0] === 6)
            assert3(bytes2[bytes2.length - 1] % 2 === 0);
          else if (bytes2[0] === 7)
            assert3(bytes2[bytes2.length - 1] % 2 === 1);
          var res = this.point(
            bytes2.slice(1, 1 + len),
            bytes2.slice(1 + len, 1 + 2 * len)
          );
          return res;
        } else if ((bytes2[0] === 2 || bytes2[0] === 3) && bytes2.length - 1 === len) {
          return this.pointFromX(bytes2.slice(1, 1 + len), bytes2[0] === 3);
        }
        throw new Error("Unknown point format");
      };
      BasePoint.prototype.encodeCompressed = function encodeCompressed(enc) {
        return this.encode(enc, true);
      };
      BasePoint.prototype._encode = function _encode(compact) {
        var len = this.curve.p.byteLength();
        var x = this.getX().toArray("be", len);
        if (compact)
          return [this.getY().isEven() ? 2 : 3].concat(x);
        return [4].concat(x, this.getY().toArray("be", len));
      };
      BasePoint.prototype.encode = function encode(enc, compact) {
        return utils.encode(this._encode(compact), enc);
      };
      BasePoint.prototype.precompute = function precompute(power) {
        if (this.precomputed)
          return this;
        var precomputed = {
          doubles: null,
          naf: null,
          beta: null
        };
        precomputed.naf = this._getNAFPoints(8);
        precomputed.doubles = this._getDoubles(4, power);
        precomputed.beta = this._getBeta();
        this.precomputed = precomputed;
        return this;
      };
      BasePoint.prototype._hasDoubles = function _hasDoubles(k) {
        if (!this.precomputed)
          return false;
        var doubles = this.precomputed.doubles;
        if (!doubles)
          return false;
        return doubles.points.length >= Math.ceil((k.bitLength() + 1) / doubles.step);
      };
      BasePoint.prototype._getDoubles = function _getDoubles(step, power) {
        if (this.precomputed && this.precomputed.doubles)
          return this.precomputed.doubles;
        var doubles = [this];
        var acc = this;
        for (var i = 0; i < power; i += step) {
          for (var j = 0; j < step; j++)
            acc = acc.dbl();
          doubles.push(acc);
        }
        return {
          step,
          points: doubles
        };
      };
      BasePoint.prototype._getNAFPoints = function _getNAFPoints(wnd) {
        if (this.precomputed && this.precomputed.naf)
          return this.precomputed.naf;
        var res = [this];
        var max = (1 << wnd) - 1;
        var dbl = max === 1 ? null : this.dbl();
        for (var i = 1; i < max; i++)
          res[i] = res[i - 1].add(dbl);
        return {
          wnd,
          points: res
        };
      };
      BasePoint.prototype._getBeta = function _getBeta() {
        return null;
      };
      BasePoint.prototype.dblp = function dblp(k) {
        var r = this;
        for (var i = 0; i < k; i++)
          r = r.dbl();
        return r;
      };
    }
  });

  // ../../node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits_browser.js
  var require_inherits_browser = __commonJS({
    "../../node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits_browser.js"(exports, module2) {
      if (typeof Object.create === "function") {
        module2.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            ctor.prototype = Object.create(superCtor.prototype, {
              constructor: {
                value: ctor,
                enumerable: false,
                writable: true,
                configurable: true
              }
            });
          }
        };
      } else {
        module2.exports = function inherits(ctor, superCtor) {
          if (superCtor) {
            ctor.super_ = superCtor;
            var TempCtor = function() {
            };
            TempCtor.prototype = superCtor.prototype;
            ctor.prototype = new TempCtor();
            ctor.prototype.constructor = ctor;
          }
        };
      }
    }
  });

  // ../../node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits.js
  var require_inherits = __commonJS({
    "../../node_modules/.pnpm/inherits@2.0.4/node_modules/inherits/inherits.js"(exports, module2) {
      try {
        util = __require("util");
        if (typeof util.inherits !== "function")
          throw "";
        module2.exports = util.inherits;
      } catch (e) {
        module2.exports = require_inherits_browser();
      }
      var util;
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curve/short.js
  var require_short = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curve/short.js"(exports, module2) {
      "use strict";
      var utils = require_utils2();
      var BN2 = require_bn2();
      var inherits = require_inherits();
      var Base = require_base();
      var assert3 = utils.assert;
      function ShortCurve(conf) {
        Base.call(this, "short", conf);
        this.a = new BN2(conf.a, 16).toRed(this.red);
        this.b = new BN2(conf.b, 16).toRed(this.red);
        this.tinv = this.two.redInvm();
        this.zeroA = this.a.fromRed().cmpn(0) === 0;
        this.threeA = this.a.fromRed().sub(this.p).cmpn(-3) === 0;
        this.endo = this._getEndomorphism(conf);
        this._endoWnafT1 = new Array(4);
        this._endoWnafT2 = new Array(4);
      }
      inherits(ShortCurve, Base);
      module2.exports = ShortCurve;
      ShortCurve.prototype._getEndomorphism = function _getEndomorphism(conf) {
        if (!this.zeroA || !this.g || !this.n || this.p.modn(3) !== 1)
          return;
        var beta;
        var lambda;
        if (conf.beta) {
          beta = new BN2(conf.beta, 16).toRed(this.red);
        } else {
          var betas = this._getEndoRoots(this.p);
          beta = betas[0].cmp(betas[1]) < 0 ? betas[0] : betas[1];
          beta = beta.toRed(this.red);
        }
        if (conf.lambda) {
          lambda = new BN2(conf.lambda, 16);
        } else {
          var lambdas = this._getEndoRoots(this.n);
          if (this.g.mul(lambdas[0]).x.cmp(this.g.x.redMul(beta)) === 0) {
            lambda = lambdas[0];
          } else {
            lambda = lambdas[1];
            assert3(this.g.mul(lambda).x.cmp(this.g.x.redMul(beta)) === 0);
          }
        }
        var basis;
        if (conf.basis) {
          basis = conf.basis.map(function(vec) {
            return {
              a: new BN2(vec.a, 16),
              b: new BN2(vec.b, 16)
            };
          });
        } else {
          basis = this._getEndoBasis(lambda);
        }
        return {
          beta,
          lambda,
          basis
        };
      };
      ShortCurve.prototype._getEndoRoots = function _getEndoRoots(num) {
        var red = num === this.p ? this.red : BN2.mont(num);
        var tinv = new BN2(2).toRed(red).redInvm();
        var ntinv = tinv.redNeg();
        var s = new BN2(3).toRed(red).redNeg().redSqrt().redMul(tinv);
        var l1 = ntinv.redAdd(s).fromRed();
        var l2 = ntinv.redSub(s).fromRed();
        return [l1, l2];
      };
      ShortCurve.prototype._getEndoBasis = function _getEndoBasis(lambda) {
        var aprxSqrt = this.n.ushrn(Math.floor(this.n.bitLength() / 2));
        var u = lambda;
        var v = this.n.clone();
        var x1 = new BN2(1);
        var y1 = new BN2(0);
        var x2 = new BN2(0);
        var y2 = new BN2(1);
        var a0;
        var b0;
        var a1;
        var b1;
        var a2;
        var b2;
        var prevR;
        var i = 0;
        var r;
        var x;
        while (u.cmpn(0) !== 0) {
          var q = v.div(u);
          r = v.sub(q.mul(u));
          x = x2.sub(q.mul(x1));
          var y = y2.sub(q.mul(y1));
          if (!a1 && r.cmp(aprxSqrt) < 0) {
            a0 = prevR.neg();
            b0 = x1;
            a1 = r.neg();
            b1 = x;
          } else if (a1 && ++i === 2) {
            break;
          }
          prevR = r;
          v = u;
          u = r;
          x2 = x1;
          x1 = x;
          y2 = y1;
          y1 = y;
        }
        a2 = r.neg();
        b2 = x;
        var len1 = a1.sqr().add(b1.sqr());
        var len2 = a2.sqr().add(b2.sqr());
        if (len2.cmp(len1) >= 0) {
          a2 = a0;
          b2 = b0;
        }
        if (a1.negative) {
          a1 = a1.neg();
          b1 = b1.neg();
        }
        if (a2.negative) {
          a2 = a2.neg();
          b2 = b2.neg();
        }
        return [
          { a: a1, b: b1 },
          { a: a2, b: b2 }
        ];
      };
      ShortCurve.prototype._endoSplit = function _endoSplit(k) {
        var basis = this.endo.basis;
        var v1 = basis[0];
        var v2 = basis[1];
        var c1 = v2.b.mul(k).divRound(this.n);
        var c2 = v1.b.neg().mul(k).divRound(this.n);
        var p1 = c1.mul(v1.a);
        var p2 = c2.mul(v2.a);
        var q1 = c1.mul(v1.b);
        var q2 = c2.mul(v2.b);
        var k1 = k.sub(p1).sub(p2);
        var k2 = q1.add(q2).neg();
        return { k1, k2 };
      };
      ShortCurve.prototype.pointFromX = function pointFromX(x, odd) {
        x = new BN2(x, 16);
        if (!x.red)
          x = x.toRed(this.red);
        var y2 = x.redSqr().redMul(x).redIAdd(x.redMul(this.a)).redIAdd(this.b);
        var y = y2.redSqrt();
        if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
          throw new Error("invalid point");
        var isOdd = y.fromRed().isOdd();
        if (odd && !isOdd || !odd && isOdd)
          y = y.redNeg();
        return this.point(x, y);
      };
      ShortCurve.prototype.validate = function validate(point) {
        if (point.inf)
          return true;
        var x = point.x;
        var y = point.y;
        var ax = this.a.redMul(x);
        var rhs = x.redSqr().redMul(x).redIAdd(ax).redIAdd(this.b);
        return y.redSqr().redISub(rhs).cmpn(0) === 0;
      };
      ShortCurve.prototype._endoWnafMulAdd = function _endoWnafMulAdd(points, coeffs, jacobianResult) {
        var npoints = this._endoWnafT1;
        var ncoeffs = this._endoWnafT2;
        for (var i = 0; i < points.length; i++) {
          var split2 = this._endoSplit(coeffs[i]);
          var p = points[i];
          var beta = p._getBeta();
          if (split2.k1.negative) {
            split2.k1.ineg();
            p = p.neg(true);
          }
          if (split2.k2.negative) {
            split2.k2.ineg();
            beta = beta.neg(true);
          }
          npoints[i * 2] = p;
          npoints[i * 2 + 1] = beta;
          ncoeffs[i * 2] = split2.k1;
          ncoeffs[i * 2 + 1] = split2.k2;
        }
        var res = this._wnafMulAdd(1, npoints, ncoeffs, i * 2, jacobianResult);
        for (var j = 0; j < i * 2; j++) {
          npoints[j] = null;
          ncoeffs[j] = null;
        }
        return res;
      };
      function Point(curve, x, y, isRed) {
        Base.BasePoint.call(this, curve, "affine");
        if (x === null && y === null) {
          this.x = null;
          this.y = null;
          this.inf = true;
        } else {
          this.x = new BN2(x, 16);
          this.y = new BN2(y, 16);
          if (isRed) {
            this.x.forceRed(this.curve.red);
            this.y.forceRed(this.curve.red);
          }
          if (!this.x.red)
            this.x = this.x.toRed(this.curve.red);
          if (!this.y.red)
            this.y = this.y.toRed(this.curve.red);
          this.inf = false;
        }
      }
      inherits(Point, Base.BasePoint);
      ShortCurve.prototype.point = function point(x, y, isRed) {
        return new Point(this, x, y, isRed);
      };
      ShortCurve.prototype.pointFromJSON = function pointFromJSON(obj, red) {
        return Point.fromJSON(this, obj, red);
      };
      Point.prototype._getBeta = function _getBeta() {
        if (!this.curve.endo)
          return;
        var pre = this.precomputed;
        if (pre && pre.beta)
          return pre.beta;
        var beta = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
        if (pre) {
          var curve = this.curve;
          var endoMul = function(p) {
            return curve.point(p.x.redMul(curve.endo.beta), p.y);
          };
          pre.beta = beta;
          beta.precomputed = {
            beta: null,
            naf: pre.naf && {
              wnd: pre.naf.wnd,
              points: pre.naf.points.map(endoMul)
            },
            doubles: pre.doubles && {
              step: pre.doubles.step,
              points: pre.doubles.points.map(endoMul)
            }
          };
        }
        return beta;
      };
      Point.prototype.toJSON = function toJSON() {
        if (!this.precomputed)
          return [this.x, this.y];
        return [this.x, this.y, this.precomputed && {
          doubles: this.precomputed.doubles && {
            step: this.precomputed.doubles.step,
            points: this.precomputed.doubles.points.slice(1)
          },
          naf: this.precomputed.naf && {
            wnd: this.precomputed.naf.wnd,
            points: this.precomputed.naf.points.slice(1)
          }
        }];
      };
      Point.fromJSON = function fromJSON(curve, obj, red) {
        if (typeof obj === "string")
          obj = JSON.parse(obj);
        var res = curve.point(obj[0], obj[1], red);
        if (!obj[2])
          return res;
        function obj2point(obj2) {
          return curve.point(obj2[0], obj2[1], red);
        }
        var pre = obj[2];
        res.precomputed = {
          beta: null,
          doubles: pre.doubles && {
            step: pre.doubles.step,
            points: [res].concat(pre.doubles.points.map(obj2point))
          },
          naf: pre.naf && {
            wnd: pre.naf.wnd,
            points: [res].concat(pre.naf.points.map(obj2point))
          }
        };
        return res;
      };
      Point.prototype.inspect = function inspect() {
        if (this.isInfinity())
          return "<EC Point Infinity>";
        return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">";
      };
      Point.prototype.isInfinity = function isInfinity() {
        return this.inf;
      };
      Point.prototype.add = function add2(p) {
        if (this.inf)
          return p;
        if (p.inf)
          return this;
        if (this.eq(p))
          return this.dbl();
        if (this.neg().eq(p))
          return this.curve.point(null, null);
        if (this.x.cmp(p.x) === 0)
          return this.curve.point(null, null);
        var c = this.y.redSub(p.y);
        if (c.cmpn(0) !== 0)
          c = c.redMul(this.x.redSub(p.x).redInvm());
        var nx = c.redSqr().redISub(this.x).redISub(p.x);
        var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
        return this.curve.point(nx, ny);
      };
      Point.prototype.dbl = function dbl() {
        if (this.inf)
          return this;
        var ys1 = this.y.redAdd(this.y);
        if (ys1.cmpn(0) === 0)
          return this.curve.point(null, null);
        var a = this.curve.a;
        var x2 = this.x.redSqr();
        var dyinv = ys1.redInvm();
        var c = x2.redAdd(x2).redIAdd(x2).redIAdd(a).redMul(dyinv);
        var nx = c.redSqr().redISub(this.x.redAdd(this.x));
        var ny = c.redMul(this.x.redSub(nx)).redISub(this.y);
        return this.curve.point(nx, ny);
      };
      Point.prototype.getX = function getX() {
        return this.x.fromRed();
      };
      Point.prototype.getY = function getY() {
        return this.y.fromRed();
      };
      Point.prototype.mul = function mul(k) {
        k = new BN2(k, 16);
        if (this.isInfinity())
          return this;
        else if (this._hasDoubles(k))
          return this.curve._fixedNafMul(this, k);
        else if (this.curve.endo)
          return this.curve._endoWnafMulAdd([this], [k]);
        else
          return this.curve._wnafMul(this, k);
      };
      Point.prototype.mulAdd = function mulAdd(k1, p2, k2) {
        var points = [this, p2];
        var coeffs = [k1, k2];
        if (this.curve.endo)
          return this.curve._endoWnafMulAdd(points, coeffs);
        else
          return this.curve._wnafMulAdd(1, points, coeffs, 2);
      };
      Point.prototype.jmulAdd = function jmulAdd(k1, p2, k2) {
        var points = [this, p2];
        var coeffs = [k1, k2];
        if (this.curve.endo)
          return this.curve._endoWnafMulAdd(points, coeffs, true);
        else
          return this.curve._wnafMulAdd(1, points, coeffs, 2, true);
      };
      Point.prototype.eq = function eq(p) {
        return this === p || this.inf === p.inf && (this.inf || this.x.cmp(p.x) === 0 && this.y.cmp(p.y) === 0);
      };
      Point.prototype.neg = function neg(_precompute) {
        if (this.inf)
          return this;
        var res = this.curve.point(this.x, this.y.redNeg());
        if (_precompute && this.precomputed) {
          var pre = this.precomputed;
          var negate = function(p) {
            return p.neg();
          };
          res.precomputed = {
            naf: pre.naf && {
              wnd: pre.naf.wnd,
              points: pre.naf.points.map(negate)
            },
            doubles: pre.doubles && {
              step: pre.doubles.step,
              points: pre.doubles.points.map(negate)
            }
          };
        }
        return res;
      };
      Point.prototype.toJ = function toJ() {
        if (this.inf)
          return this.curve.jpoint(null, null, null);
        var res = this.curve.jpoint(this.x, this.y, this.curve.one);
        return res;
      };
      function JPoint(curve, x, y, z) {
        Base.BasePoint.call(this, curve, "jacobian");
        if (x === null && y === null && z === null) {
          this.x = this.curve.one;
          this.y = this.curve.one;
          this.z = new BN2(0);
        } else {
          this.x = new BN2(x, 16);
          this.y = new BN2(y, 16);
          this.z = new BN2(z, 16);
        }
        if (!this.x.red)
          this.x = this.x.toRed(this.curve.red);
        if (!this.y.red)
          this.y = this.y.toRed(this.curve.red);
        if (!this.z.red)
          this.z = this.z.toRed(this.curve.red);
        this.zOne = this.z === this.curve.one;
      }
      inherits(JPoint, Base.BasePoint);
      ShortCurve.prototype.jpoint = function jpoint(x, y, z) {
        return new JPoint(this, x, y, z);
      };
      JPoint.prototype.toP = function toP() {
        if (this.isInfinity())
          return this.curve.point(null, null);
        var zinv = this.z.redInvm();
        var zinv2 = zinv.redSqr();
        var ax = this.x.redMul(zinv2);
        var ay = this.y.redMul(zinv2).redMul(zinv);
        return this.curve.point(ax, ay);
      };
      JPoint.prototype.neg = function neg() {
        return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
      };
      JPoint.prototype.add = function add2(p) {
        if (this.isInfinity())
          return p;
        if (p.isInfinity())
          return this;
        var pz2 = p.z.redSqr();
        var z2 = this.z.redSqr();
        var u1 = this.x.redMul(pz2);
        var u2 = p.x.redMul(z2);
        var s1 = this.y.redMul(pz2.redMul(p.z));
        var s2 = p.y.redMul(z2.redMul(this.z));
        var h = u1.redSub(u2);
        var r = s1.redSub(s2);
        if (h.cmpn(0) === 0) {
          if (r.cmpn(0) !== 0)
            return this.curve.jpoint(null, null, null);
          else
            return this.dbl();
        }
        var h2 = h.redSqr();
        var h3 = h2.redMul(h);
        var v = u1.redMul(h2);
        var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
        var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
        var nz = this.z.redMul(p.z).redMul(h);
        return this.curve.jpoint(nx, ny, nz);
      };
      JPoint.prototype.mixedAdd = function mixedAdd(p) {
        if (this.isInfinity())
          return p.toJ();
        if (p.isInfinity())
          return this;
        var z2 = this.z.redSqr();
        var u1 = this.x;
        var u2 = p.x.redMul(z2);
        var s1 = this.y;
        var s2 = p.y.redMul(z2).redMul(this.z);
        var h = u1.redSub(u2);
        var r = s1.redSub(s2);
        if (h.cmpn(0) === 0) {
          if (r.cmpn(0) !== 0)
            return this.curve.jpoint(null, null, null);
          else
            return this.dbl();
        }
        var h2 = h.redSqr();
        var h3 = h2.redMul(h);
        var v = u1.redMul(h2);
        var nx = r.redSqr().redIAdd(h3).redISub(v).redISub(v);
        var ny = r.redMul(v.redISub(nx)).redISub(s1.redMul(h3));
        var nz = this.z.redMul(h);
        return this.curve.jpoint(nx, ny, nz);
      };
      JPoint.prototype.dblp = function dblp(pow) {
        if (pow === 0)
          return this;
        if (this.isInfinity())
          return this;
        if (!pow)
          return this.dbl();
        var i;
        if (this.curve.zeroA || this.curve.threeA) {
          var r = this;
          for (i = 0; i < pow; i++)
            r = r.dbl();
          return r;
        }
        var a = this.curve.a;
        var tinv = this.curve.tinv;
        var jx = this.x;
        var jy = this.y;
        var jz = this.z;
        var jz4 = jz.redSqr().redSqr();
        var jyd = jy.redAdd(jy);
        for (i = 0; i < pow; i++) {
          var jx2 = jx.redSqr();
          var jyd2 = jyd.redSqr();
          var jyd4 = jyd2.redSqr();
          var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
          var t1 = jx.redMul(jyd2);
          var nx = c.redSqr().redISub(t1.redAdd(t1));
          var t2 = t1.redISub(nx);
          var dny = c.redMul(t2);
          dny = dny.redIAdd(dny).redISub(jyd4);
          var nz = jyd.redMul(jz);
          if (i + 1 < pow)
            jz4 = jz4.redMul(jyd4);
          jx = nx;
          jz = nz;
          jyd = dny;
        }
        return this.curve.jpoint(jx, jyd.redMul(tinv), jz);
      };
      JPoint.prototype.dbl = function dbl() {
        if (this.isInfinity())
          return this;
        if (this.curve.zeroA)
          return this._zeroDbl();
        else if (this.curve.threeA)
          return this._threeDbl();
        else
          return this._dbl();
      };
      JPoint.prototype._zeroDbl = function _zeroDbl() {
        var nx;
        var ny;
        var nz;
        if (this.zOne) {
          var xx = this.x.redSqr();
          var yy = this.y.redSqr();
          var yyyy = yy.redSqr();
          var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
          s = s.redIAdd(s);
          var m = xx.redAdd(xx).redIAdd(xx);
          var t = m.redSqr().redISub(s).redISub(s);
          var yyyy8 = yyyy.redIAdd(yyyy);
          yyyy8 = yyyy8.redIAdd(yyyy8);
          yyyy8 = yyyy8.redIAdd(yyyy8);
          nx = t;
          ny = m.redMul(s.redISub(t)).redISub(yyyy8);
          nz = this.y.redAdd(this.y);
        } else {
          var a = this.x.redSqr();
          var b = this.y.redSqr();
          var c = b.redSqr();
          var d = this.x.redAdd(b).redSqr().redISub(a).redISub(c);
          d = d.redIAdd(d);
          var e = a.redAdd(a).redIAdd(a);
          var f = e.redSqr();
          var c8 = c.redIAdd(c);
          c8 = c8.redIAdd(c8);
          c8 = c8.redIAdd(c8);
          nx = f.redISub(d).redISub(d);
          ny = e.redMul(d.redISub(nx)).redISub(c8);
          nz = this.y.redMul(this.z);
          nz = nz.redIAdd(nz);
        }
        return this.curve.jpoint(nx, ny, nz);
      };
      JPoint.prototype._threeDbl = function _threeDbl() {
        var nx;
        var ny;
        var nz;
        if (this.zOne) {
          var xx = this.x.redSqr();
          var yy = this.y.redSqr();
          var yyyy = yy.redSqr();
          var s = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
          s = s.redIAdd(s);
          var m = xx.redAdd(xx).redIAdd(xx).redIAdd(this.curve.a);
          var t = m.redSqr().redISub(s).redISub(s);
          nx = t;
          var yyyy8 = yyyy.redIAdd(yyyy);
          yyyy8 = yyyy8.redIAdd(yyyy8);
          yyyy8 = yyyy8.redIAdd(yyyy8);
          ny = m.redMul(s.redISub(t)).redISub(yyyy8);
          nz = this.y.redAdd(this.y);
        } else {
          var delta = this.z.redSqr();
          var gamma = this.y.redSqr();
          var beta = this.x.redMul(gamma);
          var alpha = this.x.redSub(delta).redMul(this.x.redAdd(delta));
          alpha = alpha.redAdd(alpha).redIAdd(alpha);
          var beta4 = beta.redIAdd(beta);
          beta4 = beta4.redIAdd(beta4);
          var beta8 = beta4.redAdd(beta4);
          nx = alpha.redSqr().redISub(beta8);
          nz = this.y.redAdd(this.z).redSqr().redISub(gamma).redISub(delta);
          var ggamma8 = gamma.redSqr();
          ggamma8 = ggamma8.redIAdd(ggamma8);
          ggamma8 = ggamma8.redIAdd(ggamma8);
          ggamma8 = ggamma8.redIAdd(ggamma8);
          ny = alpha.redMul(beta4.redISub(nx)).redISub(ggamma8);
        }
        return this.curve.jpoint(nx, ny, nz);
      };
      JPoint.prototype._dbl = function _dbl() {
        var a = this.curve.a;
        var jx = this.x;
        var jy = this.y;
        var jz = this.z;
        var jz4 = jz.redSqr().redSqr();
        var jx2 = jx.redSqr();
        var jy2 = jy.redSqr();
        var c = jx2.redAdd(jx2).redIAdd(jx2).redIAdd(a.redMul(jz4));
        var jxd4 = jx.redAdd(jx);
        jxd4 = jxd4.redIAdd(jxd4);
        var t1 = jxd4.redMul(jy2);
        var nx = c.redSqr().redISub(t1.redAdd(t1));
        var t2 = t1.redISub(nx);
        var jyd8 = jy2.redSqr();
        jyd8 = jyd8.redIAdd(jyd8);
        jyd8 = jyd8.redIAdd(jyd8);
        jyd8 = jyd8.redIAdd(jyd8);
        var ny = c.redMul(t2).redISub(jyd8);
        var nz = jy.redAdd(jy).redMul(jz);
        return this.curve.jpoint(nx, ny, nz);
      };
      JPoint.prototype.trpl = function trpl() {
        if (!this.curve.zeroA)
          return this.dbl().add(this);
        var xx = this.x.redSqr();
        var yy = this.y.redSqr();
        var zz = this.z.redSqr();
        var yyyy = yy.redSqr();
        var m = xx.redAdd(xx).redIAdd(xx);
        var mm = m.redSqr();
        var e = this.x.redAdd(yy).redSqr().redISub(xx).redISub(yyyy);
        e = e.redIAdd(e);
        e = e.redAdd(e).redIAdd(e);
        e = e.redISub(mm);
        var ee = e.redSqr();
        var t = yyyy.redIAdd(yyyy);
        t = t.redIAdd(t);
        t = t.redIAdd(t);
        t = t.redIAdd(t);
        var u = m.redIAdd(e).redSqr().redISub(mm).redISub(ee).redISub(t);
        var yyu4 = yy.redMul(u);
        yyu4 = yyu4.redIAdd(yyu4);
        yyu4 = yyu4.redIAdd(yyu4);
        var nx = this.x.redMul(ee).redISub(yyu4);
        nx = nx.redIAdd(nx);
        nx = nx.redIAdd(nx);
        var ny = this.y.redMul(u.redMul(t.redISub(u)).redISub(e.redMul(ee)));
        ny = ny.redIAdd(ny);
        ny = ny.redIAdd(ny);
        ny = ny.redIAdd(ny);
        var nz = this.z.redAdd(e).redSqr().redISub(zz).redISub(ee);
        return this.curve.jpoint(nx, ny, nz);
      };
      JPoint.prototype.mul = function mul(k, kbase) {
        k = new BN2(k, kbase);
        return this.curve._wnafMul(this, k);
      };
      JPoint.prototype.eq = function eq(p) {
        if (p.type === "affine")
          return this.eq(p.toJ());
        if (this === p)
          return true;
        var z2 = this.z.redSqr();
        var pz2 = p.z.redSqr();
        if (this.x.redMul(pz2).redISub(p.x.redMul(z2)).cmpn(0) !== 0)
          return false;
        var z3 = z2.redMul(this.z);
        var pz3 = pz2.redMul(p.z);
        return this.y.redMul(pz3).redISub(p.y.redMul(z3)).cmpn(0) === 0;
      };
      JPoint.prototype.eqXToP = function eqXToP(x) {
        var zs = this.z.redSqr();
        var rx = x.toRed(this.curve.red).redMul(zs);
        if (this.x.cmp(rx) === 0)
          return true;
        var xc = x.clone();
        var t = this.curve.redN.redMul(zs);
        for (; ; ) {
          xc.iadd(this.curve.n);
          if (xc.cmp(this.curve.p) >= 0)
            return false;
          rx.redIAdd(t);
          if (this.x.cmp(rx) === 0)
            return true;
        }
      };
      JPoint.prototype.inspect = function inspect() {
        if (this.isInfinity())
          return "<EC JPoint Infinity>";
        return "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">";
      };
      JPoint.prototype.isInfinity = function isInfinity() {
        return this.z.cmpn(0) === 0;
      };
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curve/mont.js
  var require_mont = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curve/mont.js"(exports, module2) {
      "use strict";
      var BN2 = require_bn2();
      var inherits = require_inherits();
      var Base = require_base();
      var utils = require_utils2();
      function MontCurve(conf) {
        Base.call(this, "mont", conf);
        this.a = new BN2(conf.a, 16).toRed(this.red);
        this.b = new BN2(conf.b, 16).toRed(this.red);
        this.i4 = new BN2(4).toRed(this.red).redInvm();
        this.two = new BN2(2).toRed(this.red);
        this.a24 = this.i4.redMul(this.a.redAdd(this.two));
      }
      inherits(MontCurve, Base);
      module2.exports = MontCurve;
      MontCurve.prototype.validate = function validate(point) {
        var x = point.normalize().x;
        var x2 = x.redSqr();
        var rhs = x2.redMul(x).redAdd(x2.redMul(this.a)).redAdd(x);
        var y = rhs.redSqrt();
        return y.redSqr().cmp(rhs) === 0;
      };
      function Point(curve, x, z) {
        Base.BasePoint.call(this, curve, "projective");
        if (x === null && z === null) {
          this.x = this.curve.one;
          this.z = this.curve.zero;
        } else {
          this.x = new BN2(x, 16);
          this.z = new BN2(z, 16);
          if (!this.x.red)
            this.x = this.x.toRed(this.curve.red);
          if (!this.z.red)
            this.z = this.z.toRed(this.curve.red);
        }
      }
      inherits(Point, Base.BasePoint);
      MontCurve.prototype.decodePoint = function decodePoint(bytes2, enc) {
        return this.point(utils.toArray(bytes2, enc), 1);
      };
      MontCurve.prototype.point = function point(x, z) {
        return new Point(this, x, z);
      };
      MontCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
        return Point.fromJSON(this, obj);
      };
      Point.prototype.precompute = function precompute() {
      };
      Point.prototype._encode = function _encode() {
        return this.getX().toArray("be", this.curve.p.byteLength());
      };
      Point.fromJSON = function fromJSON(curve, obj) {
        return new Point(curve, obj[0], obj[1] || curve.one);
      };
      Point.prototype.inspect = function inspect() {
        if (this.isInfinity())
          return "<EC Point Infinity>";
        return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
      };
      Point.prototype.isInfinity = function isInfinity() {
        return this.z.cmpn(0) === 0;
      };
      Point.prototype.dbl = function dbl() {
        var a = this.x.redAdd(this.z);
        var aa = a.redSqr();
        var b = this.x.redSub(this.z);
        var bb = b.redSqr();
        var c = aa.redSub(bb);
        var nx = aa.redMul(bb);
        var nz = c.redMul(bb.redAdd(this.curve.a24.redMul(c)));
        return this.curve.point(nx, nz);
      };
      Point.prototype.add = function add2() {
        throw new Error("Not supported on Montgomery curve");
      };
      Point.prototype.diffAdd = function diffAdd(p, diff) {
        var a = this.x.redAdd(this.z);
        var b = this.x.redSub(this.z);
        var c = p.x.redAdd(p.z);
        var d = p.x.redSub(p.z);
        var da = d.redMul(a);
        var cb = c.redMul(b);
        var nx = diff.z.redMul(da.redAdd(cb).redSqr());
        var nz = diff.x.redMul(da.redISub(cb).redSqr());
        return this.curve.point(nx, nz);
      };
      Point.prototype.mul = function mul(k) {
        var t = k.clone();
        var a = this;
        var b = this.curve.point(null, null);
        var c = this;
        for (var bits = []; t.cmpn(0) !== 0; t.iushrn(1))
          bits.push(t.andln(1));
        for (var i = bits.length - 1; i >= 0; i--) {
          if (bits[i] === 0) {
            a = a.diffAdd(b, c);
            b = b.dbl();
          } else {
            b = a.diffAdd(b, c);
            a = a.dbl();
          }
        }
        return b;
      };
      Point.prototype.mulAdd = function mulAdd() {
        throw new Error("Not supported on Montgomery curve");
      };
      Point.prototype.jumlAdd = function jumlAdd() {
        throw new Error("Not supported on Montgomery curve");
      };
      Point.prototype.eq = function eq(other) {
        return this.getX().cmp(other.getX()) === 0;
      };
      Point.prototype.normalize = function normalize() {
        this.x = this.x.redMul(this.z.redInvm());
        this.z = this.curve.one;
        return this;
      };
      Point.prototype.getX = function getX() {
        this.normalize();
        return this.x.fromRed();
      };
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curve/edwards.js
  var require_edwards = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curve/edwards.js"(exports, module2) {
      "use strict";
      var utils = require_utils2();
      var BN2 = require_bn2();
      var inherits = require_inherits();
      var Base = require_base();
      var assert3 = utils.assert;
      function EdwardsCurve(conf) {
        this.twisted = (conf.a | 0) !== 1;
        this.mOneA = this.twisted && (conf.a | 0) === -1;
        this.extended = this.mOneA;
        Base.call(this, "edwards", conf);
        this.a = new BN2(conf.a, 16).umod(this.red.m);
        this.a = this.a.toRed(this.red);
        this.c = new BN2(conf.c, 16).toRed(this.red);
        this.c2 = this.c.redSqr();
        this.d = new BN2(conf.d, 16).toRed(this.red);
        this.dd = this.d.redAdd(this.d);
        assert3(!this.twisted || this.c.fromRed().cmpn(1) === 0);
        this.oneC = (conf.c | 0) === 1;
      }
      inherits(EdwardsCurve, Base);
      module2.exports = EdwardsCurve;
      EdwardsCurve.prototype._mulA = function _mulA(num) {
        if (this.mOneA)
          return num.redNeg();
        else
          return this.a.redMul(num);
      };
      EdwardsCurve.prototype._mulC = function _mulC(num) {
        if (this.oneC)
          return num;
        else
          return this.c.redMul(num);
      };
      EdwardsCurve.prototype.jpoint = function jpoint(x, y, z, t) {
        return this.point(x, y, z, t);
      };
      EdwardsCurve.prototype.pointFromX = function pointFromX(x, odd) {
        x = new BN2(x, 16);
        if (!x.red)
          x = x.toRed(this.red);
        var x2 = x.redSqr();
        var rhs = this.c2.redSub(this.a.redMul(x2));
        var lhs = this.one.redSub(this.c2.redMul(this.d).redMul(x2));
        var y2 = rhs.redMul(lhs.redInvm());
        var y = y2.redSqrt();
        if (y.redSqr().redSub(y2).cmp(this.zero) !== 0)
          throw new Error("invalid point");
        var isOdd = y.fromRed().isOdd();
        if (odd && !isOdd || !odd && isOdd)
          y = y.redNeg();
        return this.point(x, y);
      };
      EdwardsCurve.prototype.pointFromY = function pointFromY(y, odd) {
        y = new BN2(y, 16);
        if (!y.red)
          y = y.toRed(this.red);
        var y2 = y.redSqr();
        var lhs = y2.redSub(this.c2);
        var rhs = y2.redMul(this.d).redMul(this.c2).redSub(this.a);
        var x2 = lhs.redMul(rhs.redInvm());
        if (x2.cmp(this.zero) === 0) {
          if (odd)
            throw new Error("invalid point");
          else
            return this.point(this.zero, y);
        }
        var x = x2.redSqrt();
        if (x.redSqr().redSub(x2).cmp(this.zero) !== 0)
          throw new Error("invalid point");
        if (x.fromRed().isOdd() !== odd)
          x = x.redNeg();
        return this.point(x, y);
      };
      EdwardsCurve.prototype.validate = function validate(point) {
        if (point.isInfinity())
          return true;
        point.normalize();
        var x2 = point.x.redSqr();
        var y2 = point.y.redSqr();
        var lhs = x2.redMul(this.a).redAdd(y2);
        var rhs = this.c2.redMul(this.one.redAdd(this.d.redMul(x2).redMul(y2)));
        return lhs.cmp(rhs) === 0;
      };
      function Point(curve, x, y, z, t) {
        Base.BasePoint.call(this, curve, "projective");
        if (x === null && y === null && z === null) {
          this.x = this.curve.zero;
          this.y = this.curve.one;
          this.z = this.curve.one;
          this.t = this.curve.zero;
          this.zOne = true;
        } else {
          this.x = new BN2(x, 16);
          this.y = new BN2(y, 16);
          this.z = z ? new BN2(z, 16) : this.curve.one;
          this.t = t && new BN2(t, 16);
          if (!this.x.red)
            this.x = this.x.toRed(this.curve.red);
          if (!this.y.red)
            this.y = this.y.toRed(this.curve.red);
          if (!this.z.red)
            this.z = this.z.toRed(this.curve.red);
          if (this.t && !this.t.red)
            this.t = this.t.toRed(this.curve.red);
          this.zOne = this.z === this.curve.one;
          if (this.curve.extended && !this.t) {
            this.t = this.x.redMul(this.y);
            if (!this.zOne)
              this.t = this.t.redMul(this.z.redInvm());
          }
        }
      }
      inherits(Point, Base.BasePoint);
      EdwardsCurve.prototype.pointFromJSON = function pointFromJSON(obj) {
        return Point.fromJSON(this, obj);
      };
      EdwardsCurve.prototype.point = function point(x, y, z, t) {
        return new Point(this, x, y, z, t);
      };
      Point.fromJSON = function fromJSON(curve, obj) {
        return new Point(curve, obj[0], obj[1], obj[2]);
      };
      Point.prototype.inspect = function inspect() {
        if (this.isInfinity())
          return "<EC Point Infinity>";
        return "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">";
      };
      Point.prototype.isInfinity = function isInfinity() {
        return this.x.cmpn(0) === 0 && (this.y.cmp(this.z) === 0 || this.zOne && this.y.cmp(this.curve.c) === 0);
      };
      Point.prototype._extDbl = function _extDbl() {
        var a = this.x.redSqr();
        var b = this.y.redSqr();
        var c = this.z.redSqr();
        c = c.redIAdd(c);
        var d = this.curve._mulA(a);
        var e = this.x.redAdd(this.y).redSqr().redISub(a).redISub(b);
        var g = d.redAdd(b);
        var f = g.redSub(c);
        var h = d.redSub(b);
        var nx = e.redMul(f);
        var ny = g.redMul(h);
        var nt = e.redMul(h);
        var nz = f.redMul(g);
        return this.curve.point(nx, ny, nz, nt);
      };
      Point.prototype._projDbl = function _projDbl() {
        var b = this.x.redAdd(this.y).redSqr();
        var c = this.x.redSqr();
        var d = this.y.redSqr();
        var nx;
        var ny;
        var nz;
        var e;
        var h;
        var j;
        if (this.curve.twisted) {
          e = this.curve._mulA(c);
          var f = e.redAdd(d);
          if (this.zOne) {
            nx = b.redSub(c).redSub(d).redMul(f.redSub(this.curve.two));
            ny = f.redMul(e.redSub(d));
            nz = f.redSqr().redSub(f).redSub(f);
          } else {
            h = this.z.redSqr();
            j = f.redSub(h).redISub(h);
            nx = b.redSub(c).redISub(d).redMul(j);
            ny = f.redMul(e.redSub(d));
            nz = f.redMul(j);
          }
        } else {
          e = c.redAdd(d);
          h = this.curve._mulC(this.z).redSqr();
          j = e.redSub(h).redSub(h);
          nx = this.curve._mulC(b.redISub(e)).redMul(j);
          ny = this.curve._mulC(e).redMul(c.redISub(d));
          nz = e.redMul(j);
        }
        return this.curve.point(nx, ny, nz);
      };
      Point.prototype.dbl = function dbl() {
        if (this.isInfinity())
          return this;
        if (this.curve.extended)
          return this._extDbl();
        else
          return this._projDbl();
      };
      Point.prototype._extAdd = function _extAdd(p) {
        var a = this.y.redSub(this.x).redMul(p.y.redSub(p.x));
        var b = this.y.redAdd(this.x).redMul(p.y.redAdd(p.x));
        var c = this.t.redMul(this.curve.dd).redMul(p.t);
        var d = this.z.redMul(p.z.redAdd(p.z));
        var e = b.redSub(a);
        var f = d.redSub(c);
        var g = d.redAdd(c);
        var h = b.redAdd(a);
        var nx = e.redMul(f);
        var ny = g.redMul(h);
        var nt = e.redMul(h);
        var nz = f.redMul(g);
        return this.curve.point(nx, ny, nz, nt);
      };
      Point.prototype._projAdd = function _projAdd(p) {
        var a = this.z.redMul(p.z);
        var b = a.redSqr();
        var c = this.x.redMul(p.x);
        var d = this.y.redMul(p.y);
        var e = this.curve.d.redMul(c).redMul(d);
        var f = b.redSub(e);
        var g = b.redAdd(e);
        var tmp = this.x.redAdd(this.y).redMul(p.x.redAdd(p.y)).redISub(c).redISub(d);
        var nx = a.redMul(f).redMul(tmp);
        var ny;
        var nz;
        if (this.curve.twisted) {
          ny = a.redMul(g).redMul(d.redSub(this.curve._mulA(c)));
          nz = f.redMul(g);
        } else {
          ny = a.redMul(g).redMul(d.redSub(c));
          nz = this.curve._mulC(f).redMul(g);
        }
        return this.curve.point(nx, ny, nz);
      };
      Point.prototype.add = function add2(p) {
        if (this.isInfinity())
          return p;
        if (p.isInfinity())
          return this;
        if (this.curve.extended)
          return this._extAdd(p);
        else
          return this._projAdd(p);
      };
      Point.prototype.mul = function mul(k) {
        if (this._hasDoubles(k))
          return this.curve._fixedNafMul(this, k);
        else
          return this.curve._wnafMul(this, k);
      };
      Point.prototype.mulAdd = function mulAdd(k1, p, k2) {
        return this.curve._wnafMulAdd(1, [this, p], [k1, k2], 2, false);
      };
      Point.prototype.jmulAdd = function jmulAdd(k1, p, k2) {
        return this.curve._wnafMulAdd(1, [this, p], [k1, k2], 2, true);
      };
      Point.prototype.normalize = function normalize() {
        if (this.zOne)
          return this;
        var zi = this.z.redInvm();
        this.x = this.x.redMul(zi);
        this.y = this.y.redMul(zi);
        if (this.t)
          this.t = this.t.redMul(zi);
        this.z = this.curve.one;
        this.zOne = true;
        return this;
      };
      Point.prototype.neg = function neg() {
        return this.curve.point(
          this.x.redNeg(),
          this.y,
          this.z,
          this.t && this.t.redNeg()
        );
      };
      Point.prototype.getX = function getX() {
        this.normalize();
        return this.x.fromRed();
      };
      Point.prototype.getY = function getY() {
        this.normalize();
        return this.y.fromRed();
      };
      Point.prototype.eq = function eq(other) {
        return this === other || this.getX().cmp(other.getX()) === 0 && this.getY().cmp(other.getY()) === 0;
      };
      Point.prototype.eqXToP = function eqXToP(x) {
        var rx = x.toRed(this.curve.red).redMul(this.z);
        if (this.x.cmp(rx) === 0)
          return true;
        var xc = x.clone();
        var t = this.curve.redN.redMul(this.z);
        for (; ; ) {
          xc.iadd(this.curve.n);
          if (xc.cmp(this.curve.p) >= 0)
            return false;
          rx.redIAdd(t);
          if (this.x.cmp(rx) === 0)
            return true;
        }
      };
      Point.prototype.toP = Point.prototype.normalize;
      Point.prototype.mixedAdd = Point.prototype.add;
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curve/index.js
  var require_curve = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curve/index.js"(exports) {
      "use strict";
      var curve = exports;
      curve.base = require_base();
      curve.short = require_short();
      curve.mont = require_mont();
      curve.edwards = require_edwards();
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/utils.js
  var require_utils3 = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/utils.js"(exports) {
      "use strict";
      var assert3 = require_minimalistic_assert();
      var inherits = require_inherits();
      exports.inherits = inherits;
      function isSurrogatePair(msg, i) {
        if ((msg.charCodeAt(i) & 64512) !== 55296) {
          return false;
        }
        if (i < 0 || i + 1 >= msg.length) {
          return false;
        }
        return (msg.charCodeAt(i + 1) & 64512) === 56320;
      }
      function toArray(msg, enc) {
        if (Array.isArray(msg))
          return msg.slice();
        if (!msg)
          return [];
        var res = [];
        if (typeof msg === "string") {
          if (!enc) {
            var p = 0;
            for (var i = 0; i < msg.length; i++) {
              var c = msg.charCodeAt(i);
              if (c < 128) {
                res[p++] = c;
              } else if (c < 2048) {
                res[p++] = c >> 6 | 192;
                res[p++] = c & 63 | 128;
              } else if (isSurrogatePair(msg, i)) {
                c = 65536 + ((c & 1023) << 10) + (msg.charCodeAt(++i) & 1023);
                res[p++] = c >> 18 | 240;
                res[p++] = c >> 12 & 63 | 128;
                res[p++] = c >> 6 & 63 | 128;
                res[p++] = c & 63 | 128;
              } else {
                res[p++] = c >> 12 | 224;
                res[p++] = c >> 6 & 63 | 128;
                res[p++] = c & 63 | 128;
              }
            }
          } else if (enc === "hex") {
            msg = msg.replace(/[^a-z0-9]+/ig, "");
            if (msg.length % 2 !== 0)
              msg = "0" + msg;
            for (i = 0; i < msg.length; i += 2)
              res.push(parseInt(msg[i] + msg[i + 1], 16));
          }
        } else {
          for (i = 0; i < msg.length; i++)
            res[i] = msg[i] | 0;
        }
        return res;
      }
      exports.toArray = toArray;
      function toHex(msg) {
        var res = "";
        for (var i = 0; i < msg.length; i++)
          res += zero2(msg[i].toString(16));
        return res;
      }
      exports.toHex = toHex;
      function htonl(w) {
        var res = w >>> 24 | w >>> 8 & 65280 | w << 8 & 16711680 | (w & 255) << 24;
        return res >>> 0;
      }
      exports.htonl = htonl;
      function toHex32(msg, endian) {
        var res = "";
        for (var i = 0; i < msg.length; i++) {
          var w = msg[i];
          if (endian === "little")
            w = htonl(w);
          res += zero8(w.toString(16));
        }
        return res;
      }
      exports.toHex32 = toHex32;
      function zero2(word) {
        if (word.length === 1)
          return "0" + word;
        else
          return word;
      }
      exports.zero2 = zero2;
      function zero8(word) {
        if (word.length === 7)
          return "0" + word;
        else if (word.length === 6)
          return "00" + word;
        else if (word.length === 5)
          return "000" + word;
        else if (word.length === 4)
          return "0000" + word;
        else if (word.length === 3)
          return "00000" + word;
        else if (word.length === 2)
          return "000000" + word;
        else if (word.length === 1)
          return "0000000" + word;
        else
          return word;
      }
      exports.zero8 = zero8;
      function join32(msg, start, end, endian) {
        var len = end - start;
        assert3(len % 4 === 0);
        var res = new Array(len / 4);
        for (var i = 0, k = start; i < res.length; i++, k += 4) {
          var w;
          if (endian === "big")
            w = msg[k] << 24 | msg[k + 1] << 16 | msg[k + 2] << 8 | msg[k + 3];
          else
            w = msg[k + 3] << 24 | msg[k + 2] << 16 | msg[k + 1] << 8 | msg[k];
          res[i] = w >>> 0;
        }
        return res;
      }
      exports.join32 = join32;
      function split32(msg, endian) {
        var res = new Array(msg.length * 4);
        for (var i = 0, k = 0; i < msg.length; i++, k += 4) {
          var m = msg[i];
          if (endian === "big") {
            res[k] = m >>> 24;
            res[k + 1] = m >>> 16 & 255;
            res[k + 2] = m >>> 8 & 255;
            res[k + 3] = m & 255;
          } else {
            res[k + 3] = m >>> 24;
            res[k + 2] = m >>> 16 & 255;
            res[k + 1] = m >>> 8 & 255;
            res[k] = m & 255;
          }
        }
        return res;
      }
      exports.split32 = split32;
      function rotr32(w, b) {
        return w >>> b | w << 32 - b;
      }
      exports.rotr32 = rotr32;
      function rotl32(w, b) {
        return w << b | w >>> 32 - b;
      }
      exports.rotl32 = rotl32;
      function sum32(a, b) {
        return a + b >>> 0;
      }
      exports.sum32 = sum32;
      function sum32_3(a, b, c) {
        return a + b + c >>> 0;
      }
      exports.sum32_3 = sum32_3;
      function sum32_4(a, b, c, d) {
        return a + b + c + d >>> 0;
      }
      exports.sum32_4 = sum32_4;
      function sum32_5(a, b, c, d, e) {
        return a + b + c + d + e >>> 0;
      }
      exports.sum32_5 = sum32_5;
      function sum64(buf, pos, ah, al) {
        var bh = buf[pos];
        var bl = buf[pos + 1];
        var lo = al + bl >>> 0;
        var hi = (lo < al ? 1 : 0) + ah + bh;
        buf[pos] = hi >>> 0;
        buf[pos + 1] = lo;
      }
      exports.sum64 = sum64;
      function sum64_hi(ah, al, bh, bl) {
        var lo = al + bl >>> 0;
        var hi = (lo < al ? 1 : 0) + ah + bh;
        return hi >>> 0;
      }
      exports.sum64_hi = sum64_hi;
      function sum64_lo(ah, al, bh, bl) {
        var lo = al + bl;
        return lo >>> 0;
      }
      exports.sum64_lo = sum64_lo;
      function sum64_4_hi(ah, al, bh, bl, ch, cl, dh, dl) {
        var carry = 0;
        var lo = al;
        lo = lo + bl >>> 0;
        carry += lo < al ? 1 : 0;
        lo = lo + cl >>> 0;
        carry += lo < cl ? 1 : 0;
        lo = lo + dl >>> 0;
        carry += lo < dl ? 1 : 0;
        var hi = ah + bh + ch + dh + carry;
        return hi >>> 0;
      }
      exports.sum64_4_hi = sum64_4_hi;
      function sum64_4_lo(ah, al, bh, bl, ch, cl, dh, dl) {
        var lo = al + bl + cl + dl;
        return lo >>> 0;
      }
      exports.sum64_4_lo = sum64_4_lo;
      function sum64_5_hi(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
        var carry = 0;
        var lo = al;
        lo = lo + bl >>> 0;
        carry += lo < al ? 1 : 0;
        lo = lo + cl >>> 0;
        carry += lo < cl ? 1 : 0;
        lo = lo + dl >>> 0;
        carry += lo < dl ? 1 : 0;
        lo = lo + el >>> 0;
        carry += lo < el ? 1 : 0;
        var hi = ah + bh + ch + dh + eh + carry;
        return hi >>> 0;
      }
      exports.sum64_5_hi = sum64_5_hi;
      function sum64_5_lo(ah, al, bh, bl, ch, cl, dh, dl, eh, el) {
        var lo = al + bl + cl + dl + el;
        return lo >>> 0;
      }
      exports.sum64_5_lo = sum64_5_lo;
      function rotr64_hi(ah, al, num) {
        var r = al << 32 - num | ah >>> num;
        return r >>> 0;
      }
      exports.rotr64_hi = rotr64_hi;
      function rotr64_lo(ah, al, num) {
        var r = ah << 32 - num | al >>> num;
        return r >>> 0;
      }
      exports.rotr64_lo = rotr64_lo;
      function shr64_hi(ah, al, num) {
        return ah >>> num;
      }
      exports.shr64_hi = shr64_hi;
      function shr64_lo(ah, al, num) {
        var r = ah << 32 - num | al >>> num;
        return r >>> 0;
      }
      exports.shr64_lo = shr64_lo;
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/common.js
  var require_common = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/common.js"(exports) {
      "use strict";
      var utils = require_utils3();
      var assert3 = require_minimalistic_assert();
      function BlockHash() {
        this.pending = null;
        this.pendingTotal = 0;
        this.blockSize = this.constructor.blockSize;
        this.outSize = this.constructor.outSize;
        this.hmacStrength = this.constructor.hmacStrength;
        this.padLength = this.constructor.padLength / 8;
        this.endian = "big";
        this._delta8 = this.blockSize / 8;
        this._delta32 = this.blockSize / 32;
      }
      exports.BlockHash = BlockHash;
      BlockHash.prototype.update = function update(msg, enc) {
        msg = utils.toArray(msg, enc);
        if (!this.pending)
          this.pending = msg;
        else
          this.pending = this.pending.concat(msg);
        this.pendingTotal += msg.length;
        if (this.pending.length >= this._delta8) {
          msg = this.pending;
          var r = msg.length % this._delta8;
          this.pending = msg.slice(msg.length - r, msg.length);
          if (this.pending.length === 0)
            this.pending = null;
          msg = utils.join32(msg, 0, msg.length - r, this.endian);
          for (var i = 0; i < msg.length; i += this._delta32)
            this._update(msg, i, i + this._delta32);
        }
        return this;
      };
      BlockHash.prototype.digest = function digest(enc) {
        this.update(this._pad());
        assert3(this.pending === null);
        return this._digest(enc);
      };
      BlockHash.prototype._pad = function pad() {
        var len = this.pendingTotal;
        var bytes2 = this._delta8;
        var k = bytes2 - (len + this.padLength) % bytes2;
        var res = new Array(k + this.padLength);
        res[0] = 128;
        for (var i = 1; i < k; i++)
          res[i] = 0;
        len <<= 3;
        if (this.endian === "big") {
          for (var t = 8; t < this.padLength; t++)
            res[i++] = 0;
          res[i++] = 0;
          res[i++] = 0;
          res[i++] = 0;
          res[i++] = 0;
          res[i++] = len >>> 24 & 255;
          res[i++] = len >>> 16 & 255;
          res[i++] = len >>> 8 & 255;
          res[i++] = len & 255;
        } else {
          res[i++] = len & 255;
          res[i++] = len >>> 8 & 255;
          res[i++] = len >>> 16 & 255;
          res[i++] = len >>> 24 & 255;
          res[i++] = 0;
          res[i++] = 0;
          res[i++] = 0;
          res[i++] = 0;
          for (t = 8; t < this.padLength; t++)
            res[i++] = 0;
        }
        return res;
      };
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/common.js
  var require_common2 = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/common.js"(exports) {
      "use strict";
      var utils = require_utils3();
      var rotr32 = utils.rotr32;
      function ft_1(s, x, y, z) {
        if (s === 0)
          return ch32(x, y, z);
        if (s === 1 || s === 3)
          return p32(x, y, z);
        if (s === 2)
          return maj32(x, y, z);
      }
      exports.ft_1 = ft_1;
      function ch32(x, y, z) {
        return x & y ^ ~x & z;
      }
      exports.ch32 = ch32;
      function maj32(x, y, z) {
        return x & y ^ x & z ^ y & z;
      }
      exports.maj32 = maj32;
      function p32(x, y, z) {
        return x ^ y ^ z;
      }
      exports.p32 = p32;
      function s0_256(x) {
        return rotr32(x, 2) ^ rotr32(x, 13) ^ rotr32(x, 22);
      }
      exports.s0_256 = s0_256;
      function s1_256(x) {
        return rotr32(x, 6) ^ rotr32(x, 11) ^ rotr32(x, 25);
      }
      exports.s1_256 = s1_256;
      function g0_256(x) {
        return rotr32(x, 7) ^ rotr32(x, 18) ^ x >>> 3;
      }
      exports.g0_256 = g0_256;
      function g1_256(x) {
        return rotr32(x, 17) ^ rotr32(x, 19) ^ x >>> 10;
      }
      exports.g1_256 = g1_256;
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/1.js
  var require__ = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/1.js"(exports, module2) {
      "use strict";
      var utils = require_utils3();
      var common = require_common();
      var shaCommon = require_common2();
      var rotl32 = utils.rotl32;
      var sum32 = utils.sum32;
      var sum32_5 = utils.sum32_5;
      var ft_1 = shaCommon.ft_1;
      var BlockHash = common.BlockHash;
      var sha1_K = [
        1518500249,
        1859775393,
        2400959708,
        3395469782
      ];
      function SHA1() {
        if (!(this instanceof SHA1))
          return new SHA1();
        BlockHash.call(this);
        this.h = [
          1732584193,
          4023233417,
          2562383102,
          271733878,
          3285377520
        ];
        this.W = new Array(80);
      }
      utils.inherits(SHA1, BlockHash);
      module2.exports = SHA1;
      SHA1.blockSize = 512;
      SHA1.outSize = 160;
      SHA1.hmacStrength = 80;
      SHA1.padLength = 64;
      SHA1.prototype._update = function _update(msg, start) {
        var W = this.W;
        for (var i = 0; i < 16; i++)
          W[i] = msg[start + i];
        for (; i < W.length; i++)
          W[i] = rotl32(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        var a = this.h[0];
        var b = this.h[1];
        var c = this.h[2];
        var d = this.h[3];
        var e = this.h[4];
        for (i = 0; i < W.length; i++) {
          var s = ~~(i / 20);
          var t = sum32_5(rotl32(a, 5), ft_1(s, b, c, d), e, W[i], sha1_K[s]);
          e = d;
          d = c;
          c = rotl32(b, 30);
          b = a;
          a = t;
        }
        this.h[0] = sum32(this.h[0], a);
        this.h[1] = sum32(this.h[1], b);
        this.h[2] = sum32(this.h[2], c);
        this.h[3] = sum32(this.h[3], d);
        this.h[4] = sum32(this.h[4], e);
      };
      SHA1.prototype._digest = function digest(enc) {
        if (enc === "hex")
          return utils.toHex32(this.h, "big");
        else
          return utils.split32(this.h, "big");
      };
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/256.js
  var require__2 = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/256.js"(exports, module2) {
      "use strict";
      var utils = require_utils3();
      var common = require_common();
      var shaCommon = require_common2();
      var assert3 = require_minimalistic_assert();
      var sum32 = utils.sum32;
      var sum32_4 = utils.sum32_4;
      var sum32_5 = utils.sum32_5;
      var ch32 = shaCommon.ch32;
      var maj32 = shaCommon.maj32;
      var s0_256 = shaCommon.s0_256;
      var s1_256 = shaCommon.s1_256;
      var g0_256 = shaCommon.g0_256;
      var g1_256 = shaCommon.g1_256;
      var BlockHash = common.BlockHash;
      var sha256_K = [
        1116352408,
        1899447441,
        3049323471,
        3921009573,
        961987163,
        1508970993,
        2453635748,
        2870763221,
        3624381080,
        310598401,
        607225278,
        1426881987,
        1925078388,
        2162078206,
        2614888103,
        3248222580,
        3835390401,
        4022224774,
        264347078,
        604807628,
        770255983,
        1249150122,
        1555081692,
        1996064986,
        2554220882,
        2821834349,
        2952996808,
        3210313671,
        3336571891,
        3584528711,
        113926993,
        338241895,
        666307205,
        773529912,
        1294757372,
        1396182291,
        1695183700,
        1986661051,
        2177026350,
        2456956037,
        2730485921,
        2820302411,
        3259730800,
        3345764771,
        3516065817,
        3600352804,
        4094571909,
        275423344,
        430227734,
        506948616,
        659060556,
        883997877,
        958139571,
        1322822218,
        1537002063,
        1747873779,
        1955562222,
        2024104815,
        2227730452,
        2361852424,
        2428436474,
        2756734187,
        3204031479,
        3329325298
      ];
      function SHA2562() {
        if (!(this instanceof SHA2562))
          return new SHA2562();
        BlockHash.call(this);
        this.h = [
          1779033703,
          3144134277,
          1013904242,
          2773480762,
          1359893119,
          2600822924,
          528734635,
          1541459225
        ];
        this.k = sha256_K;
        this.W = new Array(64);
      }
      utils.inherits(SHA2562, BlockHash);
      module2.exports = SHA2562;
      SHA2562.blockSize = 512;
      SHA2562.outSize = 256;
      SHA2562.hmacStrength = 192;
      SHA2562.padLength = 64;
      SHA2562.prototype._update = function _update(msg, start) {
        var W = this.W;
        for (var i = 0; i < 16; i++)
          W[i] = msg[start + i];
        for (; i < W.length; i++)
          W[i] = sum32_4(g1_256(W[i - 2]), W[i - 7], g0_256(W[i - 15]), W[i - 16]);
        var a = this.h[0];
        var b = this.h[1];
        var c = this.h[2];
        var d = this.h[3];
        var e = this.h[4];
        var f = this.h[5];
        var g = this.h[6];
        var h = this.h[7];
        assert3(this.k.length === W.length);
        for (i = 0; i < W.length; i++) {
          var T1 = sum32_5(h, s1_256(e), ch32(e, f, g), this.k[i], W[i]);
          var T2 = sum32(s0_256(a), maj32(a, b, c));
          h = g;
          g = f;
          f = e;
          e = sum32(d, T1);
          d = c;
          c = b;
          b = a;
          a = sum32(T1, T2);
        }
        this.h[0] = sum32(this.h[0], a);
        this.h[1] = sum32(this.h[1], b);
        this.h[2] = sum32(this.h[2], c);
        this.h[3] = sum32(this.h[3], d);
        this.h[4] = sum32(this.h[4], e);
        this.h[5] = sum32(this.h[5], f);
        this.h[6] = sum32(this.h[6], g);
        this.h[7] = sum32(this.h[7], h);
      };
      SHA2562.prototype._digest = function digest(enc) {
        if (enc === "hex")
          return utils.toHex32(this.h, "big");
        else
          return utils.split32(this.h, "big");
      };
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/224.js
  var require__3 = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/224.js"(exports, module2) {
      "use strict";
      var utils = require_utils3();
      var SHA2562 = require__2();
      function SHA2242() {
        if (!(this instanceof SHA2242))
          return new SHA2242();
        SHA2562.call(this);
        this.h = [
          3238371032,
          914150663,
          812702999,
          4144912697,
          4290775857,
          1750603025,
          1694076839,
          3204075428
        ];
      }
      utils.inherits(SHA2242, SHA2562);
      module2.exports = SHA2242;
      SHA2242.blockSize = 512;
      SHA2242.outSize = 224;
      SHA2242.hmacStrength = 192;
      SHA2242.padLength = 64;
      SHA2242.prototype._digest = function digest(enc) {
        if (enc === "hex")
          return utils.toHex32(this.h.slice(0, 7), "big");
        else
          return utils.split32(this.h.slice(0, 7), "big");
      };
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/512.js
  var require__4 = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/512.js"(exports, module2) {
      "use strict";
      var utils = require_utils3();
      var common = require_common();
      var assert3 = require_minimalistic_assert();
      var rotr64_hi = utils.rotr64_hi;
      var rotr64_lo = utils.rotr64_lo;
      var shr64_hi = utils.shr64_hi;
      var shr64_lo = utils.shr64_lo;
      var sum64 = utils.sum64;
      var sum64_hi = utils.sum64_hi;
      var sum64_lo = utils.sum64_lo;
      var sum64_4_hi = utils.sum64_4_hi;
      var sum64_4_lo = utils.sum64_4_lo;
      var sum64_5_hi = utils.sum64_5_hi;
      var sum64_5_lo = utils.sum64_5_lo;
      var BlockHash = common.BlockHash;
      var sha512_K = [
        1116352408,
        3609767458,
        1899447441,
        602891725,
        3049323471,
        3964484399,
        3921009573,
        2173295548,
        961987163,
        4081628472,
        1508970993,
        3053834265,
        2453635748,
        2937671579,
        2870763221,
        3664609560,
        3624381080,
        2734883394,
        310598401,
        1164996542,
        607225278,
        1323610764,
        1426881987,
        3590304994,
        1925078388,
        4068182383,
        2162078206,
        991336113,
        2614888103,
        633803317,
        3248222580,
        3479774868,
        3835390401,
        2666613458,
        4022224774,
        944711139,
        264347078,
        2341262773,
        604807628,
        2007800933,
        770255983,
        1495990901,
        1249150122,
        1856431235,
        1555081692,
        3175218132,
        1996064986,
        2198950837,
        2554220882,
        3999719339,
        2821834349,
        766784016,
        2952996808,
        2566594879,
        3210313671,
        3203337956,
        3336571891,
        1034457026,
        3584528711,
        2466948901,
        113926993,
        3758326383,
        338241895,
        168717936,
        666307205,
        1188179964,
        773529912,
        1546045734,
        1294757372,
        1522805485,
        1396182291,
        2643833823,
        1695183700,
        2343527390,
        1986661051,
        1014477480,
        2177026350,
        1206759142,
        2456956037,
        344077627,
        2730485921,
        1290863460,
        2820302411,
        3158454273,
        3259730800,
        3505952657,
        3345764771,
        106217008,
        3516065817,
        3606008344,
        3600352804,
        1432725776,
        4094571909,
        1467031594,
        275423344,
        851169720,
        430227734,
        3100823752,
        506948616,
        1363258195,
        659060556,
        3750685593,
        883997877,
        3785050280,
        958139571,
        3318307427,
        1322822218,
        3812723403,
        1537002063,
        2003034995,
        1747873779,
        3602036899,
        1955562222,
        1575990012,
        2024104815,
        1125592928,
        2227730452,
        2716904306,
        2361852424,
        442776044,
        2428436474,
        593698344,
        2756734187,
        3733110249,
        3204031479,
        2999351573,
        3329325298,
        3815920427,
        3391569614,
        3928383900,
        3515267271,
        566280711,
        3940187606,
        3454069534,
        4118630271,
        4000239992,
        116418474,
        1914138554,
        174292421,
        2731055270,
        289380356,
        3203993006,
        460393269,
        320620315,
        685471733,
        587496836,
        852142971,
        1086792851,
        1017036298,
        365543100,
        1126000580,
        2618297676,
        1288033470,
        3409855158,
        1501505948,
        4234509866,
        1607167915,
        987167468,
        1816402316,
        1246189591
      ];
      function SHA512() {
        if (!(this instanceof SHA512))
          return new SHA512();
        BlockHash.call(this);
        this.h = [
          1779033703,
          4089235720,
          3144134277,
          2227873595,
          1013904242,
          4271175723,
          2773480762,
          1595750129,
          1359893119,
          2917565137,
          2600822924,
          725511199,
          528734635,
          4215389547,
          1541459225,
          327033209
        ];
        this.k = sha512_K;
        this.W = new Array(160);
      }
      utils.inherits(SHA512, BlockHash);
      module2.exports = SHA512;
      SHA512.blockSize = 1024;
      SHA512.outSize = 512;
      SHA512.hmacStrength = 192;
      SHA512.padLength = 128;
      SHA512.prototype._prepareBlock = function _prepareBlock(msg, start) {
        var W = this.W;
        for (var i = 0; i < 32; i++)
          W[i] = msg[start + i];
        for (; i < W.length; i += 2) {
          var c0_hi = g1_512_hi(W[i - 4], W[i - 3]);
          var c0_lo = g1_512_lo(W[i - 4], W[i - 3]);
          var c1_hi = W[i - 14];
          var c1_lo = W[i - 13];
          var c2_hi = g0_512_hi(W[i - 30], W[i - 29]);
          var c2_lo = g0_512_lo(W[i - 30], W[i - 29]);
          var c3_hi = W[i - 32];
          var c3_lo = W[i - 31];
          W[i] = sum64_4_hi(
            c0_hi,
            c0_lo,
            c1_hi,
            c1_lo,
            c2_hi,
            c2_lo,
            c3_hi,
            c3_lo
          );
          W[i + 1] = sum64_4_lo(
            c0_hi,
            c0_lo,
            c1_hi,
            c1_lo,
            c2_hi,
            c2_lo,
            c3_hi,
            c3_lo
          );
        }
      };
      SHA512.prototype._update = function _update(msg, start) {
        this._prepareBlock(msg, start);
        var W = this.W;
        var ah = this.h[0];
        var al = this.h[1];
        var bh = this.h[2];
        var bl = this.h[3];
        var ch = this.h[4];
        var cl = this.h[5];
        var dh = this.h[6];
        var dl = this.h[7];
        var eh = this.h[8];
        var el = this.h[9];
        var fh = this.h[10];
        var fl = this.h[11];
        var gh = this.h[12];
        var gl = this.h[13];
        var hh = this.h[14];
        var hl = this.h[15];
        assert3(this.k.length === W.length);
        for (var i = 0; i < W.length; i += 2) {
          var c0_hi = hh;
          var c0_lo = hl;
          var c1_hi = s1_512_hi(eh, el);
          var c1_lo = s1_512_lo(eh, el);
          var c2_hi = ch64_hi(eh, el, fh, fl, gh, gl);
          var c2_lo = ch64_lo(eh, el, fh, fl, gh, gl);
          var c3_hi = this.k[i];
          var c3_lo = this.k[i + 1];
          var c4_hi = W[i];
          var c4_lo = W[i + 1];
          var T1_hi = sum64_5_hi(
            c0_hi,
            c0_lo,
            c1_hi,
            c1_lo,
            c2_hi,
            c2_lo,
            c3_hi,
            c3_lo,
            c4_hi,
            c4_lo
          );
          var T1_lo = sum64_5_lo(
            c0_hi,
            c0_lo,
            c1_hi,
            c1_lo,
            c2_hi,
            c2_lo,
            c3_hi,
            c3_lo,
            c4_hi,
            c4_lo
          );
          c0_hi = s0_512_hi(ah, al);
          c0_lo = s0_512_lo(ah, al);
          c1_hi = maj64_hi(ah, al, bh, bl, ch, cl);
          c1_lo = maj64_lo(ah, al, bh, bl, ch, cl);
          var T2_hi = sum64_hi(c0_hi, c0_lo, c1_hi, c1_lo);
          var T2_lo = sum64_lo(c0_hi, c0_lo, c1_hi, c1_lo);
          hh = gh;
          hl = gl;
          gh = fh;
          gl = fl;
          fh = eh;
          fl = el;
          eh = sum64_hi(dh, dl, T1_hi, T1_lo);
          el = sum64_lo(dl, dl, T1_hi, T1_lo);
          dh = ch;
          dl = cl;
          ch = bh;
          cl = bl;
          bh = ah;
          bl = al;
          ah = sum64_hi(T1_hi, T1_lo, T2_hi, T2_lo);
          al = sum64_lo(T1_hi, T1_lo, T2_hi, T2_lo);
        }
        sum64(this.h, 0, ah, al);
        sum64(this.h, 2, bh, bl);
        sum64(this.h, 4, ch, cl);
        sum64(this.h, 6, dh, dl);
        sum64(this.h, 8, eh, el);
        sum64(this.h, 10, fh, fl);
        sum64(this.h, 12, gh, gl);
        sum64(this.h, 14, hh, hl);
      };
      SHA512.prototype._digest = function digest(enc) {
        if (enc === "hex")
          return utils.toHex32(this.h, "big");
        else
          return utils.split32(this.h, "big");
      };
      function ch64_hi(xh, xl, yh, yl, zh) {
        var r = xh & yh ^ ~xh & zh;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function ch64_lo(xh, xl, yh, yl, zh, zl) {
        var r = xl & yl ^ ~xl & zl;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function maj64_hi(xh, xl, yh, yl, zh) {
        var r = xh & yh ^ xh & zh ^ yh & zh;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function maj64_lo(xh, xl, yh, yl, zh, zl) {
        var r = xl & yl ^ xl & zl ^ yl & zl;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function s0_512_hi(xh, xl) {
        var c0_hi = rotr64_hi(xh, xl, 28);
        var c1_hi = rotr64_hi(xl, xh, 2);
        var c2_hi = rotr64_hi(xl, xh, 7);
        var r = c0_hi ^ c1_hi ^ c2_hi;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function s0_512_lo(xh, xl) {
        var c0_lo = rotr64_lo(xh, xl, 28);
        var c1_lo = rotr64_lo(xl, xh, 2);
        var c2_lo = rotr64_lo(xl, xh, 7);
        var r = c0_lo ^ c1_lo ^ c2_lo;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function s1_512_hi(xh, xl) {
        var c0_hi = rotr64_hi(xh, xl, 14);
        var c1_hi = rotr64_hi(xh, xl, 18);
        var c2_hi = rotr64_hi(xl, xh, 9);
        var r = c0_hi ^ c1_hi ^ c2_hi;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function s1_512_lo(xh, xl) {
        var c0_lo = rotr64_lo(xh, xl, 14);
        var c1_lo = rotr64_lo(xh, xl, 18);
        var c2_lo = rotr64_lo(xl, xh, 9);
        var r = c0_lo ^ c1_lo ^ c2_lo;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function g0_512_hi(xh, xl) {
        var c0_hi = rotr64_hi(xh, xl, 1);
        var c1_hi = rotr64_hi(xh, xl, 8);
        var c2_hi = shr64_hi(xh, xl, 7);
        var r = c0_hi ^ c1_hi ^ c2_hi;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function g0_512_lo(xh, xl) {
        var c0_lo = rotr64_lo(xh, xl, 1);
        var c1_lo = rotr64_lo(xh, xl, 8);
        var c2_lo = shr64_lo(xh, xl, 7);
        var r = c0_lo ^ c1_lo ^ c2_lo;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function g1_512_hi(xh, xl) {
        var c0_hi = rotr64_hi(xh, xl, 19);
        var c1_hi = rotr64_hi(xl, xh, 29);
        var c2_hi = shr64_hi(xh, xl, 6);
        var r = c0_hi ^ c1_hi ^ c2_hi;
        if (r < 0)
          r += 4294967296;
        return r;
      }
      function g1_512_lo(xh, xl) {
        var c0_lo = rotr64_lo(xh, xl, 19);
        var c1_lo = rotr64_lo(xl, xh, 29);
        var c2_lo = shr64_lo(xh, xl, 6);
        var r = c0_lo ^ c1_lo ^ c2_lo;
        if (r < 0)
          r += 4294967296;
        return r;
      }
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/384.js
  var require__5 = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha/384.js"(exports, module2) {
      "use strict";
      var utils = require_utils3();
      var SHA512 = require__4();
      function SHA384() {
        if (!(this instanceof SHA384))
          return new SHA384();
        SHA512.call(this);
        this.h = [
          3418070365,
          3238371032,
          1654270250,
          914150663,
          2438529370,
          812702999,
          355462360,
          4144912697,
          1731405415,
          4290775857,
          2394180231,
          1750603025,
          3675008525,
          1694076839,
          1203062813,
          3204075428
        ];
      }
      utils.inherits(SHA384, SHA512);
      module2.exports = SHA384;
      SHA384.blockSize = 1024;
      SHA384.outSize = 384;
      SHA384.hmacStrength = 192;
      SHA384.padLength = 128;
      SHA384.prototype._digest = function digest(enc) {
        if (enc === "hex")
          return utils.toHex32(this.h.slice(0, 12), "big");
        else
          return utils.split32(this.h.slice(0, 12), "big");
      };
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha.js
  var require_sha = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/sha.js"(exports) {
      "use strict";
      exports.sha1 = require__();
      exports.sha224 = require__3();
      exports.sha256 = require__2();
      exports.sha384 = require__5();
      exports.sha512 = require__4();
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/ripemd.js
  var require_ripemd = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/ripemd.js"(exports) {
      "use strict";
      var utils = require_utils3();
      var common = require_common();
      var rotl32 = utils.rotl32;
      var sum32 = utils.sum32;
      var sum32_3 = utils.sum32_3;
      var sum32_4 = utils.sum32_4;
      var BlockHash = common.BlockHash;
      function RIPEMD160() {
        if (!(this instanceof RIPEMD160))
          return new RIPEMD160();
        BlockHash.call(this);
        this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
        this.endian = "little";
      }
      utils.inherits(RIPEMD160, BlockHash);
      exports.ripemd160 = RIPEMD160;
      RIPEMD160.blockSize = 512;
      RIPEMD160.outSize = 160;
      RIPEMD160.hmacStrength = 192;
      RIPEMD160.padLength = 64;
      RIPEMD160.prototype._update = function update(msg, start) {
        var A = this.h[0];
        var B = this.h[1];
        var C = this.h[2];
        var D = this.h[3];
        var E = this.h[4];
        var Ah = A;
        var Bh = B;
        var Ch = C;
        var Dh = D;
        var Eh = E;
        for (var j = 0; j < 80; j++) {
          var T = sum32(
            rotl32(
              sum32_4(A, f(j, B, C, D), msg[r[j] + start], K(j)),
              s[j]
            ),
            E
          );
          A = E;
          E = D;
          D = rotl32(C, 10);
          C = B;
          B = T;
          T = sum32(
            rotl32(
              sum32_4(Ah, f(79 - j, Bh, Ch, Dh), msg[rh[j] + start], Kh(j)),
              sh[j]
            ),
            Eh
          );
          Ah = Eh;
          Eh = Dh;
          Dh = rotl32(Ch, 10);
          Ch = Bh;
          Bh = T;
        }
        T = sum32_3(this.h[1], C, Dh);
        this.h[1] = sum32_3(this.h[2], D, Eh);
        this.h[2] = sum32_3(this.h[3], E, Ah);
        this.h[3] = sum32_3(this.h[4], A, Bh);
        this.h[4] = sum32_3(this.h[0], B, Ch);
        this.h[0] = T;
      };
      RIPEMD160.prototype._digest = function digest(enc) {
        if (enc === "hex")
          return utils.toHex32(this.h, "little");
        else
          return utils.split32(this.h, "little");
      };
      function f(j, x, y, z) {
        if (j <= 15)
          return x ^ y ^ z;
        else if (j <= 31)
          return x & y | ~x & z;
        else if (j <= 47)
          return (x | ~y) ^ z;
        else if (j <= 63)
          return x & z | y & ~z;
        else
          return x ^ (y | ~z);
      }
      function K(j) {
        if (j <= 15)
          return 0;
        else if (j <= 31)
          return 1518500249;
        else if (j <= 47)
          return 1859775393;
        else if (j <= 63)
          return 2400959708;
        else
          return 2840853838;
      }
      function Kh(j) {
        if (j <= 15)
          return 1352829926;
        else if (j <= 31)
          return 1548603684;
        else if (j <= 47)
          return 1836072691;
        else if (j <= 63)
          return 2053994217;
        else
          return 0;
      }
      var r = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        7,
        4,
        13,
        1,
        10,
        6,
        15,
        3,
        12,
        0,
        9,
        5,
        2,
        14,
        11,
        8,
        3,
        10,
        14,
        4,
        9,
        15,
        8,
        1,
        2,
        7,
        0,
        6,
        13,
        11,
        5,
        12,
        1,
        9,
        11,
        10,
        0,
        8,
        12,
        4,
        13,
        3,
        7,
        15,
        14,
        5,
        6,
        2,
        4,
        0,
        5,
        9,
        7,
        12,
        2,
        10,
        14,
        1,
        3,
        8,
        11,
        6,
        15,
        13
      ];
      var rh = [
        5,
        14,
        7,
        0,
        9,
        2,
        11,
        4,
        13,
        6,
        15,
        8,
        1,
        10,
        3,
        12,
        6,
        11,
        3,
        7,
        0,
        13,
        5,
        10,
        14,
        15,
        8,
        12,
        4,
        9,
        1,
        2,
        15,
        5,
        1,
        3,
        7,
        14,
        6,
        9,
        11,
        8,
        12,
        2,
        10,
        0,
        4,
        13,
        8,
        6,
        4,
        1,
        3,
        11,
        15,
        0,
        5,
        12,
        2,
        13,
        9,
        7,
        10,
        14,
        12,
        15,
        10,
        4,
        1,
        5,
        8,
        7,
        6,
        2,
        13,
        14,
        0,
        3,
        9,
        11
      ];
      var s = [
        11,
        14,
        15,
        12,
        5,
        8,
        7,
        9,
        11,
        13,
        14,
        15,
        6,
        7,
        9,
        8,
        7,
        6,
        8,
        13,
        11,
        9,
        7,
        15,
        7,
        12,
        15,
        9,
        11,
        7,
        13,
        12,
        11,
        13,
        6,
        7,
        14,
        9,
        13,
        15,
        14,
        8,
        13,
        6,
        5,
        12,
        7,
        5,
        11,
        12,
        14,
        15,
        14,
        15,
        9,
        8,
        9,
        14,
        5,
        6,
        8,
        6,
        5,
        12,
        9,
        15,
        5,
        11,
        6,
        8,
        13,
        12,
        5,
        12,
        13,
        14,
        11,
        8,
        5,
        6
      ];
      var sh = [
        8,
        9,
        9,
        11,
        13,
        15,
        15,
        5,
        7,
        7,
        8,
        11,
        14,
        14,
        12,
        6,
        9,
        13,
        15,
        7,
        12,
        8,
        9,
        11,
        7,
        7,
        12,
        7,
        6,
        15,
        13,
        11,
        9,
        7,
        15,
        11,
        8,
        6,
        6,
        14,
        12,
        13,
        5,
        14,
        13,
        13,
        7,
        5,
        15,
        5,
        8,
        11,
        14,
        14,
        6,
        14,
        6,
        9,
        12,
        9,
        12,
        5,
        15,
        8,
        8,
        5,
        12,
        9,
        12,
        5,
        14,
        6,
        8,
        13,
        6,
        5,
        15,
        13,
        11,
        11
      ];
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/hmac.js
  var require_hmac = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash/hmac.js"(exports, module2) {
      "use strict";
      var utils = require_utils3();
      var assert3 = require_minimalistic_assert();
      function Hmac(hash3, key, enc) {
        if (!(this instanceof Hmac))
          return new Hmac(hash3, key, enc);
        this.Hash = hash3;
        this.blockSize = hash3.blockSize / 8;
        this.outSize = hash3.outSize / 8;
        this.inner = null;
        this.outer = null;
        this._init(utils.toArray(key, enc));
      }
      module2.exports = Hmac;
      Hmac.prototype._init = function init(key) {
        if (key.length > this.blockSize)
          key = new this.Hash().update(key).digest();
        assert3(key.length <= this.blockSize);
        for (var i = key.length; i < this.blockSize; i++)
          key.push(0);
        for (i = 0; i < key.length; i++)
          key[i] ^= 54;
        this.inner = new this.Hash().update(key);
        for (i = 0; i < key.length; i++)
          key[i] ^= 106;
        this.outer = new this.Hash().update(key);
      };
      Hmac.prototype.update = function update(msg, enc) {
        this.inner.update(msg, enc);
        return this;
      };
      Hmac.prototype.digest = function digest(enc) {
        this.outer.update(this.inner.digest());
        return this.outer.digest(enc);
      };
    }
  });

  // ../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash.js
  var require_hash = __commonJS({
    "../../node_modules/.pnpm/hash.js@1.1.7/node_modules/hash.js/lib/hash.js"(exports) {
      var hash3 = exports;
      hash3.utils = require_utils3();
      hash3.common = require_common();
      hash3.sha = require_sha();
      hash3.ripemd = require_ripemd();
      hash3.hmac = require_hmac();
      hash3.sha1 = hash3.sha.sha1;
      hash3.sha256 = hash3.sha.sha256;
      hash3.sha224 = hash3.sha.sha224;
      hash3.sha384 = hash3.sha.sha384;
      hash3.sha512 = hash3.sha.sha512;
      hash3.ripemd160 = hash3.ripemd.ripemd160;
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/precomputed/secp256k1.js
  var require_secp256k1 = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/precomputed/secp256k1.js"(exports, module2) {
      module2.exports = {
        doubles: {
          step: 4,
          points: [
            [
              "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a",
              "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"
            ],
            [
              "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508",
              "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"
            ],
            [
              "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739",
              "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"
            ],
            [
              "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640",
              "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"
            ],
            [
              "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c",
              "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"
            ],
            [
              "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda",
              "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"
            ],
            [
              "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa",
              "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"
            ],
            [
              "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0",
              "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"
            ],
            [
              "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d",
              "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"
            ],
            [
              "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d",
              "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"
            ],
            [
              "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1",
              "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"
            ],
            [
              "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0",
              "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"
            ],
            [
              "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047",
              "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"
            ],
            [
              "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862",
              "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"
            ],
            [
              "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7",
              "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"
            ],
            [
              "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd",
              "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"
            ],
            [
              "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83",
              "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"
            ],
            [
              "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a",
              "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"
            ],
            [
              "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8",
              "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"
            ],
            [
              "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d",
              "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"
            ],
            [
              "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725",
              "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"
            ],
            [
              "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754",
              "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"
            ],
            [
              "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c",
              "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"
            ],
            [
              "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6",
              "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"
            ],
            [
              "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39",
              "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"
            ],
            [
              "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891",
              "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"
            ],
            [
              "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b",
              "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"
            ],
            [
              "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03",
              "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"
            ],
            [
              "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d",
              "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"
            ],
            [
              "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070",
              "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"
            ],
            [
              "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4",
              "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"
            ],
            [
              "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da",
              "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"
            ],
            [
              "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11",
              "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"
            ],
            [
              "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e",
              "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"
            ],
            [
              "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41",
              "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"
            ],
            [
              "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef",
              "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"
            ],
            [
              "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8",
              "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"
            ],
            [
              "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d",
              "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"
            ],
            [
              "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96",
              "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"
            ],
            [
              "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd",
              "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"
            ],
            [
              "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5",
              "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"
            ],
            [
              "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266",
              "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"
            ],
            [
              "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71",
              "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"
            ],
            [
              "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac",
              "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"
            ],
            [
              "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751",
              "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"
            ],
            [
              "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e",
              "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"
            ],
            [
              "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241",
              "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"
            ],
            [
              "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3",
              "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"
            ],
            [
              "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f",
              "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"
            ],
            [
              "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19",
              "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"
            ],
            [
              "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be",
              "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"
            ],
            [
              "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9",
              "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"
            ],
            [
              "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2",
              "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"
            ],
            [
              "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13",
              "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"
            ],
            [
              "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c",
              "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"
            ],
            [
              "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba",
              "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"
            ],
            [
              "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151",
              "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"
            ],
            [
              "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073",
              "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"
            ],
            [
              "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458",
              "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"
            ],
            [
              "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b",
              "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"
            ],
            [
              "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366",
              "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"
            ],
            [
              "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa",
              "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"
            ],
            [
              "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0",
              "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"
            ],
            [
              "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787",
              "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"
            ],
            [
              "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e",
              "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"
            ]
          ]
        },
        naf: {
          wnd: 7,
          points: [
            [
              "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9",
              "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"
            ],
            [
              "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4",
              "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"
            ],
            [
              "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc",
              "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"
            ],
            [
              "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe",
              "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"
            ],
            [
              "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb",
              "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"
            ],
            [
              "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8",
              "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"
            ],
            [
              "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e",
              "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"
            ],
            [
              "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34",
              "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"
            ],
            [
              "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c",
              "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"
            ],
            [
              "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5",
              "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"
            ],
            [
              "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f",
              "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"
            ],
            [
              "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714",
              "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"
            ],
            [
              "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729",
              "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"
            ],
            [
              "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db",
              "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"
            ],
            [
              "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4",
              "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"
            ],
            [
              "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5",
              "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"
            ],
            [
              "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479",
              "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"
            ],
            [
              "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d",
              "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"
            ],
            [
              "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f",
              "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"
            ],
            [
              "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb",
              "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"
            ],
            [
              "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9",
              "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"
            ],
            [
              "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963",
              "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"
            ],
            [
              "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74",
              "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"
            ],
            [
              "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530",
              "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"
            ],
            [
              "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b",
              "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"
            ],
            [
              "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247",
              "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"
            ],
            [
              "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1",
              "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"
            ],
            [
              "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120",
              "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"
            ],
            [
              "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435",
              "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"
            ],
            [
              "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18",
              "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"
            ],
            [
              "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8",
              "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"
            ],
            [
              "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb",
              "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"
            ],
            [
              "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f",
              "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"
            ],
            [
              "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143",
              "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"
            ],
            [
              "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba",
              "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"
            ],
            [
              "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45",
              "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"
            ],
            [
              "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a",
              "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"
            ],
            [
              "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e",
              "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"
            ],
            [
              "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8",
              "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"
            ],
            [
              "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c",
              "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"
            ],
            [
              "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519",
              "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"
            ],
            [
              "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab",
              "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"
            ],
            [
              "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca",
              "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"
            ],
            [
              "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf",
              "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"
            ],
            [
              "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610",
              "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"
            ],
            [
              "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4",
              "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"
            ],
            [
              "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c",
              "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"
            ],
            [
              "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940",
              "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"
            ],
            [
              "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980",
              "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"
            ],
            [
              "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3",
              "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"
            ],
            [
              "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf",
              "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"
            ],
            [
              "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63",
              "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"
            ],
            [
              "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448",
              "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"
            ],
            [
              "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf",
              "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"
            ],
            [
              "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5",
              "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"
            ],
            [
              "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6",
              "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"
            ],
            [
              "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5",
              "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"
            ],
            [
              "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99",
              "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"
            ],
            [
              "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51",
              "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"
            ],
            [
              "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5",
              "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"
            ],
            [
              "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5",
              "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"
            ],
            [
              "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997",
              "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"
            ],
            [
              "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881",
              "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"
            ],
            [
              "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5",
              "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"
            ],
            [
              "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66",
              "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"
            ],
            [
              "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726",
              "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"
            ],
            [
              "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede",
              "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"
            ],
            [
              "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94",
              "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"
            ],
            [
              "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31",
              "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"
            ],
            [
              "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51",
              "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"
            ],
            [
              "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252",
              "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"
            ],
            [
              "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5",
              "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"
            ],
            [
              "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b",
              "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"
            ],
            [
              "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4",
              "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"
            ],
            [
              "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f",
              "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"
            ],
            [
              "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889",
              "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"
            ],
            [
              "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246",
              "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"
            ],
            [
              "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984",
              "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"
            ],
            [
              "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a",
              "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"
            ],
            [
              "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030",
              "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"
            ],
            [
              "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197",
              "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"
            ],
            [
              "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593",
              "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"
            ],
            [
              "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef",
              "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"
            ],
            [
              "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38",
              "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"
            ],
            [
              "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a",
              "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"
            ],
            [
              "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111",
              "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"
            ],
            [
              "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502",
              "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"
            ],
            [
              "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea",
              "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"
            ],
            [
              "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26",
              "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"
            ],
            [
              "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986",
              "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"
            ],
            [
              "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e",
              "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"
            ],
            [
              "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4",
              "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"
            ],
            [
              "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda",
              "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"
            ],
            [
              "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859",
              "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"
            ],
            [
              "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f",
              "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"
            ],
            [
              "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c",
              "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"
            ],
            [
              "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942",
              "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"
            ],
            [
              "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a",
              "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"
            ],
            [
              "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80",
              "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"
            ],
            [
              "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d",
              "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"
            ],
            [
              "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1",
              "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"
            ],
            [
              "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63",
              "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"
            ],
            [
              "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352",
              "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"
            ],
            [
              "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193",
              "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"
            ],
            [
              "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00",
              "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"
            ],
            [
              "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58",
              "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"
            ],
            [
              "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7",
              "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"
            ],
            [
              "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8",
              "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"
            ],
            [
              "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e",
              "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"
            ],
            [
              "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d",
              "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"
            ],
            [
              "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b",
              "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"
            ],
            [
              "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f",
              "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"
            ],
            [
              "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6",
              "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"
            ],
            [
              "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297",
              "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"
            ],
            [
              "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a",
              "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"
            ],
            [
              "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c",
              "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"
            ],
            [
              "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52",
              "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"
            ],
            [
              "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb",
              "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"
            ],
            [
              "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065",
              "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"
            ],
            [
              "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917",
              "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"
            ],
            [
              "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9",
              "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"
            ],
            [
              "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3",
              "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"
            ],
            [
              "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57",
              "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"
            ],
            [
              "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66",
              "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"
            ],
            [
              "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8",
              "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"
            ],
            [
              "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721",
              "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"
            ],
            [
              "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180",
              "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"
            ]
          ]
        }
      };
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curves.js
  var require_curves = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/curves.js"(exports) {
      "use strict";
      var curves = exports;
      var hash3 = require_hash();
      var curve = require_curve();
      var utils = require_utils2();
      var assert3 = utils.assert;
      function PresetCurve(options) {
        if (options.type === "short")
          this.curve = new curve.short(options);
        else if (options.type === "edwards")
          this.curve = new curve.edwards(options);
        else
          this.curve = new curve.mont(options);
        this.g = this.curve.g;
        this.n = this.curve.n;
        this.hash = options.hash;
        assert3(this.g.validate(), "Invalid curve");
        assert3(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
      }
      curves.PresetCurve = PresetCurve;
      function defineCurve(name, options) {
        Object.defineProperty(curves, name, {
          configurable: true,
          enumerable: true,
          get: function() {
            var curve2 = new PresetCurve(options);
            Object.defineProperty(curves, name, {
              configurable: true,
              enumerable: true,
              value: curve2
            });
            return curve2;
          }
        });
      }
      defineCurve("p192", {
        type: "short",
        prime: "p192",
        p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
        a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
        b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
        n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
        hash: hash3.sha256,
        gRed: false,
        g: [
          "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
          "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"
        ]
      });
      defineCurve("p224", {
        type: "short",
        prime: "p224",
        p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
        a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
        b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
        n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
        hash: hash3.sha256,
        gRed: false,
        g: [
          "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
          "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"
        ]
      });
      defineCurve("p256", {
        type: "short",
        prime: null,
        p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
        a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
        b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
        n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
        hash: hash3.sha256,
        gRed: false,
        g: [
          "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
          "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"
        ]
      });
      defineCurve("p384", {
        type: "short",
        prime: null,
        p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
        a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
        b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
        n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
        hash: hash3.sha384,
        gRed: false,
        g: [
          "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
          "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"
        ]
      });
      defineCurve("p521", {
        type: "short",
        prime: null,
        p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
        a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
        b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
        n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
        hash: hash3.sha512,
        gRed: false,
        g: [
          "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
          "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"
        ]
      });
      defineCurve("curve25519", {
        type: "mont",
        prime: "p25519",
        p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
        a: "76d06",
        b: "1",
        n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
        hash: hash3.sha256,
        gRed: false,
        g: [
          "9"
        ]
      });
      defineCurve("ed25519", {
        type: "edwards",
        prime: "p25519",
        p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
        a: "-1",
        c: "1",
        // -121665 * (121666^(-1)) (mod P)
        d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
        n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
        hash: hash3.sha256,
        gRed: false,
        g: [
          "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
          // 4/5
          "6666666666666666666666666666666666666666666666666666666666666658"
        ]
      });
      var pre;
      try {
        pre = require_secp256k1();
      } catch (e) {
        pre = void 0;
      }
      defineCurve("secp256k1", {
        type: "short",
        prime: "k256",
        p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
        a: "0",
        b: "7",
        n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
        h: "1",
        hash: hash3.sha256,
        // Precomputed endomorphism
        beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
        lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
        basis: [
          {
            a: "3086d221a7d46bcde86c90e49284eb15",
            b: "-e4437ed6010e88286f547fa90abfe4c3"
          },
          {
            a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
            b: "3086d221a7d46bcde86c90e49284eb15"
          }
        ],
        gRed: false,
        g: [
          "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
          "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
          pre
        ]
      });
    }
  });

  // ../../node_modules/.pnpm/hmac-drbg@1.0.1/node_modules/hmac-drbg/lib/hmac-drbg.js
  var require_hmac_drbg = __commonJS({
    "../../node_modules/.pnpm/hmac-drbg@1.0.1/node_modules/hmac-drbg/lib/hmac-drbg.js"(exports, module2) {
      "use strict";
      var hash3 = require_hash();
      var utils = require_utils();
      var assert3 = require_minimalistic_assert();
      function HmacDRBG(options) {
        if (!(this instanceof HmacDRBG))
          return new HmacDRBG(options);
        this.hash = options.hash;
        this.predResist = !!options.predResist;
        this.outLen = this.hash.outSize;
        this.minEntropy = options.minEntropy || this.hash.hmacStrength;
        this._reseed = null;
        this.reseedInterval = null;
        this.K = null;
        this.V = null;
        var entropy = utils.toArray(options.entropy, options.entropyEnc || "hex");
        var nonce = utils.toArray(options.nonce, options.nonceEnc || "hex");
        var pers = utils.toArray(options.pers, options.persEnc || "hex");
        assert3(
          entropy.length >= this.minEntropy / 8,
          "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
        );
        this._init(entropy, nonce, pers);
      }
      module2.exports = HmacDRBG;
      HmacDRBG.prototype._init = function init(entropy, nonce, pers) {
        var seed = entropy.concat(nonce).concat(pers);
        this.K = new Array(this.outLen / 8);
        this.V = new Array(this.outLen / 8);
        for (var i = 0; i < this.V.length; i++) {
          this.K[i] = 0;
          this.V[i] = 1;
        }
        this._update(seed);
        this._reseed = 1;
        this.reseedInterval = 281474976710656;
      };
      HmacDRBG.prototype._hmac = function hmac2() {
        return new hash3.hmac(this.hash, this.K);
      };
      HmacDRBG.prototype._update = function update(seed) {
        var kmac = this._hmac().update(this.V).update([0]);
        if (seed)
          kmac = kmac.update(seed);
        this.K = kmac.digest();
        this.V = this._hmac().update(this.V).digest();
        if (!seed)
          return;
        this.K = this._hmac().update(this.V).update([1]).update(seed).digest();
        this.V = this._hmac().update(this.V).digest();
      };
      HmacDRBG.prototype.reseed = function reseed(entropy, entropyEnc, add2, addEnc) {
        if (typeof entropyEnc !== "string") {
          addEnc = add2;
          add2 = entropyEnc;
          entropyEnc = null;
        }
        entropy = utils.toArray(entropy, entropyEnc);
        add2 = utils.toArray(add2, addEnc);
        assert3(
          entropy.length >= this.minEntropy / 8,
          "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
        );
        this._update(entropy.concat(add2 || []));
        this._reseed = 1;
      };
      HmacDRBG.prototype.generate = function generate(len, enc, add2, addEnc) {
        if (this._reseed > this.reseedInterval)
          throw new Error("Reseed is required");
        if (typeof enc !== "string") {
          addEnc = add2;
          add2 = enc;
          enc = null;
        }
        if (add2) {
          add2 = utils.toArray(add2, addEnc || "hex");
          this._update(add2);
        }
        var temp = [];
        while (temp.length < len) {
          this.V = this._hmac().update(this.V).digest();
          temp = temp.concat(this.V);
        }
        var res = temp.slice(0, len);
        this._update(add2);
        this._reseed++;
        return utils.encode(res, enc);
      };
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/ec/key.js
  var require_key = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/ec/key.js"(exports, module2) {
      "use strict";
      var BN2 = require_bn2();
      var utils = require_utils2();
      var assert3 = utils.assert;
      function KeyPair(ec, options) {
        this.ec = ec;
        this.priv = null;
        this.pub = null;
        if (options.priv)
          this._importPrivate(options.priv, options.privEnc);
        if (options.pub)
          this._importPublic(options.pub, options.pubEnc);
      }
      module2.exports = KeyPair;
      KeyPair.fromPublic = function fromPublic(ec, pub, enc) {
        if (pub instanceof KeyPair)
          return pub;
        return new KeyPair(ec, {
          pub,
          pubEnc: enc
        });
      };
      KeyPair.fromPrivate = function fromPrivate(ec, priv, enc) {
        if (priv instanceof KeyPair)
          return priv;
        return new KeyPair(ec, {
          priv,
          privEnc: enc
        });
      };
      KeyPair.prototype.validate = function validate() {
        var pub = this.getPublic();
        if (pub.isInfinity())
          return { result: false, reason: "Invalid public key" };
        if (!pub.validate())
          return { result: false, reason: "Public key is not a point" };
        if (!pub.mul(this.ec.curve.n).isInfinity())
          return { result: false, reason: "Public key * N != O" };
        return { result: true, reason: null };
      };
      KeyPair.prototype.getPublic = function getPublic(compact, enc) {
        if (typeof compact === "string") {
          enc = compact;
          compact = null;
        }
        if (!this.pub)
          this.pub = this.ec.g.mul(this.priv);
        if (!enc)
          return this.pub;
        return this.pub.encode(enc, compact);
      };
      KeyPair.prototype.getPrivate = function getPrivate(enc) {
        if (enc === "hex")
          return this.priv.toString(16, 2);
        else
          return this.priv;
      };
      KeyPair.prototype._importPrivate = function _importPrivate(key, enc) {
        this.priv = new BN2(key, enc || 16);
        this.priv = this.priv.umod(this.ec.curve.n);
      };
      KeyPair.prototype._importPublic = function _importPublic(key, enc) {
        if (key.x || key.y) {
          if (this.ec.curve.type === "mont") {
            assert3(key.x, "Need x coordinate");
          } else if (this.ec.curve.type === "short" || this.ec.curve.type === "edwards") {
            assert3(key.x && key.y, "Need both x and y coordinate");
          }
          this.pub = this.ec.curve.point(key.x, key.y);
          return;
        }
        this.pub = this.ec.curve.decodePoint(key, enc);
      };
      KeyPair.prototype.derive = function derive(pub) {
        if (!pub.validate()) {
          assert3(pub.validate(), "public point not validated");
        }
        return pub.mul(this.priv).getX();
      };
      KeyPair.prototype.sign = function sign(msg, enc, options) {
        return this.ec.sign(msg, this, enc, options);
      };
      KeyPair.prototype.verify = function verify(msg, signature) {
        return this.ec.verify(msg, signature, this);
      };
      KeyPair.prototype.inspect = function inspect() {
        return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >";
      };
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/ec/signature.js
  var require_signature = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/ec/signature.js"(exports, module2) {
      "use strict";
      var BN2 = require_bn2();
      var utils = require_utils2();
      var assert3 = utils.assert;
      function Signature2(options, enc) {
        if (options instanceof Signature2)
          return options;
        if (this._importDER(options, enc))
          return;
        assert3(options.r && options.s, "Signature without r or s");
        this.r = new BN2(options.r, 16);
        this.s = new BN2(options.s, 16);
        if (options.recoveryParam === void 0)
          this.recoveryParam = null;
        else
          this.recoveryParam = options.recoveryParam;
      }
      module2.exports = Signature2;
      function Position() {
        this.place = 0;
      }
      function getLength(buf, p) {
        var initial = buf[p.place++];
        if (!(initial & 128)) {
          return initial;
        }
        var octetLen = initial & 15;
        if (octetLen === 0 || octetLen > 4) {
          return false;
        }
        var val = 0;
        for (var i = 0, off = p.place; i < octetLen; i++, off++) {
          val <<= 8;
          val |= buf[off];
          val >>>= 0;
        }
        if (val <= 127) {
          return false;
        }
        p.place = off;
        return val;
      }
      function rmPadding(buf) {
        var i = 0;
        var len = buf.length - 1;
        while (!buf[i] && !(buf[i + 1] & 128) && i < len) {
          i++;
        }
        if (i === 0) {
          return buf;
        }
        return buf.slice(i);
      }
      Signature2.prototype._importDER = function _importDER(data, enc) {
        data = utils.toArray(data, enc);
        var p = new Position();
        if (data[p.place++] !== 48) {
          return false;
        }
        var len = getLength(data, p);
        if (len === false) {
          return false;
        }
        if (len + p.place !== data.length) {
          return false;
        }
        if (data[p.place++] !== 2) {
          return false;
        }
        var rlen = getLength(data, p);
        if (rlen === false) {
          return false;
        }
        var r = data.slice(p.place, rlen + p.place);
        p.place += rlen;
        if (data[p.place++] !== 2) {
          return false;
        }
        var slen = getLength(data, p);
        if (slen === false) {
          return false;
        }
        if (data.length !== slen + p.place) {
          return false;
        }
        var s = data.slice(p.place, slen + p.place);
        if (r[0] === 0) {
          if (r[1] & 128) {
            r = r.slice(1);
          } else {
            return false;
          }
        }
        if (s[0] === 0) {
          if (s[1] & 128) {
            s = s.slice(1);
          } else {
            return false;
          }
        }
        this.r = new BN2(r);
        this.s = new BN2(s);
        this.recoveryParam = null;
        return true;
      };
      function constructLength(arr, len) {
        if (len < 128) {
          arr.push(len);
          return;
        }
        var octets = 1 + (Math.log(len) / Math.LN2 >>> 3);
        arr.push(octets | 128);
        while (--octets) {
          arr.push(len >>> (octets << 3) & 255);
        }
        arr.push(len);
      }
      Signature2.prototype.toDER = function toDER(enc) {
        var r = this.r.toArray();
        var s = this.s.toArray();
        if (r[0] & 128)
          r = [0].concat(r);
        if (s[0] & 128)
          s = [0].concat(s);
        r = rmPadding(r);
        s = rmPadding(s);
        while (!s[0] && !(s[1] & 128)) {
          s = s.slice(1);
        }
        var arr = [2];
        constructLength(arr, r.length);
        arr = arr.concat(r);
        arr.push(2);
        constructLength(arr, s.length);
        var backHalf = arr.concat(s);
        var res = [48];
        constructLength(res, backHalf.length);
        res = res.concat(backHalf);
        return utils.encode(res, enc);
      };
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/ec/index.js
  var require_ec = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/ec/index.js"(exports, module2) {
      "use strict";
      var BN2 = require_bn2();
      var HmacDRBG = require_hmac_drbg();
      var utils = require_utils2();
      var curves = require_curves();
      var rand = require_brorand();
      var assert3 = utils.assert;
      var KeyPair = require_key();
      var Signature2 = require_signature();
      function EC2(options) {
        if (!(this instanceof EC2))
          return new EC2(options);
        if (typeof options === "string") {
          assert3(
            Object.prototype.hasOwnProperty.call(curves, options),
            "Unknown curve " + options
          );
          options = curves[options];
        }
        if (options instanceof curves.PresetCurve)
          options = { curve: options };
        this.curve = options.curve.curve;
        this.n = this.curve.n;
        this.nh = this.n.ushrn(1);
        this.g = this.curve.g;
        this.g = options.curve.g;
        this.g.precompute(options.curve.n.bitLength() + 1);
        this.hash = options.hash || options.curve.hash;
      }
      module2.exports = EC2;
      EC2.prototype.keyPair = function keyPair(options) {
        return new KeyPair(this, options);
      };
      EC2.prototype.keyFromPrivate = function keyFromPrivate(priv, enc) {
        return KeyPair.fromPrivate(this, priv, enc);
      };
      EC2.prototype.keyFromPublic = function keyFromPublic(pub, enc) {
        return KeyPair.fromPublic(this, pub, enc);
      };
      EC2.prototype.genKeyPair = function genKeyPair(options) {
        if (!options)
          options = {};
        var drbg = new HmacDRBG({
          hash: this.hash,
          pers: options.pers,
          persEnc: options.persEnc || "utf8",
          entropy: options.entropy || rand(this.hash.hmacStrength),
          entropyEnc: options.entropy && options.entropyEnc || "utf8",
          nonce: this.n.toArray()
        });
        var bytes2 = this.n.byteLength();
        var ns2 = this.n.sub(new BN2(2));
        for (; ; ) {
          var priv = new BN2(drbg.generate(bytes2));
          if (priv.cmp(ns2) > 0)
            continue;
          priv.iaddn(1);
          return this.keyFromPrivate(priv);
        }
      };
      EC2.prototype._truncateToN = function _truncateToN(msg, truncOnly) {
        var delta = msg.byteLength() * 8 - this.n.bitLength();
        if (delta > 0)
          msg = msg.ushrn(delta);
        if (!truncOnly && msg.cmp(this.n) >= 0)
          return msg.sub(this.n);
        else
          return msg;
      };
      EC2.prototype.sign = function sign(msg, key, enc, options) {
        if (typeof enc === "object") {
          options = enc;
          enc = null;
        }
        if (!options)
          options = {};
        key = this.keyFromPrivate(key, enc);
        msg = this._truncateToN(new BN2(msg, 16));
        var bytes2 = this.n.byteLength();
        var bkey = key.getPrivate().toArray("be", bytes2);
        var nonce = msg.toArray("be", bytes2);
        var drbg = new HmacDRBG({
          hash: this.hash,
          entropy: bkey,
          nonce,
          pers: options.pers,
          persEnc: options.persEnc || "utf8"
        });
        var ns1 = this.n.sub(new BN2(1));
        for (var iter = 0; ; iter++) {
          var k = options.k ? options.k(iter) : new BN2(drbg.generate(this.n.byteLength()));
          k = this._truncateToN(k, true);
          if (k.cmpn(1) <= 0 || k.cmp(ns1) >= 0)
            continue;
          var kp = this.g.mul(k);
          if (kp.isInfinity())
            continue;
          var kpX = kp.getX();
          var r = kpX.umod(this.n);
          if (r.cmpn(0) === 0)
            continue;
          var s = k.invm(this.n).mul(r.mul(key.getPrivate()).iadd(msg));
          s = s.umod(this.n);
          if (s.cmpn(0) === 0)
            continue;
          var recoveryParam = (kp.getY().isOdd() ? 1 : 0) | (kpX.cmp(r) !== 0 ? 2 : 0);
          if (options.canonical && s.cmp(this.nh) > 0) {
            s = this.n.sub(s);
            recoveryParam ^= 1;
          }
          return new Signature2({ r, s, recoveryParam });
        }
      };
      EC2.prototype.verify = function verify(msg, signature, key, enc) {
        msg = this._truncateToN(new BN2(msg, 16));
        key = this.keyFromPublic(key, enc);
        signature = new Signature2(signature, "hex");
        var r = signature.r;
        var s = signature.s;
        if (r.cmpn(1) < 0 || r.cmp(this.n) >= 0)
          return false;
        if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0)
          return false;
        var sinv = s.invm(this.n);
        var u1 = sinv.mul(msg).umod(this.n);
        var u2 = sinv.mul(r).umod(this.n);
        var p;
        if (!this.curve._maxwellTrick) {
          p = this.g.mulAdd(u1, key.getPublic(), u2);
          if (p.isInfinity())
            return false;
          return p.getX().umod(this.n).cmp(r) === 0;
        }
        p = this.g.jmulAdd(u1, key.getPublic(), u2);
        if (p.isInfinity())
          return false;
        return p.eqXToP(r);
      };
      EC2.prototype.recoverPubKey = function(msg, signature, j, enc) {
        assert3((3 & j) === j, "The recovery param is more than two bits");
        signature = new Signature2(signature, enc);
        var n = this.n;
        var e = new BN2(msg);
        var r = signature.r;
        var s = signature.s;
        var isYOdd = j & 1;
        var isSecondKey = j >> 1;
        if (r.cmp(this.curve.p.umod(this.curve.n)) >= 0 && isSecondKey)
          throw new Error("Unable to find sencond key candinate");
        if (isSecondKey)
          r = this.curve.pointFromX(r.add(this.curve.n), isYOdd);
        else
          r = this.curve.pointFromX(r, isYOdd);
        var rInv = signature.r.invm(n);
        var s1 = n.sub(e).mul(rInv).umod(n);
        var s2 = s.mul(rInv).umod(n);
        return this.g.mulAdd(s1, r, s2);
      };
      EC2.prototype.getKeyRecoveryParam = function(e, signature, Q, enc) {
        signature = new Signature2(signature, enc);
        if (signature.recoveryParam !== null)
          return signature.recoveryParam;
        for (var i = 0; i < 4; i++) {
          var Qprime;
          try {
            Qprime = this.recoverPubKey(e, signature, i);
          } catch (e2) {
            continue;
          }
          if (Qprime.eq(Q))
            return i;
        }
        throw new Error("Unable to find valid recovery factor");
      };
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/eddsa/key.js
  var require_key2 = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/eddsa/key.js"(exports, module2) {
      "use strict";
      var utils = require_utils2();
      var assert3 = utils.assert;
      var parseBytes = utils.parseBytes;
      var cachedProperty = utils.cachedProperty;
      function KeyPair(eddsa, params) {
        this.eddsa = eddsa;
        this._secret = parseBytes(params.secret);
        if (eddsa.isPoint(params.pub))
          this._pub = params.pub;
        else
          this._pubBytes = parseBytes(params.pub);
      }
      KeyPair.fromPublic = function fromPublic(eddsa, pub) {
        if (pub instanceof KeyPair)
          return pub;
        return new KeyPair(eddsa, { pub });
      };
      KeyPair.fromSecret = function fromSecret(eddsa, secret) {
        if (secret instanceof KeyPair)
          return secret;
        return new KeyPair(eddsa, { secret });
      };
      KeyPair.prototype.secret = function secret() {
        return this._secret;
      };
      cachedProperty(KeyPair, "pubBytes", function pubBytes() {
        return this.eddsa.encodePoint(this.pub());
      });
      cachedProperty(KeyPair, "pub", function pub() {
        if (this._pubBytes)
          return this.eddsa.decodePoint(this._pubBytes);
        return this.eddsa.g.mul(this.priv());
      });
      cachedProperty(KeyPair, "privBytes", function privBytes() {
        var eddsa = this.eddsa;
        var hash3 = this.hash();
        var lastIx = eddsa.encodingLength - 1;
        var a = hash3.slice(0, eddsa.encodingLength);
        a[0] &= 248;
        a[lastIx] &= 127;
        a[lastIx] |= 64;
        return a;
      });
      cachedProperty(KeyPair, "priv", function priv() {
        return this.eddsa.decodeInt(this.privBytes());
      });
      cachedProperty(KeyPair, "hash", function hash3() {
        return this.eddsa.hash().update(this.secret()).digest();
      });
      cachedProperty(KeyPair, "messagePrefix", function messagePrefix() {
        return this.hash().slice(this.eddsa.encodingLength);
      });
      KeyPair.prototype.sign = function sign(message) {
        assert3(this._secret, "KeyPair can only verify");
        return this.eddsa.sign(message, this);
      };
      KeyPair.prototype.verify = function verify(message, sig) {
        return this.eddsa.verify(message, sig, this);
      };
      KeyPair.prototype.getSecret = function getSecret(enc) {
        assert3(this._secret, "KeyPair is public only");
        return utils.encode(this.secret(), enc);
      };
      KeyPair.prototype.getPublic = function getPublic(enc) {
        return utils.encode(this.pubBytes(), enc);
      };
      module2.exports = KeyPair;
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/eddsa/signature.js
  var require_signature2 = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/eddsa/signature.js"(exports, module2) {
      "use strict";
      var BN2 = require_bn2();
      var utils = require_utils2();
      var assert3 = utils.assert;
      var cachedProperty = utils.cachedProperty;
      var parseBytes = utils.parseBytes;
      function Signature2(eddsa, sig) {
        this.eddsa = eddsa;
        if (typeof sig !== "object")
          sig = parseBytes(sig);
        if (Array.isArray(sig)) {
          sig = {
            R: sig.slice(0, eddsa.encodingLength),
            S: sig.slice(eddsa.encodingLength)
          };
        }
        assert3(sig.R && sig.S, "Signature without R or S");
        if (eddsa.isPoint(sig.R))
          this._R = sig.R;
        if (sig.S instanceof BN2)
          this._S = sig.S;
        this._Rencoded = Array.isArray(sig.R) ? sig.R : sig.Rencoded;
        this._Sencoded = Array.isArray(sig.S) ? sig.S : sig.Sencoded;
      }
      cachedProperty(Signature2, "S", function S() {
        return this.eddsa.decodeInt(this.Sencoded());
      });
      cachedProperty(Signature2, "R", function R() {
        return this.eddsa.decodePoint(this.Rencoded());
      });
      cachedProperty(Signature2, "Rencoded", function Rencoded() {
        return this.eddsa.encodePoint(this.R());
      });
      cachedProperty(Signature2, "Sencoded", function Sencoded() {
        return this.eddsa.encodeInt(this.S());
      });
      Signature2.prototype.toBytes = function toBytes3() {
        return this.Rencoded().concat(this.Sencoded());
      };
      Signature2.prototype.toHex = function toHex() {
        return utils.encode(this.toBytes(), "hex").toUpperCase();
      };
      module2.exports = Signature2;
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/eddsa/index.js
  var require_eddsa = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic/eddsa/index.js"(exports, module2) {
      "use strict";
      var hash3 = require_hash();
      var curves = require_curves();
      var utils = require_utils2();
      var assert3 = utils.assert;
      var parseBytes = utils.parseBytes;
      var KeyPair = require_key2();
      var Signature2 = require_signature2();
      function EDDSA(curve) {
        assert3(curve === "ed25519", "only tested with ed25519 so far");
        if (!(this instanceof EDDSA))
          return new EDDSA(curve);
        curve = curves[curve].curve;
        this.curve = curve;
        this.g = curve.g;
        this.g.precompute(curve.n.bitLength() + 1);
        this.pointClass = curve.point().constructor;
        this.encodingLength = Math.ceil(curve.n.bitLength() / 8);
        this.hash = hash3.sha512;
      }
      module2.exports = EDDSA;
      EDDSA.prototype.sign = function sign(message, secret) {
        message = parseBytes(message);
        var key = this.keyFromSecret(secret);
        var r = this.hashInt(key.messagePrefix(), message);
        var R = this.g.mul(r);
        var Rencoded = this.encodePoint(R);
        var s_ = this.hashInt(Rencoded, key.pubBytes(), message).mul(key.priv());
        var S = r.add(s_).umod(this.curve.n);
        return this.makeSignature({ R, S, Rencoded });
      };
      EDDSA.prototype.verify = function verify(message, sig, pub) {
        message = parseBytes(message);
        sig = this.makeSignature(sig);
        var key = this.keyFromPublic(pub);
        var h = this.hashInt(sig.Rencoded(), key.pubBytes(), message);
        var SG = this.g.mul(sig.S());
        var RplusAh = sig.R().add(key.pub().mul(h));
        return RplusAh.eq(SG);
      };
      EDDSA.prototype.hashInt = function hashInt() {
        var hash4 = this.hash();
        for (var i = 0; i < arguments.length; i++)
          hash4.update(arguments[i]);
        return utils.intFromLE(hash4.digest()).umod(this.curve.n);
      };
      EDDSA.prototype.keyFromPublic = function keyFromPublic(pub) {
        return KeyPair.fromPublic(this, pub);
      };
      EDDSA.prototype.keyFromSecret = function keyFromSecret(secret) {
        return KeyPair.fromSecret(this, secret);
      };
      EDDSA.prototype.makeSignature = function makeSignature(sig) {
        if (sig instanceof Signature2)
          return sig;
        return new Signature2(this, sig);
      };
      EDDSA.prototype.encodePoint = function encodePoint(point) {
        var enc = point.getY().toArray("le", this.encodingLength);
        enc[this.encodingLength - 1] |= point.getX().isOdd() ? 128 : 0;
        return enc;
      };
      EDDSA.prototype.decodePoint = function decodePoint(bytes2) {
        bytes2 = utils.parseBytes(bytes2);
        var lastIx = bytes2.length - 1;
        var normed = bytes2.slice(0, lastIx).concat(bytes2[lastIx] & ~128);
        var xIsOdd = (bytes2[lastIx] & 128) !== 0;
        var y = utils.intFromLE(normed);
        return this.curve.pointFromY(y, xIsOdd);
      };
      EDDSA.prototype.encodeInt = function encodeInt(num) {
        return num.toArray("le", this.encodingLength);
      };
      EDDSA.prototype.decodeInt = function decodeInt(bytes2) {
        return utils.intFromLE(bytes2);
      };
      EDDSA.prototype.isPoint = function isPoint(val) {
        return val instanceof this.pointClass;
      };
    }
  });

  // ../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic.js
  var require_elliptic = __commonJS({
    "../../node_modules/.pnpm/elliptic@6.5.4/node_modules/elliptic/lib/elliptic.js"(exports) {
      "use strict";
      var elliptic2 = exports;
      elliptic2.version = require_package().version;
      elliptic2.utils = require_utils2();
      elliptic2.rand = require_brorand();
      elliptic2.curve = require_curve();
      elliptic2.curves = require_curves();
      elliptic2.ec = require_ec();
      elliptic2.eddsa = require_eddsa();
    }
  });

  // ../../node_modules/.pnpm/@noble+hashes@1.3.1/node_modules/@noble/hashes/esm/_assert.js
  function number(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error(`Wrong positive integer: ${n}`);
  }
  function bool(b) {
    if (typeof b !== "boolean")
      throw new Error(`Expected boolean, not ${b}`);
  }
  function bytes(b, ...lengths) {
    if (!(b instanceof Uint8Array))
      throw new Error("Expected Uint8Array");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
  }
  function hash(hash3) {
    if (typeof hash3 !== "function" || typeof hash3.create !== "function")
      throw new Error("Hash should be wrapped by utils.wrapConstructor");
    number(hash3.outputLen);
    number(hash3.blockLen);
  }
  function exists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
  }
  var assert = {
    number,
    bool,
    bytes,
    hash,
    exists,
    output
  };
  var assert_default = assert;

  // ../../node_modules/.pnpm/@noble+hashes@1.3.1/node_modules/@noble/hashes/esm/cryptoNode.js
  var nc = __toESM(__require("crypto"), 1);
  var crypto = nc && typeof nc === "object" && "webcrypto" in nc ? nc.webcrypto : void 0;

  // ../../node_modules/.pnpm/@noble+hashes@1.3.1/node_modules/@noble/hashes/esm/utils.js
  var u8a = (a) => a instanceof Uint8Array;
  var u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
  var createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
  var rotr = (word, shift) => word << 32 - shift | word >>> shift;
  var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
  if (!isLE)
    throw new Error("Non little-endian hardware is not supported");
  var hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, "0"));
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
    return new Uint8Array(new TextEncoder().encode(str));
  }
  function toBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes(data);
    if (!u8a(data))
      throw new Error(`expected Uint8Array, got ${typeof data}`);
    return data;
  }
  var Hash = class {
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  };
  var isPlainObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]" && obj.constructor === Object;
  function checkOpts(defaults, opts) {
    if (opts !== void 0 && (typeof opts !== "object" || !isPlainObject(opts)))
      throw new Error("Options should be object or undefined");
    const merged = Object.assign(defaults, opts);
    return merged;
  }
  function wrapConstructor(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }
  function wrapXOFConstructorWithOpts(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
  }

  // ../../node_modules/.pnpm/@noble+hashes@1.3.1/node_modules/@noble/hashes/esm/_sha2.js
  function setBigUint64(view, byteOffset, value, isLE2) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE2);
    const _32n2 = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n2 & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE2 ? 4 : 0;
    const l = isLE2 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE2);
    view.setUint32(byteOffset + l, wl, isLE2);
  }
  var SHA2 = class extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE2) {
      super();
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE2;
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      assert_default.exists(this);
      const { view, buffer, blockLen } = this;
      data = toBytes(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      assert_default.exists(this);
      assert_default.output(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE: isLE2 } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      this.buffer.subarray(pos).fill(0);
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE2);
      this.process(view, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE2);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor());
      to.set(...this.get());
      const { blockLen, buffer, length, finished, destroyed, pos } = this;
      to.length = length;
      to.pos = pos;
      to.finished = finished;
      to.destroyed = destroyed;
      if (length % blockLen)
        to.buffer.set(buffer);
      return to;
    }
  };

  // ../../node_modules/.pnpm/@noble+hashes@1.3.1/node_modules/@noble/hashes/esm/sha256.js
  var Chi = (a, b, c) => a & b ^ ~a & c;
  var Maj = (a, b, c) => a & b ^ a & c ^ b & c;
  var SHA256_K = new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var IV = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  var SHA256_W = new Uint32Array(64);
  var SHA256 = class extends SHA2 {
    constructor() {
      super(64, 32, 8, false);
      this.A = IV[0] | 0;
      this.B = IV[1] | 0;
      this.C = IV[2] | 0;
      this.D = IV[3] | 0;
      this.E = IV[4] | 0;
      this.F = IV[5] | 0;
      this.G = IV[6] | 0;
      this.H = IV[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
        const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
        const T2 = sigma0 + Maj(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      SHA256_W.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      this.buffer.fill(0);
    }
  };
  var SHA224 = class extends SHA256 {
    constructor() {
      super();
      this.A = 3238371032 | 0;
      this.B = 914150663 | 0;
      this.C = 812702999 | 0;
      this.D = 4144912697 | 0;
      this.E = 4290775857 | 0;
      this.F = 1750603025 | 0;
      this.G = 1694076839 | 0;
      this.H = 3204075428 | 0;
      this.outputLen = 28;
    }
  };
  var sha256 = wrapConstructor(() => new SHA256());
  var sha224 = wrapConstructor(() => new SHA224());

  // ../../node_modules/.pnpm/@noble+hashes@1.3.1/node_modules/@noble/hashes/esm/hmac.js
  var HMAC = class extends Hash {
    constructor(hash3, _key) {
      super();
      this.finished = false;
      this.destroyed = false;
      assert_default.hash(hash3);
      const key = toBytes(_key);
      this.iHash = hash3.create();
      if (typeof this.iHash.update !== "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen;
      this.outputLen = this.iHash.outputLen;
      const blockLen = this.blockLen;
      const pad = new Uint8Array(blockLen);
      pad.set(key.length > blockLen ? hash3.create().update(key).digest() : key);
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54;
      this.iHash.update(pad);
      this.oHash = hash3.create();
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54 ^ 92;
      this.oHash.update(pad);
      pad.fill(0);
    }
    update(buf) {
      assert_default.exists(this);
      this.iHash.update(buf);
      return this;
    }
    digestInto(out) {
      assert_default.exists(this);
      assert_default.bytes(out, this.outputLen);
      this.finished = true;
      this.iHash.digestInto(out);
      this.oHash.update(out);
      this.oHash.digestInto(out);
      this.destroy();
    }
    digest() {
      const out = new Uint8Array(this.oHash.outputLen);
      this.digestInto(out);
      return out;
    }
    _cloneInto(to) {
      to || (to = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
      to = to;
      to.finished = finished;
      to.destroyed = destroyed;
      to.blockLen = blockLen;
      to.outputLen = outputLen;
      to.oHash = oHash._cloneInto(to.oHash);
      to.iHash = iHash._cloneInto(to.iHash);
      return to;
    }
    destroy() {
      this.destroyed = true;
      this.oHash.destroy();
      this.iHash.destroy();
    }
  };
  var hmac = (hash3, key, message) => new HMAC(hash3, key).update(message).digest();
  hmac.create = (hash3, key) => new HMAC(hash3, key);

  // ../../node_modules/.pnpm/@noble+hashes@1.3.1/node_modules/@noble/hashes/esm/pbkdf2.js
  function pbkdf2Init(hash3, _password, _salt, _opts) {
    assert_default.hash(hash3);
    const opts = checkOpts({ dkLen: 32, asyncTick: 10 }, _opts);
    const { c, dkLen, asyncTick } = opts;
    assert_default.number(c);
    assert_default.number(dkLen);
    assert_default.number(asyncTick);
    if (c < 1)
      throw new Error("PBKDF2: iterations (c) should be >= 1");
    const password = toBytes(_password);
    const salt = toBytes(_salt);
    const DK = new Uint8Array(dkLen);
    const PRF = hmac.create(hash3, password);
    const PRFSalt = PRF._cloneInto().update(salt);
    return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
  }
  function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
    PRF.destroy();
    PRFSalt.destroy();
    if (prfW)
      prfW.destroy();
    u.fill(0);
    return DK;
  }
  function pbkdf2(hash3, password, salt, opts) {
    const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash3, password, salt, opts);
    let prfW;
    const arr = new Uint8Array(4);
    const view = createView(arr);
    const u = new Uint8Array(PRF.outputLen);
    for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
      const Ti = DK.subarray(pos, pos + PRF.outputLen);
      view.setInt32(0, ti, false);
      (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
      Ti.set(u.subarray(0, Ti.length));
      for (let ui = 1; ui < c; ui++) {
        PRF._cloneInto(prfW).update(u).digestInto(u);
        for (let i = 0; i < Ti.length; i++)
          Ti[i] ^= u[i];
      }
    }
    return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
  }

  // ../../node_modules/.pnpm/@noble+hashes@1.3.1/node_modules/@noble/hashes/esm/scrypt.js
  var rotl = (a, b) => a << b | a >>> 32 - b;
  function XorAndSalsa(prev, pi, input, ii, out, oi) {
    let y00 = prev[pi++] ^ input[ii++], y01 = prev[pi++] ^ input[ii++];
    let y02 = prev[pi++] ^ input[ii++], y03 = prev[pi++] ^ input[ii++];
    let y04 = prev[pi++] ^ input[ii++], y05 = prev[pi++] ^ input[ii++];
    let y06 = prev[pi++] ^ input[ii++], y07 = prev[pi++] ^ input[ii++];
    let y08 = prev[pi++] ^ input[ii++], y09 = prev[pi++] ^ input[ii++];
    let y10 = prev[pi++] ^ input[ii++], y11 = prev[pi++] ^ input[ii++];
    let y12 = prev[pi++] ^ input[ii++], y13 = prev[pi++] ^ input[ii++];
    let y14 = prev[pi++] ^ input[ii++], y15 = prev[pi++] ^ input[ii++];
    let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
    for (let i = 0; i < 8; i += 2) {
      x04 ^= rotl(x00 + x12 | 0, 7);
      x08 ^= rotl(x04 + x00 | 0, 9);
      x12 ^= rotl(x08 + x04 | 0, 13);
      x00 ^= rotl(x12 + x08 | 0, 18);
      x09 ^= rotl(x05 + x01 | 0, 7);
      x13 ^= rotl(x09 + x05 | 0, 9);
      x01 ^= rotl(x13 + x09 | 0, 13);
      x05 ^= rotl(x01 + x13 | 0, 18);
      x14 ^= rotl(x10 + x06 | 0, 7);
      x02 ^= rotl(x14 + x10 | 0, 9);
      x06 ^= rotl(x02 + x14 | 0, 13);
      x10 ^= rotl(x06 + x02 | 0, 18);
      x03 ^= rotl(x15 + x11 | 0, 7);
      x07 ^= rotl(x03 + x15 | 0, 9);
      x11 ^= rotl(x07 + x03 | 0, 13);
      x15 ^= rotl(x11 + x07 | 0, 18);
      x01 ^= rotl(x00 + x03 | 0, 7);
      x02 ^= rotl(x01 + x00 | 0, 9);
      x03 ^= rotl(x02 + x01 | 0, 13);
      x00 ^= rotl(x03 + x02 | 0, 18);
      x06 ^= rotl(x05 + x04 | 0, 7);
      x07 ^= rotl(x06 + x05 | 0, 9);
      x04 ^= rotl(x07 + x06 | 0, 13);
      x05 ^= rotl(x04 + x07 | 0, 18);
      x11 ^= rotl(x10 + x09 | 0, 7);
      x08 ^= rotl(x11 + x10 | 0, 9);
      x09 ^= rotl(x08 + x11 | 0, 13);
      x10 ^= rotl(x09 + x08 | 0, 18);
      x12 ^= rotl(x15 + x14 | 0, 7);
      x13 ^= rotl(x12 + x15 | 0, 9);
      x14 ^= rotl(x13 + x12 | 0, 13);
      x15 ^= rotl(x14 + x13 | 0, 18);
    }
    out[oi++] = y00 + x00 | 0;
    out[oi++] = y01 + x01 | 0;
    out[oi++] = y02 + x02 | 0;
    out[oi++] = y03 + x03 | 0;
    out[oi++] = y04 + x04 | 0;
    out[oi++] = y05 + x05 | 0;
    out[oi++] = y06 + x06 | 0;
    out[oi++] = y07 + x07 | 0;
    out[oi++] = y08 + x08 | 0;
    out[oi++] = y09 + x09 | 0;
    out[oi++] = y10 + x10 | 0;
    out[oi++] = y11 + x11 | 0;
    out[oi++] = y12 + x12 | 0;
    out[oi++] = y13 + x13 | 0;
    out[oi++] = y14 + x14 | 0;
    out[oi++] = y15 + x15 | 0;
  }
  function BlockMix(input, ii, out, oi, r) {
    let head = oi + 0;
    let tail = oi + 16 * r;
    for (let i = 0; i < 16; i++)
      out[tail + i] = input[ii + (2 * r - 1) * 16 + i];
    for (let i = 0; i < r; i++, head += 16, ii += 16) {
      XorAndSalsa(out, tail, input, ii, out, head);
      if (i > 0)
        tail += 16;
      XorAndSalsa(out, head, input, ii += 16, out, tail);
    }
  }
  function scryptInit(password, salt, _opts) {
    const opts = checkOpts({
      dkLen: 32,
      asyncTick: 10,
      maxmem: 1024 ** 3 + 1024
    }, _opts);
    const { N, r, p, dkLen, asyncTick, maxmem, onProgress } = opts;
    assert_default.number(N);
    assert_default.number(r);
    assert_default.number(p);
    assert_default.number(dkLen);
    assert_default.number(asyncTick);
    assert_default.number(maxmem);
    if (onProgress !== void 0 && typeof onProgress !== "function")
      throw new Error("progressCb should be function");
    const blockSize = 128 * r;
    const blockSize32 = blockSize / 4;
    if (N <= 1 || (N & N - 1) !== 0 || N >= 2 ** (blockSize / 8) || N > 2 ** 32) {
      throw new Error("Scrypt: N must be larger than 1, a power of 2, less than 2^(128 * r / 8) and less than 2^32");
    }
    if (p < 0 || p > (2 ** 32 - 1) * 32 / blockSize) {
      throw new Error("Scrypt: p must be a positive integer less than or equal to ((2^32 - 1) * 32) / (128 * r)");
    }
    if (dkLen < 0 || dkLen > (2 ** 32 - 1) * 32) {
      throw new Error("Scrypt: dkLen should be positive integer less than or equal to (2^32 - 1) * 32");
    }
    const memUsed = blockSize * (N + p);
    if (memUsed > maxmem) {
      throw new Error(`Scrypt: parameters too large, ${memUsed} (128 * r * (N + p)) > ${maxmem} (maxmem)`);
    }
    const B = pbkdf2(sha256, password, salt, { c: 1, dkLen: blockSize * p });
    const B32 = u32(B);
    const V = u32(new Uint8Array(blockSize * N));
    const tmp = u32(new Uint8Array(blockSize));
    let blockMixCb = () => {
    };
    if (onProgress) {
      const totalBlockMix = 2 * N * p;
      const callbackPer = Math.max(Math.floor(totalBlockMix / 1e4), 1);
      let blockMixCnt = 0;
      blockMixCb = () => {
        blockMixCnt++;
        if (onProgress && (!(blockMixCnt % callbackPer) || blockMixCnt === totalBlockMix))
          onProgress(blockMixCnt / totalBlockMix);
      };
    }
    return { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb, asyncTick };
  }
  function scryptOutput(password, dkLen, B, V, tmp) {
    const res = pbkdf2(sha256, password, B, { c: 1, dkLen });
    B.fill(0);
    V.fill(0);
    tmp.fill(0);
    return res;
  }
  function scrypt(password, salt, opts) {
    const { N, r, p, dkLen, blockSize32, V, B32, B, tmp, blockMixCb } = scryptInit(password, salt, opts);
    for (let pi = 0; pi < p; pi++) {
      const Pi = blockSize32 * pi;
      for (let i = 0; i < blockSize32; i++)
        V[i] = B32[Pi + i];
      for (let i = 0, pos = 0; i < N - 1; i++) {
        BlockMix(V, pos, V, pos += blockSize32, r);
        blockMixCb();
      }
      BlockMix(V, (N - 1) * blockSize32, B32, Pi, r);
      blockMixCb();
      for (let i = 0; i < N; i++) {
        const j = B32[Pi + blockSize32 - 16] % N;
        for (let k = 0; k < blockSize32; k++)
          tmp[k] = B32[Pi + k] ^ V[j * blockSize32 + k];
        BlockMix(tmp, 0, B32, Pi, r);
        blockMixCb();
      }
    }
    return scryptOutput(password, dkLen, B, V, tmp);
  }

  // ../../node_modules/.pnpm/ethereum-cryptography@2.1.2/node_modules/ethereum-cryptography/esm/utils.js
  var assertBool = assert_default.bool;
  var assertBytes = assert_default.bytes;
  function wrapHash(hash3) {
    return (msg) => {
      assert_default.bytes(msg);
      return hash3(msg);
    };
  }
  var crypto2 = (() => {
    const webCrypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;
    const nodeRequire = typeof module !== "undefined" && typeof module.require === "function" && module.require.bind(module);
    return {
      node: nodeRequire && !webCrypto ? nodeRequire("crypto") : void 0,
      web: webCrypto
    };
  })();

  // ../../node_modules/.pnpm/ethereum-cryptography@2.1.2/node_modules/ethereum-cryptography/esm/scrypt.js
  function scryptSync(password, salt, n, p, r, dkLen, onProgress) {
    assertBytes(password);
    assertBytes(salt);
    return scrypt(password, salt, { N: n, r, p, dkLen, onProgress });
  }

  // ../../node_modules/.pnpm/@noble+hashes@1.3.1/node_modules/@noble/hashes/esm/_u64.js
  var U32_MASK64 = BigInt(2 ** 32 - 1);
  var _32n = BigInt(32);
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  var toBig = (h, l) => BigInt(h >>> 0) << _32n | BigInt(l >>> 0);
  var shrSH = (h, l, s) => h >>> s;
  var shrSL = (h, l, s) => h << 32 - s | l >>> s;
  var rotrSH = (h, l, s) => h >>> s | l << 32 - s;
  var rotrSL = (h, l, s) => h << 32 - s | l >>> s;
  var rotrBH = (h, l, s) => h << 64 - s | l >>> s - 32;
  var rotrBL = (h, l, s) => h >>> s - 32 | l << 64 - s;
  var rotr32H = (h, l) => l;
  var rotr32L = (h, l) => h;
  var rotlSH = (h, l, s) => h << s | l >>> 32 - s;
  var rotlSL = (h, l, s) => l << s | h >>> 32 - s;
  var rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
  var rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;
  function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: Ah + Bh + (l / 2 ** 32 | 0) | 0, l: l | 0 };
  }
  var add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
  var add3H = (low, Ah, Bh, Ch) => Ah + Bh + Ch + (low / 2 ** 32 | 0) | 0;
  var add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
  var add4H = (low, Ah, Bh, Ch, Dh) => Ah + Bh + Ch + Dh + (low / 2 ** 32 | 0) | 0;
  var add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
  var add5H = (low, Ah, Bh, Ch, Dh, Eh) => Ah + Bh + Ch + Dh + Eh + (low / 2 ** 32 | 0) | 0;
  var u64 = {
    fromBig,
    split,
    toBig,
    shrSH,
    shrSL,
    rotrSH,
    rotrSL,
    rotrBH,
    rotrBL,
    rotr32H,
    rotr32L,
    rotlSH,
    rotlSL,
    rotlBH,
    rotlBL,
    add,
    add3L,
    add3H,
    add4L,
    add4H,
    add5H,
    add5L
  };
  var u64_default = u64;

  // ../../node_modules/.pnpm/@noble+hashes@1.3.1/node_modules/@noble/hashes/esm/sha3.js
  var [SHA3_PI, SHA3_ROTL, _SHA3_IOTA] = [[], [], []];
  var _0n = BigInt(0);
  var _1n = BigInt(1);
  var _2n = BigInt(2);
  var _7n = BigInt(7);
  var _256n = BigInt(256);
  var _0x71n = BigInt(113);
  for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
    let t = _0n;
    for (let j = 0; j < 7; j++) {
      R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
      if (R & _2n)
        t ^= _1n << (_1n << BigInt(j)) - _1n;
    }
    _SHA3_IOTA.push(t);
  }
  var [SHA3_IOTA_H, SHA3_IOTA_L] = u64_default.split(_SHA3_IOTA, true);
  var rotlH = (h, l, s) => s > 32 ? u64_default.rotlBH(h, l, s) : u64_default.rotlSH(h, l, s);
  var rotlL = (h, l, s) => s > 32 ? u64_default.rotlBL(h, l, s) : u64_default.rotlSL(h, l, s);
  function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    for (let round = 24 - rounds; round < 24; round++) {
      for (let x = 0; x < 10; x++)
        B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
      for (let x = 0; x < 10; x += 2) {
        const idx1 = (x + 8) % 10;
        const idx0 = (x + 2) % 10;
        const B0 = B[idx0];
        const B1 = B[idx0 + 1];
        const Th = rotlH(B0, B1, 1) ^ B[idx1];
        const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
        for (let y = 0; y < 50; y += 10) {
          s[x + y] ^= Th;
          s[x + y + 1] ^= Tl;
        }
      }
      let curH = s[2];
      let curL = s[3];
      for (let t = 0; t < 24; t++) {
        const shift = SHA3_ROTL[t];
        const Th = rotlH(curH, curL, shift);
        const Tl = rotlL(curH, curL, shift);
        const PI = SHA3_PI[t];
        curH = s[PI];
        curL = s[PI + 1];
        s[PI] = Th;
        s[PI + 1] = Tl;
      }
      for (let y = 0; y < 50; y += 10) {
        for (let x = 0; x < 10; x++)
          B[x] = s[y + x];
        for (let x = 0; x < 10; x++)
          s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
      }
      s[0] ^= SHA3_IOTA_H[round];
      s[1] ^= SHA3_IOTA_L[round];
    }
    B.fill(0);
  }
  var Keccak = class extends Hash {
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
      super();
      this.blockLen = blockLen;
      this.suffix = suffix;
      this.outputLen = outputLen;
      this.enableXOF = enableXOF;
      this.rounds = rounds;
      this.pos = 0;
      this.posOut = 0;
      this.finished = false;
      this.destroyed = false;
      assert_default.number(outputLen);
      if (0 >= this.blockLen || this.blockLen >= 200)
        throw new Error("Sha3 supports only keccak-f1600 function");
      this.state = new Uint8Array(200);
      this.state32 = u32(this.state);
    }
    keccak() {
      keccakP(this.state32, this.rounds);
      this.posOut = 0;
      this.pos = 0;
    }
    update(data) {
      assert_default.exists(this);
      const { blockLen, state } = this;
      data = toBytes(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        for (let i = 0; i < take; i++)
          state[this.pos++] ^= data[pos++];
        if (this.pos === blockLen)
          this.keccak();
      }
      return this;
    }
    finish() {
      if (this.finished)
        return;
      this.finished = true;
      const { state, suffix, pos, blockLen } = this;
      state[pos] ^= suffix;
      if ((suffix & 128) !== 0 && pos === blockLen - 1)
        this.keccak();
      state[blockLen - 1] ^= 128;
      this.keccak();
    }
    writeInto(out) {
      assert_default.exists(this, false);
      assert_default.bytes(out);
      this.finish();
      const bufferOut = this.state;
      const { blockLen } = this;
      for (let pos = 0, len = out.length; pos < len; ) {
        if (this.posOut >= blockLen)
          this.keccak();
        const take = Math.min(blockLen - this.posOut, len - pos);
        out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
        this.posOut += take;
        pos += take;
      }
      return out;
    }
    xofInto(out) {
      if (!this.enableXOF)
        throw new Error("XOF is not possible for this instance");
      return this.writeInto(out);
    }
    xof(bytes2) {
      assert_default.number(bytes2);
      return this.xofInto(new Uint8Array(bytes2));
    }
    digestInto(out) {
      assert_default.output(out, this);
      if (this.finished)
        throw new Error("digest() was already called");
      this.writeInto(out);
      this.destroy();
      return out;
    }
    digest() {
      return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
      this.destroyed = true;
      this.state.fill(0);
    }
    _cloneInto(to) {
      const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
      to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
      to.state32.set(this.state32);
      to.pos = this.pos;
      to.posOut = this.posOut;
      to.finished = this.finished;
      to.rounds = rounds;
      to.suffix = suffix;
      to.outputLen = outputLen;
      to.enableXOF = enableXOF;
      to.destroyed = this.destroyed;
      return to;
    }
  };
  var gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
  var sha3_224 = gen(6, 144, 224 / 8);
  var sha3_256 = gen(6, 136, 256 / 8);
  var sha3_384 = gen(6, 104, 384 / 8);
  var sha3_512 = gen(6, 72, 512 / 8);
  var keccak_224 = gen(1, 144, 224 / 8);
  var keccak_256 = gen(1, 136, 256 / 8);
  var keccak_384 = gen(1, 104, 384 / 8);
  var keccak_512 = gen(1, 72, 512 / 8);
  var genShake = (suffix, blockLen, outputLen) => wrapXOFConstructorWithOpts((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true));
  var shake128 = genShake(31, 168, 128 / 8);
  var shake256 = genShake(31, 136, 256 / 8);

  // ../../node_modules/.pnpm/ethereum-cryptography@2.1.2/node_modules/ethereum-cryptography/esm/keccak.js
  var keccak224 = wrapHash(keccak_224);
  var keccak256 = (() => {
    const k = wrapHash(keccak_256);
    k.create = keccak_256.create;
    return k;
  })();
  var keccak384 = wrapHash(keccak_384);
  var keccak512 = wrapHash(keccak_512);

  // ../versions/dist/index.mjs
  var import_semver = __toESM(require_semver2(), 1);
  function getBuiltinVersions() {
    return {
      FORC: "0.48.1",
      FUEL_CORE: "0.22.0",
      FUELS: "0.69.1"
    };
  }
  var versions = getBuiltinVersions();

  // ../errors/dist/index.mjs
  var __defProp2 = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
    ErrorCode2["NO_ABIS_FOUND"] = "no-abis-found";
    ErrorCode2["ABI_TYPES_AND_VALUES_MISMATCH"] = "abi-types-and-values-mismatch";
    ErrorCode2["ABI_MAIN_METHOD_MISSING"] = "abi-main-method-missing";
    ErrorCode2["INVALID_COMPONENT"] = "invalid-component";
    ErrorCode2["FRAGMENT_NOT_FOUND"] = "fragment-not-found";
    ErrorCode2["CONFIGURABLE_NOT_FOUND"] = "configurable-not-found";
    ErrorCode2["TYPE_NOT_FOUND"] = "type-not-found";
    ErrorCode2["TYPE_NOT_SUPPORTED"] = "type-not-supported";
    ErrorCode2["INVALID_DECODE_VALUE"] = "invalid-decode-value";
    ErrorCode2["JSON_ABI_ERROR"] = "json-abi-error";
    ErrorCode2["TYPE_ID_NOT_FOUND"] = "type-id-not-found";
    ErrorCode2["BIN_FILE_NOT_FOUND"] = "bin-file-not-found";
    ErrorCode2["CODER_NOT_FOUND"] = "coder-not-found";
    ErrorCode2["INVALID_DATA"] = "invalid-data";
    ErrorCode2["FUNCTION_NOT_FOUND"] = "function-not-found";
    ErrorCode2["INVALID_BECH32_ADDRESS"] = "invalid-bech32-address";
    ErrorCode2["INVALID_EVM_ADDRESS"] = "invalid-evm-address";
    ErrorCode2["INVALID_B256_ADDRESS"] = "invalid-b256-address";
    ErrorCode2["INVALID_URL"] = "invalid-url";
    ErrorCode2["CHAIN_INFO_CACHE_EMPTY"] = "chain-info-cache-empty";
    ErrorCode2["NODE_INFO_CACHE_EMPTY"] = "node-info-cache-empty";
    ErrorCode2["MISSING_PROVIDER"] = "missing-provider";
    ErrorCode2["INVALID_PUBLIC_KEY"] = "invalid-public-key";
    ErrorCode2["INSUFFICIENT_BALANCE"] = "insufficient-balance";
    ErrorCode2["WALLET_MANAGER_ERROR"] = "wallet-manager-error";
    ErrorCode2["HD_WALLET_ERROR"] = "hd-wallet-error";
    ErrorCode2["PARSE_FAILED"] = "parse-failed";
    ErrorCode2["ENCODE_ERROR"] = "encode-error";
    ErrorCode2["DECODE_ERROR"] = "decode-error";
    ErrorCode2["INVALID_CREDENTIALS"] = "invalid-credentials";
    ErrorCode2["ENV_DEPENDENCY_MISSING"] = "env-dependency-missing";
    ErrorCode2["INVALID_TTL"] = "invalid-ttl";
    ErrorCode2["INVALID_INPUT_PARAMETERS"] = "invalid-input-parameters";
    ErrorCode2["NOT_IMPLEMENTED"] = "not-implemented";
    ErrorCode2["NOT_SUPPORTED"] = "not-supported";
    ErrorCode2["CONVERTING_FAILED"] = "converting-error";
    ErrorCode2["ELEMENT_NOT_FOUND"] = "element-not-found";
    ErrorCode2["MISSING_REQUIRED_PARAMETER"] = "missing-required-parameter";
    ErrorCode2["UNEXPECTED_HEX_VALUE"] = "unexpected-hex-value";
    ErrorCode2["GAS_PRICE_TOO_LOW"] = "gas-price-too-low";
    ErrorCode2["GAS_LIMIT_TOO_LOW"] = "gas-limit-too-low";
    ErrorCode2["TRANSACTION_NOT_FOUND"] = "transaction-not-found";
    ErrorCode2["TRANSACTION_FAILED"] = "transaction-failed";
    ErrorCode2["INVALID_CONFIGURABLE_CONSTANTS"] = "invalid-configurable-constants";
    ErrorCode2["INVALID_TRANSACTION_INPUT"] = "invalid-transaction-input";
    ErrorCode2["INVALID_TRANSACTION_OUTPUT"] = "invalid-transaction-output";
    ErrorCode2["INVALID_TRANSACTION_STATUS"] = "invalid-transaction-status";
    ErrorCode2["INVALID_TRANSACTION_TYPE"] = "invalid-transaction-type";
    ErrorCode2["TRANSACTION_ERROR"] = "transaction-error";
    ErrorCode2["INVALID_POLICY_TYPE"] = "invalid-policy-type";
    ErrorCode2["DUPLICATED_POLICY"] = "duplicated-policy";
    ErrorCode2["INVALID_RECEIPT_TYPE"] = "invalid-receipt-type";
    ErrorCode2["INVALID_WORD_LIST"] = "invalid-word-list";
    ErrorCode2["INVALID_MNEMONIC"] = "invalid-mnemonic";
    ErrorCode2["INVALID_ENTROPY"] = "invalid-entropy";
    ErrorCode2["INVALID_SEED"] = "invalid-seed";
    ErrorCode2["INVALID_CHECKSUM"] = "invalid-checksum";
    ErrorCode2["INVALID_PASSWORD"] = "invalid-password";
    ErrorCode2["ACCOUNT_REQUIRED"] = "account-required";
    ErrorCode2["LATEST_BLOCK_UNAVAILABLE"] = "latest-block-unavailable";
    ErrorCode2["ERROR_BUILDING_BLOCK_EXPLORER_URL"] = "error-building-block-explorer-url";
    ErrorCode2["UNSUPPORTED_FUEL_CLIENT_VERSION"] = "unsupported-fuel-client-version";
    ErrorCode2["VITEPRESS_PLUGIN_ERROR"] = "vitepress-plugin-error";
    ErrorCode2["INVALID_MULTICALL"] = "invalid-multicall";
    ErrorCode2["SCRIPT_REVERTED"] = "script-reverted";
    ErrorCode2["SCRIPT_RETURN_INVALID_TYPE"] = "script-return-invalid-type";
    return ErrorCode2;
  })(ErrorCode || {});
  var _FuelError = class extends Error {
    VERSIONS = versions;
    static parse(e) {
      const error = e;
      if (error.code === void 0) {
        throw new _FuelError(
          "parse-failed",
          "Failed to parse the error object. The required 'code' property is missing."
        );
      }
      const enumValues = Object.values(ErrorCode);
      const codeIsKnown = enumValues.includes(error.code);
      if (!codeIsKnown) {
        throw new _FuelError(
          "parse-failed",
          `Unknown error code: ${error.code}. Accepted codes: ${enumValues.join(", ")}.`
        );
      }
      return new _FuelError(error.code, error.message);
    }
    code;
    constructor(code, message) {
      super(message);
      this.code = code;
      this.name = "FuelError";
    }
    toObject() {
      const { code, name, message, VERSIONS } = this;
      return { code, name, message, VERSIONS };
    }
  };
  var FuelError = _FuelError;
  __publicField(FuelError, "CODES", ErrorCode);

  // ../crypto/dist/index.mjs
  var import_crypto6 = __toESM(__require("crypto"), 1);

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/_version.js
  var version = "6.7.1";

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/utils/properties.js
  function checkType(value, type, name) {
    const types = type.split("|").map((t) => t.trim());
    for (let i = 0; i < types.length; i++) {
      switch (type) {
        case "any":
          return;
        case "bigint":
        case "boolean":
        case "number":
        case "string":
          if (typeof value === type) {
            return;
          }
      }
    }
    const error = new Error(`invalid value for type ${type}`);
    error.code = "INVALID_ARGUMENT";
    error.argument = `value.${name}`;
    error.value = value;
    throw error;
  }
  function defineProperties(target, values, types) {
    for (let key in values) {
      let value = values[key];
      const type = types ? types[key] : null;
      if (type) {
        checkType(value, type, key);
      }
      Object.defineProperty(target, key, { enumerable: true, value, writable: false });
    }
  }

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/utils/errors.js
  function stringify(value) {
    if (value == null) {
      return "null";
    }
    if (Array.isArray(value)) {
      return "[ " + value.map(stringify).join(", ") + " ]";
    }
    if (value instanceof Uint8Array) {
      const HEX = "0123456789abcdef";
      let result = "0x";
      for (let i = 0; i < value.length; i++) {
        result += HEX[value[i] >> 4];
        result += HEX[value[i] & 15];
      }
      return result;
    }
    if (typeof value === "object" && typeof value.toJSON === "function") {
      return stringify(value.toJSON());
    }
    switch (typeof value) {
      case "boolean":
      case "symbol":
        return value.toString();
      case "bigint":
        return BigInt(value).toString();
      case "number":
        return value.toString();
      case "string":
        return JSON.stringify(value);
      case "object": {
        const keys = Object.keys(value);
        keys.sort();
        return "{ " + keys.map((k) => `${stringify(k)}: ${stringify(value[k])}`).join(", ") + " }";
      }
    }
    return `[ COULD NOT SERIALIZE ]`;
  }
  function makeError(message, code, info) {
    {
      const details = [];
      if (info) {
        if ("message" in info || "code" in info || "name" in info) {
          throw new Error(`value will overwrite populated values: ${stringify(info)}`);
        }
        for (const key in info) {
          const value = info[key];
          details.push(key + "=" + stringify(value));
        }
      }
      details.push(`code=${code}`);
      details.push(`version=${version}`);
      if (details.length) {
        message += " (" + details.join(", ") + ")";
      }
    }
    let error;
    switch (code) {
      case "INVALID_ARGUMENT":
        error = new TypeError(message);
        break;
      case "NUMERIC_FAULT":
      case "BUFFER_OVERRUN":
        error = new RangeError(message);
        break;
      default:
        error = new Error(message);
    }
    defineProperties(error, { code });
    if (info) {
      Object.assign(error, info);
    }
    return error;
  }
  function assert2(check, message, code, info) {
    if (!check) {
      throw makeError(message, code, info);
    }
  }
  function assertArgument(check, message, name, value) {
    assert2(check, message, "INVALID_ARGUMENT", { argument: name, value });
  }
  var _normalizeForms = ["NFD", "NFC", "NFKD", "NFKC"].reduce((accum, form) => {
    try {
      if ("test".normalize(form) !== "test") {
        throw new Error("bad");
      }
      ;
      if (form === "NFD") {
        const check = String.fromCharCode(233).normalize("NFD");
        const expected = String.fromCharCode(101, 769);
        if (check !== expected) {
          throw new Error("broken");
        }
      }
      accum.push(form);
    } catch (error) {
    }
    return accum;
  }, []);

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/utils/data.js
  function _getBytes(value, name, copy) {
    if (value instanceof Uint8Array) {
      if (copy) {
        return new Uint8Array(value);
      }
      return value;
    }
    if (typeof value === "string" && value.match(/^0x([0-9a-f][0-9a-f])*$/i)) {
      const result = new Uint8Array((value.length - 2) / 2);
      let offset = 2;
      for (let i = 0; i < result.length; i++) {
        result[i] = parseInt(value.substring(offset, offset + 2), 16);
        offset += 2;
      }
      return result;
    }
    assertArgument(false, "invalid BytesLike value", name || "value", value);
  }
  function getBytes(value, name) {
    return _getBytes(value, name, false);
  }
  function getBytesCopy(value, name) {
    return _getBytes(value, name, true);
  }
  var HexCharacters = "0123456789abcdef";
  function hexlify(data) {
    const bytes2 = getBytes(data);
    let result = "0x";
    for (let i = 0; i < bytes2.length; i++) {
      const v = bytes2[i];
      result += HexCharacters[(v & 240) >> 4] + HexCharacters[v & 15];
    }
    return result;
  }
  function concat(datas) {
    return "0x" + datas.map((d) => hexlify(d).substring(2)).join("");
  }

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/crypto/crypto.js
  var import_crypto2 = __require("crypto");

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/crypto/pbkdf2.js
  var locked = false;
  var _pbkdf2 = function(password, salt, iterations, keylen, algo) {
    return (0, import_crypto2.pbkdf2Sync)(password, salt, iterations, keylen, algo);
  };
  var __pbkdf2 = _pbkdf2;
  function pbkdf22(_password, _salt, iterations, keylen, algo) {
    const password = getBytes(_password, "password");
    const salt = getBytes(_salt, "salt");
    return hexlify(__pbkdf2(password, salt, iterations, keylen, algo));
  }
  pbkdf22._ = _pbkdf2;
  pbkdf22.lock = function() {
    locked = true;
  };
  pbkdf22.register = function(func) {
    if (locked) {
      throw new Error("pbkdf2 is locked");
    }
    __pbkdf2 = func;
  };
  Object.freeze(pbkdf22);

  // ../../node_modules/.pnpm/ethers@6.7.1/node_modules/ethers/lib.esm/crypto/sha2.js
  var _sha256 = function(data) {
    return (0, import_crypto2.createHash)("sha256").update(data).digest();
  };
  var _sha512 = function(data) {
    return (0, import_crypto2.createHash)("sha512").update(data).digest();
  };
  var __sha256 = _sha256;
  var __sha512 = _sha512;
  var locked256 = false;
  var locked512 = false;
  function sha2562(_data) {
    const data = getBytes(_data, "data");
    return hexlify(__sha256(data));
  }
  sha2562._ = _sha256;
  sha2562.lock = function() {
    locked256 = true;
  };
  sha2562.register = function(func) {
    if (locked256) {
      throw new Error("sha256 is locked");
    }
    __sha256 = func;
  };
  Object.freeze(sha2562);
  function sha512(_data) {
    const data = getBytes(_data, "data");
    return hexlify(__sha512(data));
  }
  sha512._ = _sha512;
  sha512.lock = function() {
    locked512 = true;
  };
  sha512.register = function(func) {
    if (locked512) {
      throw new Error("sha512 is locked");
    }
    __sha512 = func;
  };
  Object.freeze(sha2562);

  // ../crypto/dist/index.mjs
  var import_crypto7 = __toESM(__require("crypto"), 1);
  var import_crypto8 = __toESM(__require("crypto"), 1);
  var scrypt3 = (params) => {
    const { password, salt, n, p, r, dklen } = params;
    const derivedKey = scryptSync(password, salt, n, r, p, dklen);
    return derivedKey;
  };
  var keccak2563 = (data) => keccak256(data);
  var bufferFromString = (string, encoding = "base64") => Uint8Array.from(Buffer.from(string, encoding));
  var randomBytes3 = (length) => {
    const randomValues = Uint8Array.from(import_crypto7.default.randomBytes(length));
    return randomValues;
  };
  var stringFromBuffer = (buffer, encoding = "base64") => Buffer.from(buffer).toString(encoding);
  var ALGORITHM = "aes-256-ctr";
  var keyFromPassword = (password, saltBuffer) => {
    const passBuffer = bufferFromString(String(password).normalize("NFKC"), "utf-8");
    const key = pbkdf22(passBuffer, saltBuffer, 1e5, 32, "sha256");
    return getBytesCopy(key);
  };
  var encrypt = async (password, data) => {
    const iv = randomBytes3(16);
    const salt = randomBytes3(32);
    const secret = keyFromPassword(password, salt);
    const dataBuffer = Uint8Array.from(Buffer.from(JSON.stringify(data), "utf-8"));
    const cipher = await import_crypto6.default.createCipheriv(ALGORITHM, secret, iv);
    let cipherData = cipher.update(dataBuffer);
    cipherData = Buffer.concat([cipherData, cipher.final()]);
    return {
      data: stringFromBuffer(cipherData),
      iv: stringFromBuffer(iv),
      salt: stringFromBuffer(salt)
    };
  };
  var decrypt = async (password, keystore) => {
    const iv = bufferFromString(keystore.iv);
    const salt = bufferFromString(keystore.salt);
    const secret = keyFromPassword(password, salt);
    const encryptedText = bufferFromString(keystore.data);
    const decipher = await import_crypto6.default.createDecipheriv(ALGORITHM, secret, iv);
    const decrypted = decipher.update(encryptedText);
    const deBuff = Buffer.concat([decrypted, decipher.final()]);
    const decryptedData = Buffer.from(deBuff).toString("utf-8");
    try {
      return JSON.parse(decryptedData);
    } catch {
      throw new FuelError(ErrorCode.INVALID_CREDENTIALS, "Invalid credentials.");
    }
  };
  async function encryptJsonWalletData(data, key, iv) {
    const cipher = await import_crypto8.default.createCipheriv("aes-128-ctr", key.subarray(0, 16), iv);
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
    return new Uint8Array(encrypted);
  }
  async function decryptJsonWalletData(data, key, iv) {
    const decipher = import_crypto8.default.createDecipheriv("aes-128-ctr", key.subarray(0, 16), iv);
    const decrypted = await Buffer.concat([decipher.update(data), decipher.final()]);
    return new Uint8Array(decrypted);
  }
  var api = {
    bufferFromString,
    stringFromBuffer,
    decrypt,
    encrypt,
    keyFromPassword,
    randomBytes: randomBytes3,
    scrypt: scrypt3,
    keccak256: keccak2563,
    decryptJsonWalletData,
    encryptJsonWalletData
  };
  var node_default = api;
  var {
    bufferFromString: bufferFromString2,
    decrypt: decrypt2,
    encrypt: encrypt2,
    keyFromPassword: keyFromPassword2,
    randomBytes: randomBytes22,
    stringFromBuffer: stringFromBuffer2,
    scrypt: scrypt22,
    keccak256: keccak25622,
    decryptJsonWalletData: decryptJsonWalletData2,
    encryptJsonWalletData: encryptJsonWalletData2
  } = node_default;

  // ../interfaces/dist/index.mjs
  var AbstractAddress = class {
  };

  // ../address/dist/index.mjs
  var import_bech32 = __toESM(require_dist(), 1);
  var FUEL_BECH32_HRP_PREFIX = "fuel";
  function fromBech32(address) {
    return import_bech32.bech32m.decode(address);
  }
  function toBech32(address) {
    return import_bech32.bech32m.encode(
      FUEL_BECH32_HRP_PREFIX,
      import_bech32.bech32m.toWords(getBytesCopy(hexlify(address)))
    );
  }
  function isBech32(address) {
    return typeof address === "string" && address.indexOf(FUEL_BECH32_HRP_PREFIX + 1) === 0 && fromBech32(address).prefix === FUEL_BECH32_HRP_PREFIX;
  }
  function isB256(address) {
    return address.length === 66 && /(0x)[0-9a-f]{64}$/i.test(address);
  }
  function isPublicKey(address) {
    return address.length === 130 && /(0x)[0-9a-f]{128}$/i.test(address);
  }
  function isEvmAddress(address) {
    return address.length === 42 && /(0x)[0-9a-f]{40}$/i.test(address);
  }
  function getBytesFromBech32(address) {
    return new Uint8Array(import_bech32.bech32m.fromWords(fromBech32(address).words));
  }
  function toB256(address) {
    if (!isBech32(address)) {
      throw new FuelError(
        FuelError.CODES.INVALID_BECH32_ADDRESS,
        `Invalid Bech32 Address: ${address}.`
      );
    }
    return hexlify(getBytesFromBech32(address));
  }
  function normalizeBech32(address) {
    const { words } = fromBech32(address);
    return import_bech32.bech32m.encode(FUEL_BECH32_HRP_PREFIX, words);
  }
  var getRandomB256 = () => hexlify(randomBytes22(32));
  var clearFirst12BytesFromB256 = (b256) => {
    let bytes2;
    try {
      if (!isB256(b256)) {
        throw new FuelError(
          FuelError.CODES.INVALID_BECH32_ADDRESS,
          `Invalid Bech32 Address: ${b256}.`
        );
      }
      bytes2 = getBytesFromBech32(toBech32(b256));
      bytes2 = hexlify(bytes2.fill(0, 0, 12));
    } catch (error) {
      throw new FuelError(
        FuelError.CODES.PARSE_FAILED,
        `Cannot generate EVM Address B256 from: ${b256}.`
      );
    }
    return bytes2;
  };
  var padFirst12BytesOfEvmAddress = (address) => {
    if (!isEvmAddress(address)) {
      throw new FuelError(FuelError.CODES.INVALID_EVM_ADDRESS, "Invalid EVM address format.");
    }
    return address.replace("0x", "0x000000000000000000000000");
  };
  var Address = class extends AbstractAddress {
    // #region address-2
    bech32Address;
    // #endregion address-2
    /**
     * @param address - A Bech32 address
     */
    constructor(address) {
      super();
      this.bech32Address = normalizeBech32(address);
      if (!isBech32(this.bech32Address)) {
        throw new FuelError(
          FuelError.CODES.INVALID_BECH32_ADDRESS,
          `Invalid Bech32 Address: ${address}.`
        );
      }
    }
    /**
     * Returns the `bech32Address` property
     *
     * @returns The `bech32Address` property
     */
    toAddress() {
      return this.bech32Address;
    }
    /**
     * Converts and returns the `bech32Address` property to a 256 bit hash string
     *
     * @returns The `bech32Address` property as a 256 bit hash string
     */
    toB256() {
      return toB256(this.bech32Address);
    }
    /**
     * Converts and returns the `bech32Address` property to a byte array
     *
     * @returns The `bech32Address` property as a byte array
     */
    toBytes() {
      return getBytesFromBech32(this.bech32Address);
    }
    /**
     * Converts
     *
     * @returns The `bech32Address` property as a 256 bit hash string
     */
    toHexString() {
      return this.toB256();
    }
    /**
     * Converts and returns the `bech32Address` property as a string
     *
     * @returns The `bech32Address` property as a string
     */
    toString() {
      return this.bech32Address;
    }
    /**
     * Converts and returns the `bech32Address` property as a string
     *
     * @returns The `bech32Address` property as a string
     */
    toJSON() {
      return this.bech32Address;
    }
    /**
     * Clears the first 12 bytes of the `bech32Address` property and returns it as a `EvmAddress`
     *
     * @returns The `bech32Address` property as an {@link EvmAddress | `EvmAddress`}
     */
    toEvmAddress() {
      const b256Address = toB256(this.bech32Address);
      return {
        value: clearFirst12BytesFromB256(b256Address)
      };
    }
    /**
     * Wraps the `bech32Address` property and returns as an `AssetId`.
     *
     * @returns The `bech32Address` property as an {@link AssetId | `AssetId`}
     */
    toAssetId() {
      return {
        value: this.toB256()
      };
    }
    /**
     * Returns the value of the `bech32Address` property
     *
     * @returns The value of `bech32Address` property
     */
    valueOf() {
      return this.bech32Address;
    }
    /**
     * Compares this the `bech32Address` property to another for direct equality
     *
     * @param other - Another address to compare against
     * @returns The equality of the comparison
     */
    equals(other) {
      return this.bech32Address === other.bech32Address;
    }
    /**
     * Takes a Public Key, hashes it, and creates an `Address`
     *
     * @param publicKey - A wallets public key
     * @returns A new `Address` instance
     */
    static fromPublicKey(publicKey) {
      if (!isPublicKey(publicKey)) {
        throw new FuelError(FuelError.CODES.INVALID_PUBLIC_KEY, `Invalid Public Key: ${publicKey}.`);
      }
      const b256Address = sha2562(hexlify(getBytesCopy(publicKey)));
      return new Address(toBech32(b256Address));
    }
    /**
     * Takes a B256 Address and creates an `Address`
     *
     * @param b256Address - A b256 hash
     * @returns A new `Address` instance
     */
    static fromB256(b256Address) {
      if (!isB256(b256Address)) {
        throw new FuelError(
          FuelError.CODES.INVALID_B256_ADDRESS,
          `Invalid B256 Address: ${b256Address}.`
        );
      }
      return new Address(toBech32(b256Address));
    }
    /**
     * Creates an `Address` with a randomized `bech32Address` property
     *
     * @returns A new `Address` instance
     */
    static fromRandom() {
      return this.fromB256(getRandomB256());
    }
    /**
     * Takes an ambiguous string and attempts to create an `Address`
     *
     * @param address - An ambiguous string
     * @returns A new `Address` instance
     */
    static fromString(address) {
      return isBech32(address) ? new Address(address) : this.fromB256(address);
    }
    /**
     * Takes an ambiguous string or address and creates an `Address`
     *
     * @returns a new `Address` instance
     */
    static fromAddressOrString(address) {
      return typeof address === "string" ? this.fromString(address) : address;
    }
    /**
     * Takes a dynamic string or `AbstractAddress` and creates an `Address`
     *
     * @param addressId - A string containing Bech32, B256, or Public Key
     * @throws Error - Unknown address if the format is not recognised
     * @returns A new `Address` instance
     */
    static fromDynamicInput(address) {
      if (typeof address !== "string" && "toB256" in address) {
        return Address.fromB256(address.toB256());
      }
      if (isPublicKey(address)) {
        return Address.fromPublicKey(address);
      }
      if (isBech32(address)) {
        return new Address(address);
      }
      if (isB256(address)) {
        return Address.fromB256(address);
      }
      if (isEvmAddress(address)) {
        return Address.fromEvmAddress(address);
      }
      throw new FuelError(
        FuelError.CODES.PARSE_FAILED,
        `Unknown address format: only 'Bech32', 'B256', or 'Public Key (512)' are supported.`
      );
    }
    /**
     * Takes an Evm Address and returns back an `Address`
     *
     * @returns A new `Address` instance
     */
    static fromEvmAddress(evmAddress) {
      if (!isEvmAddress(evmAddress)) {
        throw new FuelError(
          FuelError.CODES.INVALID_EVM_ADDRESS,
          `Invalid Evm Address: ${evmAddress}.`
        );
      }
      const paddedAddress = padFirst12BytesOfEvmAddress(evmAddress);
      return new Address(toBech32(paddedAddress));
    }
  };

  // ../hasher/dist/index.mjs
  function hash2(data) {
    return sha2562(data);
  }

  // ../math/dist/index.mjs
  var import_bn = __toESM(require_bn(), 1);
  var DEFAULT_PRECISION = 9;
  var DEFAULT_MIN_PRECISION = 3;
  var DECIMAL_UNITS = 9;
  function toFixed(value, options) {
    const { precision = DEFAULT_PRECISION, minPrecision = DEFAULT_MIN_PRECISION } = options || {};
    const [valueUnits = "0", valueDecimals = "0"] = String(value || "0.0").split(".");
    const groupRegex = /(\d)(?=(\d{3})+\b)/g;
    const units = valueUnits.replace(groupRegex, "$1,");
    let decimals = valueDecimals.slice(0, precision);
    if (minPrecision < precision) {
      const trimmedDecimal = decimals.match(/.*[1-9]{1}/);
      const lastNonZeroIndex = trimmedDecimal?.[0].length || 0;
      const keepChars = Math.max(minPrecision, lastNonZeroIndex);
      decimals = decimals.slice(0, keepChars);
    }
    const decimalPortion = decimals ? `.${decimals}` : "";
    return `${units}${decimalPortion}`;
  }
  var BN = class extends import_bn.default {
    MAX_U64 = "0xFFFFFFFFFFFFFFFF";
    constructor(value, base, endian) {
      if (BN.isBN(value)) {
        super(value.toArray(), base, endian);
        return;
      }
      if (typeof value === "string" && value.slice(0, 2) === "0x") {
        super(value.substring(2), base || "hex", endian);
        return;
      }
      const defaultValue = value == null ? 0 : value;
      super(defaultValue, base, endian);
    }
    // ANCHOR: HELPERS
    // make sure we always include `0x` in hex strings
    toString(base, length) {
      const output2 = super.toString(base, length);
      if (base === 16 || base === "hex") {
        return `0x${output2}`;
      }
      return output2;
    }
    toHex(bytesPadding) {
      const bytes2 = bytesPadding || 0;
      const bytesLength = bytes2 * 2;
      if (this.isNeg()) {
        throw new FuelError(ErrorCode.CONVERTING_FAILED, "Cannot convert negative value to hex.");
      }
      if (bytesPadding && this.byteLength() > bytesPadding) {
        throw new FuelError(
          ErrorCode.CONVERTING_FAILED,
          `Provided value ${this} is too large. It should fit within ${bytesPadding} bytes.`
        );
      }
      return this.toString(16, bytesLength);
    }
    toBytes(bytesPadding) {
      if (this.isNeg()) {
        throw new FuelError(ErrorCode.CONVERTING_FAILED, "Cannot convert negative value to bytes.");
      }
      return Uint8Array.from(this.toArray(void 0, bytesPadding));
    }
    toJSON() {
      return this.toString(16);
    }
    valueOf() {
      return this.toString();
    }
    format(options) {
      const {
        units = DECIMAL_UNITS,
        precision = DEFAULT_PRECISION,
        minPrecision = DEFAULT_MIN_PRECISION
      } = options || {};
      const formattedUnits = this.formatUnits(units);
      const formattedFixed = toFixed(formattedUnits, { precision, minPrecision });
      if (!parseFloat(formattedFixed)) {
        const [, originalDecimals = "0"] = formattedUnits.split(".");
        const firstNonZero = originalDecimals.match(/[1-9]/);
        if (firstNonZero && firstNonZero.index && firstNonZero.index + 1 > precision) {
          const [valueUnits = "0"] = formattedFixed.split(".");
          return `${valueUnits}.${originalDecimals.slice(0, firstNonZero.index + 1)}`;
        }
      }
      return formattedFixed;
    }
    formatUnits(units = DECIMAL_UNITS) {
      const valueUnits = this.toString().slice(0, units * -1);
      const valueDecimals = this.toString().slice(units * -1);
      const length = valueDecimals.length;
      const defaultDecimals = Array.from({ length: units - length }).fill("0").join("");
      const integerPortion = valueUnits ? `${valueUnits}.` : "0.";
      return `${integerPortion}${defaultDecimals}${valueDecimals}`;
    }
    // END ANCHOR: HELPERS
    // ANCHOR: OVERRIDES to accept better inputs
    add(v) {
      return this.caller(v, "add");
    }
    pow(v) {
      return this.caller(v, "pow");
    }
    sub(v) {
      return this.caller(v, "sub");
    }
    div(v) {
      return this.caller(v, "div");
    }
    mul(v) {
      return this.caller(v, "mul");
    }
    mod(v) {
      return this.caller(v, "mod");
    }
    divRound(v) {
      return this.caller(v, "divRound");
    }
    lt(v) {
      return this.caller(v, "lt");
    }
    lte(v) {
      return this.caller(v, "lte");
    }
    gt(v) {
      return this.caller(v, "gt");
    }
    gte(v) {
      return this.caller(v, "gte");
    }
    eq(v) {
      return this.caller(v, "eq");
    }
    cmp(v) {
      return this.caller(v, "cmp");
    }
    // END ANCHOR: OVERRIDES to accept better inputs
    // ANCHOR: OVERRIDES to output our BN type
    sqr() {
      return new BN(super.sqr().toArray());
    }
    neg() {
      return new BN(super.neg().toArray());
    }
    abs() {
      return new BN(super.abs().toArray());
    }
    toTwos(width) {
      return new BN(super.toTwos(width).toArray());
    }
    fromTwos(width) {
      return new BN(super.fromTwos(width).toArray());
    }
    // END ANCHOR: OVERRIDES to output our BN type
    // ANCHOR: OVERRIDES to avoid losing references
    caller(v, methodName) {
      const output2 = super[methodName](new BN(v));
      if (BN.isBN(output2)) {
        return new BN(output2.toArray());
      }
      if (typeof output2 === "boolean") {
        return output2;
      }
      return output2;
    }
    clone() {
      return new BN(this.toArray());
    }
    mulTo(num, out) {
      const output2 = new import_bn.default(this.toArray()).mulTo(num, out);
      return new BN(output2.toArray());
    }
    egcd(p) {
      const { a, b, gcd } = new import_bn.default(this.toArray()).egcd(p);
      return {
        a: new BN(a.toArray()),
        b: new BN(b.toArray()),
        gcd: new BN(gcd.toArray())
      };
    }
    divmod(num, mode, positive) {
      const { div, mod } = new import_bn.default(this.toArray()).divmod(new BN(num), mode, positive);
      return {
        div: new BN(div?.toArray()),
        mod: new BN(mod?.toArray())
      };
    }
    maxU64() {
      return this.gte(this.MAX_U64) ? new BN(this.MAX_U64) : this;
    }
    normalizeZeroToOne() {
      return this.isZero() ? new BN(1) : this;
    }
    // END ANCHOR: OVERRIDES to avoid losing references
  };
  var bn = (value, base, endian) => new BN(value, base, endian);
  bn.parseUnits = (value, units = DECIMAL_UNITS) => {
    const valueToParse = value === "." ? "0." : value;
    const [valueUnits = "0", valueDecimals = "0"] = valueToParse.split(".");
    const length = valueDecimals.length;
    if (length > units) {
      throw new FuelError(
        ErrorCode.CONVERTING_FAILED,
        `Decimal can't have more than ${units} digits.`
      );
    }
    const decimals = Array.from({ length: units }).fill("0");
    decimals.splice(0, length, valueDecimals);
    const amount = `${valueUnits.replaceAll(",", "")}${decimals.join("")}`;
    return bn(amount);
  };
  function toBytes2(value, bytesPadding) {
    return bn(value).toBytes(bytesPadding);
  }

  // src/signer.ts
  var elliptic = __toESM(require_elliptic());
  var { ec: EC } = elliptic;
  function getCurve() {
    return new EC("secp256k1");
  }
  var Signer = class {
    address;
    publicKey;
    compressedPublicKey;
    privateKey;
    /**
     * Create a Signer instance from a given private key
     *
     * @param privateKey - The private key to use for signing
     * @returns A new Signer instance
     */
    constructor(privateKey) {
      if (typeof privateKey === "string") {
        if (privateKey.match(/^[0-9a-f]*$/i) && privateKey.length === 64) {
          privateKey = `0x${privateKey}`;
        }
      }
      const privateKeyBytes = getBytesCopy(privateKey);
      const keyPair = getCurve().keyFromPrivate(privateKeyBytes, "hex");
      this.compressedPublicKey = hexlify(Uint8Array.from(keyPair.getPublic(true, "array")));
      this.publicKey = hexlify(Uint8Array.from(keyPair.getPublic(false, "array").slice(1)));
      this.privateKey = hexlify(privateKeyBytes);
      this.address = Address.fromPublicKey(this.publicKey);
    }
    /**
     * Sign data using the Signer instance
     *
     * Signature is a 64 byte array of the concatenated r and s values with the compressed recoveryParam byte. [Read more](FuelLabs/fuel-specs/specs/protocol/cryptographic_primitives.md#public-key-cryptography)
     *
     * @param data - The data to be sign
     * @returns hashed signature
     */
    sign(data) {
      const keyPair = getCurve().keyFromPrivate(getBytesCopy(this.privateKey), "hex");
      const signature = keyPair.sign(getBytesCopy(data), {
        canonical: true
      });
      const r = toBytes2(signature.r, 32);
      const s = toBytes2(signature.s, 32);
      s[0] |= (signature.recoveryParam || 0) << 7;
      return concat([r, s]);
    }
    /**
     * Add point on the current elliptic curve
     *
     * @param point - Point to add on the curve
     * @returns compressed point on the curve
     */
    addPoint(point) {
      const p0 = getCurve().keyFromPublic(getBytesCopy(this.compressedPublicKey));
      const p1 = getCurve().keyFromPublic(getBytesCopy(point));
      const result = p0.getPublic().add(p1.getPublic());
      return hexlify(Uint8Array.from(result.encode("array", true)));
    }
    /**
     * Recover the public key from a signature performed with [`sign`](#sign).
     *
     * @param data - Data
     * @param signature - hashed signature
     * @returns public key from signature from the
     */
    static recoverPublicKey(data, signature) {
      const signedMessageBytes = getBytesCopy(signature);
      const r = signedMessageBytes.slice(0, 32);
      const s = signedMessageBytes.slice(32, 64);
      const recoveryParam = (s[0] & 128) >> 7;
      s[0] &= 127;
      const publicKey = getCurve().recoverPubKey(getBytesCopy(data), { r, s }, recoveryParam).encode("array", false).slice(1);
      return hexlify(Uint8Array.from(publicKey));
    }
    /**
     * Recover the address from a signature performed with [`sign`](#sign).
     *
     * @param data - Data
     * @param signature - Signature
     * @returns Address from signature
     */
    static recoverAddress(data, signature) {
      return Address.fromPublicKey(Signer.recoverPublicKey(data, signature));
    }
    /**
     * Generate a random privateKey
     *
     * @param entropy - Adds extra entropy to generate the privateKey
     * @returns random 32-byte hashed
     */
    static generatePrivateKey(entropy) {
      return entropy ? hash2(concat([randomBytes22(32), getBytesCopy(entropy)])) : randomBytes22(32);
    }
    /**
     * Extended publicKey from a compact publicKey
     *
     * @param publicKey - Compact publicKey
     * @returns extended publicKey
     */
    static extendPublicKey(publicKey) {
      const keyPair = getCurve().keyFromPublic(getBytesCopy(publicKey));
      return hexlify(Uint8Array.from(keyPair.getPublic(false, "array").slice(1)));
    }
  };
  var signer_default = Signer;
})();
/*! Bundled license information:

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=index.global.js.map