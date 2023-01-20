import {course} from "./courseType";
import {JSDOM} from "jsdom";
import {writeFile} from "fs";


const domain = "https://bulletin.dom.edu/";
const bulletinStartPageLink = `${domain}content.php?catoid=21&navoid=3956`;

fetch(bulletinStartPageLink)
    .then(response => response.text())
    .then(scrapeAllCourses)
    .then(courseArray => {
        console.log(`Processed ${courseArray.length} courses`);
        return courseArray
    })
    .then((courseArray) => JSON.stringify(courseArray, null, 2))
    .then(jsonString => writeFile("allCourses.json", jsonString, () => {
    }));

function scrapeAllCourses(HTMLText: string) {

    const dom = new JSDOM(HTMLText);
    const document: Document = dom.window.document;

    const linksToDepartmentPages = Array.from(document.querySelectorAll<HTMLAnchorElement>("a"))
        .filter(element => element.text.startsWith("Go to information for"))
        .map((anchor) => domain + anchor.href);

    const coursesInEachDepartment = linksToDepartmentPages.map(scrapeDepartmentCourses);
    return Promise.all(coursesInEachDepartment)
        .then(coursesByDepartment => coursesByDepartment.flat())
}

async function scrapeDepartmentCourses(fullLink: string) {
    const pageText = await fetch(fullLink).then((response) => response.text());
    const dom = new JSDOM(pageText);

    const document: Document = dom.window.document;

    const courses = Array.from(
        document.querySelectorAll("#courses+ul>li>a")
    );

    const mappedCourses = courses
        .map(extractParameters)
        .map((parameters) => scrapeCourse(...parameters));

    return await Promise.all(mappedCourses);
}

function extractParameters(hey: Element) {
    const MATCH_COURSE_INFO_GET_FUNCTION = /showCourse\('(\d+)',\s*'(\d+)',\s*\w+,\s*'(.*?)'\)/gm
    //Capture groups are the parameters
    return Array.from(
        hey
            .getAttribute("onclick")!
            .matchAll(MATCH_COURSE_INFO_GET_FUNCTION)
    )[0].slice(1, 4) as [string, string, string];
}

async function scrapeCourse(
    catalog: string,
    courseParam: string,
    display_options: string
): Promise<course> {
    const MATCH_AFTER_HR = /<\s*hr[^>]*>(.*)/m;
    const MATCH_HTML_TAG = /<\s*[^>]*>/gm;
    const courseLink = `https://bulletin.dom.edu/ajax/preview_course.php?catoid=${catalog}&coid=${courseParam}&display_options=${display_options}&show`;

    async function getCourseDataDocument() {
        const courseData = await fetch(courseLink).then((response) =>
            response.text()
        );
        const dom = new JSDOM(courseData);

        const document: Document = dom.window.document;
        return document.querySelector<HTMLDivElement>(
            "td.coursepadding div:nth-child(2)"
        );
    }

    function extractCourseCodes(preReqString: string): string[] {
        const MATCH_PRE_REQ_OR_PAIRS = /(?:[A-Za-z]{4} \d{3} or )*[A-Za-z]{4} \d{3}/gm;

        return Array.from(
            preReqString.matchAll(MATCH_PRE_REQ_OR_PAIRS)
        ).map((match) => match.toString());
    }

    function parseCourseData(courseInfoAsString: string)
        : [string[], string[], string[], string] {
        courseInfoAsString = courseInfoAsString
            .match(MATCH_AFTER_HR)![1] //captured group
            .replace(/<br>/gm, "\n")
            .replace(/&nbsp;/gm, " ")
            .replace(MATCH_HTML_TAG, "")
            .replace(/(\s)+/gm, "$1") //trim repeating whitespace
            .trim();

        const MATCH_PREREQUISITE_STRING = /[Pp]rerequisite\(s\):(.*?)(?:$|\.)/m
        const MATCH_SATISFIED_REQUIREMENTS = /[Tt]his course will satisfy the core(?: area)? requirement in (.*?)(?:$|\.)/gm
        const MATCH_ALIAS_STRING = /[Ll]isted also as(.*?)(?:$|\.)/m;
        const preReqString =
            courseInfoAsString.match(MATCH_PREREQUISITE_STRING)?.[0] ??
            "";
        const aliasString = courseInfoAsString.match(MATCH_ALIAS_STRING)?.[0] ?? "";

        const preReqs = extractCourseCodes(preReqString);
        const aliases = extractCourseCodes(aliasString);
        const satisfiedRequirements = [...courseInfoAsString.matchAll(MATCH_SATISFIED_REQUIREMENTS)].map(match => match[1]);

        const description = courseInfoAsString
            .replace(preReqString, "")
            .replace(aliasString, "")
            .replace(/(\s)+/gm, "$1") //trim repeating whitespace
            .replace(MATCH_SATISFIED_REQUIREMENTS, "")
            .trim();

        return [preReqs, aliases, satisfiedRequirements, description];
    }

    let relevantElement: HTMLElement | null = null;
    while (relevantElement == null) {
        relevantElement = await getCourseDataDocument();
    }

    const courseFullName = relevantElement.querySelector("h3")!.textContent!;
    const courseName = courseFullName.split("-")[1].trim();
    const courseCode = courseFullName.split("-")[0].trim();

    const courseData = parseCourseData(relevantElement.innerHTML);

    let [preRequisites, aliases, satisfiedRequirements, description] = courseData;
    return {
        courseCode,
        courseName,
        courseLink,
        preRequisites,
        aliases,
        satisfiedRequirements,
        description,
    };
}





