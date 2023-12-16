let memo = {}
let cnv = document.createElement("canvas")
cnv.width = window.innerWidth
cnv.height = window.innerHeight
let ctx = cnv.getContext("2d")
let delay = 200
let cache = {}

window.onload = () => {
	document.body.appendChild(cnv)
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			let t2ext = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
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
	lines = lines[0].split(",")
	console.log(lines)

	console.timeEnd("Parsing input time")
	return lines
}

function partOne(lines) {
	console.time("Part one time")

	let sum = 0

	lines.forEach(line => {
		sum += hash(line)
	})
	console.log("P1 sum", sum)
	console.timeEnd("Part one time")
	return
}

function partTwo(lines) {
	console.time("Part two time")

	let sum = 0
	let boxes = {}

	lines.forEach(line => {
		if (line.indexOf("-") > -1) {
			let spl = line.split("-")
			let label = spl[0]
			let boxNo = hash(label)
			if (!boxes.hasOwnProperty(boxNo)) {
				boxes[boxNo] = {}
			}
			if (boxes[boxNo].hasOwnProperty(label)) {
				let pos = boxes[boxNo][label].index
				delete boxes[boxNo][label]

				for (let key in boxes[boxNo]) {
					if (boxes[boxNo][key].index > pos) {
						boxes[boxNo][key].index--
					}
				}
			}
		} else {
			let spl = line.split("=")
			let label = spl[0]
			let no = parseInt(spl[1])
			let boxNo = hash(label)
			if (!boxes.hasOwnProperty(boxNo)) {
				boxes[boxNo] = {}
			}

			if (!boxes[boxNo].hasOwnProperty(label)) {
				boxes[boxNo][label] = {
					index: Object.keys(boxes[boxNo]).length,
					num: no,
				}
			} else {
				boxes[boxNo][label].num = no
			}
		}
	})
	console.log(boxes)
	Object.keys(boxes).forEach(boxI => {
		boxI = parseInt(boxI)
		let box = boxes[boxI]
		let itemsI = Object.values(box).sort((a, b) => a.index - b.index)
		itemsI.forEach(item => {
			console.log(
				boxI + 1,
				item.index + 1,
				item.num,
				(boxI + 1) * (item.index + 1) * item.num,
			)
			sum += (boxI + 1) * (item.index + 1) * item.num
		})
	})

	console.log("P2 sum", sum)
	console.timeEnd("Part two time")
	return
}

function hash(str) {
	let val = 0
	for (let i = 0; i < str.length; i++) {
		val += getASCII(str[i])
		val *= 17
		val = val % 256
	}
	return val
}

function getASCII(char) {
	return char.charCodeAt(0)
}
