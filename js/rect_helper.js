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
