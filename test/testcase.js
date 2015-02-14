var ModuleTestPerf = (function(global) {

var _isNodeOrNodeWebKit = !!global.global;
var _runOnNodeWebKit =  _isNodeOrNodeWebKit &&  /native/.test(setTimeout);
var _runOnNode       =  _isNodeOrNodeWebKit && !/native/.test(setTimeout);
var _runOnWorker     = !_isNodeOrNodeWebKit && "WorkerLocation" in global;
var _runOnBrowser    = !_isNodeOrNodeWebKit && "document" in global;

var test = new Test("Perf", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     false, // enable worker test.
        node:       false, // enable node test.
        nw:         false, // enable nw.js test.
        button:     false, // show button.
        both:       false, // test the primary and secondary modules.
        ignoreError:false, // ignore error.
    }).add([
        testPerf,
    ]);

if (_runOnBrowser || _runOnNodeWebKit) {
    //test.add([]);
} else if (_runOnWorker) {
    //test.add([]);
} else if (_runOnNode) {
    //test.add([]);
}

// --- test cases ------------------------------------------
function testPerf(test, pass, miss) {

    var perf = new Perf({ x: 200, y: 200 });

    setInterval(function() {
        perf.a;
        setTimeout(function() {
            perf.b;
        }, Math.random() * 100);
    }, 16.666);

    //test.done(pass());
}

return test.run().clone();

})((this || 0).self || global);

