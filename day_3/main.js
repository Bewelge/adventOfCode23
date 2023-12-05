window.onload = () => {
  fetch("input.txt")
    .then((result) => result.text())
    .then((text) => {
      const lines = text
        .split("\n")
        .filter((line) => line != "")
        .map((line) => line.split(""))
      console.log(lines)
      grid = lines
      iterateGridPartOne(grid)
      iterateGridPartTwo(grid)
    })
}

var grid = []

class Gear {
  constructor() {
    this.isGear = true
    this.numbers = []
  }
}

const iterateGridPartOne = () => {
  let sum = 0
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let tile = grid[i][j]
      let numberString = ""

      while (isNumber(tile)) {
        tile = grid[i][j]
        numberString += tile
        j++
        tile = grid[i][j]
      }
      if (numberString != "") {
        let number = parseInt(numberString)
        console.log(`Found whole number ${numberString}`)
        mostInnerLoop: for (let k = 0; k < numberString.length; k++) {
          console.log("Checking " + grid[i][j - 1 - k])
          if (isSymbolAdjacent(j - 1 - k, i)) {
            console.log(`${numberString} is a part number`)
            sum += number

            break mostInnerLoop
          }
        }
      }
    }
  }
  console.log(`Sum of all part numbers is ${sum}`)
}

const iterateGridPartTwo = () => {
  let sum = 0
  let allGears = []
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      let tile = grid[i][j]
      let numberString = ""

      while (isNumber(tile)) {
        tile = grid[i][j]
        numberString += tile
        j++
        tile = grid[i][j]
      }
      if (numberString != "") {
        let number = parseInt(numberString)
        console.log(`Found whole number ${numberString}`)
        let doneGears = []
        for (let k = 0; k < numberString.length; k++) {
          console.log("Checking " + grid[i][j - 1 - k])
          if (isGearAdjacent(j - 1 - k, i)) {
            let gears = getGearsAdjacent(j - 1 - k, i)
            gears
              .filter(
                (gear) =>
                  (!gear.isGear && gear.tile) || !doneGears.includes(gear)
              )
              .forEach((gear) => {
                if (gear.tile.isGear && !doneGears.includes(gear.tile)) {
                  gear.tile.numbers.push(number)
                  doneGears.push(gear.tile)
                } else if (gear.tile === "*" && !doneGears.includes(gear)) {
                  const gearObj = new Gear()
                  grid[gear.row][gear.col] = gearObj
                  gearObj.numbers.push(number)
                  doneGears.push(gearObj)
                  allGears.push(gearObj)
                }
              })
            console.log(gears)
            sum += number
          }
        }
      }
    }
  }
  const sumOfAllGears = allGears
    .filter((gear) => gear.numbers.length == 2)
    .reduce((prev, curr) => prev + curr.numbers[0] * curr.numbers[1], 0)
  console.log(`Sum of all gears with 2 adjacent numbers is ${sumOfAllGears}`)
  //   console.log(`Sum of all part numbers is ${sum}`)
}

const countNeighbors = (col, row, isCondition) => {
  let count = 0
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let checkCol = col + i
      let checkRow = row + j
      if (
        isInGrid(checkCol, checkRow) &&
        (checkRow != row || checkCol != col) &&
        isCondition(grid[checkRow][checkCol])
      ) {
        console.log(
          "Istrue - " +
            checkCol +
            "-" +
            checkRow +
            " - " +
            grid[checkRow][checkCol]
        )
        count++
      }
    }
  }
  return count
}
const isNeighbors = (col, row, isCondition) => {
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let checkCol = col + i
      let checkRow = row + j
      if (
        isInGrid(checkCol, checkRow) &&
        (checkRow != row || checkCol != col) &&
        isCondition(grid[checkRow][checkCol])
      ) {
        return true
      }
    }
  }
  return false
}
const getNeighbors = (col, row, isCondition) => {
  let neighbors = []
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let checkCol = col + i
      let checkRow = row + j
      if (
        isInGrid(checkCol, checkRow) &&
        (checkRow != row || checkCol != col) &&
        isCondition(grid[checkRow][checkCol])
      ) {
        console.log("ISNEIGH")
        neighbors.push({
          row: checkRow,
          col: checkCol,
          tile: grid[checkRow][checkCol],
        })
      }
    }
  }
  return neighbors
}

const isGearAdjacent = (col, row) => isNeighbors(col, row, isGear)
const getGearsAdjacent = (col, row) => getNeighbors(col, row, isGear)
const isSymbolAdjacent = (col, row) => isNeighbors(col, row, isSymbol)
const isNumberAdjacent = (col, row) => isNeighbors(col, row, isNumber)
const countNumberAdjacent = (col, row) => countNeighbors(col, row, isNumber)

const isInGrid = (col, row) =>
  col >= 0 && col < grid[0].length && row >= 0 && row < grid.length
const isSymbol = (char) => char !== "." && isNaN(parseInt(char))
const isGear = (char) => char === "*" || char.isGear
const isNumber = (char) => !isNaN(parseInt(char))
