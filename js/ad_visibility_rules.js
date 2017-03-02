/** An Interface for all VisibilityRules */
function IAdVisibilityRule(){

}
IAdVisibilityRule.prototype = {

    /**
     * Evaluate rule result
     * @param {string} id - The id to element to be checked
     * @param {object} [ruleConfig] - Optional custom config for the rule.
     * @returns {object} - {visible: {boolean}, ... }
     */
    checkVisibility: function(id, ruleConfig){
        throw {name : "NotImplemented", message : "Can't call the interface"};
    }
};

/** The rule for cheking that ad is inside viewport */
function InViewportRule() {
    IAdVisibilityRule.call(this);
    this.rectHelper = new RectHelper();
}
InViewportRule.prototype = new IAdVisibilityRule();

/**
 * Checking that element is inside the viewport
 * @param {string} id - The id to element to be checked
 * @param {object} [ruleConfig] - {threshold: {number} } 0.0 to 1.0 howmuch advert should be shown to consider it viweable defaults to 1.0 (100%)
 * @returns {object} - {visible: {boolean}, overlapping: {number} } visible or not and the portion of ad in viewport
 */
InViewportRule.prototype.checkVisibility = function(id, ruleConfig){
    var ad = document.getElementById(id);
    if (ad) {
        var adRect = ad.getBoundingClientRect();
        var viewportRect = this.rectHelper.makeZeroBasedRect(window.innerHeight, window.innerWidth);
        var overlapping = this.rectHelper.getOverlappingRatio(adRect, viewportRect);
        return {
            visible: ruleConfig.threshold ? overlapping >= ruleConfig.threshold : overlapping===1.0,
            overlapping: overlapping
        };
    }else{
        return {visible: false, overlapping: 0.0};
    }
};

/** The rule to check user to be engaged (focus on the page) */
function DocumentFocusedRule() {
    IAdVisibilityRule.call(this);
}
DocumentFocusedRule.prototype = new IAdVisibilityRule();

/**
 * Evaluate rule result
 * @param {string} id - The id to element to be checked
 * @param {object} [ruleConfig] -not used.
 * @returns {object} - {visible: {boolean}}
 */
DocumentFocusedRule.prototype.checkVisibility = function(id, ruleConfig){
    return {
        visible: document.hasFocus()
    };
};

/** The rule to check page is not hidden */
function DocumentNotHiddenRule() {
    IAdVisibilityRule.call(this);
}

/**
 * Evaluate rule result
 * @param {string} id - The id to element to be checked
 * @param {object} [ruleConfig] -not used.
 * @returns {object} - {visible: {boolean}}
 */
DocumentNotHiddenRule.prototype = new IAdVisibilityRule();
DocumentNotHiddenRule.prototype.checkVisibility = function(id, ruleConfig){
    return {
        visible: !document.hidden
    };
};