/**
 * Created by adovydenko on 3/1/17.
 */
var assert = require('assert');
var rewire = require('rewire');

var ads_warden = rewire('./ads_warden');

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal(-1, [1,2,3].indexOf(4));
        });
    });
});


describe('RectHelper()', function() {
    var RectHelper = ads_warden.__get__('RectHelper');

    it('should be able to create object', function() {
        assert(typeof new RectHelper() === 'object');
    });

    describe('makeZeroBasedRect()', function() {
        it('zero based rect should start at (0,0)', function() {
            var helper = new RectHelper();
            var rect = helper.makeZeroBasedRect(100, 200);
            assert(rect.top === 0);
            assert(rect.left === 0);
            assert(rect.bottom === 100);
            assert(rect.right === 200);
            assert(rect.height === 100);
            assert(rect.width === 200);

        });
    });

    describe('makeRect()', function() {
        it('creating rect at (100,200) with sizes (300,400)', function() {
            var helper = new RectHelper();
            var rect = helper.makeRect(100,200,300,400);
            assert(rect.left === 100);
            assert(rect.top === 200);
            assert(rect.bottom === 500);
            assert(rect.height === 300);
            assert(rect.right === 500);
            assert(rect.width === 400);

        });
    });

    describe('isEmpty()', function() {
        it('checking for (0,0,0,0) to be empty', function() {
            var helper = new RectHelper();
            var rect = helper.makeRect(0,0,0,0);
            assert(helper.isEmpty(rect) === true);
        });
    });

    describe('getIntersection()', function() {
        it('no intersection', function() {
            var helper = new RectHelper();
            var rectA = helper.makeRect(0,0,100,100),
                rectB = helper.makeRect(100,100,100,100);

            var intersection = helper.getIntersection(rectA, rectB);
            assert(helper.isEmpty(intersection));
        });
    });

    describe('getIntersection()', function() {
        it('fully inside', function() {
            var helper = new RectHelper();
            var rectA = helper.makeRect(50,50,100,100),
                rectB = helper.makeRect(0,0,200,200);

            var rect = helper.getIntersection(rectA, rectB);
            assert(rect.left === 50);
            assert(rect.top === 50);
            assert(rect.bottom === 150);
            assert(rect.height === 100);
            assert(rect.right === 150);
            assert(rect.width === 100);
        });
    });

    describe('getIntersection()', function() {
        it('half-in/half-out ', function() {
            var helper = new RectHelper();
            var rectA = helper.makeRect(50,50,300,300),
                rectB = helper.makeRect(0,0,200,200);

            var rect = helper.getIntersection(rectA, rectB);
            assert(rect.left === 50);
            assert(rect.top === 50);
            assert(rect.bottom === 200);
            assert(rect.height === 150);
            assert(rect.right === 200);
            assert(rect.width === 150);
        });
    });

    describe('getOverlappingRatio()', function() {
        it('on itself ', function() {
            var helper = new RectHelper();
            var rectA = helper.makeRect(0,0,200,200),
                rectB = helper.makeRect(0,0,200,200);

            var ratio = helper.getOverlappingRatio(rectA, rectB);
            assert(ratio === 1.0)
        });
    });

    describe('getOverlappingRatio()', function() {
        it('one half ', function() {
            var helper = new RectHelper();
            var rectA = helper.makeRect(0,0,200,200),
                rectB = helper.makeRect(0,100,200,200);

            var ratio = helper.getOverlappingRatio(rectA, rectB);
            assert(ratio === 0.5)
        });
    });


});

describe('AdsWarden', function() {
    var AdsWarden = ads_warden.__get__('AdsWarden');

    describe('AdsWarden()', function() {
        it('should be able to create object', function() {
            assert(typeof new AdsWarden() === 'object');
        });
    });

    // TODO: Add more tests on this object
});
