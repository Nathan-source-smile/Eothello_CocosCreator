import MainArea from './MainArea';
import EndContainer from './EndContainer';
import PlayHistory from './PlayHistory';
import GlobalData from './Common/GlobalData';
import { loadImgAtlas } from './AssetLoader';
import { FakeServer } from './Common/CommServices';

export let GameScene;
cc.Class({
    extends: cc.Component,

    properties: {
        backSprite: cc.Sprite,
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
        // endModal: {
        //     default: null,
        //     type: EndContainer,
        // },
        playHistory: {
            default: null,
            type: PlayHistory,
        },
        winNotify: cc.Node,
        loseNotify: cc.Node,
        drawNotify: cc.Node,
        


        // user can be -1(white) or 1(black)
        _currentUser: 0,
    },

    // use this for initialization
    onLoad: function () {
        GameScene = this;
        loadImgAtlas()
            .then(() => {
                this.start1();
                FakeServer.initHandlers();
                // setTimeout(() => {
                FakeServer.init();
                // }, 3000);
            })
            .catch((error) => {
                console.log("Error loading card atlas:", error);
            });
    },

    // start game
    start1: function () {
        this.winNotify.active = false;
        this.loseNotify.active = false;
        this.drawNotify.active = false;
        this.playHistory._step = -1;
        this.playHistory._temp = -1;
        this._currentUser = 0;
    },

    // draw mainboard
    drawBoard: function (board, turn, availAreas) {
        if (this._currentUser !== turn) {
            this.playHistory._step += 1;
            this._currentUser = turn;
        }
        this.playHistory._temp = this.playHistory._step;
        this.mainArea.draw(board, turn, availAreas);
    },

    drawHistoryBoard: function (board, turn, x, y, blackStoneNum, whiteStoneNum, step, availAreas) {
        this.setScore(blackStoneNum, whiteStoneNum);
        if (step === this.playHistory._step) {
            if (step === 0) {
                // this.mainArea._click = true;
                this.drawBoard(board, turn, availAreas);
            } else {
                this.mainArea._click = true;
                this.drawBoard(board, -turn, availAreas);
            }
        } else {
            this.mainArea.drawHistory(board, turn, x, y);
        }
    },

    setScore: function (blackStoneNum, whiteStoneNum) {
        this.blackScore.string = blackStoneNum;
        this.whiteScore.string = whiteStoneNum;
    },

    // show end modal
    // showEndModal: function (blackScore, whiteScore) {
    //     this.endModal.setText(blackScore, whiteScore);
    //     this.endModal.node.active = true;
    // },

    
    // who r winner or loser
    setText(whiteScore, blackScore) {
        if (whiteScore > blackScore ) {
            this.winNotify.active = true
        } else if ( blackScore > whiteScore ) {
            this.loseNotify.active = true
        } else {
            this.drawNotify.active = true
        }
    },

    
    // called every frame
    update: function (dt) {

    },
});