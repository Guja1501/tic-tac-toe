import Box from './Box';
import WinnerIndexes from "./WinnerIndexes";

class Board {

	constructor() {
		this.Boxes = [];

		for (let i = 0; i < 9; i++)
			this.Boxes.push(new Box(i));
	}

	get PlayedBoxes() {
		return this.Boxes.split().filter(box => box.Played);
	}

	get Overloaded() {
		for (let i = 0; i < 9; i++)
			if (this.Boxes[i].Player === null)
				return false;

		return true;
	}

	get PossibleMoves() {
		let moves = [];

		try {
			for (let i = 0; i < 9; i++)
				if (this.Boxes[i].Player === null)
					moves.push(i);
		} catch (e) {
			console.log('Error: get PossibleMoves')
		}

		return moves;
	}

	BoxCount(played = null) {
		if (played === null)
			return this.PlayedBoxes.length;

		return this.Boxes.split().filter(box => !!played === box.Played).length;
	}

	Play(index, player) {
		this.Boxes[index].Play(player);

		return this;
	}

	IsSamePlayerOnBoxes(BoxIndexes) {
		return this.Boxes[BoxIndexes[0]].Player !== null
			&& this.Boxes[BoxIndexes[0]].Player === this.Boxes[BoxIndexes[1]].Player
			&& this.Boxes[BoxIndexes[0]].Player === this.Boxes[BoxIndexes[2]].Player;
	}

	get Winner() {
		for(let i = 0, wins = WinnerIndexes.Normal; i < wins.length; i++)
			if(this.Boxes[wins[i][0]] !== null && this.IsSamePlayerOnBoxes(wins[i]))
				return this.Boxes[wins[i][0]].Player;

		return null;
	}

	/**
	 * Score the current game state
	 * @returns {Number} Score for current game state.
	 */
	Score(player1, player2) {
		let score = 0;
		for (let i = 0, wins = WinnerIndexes.Normal; i < wins.length; i++)
			score += this.EvaluateCombination(wins[i], player1, player2);

		return score;
	}

	/**
	 * Evaluate a win combination
	 * Return +100, +10, +1 for 3, 2, 1 in a row for @param player1
	 * Return -100, -10, -1 for 3, 2, 1 in a row for @param player2
	 * @param {Player} player1
	 * @param {Player} player2
	 * @param {Array} combination - Winning combination
	 * @returns {Number} Score for a giving win combination
	 */
	EvaluateCombination(combination, player1, player2) {
		let score = 0;

		// one in a row
		if (this.Boxes[combination[0]].Player === player1) score = 1;
		else if (this.Boxes[combination[0]].Player === player2) score = -1;

		// two in a row
		if (this.Boxes[combination[1]].Player === player1) {
			if (score === 1) score = 10; // two in a row for player1
			else if (score === -1) return 0;
			else score = 1;
		} else if (this.Boxes[combination[1]].Player === player2) {
			if (score === -1) score = -10; // two in a row for player2
			else if (score === 1) return 0;
			else score = -1;
		}

		// Three in a row
		if (this.Boxes[combination[2]].Player === player1) {
			if (score > 0) score *= 10; // three in a row for player1
			else if (score < 0) return 0;
			else score = 1;
		} else if (this.Boxes[combination[1]].Player === player2) {
			if (score < 0) score *= 10; // three in a row for player2
			else if (score > 1) return 0;
			else score = -1;
		}

		return score;
	}
}

export default Board;
