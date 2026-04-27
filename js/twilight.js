// twilight.js - FILE RIÊNG CỦA BẠN
document.addEventListener("DOMContentLoaded", () => {
    // Tự đăng ký Flip (không đụng vào main.js của nhóm trưởng)
    if (typeof Flip !== 'undefined') {
        gsap.registerPlugin(Flip);
    } else {
        console.error("Vui lòng thêm link thư viện Flip vào index.html thì cá mới trượt được!");
    }

    const twilightSection = document.querySelector('#twilight-fish');
    const gridContainer = twilightSection.querySelector('.fish-container');
    const detailView = twilightSection.querySelector('#detail-view');
    const targetContainer = twilightSection.querySelector('#target-image-container');
    const backBtn = twilightSection.querySelector('#back-btn');

    let activeImage = null;
    let originalParent = null;

    // Lắng nghe sự kiện click vào các con cá của bạn
    twilightSection.querySelectorAll('.fish-card').forEach(card => {
        card.addEventListener('click', function() {
            const img = this.querySelector('.fish-img');
            const title = this.querySelector('.fish-name').innerText;
            const desc = this.querySelector('p').textContent;

            originalParent = img.parentElement;
            activeImage = img;

            // Đổ dữ liệu vào màn hình chi tiết
            twilightSection.querySelector('#detail-title').innerText = title;
            twilightSection.querySelector('#detail-desc').innerText = desc;

            // BẮT ĐẦU TRƯỢT (GSAP FLIP)
            const state = Flip.getState(img);

            // Chuyển ảnh sang cột bên phải
            targetContainer.appendChild(img);

            // Hiện màn hình chi tiết, ẩn lưới cá ban đầu
            gridContainer.style.display = 'none';
            detailView.style.display = 'block';

            Flip.from(state, {
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    // Hiện các khối đen và chữ mờ dần lên
                    gsap.fromTo(twilightSection.querySelectorAll('.detail-fade'), 
                        { opacity: 0, y: 20 }, 
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
                    );
                }
            });
        });
    });

    // Nút quay lại
    backBtn.addEventListener('click', () => {
        const state = Flip.getState(activeImage);
        originalParent.insertBefore(activeImage, originalParent.firstChild);

        detailView.style.display = 'none';
        gridContainer.style.display = 'grid';

        Flip.from(state, {
            duration: 1,
            ease: "power2.inOut"
        });
    });
});
// Đổ dữ liệu vào màn hình chi tiết (đã có sẵn)
            twilightSection.querySelector('#detail-title').innerText = title;
            twilightSection.querySelector('#detail-desc').innerText = desc;

            // ---- CHÈN THÊM ĐOẠN NÀY ĐỂ THAY ẢNH PHỤ ----
            const modelSrc = this.getAttribute('data-model');
            const img1Src = this.getAttribute('data-img1');
            const img2Src = this.getAttribute('data-img2');
            const img3Src = this.getAttribute('data-img3');
            const img4Src = this.getAttribute('data-img4');

            twilightSection.querySelector('#detail-model').src = modelSrc;
            twilightSection.querySelector('#detail-img1').src = img1Src;
            twilightSection.querySelector('#detail-img2').src = img2Src;
            twilightSection.querySelector('#detail-img3').src = img3Src;
            twilightSection.querySelector('#detail-img4').src = img4Src;
            // ----------------------------------------------