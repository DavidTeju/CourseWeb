import array from "../data/allCourses.json"

export function Counter(array: string[]) {
    let count: { [key: string]: number } = {};
    array.forEach(val => count[val] = (count[val] || 0) + 1);
    return count;
}

export function getListOfWords(text: string) {
    return text.toLowerCase()
        .replace(/[.;,()\[\]:"\s]/gm, " ") // replace punctuation and new lines with space
        .replace(/\s+/gm, " ") //Replace duplicate whitespace with single space
        .split(" ")
}


export function getMostCommon() {
    const wordsMappedToFrequency = Counter(
        array.map(course => course.description)
            .map(description => getListOfWords(description))
            .map(wordsList => [...new Set(wordsList)]) //Eliminate duplicate words in each course's set to ensure final frequency is frequency of courses the word appears in. High course frequency =  less usefulness in rank weights
            .reduce((previousValue, currentValue) => previousValue.concat(currentValue))
    )

    return Object.keys(wordsMappedToFrequency)
        .map((key): [string, number] => [key, wordsMappedToFrequency[key]])
        .sort((f, s) => (s[1] - f[1]))
        .filter(value => value[1] > array.length / 5)//If more than 20% of courses have the word
        .map(word => word[0])
}

//Right now, it's kind of incorrect because Very many of the courses have no description so the freq of words are less
// than they'd actually be if all courses had proper description. Come proper data, this script will work perfectly
console.log(getMostCommon())