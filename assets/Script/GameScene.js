import MainArea from './MainArea';
import EndContainer from './EndContainer';

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
        endModal: {
            default: null,
            type:EndContainer,
        }
    },

    // use this for initialization
    onLoad: function () {
        GameScene = this;
        this.endModal.node.active = false;
    },

    // draw mainboard
    drawBoard: function (board, turn) {
        this.mainArea.draw(board, turn);
    },

    setScore: function (blackStoneNum, whiteStoneNum) {
        this.blackScore.string = blackStoneNum;
        this.whiteScore.string = whiteStoneNum;
    },

    // show end modal
    showEndModal: function (blackScore, whiteScore) {
        this.endModal.setText(blackScore, whiteScore);
        this.endModal.node.active = true;
    },

    // called every frame
    update: function (dt) {

    },
});
