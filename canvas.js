var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2 
};

var colors = [
	'#2185C5',
	'#7ECEFD',
	'#FFF6E5',
	'#FF7F66'
];

var gravity = 0.2;
var friction = 0.98;

var dxx = 0.0;
var dyy = 0.2;




// Event Listeners
addEventListener("mousemove", function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener("resize", function() {
	canvas.width = innerWidth;	
	canvas.height = innerHeight;
  init();
});

addEventListener("click", function(event) {
	init();
});




// Utility Functions
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}




// Objects
function Ball(x, y, dx, dy, dxx, dyy, radius, color, ball) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.dxx = dxx;
	this.dyy = dyy;
	this.radius = radius;
	this.color = color;
	this.ball = ball;

	this.getX = function(){
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	this.flipDX = function() {
		this.dx = -this.dx;
	};

	this.flipDY = function() {
		this.dy = -this.dy;
	};

	this.getRadius = function() {
		return this.radius;
	};

	this.isThereContact = function(ball) {
		if (Math.sqrt(((ball.getX() - this.x) * (ball.getX() - this.x)) + ((ball.getY() - this.y) * (ball.getY() - this.y))) < ball.getRadius() + this.radius){
			ball.flipDX();
			ball.flipDY();
			this.flipDX();
			this.flipDY();
		}
	};


	this.update = function() {

		if (this.y + this.radius + this.dy > canvas.height || this.y - this.radius <= 0) {
			this.dy = -this.dy * friction;
			this.dx = this.dx * friction;
		} else {
			this.dy += this.dyy;
		}

		if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
			this.dx = -this.dx * friction;
			this.dy = this.dy * friction;
		} else {
			this.dx += this.dxx;
		}

		this.y += this.dy; // + (1/2 * this.dyy) Potential addition for better phys;
		this.x += this.dx;
		this.draw();

		for(let i = 0; i < ballArray.length; i++) {
			ballArray[i].isThereContact(this);
		}
	};

	
	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
		c.fillStyle = this.color;
		c.fill();
		c.stroke();
		c.closePath();
	};
}


// Implementation
var ballArray = [];

function init() {
	ballArray = [];

	for (let i = 0; i < 100; i++) {
		var radius = randomIntFromRange(8, 20);
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(1 + radius, canvas.height - radius);
		var dx = randomIntFromRange(-3, 3)
		var dy = randomIntFromRange(-2, 2)
	    ballArray.push(new Ball(x, y, dx, dy, dxx, dyy, radius, randomColor(colors)));
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < ballArray.length; i++) {
		ballArray[i].update();
	}
}

init();
animate();