expect = chai.expect;
should = chai.should;
assert = chai.assert;

describe('AdsWarden', function() {
    describe('AdsWarden()', function() {
        it('should be able to create object', function() {
            assert(typeof new AdsWarden() === 'object');
        });
        var warden = new AdsWarden();
        var warden_config = {
            'inside_viewport':{threshold: 1.0} // using threshold 1.0 - we want 100% of advert to be visible
            // 'document_focused':{},
            // 'document_nothidden':{}
        };

        it('ad fully inside viewport', function() {
            var ad = document.createElement('div');
            ad.setAttribute('style','background: #ee7202; position: absolute; width: 300px; height: 250px; left: 100px; top: 100px;');
            ad.setAttribute('id','ad-fully-inside');
            document.body.appendChild(ad);

            var result = warden.getVisibility('ad-fully-inside', warden_config);
            assert(result.visible === true);
            assert(result.overlapping === 1.0);
        });

        it('ad fully outside viewport', function() {
            var ad = document.createElement('div');
            ad.setAttribute('style','background: #ee7202; position: absolute; width: 300px; height: 250px; left: -1000px; top: -1000px;');
            ad.setAttribute('id','ad-fully-outside');
            document.body.appendChild(ad);

            var result = warden.getVisibility('ad-fully-outside', warden_config);
            assert(result.visible === false);
            assert(result.overlapping === 0.0);
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

        it('ad fully inside viewport', function() {
            var rule = new InViewportRule();
            var ad = document.createElement('div');
            ad.setAttribute('style','background: #ee7202; position: absolute; width: 300px; height: 250px; left: 100px; top: 100px;');
            ad.setAttribute('id','ad-fully-inside');
            document.body.appendChild(ad);

            var result = rule.checkVisibility('ad-fully-inside',{threshold: 1.0});
            assert(result.visible === true);
            assert(result.overlapping === 1.0);
        });

        it('ad fully outside viewport', function() {
            var rule = new InViewportRule();
            var ad = document.createElement('div');
            ad.setAttribute('style','background: #ee7202; position: absolute; width: 300px; height: 250px; left: -1000px; top: -1000px;');
            ad.setAttribute('id','ad-fully-outside');
            document.body.appendChild(ad);

            var result = rule.checkVisibility('ad-fully-outside',{threshold: 1.0});
            assert(result.visible === false);
            assert(result.overlapping === 0.0);
        });

        it('ad 1/4 inside viewport', function() {
            var rule = new InViewportRule();
            var ad = document.createElement('div');
            ad.setAttribute('style','background: #ee7202; position: absolute; width: 500px; height: 500px;; left: 250px; top: 250px;');
            ad.setAttribute('id','ad-half-inside');
            document.body.appendChild(ad);

            var result = rule.checkVisibility('ad-half-inside',{threshold: 1.0});
            assert(result.visible === false);
            assert(result.overlapping === 0.25);
        });

        it('ad 1/4 inside viewport with 1/8 threshold', function() {
            var rule = new InViewportRule();
            var ad = document.createElement('div');
            ad.setAttribute('style','background: #ee7202; position: absolute; width: 500px; height: 500px;; left: 250px; top: 250px;');
            ad.setAttribute('id','ad-half-inside-threshold');
            document.body.appendChild(ad);

            var result = rule.checkVisibility('ad-half-inside-threshold',{threshold: 1/8});
            assert(result.visible === true);
            assert(result.overlapping > 1/8 );
        });

    });

    // TODO: Add more tests on this object
});
