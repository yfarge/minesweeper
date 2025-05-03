import { ADJACENT_POSITIONS, inBounds } from "./utils";

export function createViews(rows: number, cols: number)
    : { gameView: number[][], userView: number[][] } {
    return {
        gameView: Array(rows).fill(null).map(() => Array(cols).fill(0)),
        userView: Array(rows).fill(null).map(() => Array(cols).fill(-2))
    };
}

export function placeBombs(gameView: number[][], numBombs: number): [number, number][] {
    const m = gameView.length, n = gameView[0].length;
    let count = Math.min(numBombs, m * n);
    const bombs: [number, number][] = [];
    while (count > 0) {
        const row = Math.trunc(Math.random() * m);
        const col = Math.trunc(Math.random() * n);

        if (gameView[row][col] === 0) {
            bombs.push([row, col]);
            gameView[row][col] = -1;
            count--;
        }
    }
    return bombs;
}


export function populateBoard(gameView: number[][], bombs: [number, number][]): void {
    const m = gameView.length, n = gameView[0].length;
    for (const [r, c] of bombs) {
        for (const [dr, dc] of ADJACENT_POSITIONS) {
            const nr = r + dr;
            const nc = c + dc;
            if (inBounds(nr, nc, m, n) && gameView[nr][nc] >= 0) {
                gameView[nr][nc]++;
            }
        }
    }

}

export function search(gameView: number[][], userView: number[][], r: number, c: number): void {
    const m = gameView.length, n = gameView[0].length;
    const queue: [number, number][] = [[r, c]];
    userView[r][c] = gameView[r][c];

    while (queue.length > 0) {
        const [cr, cc] = queue.shift()!;

        for (const [dr, dc] of ADJACENT_POSITIONS) {
            const nr = cr + dr;
            const nc = cc + dc;
            if (inBounds(nr, nc, m, n) && gameView[cr][cc] === 0 && (userView[nr][nc] === -2 || userView[nr][nc] === -3)) {
                userView[nr][nc] = gameView[nr][nc];
                queue.push([nr, nc]);
            }
        }
    }

}

export function flagCell(userView: number[][], row: number, col: number): void {
    const cell = userView[row][col];
    if (cell === -2) {
        userView[row][col] = -3;
    } else if (cell === -3) {
        userView[row][col] = -2;
    } else {
        console.log("Cannot flag revealed cell!")
    }
}

export function printView(view: number[][]): void {
    const maxLength = Math.max(...view.flat().map(num => num.toString().length));
    for (const row of view) {
        console.log(row.map(cell => {
            switch (cell) {
                case -1: return "*".padStart(maxLength, ' ');
                case -2: return "?".padStart(maxLength, ' ');
                case -3: return "F".padStart(maxLength, ' ');
                default: return cell.toString().padStart(maxLength, ' ');
            }
        }).join(' '))
    }
    console.log();
}

export function hasWon(userView: number[][], numBombs: number): boolean {
    return userView
        .flat()
        .reduce((acc, num) => acc + Number(num === -2 || num == -3), 0) === numBombs;
}

export function revealBombs(gameView: number[][], userView: number[][], bombs: number[][]): void {
    for (const [row, col] of bombs) {
        userView[row][col] = gameView[row][col];
    }
}
