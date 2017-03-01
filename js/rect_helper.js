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
