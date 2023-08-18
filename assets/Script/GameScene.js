import MainArea from './MainArea';

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        mainArea: {
            default: null,
            type: MainArea,
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'


    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
    },

    // draw mainboard
    drawBoard: function(board) {
        this.mainArea.draw(board);
    },

    // called every frame
    update: function (dt) {

    },
});
