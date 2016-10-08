# particle suspension
![](https://travis-ci.org/StevenYuysy/Particle.svg?branch=master)

A particle suspension by JavaScript canvas.

Inspired by [ISUX](https://isux.tencent.com/canvas-particle-animation.html)

### demo

[demo](https://stevenyuysy.github.io/Particle/demo/)

### usage

```html
<script src="src/particle.js">
```

```javascript
var particle = new Particle({
    selector: '#canvas',
    url: 'isux.png',
    startX: 250,
    startY: 500,
    imgX: 100,
    imgY: 100,
    delay: 100,
    duration: 2000,
    offset: 1,
    easing: 'easeInOutQuad'
});
```

### Options

|Options|Description|
|-------|-----------|
|selector(necessary)|The css selector of canvas.|
|url(necessary)|The url of the image.|
|cols|The number of the columns that devide images.|
|rows|The number of the rows that devide images.|
|startX|The begin x coordinate of the particles.|
|startY|The begin y coordinate of the particles.|
|imgX|The begin x coordinate of the image.|
|imgY|The begin y coordinate of the image.|
|delay|The delay time of the animation.|
|duration|The duration of the animation|
|easing|The ease of the animation. Currently support `easeInOutQuad`, `easeInOutBack`.|
|offset|The offset of the particles.|

### Development

```bash
git clone https://github.com/StevenYuysy/Particle.git
npm install
gulp connect
```

### License

MIT
