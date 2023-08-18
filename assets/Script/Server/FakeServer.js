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

var boad = new Array();							// board layout
var boad_bp = new Array();						// board layout for undo
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

    // boad: new Array(),
    // boad_bp: new Array(),
    // blackStoneNum: 0,
    // whiteStoneNum: 0,
    initHandlers() {
        ServerCommService.addRequestHandler(
            MESSAGE_TYPE.CS_PUT_STONE,
            this.clickMouse.bind(this)
        );
    },
    init() {
        // // Get the id of the destination canvas
        // canvas = document.getElementById('canvas');
        // if (!canvas || !canvas.getContext) { return false; }

        // // get the context
        // ctx = canvas.getContext('2d');

        // // get canvas size
        // canvas.width = canvasSize + numSize;
        // canvas.height = canvasSize + numSize;

        // // Mouse behavior settings
        // canvas.onmousemove = function (event) {
        //     if (gameEndFlag == 0) {
        //         moveMouse(event);
        //         draw(ctx, canvas);
        //     }
        // }
        // canvas.onclick = function () {
        //     if (gameEndFlag == 0) {
        //         putStone();
        //         draw(ctx, canvas);
        //     } else {
        //         init();
        //     }
        // }

        // undo
        // document.getElementById('undo').onclick = function () {
        //     if (boad_bp.length > 0) {
        //         // ボードの復元
        //         boad = boad_bp.copy();
        //         boad_bp = new Array();

        //         // ターンの復元
        //         turn = turn_bp;
        //         turn_bp = 1;
        //     }
        // }

        // sequence initialization
        turn = 1;

        // game start
        gameEndFlag = 0;

        // Board initialization
        for (var i = 0; i < 8; i++) {
            boad[i] = new Array();

            for (var j = 0; j < 8; j++) { boad[i][j] = 0; }
        }
        boad[3][3] = boad[4][4] = 1;
        boad[3][4] = boad[4][3] = -1;

        // initial drawing
        ServerCommService.send(
            MESSAGE_TYPE.SC_DRAW_BOARD,
            {
                board: boad,
            },
            turn
        );
    },
    gameOver() {
        // finish the game
        gameEndFlag = 1;

        // Calculation of stone number
        blackStoneNum = 0;
        whiteStoneNum = 0;
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (boad[x][y] == 1) { blackStoneNum++; }
                else if (boad[x][y] == -1) { whiteStoneNum++; }
            }
        }
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
        if (boad[x][y] == 0) {
            return 0;

            // when you have your own stone
        } else if (boad[x][y] == turn) {
            return 3;

            // When there is an opponent's stone
        } else {
            // Finally, if you have your own stone, turn it over.
            if (this.turnStone(x, y, i, j, mode) >= 2) {
                if (mode != 0) { boad[x][y] = turn; }
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
        if (boad[mouseBlockX][mouseBlockY] != 0) { return; }

        // save data for undo
        boad_bp = boad.copy();
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
        boad[mouseBlockX][mouseBlockY] = turn;

        // change the order
        turn *= -1;

        // check the places that you can put stone

        //---------- Check if you can put ----------
        turnCheck = 0;
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (boad[x][y] == 0) {
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
                    if (boad[x][y] == 0) {
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
                gameOver();
                return;
            }
        }
        //----------Check if you can put----------

        // end of game
        var gameCheck = 0;
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                if (boad[x][y] == 0) {
                    gameCheck = 1;
                    break;
                }
            }
            if (gameCheck != 0) { break; }
        }
        if (gameCheck == 0) {
            gameOver();
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
        if (gameEndFlag == 0) {
            this.putStone();
            ServerCommService.send(
                MESSAGE_TYPE.SC_DRAW_BOARD,
                {
                    board: boad,
                    turn: turn,
                },
                turn
            );
        } else {
            this.init();
        }
    },
    //----------------------------------------
    // all drawings
    //----------------------------------------
    draw(ctx, canvas) {
        // Get mouse position
        var mouseBlockXr = mouseBlockX * blockSize + numSize;
        var mouseBlockYr = mouseBlockY * blockSize + numSize;

        // Delete drawing
        ctx.clearRect(0, 0, canvasSize + numSize, canvasSize + numSize);

        // Drawing borders
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#000000';
        for (var i = 0; i <= 7; i++) {
            ctx.moveTo(~~(i * blockSize) + numSize + 0.5, 0.5);
            ctx.lineTo(~~(i * blockSize) + numSize + 0.5, canvasSize + numSize + 0.5);

            ctx.moveTo(0.5, ~~(i * blockSize) + numSize + 0.5);
            ctx.lineTo(canvasSize + numSize + 0.5, ~~(i * blockSize) + numSize + 0.5);
        }
        ctx.stroke();

        // stone display
        canvas.style.cursor = 'default';
        for (var x = 0; x < 8; x++) {
            for (var y = 0; y < 8; y++) {
                // where the stone is
                if (boad[x][y] == 1 || boad[x][y] == -1) {
                    ctx.beginPath();
                    if (boad[x][y] == 1) { ctx.fillStyle = '#000000'; }
                    else if (boad[x][y] == -1) { ctx.fillStyle = '#ffffff'; }
                    ctx.strokeStyle = '#000000';
                    ctx.arc(x * blockSize + ~~(blockSize * 0.5) + numSize + 0.5, y * blockSize + ~~(blockSize * 0.5) + numSize + 0.5, blockSize / 2 * 0.8, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.stroke();

                    // A place without stones (check if it can be placed)
                } else if (boad[x][y] == 0) {
                    var turnCheck = 0;
                    for (var i = -1; i <= 1; i++) {
                        for (var j = -1; j <= 1; j++) {
                            if (turnStone(x, y, i, j, 0) == 2) {
                                // Density adjustment
                                var alpha = 0;
                                if (x == mouseBlockX && y == mouseBlockY) {
                                    canvas.style.cursor = 'pointer';
                                    alpha = 0.5;
                                } else {
                                    alpha = 0.2;
                                }

                                // stone display
                                ctx.beginPath();
                                ctx.globalAlpha = alpha;
                                if (turn == 1) { ctx.fillStyle = '#000000'; }
                                else if (turn == -1) { ctx.fillStyle = '#ffffff'; }
                                ctx.strokeStyle = '#000000';
                                ctx.arc(x * blockSize + numSize + ~~(blockSize * 0.5) + 0.5, y * blockSize + numSize + ~~(blockSize * 0.5) + 0.5, blockSize / 2 * 0.8, 0, 2 * Math.PI, false);
                                ctx.fill();
                                ctx.stroke();
                                ctx.globalAlpha = 1;

                                turnCheck = 1;
                                break;
                            }
                        }
                        if (turnCheck != 0) { break; }
                    }
                }
            }
        }

        // Set the color of the side of the board
        ctx.beginPath();
        ctx.fillStyle = '#000000';
        ctx.rect(0, 0, canvasSize + numSize, numSize);
        ctx.rect(0, 0, numSize, canvasSize + numSize);
        ctx.fill();

        // Character display on the side of the board
        var boadWordVer = new Array('a', 'b', 'c', 'd', 'e', 'f', 'g', 'h');
        var boadWordHor = new Array('1', '2', '3', '4', '5', '6', '7', '8');
        for (var i = 0; i < 8; i++) {
            // character display
            ctx.beginPath();
            ctx.font = numSize + "px 'ＭＳ Ｐゴシック', 'Osaka'";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillStyle = '#ffffff';
            ctx.fillText(boadWordVer[i], (i + 0.5) * blockSize + numSize + 0.5, numSize * 0.5);
            ctx.fillText(boadWordHor[i], numSize * 0.5, (i + 0.5) * blockSize + numSize + 0.5);
        }

        // Show exit message
        if (gameEndFlag != 0) {
            // Obi display
            ctx.beginPath();
            ctx.fillStyle = '#eeeeee';
            ctx.globalAlpha = 0.7;
            ctx.rect(0, (canvasSize + numSize - msgSize) / 2, canvasSize + numSize, msgSize);
            ctx.fill();

            // character display
            ctx.globalAlpha = 0.9;
            ctx.fillStyle = '#000000';
            ctx.font = msgSize + "px 'ＭＳ Ｐゴシック', 'Osaka'";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            ctx.fillText('B:' + blackStoneNum + ' vs W:' + whiteStoneNum, (canvasSize + numSize) / 2, (canvasSize + numSize) / 2);
        }
    },
};

FakeServer.initHandlers();
setTimeout(() => {
    FakeServer.init();
}, 2000);