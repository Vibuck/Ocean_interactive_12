document.addEventListener("DOMContentLoaded", () => {
    const twilight = document.querySelector('#twilight-wrapper');
    const grid = twilight.querySelector('.tw-fish-container');
    const detail = twilight.querySelector('#tw-detail-view');
    const backBtn = twilight.querySelector('#tw-back-btn');

    twilight.querySelectorAll('.tw-fish-card').forEach(card => {
        card.addEventListener('click', function() {
            const originalImg = this.querySelector('.tw-fish-img');
            const rect = originalImg.getBoundingClientRect();

            // 1. ĐỔ DỮ LIỆU VÀO KHUNG CHI TIẾT
            // Đổ ảnh to vào cái thẻ img mình vừa thêm ở HTML
            const mainDetailImg = detail.querySelector('#tw-target-image-container img');
            if (mainDetailImg) {
                mainDetailImg.src = originalImg.src;
                mainDetailImg.style.display = 'block'; // Hiện ảnh lên
            }

            // Đổ 4 ảnh nhỏ và Model 3D
            detail.querySelector('#tw-detail-model').src = this.getAttribute('data-model');
            detail.querySelector('#tw-detail-title').innerText = this.querySelector('.tw-fish-name').innerText;
            detail.querySelector('#tw-detail-desc').innerText = this.querySelector('p').innerText;
            for(let i=1; i<=4; i++) {
                const thumb = detail.querySelector(`#tw-detail-img${i}`);
                if(thumb) thumb.src = this.getAttribute(`data-img${i}`);
            }

            // 2. TẠO BẢN SAO ĐỂ PHÓNG TO (HIỆU ỨNG)
            const burst = originalImg.cloneNode(true);
            Object.assign(burst.style, {
                position: 'fixed',
                top: rect.top + 'px',
                left: rect.left + 'px',
                width: rect.width + 'px',
                zIndex: '10000',
                pointerEvents: 'none'
            });
            document.body.appendChild(burst);

            // 3. CHẠY HIỆU ỨNG PHÓNG TO RỒI BIẾN MẤT
            gsap.to(burst, {
                top: "50%",
                left: "50%",
                xPercent: -50,
                yPercent: -50,
                scale: 15,
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    burst.remove();
                    grid.style.display = 'none';
                    detail.style.display = 'block';

                    // Chữ và ảnh hiện ra mượt mà
                    gsap.fromTo(".tw-detail-fade", 
                        { opacity: 0, y: 30 }, 
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
                    );
                }
            });
        });
    });

    // NÚT QUAY LẠI
    backBtn.addEventListener('click', () => {
        detail.style.display = 'none';
        grid.style.display = 'grid';
    });

    // VIDEO (Giữ nguyên)
    document.querySelectorAll('.tw-video-item').forEach(item => {
        const video = item.querySelector('video');
        const btn = item.querySelector('.play-pause-btn');
        if (btn && video) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video.paused) { video.play(); btn.innerText = '⏸'; }
                else { video.pause(); btn.innerText = '▶'; }
            });
        }
    });
});
// Thêm vào trong document.addEventListener("DOMContentLoaded", ...)
const bubbles = document.querySelectorAll('.tw-bubble-item');

bubbles.forEach(bubble => {
    bubble.addEventListener('mousemove', (e) => {
        // Hiệu ứng nghiêng nhẹ theo hướng chuột
        const rect = bubble.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        bubble.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    bubble.addEventListener('mouseleave', () => {
        bubble.style.transform = ``;
    });
});
function initGlobalMarineSnow() {
    const container = document.getElementById('tw-marine-snow-global');
    if (!container) return;

    // Tăng số lượng hạt để phủ kín không gian lớn
    const particleCount = 420; 

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'tw-snow-particle';
        
        // Kích thước bong bóng ngẫu nhiên
        const size = Math.random() * 4 + 1 + 'px';
        particle.style.width = size;
        particle.style.height = size;
        
        // RẢI ĐỀU THEO PHẦN TRĂM: Quan trọng nhất để không bị tụ lại một hàng
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Tốc độ lơ lửng ngẫu nhiên (từ 5s đến 12s)
        const duration = Math.random() * 7 + 5 + 's';
        particle.style.animationDuration = duration;
        
        // Độ trễ ngẫu nhiên để các hạt không chuyển động cùng lúc
        particle.style.animationDelay = Math.random() * 5 + 's';

        container.appendChild(particle);
    }
}

// Chạy hàm khi trang web đã sẵn sàng
document.addEventListener("DOMContentLoaded", initGlobalMarineSnow);