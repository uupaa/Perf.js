(function moduleExporter(moduleName, moduleBody) { // http://git.io/WebModule
   "use strict";

    var alias  = moduleName in GLOBAL ? (moduleName + "_") : moduleName; // switch
    var entity = moduleBody(GLOBAL);

    if (typeof modules !== "undefined") {
        GLOBAL["modules"]["register"](alias, moduleBody, entity["repository"]);
    }
    if (typeof exports !== "undefined") {
        module["exports"] = entity;
    }
    GLOBAL[alias] = entity;

})("Perf", function moduleBody(global) {

"use strict";

// --- dependency modules ----------------------------------
var Clock = global["Clock"];

// --- define / local variables ----------------------------
// http://gyazo.com/617185f0e333f7faf4f50e17a2fc9cd2.png
var COLOR_BAR = {
        0: "rgb(255,0,0)",
        1: "rgb(255,107,0)",
        2: "rgb(255,183,0)",
        3: "rgb(212,227,0)",
        4: "rgb(134,242,0)",
        5: "rgb(46,250,0)",
        6: "rgb(0,255,109)",
        7: "rgb(0,238,255)",
        8: "rgb(0,131,255)",
        9: "rgb(0,63,255)",
    };

// --- class / interfaces ----------------------------------
function Perf(options) { // @arg Object - { parentNode, x, y, color, bgcolor, opacity }
                         // @options.parentNode Node = document.body
                         // @options.x Number = 0
                         // @options.y Number = 0
                         // @options.color String = "hotpink" - font color
                         // @options.bgcolor String = "aliceblue" - background color
                         // @options.opacity Number = 0.7 - from 0.1 to 1.0
    options = options || {};

    this._x       = options["x"] || 0.0;
    this._y       = options["y"] || 0.0;
    this._color   = options["color"]   || "hotpink";
    this._bgcolor = options["bgcolor"] || "aliceblue";
    this._opacity = options["opacity"] || 0.7;
    this._clock   = new Clock([], { vsync: false, wait: 1000, start: true, suspend: true });
    this._tick    = _tick.bind(this);
    this._rec     = true;
    this._count   = 0;
    this._updated = false;
    this._buffer = {
        fps:        new Float32Array(128), // ring buffer
        ms:         new Float32Array(128), // ring buffer
        cursor:     0, // buffer cursor
        lastCursor: 0, // buffer last cursor
    };
    this._fps = {
        current:    0.0,
        lastTime:   this._clock.now(),
    };
    this._ms = {
        current:    0.0,
        a:          0,
        delta:      0,
    };

    var placeholder = document.createElement("div");

    placeholder.innerHTML =
        _format('<div id="PERF_BOX" style="position:absolute;opacity:@;background-color:@;left:@px;top:@px;width:128px;height:64px">' +
                    '<span id="PERF_MS" style="font:9pt monospace;position:absolute;top:0;right:0;color:@">0 ms</span>' +
                    '<span id="PERF_FPS" style="font:9pt monospace;position:absolute;bottom:0;right:0;color:@">0 fps</span>' +
                    '<canvas id="PERF_BGGRAPH" width="128" height="64" style="display:none"></canvas>' +
                    '<canvas id="PERF_GRAPH" width="128" height="64"></canvas>' +
                '</div>', [0, this._opacity, this._bgcolor, this._x, this._y, this._color, this._color]);
    this._box      = placeholder.querySelector("#PERF_BOX");
    this._msText   = placeholder.querySelector("#PERF_MS");
    this._fpsText  = placeholder.querySelector("#PERF_FPS");
    this._canvas   = placeholder.querySelector("#PERF_GRAPH");
    this._bgcanvas = placeholder.querySelector("#PERF_BGGRAPH");

    var that = this;
    this._canvas.onclick = function() {
        if (that._rec) {
            that._rec = false;
            that._clock.off(that._tick);
        } else {
            that._rec = true;
            that._clock.on(that._tick);
        }
    };
    (options["parentNode"] || document.body).appendChild(this._box);

    this._ctx = this._canvas.getContext("2d");
    this._ctx.globalAlpha = 0.8;
    this._bgctx = this._bgcanvas.getContext("2d");
    this._clock.on(this._tick);
}


Perf["VERBOSE"] = true;
Perf["repository"] = "https://github.com/uupaa/Perf.js"; // GitHub repository URL.
Perf["prototype"] = Object.create(Perf, {
    "constructor":  { "value": Perf        }, // new Perf():Perf
    "x":            { "get":   function()  { return this._x; },
                      "set":   function(v) { this._box.style.left = v + "px"; } },
    "y":            { "get":   function()  { return this._y; },
                      "set":   function(v) { this._box.style.top = v + "px"; } },
    "a":            { "get":   Perf_a      }, // Perf#a
    "b":            { "get":   Perf_b      }, // Perf#b
});

// --- implements ------------------------------------------
function Perf_a() {
    this._ms.a = this._clock.now();
}
function Perf_b() {
    var now = this._clock.now();

    this._ms.delta += (now - this._ms.a);
    if (++this._count >= 60) {
        this._updated      = true;
        this._ms.current   = this._ms.delta / this._count;
        this._ms.delta     = 0;
        this._fps.current  = 1000 / ((now - this._fps.lastTime) / this._count);
        this._fps.lastTime = now;
        this._count        = 0;
        this._buffer.ms[this._buffer.cursor]  = this._ms.current;
        this._buffer.fps[this._buffer.cursor] = this._fps.current;

        if (++this._buffer.cursor >= this._buffer.ms.length) {
            this._buffer.cursor = 0; // ring

            this._bgctx.clearRect(0, 0, this._bgctx.canvas.width, this._bgctx.canvas.height);
            this._bgctx.drawImage(this._ctx.canvas, 0, 0);
            this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
            this._ctx.globalAlpha = 0.2;
            this._ctx.drawImage(this._bgctx.canvas, 0, 0);
            this._ctx.globalAlpha = 0.8;
        }
    }
}

function _tick() { // @bind this
    if (this._updated) {
        this._updated = false;
        this._fpsText.textContent = this._fps.current.toFixed(1) + " fps";
        this._msText.textContent  = this._ms.current.toFixed(1)  + " ms";
        var buf = this._buffer;

        _drawMSLines(this._ctx,  buf.ms,  buf.lastCursor, buf.cursor);
        _drawFPSLines(this._ctx, buf.fps, buf.lastCursor, buf.cursor);
        buf.lastCursor = buf.cursor;
    }
}

function _drawMSLines(ctx, array, begin, end) {
    for (var i = begin; i < end; ++i) {
        var height = 32;  // max graph height
        var high   = 100; // max 100 ms
        var low    = 0;   // min   0 ms
        var ms     = array[i];

        ms = Math.min(ms, high);
        ms = Math.max(ms, low);

        var color  = ms < 2 ? COLOR_BAR[9] :
                     ms < 4 ? COLOR_BAR[8] :
                     ms < 6 ? COLOR_BAR[7] :
                     ms < 8 ? COLOR_BAR[6] :
                     ms < 10 ? COLOR_BAR[5] :
                     ms < 12 ? COLOR_BAR[4] :
                     ms < 14 ? COLOR_BAR[3] :
                     ms < 16 ? COLOR_BAR[2] :
                     ms < 18 ? COLOR_BAR[1] : COLOR_BAR[0];
        var dots   = (height / (high - low)) * ms;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 0 + dots);
        ctx.stroke();
        ctx.closePath();
    }
}

function _drawFPSLines(ctx, array, begin, end) {
    for (var i = begin; i < end; ++i) {
        var height = 32;  // max graph height
        var high   = 60;  // max 60 fps
        var low    = 0;   // min  0 fps
        var fps    = array[i];

        fps = Math.min(fps, high);
        fps = Math.max(fps, low);

        var color  = fps < 12 ? COLOR_BAR[0] :
                     fps < 16 ? COLOR_BAR[1] :
                     fps < 24 ? COLOR_BAR[2] :
                     fps < 30 ? COLOR_BAR[3] :
                     fps < 35 ? COLOR_BAR[4] :
                     fps < 40 ? COLOR_BAR[5] :
                     fps < 45 ? COLOR_BAR[6] :
                     fps < 50 ? COLOR_BAR[7] :
                     fps < 55 ? COLOR_BAR[8] : COLOR_BAR[9];
        var dots   = (height / (high - low)) * fps;

        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(i, 64);
        ctx.lineTo(i, 64 - dots);
        ctx.stroke();
        ctx.closePath();
    }
}

function _format(text, args) {
    return text.replace(/@/g, function() {
        return args[++args[0]];
    });
}

// --- validate and assert functions -----------------------
//{@dev
//function $type(obj, type)      { return GLOBAL["Valid"] ? GLOBAL["Valid"].type(obj, type)    : true; }
//function $keys(obj, str)       { return GLOBAL["Valid"] ? GLOBAL["Valid"].keys(obj, str)     : true; }
//function $some(val, str, ig)   { return GLOBAL["Valid"] ? GLOBAL["Valid"].some(val, str, ig) : true; }
//function $args(fn, args)       { if (GLOBAL["Valid"]) { GLOBAL["Valid"].args(fn, args); } }
//function $valid(val, fn, hint) { if (GLOBAL["Valid"]) { GLOBAL["Valid"](val, fn, hint); } }
//}@dev

return Perf; // return entity

});

