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
        gets the ratio of inner_rect inside outer_rect
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

/*
    Get and sanitize data for advert position and viewport size, using RectHelper to detect visibility
 */
function AdsWarden(){
}

AdsWarden.prototype = {

    /*
        checks if advert is 100% visible
     */
    isVisible: function(id, rules) {
        return this.getVisibility(id, rules) === 100.0;
    },

    /*
        returns a float value for visibility percentage
     */
    getVisibility: function(id, rules) {
        var ad = document.getElementById(id);
        var rect_helper = new RectHelper();
        var ad_rect = ad.getBoundingClientRect();
        var viewport_rect = rect_helper.makeZeroBasedRect(window.innerHeight, window.innerWidth);

        var overlapping = rect_helper.getOverlappingRatio(ad_rect, viewport_rect);
        console.log(overlapping*100, ad_rect, viewport_rect);
    }
};