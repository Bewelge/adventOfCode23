let memo = {}
window.onload = () => {
	fetch("input.txt")
		.then(result => result.text())
		.then(text => {
			let text2 = `????###??.?? 5,1
			`
			const lines = parseInput(text)
			console.log(lines)

			lines.forEach(line =>
				line.nums.filter(num => num == 0).forEach(num => console.log(1)),
			)
			computeLines(lines)
			computeLines(
				lines
					.map(line => ({ nums: line.nums.slice(), chars: line.chars.slice() }))
					.map((line, i) => {
						let bigLine = {
							nums: Array(5).fill(line.nums.slice()).flat(),
							chars: Array(5)
								.fill(line.chars.slice())
								.map(lineChars => lineChars.join(""))
								.join("?")
								.split(""),
						}
						return bigLine
					}),
			)
		})
}
function parseInput(text) {
	console.time("Parsing input time")
	let lines = text.split("\n")
	lines.splice(-1, 1)
	lines = lines.map(line => ({
		chars: line.split(" ")[0].trim().split(""),
		nums: line
			.split(" ")[1]
			.trim()
			.split(",")
			.map(str => parseInt(str)),
	}))
	console.timeEnd("Parsing input time")
	return lines
}

function computeLines(lines) {
	console.time("Part one time")
	let sum = lines.reduce((p, c) => p + calcLine(c), 0)

	console.log("P1 sum", sum)
	console.timeEnd("Part one time")
	return
}

function calcLine(line) {
	return getConstellations(line.chars.slice(), line.nums.slice(1), line.nums[0])
}

function getConstellations(chars, nums, num) {
	while (chars[0] == ".") chars.shift()
	while (chars[chars.length - 1] == ".") chars.pop()
	let theHash = hash(chars, num, nums)
	if (memo.hasOwnProperty(theHash)) {
		return memo[theHash]
	}

	let sum = 0
	for (
		let i = 0;
		i < chars.length - nums.reduce((p, c) => p + c + 1, num) + 1;
		i++
	) {
		if (chars[i] == ".") continue
		if (i > 0 && chars.slice(0, i - 1).includes("#")) break

		if (chars.slice(0, i).includes("#")) {
			break
		}
		if (i > 0 && chars[i - 1] == "#") {
			break
		}
		if (i + num < chars.length && chars[i + num] == "#") {
			continue
		}
		if (chars.slice(i, i + num).includes(".")) {
			continue
		}
		if (nums.length == 0 && chars.slice(i + num).includes("#")) {
			continue
		}
		if (nums.length == 0) {
			sum += 1
		} else {
			let cutChars = chars.slice(i + num)
			if (cutChars[0] == "#") {
				return 0
			} else {
				cutChars.shift()
			}
			let branchSum = getConstellations(cutChars, nums.slice(1), nums[0])
			sum += branchSum
		}
	}
	memo[theHash] = sum
	return sum
}
function hash(chars, num, nums) {
	return chars.join("") + "," + num + "," + nums.join("")
}
