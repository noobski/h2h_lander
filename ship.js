/* eslint-disable no-unused-vars */
/* eslint-disable no-magic-numbers */
/* global Spaceobj, Vector, Missile */
class Ship extends Spaceobj{
	constructor(game, pos, speed){
		super('ship', game.screen.canv, pos, speed);
		super.set_rotation_speed(0.075);
		this.game = game;
		this.interval_between_missiles = 350;
	}
	draw_obj_body(){
		const {c} = this.game.screen;
		const {d} = this;
		// body
		c.fillStyle = '#6C7A89';
		c.fillRect(-d/2, -d/2, d, d);
		// nose
		c.beginPath();
		c.moveTo(0,0);
		c.lineTo(2*d,0);
		c.stroke();
		// thruster
		if(this.get_thrust_direction())
		{
			c.fillStyle = Math.random() < 0.75 ? '#F9690E' : '#FFB61E';
			c.fillRect(-1.1*d,-d/2,d/2,d);
		}
	}
	fire_on(){
		this.fire = true;
		this.fire_missile();
	}
	fire_missile(){
		if(!this.fire)
			return; // (spacebar no longer pressed)
		const rot_vector = new Vector(this.rotation, 1, true);
		const speed = rot_vector.dup().mult(3).add(this.speed.dup().mult(1.5));
		const cannon = rot_vector.mult(2*this.d);
		this.game.add_object(new Missile(this.game, this.pos.dup().add(cannon), speed));
		setTimeout(()=>this.fire_missile(), this.interval_between_missiles);
	}
	fire_off(){
		this.fire = false;
	}
	crash(type_crashed_with){
		//this.mark_for_deletion = true;
	}
}
