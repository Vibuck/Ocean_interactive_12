document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#abyssal-fish-animation",
            start: "top top",
            end: "+=100%", 
            scrub: 1,
            pin: true,
        }
    });

    // Tách 3 ảnh ra các vị trí cân đối và DỪNG LẠI (không ẩn đi)
    tl.to(".fish-left", { 
        xPercent: -150, // Đẩy sang trái 1.5 lần kích thước ảnh
        rotation: -10, 
        duration: 2 
    })
    .to(".fish-right", { 
        xPercent: 150,  // Đẩy sang phải 1.5 lần kích thước ảnh
        rotation: 10, 
        duration: 2 
    }, 0)
    .to(".fish-center", { 
        yPercent: 0,    // Giữ nguyên vị trí Y hoặc điều chỉnh nhẹ nếu muốn
        scale: 1.1,     // Phóng to nhẹ ảnh giữa để làm điểm nhấn
        duration: 2 
    }, 0);
});