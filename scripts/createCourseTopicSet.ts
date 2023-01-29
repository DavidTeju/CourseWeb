import {course} from "./courseType";

import {Counter, getListOfWords, getMostCommon} from "./commonWords";

import * as _ from "lodash"

import  * as array from "../data/allCourses.json"

const stopwords: string[] = require("stopwords").english


function getCourseTopicSet(course: course) {
    let listOfWords = getListOfWords(course.description)

    listOfWords = _.difference(listOfWords, getMostCommon())
    listOfWords = _.difference(listOfWords, stopwords) //Holy fuck, this shit is fast AS FUCK!

    return Counter(listOfWords)
}

let courseToTopicSets = array.map((course: course) => ({courseCode: course.courseCode, topicSet: getCourseTopicSet(course)}))

require("fs").writeFile("../data/courseTopicSets.json", JSON.stringify(courseToTopicSets, null, 2), () => {
})
