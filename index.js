// TODO: object seed
// TODO: move objects (bounce)
// TODO: objects count

// --  globals  --------------------------------------------------------------

let horizontalLine;
let verticalLine;
let leftViewpoint;
let rightViewpoint;
let topViewpoint;
let bottomViewpoint;
let gridSize;
let grid;
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
		for (let i = 0; i < gridSize; i++) {
			pX[i] = {
				x : pZ[z].x + (leftX - pZ[z].x) / (gridSize - 1) * i,
				y : pZ[z].y + (horizontalY - pZ[z].y) / (gridSize - 1) * i
			};
			pY[i] = {
				x : pZ[z].x + (rightX - pZ[z].x) / (gridSize - 1) * i,
				y : pZ[z].y + (horizontalY - pZ[z].y) / (gridSize - 1) * i
			};
		}

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

// -- event handlers  --------------------------------------------------------

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('workspace');

	objects = new Array();
	for (let i = 0; i < 3; i++) { // TODO: 3-> number of objects
		objects.push({
			vertices: [
				{ x: 0, y: 0, z: 0 },
				{ x: 1, y: 0, z: 0 },
				{ x: 1, y: 0, z: 1 },
				{ x: 0, y: 0, z: 1 },
				{ x: 0, y: 1, z: 0 },
				{ x: 1, y: 1, z: 0 },
				{ x: 1, y: 1, z: 1 },
				{ x: 0, y: 1, z: 1 }
			],

			edges: [
				{ s: 0, e: 1 },
				{ s: 1, e: 2 },
				{ s: 2, e: 3 },
				{ s: 3, e: 0 },

				{ s: 4, e: 5 },
				{ s: 5, e: 6 },
				{ s: 6, e: 7 },
				{ s: 7, e: 4 },

				{ s: 0, e: 4 },
				{ s: 1, e: 5 },
				{ s: 2, e: 6 },
				{ s: 3, e: 7 },
			]
		});
	}

	smooth();
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
		stroke(0);
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

	stroke(255, 0, 0);
	strokeWeight(2);
	for (let object of objects) {
		for (let vertex of object.vertices) {
			let g = grid[vertex.x][vertex.y][vertex.z];
			ellipse(g.x, g.y, 5, 5)
		}
		for (let edge of object.edges) {
			const vs = object.vertices[edge.s];
			const gs = grid[vs.x][vs.y][vs.z];
			const ve = object.vertices[edge.e];
			const ge = grid[ve.x][ve.y][ve.z];
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
	let update = false;

	let t = gridSizeInput.value * 1.0;
	if (t != gridSize) {
		gridSize = t;
		updateGridSize();
		update = true;
	}

	t = horizontalLineInput.value * 1.0
	if (t != horizontalLine) {
		horizontalLine = t;
		update = true;
	}
	t = verticalLineInput.value * 1.0;
	if (t != verticalLine) {
		verticalLine = t;
		update = true;		
	}
	t = leftViewPointInput.value * 1.0;
	if (t != leftViewpoint) {
		leftViewpoint = t;
		update = true;		
	}
	t = rightViewPointInput.value * 1.0;
	if (t != rightViewpoint) {
		rightViewpoint = t;
		update = true;		
	}
	t = topViewPointInput.value * 1.0;
	if (t != topViewpoint) {
		topViewpoint = t;
		update = true;		
	}
	t = bottomViewPointInput.value * 1.0;
	if (t != bottomViewpoint) {
		bottomViewpoint = t;
		update = true;		
	}

	if (update) {
		updateGrid()
	}
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
