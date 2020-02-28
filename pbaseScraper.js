var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var rp = require('request-promise');
var request = require('request');
var http = require('http');
var fs = require('fs');
var path = require('path');
var $ = require('cheerio');
var url = 'https://pbase.com/larpman/export';
var makeDirectoryFromUrl = function (url, rootPath) {
    var directory = path.basename(url);
    var fullPath = path.join(rootPath, directory);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath);
    }
    return fullPath;
};
var processGalleries = function (url, rootPath) {
    return __awaiter(this, void 0, void 0, function () {
        var il, sg, currentPath;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Processing gallery: ' + url);
                    return [4 /*yield*/, getImageLinks(url)];
                case 1:
                    il = _a.sent();
                    return [4 /*yield*/, getSubGalleries(url)];
                case 2:
                    sg = _a.sent();
                    currentPath = rootPath;
                    if ((sg || []).length > 0) {
                        currentPath = makeDirectoryFromUrl(url, rootPath);
                    }
                    console.log('IL:');
                    console.log(il);
                    asyncForEach((il || []), function (img) { return __awaiter(_this, void 0, void 0, function () {
                        var imgPath;
                        return __generator(this, function (_a) {
                            imgPath = path.join(currentPath, img.substring(img.length - 20, img.length));
                            downloadImage(img, imgPath);
                            console.log(img);
                            return [2 /*return*/];
                        });
                    }); });
                    console.log('SG:');
                    console.log(sg);
                    asyncForEach((sg || []), function (gallery) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, processGalleries(gallery, currentPath)];
                                case 1:
                                    _a.sent();
                                    console.log(gallery);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    });
};
var getImageLinks = function (url) {
    return __awaiter(this, void 0, void 0, function () {
        var html, images, imageLinks, i, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rp(url)];
                case 1:
                    html = _a.sent();
                    images = $('a[imgsize="original"]', html);
                    imageLinks = [];
                    for (i = 0; i < images.length; i++) {
                        imageLinks.push(images[i].attribs.imgurl);
                    }
                    return [2 /*return*/, imageLinks];
                case 2:
                    err_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var downloadImage = function (url, imgPath) {
    return __awaiter(this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = fs.createWriteStream(imgPath);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var stream = request({
                                uri: url,
                                headers: {
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                                    'Accept-Encoding': 'gzip, deflate, br',
                                    'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
                                    'Cache-Control': 'max-age=0',
                                    'Connection': 'keep-alive',
                                    'Upgrade-Insecure-Requests': '1',
                                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
                                },
                                gzip: true
                            })
                                .pipe(file)
                                .on('finish', function () {
                                console.log("The file is finished downloading.");
                                resolve();
                            })
                                .on('error', function (error) {
                                reject(error);
                            });
                        })["catch"](function (error) {
                            console.log("Something happened: " + error);
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
};
var getSubGalleries = function (url) {
    return __awaiter(this, void 0, void 0, function () {
        var html, galleries, subGalleries, i, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, rp(url)];
                case 1:
                    html = _a.sent();
                    galleries = $('tr > td.thumbnail > a.thumbnail', html);
                    subGalleries = [];
                    for (i = 0; i < galleries.length; i++) {
                        subGalleries.push(galleries[i].attribs.href);
                    }
                    return [2 /*return*/, subGalleries];
                case 2:
                    err_2 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var asyncForEach = function (array, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < array.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, callback(array[index], index, array)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    index++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
};
processGalleries(url, './images/');
