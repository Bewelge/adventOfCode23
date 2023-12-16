let cnv = document.createElement("canvas")
let ctx = cnv.getContext("2d")
const tileSize = 10
var grid
var gridp1
var gridp2
const rowsToAdd = []
const colsToAdd = []
window.onload = () => {
	document.body.appendChild(cnv)

	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			let te2xt = `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`
			const { lines } = parseInput(text)
			console.log(lines)
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

	gridp1 = grid.map(row => row.map(tile => ({ ...tile })))

	gridp1.forEach((row, i) => {
		if (isRowEmpty(i)) {
			rowsToAdd.push(i)
		}
	})
	gridp1[0].forEach((col, i) => {
		if (isColEmpty(i)) {
			colsToAdd.push(i)
		}
	})
	console.log("emptyrows", rowsToAdd)
	console.log("emptycols", colsToAdd)
	rowsToAdd.reverse().forEach(rowI => {
		gridp1.splice(
			rowI,
			0,
			gridp1[rowI].slice().map(tile => ({ ...tile })),
		)
	})
	colsToAdd.reverse().forEach(colI => {
		gridp1.forEach(row => {
			row.splice(colI, 0, { ...row[colI] })
		})
	})

	const galaxies = []
	gridp1.forEach((row, i) =>
		row.forEach((tile, j) => {
			tile.row = i
			tile.col = j
			if (tile.char == "#") {
				galaxies.push(tile)
			}
		}),
	)

	let distSums = 0
	galaxies.forEach(tileA => {
		tileA.distances = []
		tileA.checked = []
		galaxies.forEach(tileB => {
			if (tileA != tileB) {
				if (tileB.checked && !tileB.checked.includes(tileA)) {
					let dis =
						Math.abs(tileA.row - tileB.row) + Math.abs(tileA.col - tileB.col)
					tileA.distances.push(dis)
					tileA.checked.push(tileB)
					distSums += dis
				}
			}
		})
	})

	console.log("Part one distances: ", distSums)
	console.timeEnd("Part one time")
	return
}

function partTwo(loop) {
	console.time("Part two time - graphical")
	const galaxies = []
	grid.forEach((row, i) =>
		row.forEach((tile, j) => {
			tile.row = i
			tile.col = j
			if (tile.char == "#") {
				galaxies.push(tile)
			}
		}),
	)

	let distSums = 0
	galaxies.forEach(tileA => {
		tileA.distances = []
		tileA.checked = []
		galaxies.forEach(tileB => {
			if (tileA != tileB) {
				if (tileB.checked && !tileB.checked.includes(tileA)) {
					let dis =
						Math.abs(tileA.row - tileB.row) + Math.abs(tileA.col - tileB.col)
					let minR = Math.min(tileA.row, tileB.row)
					let maxR = Math.max(tileA.row, tileB.row)
					let minC = Math.min(tileA.col, tileB.col)
					let maxC = Math.max(tileA.col, tileB.col)
					rowsToAdd.forEach(index => {
						if (minR < index && maxR > index) {
							dis += 1000000 - 1
						}
					})
					colsToAdd.forEach(index => {
						if (minC < index && maxC > index) {
							dis += 1000000 - 1
						}
					})
					tileA.distances.push(dis)
					tileA.checked.push(tileB)
					distSums += dis
				}
			}
		})
	})
	console.log("P2 distances - ", distSums)
	console.timeEnd("Part two time - graphical")
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

function isRowEmpty(row) {
	console.log(grid[row])
	return grid[row].every(val => val.char == ".")
}
function isColEmpty(col) {
	let arr = grid.map(row => row[col])
	return arr.every(val => val.char == ".")
}
