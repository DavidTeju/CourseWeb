import {course} from "./courseType";

import * as _ from "lodash";

import * as array from "../data/allCourses.json";
import removePunctuation from "@stdlib/string-remove-punctuation";

const stopwords: string[] = require("stopwords").english;

function getCourseTopicSet(course: course) {
    let listOfWords = getListOfWords(course.description);

    listOfWords = _.difference(listOfWords, getMostCommon());
    listOfWords = _.difference(listOfWords, stopwords); //Holy fuck, this shit is fast AS FUCK!

    return Counter(listOfWords);
}

function Counter(array: string[]) {
    let count: { [key: string]: number } = {};
    array.forEach((val) => (count[val] = (count[val] || 0) + 1));
    return count;
}

function getListOfWords(text: string) {
    return removePunctuation(text.toLowerCase())
        .replace(/\s+/gm, " ") // replace white space (including new line) with " "
        .split(" ");
}

function getMostCommon() {
    const wordsMappedToFrequency = Counter(
        array
            .map((course: course) => course.description)
            .map((description: string) => getListOfWords(description))
            .map((wordsList: string[]) => [...new Set(wordsList)]) //Eliminate duplicate words in each course's set to ensure final frequency is frequency of courses the word appears in. High course frequency =  less usefulness in rank weights
            .reduce((previousValue: string[], currentValue: string[]) =>
                previousValue.concat(currentValue)
            )
    );

    return Object.keys(wordsMappedToFrequency)
        .map((key): [string, number] => [key, wordsMappedToFrequency[key]])
        .sort((f, s) => s[1] - f[1])
        .filter((value) => value[1] > array.length / 5) //If more than 20% of courses have the word
        .map((word) => word[0]);
    //Right now, this function is kind of incorrect because Very many of the courses have no description so the freq of words are less
    // than they'd actually be if all courses had proper description. Come proper data, this script will work perfectly
}

let courseToTopicSets = array.map((course: course) => ({
    courseCode: course.courseCode,
    topicSet: getCourseTopicSet(course),
}));

require("fs").writeFile(
    "../data/courseTopicSets.json",
    JSON.stringify(courseToTopicSets, null, 2),
    () => {
    }
);
