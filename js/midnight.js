// JavaScript cho hiệu ứng hover trên các đoạn thông tin trong Midnight Zone
document.addEventListener("DOMContentLoaded", () => {
    const bubbles = document.querySelectorAll('.mn-bubble');
    const modal = document.getElementById('mn-info-card');
    const modalBody = document.getElementById('mn-card-body');
    const closeBtn = document.getElementById('mn-close-btn');

    bubbles.forEach(bubble => {
        // 1. Khởi tạo vị trí và vận tốc ngẫu nhiên
        let x = Math.random() * (window.innerWidth - 120);
        let y = Math.random() * (window.innerHeight - 120);
        let dx = (Math.random() - 0.5) * 1.2; 
        let dy = (Math.random() - 0.5) * 1.2;

        function moveBubble() {
            x += dx;
            y += dy;

            // Va chạm biên (giới hạn trong vùng Midnight)
            if (x <= 0 || x >= window.innerWidth - 120) dx *= -1;
            if (y <= 0 || y >= window.innerHeight - 120) dy *= -1;

            bubble.style.left = x + 'px';
            bubble.style.top = y + 'px';

            requestAnimationFrame(moveBubble);
        }
        moveBubble();

        // 2. Click mở thông tin
        bubble.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = bubble.getAttribute('data-id');
            const content = document.getElementById(`mn-data-${id}`).innerHTML;
            modalBody.innerHTML = content;
            modal.classList.add('mn-show');
        });
    });

    // 3. Đóng bảng
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('mn-show');
    });

    // Click ra ngoài bảng để đóng
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('mn-show');
    });
});
// 1. Tự đóng khi người dùng cuộn chuột (Scroll)
window.addEventListener('scroll', () => {
    const modal = document.getElementById('mn-info-card');
    if (modal.classList.contains('mn-show')) {
        modal.classList.remove('mn-show');
    }
});
// 2. Tự đóng khi chuột rời khỏi khu vực Midnight (Tùy chọn)
const midnightSection = document.getElementById('midnight-wrapper');
midnightSection.addEventListener('mouseleave', () => {
    const modal = document.getElementById('mn-info-card');
    modal.classList.remove('mn-show');
});
// Fish data
const fishData = {
    stomiidae: {
        name: 'Cá rồng biển sâu',
        image: [ 'asset/Images/Background/Ca_rong_bien_sau_1.jpg',
                 'asset/Images/Background/Ca_rong_bien_sau_2.webp',
                 'asset/Images/Background/Ca_rong_bien_sau_3.jpg',
                 'asset/Images/Background/Ca_rong_bien_sau_4.jpg'
                ],
        video: 'asset/Videos/Ca_rong_bien_sau.mp4', 
        modelPath: 'asset/Model_3D/Fish_model/dragon.glb',
        description: `
            <p><strong>Tên khoa học:</strong>  Stomiidae.</p>
            <p><strong>Kích thước:</strong> khoảng 15–40 cm (tùy loài)</p>
            <p><strong>Đặc tính:</strong> Có những bộ lạc sinh học (photophores) phát sáng để cách xa hoặc hẹp chân. Mắt rất nhạy cảm với ánh sáng yếu. Cơ thể đen sì để tránh bị con mồi nhìn thấy.</p>
            <p><strong>Chế độ ăn:</strong> Là những con thú ăn thịt hung tợn, có thể nuốt những con cá bằng hoặc lớn hơn chính nó. Sử dụng những chiếc răng dài để cắn giữ con mồi.</p>
        `
    },
    lophiiformes: {
        name: 'Cá cần câu',
        image: [ 'asset/Images/Background/Ca_can_cau_1.jpg',
                 'asset/Images/Background/Ca_can_cau_2.jpg',
                 'asset/Images/Background/Ca_can_cau_3.jpg',
                 'asset/Images/Background/Ca_can_cau_4.jpg'
                ],
        video: 'asset/Videos/Ca_can_cau.mp4', 
        modelPath: 'asset/Model_3D/Fish_model/anglerfish.glb',
        description: `
            <p><strong>Tên khoa học:</strong> Lophiiformes.</p>
            <p><strong>Kích thước:</strong> khoảng 20–100 cm (tùy loài). </p>
            <p><strong>Đặc tính:</strong> Cá đực sẽ dính vào cá cái (Ký sinh). Sử dụng ánh sáng mồi để lôi cuốn con mồi trong bóng tối.</p>
            <p><strong>Chế độ ăn:</strong> Ăn các loài cá và sinh vật biển nhỏ hơn. Hầu như không chuyển động, chỉ ngồi chờ con mồi bị mồi của chúng thu hút.</p>
        `
    },
    vampyroteuthis : {
        name: 'Mực ma cà rồng',
        image: [ 'asset/Images/Background/Muc_ma_ca_rong_1.jpg',
                 'asset/Images/Background/Muc_ma_ca_rong_2.jpg',
                 'asset/Images/Background/Muc_ma_ca_rong_3.jpg',
                 'asset/Images/Background/Muc_ma_ca_rong_4.jpg'
                ],
        video: 'asset/Videos/Muc_ma_ca_rong.mp4', 
        modelPath: 'asset/Model_3D/Fish_model/squid.glb',
        description: `
            <p><strong>Tên khoa học:</strong> Vampyroteuthis infernalis.</p>
            <p><strong>Kích thước:</strong> Khoảng 30cm.</p>
            <p><strong>Đặc tính:</strong> Có những bộ lạc sinh học trên cơ thể. Khi bị đe dọa, nó có thể thay đổi màu sắc và hình dạng. Có thể "quay" bao tay của nó để bảo vệ bộ não.</p>
            <p><strong>Chế độ ăn:</strong> Ăn những mảnh hữu cơ rơi từ trên (tuyết biển), những sinh vật bé xíu, và trứng cá. Có khả năng chịu đói lâu dài.</p>
        `
    }
};

    const paragraphs = document.querySelectorAll('#midnight-info p');

    paragraphs.forEach(p => {
        p.addEventListener('mouseenter', function() {            
            this.classList.add('underwater');
            paragraphs.forEach(other => {
                if (other !== this) {
                    other.classList.add('dimmed');
                }
            });
        });
        p.addEventListener('mouseleave', function() {
            paragraphs.forEach(par => {
                par.classList.remove('underwater', 'dimmed');
            });
        });
    });

document.addEventListener("DOMContentLoaded", () => {
    const detailPage = document.getElementById('fish-detail-page');
    const backBtn = document.querySelector('.fish-detail-back');

    document.addEventListener('click', (e) => {
        const card = e.target.closest('.fish-card');
        if (!card) return;

        const fishID = card.getAttribute('data-fish');
        const data = fishData[fishID]; 

        if (data) {
            
            document.getElementById('det-name').innerText = data.name;
            document.getElementById('det-description').innerHTML = data.description;
            
            
            const videoContainer = document.getElementById('det-video-container');
            if (data.video && videoContainer) {
                videoContainer.innerHTML = `
                    <video controls width="100%" style="border-radius: 20px; margin-top: 20px; box-shadow: 0 0 15px rgba(0, 208, 255, 0.36);">
                        <source src="${data.video}" type="video/mp4">
                    </video>
                `;
            }            
            for (let i = 0; i < 4; i++) {
                const imgElement = document.getElementById(`det-img-${i + 1}`);
                if (imgElement) {                    
                    imgElement.src = data.image[i] ? data.image[i] : ""; 
                }
            }

            // 4. Cập nhật Model 3D 
            const modelViewport = document.getElementById('model-viewport');
            if (data.modelPath) {
                modelViewport.innerHTML = `
                    <model-viewer 
                        src="${data.modelPath}" 
                        ar 
                        camera-controls 
                        auto-rotate 
                        shadow-intensity="1" 
                        style="width: 100%; height: 100%; background-color: unset;">
                    </model-viewer>
                `;
            } else {
                modelViewport.innerHTML = `<div style="text-align:center; padding-top:150px; color:#555;">Model 3D đang được xử lý...</div>`;
            }
            detailPage.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    });
    backBtn.addEventListener('click', () => {
        detailPage.classList.add('hidden');
        document.body.style.overflow = 'auto';
        if(document.getElementById('det-video-container')) document.getElementById('det-video-container').innerHTML = "";
        document.getElementById('model-viewport').innerHTML = "";
    });
});
const modelViewport = document.getElementById('model-viewport');

