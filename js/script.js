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
    'inside_viewport':{threshold: 1.0},
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
