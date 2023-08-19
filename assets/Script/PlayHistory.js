import { ClientCommService } from "./Common/CommServices";

cc.Class({
    extends: cc.Component,
    properties: {
        first: cc.Button,
        previous: cc.Button,
        next: cc.Button,
        last: cc.Button,

        _step: -1,
        _temp: -1,
    },
    onLoad() {

    },
    onFirstClicked() {
        this._temp = 0
        ClientCommService.sendClaimHistory(this._temp);
    },
    onPreviousClicked() {
        if (this._temp > 0) {
            ClientCommService.sendClaimHistory(--this._temp);
        }
    },
    onNextlicked() {
        if (this._temp < this._step) {
            ClientCommService.sendClaimHistory(++this._temp);
        }
    },
    onLastClicked() {
        if (this._temp === this._step)
            return;
        this._temp = this._step;
        ClientCommService.sendClaimHistory(this._temp);
    },

})