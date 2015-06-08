var ModuleTestPerf = (function(global) {

global["BENCHMARK"] = false;

var test = new Test("Perf", {
        disable:    false, // disable all tests.
        browser:    true,  // enable browser test.
        worker:     false, // enable worker test.
        node:       false, // enable node test.
        nw:         true,  // enable nw.js test.
        button:     false, // show button.
        both:       false, // test the primary and secondary modules.
        ignoreError:false, // ignore error.
        callback:   function() {
        },
        errorback:  function(error) {
        }
    }).add([
        // generic test
    ]);

if (IN_BROWSER || IN_NW) {
    test.add([
        // browser and node-webkit test
        testPerf,
    ]);
} else if (IN_WORKER) {
    test.add([
        // worker test
    ]);
} else if (IN_NODE) {
    test.add([
        // node.js and io.js test
    ]);
}

// --- test cases ------------------------------------------
function testPerf(test, pass, miss) {

    var perf = new WebModule.Perf({ x: 200, y: 200 });

    setInterval(function() {
        perf.a;
        setTimeout(function() {
            perf.b;
        }, Math.random() * 100);
    }, 16.666);

    //test.done(pass());
}

return test.run();

})(GLOBAL);

