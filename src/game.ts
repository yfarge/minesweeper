import { createViews, flagCell, hasWon, placeBombs, populateBoard, printView, revealBombs, search } from "./board";
import { promptForAction } from "./input";
import readline from "node:readline/promises";
import { stdin, stdout } from 'node:process';
import { ACTIONS } from "./utils";

type GameOptions = { numRows: number, numCols: number, numBombs: number }
export async function createGame(options: GameOptions) {
    const { numRows, numCols, numBombs } = options;
    const { gameView, userView } = createViews(numRows, numCols);
    const bombs = placeBombs(gameView, numBombs);
    populateBoard(gameView, bombs);
    const rl = readline.createInterface({ input: stdin, output: stdout });

    console.clear();
    printView(userView);

    while (true) {
        const { action, coordinate: [row, col] } = await promptForAction(rl, numRows, numCols);
        const cell = userView[row][col];
        const isRevealed = cell >= 0;
        const isFlagged = cell === -3;
        const isBomb = gameView[row][col] === -1;

        let shouldRedraw = false;
        let gameOver = false;

        if (action === ACTIONS.FLAG) {
            if (isRevealed) {
                console.log("Cannot flag a revealed cell.")
            } else {
                flagCell(userView, row, col);
                shouldRedraw = true;
            }
        }

        if (action === ACTIONS.REVEAL) {
            if (isRevealed) {
                console.log("You've already revealed this cell! Pick an unrevealed cell to continue your search.");
            } else if (isFlagged) {
                console.log("You cannot search a flagged cell. Unflag cell first.");
            } else if (isBomb) {
                console.log("Game over! You lose.");
                revealBombs(gameView, userView, bombs);
                gameOver = true;
                shouldRedraw = true;
            } else {
                search(gameView, userView, row, col);
                shouldRedraw = true;
            }
        }

        if (shouldRedraw) {
            console.clear();
            printView(userView);
        }

        if (hasWon(userView, numBombs)) {
            console.clear();
            printView(userView);
            console.log("You win! All bombs have been discovered :)");
            break;
        }

        if (gameOver) {
            console.log("Game over! You lose.");
            break;
        }
    }

    rl.close();
}
