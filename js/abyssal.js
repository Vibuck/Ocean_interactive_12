document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    // TRIGGER 1: CUỘN NGANG 3 ẢNH THÔNG TIN
    gsap.to(".info-horizontal-wrapper", {
        xPercent: -66.66, // Dịch chuyển để hiện ảnh 2 và 3 (100% * (3-1)/3)
        ease: "none",
        scrollTrigger: {
            trigger: "#abyssal-info-scroll",
            start: "top top",
            end: "+=200%", // Độ dài cuộn chuột cho 3 ảnh
            pin: true,     // Ghim lại cho đến khi xem hết 3 ảnh
            scrub: 1,
            snap: 1 / 2    // Tự động dừng đúng từng ảnh
        }
    });

    // TRIGGER 2: HIỆU ỨNG 3 CON CÁ BUNG RA (CODE CŨ CỦA BẠN)
    const tlFish = gsap.timeline({
        scrollTrigger: {
            trigger: "#abyssal-fish-animation",
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
        }
    });

    tlFish.to(".fish-left", { 
        xPercent: -150, 
        rotation: -10, 
        duration: 2 
    })
    .to(".fish-right", { 
        xPercent: 150,  
        rotation: 10, 
        duration: 2 
    }, 0)
    .to(".fish-center", { 
        scale: 1.1,     
        duration: 2 
    }, 0);
});