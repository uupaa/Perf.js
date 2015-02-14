# Perf.js [![Build Status](https://travis-ci.org/uupaa/Perf.js.png)](http://travis-ci.org/uupaa/Perf.js)

[![npm](https://nodei.co/npm/uupaa.perf.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.perf.js/)

Performance monitor

## Document

- [Perf.js wiki](https://github.com/uupaa/Perf.js/wiki/Perf)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## Run on

### Browser

```js
<script src="lib/Perf.js"></script>
<script>
var options = { parentNode: document.body, x: 100, y: 100, opacity: 0.7 };
var perf = new Perf(options);


function gameLoop() {
    perf.a;
    {
        // --- performance monitor block ---
        // userInput();
        // enemyMove();
        // redraw();
    }
    perf.b;

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
</script>
```

### node-webkit

```js
<script src="lib/Perf.js"></script>
```

