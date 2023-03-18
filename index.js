// TODO: linear / even perspective
// TODO: hide non visible edges based on face visibility detection, not like this how it works now

// --  globals  --------------------------------------------------------------

let horizontalLine;
let verticalLine;
let leftViewpoint;
let rightViewpoint;
let topViewpoint;
let bottomViewpoint;
let gridSize;
let grid;
let objectsSeed;
let objectsCount;
let objects;

let pX;
let pY;
let pZ;

let horizontalY;
let verticalX;
let leftX;
let rightX;
let topY;
let bottomY;

// ---------------------------------------------------------------------------

function updateGridSize() {
	grid = new Array(gridSize);
	for (let x = 0; x < gridSize; x++) {
		grid[x] = new Array(gridSize);
		for (let y = 0; y < gridSize; y++) {
			grid[x][y] = new Array(gridSize);
			for (let z = 0; z < gridSize; z++) {
				grid[x][y][z] = {
					x: 0,
					y: 0
				};
			}
		}
	}

	pX = new Array(gridSize);
	pY = new Array(gridSize);
	pZ = new Array(gridSize);
}

function updateGrid() {
	horizontalY = height * horizontalLine / 100;
	verticalX = width * verticalLine / 100;
	leftX = width * leftViewpoint / 100;
	rightX = width * (100 + rightViewpoint) / 100;
	topY = height * topViewpoint / 100;
	bottomY = height * (100 + bottomViewpoint) / 100;
	
	for (let i = 0; i < gridSize; i++) {
		pZ[i] = {
			x : verticalX,
			y : topY + (bottomY - topY) / (gridSize - 1) * i
		};
	}

	for (let z = 0; z < gridSize; z++) {
		
// TODO: name this to even

		const leftXDelta = (leftX - pZ[z].x) / (gridSize - 1);
		const rightXDelta = (rightX - pZ[z].x) / (gridSize - 1);
		const yDelta = (horizontalY - pZ[z].y) / (gridSize - 1);

		for (let i = 0; i < gridSize; i++) {
			pX[i] = {
				x : pZ[z].x + leftXDelta * i,
				y : pZ[z].y + yDelta * i
			};
			pY[i] = {
				x : pZ[z].x + rightXDelta * i,
				y : pZ[z].y + yDelta * i
			};
		}

/*
		const leftMuler = (bottomY - topY) / (verticalX - leftX);
		const leftXDelta = (leftX - pZ[z].x) / (gridSize - 1);
		const leftYDelta = (horizontalY - pZ[z].y) / (gridSize - 1);
		const rightMuler = (bottomY - topY) / (rightX - verticalX);
		const rightXDelta = (rightX - pZ[z].x) * rightMuler / (gridSize - 1);
		const rightYDelta = (horizontalY - pZ[z].y) * rightMuler / (gridSize - 1);

		for (let i = 0; i < gridSize; i++) {
			pX[i] = {
				x : pZ[z].x + leftXDelta * i,
				y : pZ[z].y + leftYDelta * i
			};
			pY[i] = {
				x : pZ[z].x + rightXDelta * i,
				y : pZ[z].y + rightYDelta * i
			};
		}
*/
		let g = grid[0][0][z];
		g.x = pZ[z].x;
		g.y = pZ[z].y;
		for (let x = 1; x < gridSize; x++) {
			g = grid[x][0][z];
			g.x = pX[x].x;
			g.y = pX[x].y;
			for (let y = 1; y < gridSize; y++) {
				g = grid[0][y][z];
				g.x = pY[y].x;
				g.y = pY[y].y;

				let p = intersectLines(pX[x].x, pX[x].y, 
					rightX, horizontalY, 
					pY[y].x, pY[y].y,
					leftX, horizontalY);

				g = grid[x][y][z];
				g.x = p.x;
				g.y = p.y;
			}
		}
	}
}

function updateObjects() {
	randomSeed(objectsSeed);

	objects = new Array();

	while (objects.length < objectsCount) {
		let sx = 1 + Math.floor(random(gridSize / 4));
		let sy = 1 + Math.floor(random(gridSize / 4));
		let sz = 1 + Math.floor(random(gridSize / 4));
		// let sx = 1 + objects.length;
		// let sy = 1 + objects.length;
		// let sz = 1 + objects.length;
		// let sx = 1;
		// let sy = 1;
		// let sz = 1;

		let px = Math.floor(random(gridSize - sx));
		let py = Math.floor(random(gridSize - sy));
		let pz = Math.floor(random(gridSize - sz));

		objects.push({
			vertices: [
				{ x: px,      y: py,      z: pz },
				{ x: px + sx, y: py,      z: pz },
				{ x: px + sx, y: py,      z: pz + sz },
				{ x: px,      y: py,      z: pz + sz },
				{ x: px,      y: py + sy, z: pz },
				{ x: px + sx, y: py + sy, z: pz },
				{ x: px + sx, y: py + sy, z: pz + sz },
				{ x: px,      y: py + sy, z: pz + sz }
			],

			edges: [
				{ s: 0, e: 1, d: 'f' },
				{ s: 1, e: 2, d: 'f' },
				{ s: 2, e: 3, d: 'f' },
				{ s: 3, e: 0, d: 'f' },

				{ s: 4, e: 5, d: 't' },
				{ s: 5, e: 6, d: 'n' },
				{ s: 6, e: 7, d: 'b' },
				{ s: 7, e: 4, d: 'f' },

				{ s: 0, e: 4, d: 'f' },
				{ s: 1, e: 5, d: 't' },
				{ s: 2, e: 6, d: 'b' },
				{ s: 3, e: 7, d: 'f' },
			],

			faces: [

			]
		});
	}
}

// -- event handlers  --------------------------------------------------------

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('workspace');

	smooth();

	updateObjects();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
 
function mouseMoved() {
}

function mousePressed() {
}
  
function keyPressed() {
}

function draw() {
	updateGlobals();

	clear();

	if (showGridLines.checked) {
		stroke(0, 0, 0, 64);
		strokeWeight(1);

		for (let z = 0; z < gridSize; z++) {
			for (let x = 0; x < gridSize; x++) {
				const g = grid[x][0][z];
				line(rightX, horizontalY, g.x, g.y);
			}
			for (let y = 0; y < gridSize; y++) {
				const g = grid[0][y][z];
				line(leftX, horizontalY, g.x, g.y);
			}
		}
	}

	if (showGridPoints.checked) {
		stroke(0, 0, 0, 64);
		strokeWeight(1);
		noFill();
		for (let x = 0; x < gridSize; x++) {
			for (let y = 0; y < gridSize; y++) {
				for (let z = 0; z < gridSize; z++) {
					const g = grid[x][y][z];
					ellipse(g.x, g.y, 2, 2);
				}
			}
		}
	}

	if (showObjectLines.checked) {
		stroke(0, 0, 0, 64);
		strokeWeight(1);
		for (let object of objects) {
			for (let vertex of object.vertices) {
				let g = grid[vertex.x][vertex.y][vertex.z];
				line(rightX, horizontalY, g.x, g.y);
				line(leftX, horizontalY, g.x, g.y);
			}
		}
	}

	stroke(0, 0, 0);
	strokeWeight(2);
	for (let object of objects) {
		if (showObjectPoints.checked) {
			for (let vertex of object.vertices) {
				let g = grid[vertex.x][vertex.y][vertex.z];
				ellipse(g.x, g.y, 5, 5)
			}
		}
		for (let edge of object.edges) {
			let display = false;

			const vs = object.vertices[edge.s];
			const gs = grid[vs.x][vs.y][vs.z];
			const ve = object.vertices[edge.e];
			const ge = grid[ve.x][ve.y][ve.z];

			switch (edge.d) {
				case 'n':
					break;
				case 'f':
					display = true; 
					break;
				case 't':
					display = gs.y > horizontalY && ge.y > horizontalY;
					break;
				case 'b':
					display = gs.y < horizontalY && ge.y < horizontalY;
					break;
			}

			if (display)
				line(gs.x, gs.y, ge.x, ge.y);
		}
	}

	if (showControlLines.checked) {
		stroke(120);
		strokeWeight(1);

		line(0, horizontalY, width, horizontalY);
		line(verticalX, 0, verticalX, height);
		line(leftX, horizontalY, verticalX, topY);
		line(rightX, horizontalY, verticalX, topY);
		line(leftX, horizontalY, verticalX, bottomY);
		line(rightX, horizontalY, verticalX, bottomY);
	}

	if (showControlPoints.checked) {
		stroke(120);
		strokeWeight(1);
		fill(255);
		ellipse(leftX, horizontalY, 20, 20);
		ellipse(rightX, horizontalY, 20, 20);
		ellipse(verticalX, topY, 20, 20);
		ellipse(verticalX, bottomY, 20, 20);

		fill(0);
		rectMode(CENTER);
		textAlign(CENTER, CENTER);
		text('1', leftX, horizontalY);
		text('2', rightX, horizontalY);
		text('3', verticalX, topY);
		text('4', verticalX, bottomY);
	}
	
	updateDisplays();
}

// --  gui sync  -------------------------------------------------------------

function updateGlobals() {
	let updateGS = false;
	let updateG = false;
	let updateO = false;

	let t = gridSizeInput.value * 1.0;
	if (t != gridSize) {
		gridSize = t;
		updateGS = true;;
		updateG = true;
		updateO = true;
	}

	t = horizontalLineInput.value * 1.0
	if (t != horizontalLine) {
		horizontalLine = t;
		updateG = true;
	}
	t = verticalLineInput.value * 1.0;
	if (t != verticalLine) {
		verticalLine = t;
		updateG = true;		
	}
	t = leftViewPointInput.value * 1.0;
	if (t != leftViewpoint) {
		leftViewpoint = t;
		updateG = true;		
	}
	t = rightViewPointInput.value * 1.0;
	if (t != rightViewpoint) {
		rightViewpoint = t;
		updateG = true;		
	}
	t = topViewPointInput.value * 1.0;
	if (t != topViewpoint) {
		topViewpoint = t;
		updateG = true;		
	}
	t = bottomViewPointInput.value * 1.0;
	if (t != bottomViewpoint) {
		bottomViewpoint = t;
		updateG = true;		
	}

	t = objectsSeedInput.value * 1.0;
	if (t != objectsSeed) {
		objectsSeed = t;
		updateO = true;
	}

	t = objectsCountInput.value * 1.0;
	if (t != objectsCount) {
		objectsCount = t;
		updateO = true;
	}

	if (updateGS)
		updateGridSize();
	if (updateG)
		updateGrid();
	if (updateO)
		updateObjects();
}

function updateDisplays() {
	simulationFPSDisplay.innerHTML = frameRate().toFixed(2);
	horizontalLineOutput.innerHTML = horizontalLine.toFixed(2);
	verticalLineOutput.innerHTML = verticalLine.toFixed(2);
	leftViewPointOutput.innerHTML = leftViewpoint.toFixed(2);
	rightViewPointOutput.innerHTML = rightViewpoint.toFixed(2);
	topViewPointOutput.innerHTML = topViewpoint.toFixed(2);
	bottomViewPointOutput.innerHTML = bottomViewpoint.toFixed(2);
	gridSizeOutput.innerHTML = gridSize.toFixed(0);
	objectsSeedOutput.innerHTML = objectsSeed.toFixed(0);
	objectsCountOutput.innerHTML = objectsCount.toFixed(0);
}

// ---------------------------------------------------------------------------

function intersectLines(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
	const d = 
		((p4x - p3x) * (p1y - p3y) - 
		(p4y - p3y) * (p1x - p3x)) /
		((p4y - p3y) * (p2x - p1x) - 
		(p4x - p3x) * (p2y - p1y));
   
	return {
   		x : p1x + d * (p2x - p1x),
		y : p1y + d * (p2y - p1y)
	};
}
