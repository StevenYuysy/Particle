(function() {
    'use strict';

    /**
     * @private varaibles
     */

    var canvas;
    var animateID;
    var timerID;
    var image = {};
    var particles = [];
    var imageState = false;
    var animation = false;
    var options = {
        cols: 100,              // The number of the columns that devide images.
        rows: 100,              // The number of the rows that devide images.
        startX: 0,              // The begin x coordinate of the particles.
        startY: 0,              // The begin y coordinate of the particles.
        imgX: 0,                // The begin x coordinate of the image.
        imgY: 0,                // The begin y coordinate of the image.
        delay: 10,               // The delay time of the animation.
        duration: 1000,         // The duration of the animation
        easing: 'easeInOutQuad',// The ease of the animation.
        offset: 1               // The offset of the particles.
    };

    /**
     * @constructor
     */

    var Particle = function(opts) {
        canvas = document.querySelector(opts.selector);
        canvas.ctx = canvas.getContext('2d');
        options.cols = opts.cols || options.cols;
        options.rows = opts.rows || options.rows;
        options.startX = opts.startX || options.startX;
        options.startY = opts.startY || options.startY;
        options.imgX = opts.imgX || options.imgX;
        options.imgY = opts.imgY || options.imgY;
        options.delay = opts.delay || options.delay;
        options.duration = opts.duration || options.duration;
        options.easing = opts.easing || options.easing;
        options.offset = opts.offset || options.offset;

        var img = new Image();
        img.onload = function() {
            imageState = true;
            image.w = img.width;
            image.h = img.height;
            canvas.ctx.drawImage(
                img, options.imgX, options.imgY, image.w, image.h);
            image.imageData = canvas.ctx.getImageData(
                options.imgX, options.imgY, image.w, image.h);
        };
        img.src = opts.url;
    };

    /**
     * Get RGB values of specfic `pos` in image `data`.
     * @private
     * @param {Number} pos - The position of the particle.
     * @param {Unit8ClampedArray} data - The imageData.data of the canvas.
     * @return {String} str - The rgb string, for example rgb(0,0,0).
     */

    function getColor(pos, data) {
        var str = 'rgb(' + data[pos] + ',' + data[pos+1] +
            ',' + data[pos+2] +')';
        return str;
    }

    /**
     * Calculate the columns and rows pixles, push them to `particles`.
     * @private
     */

    function calc() {
        // Only save the value of specfic cols and rows pixles.
        var cols = options.cols,
            rows = options.rows;
        // Set the width and the height of the cells.
        var s_width = parseInt(image.w/cols),
            s_height = parseInt(image.h/rows);
        var pos = 0; // Current position of the array.
        var data = image.imageData.data;  // pixles value array.
        for(var i = 0; i < cols; i++) {
            for(var j = 0; j < rows; j++) {
                // Calculate the positoin of the (i,j) in data array.
                pos = (j*s_height*image.w + i*s_width)*4;
                // Check opacity value
                if(data[pos+3] > 100){
                    var particle = {
                        x0: options.startX,
                        y0: options.startY,
                        x1: options.imgX + i*s_width + (
                            Math.random() - 0.5)*options.offset*10,
                        y1: options.imgY + j*s_height + (
                            Math.random() - 0.5)*options.offset*10,
                        count: 0,
                        currTime: 0,
                        delay: Math.random()*options.delay,
                        duration: options.duration,
                        fillStyle: getColor(pos, data)
                    };
                    particles.push(particle);
                }
            }
        }
    }

    /**
     * Clear current canvas action.
     * @private
     */

    function clear() {
        cancelAnimationFrame(animateID);
        particles.forEach(function(ele) {
            ele.count = 0;
            ele.currTime = 0;
        });
        animation = false;
    }

    /**
     * Cheking the animation time and cancel it.
     * @private
     */

    function timer() {
        timerID = setTimeout(function(){
            // console.log('finish');
            clear();
        }, options.delay*20 + options.duration);
    }

    /**
     * Anmiate canvas particle suspection core function.
     * @private
     */

    function animate() {
        // Clear canvas
        canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
        var len = particles.length;
        var cur_particle;
        var cur_time = 0;
        var duration = 0;
        var cur_x, cur_y;
        var ease = getEaseFuction();
        for (var i = 0; i < len; i++) {
            cur_particle = particles[i];
            if (cur_particle.count++ > cur_particle.delay) {
                canvas.ctx.fillStyle = cur_particle.fillStyle;
                cur_time = cur_particle.currTime;
                duration = cur_particle.duration;

                if (cur_time < duration) {
                    animation = true;
                    cur_x = ease(cur_time, cur_particle.x0,
                        cur_particle.x1-cur_particle.x0, duration);
                    cur_y = ease(cur_time, cur_particle.y0,
                        cur_particle.y1-cur_particle.y0, duration);
                    canvas.ctx.fillRect(cur_x, cur_y, 1, 1);
                    cur_particle.currTime+=20;
                } else {
                    canvas.ctx.fillRect(cur_particle.x1, cur_particle.y1, 1, 1);
                }
            }
        }
        animateID = requestAnimationFrame(animate);
    }

    /**
     * Start drawing the image on canvas.
     * @param {String} ease - The ease function in animation.
     */

    Particle.prototype.draw = function(ease) {
        if (animation) return;
        if (ease) options.easing = ease;
        if (imageState) {
            if (!particles.length) calc();
            animate();
            timer();
        }
        // console.log(particles.length);
    };

    /**
     * @return {Boolean} animation - canvas animation.
     */

    Particle.prototype.animate = function() {
        return animation;
    };

    /**
     * Reset the image on canvas.
     */
    Particle.prototype.setImg = function () {

    };

    /**
     * Clear the canvas animation and timer.
     */

    Particle.prototype.clear = function() {
        if (animation) clearTimeout(timerID);
        clear();
        canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    /**
     * Easing animation functions.
     * @param {Number} t - CurrTime
     * @param {Number} b - The begin path
     * @param {Number} c - The rest path
     * @param {Number} d - Duration
     * @return {Number} Expression - Current position
     */

    function easeInOutQuad(t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t + b;
        return -c/2 * ((--t)*(t-2) - 1) + b;
    }

    function easeInOutBack(t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    }

    function getEaseFuction() {
        switch (options.easing) {
        case 'easeInOutQuad':
            return easeInOutQuad;
        case 'easeInOutBack':
            return easeInOutBack;
        default:
            throw new Error('Not available animate function,' +
            ' please select another easing function.');
        }
    }

    window.Particle = Particle;
})();
