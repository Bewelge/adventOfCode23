const startingCoords = "AAA"
const endCoords = "ZZZ"

window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			const { directions, theMap } = parseInput(text)
			partOne(directions, theMap)
			partTwo(directions, theMap)
		})
}
function parseInput(text) {
	console.time("Parsing input time")
	const lines = text.split("\n")
	lines.splice(-1, 1)
	const directions = lines.shift()
	const theMap = {}
	lines
		.filter(line => line != "")
		.forEach(line => {
			const splitLine = line.split(" = ")
			const coordinates = splitLine[0]
			const leftSplit = splitLine[1].split("(")[1].split(")")[0].split(",")
			const L = leftSplit[0].trim()
			const R = leftSplit[1].trim()
			theMap[coordinates] = { L, R }
		})

	console.timeEnd("Parsing input time")
	return { directions, theMap }
}

function partOne(directions, theMap) {
	console.time("Part one time")
	let currentCoord = startingCoords
	let directionCounter = 0

	while (currentCoord != endCoords) {
		currentCoord =
			theMap[currentCoord][wrapCoords(directions, directionCounter)]
		directionCounter++
	}
	console.log(`Reached ZZZ in ${directionCounter} steps.`)
	console.timeEnd("Part one time")
}

function partTwo(directions, theMap) {
	console.time("Part two time")

	//calculate the min steps required for each of the paths and then compute the lowest common multiple of those.
	let directionCounter = 0
	const minSteps = []
	const startingFields = Object.keys(theMap).filter(coords => coords[2] == "A")
	startingFields.forEach(field => {
		directionCounter = 0
		let currentField = field
		while (currentField[2] != "Z") {
			currentField =
				theMap[currentField][wrapCoords(directions, directionCounter)]
			directionCounter++
		}
		minSteps.push(directionCounter)
	})

	console.log(
		"Reached all destinations ending in Z in " +
			calcLowestMultiple(minSteps) +
			" steps.",
	)

	console.timeEnd("Part two time")
}
function wrapCoords(string, counter) {
	return string[counter % string.length]
}

function calculateGreatstCommonDivisor(num1, num2) {
	if (num1 == num2) return num1
	const isNum1Low = num1 < num2
	let low = isNum1Low ? num1 : num2
	let high = isNum1Low ? num2 : num1
	while (!(high == 0 || low == 0 || high == low)) {
		high = high % low
		if (high < low) {
			let tmp = high
			high = low
			low = tmp
		}
	}
	return high
}
function calcLowestMultiple(minSteps) {
	let tempSum = minSteps[0]
	for (let i = 1; i < minSteps.length; i++) {
		tempSum =
			(tempSum * minSteps[i]) /
			calculateGreatstCommonDivisor(tempSum, minSteps[i])
	}

	return tempSum
}
function isAllTheSameOrZero(arr) {
	let base = arr.find(val => val != 0)
	return arr.every(val => val == 0 || base == undefined || val == base)
}

function findLowest(arr) {
	let min = Infinity
	let index = 0
	arr.forEach((val, i) => {
		if (val != 0 && val < min) {
			min = val
			index = i
		}
	})
	return { index, min }
}
