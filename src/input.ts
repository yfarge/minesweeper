import readline from "node:readline/promises";
import { inBounds, ACTIONS } from "./utils";

export async function promptForAction(
    rl: readline.Interface,
    rows: number,
    cols: number
): Promise<{ action: keyof typeof ACTIONS; coordinate: [number, number] }> {
    const controller = new AbortController();
    const signal = controller.signal;

    const onSigint = () => {
        controller.abort(); // trigger AbortError
    };

    process.once("SIGINT", onSigint);

    try {
        while (true) {
            let input: string;

            try {
                input = await rl.question("Enter 'row, col' to reveal or 'f row, col' to flag: ", { signal });
            } catch (err: any) {
                if (err.name === "") {
                    console.log("\nAborted with CTRL+C");
                    process.exit(0);
                } else {
                    throw err;
                }
            }

            let action: keyof typeof ACTIONS = "REVEAL";
            if (input.startsWith("f")) {
                action = ACTIONS.FLAG;
                input = input.slice(1).trim();
            }

            const [rowStr, colStr] = input.split(",").map((s) => s.trim());
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
    } finally {
        process.removeListener("SIGINT", onSigint);
    }
}
