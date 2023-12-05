window.onload = () => {
  fetch("input.txt")
    .then((result) => result.text())
    .then((te2xt) => {
      let text = `seeds: 79 14 55 13

      seed-to-soil map:
      50 98 2
      52 50 48

      soil-to-fertilizer map:
      0 15 37
      37 52 2
      39 0 15

      fertilizer-to-water map:
      49 53 8
      0 11 42
      42 0 7
      57 7 4

      water-to-light map:
      88 18 7
      18 25 70

      light-to-temperature map:
      45 77 23
      81 45 19
      68 64 13

      temperature-to-humidity map:
      0 69 1
      1 0 69

      humidity-to-location map:
      60 56 37
      56 93 4`
      let blocks = text.split("\n\n").map((block) => block.split("\n"))

      let seeds = blocks.splice(0, 1)[0][0]

      //remove title row
      blocks.forEach((block) => block.splice(0, 1))
      blocks = blocks.map((block) =>
        block.map((line) => line.split(" ").map((string) => parseInt(string)))
      )

      seeds = seeds
        .split(":")[1]
        .trim()
        .split(" ")
        .map((string) => parseInt(string))

      let minNumber = Infinity
      seeds.map((seed) => {
        let number = seed
        blocks.forEach((block) => (number = findMapping(number, block)))
        minNumber = Math.min(minNumber, number)
      })
      console.log("Minimum mapped number is " + minNumber)

      const seedRanges = []
      for (let i = 0; i < seeds.length; i += 2) {
        seedRanges.push({ number: seeds[i], range: seeds[i + 1] })
      }
      console.log("Seed ranges " + seedRanges)
    })
}

const findMapping = (number, mappings) => {
  const mapping = mappings.find(
    (mapping) => mapping[1] <= number && mapping[1] + mapping[2] > number
  )
  console.log(
    "Mapping " +
      number +
      " to " +
      (mapping ? number - mapping[1] + mapping[0] : number),
    mapping
  )
  return mapping ? number - mapping[1] + mapping[0] : number
}
const findMappingForRange = (number, range, mappings) => {
  for (let i = 0; i < mappings.length; i++) {
    let mapping = mappings[i]
    // if (mapping)
  }
  const mapping = mappings.find(
    (mapping) => mapping[1] <= number && mapping[1] + mapping[2] > number
  )
  console.log(
    "Mapping " +
      number +
      " to " +
      (mapping ? number - mapping[1] + mapping[0] : number),
    mapping
  )
  return mapping ? number - mapping[1] + mapping[0] : number
}

const isRangeInMapping = (number, range, mapping) => {
  let isStartInMapping =
    mapping[1] <= number && mapping[1] + mapping[2] >= number
  let isEndInMapping =
    mapping[1] <= number + range && mapping[1] + mapping[2] >= number + range
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

console.log(isRangeInMapping(0, 14, [20, 1, 13]))
console.log(
  Array(15)
    .fill(0)
    .map((el, i) => 1 + i)
)
console.log(
  Array(13)
    .fill(0)
    .map((el, i) => 1 + i)
)
