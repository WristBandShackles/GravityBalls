// Header
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');


// Variables
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2 
};

var colors = [
	'#0b090a',
	'#161a1d',
	'#660708',
	'#e5383b'
];

// Storage Particle Mass
var particleArray = [];

var friction = 0.98; // 0 - 1 only

// Gravity
var accelerationX = 0.0;
var accelerationY = 0.01;




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

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function isThereContact(particle1, particle2) {
	if (!(particle1 === particle2)) {
		return 	distance(particle1.x, particle1.y, particle2.x, particle2.y) <= particle1.radius + particle2.radius;
	} else {
		return false;
	}
	
}

function elasticCollision(particle1, particle2) {
	const xDiff = particle2.x - particle1.x;
	const yDiff = particle2.y - particle1.y;

	const xVelDiff = particle1.velocity.x - particle2.velocity.x;
	const yVelDiff = particle1.velocity.y - particle2.velocity.y;

	if (xDiff * xVelDiff + yDiff * yVelDiff >=0) {
		// Mass
		const m1 = particle1.mass;
		const m2 = particle2.mass;

		// Initial Velocity
		//// X
		const u1x = particle1.velocity.x;
		const u2x = particle2.velocity.x;
		//// Y
		const u1y = particle1.velocity.y;
		const u2y = particle2.velocity.y;
		
		// Final Velocity
		//// X
		const v1x = (u1x * (m1 - m2) / (m1 + m2) + (u2x * 2 * m2) / (m1 + m2));
		const v2x = (u2x * (m2 - m1) / (m1 + m2) + (u1x * 2 * m1) / (m1 + m2));
		//// Y
		const v1y = u1y * (m1 - m2) / (m1 + m2) + (u2y * 2 * m2) / (m1 + m2);
		const v2y = u2y * (m2 - m1) / (m1 + m2) + (u1y * 2 * m1) / (m1 + m2);

		// Load Final Velocity
		particle1.velocity.x = v1x;
		particle1.velocity.y = v1y;

		particle2.velocity.x = v2x;
		particle2.velocity.y = v2y;
	}

}




// Objects
function Particle(x, y, velocityX, velocityY, accelerationX, accelerationY, radius, color) {

	// Position
	this.x = x;
	this.y = y;

	// Velocity
	this.velocity = {
		x: velocityX,
		y: velocityY
	}

	// Acceleration
	this.acceleration = {
		x: accelerationX,
		y: accelerationY
	}

	// Description
	this.radius = radius;
	this.mass = radius/3;
	this.color = color;

	// Each update call represents one tick of time and moves the particle forward
	this.update = function() {
		if (this.y + this.radius + this.velocity.y > canvas.height || this.y - this.radius <= 0) {
			this.velocity.y = -this.velocity.y * friction;
			this.dx = this.dx * friction;
		} else {
			this.velocity.y += this.acceleration.y;
		}

		if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
			this.velocity.x = -this.velocity.x * friction;
			this.velocity.y = this.velocity.y * friction;
		} else {
			this.velocity.x += this.acceleration.x;
		}

		this.y += this.velocity.y; //TODO////// + (1/2 * this.dyy) Potential addition for better phys;
		this.x += this.velocity.x;
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
function init() {
	particleArray = [];

	for (let i = 0; i < 200; i++) {
		let radius = randomIntFromRange(10, 25);
		let x = randomIntFromRange(0 + radius, innerWidth - radius);
		let y = randomIntFromRange(0 + radius, innerHeight - radius);
		let velocityX = randomIntFromRange(-2, 2);
		let velocityY = randomIntFromRange(-2, 2);

		let particle = new Particle(x, y, velocityX, velocityY, accelerationX, accelerationY, radius, randomColor(colors));
		particleArray.push(particle);

		for(let j = 0; j < particleArray.length; j++) {
			if(isThereContact(particle, particleArray[j])) {
				particle.x = randomIntFromRange(0 + particle.radius, innerWidth - particle.radius);
				particle.y = randomIntFromRange(0 + particle.radius, innerHeight - particle.radius);
				j = 0;
			}
		}


	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < particleArray.length; i++) {

		particleArray[i].draw();

		for (let j = 0; j < particleArray.length; j++) {
			if(isThereContact(particleArray[i], particleArray[j])) {
				elasticCollision(particleArray[i], particleArray[j]);
			}
		}

		particleArray[i].update();
	}
}

init();
animate();
