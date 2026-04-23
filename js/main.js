// Đăng ký Plugins
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const overlay = document.getElementById('transition-overlay');
const wave = overlay.querySelector('.reveal-wave');
const bubbles = overlay.querySelectorAll('.reveal-bubbles span');

let isAnimating = false; // Biến khóa bảo vệ để chống lỗi chạy đè hiệu ứng

// Hàm tạo hiệu ứng chuyển cảnh "revealing"
function playRevealTransition(targetSection) {
    if (isAnimating) return; // Nếu đang chạy hiệu ứng rồi thì không cho kích hoạt lại
    isAnimating = true;

    // 1. Khởi tạo Timeline GSAP
    const tl = gsap.timeline({
        onComplete: () => {
            // Khi sóng đã che kín và rút đi, cuộn trang tới section đích
            gsap.set(overlay, { visibility: 'hidden', opacity: 0 });
            gsap.to(window, { 
                duration: 0.1, 
                scrollTo: targetSection,
                onComplete: () => {
                    // Mở khóa sau khi đã yên vị ở tầng mới
                    setTimeout(() => { isAnimating = false; }, 100); 
                }
            });
        }
    });

    // 2. Các bước của hiệu ứng:
    tl.set(overlay, { visibility: 'visible', opacity: 1 }) // Hiện overlay
      .to(wave, {
          duration: 1.2, 
          translateY: '0%', // Tràn lướt kín màn hình
          ease: "power2.inOut" 
      })
      .to(bubbles, {
          duration: 1.2,
          opacity: 1, 
          y: -window.innerHeight - 200, // Bay lên ngoài màn hình
          stagger: { amount: 0.8, from: "random" },
          ease: "power2.inOut"
      }, 0) // Chạy cùng lúc với sóng
      .to(wave, {
          duration: 0.8,
          translateY: '-100%', // Đẩy tụt sóng ra khỏi màn hình (reveal)
          ease: "power2.inOut",
          delay: 0.2 // Dừng lại một chút trên đỉnh
      });
}

// ==========================================
// 🔴 ÁP DỤNG: CUỘN QUA SECTION LÀ KÍCH HOẠT
// ==========================================

const sections = gsap.utils.toArray('section');

sections.forEach((section, i) => {
    // Chỉ gắn ScrollTrigger nếu chưa phải tầng cuối cùng (Abyssal)
    if (i < sections.length - 1) {
        ScrollTrigger.create({
            trigger: section,
            // Kích hoạt khi người dùng cuộn xuống khoảng 10% của section hiện tại
            start: 'bottom 90%', 
            onEnter: () => {
                playRevealTransition(sections[i+1]); // Chuyển xuống tầng kế tiếp
            }
        });
    }
});

// ==========================================
// 🔵 ÁP DỤNG: CHO NÚT "LETS DIVE" (TRANG ĐẦU TIÊN)
// ==========================================

const diveButton = document.getElementById("dive-btn");
if (diveButton) {
    diveButton.addEventListener("click", () => {
        // Kích hoạt lướt sóng thẳng xuống tầng Sunlight
        playRevealTransition('#sunlight-zone');
    });
}