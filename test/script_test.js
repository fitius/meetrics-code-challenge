expect = chai.expect;
should = chai.should;
assert = chai.assert;

describe('AdsWarden', function() {
    describe('AdsWarden()', function() {
        it('should be able to create object', function() {
            assert(typeof new AdsWarden() === 'object');
        });
    });

    // TODO: Add more tests on this object
});

describe('VisibilityRules', function() {
    describe('IAdVisibilityRule()', function() {
        it('should be able to create object', function() {
            assert(typeof new IAdVisibilityRule() === 'object');
            assert(typeof new InViewportRule() === 'object');
            assert(typeof new DocumentFocusedRule() === 'object');
        });
    });

    // TODO: Add more tests on this object
});
