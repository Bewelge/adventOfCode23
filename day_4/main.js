window.onload = () => {
  fetch("input.txt")
    .then((result) => result.text())
    .then((text) => {
      let lines = text.split("\n").filter((line) => line != "")
      console.log(lines)
      lines = lines
        .map((line) => line.split(":")[1].trim())
        .map((line) => {
          let splitLine = line.split("|")
          let winningNumbers = splitLine[0]
            .trim()
            .split(" ")
            .map((num) => num.trim())
            .filter((num) => num != "")
          let chosenNumbers = splitLine[1]
            .trim()
            .split(" ")
            .map((num) => num.trim())
            .filter((num) => num != "")
          return { winningNumbers, chosenNumbers }
        })
      console.log(lines)
      console.log(
        "Part one - Total points:" +
          lines.reduce((prev, curr) => prev + getCardPoints(curr), 0)
      )

      let copies = {}
      lines.forEach((line, i) => (copies[i] = 1))
      lines.forEach((line, i) => {
        let matches = getCardMatches(line)
        let copiesOfLine = copies[i]
        for (let j = i + 1; j < i + 1 + matches; j++) {
          copies.hasOwnProperty(j)
            ? (copies[j] += copiesOfLine)
            : (copies[j] = copiesOfLine)
        }
      })

      const cardAmount = Object.values(copies).reduce(
        (prev, curr) => prev + parseInt(curr),
        0
      )

      console.log("Part two - Total cards:" + cardAmount)
    })
}

const getCardMatches = (card) => {
  let points = 0
  card.winningNumbers
  card.chosenNumbers.forEach(
    (num) => (points += card.winningNumbers.includes(num) ? 1 : 0)
  )
  return points
}
const getCardPoints = (card) => {
  let matches = getCardMatches(card)
  let points = matches > 0 ? Math.pow(2, matches - 1) : 0

  return points
}
