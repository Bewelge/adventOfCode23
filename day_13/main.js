let memo = {}
window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			let te2xt = `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#
`
			const lines = parseInput(text)

			partOne(lines)
			partTwo(lines)
		})
}
function parseInput(text) {
	console.time("Parsing input time")

	let lines = text.split("\n\n").map(line => line.split("\n"))
	lines[lines.length - 1].splice(-1, 1)
	// lines.splice(-1, 1)
	console.log(lines)

	console.timeEnd("Parsing input time")
	return lines
}

function partOne(lines) {
	console.time("Part one time")
	let sum = 0
	lines.forEach(grid => {
		let w = grid[0].length
		let h = grid.length
		for (let i = 0; i < w - 1; i++) {
			if (checkReflectionV(grid, i)) {
				sum += i + 1
			}
		}
		for (let i = 0; i < h - 1; i++) {
			if (checkReflectionH(grid, i)) {
				sum += (i + 1) * 100
			}
		}
	})
	console.log("P1 sum", sum)
	console.timeEnd("Part one time")
	return
}
function partTwo(lines) {
	console.time("Part one time")
	let sum = 0
	lines.forEach(grid => {
		let w = grid[0].length
		let h = grid.length
		for (let i = 0; i < w - 1; i++) {
			if (checkReflectionV(grid, i, 1)) {
				sum += i + 1
			}
		}
		for (let i = 0; i < h - 1; i++) {
			if (checkReflectionH(grid, i, 1)) {
				sum += (i + 1) * 100
			}
		}
	})
	console.log("P2 sum", sum)
	console.timeEnd("Part one time")
	return
}

function checkReflectionV(grid, col, tolerance = 0) {
	let mistakes = 0
	for (let i = col; i >= 0; i--) {
		let otherInd = col + (col - i) + 1
		if (otherInd > grid[0].length - 1) break
		let str0 = grid.map(row => row[i])
		let str1 = grid.map(row => row[otherInd])
		for (let j = 0; j < str0.length; j++) {
			if (str0[j] != str1[j]) {
				mistakes++
				if (mistakes > tolerance) {
					return false
				}
			}
		}
	}
	return mistakes == tolerance
}
function checkReflectionH(grid, row, tolerance = 0) {
	mistakes = 0
	for (let i = row; i >= 0; i--) {
		let otherInd = row + (row - i) + 1
		if (otherInd > grid.length - 1) break
		let rowArr0 = grid[i].split("")
		let rowArr1 = grid[otherInd].split("")
		for (let j = 0; j < rowArr0.length; j++) {
			if (rowArr0[j] != rowArr1[j]) {
				mistakes++
				if (mistakes > tolerance) {
					return false
				}
			}
		}
	}
	return mistakes == tolerance
}
