gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const overlay = document.getElementById('transition-overlay');
const wave = document.querySelector('.reveal-wave');
const bubbleContainer = document.getElementById('bubble-container');
let isAnimating = false;

// TỰ ĐỘNG TẠO BONG BÓNG
for (let i = 0; i < 50; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = Math.random() * 20 + 10;
    b.style.width = size + 'px';
    b.style.height = size + 'px';
    b.style.left = Math.random() * 100 + '%';
    b.style.bottom = '-50px';
    bubbleContainer.appendChild(b);
}
const bubbles = document.querySelectorAll('.bubble');

function playNaturalWave(target) {
    if (isAnimating) return;
    isAnimating = true;

    const tl = gsap.timeline({
        onComplete: () => {
            gsap.set(overlay, { visibility: 'hidden' });
            gsap.set(wave, { yPercent: 100, opacity: 1, scaleY: 1 });
            isAnimating = false;
        }
    });

    tl.set(overlay, { visibility: 'visible' })
    // SÓNG DÂNG NHANH
    .to(wave, { duration: 0.8, yPercent: 0, ease: "power2.in" })
    // BONG BÓNG BAY LOẠN XẠ
    .to(bubbles, {
        duration: 1.5, opacity: 1,
        y: () => -(window.innerHeight + 200),
        x: () => (Math.random() - 0.5) * 200,
        stagger: { amount: 0.8, from: "random" },
        ease: "power1.out"
    }, 0)
    // CHUYỂN TRANG
    .to(window, { duration: 0.1, scrollTo: target }, 0.7)
    // SÓNG TAN BIẾN TỰ NHIÊN (VỪA CUỘN LÊN VỪA MỜ VỪA CO LẠI)
    .to(wave, {
        duration: 1.2,
        yPercent: -120,
        opacity: 0,
        scaleY: 0.5,
        ease: "power2.out"
    }, "+=0.1");
}

// EVENTS
document.getElementById('dive-btn').onclick = () => playNaturalWave('#sunlight-wrapper');

document.getElementById('nav-about').onclick = () => {
    document.getElementById('about-overlay').classList.add('active');
    document.getElementById('contact-overlay').classList.remove('active');
};

document.getElementById('nav-contact').onclick = () => {
    document.getElementById('contact-overlay').classList.add('active');
    document.getElementById('about-overlay').classList.remove('active');
};

document.getElementById('nav-home').onclick = () => {
    document.querySelectorAll('.ui-panel').forEach(p => p.classList.remove('active'));
    gsap.to(window, { scrollTo: 0, duration: 1 });
};

// ==========================================
// 🔴 ÁP DỤNG: CỨ CHẠY ĐẾN CUỐI TẦNG LỚN LÀ KÍCH HOẠT SÓNG
// ==========================================
const oceanZones = gsap.utils.toArray('.ocean-zone');

oceanZones.forEach((zone, i) => {
    ScrollTrigger.create({
        trigger: zone,
        start: 'bottom bottom', 
        onEnter: () => {
            if (i < oceanZones.length - 1) {
                // Sửa thành playNaturalWave thay vì playRevealTransition cũ
                playNaturalWave(oceanZones[i+1]); 
            }
        }
    });
});