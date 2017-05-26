class Owner {
	constructor() {

	}

	static get ValidOwners() {
		return ['AI', 'User'];
	};

	static get Owners() {
		return Owner.ValidOwners;
	}

	static get AI() {
		return 'AI';
	}

	static get User() {
		return 'User';
	}
}

export default Owner;
