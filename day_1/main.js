window.onload = () => {
  fetch("input.txt")
    .then((result) => result.text())
    .then((text) => {
      const lines = text.split("\n").filter((line) => line != "")
      console.log(lines)
      const sumOfAllCalibrationValues = lines
        .map((line) => getCalibrationValuesPartTwo(line))
        .reduce((prev, curr) => prev + parseInt(curr), 0)
      console.log(sumOfAllCalibrationValues)
    })
}

function getCalibrationValues(line) {
  const reversed = line.split("").reverse()
  const first = line.split("").find((char) => !isNaN(parseInt(char)))
  const last = reversed.find((char) => !isNaN(parseInt(char)))
  console.log(first, last)
  return String(first) + String(last)
}
const writtenNumbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
]
function getCalibrationValuesPartTwo(line) {
  console.log(line)
  writtenNumbers.forEach((num, i) => {
    while (line.indexOf(num) > -1) {
      const index = line.indexOf(num)
      // Replace all but the first and last of the letters of the written out number.
      // Since in some cases the these letters may be the first or last letter of another written out number
      line =
        line.slice(0, index + 1) + (i + 1) + line.slice(index + num.length - 1)
    }
    line = line.replaceAll(num, i + 1)
  })
  const chars = line.split("")
  console.log(line)
  const reversed = chars.slice().reverse()
  const first = chars.find((char) => !isNaN(parseInt(char)))
  const last = reversed.find((char) => !isNaN(parseInt(char)))
  console.log(first, last)
  return String(first) + String(last)
}
