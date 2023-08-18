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

    onTouchStart(event) {

        // Get the position of the click event
        let touchPos = event.getLocation();
        touchPos = this.node.convertToNodeSpaceAR(touchPos);
        this._x = Math.floor(touchPos.x / BLOCKSIZE);
        this._y = Math.floor(Math.abs(touchPos.y / BLOCKSIZE));
        let position = cc.v2(this._x * 50 + 25, -(this._y * 50 + 25));
        if (this._board[this._x][this._y] === 0) {
            if (this._flag === true) {
                this._flag = false;
                const white = cc.instantiate(this.whiteStonePrefab);
                this.node.addChild(white);
                white.setPosition(position);
                this._whiteStones.push(white);
                this._board[this._x][this._y] = 1;
            } else {
                this._flag = true;
                const black = cc.instantiate(this.blackStonePrefab);
                this.node.addChild(black);
                black.setPosition(position);
                this._blackStones.push(black);
                this._board[this._x][this._y] = -1;
            }
        }
    },
});