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