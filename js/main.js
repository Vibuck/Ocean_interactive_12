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
// ==========================================
// 🟢 LOGIC NAVBAR VÀ TRANG THÔNG TIN (UI PANELS)
// ==========================================

const btnHome = document.getElementById('nav-home');
const btnContact = document.getElementById('nav-contact');
const btnAbout = document.getElementById('nav-about');

const panelContact = document.getElementById('contact-overlay');
const panelAbout = document.getElementById('about-overlay');

// Hàm dọn dẹp: Đóng mọi panel đang mở
function closeAllPanels() {
    panelContact.classList.remove('active');
    panelAbout.classList.remove('active');
    
    // (Tuỳ chọn) Nếu đang khóa cuộn trang, thì mở lại ở đây
    document.body.style.overflow = '';
}

// 1. Nhấn HOME
btnHome.addEventListener('click', () => {
    // Chỉ cần đóng hết panel là người dùng tự thấy lại màn hình đại dương đang xem dở
    closeAllPanels();
});

// 2. Nhấn CONTACT
btnContact.addEventListener('click', () => {
    // Nếu đang mở About, rút About về ngay lập tức rồi mới đẩy Contact lên
    if (panelAbout.classList.contains('active')) {
        panelAbout.classList.remove('active');
        // Chờ About lướt ra ngoài 400ms rồi mới cho Contact trồi lên cho đỡ rối mắt
        setTimeout(() => {
            panelContact.classList.add('active');
        }, 400); 
    } else {
        // Nếu About ko mở, thì cứ bật/tắt Contact như bình thường
        panelContact.classList.toggle('active');
    }
});

// 3. Nhấn ABOUT US
btnAbout.addEventListener('click', () => {
    // Ngược lại với Contact
    if (panelContact.classList.contains('active')) {
        panelContact.classList.remove('active');
        setTimeout(() => {
            panelAbout.classList.add('active');
        }, 400);
    } else {
        panelAbout.classList.toggle('active');
    }
    
    // Khi mở Full-screen About Us, ta nên khóa cuộn chuột để ko bị trôi đại dương ở sau
    if (panelAbout.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});