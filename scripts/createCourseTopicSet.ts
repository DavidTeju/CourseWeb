import {course} from "./courseType";

import {Counter, getListOfWords, getMostCommon} from "./commonWords";

const stopwords: string[] = require("stopwords").english

import * as _ from "lodash"

import array from "../data/allCourses.json"

function getCourseTopicSet(course: course) {
    let listOfWords = getListOfWords(course.description)

    listOfWords = _.difference(listOfWords, getMostCommon())
    listOfWords = _.difference(listOfWords, stopwords) //Holy fuck, this shit is fast AS FUCK!

    return Counter(listOfWords)
}

let courseToTopicSets = array.map((course) => ({courseCode: course.courseCode, topicSet: getCourseTopicSet(course)}))

require("fs").writeFile("../data/courseTopicSets.json", JSON.stringify(courseToTopicSets, null, 2), () => {
})
