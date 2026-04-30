(function () {
    'use strict';
    document.addEventListener('DOMContentLoaded', function () {
        var section = document.getElementById('wave-transition');
        if (!section) return;
        var bg2     = section.querySelector('.wt-bg-2');
        var bg3     = section.querySelector('.wt-bg-3');
        var ticking = false;
 
        function update() {
            ticking = false;
            var rect = section.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            var progress = Math.max(0, Math.min(1,
                (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
            ));
            var shift = (progress - 0.5) * 50;
            if (bg2) bg2.style.transform = 'scale(1.08) translateY(' + (shift * 0.5) + 'px)';
            if (bg3) bg3.style.transform = 'scale(1.12) translateY(' + (shift * -0.4) + 'px)';
        }
 
        window.addEventListener('scroll', function () {
            if (!ticking) { requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();
    });
})();