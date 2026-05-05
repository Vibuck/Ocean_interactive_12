document.addEventListener("DOMContentLoaded", () => {
    // --- 1. LẤY CÁC THÀNH PHẦN GIAO DIỆN ---
    const twilight = document.querySelector('#twilight-wrapper');
    if (!twilight) return; 
    
    const grid = twilight.querySelector('.tw-fish-container');
    const detail = twilight.querySelector('#tw-detail-view');
    const backBtn = twilight.querySelector('#tw-back-btn');

    // --- HÀM TẠO HIỆU ỨNG SÓNG CHÂN THỰC 3 LỚP (SVG) ---
    // Đã thêm tiền tố tw_ để không bị đụng code với người khác
    function tw_playOceanWave(onMidpoint) {
        const waveContainer = document.createElement('div');
        waveContainer.innerHTML = `
            <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 99999; pointer-events: none;">
                <path class="tw-wave-layer" fill="#001f3f" d="M -2000 0 L 300 0 C 600 300 0 700 300 1000 L -2000 1000 Z" />
                <path class="tw-wave-layer" fill="#0074D9" d="M -2000 0 L 200 0 C 500 300 -100 700 200 1000 L -2000 1000 Z" />
                <path class="tw-wave-layer" fill="#7FDBFF" d="M -2000 0 L 100 0 C 400 300 -200 700 100 1000 L -2000 1000 Z" />
            </svg>
        `;
        document.body.appendChild(waveContainer);

        const layers = waveContainer.querySelectorAll('.tw-wave-layer');
        gsap.set(layers, { x: -1500 });

        const tl = gsap.timeline();
        
        tl.to(layers, {
            x: 1500, // Sóng ập vào
            duration: 0.6,
            ease: "power2.inOut",
            stagger: 0.1 
        })
        .call(onMidpoint) // Tráo đổi giao diện và set vị trí trượt lúc sóng đang che
        .to(layers, {
            x: 3500, // Sóng rút đi
            duration: 0.6,
            ease: "power2.inOut",
            stagger: 0.1,
            onComplete: () => waveContainer.remove()
        });

        return tl; 
    }

    // --- 2. SỰ KIỆN CLICK VÀO TỪNG THẺ CÁ ---
    twilight.querySelectorAll('.tw-fish-card').forEach(card => {
        card.addEventListener('click', function() {
            const originalImg = this.querySelector('.tw-fish-img');

            // Đổ dữ liệu
            const mainDetailImg = detail.querySelector('#tw-target-image-container img');
            if (mainDetailImg) {
                mainDetailImg.src = originalImg.src;
                mainDetailImg.style.display = 'block'; 
            }
            detail.querySelector('#tw-detail-model').src = this.getAttribute('data-model');
            detail.querySelector('#tw-detail-title').innerText = this.querySelector('.tw-fish-name').innerText;
            detail.querySelector('#tw-detail-desc').innerText = this.querySelector('p').innerText;
            
            for(let i = 1; i <= 4; i++) {
                const thumb = detail.querySelector(`#tw-detail-img${i}`);
                if(thumb) thumb.src = this.getAttribute(`data-img${i}`);
            }

            // GỌI HIỆU ỨNG SÓNG KẾT HỢP TRƯỢT VÀO
            tw_playOceanWave(() => {
                grid.style.display = 'none';
                detail.style.display = 'block';
                
                // Chuẩn bị vị trí: Khối detail đẩy sang trái một chút để lát trượt vào
                gsap.set(detail, { x: -100, opacity: 0 });
                // Chuẩn bị vị trí: Các chữ bên trong cũng lùi lại
                gsap.set(".tw-detail-fade", { opacity: 0, x: -30 });
            })
            // Sóng vừa rút thì khối Detail trượt theo từ trái sang phải
            .to(detail, {
                x: 0, opacity: 1, duration: 0.6, ease: "power2.out"
            }, "-=0.7")
            // Chữ bên trong tiếp nối trượt ra
            .to(".tw-detail-fade", {
                opacity: 1, x: 0, duration: 0.5, stagger: 0.1
            }, "-=0.4");
        });
    });

    // --- 3. SỰ KIỆN NÚT QUAY LẠI ---
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // Sóng đánh vào -> Lưới cá cuộn từ trái ra
            tw_playOceanWave(() => {
                detail.style.display = 'none';
                grid.style.display = 'grid'; 
                
                // Chuẩn bị vị trí: Đẩy lưới cá lùi sang trái
                gsap.set(grid, { x: -100, opacity: 0 });
            })
            // Kéo danh sách cá từ bên trái trở lại mượt mà cùng lúc sóng rút
            .to(grid, {
                x: 0, opacity: 1, duration: 0.6, ease: "power2.out"
            }, "-=0.7");
        });
    }

    // --- 4. SỰ KIỆN NÚT VIDEO ---
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

    // --- 5. BONG BÓNG LÔNG CHUỘT ---
    const bubbles = document.querySelectorAll('.tw-bubble-item');
    bubbles.forEach(bubble => {
        bubble.addEventListener('mousemove', (e) => {
            const rect = bubble.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            bubble.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        bubble.addEventListener('mouseleave', () => bubble.style.transform = ``);
    });

    // Khởi tạo tuyết bằng hàm đã đổi tên
    tw_initGlobalMarineSnow();
});

// --- HÀM TẠO TUYẾT BIỂN ---
// Đã thêm tiền tố tw_ bảo mật
function tw_initGlobalMarineSnow() {
    const container = document.getElementById('tw-marine-snow-global');
    if (!container) return;

    const particleCount = 420; 

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'tw-snow-particle';
        
        const size = Math.random() * 4 + 1 + 'px';
        particle.style.width = size;
        particle.style.height = size;
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        const duration = Math.random() * 7 + 5 + 's';
        particle.style.animationDuration = duration;
        particle.style.animationDelay = Math.random() * 5 + 's';

        container.appendChild(particle);
    }
}