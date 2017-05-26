class Box {

	constructor(index = null) {
		this.Index = index;
		this.Player = null;
	}

	get Played() {
		return this.Player !== null;
	}

	Play(player) {
		this.Player = player;

		return this;
	}
}

export default Box;
