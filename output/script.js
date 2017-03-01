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
    var adRect = ad.getBoundingClientRect();
    var viewportRect = this.rectHelper.makeZeroBasedRect(window.innerHeight, window.innerWidth);

    var overlapping = this.rectHelper.getOverlappingRatio(adRect, viewportRect);
    return {
        visible: ruleConfig.threshold ? overlapping >= ruleConfig.threshold : overlapping===1.0,
        overlapping: overlapping
    };
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
/*
    There should be two things in here
        1) determine ad's position and dimensions alongside with viewport dimensions
        2) test that data against a set of rules determining the result

 */

/** Holds all the rules and checks them against provided element*/
function AdsWarden(){
    /*
        Those are rulse we have to determine is ad visible or not,
        we could easily increase amount of rules by adding them here
     */
    this.rules = {
        'inside_viewport': new InViewportRule(),
        'document_focused': new DocumentFocusedRule(),
        'document_nothidden': new DocumentNotHiddenRule()
        };
}

AdsWarden.prototype = {

    /**
     * Accumulating results of multiple checks, if any of rules signals that the ad is not viewable it would tracked
     * Any additional info provided by rules will also be stored
     * names of violated rules would be saved
     * @param {object} currentResult - accumulator
     * @param {object} newResult - result to be merged to current one
     * @param {object} ruleName - rule that provided current result
     * @returns {object} - {visible: {boolean}, violatedRules:{array of strings}, ...}
     */
    combineResults: function(currentResult, newResult, ruleName ){
        if (!newResult.visible)
            currentResult.violatedRules.push(ruleName);

        currentResult.visible = currentResult.visible && newResult.visible;

        for (var name in newResult) {
            if (newResult.hasOwnProperty(name) && name !== 'visible') {
                currentResult[name] = newResult[name];
            }
        }
        return currentResult;
    },

    /**
     * Getting the rule by its name and executing it against current config and advert id
     * @param {string} id - id of advert element
     * @param {object} ruleConfig - rule specific config object
     * @param {object} ruleName -
     * @returns {object} - {visible: {boolean}, ...}
     */
    checkSingleRule: function(id, ruleConfig, ruleName){
        if(ruleName in this.rules){
            return this.rules[ruleName].checkVisibility(id, ruleConfig);
        }
    },

    /**
     * Checks all the rules provided and accumulate results
     * if any rule rendered advert as invisibile return value would have result.visible === false
     * @param {string} id - id of advert element
     * @param {object} rulesConfig - name-to-config hashmap
     * @returns {object} - {visible: {boolean}, ...}
     */
    getVisibility: function(id, rulesConfig) {

        // if none of rules violated considering ad visible
        var result = {visible: true, violatedRules:[]};
        for (var ruleName in rulesConfig) {
            if (rulesConfig.hasOwnProperty(ruleName)) {
                result = this.combineResults(result, this.checkSingleRule(id, rulesConfig[ruleName], ruleName), ruleName);
            }
        }
        return result;
    },

    /**
     * monitor clicks on ads
     * @param {string} id - id of advert element
     */
    monitorClicksOn: function(id) {
        var ad = document.getElementById(id);
            if (ad) {
            ad.addEventListener('click',function(){
                console.log('Clicked!');
            });
        }
    }
};
/** Helper class to do with rectangles, create, exemine and intersect them */
function RectHelper(){

}
RectHelper.prototype = {

    /**
     * gets the ratio of inner_rect inside outer_rect by area
     * @param {rect} innerRect - Smaller rect to check
     * @param {rect} outerRect -Larger rect to check
     * @returns {number} - 0.0 - 1.0 portion of innerRect inside of outerRect
     */
    getOverlappingRatio: function(innerRect, outerRect){
        var intersection = this.getIntersection(innerRect, outerRect);
        if (this.isEmpty(intersection)){
            return 0;
        }else{
            // get inner_rect to intersection area ratio
            return (intersection.width*intersection.height)/(innerRect.width*innerRect.height);
        }
    },

    /**
     * returns rect object originated at (0,0) with provided dimensions
     * @param {number} height
     * @param {number} width
     * @returns {rect}
     */
    makeZeroBasedRect: function(height, width){
        return this.makeRect(0, 0, height, width);
    },

    /**
     * returns rect object with desired location and size
     * @param {number} left
     * @param {number} top
     * @param {number} height
     * @param {number} width
     * @returns {rect}
     */
    makeRect: function(left, top, height, width){
        return {  left: left,top: top, bottom: top+height, height: height, right: left+width, width: width };
    },

    /**
     * Checks rect to be empty
     * @param {number} rect
     * @returns {boolean}
     */
    isEmpty: function(rect){
        return (rect.width === 0 || rect.height === 0);
    },

    /**
     * Gets an intersection of two rects or an empty rect if there is no intersection
     * @param {rect} first
     * @param {rect} second
     * @returns {rect} - either empty rect ot intersection of those two
     */
    getIntersection: function (first ,second) {
        if (this.isEmpty(first) || this.isEmpty(second))
            return this.makeZeroBasedRect(0, 0);

        var x1 = Math.max(first.left, second.left);
        var x2 = Math.min(first.right, second.right);
        var y1 = Math.max(first.top, second.top);
        var y2 = Math.min(first.bottom, second.bottom);

        var intersection = this.makeRect(x1, y1, Math.max(0, x2 - x1), Math.max(0, y2 - y1));

        // implicitly return all-zero rect on empty intersection
        if (this.isEmpty(intersection))
            intersection = this.makeZeroBasedRect(0,0);

        return intersection;
    }
};

/************************************************************************************************
 *                                                                                              *
 *                              VARIABLES DECLARATION                                           *
 *                                                                                              *
 ************************************************************************************************/
/*
    Setting up the Warden object to keep an eye on our advert
 */
var warden = new AdsWarden();
var warden_config = {
    'inside_viewport':{threshold: 1.0}, // using threshold 1.0 - we want 100% of advert to be visible
    'document_focused':{},
    'document_nothidden':{}
};
warden.monitorClicksOn('ad');

/*
    Helper function for pretty descriptive string
 */
function getDescriptiveString(result) {
    var str = result.visible ? 'The ad is viewable ' : 'The ad is NOT viewable ';
    if(result.violatedRules.length > 0)
        str += 'Violated rules are: ' + result.violatedRules.join(',');
    if(result.overlapping)
        str += ' '+(result.overlapping*100).toFixed(2)+ '% of advert is visible';
    return str;
}

/**
 * Logs the viewability values in the console
 *
 * @override
 */
window.log = function () {
    var result = warden.getVisibility('ad', warden_config);
    console.log(getDescriptiveString(result));
};

/************************************************************************************************
 *                                                                                              *
 *                              YOUR IMPLEMENTATION                                             *
 *                                                                                              *
 ************************************************************************************************/
