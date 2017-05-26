import TicTacToe from "./classes/TicTacToe";

new Vue({
	el: '#app',
	data: {
		Game: new TicTacToe()
	},

	created: function () {
		this.Game.ResetGame();
	}
});

