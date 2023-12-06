window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			console.log(text)
			const { times, distances } = parseInput(text)

			partOne(times, distances)

			partTwo(times, distances)
		})
}

function parseInput(text) {
	const lines = text.split("\n")

	const times = lines[0]
		.split(":")[1]
		.split(" ")
		.filter(char => char != "")
	const distances = lines[1]
		.split(":")[1]
		.split(" ")
		.filter(char => char != "")
	return { lines, times, distances }
}
// Have to solve the following inequality equation
// bestDistance <  (time - timePressed ) * timePressed
// We can find the upper and lower bounds using:  timePressed = time/2 +- sqrt( time**2 - 4*distance ) / 2
const computeRaceWinningRange = race => {
	const { time, distance } = race
	const halfTime = time / 2
	//add one to distance since we're looking for whole numbers and we want to actually beat the record.
	const sqrtPart = Math.sqrt(time ** 2 - 4 * (distance + 1)) / 2
	const lowerBound = Math.ceil(halfTime - sqrtPart)
	const upperBound = Math.min(time, Math.floor(halfTime + sqrtPart))

	return upperBound - lowerBound + 1
}

function partOne(times, distances) {
	console.time("Part one time")
	const races = Array(times.length)
		.fill(0)
		.map((_, i) => ({
			time: parseInt(times[i]),
			distance: parseInt(distances[i]),
		}))

	const racesProduct = races.reduce(
		(accum, race) => accum * computeRaceWinningRange(race),
		1,
	)
	console.log(`Product of winning durations: ${racesProduct}`)
	console.timeEnd("Part one time")
}

function partTwo(times, distances) {
	console.time("Part two time")
	const bigRace = {
		time: parseInt(times.join("")),
		distance: parseInt(distances.join("")),
	}
	console.log(`Part two big race `, bigRace)

	console.log(
		`Part two: Winning durations of big race: ${computeRaceWinningRange(
			bigRace,
		)}`,
	)
	console.timeEnd("Part two time")
}
