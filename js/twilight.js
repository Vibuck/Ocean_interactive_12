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