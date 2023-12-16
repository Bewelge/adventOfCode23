let memo = {}
let cnv = document.createElement("canvas")
cnv.width = window.innerWidth
cnv.height = window.innerHeight
let ctx = cnv.getContext("2d")
let delay = 200

let blocksCols = {}
let blocksRows = {}
window.onload = () => {
	document.body.appendChild(cnv)
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			let te2xt = `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....
`
			const lines = parseInput(text)

			partOne(lines)
			partTwo(lines)
		})
}
function parseInput(text) {
	console.time("Parsing input time")

	let lines = text.split("\n").map(line => line.split(""))
	lines.splice(-1, 1)
	console.log(lines)
	// lines = lines.map(line => line.split(""))
	// lines.splice(-1, 1)

	console.timeEnd("Parsing input time")
	return lines
}

function partOne(lines) {
	console.time("Part one time")

	let grid = lines.slice().map(line => line.slice())

	tiltNorthP1(grid)

	let sum = getTotalLoad(grid)

	console.log(grid)

	console.log("P1 sum", sum)
	console.timeEnd("Part one time")
	return
}
function getTotalLoad(grid) {
	let sum = 0
	grid.forEach((row, i) =>
		row.forEach(tile => {
			if (tile == "O") {
				sum += grid.length - i
			}
		}),
	)
	return sum
}

function tiltNorthP1(grid) {
	let shifts = Array(grid[0].length).fill(0)

	for (let i = 0; i < grid.length; i++) {
		let row = grid[i]

		for (let j = 0; j < grid[0].length; j++) {
			let tile = row[j]
			if (tile == ".") {
				shifts[j]++
			} else if (tile == "#") {
				shifts[j] = 0
			} else if (tile == "O") {
				if (shifts[j] > 0) {
					grid[i - shifts[j]][j] = "O"
					grid[i][j] = "."
				}
			}
		}
	}
}
let cnt = 0
function tiltNorth(grid, stones) {
	let dir = [0, -1]
	moveStonesV(stones, grid, -1)
}
function tiltSouth(grid, stones) {
	moveStonesV(stones, grid, 1)
}
// function moveStones(stones, grid, dir) {

// 		// let nextP = { x: stone.x, y: stone.y }
// 		// while (
// 		// 	nextP.y + dir[1] >= 0 &&
// 		// 	nextP.x + dir[0] >= 0 &&
// 		// 	nextP.y + dir[1] <= grid.length - 1 &&
// 		// 	nextP.x + dir[0] <= grid[0].length - 1 &&
// 		// 	grid[nextP.y + dir[1]][nextP.x + dir[0]] == "."
// 		// ) {
// 		// 	nextP = { x: nextP.x + dir[0], y: nextP.y + dir[1] }
// 		// 	// cnt++
// 		// 	// let stoneC = { ...stone }
// 		// 	// let nextPC = { ...nextP }
// 		// 	// let gridC = grid.slice().map(row => row.slice())
// 		// 	// window.setTimeout(() => drawGrid(gridC, stoneC, nextPC), cnt * 4)
// 		// }
// 		// if (nextP.y != stone.y || stone.x != nextP.x) {
// 		// 	grid[stone.y][stone.x] = "."
// 		// 	stone.x = nextP.x
// 		// 	stone.y = nextP.y
// 		// 	grid[stone.y][stone.x] = "O"
// 		// }
// 		// cnt += 1
// 		// let stoneC = { ...stone }
// 		// let nextPC = { ...nextP }
// 		// let gridC = grid.slice().map(row => row.slice())
// 		// window.setTimeout(() => drawGrid(gridC, stoneC, nextPC), cnt * 4)
// 	})
// }
function moveStonesV(stones, grid, dir) {
	stones.forEach(stone => {
		let blockCol = blocksCols[stone.x]
		if (dir < 0) {
			for (let i = blockCol.length - 1; i >= 0; i--) {
				if (blockCol[i] < stone.y) {
					let nextP = { x: stone.x, y: blockCol[i] - dir }
					while (nextP.y < stone.y && grid[nextP.y][nextP.x] == "O") {
						nextP.y -= dir
					}
					if (nextP.y < stone.y && grid[nextP.y][nextP.x] == ".") {
						grid[stone.y][stone.x] = "."
						stone.y = nextP.y
						grid[stone.y][stone.x] = "O"
					}
					break
				}
			}
		} else {
			for (let i = 0; i < blockCol.length; i++) {
				if (blockCol[i] > stone.y) {
					let nextP = { x: stone.x, y: blockCol[i] - dir }
					while (nextP.y > stone.y && grid[nextP.y][nextP.x] == "O") {
						nextP.y -= dir
					}
					if (nextP.y > stone.y) {
						grid[stone.y][stone.x] = "."
						stone.y = nextP.y
						grid[stone.y][stone.x] = "O"
					}
					break
				}
			}
		}
	})
}
function moveStonesH(stones, grid, dir) {
	let rowsDone = {}
	stones.forEach(stone => {
		let blockRow = blocksRows[stone.y]

		if (dir < 0) {
			for (let i = blockRow.length - 1; i >= 0; i--) {
				if (blockRow[i] < stone.x) {
					let nextP = { x: blockRow[i] - dir, y: stone.y }
					while (nextP.x - dir < stone.x && grid[nextP.y][nextP.x] == "O") {
						nextP.x -= dir
					}

					if (nextP.x < stone.x && grid[nextP.y][nextP.x] != "O") {
						grid[stone.y][stone.x] = "."
						stone.x = nextP.x
						grid[stone.y][stone.x] = "O"
						if (!rowsDone.hasOwnProperty(stone.y)) {
							rowsDone[stone.y] = {}
						}
						if (!rowsDone[stone.y].hasOwnProperty(i)) {
							rowsDone[stone.y][i] = 0
						}
						rowsDone[stone.y][i]++
					}
					break
				}
			}
		} else {
			for (let i = 0; i < blockRow.length; i++) {
				if (blockRow[i] > stone.x) {
					let nextP = { x: blockRow[i] - dir, y: stone.y }

					while (nextP.x - dir > stone.x && grid[nextP.y][nextP.x] == "O") {
						nextP.x -= dir
					}
					if (nextP.x > stone.x && grid[nextP.y][nextP.x] != "O") {
						grid[stone.y][stone.x] = "."
						stone.x = nextP.x
						grid[stone.y][stone.x] = "O"
						if (!rowsDone.hasOwnProperty(stone.y)) {
							rowsDone[stone.y] = {}
						}
						if (!rowsDone[stone.y].hasOwnProperty(i)) {
							rowsDone[stone.y][i] = 0
						}
						rowsDone[stone.y][i]++
					}
					break
				}
			}
		}
	})
}

function tiltWest(grid, stones) {
	moveStonesH(stones, grid, -1)
}
function tiltEast(grid, stones) {
	moveStonesH(stones, grid, 1)
}

let cache = {}
function partTwo(lines) {
	console.time("Part two time")

	let grid = lines.slice().map(line => line.slice())
	let stones = []
	let stoneRows = {}
	let stoneCols = {}
	grid.forEach((row, i) => (blocksRows[i] = [-1, grid.length]))
	grid[0].forEach((col, j) => (blocksCols[j] = [-1, grid[0].length]))
	grid.forEach((row, i) =>
		row.forEach((tile, j) => {
			if (tile == "O") {
				let stone = { x: j, y: i }
				stones.push(stone)
				if (!stoneCols.hasOwnProperty(stone.x)) {
					stoneCols[stone.x] = []
				}
				if (!stoneRows.hasOwnProperty(stone.y)) {
					stoneRows[stone.y] = []
				}
				// setStone(stoneRows,stoneCol,stone)
			} else if (tile == "#") {
				blocksRows[i].push(j)

				blocksCols[j].push(i)
				console.log(123)
			}
		}),
	)
	Object.values(blocksCols).forEach(arr => arr.sort((a, b) => a - b))
	Object.values(blocksRows).forEach(arr => arr.sort((a, b) => a - b))

	// drawGrid(gridC, stones)
	// 1000000000
	for (let i = 0; i < 10000; i++) {
		cycle(grid, stones)
		let grdHash = stones
			.slice()
			.sort((a, b) => a.x - b.x)
			.sort((a, b) => a.y - b.y)
			.map(stone => stone.x + "," + stone.y)
			.join(";")

		// cnt++
		// let stoneC = { ...stone }
		// let nextPC = { ...nextP }
		// let gridC = grid.slice().map(row => row.slice())
		// console.log(cnt * delay)
		// window.setTimeout(() => drawGrid(gridC, stones), cnt * delay)
		if (!cache.hasOwnProperty(grdHash)) {
			cache[grdHash] = i
		} else {
			console.log("Cycle detected from " + cache[grdHash] + " to " + i)
			let amntOfCyclesLeft =
				(1000000000 - 1 - cache[grdHash]) % (i - cache[grdHash])
			console.log("cycles left", amntOfCyclesLeft)
			for (let j = 0; j < amntOfCyclesLeft; j++) {
				cycle(grid, stones)
			}
			break
		}
	}

	console.log("P2 sum", getTotalLoad(grid))
	console.timeEnd("Part two time")
	return
}

function cycle(grid, stones) {
	// console.time("north")
	tiltNorth(grid, stones)
	tiltWest(grid, stones)
	tiltSouth(grid, stones)
	tiltEast(grid, stones)
}

function drawGrid(grid, stones, markRed, markGreen) {
	let ts = 50
	ctx.clearRect(0, 0, 2000, 2000)
	stones.forEach(stone => {
		let j = stone.x
		let i = stone.y
		ctx.fillStyle = "blue"
		ctx.beginPath()
		ctx.arc(ts + ts * j + ts / 2, ts + ts * i + ts / 2, 5, Math.PI, Math.PI * 2)
		ctx.fill()
		ctx.closePath()
		ctx.fillStyle = "black"
	})
	grid.forEach((row, i) =>
		row.forEach((tile, j) => {
			ctx.strokeRect(ts + ts * j, ts + ts * i, ts, ts)
			ctx.fillText(tile, ts + ts * j, ts + ts * i)
			if (tile == "O") {
				ctx.fillStyle = "orange"
				ctx.beginPath()
				ctx.arc(ts + ts * j + ts / 2, ts + ts * i + ts / 2, 5, 0, Math.PI)
				ctx.fill()
				ctx.closePath()
				ctx.fillStyle = "black"
			}
			if (tile == "#") {
				ctx.fillRect(ts + ts * j, ts + ts * i, ts, ts)
			}
			if (markGreen && markGreen.x == j && markGreen.y == i) {
				ctx.fillStyle = "green"
				ctx.beginPath()
				ctx.arc(ts + ts * j + ts / 2, ts + ts * i + ts / 2, 5, 0, Math.PI * 2)
				ctx.fill()
				ctx.closePath()
				ctx.fillStyle = "black"
			}
			if (markRed && markRed.x == j && markRed.y == i) {
				ctx.fillStyle = "red"
				ctx.beginPath()
				ctx.arc(ts + ts * j + ts / 2, ts + ts * i + ts / 2, 5, 0, Math.PI * 2)
				ctx.fill()
				ctx.closePath()
				ctx.fillStyle = "black"
			}
		}),
	)
}

function moveStone(rows, cols, stone, move) {
	const { x, y } = stone
	stone.x += move[0]
	stone.y += move[1]
	if (move[0] != 0) {
		cols[x].splice(cols[x].indexOf(stone))
		if (cols[x].length == 0) {
			delete cols[x]
		}
		if (!cols.hasOwnProperty(stone.x)) {
			cols[stone.x] = []
		}
		cols[stone.x].push(stone)
	} else if (move[1] != 0) {
		rows[y].splice(rows[y].indexOf(stone))
		if (rows[x].length == 0) {
			delete rows[x]
		}
		if (!rows.hasOwnProperty(stone.y)) {
			rows[stone.y] = []
		}
		rows[stone.y].push(stone)
	}
}
