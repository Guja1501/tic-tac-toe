class Player {

	constructor(name, sign, owner) {
		this.Name = name;
		this.Sign = sign;
		this.Win = 0;
		this.Lose = 0;
		this.Owner = owner;
	}

	RegisterWin() {
		this.Win++;

		return this;
	}

	RegisterLose() {
		this.Lose++;

		return this;
	}

	CheckOwner(Owner) {
		return this.Owner === Owner;
	}
}

export default Player;
