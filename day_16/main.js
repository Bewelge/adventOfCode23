let memo = {}
let cnv = document.createElement("canvas")
cnv.width = window.innerWidth
cnv.height = window.innerHeight
let ctx = cnv.getContext("2d")
let delay = 200
let cache = {}
let grid
let beams
window.onload = () => {
	document.body.appendChild(cnv)
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			let t2ext = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....
`
			const lines = parseInput(text)

			partOne(lines)
			partTwo(lines)
		})
}
function parseInput(text) {
	console.time("Parsing input time")

	let lines = text.split("\n")
	lines.splice(-1, 1)
	lines = lines.map(line => line.split(""))
	console.log(lines)

	console.timeEnd("Parsing input time")
	return lines
}

function partOne(lines) {
	console.time("Part one time")

	beams = [{ x: -1, y: 0, dir: "1,0" }]

	grid = lines.map((line, i) =>
		line.map((tile, j) => ({ char: tile, x: j, y: i, beams: [] })),
	)

	// tick()

	while (beams.length) {
		beams = beams.filter(beam => !beam.isDead)
		beamL: for (let j = 0; j < beams.length; j++) {
			let beam = beams[j]
			let spl = beam.dir.split(",")
			beam.x += parseInt(spl[0])
			beam.y += parseInt(spl[1])

			if (
				!(
					beam.x >= 0 &&
					beam.x < grid[0].length &&
					beam.y >= 0 &&
					beam.y < grid.length
				)
			) {
				beam.isDead = true
				continue beamL
			}
			let newTile = grid[beam.y][beam.x]
			if (newTile.beams.find(aBeam => aBeam == beam.dir)) {
				beam.isDead = true
				continue beamL
			}
			newTile.beams.push(beam.dir)
			changeDir(newTile, beam)
		}
	}

	let sum = 0
	grid.forEach(row =>
		row.forEach(tile => {
			if (tile.beams.length > 0) {
				sum++
			}
		}),
	)

	console.log("P1 sum", sum)
	console.timeEnd("Part one time")
	return
}
function tick() {
	draw(grid, beams)
	beams = beams.filter(beam => !beam.isDead)
	beamL: for (let j = 0; j < beams.length; j++) {
		let beam = beams[j]
		let spl = beam.dir.split(",")
		beam.x += parseInt(spl[0])
		beam.y += parseInt(spl[1])

		if (
			!(
				beam.x >= 0 &&
				beam.x < grid[0].length &&
				beam.y >= 0 &&
				beam.y < grid.length
			)
		) {
			beam.isDead = true
			continue beamL
		}
		let newTile = grid[beam.y][beam.x]
		if (newTile.beams.find(aBeam => aBeam == beam.dir)) {
			beam.isDead = true
			continue beamL
		}
		newTile.beams.push(beam.dir)
		changeDir(newTile, beam)
	}
	if (beams.length == 0) {
		let sum = 0
		grid.forEach(row =>
			row.forEach(tile => {
				if (tile.beams.length > 0) {
					sum++
				}
			}),
		)
		console.log(sum)
	}
	window.requestAnimationFrame(tick)
}
function changeDir(newTile, beam) {
	let isHorizont = beam.dir == "1,0" || beam.dir == "-1,0"
	if (newTile.char == ".") {
	} else if (newTile.char == "|" && isHorizont) {
		if (!newTile.beams.find(aBeam => aBeam == "0,1")) {
			let newBeam = { x: beam.x, y: beam.y, dir: "0,1" }
			beams.push(newBeam)
			newTile.beams.push(newBeam.dir)
		}
		beam.dir = "0,-1"
	} else if (newTile.char == "-" && !isHorizont) {
		if (!newTile.beams.find(aBeam => aBeam == "-1,0")) {
			let newBeam = { x: beam.x, y: beam.y, dir: "-1,0" }
			beams.push(newBeam)
			newTile.beams.push(newBeam.dir)
		}
		beam.dir = "1,0"
	} else if (newTile.char == "/") {
		if (beam.dir == "1,0") {
			beam.dir = "0,-1"
		} else if (beam.dir == "-1,0") {
			beam.dir = "0,1"
		} else if (beam.dir == "0,-1") {
			beam.dir = "1,0"
		} else if (beam.dir == "0,1") {
			beam.dir = "-1,0"
		}
	} else if (newTile.char == "\\") {
		if (beam.dir == "1,0") {
			beam.dir = "0,1"
		} else if (beam.dir == "-1,0") {
			beam.dir = "0,-1"
		} else if (beam.dir == "0,-1") {
			beam.dir = "-1,0"
		} else if (beam.dir == "0,1") {
			beam.dir = "1,0"
		}
	}
}

function partTwo(lines) {
	console.time("Part two time")

	grid = lines.map((line, i) =>
		line.map((tile, j) => ({ char: tile, x: j, y: i, beams: [] })),
	)
	let w = lines[0].length
	let h = lines.length

	let max = 0
	for (let i = 0; i < w; i++) {
		max = Math.max(max, doOneBeam({ x: i, y: -1 }, "0,1", lines))
		max = Math.max(max, doOneBeam({ x: i, y: h }, "0,-1", lines))
	}
	for (let i = 0; i < h; i++) {
		max = Math.max(max, doOneBeam({ x: -1, y: i }, "1,0", lines))
		max = Math.max(max, doOneBeam({ x: w, y: i }, "-1,0", lines))
	}

	console.log("P2 max", max)
	console.timeEnd("Part two time")
	return
}
function doOneBeam(p, dir, lines) {
	beams = [{ x: p.x, y: p.y, dir }]

	grid = lines.map((line, i) =>
		line.map((tile, j) => ({ char: tile, x: j, y: i, beams: [] })),
	)

	while (beams.length) {
		beams = beams.filter(beam => !beam.isDead)
		beamL: for (let j = 0; j < beams.length; j++) {
			let beam = beams[j]
			let spl = beam.dir.split(",")
			beam.x += parseInt(spl[0])
			beam.y += parseInt(spl[1])

			if (
				!(
					beam.x >= 0 &&
					beam.x < grid[0].length &&
					beam.y >= 0 &&
					beam.y < grid.length
				)
			) {
				beam.isDead = true
				continue beamL
			}
			let newTile = grid[beam.y][beam.x]
			if (newTile.beams.find(aBeam => aBeam == beam.dir)) {
				beam.isDead = true
				continue beamL
			}
			newTile.beams.push(beam.dir)
			changeDir(newTile, beam)
		}
	}

	let sum = 0
	grid.forEach(row =>
		row.forEach(tile => {
			if (tile.beams.length > 0) {
				sum++
			}
		}),
	)
	return sum
}
function draw(grid, beams) {
	let ts = 15
	ctx.font = "8px Arial black"
	grid.forEach((row, i) =>
		row.forEach((col, j) => {
			ctx.fillStyle = "black"
			ctx.strokeStyle = "black"
			ctx.strokeRect(ts * j, ts * i, ts, ts)
			ctx.fillText(col.char, j * ts + ts * 0.5, ts * i + ts * 0.75)
			if (col.beams.find(beam => beam == "1,0" || beam == "-1,0")) {
				ctx.fillStyle = "yellow"
				ctx.fillRect(ts * j, ts * i + ts / 2 - 2, ts, 4)
			} else if (col.beams.find(beam => beam == "0,1" || beam == "0,-1")) {
				ctx.fillStyle = "yellow"
				ctx.fillRect(ts * j + ts / 2 - 2, ts * i, 4, ts)
			}
		}),
	)
}
