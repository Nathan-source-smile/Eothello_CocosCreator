cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        mainArea: {
            default: null,
            type: cc.Node,
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'

        
    },

    // use this for initialization
    onLoad: function () {
        this.label.string = this.text;
    },

    // called every frame
    update: function (dt) {

    },
});
