import { MESSAGE_TYPE, ROUNDS } from "../Common/Messages";
import { ClientCommService } from "../Common/CommServices";
import { TIME_LIMIT, COINS_LIMIT, ALARM_LIMIT } from "../Common/Constants";


export const ServerCommService = {
    callbackMap: {},
    init() {
        this.callbackMap = {};
    },
    addRequestHandler(messageType, callback) {
        this.callbackMap[messageType] = callback;
    },
    send(messageType, data, users) {
        // TODO: Make fake code here to send message to client side
        // Added timeout bc there are times that UI are not updated properly if we send next message immediately
        // If we move to backend, we can remove this timeout
        setTimeout(() => {
            ClientCommService.onExtensionResponse({
                cmd: messageType,
                params: data,
                users: users,
            });
        }, 100);
    },
    onReceiveMessage(messageType, data, room) {
        const callback = this.callbackMap[messageType];
        console.log("S - onReceiveMessage", messageType, data, room);
        if (callback) {
            callback(data, room);
        }
    },
};
ServerCommService.init();

/**
 * black: 1
 * white: -1
 */

//--------Defining global variables----------
var mouseX = 0;									// horizontal mouse coordinate
var mouseY = 0;									// vertical mouse coordinate
var mouseBlockX = ~~(mouseX / blockSize);		// horizontal coordinate of the mouse on the grid
var mouseBlockY = ~~(mouseY / blockSize);		// vertical coordinate of the mouse on the grid

var blockSize = 50;								// 1 cell size
var canvasSize = blockSize * 8;					// board size
var numSize = 25;								// Number width on the side of the board
var msgSize = 90;								// message size

var gameEndFlag = 0;							// game progress flag
var turn = 1;									// turn
var turn_bp = 1;								// turn for undo

var board = new Array();							// board layout
var board_bp = new Array();						// board layout for undo
var blackStoneNum = 0;							// number of black stones
var whiteStoneNum = 0;							// number of white stones
//--------Defining global variables----------

//----------------------------------------
// array copy method
//----------------------------------------
Array.prototype.copy = function () {
    var obj = new Array();

    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i].length > 0 && this[i].copy()) { obj[i] = this[i].copy(); }
        else { obj[i] = this[i]; }
    }

    return obj;
}

export const FakeServer = {
    // mouseX: 0,
    // mouseY: 0,
    // mouseBlockX: -1,
    // mouseBlockY: -1,

    // blockSize: 60,
    // canvasSize: 0,
    // numSize: 25,
    // msgSize: 90,

    // gameEndFlag: 0,
    // turn: 1,
    // turn_bp: 1,

    // board: new Array(),
    // board_bp: new Array(),
    // blackStoneNum: 0,
    // whiteStoneNum: 0,
    initHandlers() {
        ServerCommService.addRequestHandler(
            MESSAGE_TYPE.CS_PUT_STONE,
            this.clickMouse.bind(this)
        );
    },
    init() {

        // sequence initialization
        turn = 1;

        // game start
        gameEndFlag = 0;

        // Board initialization
        for (var i = 0; i < 8; i++) {
            board[i] = new Array();

            for (var j = 0; j < 8; j++) { board[i][j] = 0; }
        }
        board[3][3] = board[4][4] = 1;
        board[3][4] = board[4][3] = -1;

        // initial drawing
        ServerCommService.send(
            MESSAGE_TYPE.SC_DRAW_BOARD,
            {
                board: board,
                turn: turn,
            },
            turn
        );
        this.calcScore();
    },
    gameOver() {
        // finish the game
        gameEndFlag = 1;
    },
    // Calculation of stone number
    calcScore() {
        blackStoneNum = 0;
        whiteStoneNum = 0;
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (board[x][y] == 1) { blackStoneNum++; }
                else if (board[x][y] == -1) { whiteStoneNum++; }
            }
        }
        ServerCommService.send(
            MESSAGE_TYPE.SC_POINTS,
            {
                blackStoneNum,
                whiteStoneNum,
            },
            [0, 1],
        );
    },
    //----------------------------------------
    // return the stone
    //----------------------------------------
    turnStone(x, y, i, j, mode) {
        if (i == 0 && j == 0) { return 0; }

        x += i;
        y += j;

        // Exception handling
        if (x < 0 || x > 7 || y < 0 || y > 7) { return 0; }

        // when nothing
        if (board[x][y] == 0) {
            return 0;

            // when you have your own stone
        } else if (board[x][y] == turn) {
            return 3;

            // When there is an opponent's stone
        } else {
            // Finally, if you have your own stone, turn it over.
            if (this.turnStone(x, y, i, j, mode) >= 2) {
                if (mode != 0) { board[x][y] = turn; }
                return 2;
            }

            return 1;
        }
    },
    //----------------------------------------
    // put a stone
    //----------------------------------------
    putStone() {
        // confirmation
        if (board[mouseBlockX][mouseBlockY] != 0) { return; }

        // save data for undo
        board_bp = board.copy();
        turn_bp = turn;

        // return the stone
        var turnCheck = 0;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (this.turnStone(mouseBlockX, mouseBlockY, i, j, 1) == 2) { turnCheck = 1; }
            }
        }
        // Check whether stones can be placed
        if (turnCheck == 0) { return; }

        // put a stone
        board[mouseBlockX][mouseBlockY] = turn;

        // Calculation of stone number
        this.calcScore();

        // change the order
        turn *= -1;

        // check the places that you can put stone

        //---------- Check if you can put ----------
        turnCheck = 0;
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (board[x][y] == 0) {
                    for (var i = -1; i <= 1; i++) {
                        for (var j = -1; j <= 1; j++) {
                            if (this.turnStone(x, y, i, j, 0) == 2) {
                                turnCheck = 1;
                                break;
                            }
                        }
                        if (turnCheck != 0) { break; }
                    }
                    if (turnCheck != 0) { break; }
                }
            }
            if (turnCheck != 0) { break; }
        }

        // If you can't place them, keep them in order
        if (turnCheck == 0) {
            turn *= -1;

            // Check if you can put
            var turnCheck = 0;
            for (var x = 0; x < 8; x++) {
                for (var y = 0; y < 8; y++) {
                    if (board[x][y] == 0) {
                        for (var i = -1; i <= 1; i++) {
                            for (var j = -1; j <= 1; j++) {
                                if (this.turnStone(x, y, i, j, 0) == 2) {
                                    turnCheck = 1;
                                    break;
                                }
                            }
                            if (turnCheck != 0) { break; }
                        }
                        if (turnCheck != 0) { break; }
                    }
                }
                if (turnCheck != 0) { break; }
            }

            // end judgment
            if (turnCheck == 0) {
                this.gameOver();
                return;
            }
        }
        //----------Check if you can put----------

        // end of game
        var gameCheck = 0;
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (board[x][y] == 0) {
                    gameCheck = 1;
                    break;
                }
            }
            if (gameCheck != 0) { break; }
        }
        if (gameCheck == 0) {
            this.gameOver();
            return;
        }
    },
    //----------------------------------------
    // mouse movement
    //----------------------------------------
    moveMouse(event) {
        // Get mouse coordinates
        if (event) {
            mouseX = event.pageX - canvas.offsetLeft;
            mouseY = event.pageY - canvas.offsetTop;
        } else {
            mouseX = event.offsetX;
            mouseY = event.offsetY;
        }

        // real coordinates
        mouseX = ~~(mouseX / canvas.offsetWidth * (canvasSize + numSize));
        mouseY = ~~(mouseY / canvas.offsetHeight * (canvasSize + numSize));

        // mass coordinates
        mouseBlockX = ~~((mouseX - numSize - 0.5) / blockSize);
        mouseBlockY = ~~((mouseY - numSize - 0.5) / blockSize);
    },
    //----------------------------------------
    // mouse click
    //----------------------------------------
    clickMouse(params, room) {
        mouseBlockX = params.x;
        mouseBlockY = params.y;
        if (turn !== params.turn) {
            return;
        }
        if (gameEndFlag == 0) {
            this.putStone();
            ServerCommService.send(
                MESSAGE_TYPE.SC_DRAW_BOARD,
                {
                    board: board,
                    turn: turn,
                },
                turn
            );
        } else {
            this.init();
        }
    },
};

FakeServer.initHandlers();
setTimeout(() => {
    FakeServer.init();
}, 2000);