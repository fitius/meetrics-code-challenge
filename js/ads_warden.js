/*
    There should be two things in here
        1) determine ad's position and dimensions alongside with viewport dimensions
        2) test that data against a set of rules determining the result

 */

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
        'document_focused': new DocumentFocusedRule(),
        'document_nothidden': new DocumentNotHiddenRule()
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
        if(ruleName in this.rules){
            return this.rules[ruleName].checkVisibility(id, ruleConfig);
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
                result = this.combineResults(result, this.checkSingleRule(id, rulesConfig[ruleName], ruleName), ruleName);
            }
        }
        return result;
    },

    /*
        monitor clicks on ads
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