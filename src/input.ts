import readline from "node:readline/promises"
import { inBounds, ACTIONS } from "./utils";

export async function promptForAction(rl: readline.Interface, rows: number, cols: number)
    : Promise<{ action: keyof typeof ACTIONS, coordinate: [number, number] }> {
    while (true) {
        let input = await rl.question("Enter 'row, col' to reveal or 'f row, col' to flag: ");
        let action: keyof typeof ACTIONS = 'REVEAL';
        if (input.startsWith('f')) {
            action = ACTIONS.FLAG;
            input = input.slice(1).trim();
        }

        const [rowStr, colStr] = input.split(',').map(s => s.trim());
        const row = parseInt(rowStr, 10);
        const col = parseInt(colStr, 10);

        if (Number.isNaN(row) || Number.isNaN(col)) {
            console.log("Invalid input. Please enter a pair of numbers like 1, 2");
        } else if (!inBounds(row, col, rows, cols)) {
            console.log(`Out of bounds. There are ${rows} rows and ${cols} cols`);
        } else {
            return { action, coordinate: [row, col] };
        }
    }
}
