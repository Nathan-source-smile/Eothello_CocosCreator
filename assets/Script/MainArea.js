import { BLOCKSIZE } from "./Common/Constants";

cc.Class({
    extends: cc.Component,

    properties: {
        whiteStonePrefab: cc.Prefab,
        blackStonePrefab: cc.Prefab,

        _whiteStones: [],
        _blackStones: [],
        _x: 0,
        _y: 0,
        _flag: true,
        _board: new Array(),
    },

    onLoad() {
        // Board initialization
        for (let i = 0; i < 8; i++) {
            this._board[i] = new Array();
            for (let j = 0; j < 8; j++) {
                this._board[i][j] = 0;
            }
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    draw(board) {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let position = cc.v2(x * 50 + 25, -(y * 50 + 25));
                // where the stone is
                if (board[x][y] == 1 || board[x][y] == -1) {
                    if (board[x][y] == 1) {
                        const white = cc.instantiate(this.whiteStonePrefab);
                        this.node.addChild(white);
                        white.setPosition(position);
                    }
                    else if (board[x][y] == -1) {
                        const black = cc.instantiate(this.blackStonePrefab);
                        this.node.addChild(black);
                        black.setPosition(position);
                    }

                    // A place without stones (check if it can be placed)
                } 
                // else if (board[x][y] == 0) {
                //     var turnCheck = 0;
                //     for (var i = -1; i <= 1; i++) {
                //         for (var j = -1; j <= 1; j++) {
                //             if (turnStone(x, y, i, j, 0) == 2) {
                //                 // Density adjustment
                //                 var alpha = 0;
                //                 if (x == mouseBlockX && y == mouseBlockY) {
                //                     canvas.style.cursor = 'pointer';
                //                     alpha = 0.5;
                //                 } else {
                //                     alpha = 0.2;
                //                 }

                //                 // stone display
                //                 ctx.beginPath();
                //                 ctx.globalAlpha = alpha;
                //                 if (turn == 1) { ctx.fillStyle = '#000000'; }
                //                 else if (turn == -1) { ctx.fillStyle = '#ffffff'; }
                //                 ctx.strokeStyle = '#000000';
                //                 ctx.arc(x * blockSize + numSize + ~~(blockSize * 0.5) + 0.5, y * blockSize + numSize + ~~(blockSize * 0.5) + 0.5, blockSize / 2 * 0.8, 0, 2 * Math.PI, false);
                //                 ctx.fill();
                //                 ctx.stroke();
                //                 ctx.globalAlpha = 1;

                //                 turnCheck = 1;
                //                 break;
                //             }
                //         }
                //         if (turnCheck != 0) { break; }
                //     }
                // }
            }
        }
    },

    onTouchStart(event) {

        // Get the position of the click event
        // let touchPos = event.getLocation();
        // touchPos = this.node.convertToNodeSpaceAR(touchPos);
        // this._x = Math.floor(touchPos.x / BLOCKSIZE);
        // this._y = Math.floor(Math.abs(touchPos.y / BLOCKSIZE));
        // let position = cc.v2(this._x * 50 + 25, -(this._y * 50 + 25));
        // if (this._board[this._x][this._y] === 0) {
        //     if (this._flag === true) {
        //         this._flag = false;
        //         const white = cc.instantiate(this.whiteStonePrefab);
        //         this.node.addChild(white);
        //         white.setPosition(position);
        //         this._whiteStones.push(white);
        //         this._board[this._x][this._y] = 1;
        //     } else {
        //         this._flag = true;
        //         const black = cc.instantiate(this.blackStonePrefab);
        //         this.node.addChild(black);
        //         black.setPosition(position);
        //         this._blackStones.push(black);
        //         this._board[this._x][this._y] = -1;
        //     }
        // }
    },
});