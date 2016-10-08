window.onload = function() {
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

    var btns = document.getElementById('btns');

    btns.addEventListener('click', function(event) {
        switch (event.target.dataset.action) {
        case 'draw1':
            particle.draw('easeInOutQuad');
            break;
        case 'draw2':
            particle.draw('easeInOutBack');
            break;
        case 'clear':
            particle.clear();
            break;
        }
    }, false);

};
