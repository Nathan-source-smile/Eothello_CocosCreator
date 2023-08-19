import MainArea from './MainArea';
import EndContainer from './EndContainer';
import PlayHistory from './PlayHistory';

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
            type: EndContainer,
        },
        playHistory: {
            default: null,
            type: PlayHistory,
        },

        // user can be -1(white) or 1(black)
        _currentUser: 0,
    },

    // use this for initialization
    onLoad: function () {
        GameScene = this;
        this.endModal.node.active = false;
        this.playHistory._step = -1;
        this.playHistory._temp = -1;
    },

    // draw mainboard
    drawBoard: function (board, turn) {
        if (this._currentUser !== turn) {
            this.playHistory._step += 1;
        }
        this._currentUser = turn;
        this.playHistory._temp = this.playHistory._step;
        this.mainArea.draw(board, turn);
    },

    drawHistoryBoard: function (board, turn, x, y, blackStoneNum, whiteStoneNum, step) {
        this.setScore(blackStoneNum, whiteStoneNum);
        if (step === this.playHistory._step) {
            this.drawBoard(board, -turn);
        } else {
            this.mainArea.drawHistory(board, turn, x, y);
        }
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
