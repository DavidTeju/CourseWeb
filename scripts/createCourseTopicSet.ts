import {course} from "./courseType";

import {Counter, getListOfWords, getMostCommon} from "./commonWords";

const stopwords: string[] = require("stopwords").english

import array from "../data/allCourses.json"


function getCourseTopicSet(course: course){
    let listOfWords = getListOfWords(course.description)

    listOfWords = listOfWords.filter(word => !isStopWord(word))

    return Counter(listOfWords)
}

function isStopWord(word: string) {
    if (getMostCommon().includes(word))
        return true
    else if (stopwords.includes(word))
        return true
    return false
}

console.log(getCourseTopicSet(array[50]))
