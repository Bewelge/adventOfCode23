const CARD_STRENGTH = "AKQJT98765432"
const CARD_STRENGTH_PART_TWO = "AKQT98765432J"
const TRANSFORMED_CARD_STR = "ABCDEFGHIJKLM"
const CARD_TYPES = {
	FIVE_OAK: 0,
	FOUR_OAK: 1,
	FULL_HOUSE: 2,
	THREE_OAK: 3,
	TWO_PAIR: 4,
	TWO_OAK: 5,
	HIGH_CARD: 6,
}

window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			const { games } = parseInput(text)

			partOne(games)
			partTwo(games)
		})
}

function partOne(games) {
	console.time("Part one time")
	games.sort(gameComparator)
	const totalScorePartOne = games.reduce(
		(prev, game, i) => prev + (i + 1) * game.bid,
		0,
	)
	console.log(`Part one total score: ${totalScorePartOne}`)

	console.timeEnd("Part one time")
}

function parseInput(text) {
	console.time("Parsing input time")
	const lines = text.split("\n")
	lines.splice(-1, 1)

	const games = lines.map(line => {
		const splitLine = line.split(" ")
		let cardsUntransformed = splitLine[0]
		const bid = splitLine[1]
		const cards = cardsUntransformed
			.split("")
			.map(char => TRANSFORMED_CARD_STR[CARD_STRENGTH.indexOf(char)])
			.join("")
		const cardsPartTwo = cardsUntransformed
			.split("")
			.map(char => TRANSFORMED_CARD_STR[CARD_STRENGTH_PART_TWO.indexOf(char)])
			.join("")
		return { cards, bid, cardsPartTwo, cardsUntransformed }
	})

	console.timeEnd("Parsing input time")
	return { games }
}

function setType(game) {
	const checkedLetters = []
	const pairs = []
	const { cards } = game
	const cardChars = cards.split("")
	for (let i = 0; i < cardChars.length; i++) {
		const cardChar = cardChars[i]
		if (checkedLetters.indexOf(cardChar) === -1) {
			let matchCounter = 1
			//We only need to check the remaining letters in the hand
			for (let j = i + 1; j < cardChars.length; j++) {
				let otherChar = cardChars[j]
				if (cardChar === otherChar) {
					matchCounter++
				}
			}
			checkedLetters.push(cardChar)
			pairs.push({ card: cardChar, matches: matchCounter })
		}
	}
	pairs.sort((a, b) => b.matches - a.matches)

	if (pairs[0].matches == 5) {
		game.type = CARD_TYPES.FIVE_OAK
	} else if (pairs[0].matches == 4) {
		game.type = CARD_TYPES.FOUR_OAK
	} else if (pairs[0].matches == 3 && pairs[1].matches == 2) {
		game.type = CARD_TYPES.FULL_HOUSE
	} else if (pairs[0].matches == 3) {
		game.type = CARD_TYPES.THREE_OAK
	} else if (pairs[0].matches == 2 && pairs[1].matches == 2) {
		game.type = CARD_TYPES.TWO_PAIR
	} else if (pairs[0].matches == 2) {
		game.type = CARD_TYPES.TWO_OAK
	} else {
		//The actual high card doesn't matter according to the description
		game.type = CARD_TYPES.HIGH_CARD
	}

	game.matches = pairs
	return game.type
}

//Lazily generate the type so we can do it on the fly while sorting instead of iterating the entire array an extra time.
function getType(game) {
	return game.hasOwnProperty("type") ? game.type : setType(game)
}

function gameComparator(gameA, gameB) {
	const typeA = getType(gameA)
	const typeB = getType(gameB)
	if (typeA != typeB) return typeB - typeA

	let counter = 0
	while (counter < 5 && gameA.cards[counter] == gameB.cards[counter]) {
		counter++
	}
	if (counter < 5)
		return gameB.cards[counter].localeCompare(gameA.cards[counter])

	return 0
}
function partTwo(games) {
	console.time("Part two time")
	games.sort(gameComparatorPartTwo)
	const totalScorePartTwo = games.reduce(
		(prev, game, i) => prev + (i + 1) * game.bid,
		0,
	)
	console.log(`Part two total score: ${totalScorePartTwo}`)
	console.timeEnd("Part two time")
}
function setTypePartTwo(game) {
	const checkedLetters = []
	const pairs = []
	const { cardsPartTwo } = game
	if (cardsPartTwo == "MMMMM") {
		//Special condition if we have five jokers. Necessary because we're not counting matches of Jokers but simply adding the amount of jokers to the highest other matching card.
		//But with 5 Jokers there won't be any matches to add anything to.
		game.typePartTwo = CARD_TYPES.FIVE_OAK
		return game.typePartTwo
	}
	const cardChars = cardsPartTwo.split("")
	const amountOfJokers = cardsPartTwo.split("M").length - 1
	for (let i = 0; i < cardChars.length; i++) {
		const cardChar = cardChars[i]
		//dont count Jokers. We'll just add the amount of Jokers to the highest match later
		if (cardChar != "M" && checkedLetters.indexOf(cardChar) === -1) {
			let matchCounter = 1
			//We only need to check the remaining letters in the hand
			for (let j = i + 1; j < cardChars.length; j++) {
				let otherChar = cardChars[j]
				if (cardChar === otherChar) {
					matchCounter++
				}
			}
			checkedLetters.push(cardChar)
			pairs.push({ card: cardChar, matches: matchCounter })
		}
	}
	pairs.sort((a, b) => b.matches - a.matches)
	pairs[0].matches += amountOfJokers

	if (pairs[0].matches == 5) {
		game.typePartTwo = CARD_TYPES.FIVE_OAK
	} else if (pairs[0].matches == 4) {
		game.typePartTwo = CARD_TYPES.FOUR_OAK
	} else if (pairs[0].matches == 3 && pairs[1].matches == 2) {
		game.typePartTwo = CARD_TYPES.FULL_HOUSE
	} else if (pairs[0].matches == 3) {
		game.typePartTwo = CARD_TYPES.THREE_OAK
	} else if (pairs[0].matches == 2 && pairs[1].matches == 2) {
		game.typePartTwo = CARD_TYPES.TWO_PAIR
	} else if (pairs[0].matches == 2) {
		game.typePartTwo = CARD_TYPES.TWO_OAK
	} else {
		//The actual high card doesn't matter according to the description
		game.typePartTwo = CARD_TYPES.HIGH_CARD
	}

	game.matchesPartTwo = pairs
	return game.typePartTwo
}
function getTypePartTwo(game) {
	return game.hasOwnProperty("typePartTwo")
		? game.typePartTwo
		: setTypePartTwo(game)
}
function gameComparatorPartTwo(gameA, gameB) {
	const typeA = getTypePartTwo(gameA)
	const typeB = getTypePartTwo(gameB)
	if (typeA != typeB) return typeB - typeA

	let counter = 0
	while (
		counter < 5 &&
		gameA.cardsPartTwo[counter] == gameB.cardsPartTwo[counter]
	) {
		counter++
	}
	if (counter < 5) {
		return gameB.cardsPartTwo[counter].localeCompare(
			gameA.cardsPartTwo[counter],
		)
	}

	return 0
}
