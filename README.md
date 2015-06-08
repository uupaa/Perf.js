# Perf.js [![Build Status](https://travis-ci.org/uupaa/Perf.js.svg)](https://travis-ci.org/uupaa/Perf.js)

[![npm](https://nodei.co/npm/uupaa.perf.js.svg?downloads=true&stars=true)](https://nodei.co/npm/uupaa.perf.js/)

Performance monitor.

## Document

- Perf.js made of [WebModule](https://github.com/uupaa/WebModule).
- [Spec](https://github.com/uupaa/Perf.js/wiki/Perf)

## Features

![](http://gyazo.com/db349a1f851aee00d139764a43906b39.png)

- Monitoring fps and ms.

## Browser and NW.js(node-webkit)

```js
<script src="<module-dir>/lib/WebModule.js"></script>
<script src="<module-dir>/node_modules/uupaa.pagevisibilityevent.js/lib/PageVisibilityEvent.js"></script>
<script src="<module-dir>/node_modules/uupaa.clock.js/lib/Clock.js"></script>
<script src="<module-dir>/lib/Perf.js"></script>
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

