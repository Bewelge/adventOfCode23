window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			let mapBlocks = text.split("\n\n").map(block => block.split("\n"))

			let seeds = mapBlocks.splice(0, 1)[0][0]

			//remove title row
			mapBlocks.forEach(block => block.splice(0, 1))
			mapBlocks = mapBlocks.map(block =>
				block.map(line => line.split(" ").map(string => parseInt(string))),
			)

			seeds = seeds
				.split(":")[1]
				.trim()
				.split(" ")
				.map(string => parseInt(string))

			partOne(seeds, mapBlocks)

			//PART TWO
			partTwo(seeds, mapBlocks)
		})
}
function partOne(seeds, mappingBlocks) {
	console.time("Part one time")
	let minNumber = Infinity
	seeds.map(seed => {
		let number = seed
		mappingBlocks.forEach(mappings => (number = findMapping(number, mappings)))
		minNumber = Math.min(minNumber, number)
	})
	console.log("Minimum mapped number is " + minNumber)
	console.timeEnd("Part one time")
}
const findMapping = (number, mappings) => {
	const mapping = mappings.find(
		mapping => mapping[1] <= number && mapping[1] + mapping[2] > number,
	)
	return mapping ? number - mapping[1] + mapping[0] : number
}
function partTwo(seeds, mappingBlocks) {
	console.time("Part two time")

	//Create objects for seed ranges
	let seedRanges = []
	for (let i = 0; i < seeds.length; i += 2) {
		seedRanges.push({ number: seeds[i], range: seeds[i + 1] })
	}

	//Iterate through the mapping blocks and apply the mappings to the ranges
	for (let i = 0; i < mappingBlocks.length; i++) {
		const mappings = mappingBlocks[i]
		seedRanges = computeSeedRanges(seedRanges, mappings)
	}

	//Get min number of resulting ranges
	const minSeedRange = seedRanges.reduce(
		(prev, curr) => Math.min(prev, curr.number),
		Infinity,
	)
	console.log("Min Seed range: " + minSeedRange)
	console.timeEnd("Part two time")
}

const computeSeedRanges = (seedRanges, mappings) => {
	let newRanges = []
	seedRanges.forEach(seedRange => {
		const computedBlock = computeMappingSeedRange(seedRange, mappings)
		newRanges.push(computedBlock)
	})
	return newRanges.flatMap(_ => _)
}
const computeMappingSeedRange = (seedRange, mappings) => {
	let newRanges = []
	for (let i = 0; i < mappings.length; i++) {
		const mapping = mappings[i]
		let rangeFit = isRangeInMapping(seedRange.number, seedRange.range, mapping)

		if (rangeFit.isCompleteInMapping) {
			//Range fits completely in one mapping -> just apply the mapping and return the transformed range
			let newRange = { ...seedRange }
			newRange.number -= mapping[1] - mapping[0]

			newRanges.push(newRange)
			return newRanges
		} else if (rangeFit.isStartInMapping) {
			//Range start is in mapping but mapping doesn't cover it completely -> apply mapping to start of range and add it to new ranges + adjust start of seedRange
			let newRange = { ...seedRange }
			newRange.range = mapping[1] + mapping[2] - seedRange.number
			let leftOverRange = {
				range: seedRange.number + seedRange.range - (mapping[1] + mapping[2]),
				number: mapping[1] + mapping[2],
			}
			newRange.number -= mapping[1] - mapping[0]
			newRanges.push(newRange)
			newRanges.push(computeMappingSeedRange(leftOverRange, mappings))
			return newRanges.flatMap(_ => _)
		} else if (rangeFit.isEndInMapping) {
			//Range end is in mapping but mapping doesn't cover it completely -> apply mapping to end of range and add it to new ranges + adjust range of seedRange

			let newRange = { ...seedRange }
			newRange.number = mapping[1]
			newRange.range = seedRange.number + seedRange.range - mapping[1]
			newRange.number -= mapping[1] - mapping[0]
			newRanges.push(newRange)
			newRanges.push(
				computeMappingSeedRange(
					{
						...seedRange,
						range: mapping[1] - seedRange.number,
					},
					mappings,
				),
			)
			return newRanges.flatMap(_ => _)
		} else if (rangeFit.isMiddleInMapping) {
			//Range is larger than mapping -> apply mapping to intersecting part of range and create two new ranges for the start and end part
			let newRange = { number: mapping[1], range: mapping[2] }
			newRange.number -= mapping[1] - mapping[0]
			newRanges.push(newRange)
			newRanges.push(
				computeMappingSeedRange(
					{ ...seedRange, range: mapping[1] - seedRange.number },
					mappings,
				),
			)
			newRanges.push(
				computeMappingSeedRange(
					{
						number: mapping[1] + mapping[2],
						range:
							seedRange.number + seedRange.range - (mapping[1] + mapping[2]),
					},
					mappings,
				),
			)
			return newRanges.flatMap(_ => _)
		}
	}
	//If none of the ranges overlapped return the unmodified seedRange
	newRanges.push({ ...seedRange })
	return newRanges.flatMap(_ => _)
}

const isRangeInMapping = (number, range, mapping) => {
	let isStartInMapping =
		mapping[1] <= number && mapping[1] + mapping[2] > number
	let isEndInMapping =
		mapping[1] <= number + range - 1 &&
		mapping[1] + mapping[2] > number + range - 1
	let isCompleteInMapping = isEndInMapping && isStartInMapping
	let isMiddleInMapping =
		!isStartInMapping &&
		!isEndInMapping &&
		mapping[1] > number &&
		mapping[1] + mapping[2] <= number + range
	return {
		isStartInMapping,
		isEndInMapping,
		isCompleteInMapping,
		isMiddleInMapping,
	}
}
