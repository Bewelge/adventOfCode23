window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			const { lines } = parseInput(text)
			partOne(lines)
			partTwo(lines)
		})
}
function parseInput(text) {
	console.time("Parsing input time")
	const lines = text
		.split("\n")
		.map(line => line.split(" ").map(num => parseInt(num)))
	lines.splice(-1, 1)

	console.timeEnd("Parsing input time")
	return { lines }
}

function partOne(lines) {
	console.time("Part one time")
	const predictionsSum = lines.reduce(
		(prev, curr) => prev + predictNextNumber(curr),
		0,
	)
	console.log(`Part one: Sum of all predicitoins: ${predictionsSum}`)
	console.timeEnd("Part one time")
}
function predictNextNumber(arr) {
	const arrs = [arr.slice()]
	let prevArr = arr.slice()
	while (!isAllSame(prevArr)) {
		let nextArr = []
		for (let i = 1; i < prevArr.length; i++) {
			nextArr.push(prevArr[i] - prevArr[i - 1])
		}
		arrs.push(nextArr)
		prevArr = nextArr
	}
	for (let i = arrs.length - 2; i >= 0; i--) {
		if (i == 0) {
			return arrs[i][arrs[i].length - 1] + arrs[i + 1][arrs[i + 1].length - 1]
		}
		arrs[i].push(
			arrs[i][arrs[i].length - 1] + arrs[i + 1][arrs[i + 1].length - 1],
		)
	}
}

function partTwo(lines) {
	console.time("Part two time")
	const predictionsSum = lines.reduce(
		(prev, curr) => prev + predictPreviousNumber(curr),
		0,
	)
	console.log(`Part two: Sum of all predicitoins: ${predictionsSum}`)
	console.timeEnd("Part two time")
}

function predictPreviousNumber(arr) {
	const arrs = [arr.slice()]
	let prevArr = arr.slice()
	while (!isAllSame(prevArr)) {
		let nextArr = []
		for (let i = 1; i < prevArr.length; i++) {
			nextArr.push(prevArr[i] - prevArr[i - 1])
		}
		arrs.push(nextArr)
		prevArr = nextArr
	}
	for (let i = arrs.length - 2; i >= 0; i--) {
		if (i == 0) {
			return arrs[i][0] - arrs[i + 1][0]
		}
		arrs[i].unshift(arrs[i][0] - arrs[i + 1][0])
	}
}

function isAllSame(arr) {
	return arr.every(val => val == arr[0])
}
