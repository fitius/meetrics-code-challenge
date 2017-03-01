/**
 * Created by adovydenko on 3/1/17.
 */
/*
    There should be two things in here
        1) determine ad's position and dimensions alongside with viewport dimensions
        2) test that data against a set of rules determining the result

 */


/*
    Having rules, ad position and viewport sizes check visibilty
 */
function RectHelper(){

}
RectHelper.prototype = {
    /*
        gets the ratio of inner_rect inside outer_rect by area
     */
    getOverlappingRatio: function(inner_rect, outer_rect){
        var intersection = this.getIntersection(inner_rect, outer_rect);
        if (this.isEmpty(intersection)){
            return 0;
        }else{
            // get inner_rect to intersection area ratio
            return (intersection.width*intersection.height)/(inner_rect.width*inner_rect.height);
        }
    },
    /*
        returns rect object originated at (0,0) with provided dimensions
     */
    makeZeroBasedRect: function(height, width){
        return this.makeRect(0, 0, height, width)
    },

    makeRect: function(left, top, height, width){
        return {  left: left,top: top, bottom: top+height, height: height, right: left+width, width: width };
    },

    isEmpty: function(rect){
        return (rect.width === 0 || rect.height === 0);
    },

    /*
        Gets an intersection rect of two rect or an empty rect if there is no intersection
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
    }
};

function DocumentFocusedRule() {
    IAdVisibilityRule.call(this);
}
DocumentFocusedRule.prototype = new IAdVisibilityRule();
DocumentFocusedRule.prototype.checkVisibility = function(id, ruleConfig){
    return {
        visible: document.hasFocus()
    }
};


/*
    Get and sanitize data for advert position and viewport size, using RectHelper to detect visibility
 */
function AdsWarden(){
    /*
        Those are rulse we have to determine is ad visible or not,
        we could easily increase amount of rules by adding them here
     */
    this.rules = {
        'inside_viewport': new InViewportRule(),
        'document_focused': new DocumentFocusedRule()
        };
}

AdsWarden.prototype = {
    /*
        accumulating results of multiple checks
     */
    combineResults: function(currentResult, newResult, rule_name ){
        if (!newResult.visible)
            currentResult.violatedRules.push(rule_name);

        currentResult.visible = currentResult.visible && newResult.visible;

        for (var name in newResult) {
            if (newResult.hasOwnProperty(name) && name !== 'visible') {
                currentResult[name] = newResult[name];
            }
        }
        return currentResult;
    },
    /*
        Getting the rule by its name and executing it against current config and advert id
     */
    checkSingleRule: function(id, ruleConfig, ruleName){
        if(this.rules[ruleName]){
            return this.rules[ruleName].checkVisibility(id, ruleConfig)
        }
    },
    /*
        Checks all the rules provided and accumulate results
        if any rule rendered advert as invisibile return value would have result.visible === false
     */
    getVisibility: function(id, rulesConfig) {

        // if none of rules violated considering ad visible
        var result = {visible: true, violatedRules:[]};
        for (var ruleName in rulesConfig) {
            if (rulesConfig.hasOwnProperty(ruleName)) {
                result = this.combineResults(result, this.checkSingleRule(id, rulesConfig[ruleName], ruleName), ruleName)
            }
        }
        return result;
    }
};