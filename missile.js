/* eslint-disable no-magic-numbers */
/* global Spaceobj */
// eslint-disable-next-line no-unused-vars
class Missile extends Spaceobj{
	constructor(game, pos, speed){
		super('missile', game.screen.canv, pos, speed);
		this.game = game;
		this.collision_radius = this.d/4;
	}
	draw_obj_body(){
		const {c} = this.game.screen;
		const {d} = this;
		// body
		c.fillStyle = '#F7CA18';
		c.fillRect(-d/8, -d/8, d/4, d/4);
	}
	update(){
		super.update();
		const {w, h} = this.game.screen;
		const {x, y} = this.pos;
		if(x==0 || x==(w-this.d) || y==0 || y==(h-this.d))
			this.game.remove_object(this);
	}
	crash(type_crashed_with){
		if(type_crashed_with=='missile')
			return;
		this.mark_for_deletion = true;
	}
}
