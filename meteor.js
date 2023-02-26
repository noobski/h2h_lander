/* eslint-disable no-magic-numbers */
/* global Spaceobj Vector */
// eslint-disable-next-line no-unused-vars
class Meteor extends Spaceobj{
	constructor(game, size, pos, speed){
		const start_pos = pos || new Vector(Math.random()*game.screen.w, Math.random()*game.screen.h);
		const start_speed = speed || new Vector(-5+10*Math.random(),-5+10*Math.random());
		super('meteor', game.screen.canv, start_pos, start_speed, 0);
		super.set_rotation_speed(Math.random()/5);
		super.set_rotation_direction(Math.random() < 0.5 ? -1 : 1);
		this.game = game;
		// size of meteor
		this.size = size || 4;
		this.pixels_per_size = 7+Math.floor(14*Math.random());
		this.collision_radius = this.size * this.pixels_per_size;
	}
	draw_obj_body(){
		const {c} = this.game.screen;
		// body
		c.strokeStyle = '#CA6924';
		c.lineWidth = 2;
		c.beginPath();
		c.arc(0, 0, this.size*this.pixels_per_size, 0, 2*Math.PI);
		c.stroke();
		// nose
		c.strokeStyle = '#CA6924';
		c.lineWidth = 1;
		c.moveTo(0,0);
		c.lineTo(this.size*this.pixels_per_size,0);
		c.stroke();
	}
	crash(type_crashed_with){
		if(type_crashed_with == 'meteor')
			return;
		this.mark_for_deletion = true;
		if(this.size==1)
			return;
		const curr_rad = this.size*this.pixels_per_size;
		this.game.add_object(new Meteor(this.game, this.size-1, this.pos.dup().add(new Vector(curr_rad*1.5,0))));
		this.game.add_object(new Meteor(this.game, this.size-1, this.pos.dup().sub(new Vector(curr_rad*1.5,0))));
	}
}
