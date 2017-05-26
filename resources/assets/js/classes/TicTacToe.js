import Board from './Board';
import Player from "./Player";
import WinnerIndexes from "./WinnerIndexes";
import Owner from "./Owner";

class TicTacToe {

	constructor() {
		this.Board = new Board();
		this.Players = {
			Nought: new Player('Nought', '<i class="fa fa-circle-o" aria-hidden="true"></i>', Owner.AI),
			Cross: new Player('Cross', '<i class="fa fa-times" aria-hidden="true"></i>', Owner.User)
		};

		this.Winner = null; // Winner Player
		this.GameScoreDraw = 0;
		this.CurrentPlayer = this.Players.Cross;

		this.Game = true;

		this.Message = null;
		this.EndGameMessage = null;

		this.Difficulty = 5;
	}

	get Won() {
		for (let i = 0, wins = WinnerIndexes.Normal; i < wins.length; i++) {
			let indexes = wins[i];
			if (this.Board.IsSamePlayerOnBoxes(wins[i]))
				return true;
		}

		return false;
	}

	get Over() {
		return this.Won || this.Board.Overloaded;
	}

	get Draw() {
		return this.Board.Overloaded;
	}

	Play(box) {
		if (!this.Game)
			return !(this.Message = 'Game is not started yet.');

		this.Message = null;

		if (box.Player)
			return this.ClickedOnPlayedBox(box);

		box.Play(this.CurrentPlayer);

		this.ChangeCurrentPlayer();
		this.CheckEndGameAndReset();

		// Play AI
		if (this.CurrentPlayer.CheckOwner(Owner.AI))
			this.RunAI();
	}

	ChangeCurrentPlayer() {
		this.CurrentPlayer = this.SecondPlayer;
	}

	ClickedOnPlayedBox(box) {
		this.Message = `${box.Index + 1} is already taken by ${box.Player.Name}`;
	}

	get SecondPlayer() {
		return this.GetSecondPlayer(this.CurrentPlayer);
	}

	GetSecondPlayer(player) {
		return this.Players[{Nought: 'Cross', Cross: 'Nought'}[player.Name]];
	}

	RunAI() {
		if (this.CurrentPlayer === this.Players.Nought)
			this.AIPlay();

		this.CheckEndGame();
	}

	AIPlay() {
		return this.Play(this.Board.Boxes[this.RunMiniMax(this.Difficulty, this.CurrentPlayer, -Infinity, Infinity)]);
	}

	RunMiniMax(dept, player, alpha, beta) {
		let ret = this.MiniMax(dept, player, alpha, beta);

		return ret[1];
	}

	MiniMax(dept, player, alpha, beta) {
		let bestMove = -1;
		let score = 0;

		if (this.Over || !dept)
			return [this.BoardGameScore(this.Board), bestMove];

		for (let i = 0, moves = this.Board.PossibleMoves; i < moves.length; i++) {
			this.Board.Play(moves[i], player);

			score = this.MiniMax(dept - 1, this.GetSecondPlayer(player), alpha, beta)[0];
			if (player === this.Players.Nought) {
				if (score > alpha) {
					alpha = score;
					bestMove = moves[i];
				}
			} else if (score < beta) {
				beta = score;
				bestMove = moves[i];
			}

			// Undo move
			this.Board.Play(moves[i], null);

			// Stop iteration if alpha >= beta
			if (alpha >= beta)
				break;
		}

		score = player === this.Players.Nought ? alpha : beta;

		return [score, bestMove];
	}

	get CurrentGameScore() {
		return this.BoardGameScore(this.Board);
	}

	BoardGameScore(board) {
		return board.Score(this.Players.Nought, this.Players.Cross);
	}

	CheckEndGame() {
		if (!this.Over)
			return false;

		return this.Draw ? !!++this.GameScoreDraw : (this.Winner = this.Board.Winner) !== null;
	}

	ResetGame() {
		this.Board = new Board();
	}

	ApplyStats() {
		if (this.Draw) {
			this.GameScoreDraw++;
			this.EndGameMessage = "Draw!";

			return true;
		}

		this.Winner = this.Board.Winner;
		this.Winner.RegisterWin();
		this.GetSecondPlayer(this.Winner).RegisterLose();
		this.EndGameMessage = `Winner ${this.Winner.Name}`;

		setTimeout(function () {
			this.EndGameMessage = null;
		}.bind(this), 1000);

		return true;
	}

	CheckEndGameAndReset() {
		return this.Over && this.ApplyStats() && this.ResetGame();
	}

}

export default TicTacToe;
