// JavaScript cho hiệu ứng hover trên các đoạn thông tin trong Midnight Zone

// Fish data
const fishData = {
    stomiidae: {
        name: 'Cá rồng biển sâu',
        image: 'asset/Images/Background/Ca_rong_bien_sau.png',
        model: 'https://example.com/model1.html', // Replace with actual 3D model URL
        video: 'asset/Videos/Ca_rong_bien_sau.mp4', // Update to your local video path
        description: `
            <p><strong>Tên khoa học:</strong>  Stomiidae.</p>
            <p><strong>Kích thước:</strong> khoảng 15–40 cm (tùy loài)</p>
            <p><strong>Đặc tính:</strong> Có những bộ lạc sinh học (photophores) phát sáng để cách xa hoặc hẹp chân. Mắt rất nhạy cảm với ánh sáng yếu. Cơ thể đen sì để tránh bị con mồi nhìn thấy.</p>
            <p><strong>Chế độ ăn:</strong> Là những con thú ăn thịt hung tợn, có thể nuốt những con cá bằng hoặc lớn hơn chính nó. Sử dụng những chiếc răng dài để cắn giữ con mồi.</p>
        `
    },
    lophiiformes: {
        name: 'Cá cần câu',
        image: 'asset/Images/Background/Ca_can_cau.png',
        model: 'https://example.com/model2.html', // Replace with actual 3D model URL
        video: 'asset/Videos/Ca_can_cau.mp4', // Update to your local video path
        description: `
            <p><strong>Tên khoa học:</strong> Lophiiformes.</p>
            <p><strong>Kích thước:</strong> khoảng 20–100 cm (tùy loài). </p>
            <p><strong>Đặc tính:</strong> Cá đực sẽ dính vào cá cái (Ký sinh). Sử dụng ánh sáng mồi để lôi cuốn con mồi trong bóng tối.</p>
            <p><strong>Chế độ ăn:</strong> Ăn các loài cá và sinh vật biển nhỏ hơn. Hầu như không chuyển động, chỉ ngồi chờ con mồi bị mồi của chúng thu hút.</p>
        `
    },
    'vampyroteuthis infernalis': {
        name: 'Mực ma cà rồng',
        image: 'asset/Images/Background/Muc_ma_ca_rong.png',
        model: 'https://example.com/model3.html', // Replace with actual 3D model URL
        video: 'asset/Videos/Muc_ma_ca_rong.mp4', // Update to your local video path
        description: `
            <p><strong>Tên khoa học:</strong> Vampyroteuthis infernalis.</p>
            <p><strong>Kích thước:</strong> Khoảng 30cm.</p>
            <p><strong>Đặc tính:</strong> Có những bộ lạc sinh học trên cơ thể. Khi bị đe dọa, nó có thể thay đổi màu sắc và hình dạng. Có thể "quay" bao tay của nó để bảo vệ bộ não.</p>
            <p><strong>Chế độ ăn:</strong> Ăn những mảnh hữu cơ rơi từ trên (tuyết biển), những sinh vật bé xíu, và trứng cá. Có khả năng chịu đói lâu dài.</p>
        `
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Fish Detail Page Functionality
    const fishCards = document.querySelectorAll('.fish-card');
    const detailPage = document.getElementById('fish-detail-page');
    const detailBackBtn = document.querySelector('.fish-detail-back');
    const detailModelBtn = document.querySelector('.fish-detail-model');
    const detailVideoBtn = document.querySelector('.fish-detail-video');
    const detailFishImage = document.getElementById('detail-fish-image');
    const detailFishName = document.getElementById('detail-fish-name');
    const detailFishDescription = document.getElementById('detail-fish-description');
    const fishGrid = document.querySelector('.fish-grid');
    const fishDetailContainer = document.querySelector('.fish-detail-container');
    const videoContainer = document.getElementById('video-container');
    const detailVideo = document.getElementById('detail-video');

    let currentFish = null;
    let isVideoMode = false;

    fishCards.forEach(card => {
        card.addEventListener('click', function() {
            const fishType = this.getAttribute('data-fish');
            const fish = fishData[fishType];
            
            if (fish) {
                currentFish = fish;
                // Get the clicked image element
                const clickedImage = this.querySelector('.fish-image');
                const rect = clickedImage.getBoundingClientRect();
                
                // Set detail page content
                detailFishImage.src = fish.image;
                detailFishName.textContent = fish.name;
                detailFishDescription.innerHTML = fish.description;
                
                // Show detail page
                detailPage.classList.remove('hidden');
                
                // Animate image with GSAP
                gsap.fromTo(
                    detailFishImage,
                    {
                        width: rect.width,
                        height: rect.height,
                        x: rect.left - (window.innerWidth / 2 - rect.width / 2),
                        y: rect.top - 60,
                        opacity: 0.8
                    },
                    {
                        width: '100%',
                        height: 'auto',
                        x: 0,
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.inOut'
                    }
                );
                
                // Animate info text
                gsap.fromTo(
                    '.fish-detail-info',
                    {
                        opacity: 0,
                        x: 50
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        delay: 0.2,
                        ease: 'power2.inOut'
                    }
                );
                
                // Hide fish grid
                fishGrid.style.display = 'none';
            }
        });
    });

    // Back button
    detailBackBtn.addEventListener('click', function() {
        if (isVideoMode) {
            // Close video mode
            videoContainer.classList.add('hidden');
            fishDetailContainer.classList.remove('hidden');
            detailModelBtn.classList.remove('hidden');
            detailVideoBtn.classList.remove('hidden');
            detailVideo.pause();
            detailVideo.currentTime = 0;
            isVideoMode = false;
        } else {
            // Normal back
            detailPage.classList.add('hidden');
            fishGrid.style.display = 'grid';
            const midnightElement = document.getElementById('midnight-wrapper');
            if (midnightElement) {
                window.scrollTo(0, midnightElement.getBoundingClientRect().top + window.scrollY);
            }
        }
    });

    // Model button
    detailModelBtn.addEventListener('click', function() {
        if (currentFish && currentFish.model) {
            window.open(currentFish.model, '_blank');
        }
    });

    // Video button
    detailVideoBtn.addEventListener('click', function() {
        if (currentFish && currentFish.video) {
            isVideoMode = true;
            fishDetailContainer.classList.add('hidden');
            videoContainer.classList.remove('hidden');
            detailModelBtn.classList.add('hidden');
            detailVideoBtn.classList.add('hidden');
            detailVideo.src = currentFish.video;
            detailVideo.load(); // Ensure video is loaded
            detailVideo.play();
        }
    });

    const paragraphs = document.querySelectorAll('#midnight-info p');

    paragraphs.forEach(p => {
        p.addEventListener('mouseenter', function() {
            // Thêm hiệu ứng dưới nước cho đoạn này
            this.classList.add('underwater');

            // Làm mờ và nhỏ các đoạn khác
            paragraphs.forEach(other => {
                if (other !== this) {
                    other.classList.add('dimmed');
                }
            });
        });

        p.addEventListener('mouseleave', function() {
            // Gỡ bỏ hiệu ứng
            paragraphs.forEach(par => {
                par.classList.remove('underwater', 'dimmed');
            });
        });
    });
});