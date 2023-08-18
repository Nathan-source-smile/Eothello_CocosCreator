cc.Class({
    extends: cc.Component,

    properties: {
        whiteStonePrefab: cc.Prefab,

        _whiteStones: [],
        // Add properties here if needed
    },

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    },

    onTouchStart(event) {
        // Get the position of the click event
        let touchPos = event.getLocation();
        const white = cc.instantiate(this.whiteStonePrefab);
        this.node.addChild(white);
        // debugger;
        touchPos = this.node.convertToNodeSpaceAR(touchPos);
        white.setPosition(touchPos);
        // const cardComponent = cardNode.getComponent("Card");
        // cardComponent.setCardIndex(cardNumber);
        // cardComponent.setFront(this._isMine);
        this._whiteStones.push(white);

        // This function will be called when the node is clicked
        // Implement your logic here
    },
});