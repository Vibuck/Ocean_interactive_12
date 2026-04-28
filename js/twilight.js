// twilight.js - PHIÊN BẢN ĐÃ QUY HOẠCH (PREFIX tw-)
document.addEventListener("DOMContentLoaded", () => {
    // 1. Tự đăng ký Flip (Giữ nguyên logic kiểm tra)
    if (typeof Flip !== 'undefined') {
        gsap.registerPlugin(Flip);
    } else {
        console.error("Vui lòng thêm link thư viện Flip vào index.html thì cá mới trượt được!");
    }

    // 2. Lấy các phần tử chính (Đã đổi sang ID/Class mới)
    const twilightWrapper = document.querySelector('#twilight-wrapper');
    const fishSection = twilightWrapper.querySelector('#tw-fish-section');
    const gridContainer = twilightWrapper.querySelector('.tw-fish-container');
    const detailView = twilightWrapper.querySelector('#tw-detail-view');
    const targetContainer = twilightWrapper.querySelector('#tw-target-image-container');
    const backBtn = twilightWrapper.querySelector('#tw-back-btn');

    let activeImage = null;
    let originalParent = null;

    // 3. Lắng nghe sự kiện click vào các thẻ cá (.tw-fish-card)
    twilightWrapper.querySelectorAll('.tw-fish-card').forEach(card => {
        card.addEventListener('click', function() {
            const img = this.querySelector('.tw-fish-img');
            const title = this.querySelector('.tw-fish-name').innerText;
            // Lấy đoạn mô tả (thẻ p bên trong card)
            const desc = this.querySelector('p').textContent;

            originalParent = img.parentElement;
            activeImage = img;

            // Đổ dữ liệu vào màn hình chi tiết (Dùng ID tw-)
            twilightWrapper.querySelector('#tw-detail-title').innerText = title;
            twilightWrapper.querySelector('#tw-detail-desc').innerText = desc;

            // Lấy dữ liệu từ data-attributes
            const modelSrc = this.getAttribute('data-model');
            const img1Src = this.getAttribute('data-img1');
            const img2Src = this.getAttribute('data-img2');
            const img3Src = this.getAttribute('data-img3');
            const img4Src = this.getAttribute('data-img4');

            // Cập nhật Model và các ảnh nhỏ
            twilightWrapper.querySelector('#tw-detail-model').setAttribute('src', modelSrc);
            twilightWrapper.querySelector('#tw-detail-img1').src = img1Src;
            twilightWrapper.querySelector('#tw-detail-img2').src = img2Src;
            twilightWrapper.querySelector('#tw-detail-img3').src = img3Src;
            twilightWrapper.querySelector('#tw-detail-img4').src = img4Src;

            // BẮT ĐẦU HIỆU ỨNG TRƯỢT (GSAP FLIP)
            const state = Flip.getState(img);

            // Chuyển ảnh cá sang container đích trong màn hình chi tiết
            targetContainer.appendChild(img);

            // Hiện màn hình chi tiết, ẩn lưới cá
            gridContainer.style.display = 'none';
            detailView.style.display = 'block';

            Flip.from(state, {
                duration: 1,
                ease: "power2.inOut",
                onComplete: () => {
                    // Hiện các khối nội dung với hiệu ứng mờ dần (tw-detail-fade)
                    gsap.fromTo(twilightWrapper.querySelectorAll('.tw-detail-fade'), 
                        { opacity: 0, y: 20 }, 
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
                    );
                }
            });
        });
    });

    // 4. Nút quay lại (Sử dụng ID tw-back-btn)
    backBtn.addEventListener('click', () => {
        if (!activeImage || !originalParent) return;

        const state = Flip.getState(activeImage);
        
        // Trả ảnh cá về vị trí cũ trong lưới
        originalParent.insertBefore(activeImage, originalParent.firstChild);

        detailView.style.display = 'none';
        gridContainer.style.display = 'grid';

        Flip.from(state, {
            duration: 1,
            ease: "power2.inOut"
        });
    });
});