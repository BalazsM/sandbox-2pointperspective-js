
// --  globals  --------------------------------------------------------------

let horizontalLine;
let verticalLine;
let leftViewpoint;
let rightViewpoint;
let topViewpoint;
let bottomViewpoint;
let grid;
let objects;

// -- event handlers  --------------------------------------------------------

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight);
	canvas.parent('workspace');

	grid = new Array(10);
	for (let x = 0; x < 10; x++) {
		grid[x] = new Array(10);
		for (let y = 0; y < 10; y++) {
			grid[x][y] = new Array(10);
			for (let z = 0; z < 10; z++) {
//				grid[x][y][z] = random(10) > 5; // TODO: parameters
				grid[x][y][z] = {
					x: 0,
					y: 0,
					b: 0
				};
			}
		}
	}
	grid[0][0][0].b = 1;
//	console.log(grid);

	objects = [];
	for (let i = 0; i < 3; i++) {
		objects[i] = {
			vertices: [
				{x: 0, y: 0, z: 0},
				
			]


		}
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

	let horizontalY = height * horizontalLine / 100;
	let verticalX = width * verticalLine / 100;
	let leftX = width * leftViewpoint / 100;
	let rightX = width * (100 + rightViewpoint) / 100;
	let topY = height * topViewpoint / 100;
	let bottomY = height * (100 + bottomViewpoint) / 100;
	
	let pX = new Array(10);
	let pY = new Array(10);
	let pZ = new Array(10);

	let w = 10;

	for (let i = 0; i < 10; i++) {
		pZ[i] = {
			x : verticalX,
			y : topY + (bottomY - topY) / 100 * w * i
		};
	}

	for (let z = 0; z < 10; z++) {
		stroke(0, 0, 0, 64);
		strokeWeight(1);
		for (let i = 0; i < 10; i++) {
			pX[i] = {
				x : pZ[z].x + (leftX - pZ[z].x) / 150 * w * i,
				y : pZ[z].y + (horizontalY - pZ[z].y) / 150 * w * i
			};
			pY[i] = {
				x : pZ[z].x + (rightX - pZ[z].x) / 150 * w * i,
				y : pZ[z].y + (horizontalY - pZ[z].y) / 150 * w * i
			};

			if (showGridLines.checked) {
				line(rightX, horizontalY, pX[i].x, pX[i].y);
				line(leftX, horizontalY, pY[i].x, pY[i].y);
			}
		}

		let g;
		g = grid[0][0][z];
		g.x = pZ[z].x;
		g.y = pZ[z].y;
		for (let x = 1; x < 10; x++) {
			g = grid[x][0][z];
			g.x = pX[x].x;
			g.y = pX[x].y;
			for (let y = 1; y < 10; y++) {
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

	stroke(0);
	strokeWeight(1);
	noFill();
	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			for (let z = 0; z < 10; z++) {
				let g = grid[x][y][z];
				ellipse(g.x, g.y, 3, 3);

				if (g.b > 0) {
						
				}
			}
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
	horizontalLine = horizontalLineInput.value * 1.0;
	verticalLine = verticalLineInput.value * 1.0;
	leftViewpoint = leftViewPointInput.value * 1.0;
	rightViewpoint = rightViewPointInput.value * 1.0;
	topViewpoint = topViewPointInput.value * 1.0;
	bottomViewpoint = bottomViewPointInput.value * 1.0;
}

function updateDisplays() {
	simulationFPSDisplay.innerHTML = frameRate().toFixed(2);
	horizontalLineOutput.innerHTML = horizontalLine.toFixed(2);
	verticalLineOutput.innerHTML = verticalLine.toFixed(2);
	leftViewPointOutput.innerHTML = leftViewpoint.toFixed(2);
	rightViewPointOutput.innerHTML = rightViewpoint.toFixed(2);
	topViewPointOutput.innerHTML = topViewpoint.toFixed(2);
	bottomViewPointOutput.innerHTML = bottomViewpoint.toFixed(2);
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

// --  draw functions  -------------------------------------------------------
