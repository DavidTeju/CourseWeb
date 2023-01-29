"use strict";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var jsdom_1 = require("jsdom");
var fs_1 = require("fs");
var domain = "https://bulletin.dom.edu/";
//Breakable
var bulletinStartPageLink = "".concat(domain, "content.php?catoid=21&navoid=3956");
fetch(bulletinStartPageLink)
    .then(function (response) { return response.text(); })
    .then(scrapeAllCourses)
    .then(function (courseArray) {
    console.log("Processed ".concat(courseArray.length, " courses"));
    return courseArray;
})
    .then(function (courseArray) { return JSON.stringify(courseArray, null, 2); })
    .then(function (jsonString) {
    return (0, fs_1.writeFile)("../allCourses.json", jsonString, function (err) {
        console.log(err);
    });
});
function scrapeAllCourses(HTMLText) {
    var dom = new jsdom_1.JSDOM(HTMLText);
    var document = dom.window.document;
    var linksToDepartmentPages = Array.from(document.querySelectorAll("a"))
        .filter(function (element) { return element.text.startsWith("Go to information for"); }) //Breakable
        .map(function (anchor) { return domain + anchor.href; });
    var coursesInEachDepartment = linksToDepartmentPages.map(scrapeDepartmentCourses);
    return Promise.all(coursesInEachDepartment).then(function (coursesByDepartment) {
        return coursesByDepartment.flat();
    });
}
function scrapeDepartmentCourses(fullLink) {
    return __awaiter(this, void 0, void 0, function () {
        var pageText, dom, document, courses, mappedCourses;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(fullLink).then(function (response) { return response.text(); })];
                case 1:
                    pageText = _a.sent();
                    dom = new jsdom_1.JSDOM(pageText);
                    document = dom.window.document;
                    courses = Array.from(document.querySelectorAll("#courses+ul>li>a") //Breakable
                    );
                    mappedCourses = courses
                        .map(extractParameters)
                        .map(function (parameters) { return scrapeCourse.apply(void 0, parameters); });
                    return [4 /*yield*/, Promise.all(mappedCourses)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function extractParameters(hey) {
    var MATCH_COURSE_INFO_GET_FUNCTION = /showCourse\('(\d+)',\s*'(\d+)',\s*\w+,\s*'(.*?)'\)/gm; //Breakable
    //Capture groups are the parameters
    return Array.from(hey.getAttribute("onclick").matchAll(MATCH_COURSE_INFO_GET_FUNCTION))[0].slice(1, 4);
}
function scrapeCourse(//Breakable
catalog, courseParam, display_options) {
    return __awaiter(this, void 0, void 0, function () {
        function getCourseDataDocument() {
            return __awaiter(this, void 0, void 0, function () {
                var courseData, dom, document;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, fetch(courseLink).then(function (response) {
                                return response.text();
                            })];
                        case 1:
                            courseData = _a.sent();
                            dom = new jsdom_1.JSDOM(courseData);
                            document = dom.window.document;
                            return [2 /*return*/, document.querySelector("td.coursepadding div:nth-child(2)")];
                    }
                });
            });
        }
        function extractCourseCodes(preReqString) {
            var MATCH_PRE_REQ_OR_PAIRS = /(?:[A-Za-z]{4} \d{3} or )*[A-Za-z]{4} \d{3}/gm;
            return Array.from(preReqString.matchAll(MATCH_PRE_REQ_OR_PAIRS)).map(function (match) { return match.toString(); });
        }
        function parseCourseData(courseInfoAsString) {
            var _a, _b, _c, _d;
            courseInfoAsString = courseInfoAsString
                .match(MATCH_AFTER_HR)[1] //captured group
                .replace(/<br>/gm, "\n")
                .replace(/&nbsp;/gm, " ")
                .replace(MATCH_HTML_TAG, "")
                .replace(/(\s)+/gm, "$1") //trim repeating whitespace
                .trim();
            var MATCH_PREREQUISITE_STRING = /[Pp]rerequisite\(s\):(.*?)(?:$|\.)/m;
            var MATCH_SATISFIED_REQUIREMENTS = /[Tt]his course will satisfy the core(?: area)? requirement in (.*?)(?:$|\.)/gm;
            var MATCH_ALIAS_STRING = /[Ll]isted also as(.*?)(?:$|\.)/m;
            var preReqString = (_b = (_a = courseInfoAsString.match(MATCH_PREREQUISITE_STRING)) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "";
            var aliasString = (_d = (_c = courseInfoAsString.match(MATCH_ALIAS_STRING)) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : "";
            var preReqs = extractCourseCodes(preReqString);
            var aliases = extractCourseCodes(aliasString);
            var satisfiedRequirements = __spreadArray([], courseInfoAsString.matchAll(MATCH_SATISFIED_REQUIREMENTS), true).map(function (match) { return match[1]; });
            var description = courseInfoAsString
                .replace(preReqString, "")
                .replace(aliasString, "")
                .replace(/(\s)+/gm, "$1") //trim repeating whitespace
                .replace(MATCH_SATISFIED_REQUIREMENTS, "")
                .trim();
            return [preReqs, aliases, satisfiedRequirements, description];
        }
        var MATCH_AFTER_HR, MATCH_HTML_TAG, courseLink, relevantElement, courseFullName, courseName, courseCode, courseData, preRequisites, aliases, satisfiedRequirements, description;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    MATCH_AFTER_HR = /<\s*hr[^>]*>(.*)/m;
                    MATCH_HTML_TAG = /<\s*[^>]*>/gm;
                    courseLink = "https://bulletin.dom.edu/ajax/preview_course.php?catoid=".concat(catalog, "&coid=").concat(courseParam, "&display_options=").concat(display_options, "&show");
                    relevantElement = null;
                    _a.label = 1;
                case 1:
                    if (!(relevantElement == null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, getCourseDataDocument()];
                case 2:
                    relevantElement = _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    courseFullName = relevantElement.querySelector("h3").textContent;
                    courseName = courseFullName.split("-")[1].trim();
                    courseCode = courseFullName.split("-")[0].trim();
                    courseData = parseCourseData(relevantElement.innerHTML);
                    preRequisites = courseData[0], aliases = courseData[1], satisfiedRequirements = courseData[2], description = courseData[3];
                    return [2 /*return*/, {
                            courseCode: courseCode,
                            courseName: courseName,
                            courseLink: courseLink,
                            preRequisites: preRequisites,
                            aliases: aliases,
                            satisfiedRequirements: satisfiedRequirements,
                            description: description
                        }];
            }
        });
    });
}
