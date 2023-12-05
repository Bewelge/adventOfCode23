window.onload = () => {
  fetch("input.txt")
    .then((result) => result.text())
    .then((text) => {
      const lines = text.split("\n").filter((line) => line != "")
      const games = lines.map((line) => parseLine(line))
      const possibleGames = games.filter((game) => checkGame(game))
      const sumOfIdsOfPossibleGames = possibleGames.reduce(
        (prev, curr) => prev + parseInt(curr.id),
        0
      )
      console.log(sumOfIdsOfPossibleGames)
      const minSetPowers = games
        .map((game) => calcMinPowerOfGame(game))
        .reduce((prev, curr) => prev + curr, 0)
      console.log(minSetPowers)
    })
}
const maxAmounts = {
  red: 12,
  green: 13,
  blue: 14,
}
const parseLine = (line) => {
  const colonSplit = line.split(":")
  const id = colonSplit[0].replace("Game", "").trim()
  const sets = colonSplit[1]
    .split(";")
    .map((string) => string.trim())
    .map((set) => {
      const setArray = set.split(",").map((string) => string.trim())
      const obj = {}
      setArray.forEach((colorSet) => {
        const strSplit = colorSet.split(" ")
        obj[strSplit[1]] = parseInt(strSplit[0])
      })
      return obj
    })
  console.log(id, sets)
  return { id, sets }
}

const checkGame = (game) => {
  return !game.sets.find((draw) =>
    Object.keys(draw).find((key) => draw[key] > maxAmounts[key])
  )
}

const calcMinPowerOfGame = (game) => {
  const minSet = { red: 0, green: 0, blue: 0 }
  game.sets.forEach((set) => {
    for (let key in set) {
      if (set[key] > minSet[key]) {
        minSet[key] = set[key]
      }
    }
  })
  return Object.values(minSet).reduce((prev, curr) => prev * curr, 1)
}
