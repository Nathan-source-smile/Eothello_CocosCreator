import MainArea from './MainArea';

export let GameScene;
cc.Class({
    extends: cc.Component,

    properties: {
        mainArea: {
            default: null,
            type: MainArea,
        },
        blackScore: {
            default: null,
            type: cc.Label,
        },
        whiteScore: {
            default: null,
            type: cc.Label,
        },
    },

    // use this for initialization
    onLoad: function () {
        GameScene = this;
    },

    // draw mainboard
    drawBoard: function (board, turn) {
        this.mainArea.draw(board, turn);
    },

    setScore: function (blackStoneNum, whiteStoneNum) {
        this.blackScore.string = blackStoneNum;
        this.whiteScore.string = whiteStoneNum;
    },

    // called every frame
    update: function (dt) {

    },
});
