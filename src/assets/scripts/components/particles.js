// 'use strict';
//
// class ClassName {
//   constructor() {
//
//     let this.VELOCITY = 1;
//     let this.PARTICLES = 400;
//     let this.mouse = {x:0, y:0};
//     let this.particles = [];
//     let this.colors = [ "#2EC4B6","#E71D36","#FF9F1C" ];
//     let this.canvas = document.getElementById('projector');
//     let this.context;
//
//     if (this.canvas && this.canvas.getContext) {
//       this.context = this.canvas.getContext('2d');
//
//       for( let i = 0; i < this.PARTICLES; i++ ) {
//         particles.push( {
//           x: Math.random()*window.innerWidth,
//           y: Math.random()*window.innerHeight,
//           vx: ((Math.random()*(VELOCITY*2))-VELOCITY),
//           vy: ((Math.random()*(VELOCITY*2))-VELOCITY),
//           size: 1+Math.random()*3,
//           color: colors[ Math.floor( Math.random() * colors.length ) ]
//         } );
//       }
//
//       Initialize();
//     }
//   }
//
//
//   Initialize() {
//   	window.addEventListener('resize', ResizeCanvas, false);
//   	setInterval( TimeUpdate, 40 );
//
//   	ResizeCanvas();
//   }
//
//   function TimeUpdate(e) {
//
//   	context.clearRect(0, 0, window.innerWidth, window.innerHeight);
//
//   	let len = particles.length;
//   	let particle;
//
//   	for( let i = 0; i < len; i++ ) {
//   		particle = particles[i];
//
//   		if (!particle.frozen) {
//   			particle.x += particle.vx;
//   			particle.y += particle.vy;
//
//   			if (particle.x > window.innerWidth) {
//   				particle.vx = -VELOCITY - Math.random();
//   			}
//   			else if (particle.x < 0) {
//   				particle.vx = VELOCITY + Math.random();
//   			}
//   			else {
//   				particle.vx *= 1 + (Math.random() * 0.005);
//   			}
//
//   			if (particle.y > window.innerHeight) {
//   				particle.vy = -VELOCITY - Math.random();
//   			}
//   			else if (particle.y < 0) {
//   				particle.vy = VELOCITY + Math.random();
//   			}
//   			else {
//   				particle.vy *= 1 + (Math.random() * 0.005);
//   			}
//
//   			let distanceFactor = DistanceBetween( mouse, particle );
//   			distanceFactor = Math.max( Math.min( 15 - ( distanceFactor / 10 ), 10 ), 1 );
//
//   			particle.currentSize = particle.size;
//   		}
//
//   		context.fillStyle = particle.color;
//   		context.beginPath();
//   		context.arc(particle.x,particle.y,particle.currentSize,0,Math.PI*2,true);
//   		context.closePath();
//   		context.fill();
//
//   	}
//   }
//
//   function ResizeCanvas(e) {
//   	canvas.width = window.innerWidth;
//   	canvas.height = window.innerHeight;
//   }
//
//   function DistanceBetween(p1,p2) {
//   	let dx = p2.x-p1.x;
//   	let dy = p2.y-p1.y;
//   	return Math.sqrt(dx*dx + dy*dy);
//   }
//
// }
