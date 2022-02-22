import express from 'express'

const app = express();

app.use(express.json())

let ships = false

const STATES = {
    EMPTY: 0,
    SHIP: 1,
    SHIP_HIT: 2,
    SHIP_SANK: 3
}

const indexMap = {
    "A": 0,
    "B": 1,
    "C": 2,
    "D": 3,
    "E": 4,
    "F": 5,
    "G": 6,
    "H": 7
}

let board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

let guesses = []

const validateCoord = (coord) => {
    if (
        coord.length != 2 ||
        !["A", "B", "C", "D", "E", "F", "G", "H"].includes(coord[0]) ||
        ![1, 2, 3, 4, 5, 6, 7, 8].includes(+coord[1])
    ) {
        return false
    }
    return true
}


app.post("/fire", async (req, res) => {
    if (!ships) {
        return res.json({ error: "There are no ships at sea" })
    }
    if (
        !req.body.target ||
        !validateCoord(req.body.target)
    ) {
        return res.json({ error: "invalid target" })
    }


    let [x, y] = req.body.target

    let message

    switch (board[y - 1][indexMap[x]]) {
        case STATES.EMPTY:
            message = "You missed cunt"
            res.json({ hit: false })
            break;
        case STATES.SHIP:
            message = "A hit!"
            board[y - 1][indexMap[x]] = 2
            res.json({ hit: true })
            break;
        case STATES.SHIP_HIT:
            message = "You already hit that you dickhead"
            res.json({ error: "You already hit this" })
            break;
    }

    guesses.push(req.body.target)

    console.clear()
    console.log(`
    ${renderBoard(board)}
        `)

})

const validateShips = (ships) => {
    if (!ships) return false
    if (ships.length != 4) return false

    let merged = [].concat.apply([], ships);
    if ((new Set(merged)).size !== merged.length) {
        return false
    }

    let four = 0
    let three = 0
    let two = 0
    for (let ship in ships) {
        switch (ships[ship].length) {
            case 2:
                two++
                break;
            case 3:
                three++
                break;
            case 4:
                four++
                break;
            default:
                break;
        }
        for (let coord in ships[ship]) {
            if (!validateCoord(ships[ship][coord])) {
                return false
            }
        }
    }

    if (four != 1 || three != 2 || two != 1) {
        return false
    }

    return true
}

app.post("/ships", (req, res) => {
    if (ships) {
        return res.json({ error: "already set ships" })
    }
    if (!validateShips(req.body.ships)) {
        return res.json({ error: "invalid ships" })
    }
    ships = req.body.ships
    for (let ship in ships) {
        for (let coord in ships[ship]) {
            let [x, y] = ships[ship][coord]
            board[y - 1][indexMap[x]] = STATES.SHIP
        }
    }
    res.json({ status: "Ships registered" })
    console.clear()
    console.log(`
    ${renderBoard(board)}
        `)
})

app.get("/status", (req, res) => {
    res.json(board)
})


app.listen(8080)



const renderBoard = (b) => {
    return `
     A   B   C   D   E   F   G   H
     
1    ${b[0][0]}   ${b[0][1]}   ${b[0][2]}   ${b[0][3]}   ${b[0][4]}   ${b[0][5]}   ${b[0][6]}   ${b[0][7]}

2    ${b[1][0]}   ${b[1][1]}   ${b[1][2]}   ${b[1][3]}   ${b[1][4]}   ${b[1][5]}   ${b[1][6]}   ${b[1][7]}

3    ${b[2][0]}   ${b[2][1]}   ${b[2][2]}   ${b[2][3]}   ${b[2][4]}   ${b[2][5]}   ${b[2][6]}   ${b[2][7]}

4    ${b[3][0]}   ${b[3][1]}   ${b[3][2]}   ${b[3][3]}   ${b[3][4]}   ${b[3][5]}   ${b[3][6]}   ${b[3][7]}

5    ${b[4][0]}   ${b[4][1]}   ${b[4][2]}   ${b[4][3]}   ${b[4][4]}   ${b[4][5]}   ${b[4][6]}   ${b[4][7]}

6    ${b[5][0]}   ${b[5][1]}   ${b[5][2]}   ${b[5][3]}   ${b[5][4]}   ${b[5][5]}   ${b[5][6]}   ${b[5][7]}

7    ${b[6][0]}   ${b[6][1]}   ${b[6][2]}   ${b[6][3]}   ${b[6][4]}   ${b[6][5]}   ${b[6][6]}   ${b[6][7]}

8    ${b[7][0]}   ${b[7][1]}   ${b[7][2]}   ${b[7][3]}   ${b[7][4]}   ${b[7][5]}   ${b[7][6]}   ${b[7][7]}
    `
}