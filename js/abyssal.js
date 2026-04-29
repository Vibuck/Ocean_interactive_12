document.addEventListener("DOMContentLoaded", () => {
    // Đăng ký Plugin GSAP[cite: 2]
    gsap.registerPlugin(ScrollTrigger);

    /* ============================================================
       1. HIỆU ỨNG CUỘN NGANG 3 ẢNH THÔNG TIN
       ============================================================ */
    gsap.to(".info-horizontal-wrapper", {
        xPercent: -66.66, 
        ease: "none",
        scrollTrigger: {
            trigger: "#abyssal-info-scroll",
            start: "top top",
            end: "+=200%", 
            pin: true,     
            scrub: 1,
            snap: 1 / 2    
        }
    });

    /* ============================================================
       2. HIỆU ỨNG 3 CON CÁ BUNG RA
       ============================================================ */
    const tlFish = gsap.timeline({
        scrollTrigger: {
            trigger: "#abyssal-fish-animation",
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
        }
    });

    tlFish.to(".fish-left", { 
        xPercent: -150, 
        rotation: -10, 
        duration: 2 
    })
    .to(".fish-right", { 
        xPercent: 150,  
        rotation: 10, 
        duration: 2 
    }, 0)
    .to(".fish-center", { 
        scale: 1.1,     
        duration: 2 
    }, 0);

    /* ============================================================
       3. DỮ LIỆU VÀ XỬ LÝ MODAL (PHẢI NẰM TRONG DOMCONTENTLOADED)
       ============================================================ */
    const fishData = {
        "stomiidae": {
            title: "Cá Rồng Biển Sâu",
            desc1: "Sống ở độ sâu cực hạn, có bộ răng sắc nhọn và cơ thể dài bóng loáng.",
            desc2: "Chúng sử dụng các cơ quan phát quang sinh học dọc theo cơ thể để săn mồi.",
            imgMain: "asset/Images/Background/Ca_rong_bien_sau.png",
            img1: "asset/Images/Background/ảnh 1.png",
            img2: "asset/Images/Background/ảnh 2.png",
            video: "asset/Videos/stomiidae.mp4"
        },
        "lophiiformes": {
            title: "Cá Cần Câu",
            desc1: "Sở hữu một chiếc cần câu phát sáng mọc ra từ đầu để dẫn dụ con mồi.",
            desc2: "Chiếc miệng khổng lồ cho phép chúng nuốt chửng những con mồi lớn hơn cả cơ thể mình.",
            imgMain: "asset/Images/Background/Ca_can_cau.png",
            img1: "asset/Images/Background/ảnh 2.png",
            img2: "asset/Images/Background/ảnh 3.png",
            video: "asset/Videos/lophiiformes.mp4"
        },
        "vampyroteuthis": {
            title: "Mực Ma Cà Rồng",
            desc1: "Một loài động vật thân mềm sống ở vùng biển tối tăm nhất đại dương.",
            desc2: "Dù tên là ma cà rồng nhưng chúng chỉ ăn 'tuyết biển' - các mảnh vụn hữu cơ trôi lơ lửng.",
            imgMain: "asset/Images/Background/Muc_ma_ca_rong.png",
            img1: "asset/Images/Background/ảnh 3.png",
            img2: "asset/Images/Background/ảnh 1.png",
            video: "asset/Videos/vampire_squid.mp4"
        }
    };

    // Gán sự kiện click cho các thẻ cá
   // Gán sự kiện click cho các thẻ cá
    document.querySelectorAll('.fish-item').forEach(item => {
        item.style.cursor = "pointer"; // Hiện bàn tay khi hover
        item.addEventListener('click', function() {
            const fishId = this.getAttribute('data-fish'); 
            const data = fishData[fishId];

            console.log("Đang mở cá:", fishId); // Kiểm tra xem máy có nhận lệnh click không

            if(data) {
                const modal = document.getElementById('fish-modal');
                
                document.getElementById('modal-title').innerText = data.title;
                document.getElementById('modal-desc-1').innerText = data.desc1;
                document.getElementById('modal-desc-2').innerText = data.desc2;
                document.getElementById('modal-img-main').src = data.imgMain;
                document.getElementById('modal-img-1').src = data.img1;
                document.getElementById('modal-img-2').src = data.img2;
                document.getElementById('modal-video').src = data.video;

                modal.style.display = 'block'; // Hiện modal
                document.body.style.overflow = 'hidden'; // Khóa cuộn trang
            } else {
                console.error("Không tìm thấy dữ liệu cho cá:", fishId);
            }
        });
    });

    // Sự kiện Đóng Modal
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            document.getElementById('fish-modal').style.display = 'none';
            document.getElementById('modal-video').pause(); 
            // Mở lại cuộn trang
            document.body.style.overflow = 'auto';
        };
    }
});