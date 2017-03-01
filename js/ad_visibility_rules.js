function IAdVisibilityRule(){

}
IAdVisibilityRule.prototype = {
    checkVisibility: function(id, ruleConfig){
        throw {name : "NotImplemented", message : "Can't call the interface"};
    }
};

function InViewportRule() {
    IAdVisibilityRule.call(this);
    this.rectHelper = new RectHelper();
}
InViewportRule.prototype = new IAdVisibilityRule();
InViewportRule.prototype.checkVisibility = function(id, ruleConfig){
    var ad = document.getElementById(id);
    var adRect = ad.getBoundingClientRect();
    var viewportRect = this.rectHelper.makeZeroBasedRect(window.innerHeight, window.innerWidth);

    var overlapping = this.rectHelper.getOverlappingRatio(adRect, viewportRect);
    return {
        visible: ruleConfig.threshold ? overlapping >= ruleConfig.threshold : overlapping===1.0,
        overlapping: overlapping
    };
};

function DocumentFocusedRule() {
    IAdVisibilityRule.call(this);
}
DocumentFocusedRule.prototype = new IAdVisibilityRule();
DocumentFocusedRule.prototype.checkVisibility = function(id, ruleConfig){
    return {
        visible: document.hasFocus()
    };
};

function DocumentNotHiddenRule() {
    IAdVisibilityRule.call(this);
}
DocumentNotHiddenRule.prototype = new IAdVisibilityRule();
DocumentNotHiddenRule.prototype.checkVisibility = function(id, ruleConfig){
    return {
        visible: !document.hidden
    };
};