/* eslint-disable no-magic-numbers */
/* global Ship Keyboard_input Vector Meteor Line Terrain_builder*/
class Game {
	constructor() {
		// canvas
		const w = window.innerWidth, h = window.innerHeight;
		const screen = { w: w, h: h, canv: document.getElementById('canvas') };
		screen.canv.width = screen.w, screen.canv.height = screen.h;
		screen.c = screen.canv.getContext('2d');
		this.screen = screen;
		// game objects
		this.objects_marked_for_addition = [];
		this.objects = [];
		// ship
		const ship = new Ship(this, new Vector(screen.w / 2, screen.h / 2), new Vector(0, 0));
		this.add_object(ship);
		this.ship = ship;
		// meteors
		for(let i=0; i<2; i++)
			this.add_object(new Meteor(this, 4));
		// terrain
		this.add_object(new Line(this, new Vector(100,100), new Vector(100,300)));
		// keyboard setup
		this.keyboard_input = new Keyboard_input(
			'ArrowLeft', 'down', () => ship.set_rotation_direction(-1),
			'ArrowLeft', 'up', () => ship.set_rotation_direction(0),
			'ArrowRight', 'down', () => ship.set_rotation_direction(1),
			'ArrowRight', 'up', () => ship.set_rotation_direction(0),
			' ', 'down', () => ship.fire_on(), ' ', 'up', () => ship.fire_off(),
			'ArrowUp', 'down', () => ship.change_thrust_direction(1),
			'ArrowUp', 'up', () => ship.change_thrust_direction(0),
			'g', 'down', () => { this.gravity = !this.gravity; });
		// terrain builder
		this.add_object(new Terrain_builder(this));
		// misc
		this.gravity = new Vector(0,0.03);
		this.loop();
	}
	loop() {
		const { c, w, h } = this.screen;
		// clear screen
		c.fillStyle = 'rgb(50,50,50)';
		c.fillRect(0, 0, w, h);
		// draw and update
		this.objects.forEach(o => {
			o.draw();
			o.update();
		});
		// colissions
		this.check_collissions();
		// remove objects marked for deletion
		for (let i = this.objects.length - 1; i >= 0; i--)
			if (this.objects[i].mark_for_deletion)
				this.remove_object(this.objects[i]);
		// add objects marked for addition (mostly the new meteors that recently split)
		if(this.objects_marked_for_addition)
		{
			this.objects = [...this.objects, ...this.objects_marked_for_addition];
			this.objects_marked_for_addition = [];
		}
		// loop again
		setTimeout(() => this.loop(), 20);
	}
	add_object(obj){
		this.objects_marked_for_addition.push(obj);
	}
	check_collissions() {
		for(let i=0; i<this.objects.length; i++)
		{
			const o1 = this.objects[i];
			for(let j=i+1; j<this.objects.length; j++)
			{
				const o2 = this.objects[j];
				if((o1.type=='line' ^ o2.type=='line') && (o1.type=='ship' ^ o2.type=='ship'))
				{
					// 1 line and 1 circle
					const c = o1.type=='line' ? o2 : o1;
					const l = o1.type=='line' ? o1 : o2;
					const collision = line_intersects_circle(l.p1.x, l.p1.y, l.p2.x, l.p2.y,
						c.pos.x, c.pos.y, c.collision_radius);
					if(collision)
					{
						l.crash(c.type);
						c.crash('line');
					}
				}
				else if(o1.type=='circle' && o2.type=='circle')
				{
					// 2 circle type objects
					if (this.obj_dist(o1, o2) <= (o1.collision_radius + o2.collision_radius)) {
						o1.crash(o2.type);
						o2.crash(o1.type);
					}
				}
			}
		}
	}
	obj_dist(o1, o2) {
		const x1=o1.pos.x, y1 = o1.pos.y;
		const x2=o2.pos.x, y2 = o2.pos.y;
		return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
	}
	remove_object(obj) { // todo: should be just marking for deletion, and removal should happen in line 74
		const index = this.objects.indexOf(obj);
		this.objects.splice(index, 1);
	}
}
function line_intersects_circle(x1, y1, x2, y2, cx, cy, r) {
	// Calculate the length of the line segment
	const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

	// Calculate the vector representing the line segment
	const dx = (x2 - x1) / length;
	const dy = (y2 - y1) / length;

	// Calculate the vector representing the distance from the center of the circle to the start of the line segment
	const cx1 = cx - x1;
	const cy1 = cy - y1;

	// Calculate the dot product of the two vectors to determine if the line segment intersects the circle
	const dotProduct = dx * cx1 + dy * cy1;

	if (dotProduct < 0) {
		// The circle is behind the start of the line segment
		return Math.sqrt(Math.pow(cx1, 2) + Math.pow(cy1, 2)) <= r;
	}
	else if (dotProduct > length)
	{
		// The circle is past the end of the line segment
		const cx2 = cx - x2;
		const cy2 = cy - y2;
		return Math.sqrt(Math.pow(cx2, 2) + Math.pow(cy2, 2)) <= r;
	}
	else
	{
		// The circle is intersecting the line segment
		const distanceToLine = Math.abs(dx * cy1 - dy * cx1);
		return distanceToLine <= r;
	}
}

new Game();
