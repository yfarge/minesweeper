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
    console.log("Welcome to MineSweeper!");
    printView(userView);

    while (true) {
        const { action, coordinate: [row, col] } = await promptForAction(rl, numRows, numCols);

        let shouldRedraw = true;
        let gameOver = false;

        if (action === ACTIONS.FLAG) {
            flagCell(userView, row, col);
        } else {
            if (userView[row][col] >= 0) {
                console.log("You've already revealed this cell! Pick an unrevealed cell to continue your search.");
                shouldRedraw = false;
            } else if (userView[row][col] === -3) {
                console.log("You cannot search a flagged cell. Unflag cell first.");
                shouldRedraw = false;
            } else if (gameView[row][col] === -1) {
                console.log("Game over! You lose.");
                revealBombs(gameView, userView, bombs);
                gameOver = true;
            } else {
                search(gameView, userView, row, col);
            }
        }

        if (shouldRedraw || gameOver) {
            console.clear();
            if (gameOver) console.log("Game over! You lose.");
            printView(userView);
        }

        if (hasWon(userView, numBombs)) {
            console.clear();
            printView(userView);
            console.log("You win! All bombs have been discovered.");
            break;
        }

        if (gameOver) break;
    }

    rl.close();
}
