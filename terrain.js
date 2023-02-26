/* eslint-disable no-console */
/* eslint-disable no-magic-numbers */
/* global Vector Mouse_input */
// eslint-disable-next-line no-unused-vars
class Line {
	constructor(game, p1, p2, color='white'){
		this.game = game;
		this.color = color;
		this.type = 'line';
		this.p1 = p1, this.p2 = p2;
		this.crashed = 0;
	}
	draw(){
		const {c} = this.game.screen;
		// line
		c.strokeStyle = this.crashed>0 ? 'red' : this.color;
		c.lineWidth = 2;
		c.beginPath();
		c.moveTo(this.p1.x, this.p1.y);
		c.lineTo(this.p2.x, this.p2.y);
		c.stroke();
	}
	struct(){
		return {x1: this.p1.x, y1: this.p1.y, x2: this.p2.x, y2: this.p2.y};
	}
	update(){
		if(this.crashed)
			this.crashed--;
	}
	crash(/*type_crashed_with*/){
		this.crashed+=1;
	}
}
// eslint-disable-next-line no-unused-vars
class Terrain_builder {
	constructor(game){
		console.log('l: create landing pad');
		this.game = game;
		this.type = 'terrain_builder';
		this.points= [];
		// output string
		this.output = '[ship_start, ';
		// keyboard setup
		this.landing_pad_y = null;
		this.game.keyboard_input.add_cb('l', 'down', ()=>this.landing_pad_y=this.next.y);
		// mouse setup
		new Mouse_input(document.body,'click',(e)=>this.create_line(e),
			document.body, 'mousemove', (e)=>this.mouse_move(e));
	}
	mouse_move(e){
		this.next = new Vector(e.offsetX, e.offsetY);
		// allow only horizontal lines for landing pad
		if(this.landing_pad_y)
			this.next.y = this.points[this.points.length-1].y;
	}
	create_line(e){
		const x = e.offsetX;
		let y = e.offsetY;
		this.points.push({x: x, y: y});
		const color = this.landing_pad_y ? 'green' : 'white';
		if(this.points.length==1) // this is the first point selected, so log the ship's position
		{
			this.output+=Math.round(this.game.ship.pos.x).toString()+', ';
			this.output+=Math.round(this.game.ship.pos.y).toString()+', ';
		}
		if(this.landing_pad_y)
		{
			// start of description of landing pad
			this.output += ', landing_pad';
			y = this.landing_pad_y;
			this.landing_pad_y = null;
		}
		if(this.points.length>1)
			this.output+=', ';
		this.output+=x.toString()+', ';
		this.output+=y.toString();
		// print the array to copy in to game later
		console.log(this.output+']');
		if(this.points.length==1)
			return;
		// draw new line
		// create line
		this.next = this.points[this.points.length-1];
		const prev = this.points[this.points.length-2];
		this.game.add_object(new Line(this.game, new Vector(prev.x, prev.y),
			new Vector(this.next.x, this.next.y), color));
	}
	update(){ // dummy function for main loop
	}
	draw(){
		// draws the candidate for the next line
		if(!this.points.length)
			return;
		const prev = this.points[this.points.length-1];
		const {c} = this.game.screen;
		// line
		c.strokeStyle = 'orange';
		c.lineWidth = 2;
		c.beginPath();
		c.moveTo(prev.x, prev.y);
		c.lineTo(this.next.x, this.next.y);
		c.stroke();
	}
}
