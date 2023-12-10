const TOP = "top"
const LEFT = "left"
const RIGHT = "right"
const BOTTOM = "bottom"

const charMap = {
	"|": [TOP, BOTTOM], // is a vertical pipe connecting north and south.
	"-": [LEFT, RIGHT], // is a horizontal pipe connecting east and west.
	L: [RIGHT, TOP], // is a 90-degree bend connecting north and east.
	J: [LEFT, TOP], // is a 90-degree bend connecting north and west.
	7: [LEFT, BOTTOM], // is a 90-degree bend connecting south and west.
	F: [RIGHT, BOTTOM], // is a 90-degree bend connecting south and east.
	".": [], // is ground; there is no pipe in this tile.
	S: [TOP, LEFT, BOTTOM, RIGHT], // is the starting position of the animal; there is a pipe on this
}

var grid

//Part two requires and even tileSize
const tileSize = 2
const shifts = {
	[TOP]: { row: -1, col: 0 },
	[BOTTOM]: { row: 1, col: 0 },
	[LEFT]: { row: 0, col: -1 },
	[RIGHT]: { row: 0, col: 1 },
}

const opposites = {
	[TOP]: BOTTOM,
	[BOTTOM]: TOP,
	[LEFT]: RIGHT,
	[RIGHT]: LEFT,
}

let cnv = document.createElement("canvas")

let ctx = cnv.getContext("2d")

const possibleConnections = {
	bottom: ["F", "7", "|"],
	top: ["L", "J", "|"],
	right: ["L", "F", "-"],
	left: ["J", "7", "-"],
}
window.onload = () => {
	document.body.appendChild(cnv)

	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			const { lines } = parseInput(text)

			grid = lines.map((row, i) =>
				row.map((char, j) => ({ char, row: i, col: j })),
			)
			cnv.width = grid[0].length * tileSize
			cnv.height = grid.length * tileSize

			const loop = partOne(lines)
			partTwo(loop)
		})
}
function parseInput(text) {
	console.time("Parsing input time")
	const lines = text.split("\n").map(line => line.split(""))
	lines.splice(-1, 1)
	console.timeEnd("Parsing input time")
	return { lines }
}

function partOne(lines) {
	console.time("Part one time")
	const startPos = findS(lines)
	const startingTile = getTile(startPos)
	let startingDirections = charMap.S
	console.log("Starting at -", startPos)

	ctx.fillStyle = "black"
	ctx.fillRect(0, 0, 5000, 5000)

	let curLoop
	mainLoop: for (let i = 0; i < startingDirections.length; i++) {
		const dir = startingDirections[i]

		ctx.beginPath()
		moveTo(startingTile)

		curLoop = [grid[startPos.row][startPos.col]]
		let nextPos = sumCoords(startPos, shifts[dir])
		let nextDir = dir
		ctx.fillStyle = "red"
		while (nextPos && isWithinGrid(nextPos)) {
			let result = traverseNext(nextPos, curLoop, opposites[nextDir]) || {}
			if (result.pos) {
				const nextTile = getTile(nextPos)
				lineTo(nextTile)
				fill(nextTile)
			} else if (result.isLoop) {
				console.log("Furthest path in loop", curLoop.length / 2)

				ctx.fillStyle = "rgba(255,0,0,1)"
				ctx.fill()
				// ctx.stroke()

				ctx.closePath()
				break mainLoop
			}

			nextPos = result.pos
			nextDir = result.dir
		}
	}
	curLoop.forEach(tile => (tile.isLoop = true))

	ctx.strokeStyle = "white"
	// grid.forEach(row =>
	// 	row.forEach(tile => {
	// 		stroke(tile)
	// 	}),
	// )

	console.timeEnd("Part one time")
	return curLoop
}

function partTwo(loop) {
	console.time("Part two time - graphical")
	let wd = cnv.width
	let ht = cnv.height
	let dt = ctx.getImageData(0, 0, wd, ht).data
	let counter = 0

	//sample pixels of canvas. In part one we colored all loop tiles and those within in red
	grid.forEach((row, i) =>
		row.forEach((tile, j) => {
			if (!tile.isLoop) {
				if (dt[wd * (i + 0.5) * tileSize * 4 + (j + 0.5) * tileSize * 4] > 0) {
					counter++
				}
			}
		}),
	)
	console.log("Tiles inside loop:", counter)
	console.timeEnd("Part two time - graphical")

	console.time("Part two time - compute")
	let counter2 = 0
	// ctx.fillStyle = "green"
	grid.forEach((row, i) => {
		// ctx.strokeStyle = "white"
		let isInside = false
		// ctx.beginPath()
		// ctx.moveTo(0, tileSize * (i + 0.5))
		row.forEach((tile, col) => {
			lineTo(tile)

			if (tile.isLoop) {
				if (["|"].includes(tile.char) || ["|", "F", "7"].includes(tile.char)) {
					// ctx.stroke()
					// ctx.closePath()
					// ctx.beginPath()
					// moveTo(tile)

					isInside = !isInside
					ctx.strokeStyle = isInside ? "blue" : "white"
				}
			} else if (isInside) {
				counter2++
				// fill(tile)
			}
		})
		// ctx.stroke()
		// ctx.closePath()
		// ctx.beginPath()
	})
	console.log("Tiles inside loop:", counter2)
	console.timeEnd("Part two time - compute")
}

function findS(lines) {
	for (let i = 0; i < lines.length; i++) {
		let ind = lines[i].indexOf("S")
		if (ind > -1) {
			return { row: i, col: ind }
		}
	}
}

function traverseNext(pos, curLoop, comingFrom) {
	const tile = grid[pos.row][pos.col]
	let char = tile.char
	if (curLoop.includes(tile)) {
		return { isLoop: true }
	}
	curLoop.push(tile)
	if (possibleConnections[comingFrom].indexOf(char) == -1) {
		return
	}

	let nextFields = charMap[char].filter(dir => comingFrom != dir)
	if (nextFields.length) {
		let nextDir = nextFields[0]
		const shift = shifts[nextDir]
		const nextPos = sumCoords(pos, shift)
		if (isWithinGrid(nextPos)) {
			return { pos: nextPos, dir: nextDir }
		}
	}
}
function isWithinGrid(pos) {
	return (
		pos.row >= 0 &&
		pos.row < grid.length &&
		pos.col >= 0 &&
		pos.row < grid[0].length
	)
}

function sumCoords(c1, c2) {
	return { row: c1.row + c2.row, col: c1.col + c2.col }
}

function moveTo(tile) {
	ctx.moveTo((tile.col + 0.5) * tileSize, (tile.row + 0.5) * tileSize)
}
function lineTo(tile) {
	ctx.lineTo((tile.col + 0.5) * tileSize, (tile.row + 0.5) * tileSize)
}
function fill(tile) {
	ctx.fillRect(tile.col * tileSize, tile.row * tileSize, tileSize, tileSize)
}
function stroke(tile) {
	ctx.strokeRect(tile.col * tileSize, tile.row * tileSize, tileSize, tileSize)
}
function getTile(pos) {
	return grid[pos.row][pos.col]
}
