const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll(".circle");
const colors=["#182f5b","#1c4a77","#216692","#2883ab","#35a1c1","#48c0d5","#62dfe7","#82fff6"];
colors.reverse();
circles.forEach(function(circle, index) {
    circle.x = 0;
    circle.y = 0;
    let colorIndex = Math.floor((index / circles.length) * colors.length);
    if (colorIndex >= colors.length) colorIndex = colors.length - 1;
    circle.style.backgroundColor = colors[colorIndex];
});
window.addEventListener("mousemove", function(e) {
    coords.x = e.clientX;
    coords.y = e.clientY;
});

function animateCircles() {
    let x = coords.x;
    let y = coords.y;

    circles.forEach(function(circle, index) {
        circle.style.left = x - 12 + "px";
        circle.style.top = y - 12 + "px"; 
        circle.style.scale = (circles.length - index) / circles.length;        
        circle.x = x;
        circle.y = y;
        const nextCircle = circles[index + 1];
        if (nextCircle) {
            x += (nextCircle.x - x) * 0.3;
            y += (nextCircle.y - y) * 0.3;
        }
    });
    
    requestAnimationFrame(animateCircles);
}

animateCircles();