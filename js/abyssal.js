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
            title: "Bộ giáp mềm",
            desc1: "Bộ giáp mềm là nhóm giáp xác nhỏ sống từ nước ngọt đến đại dương sâu, có cơ thể cong, nhiều chân và thường sống ở đáy biển. Chúng ăn xác sinh vật và mảnh hữu cơ, đóng vai trò quan trọng trong việc tái chế chất dinh dưỡng.",
            desc2: "Một số loài sống ở rãnh đại dương rất sâu (hơn 10.000 m) và có hiện tượng “khổng lồ hóa” với kích thước lớn hơn bình thường (tới 20–30 cm). Ngoài ra, nhiều  biển sâu còn chứa vi nhựa, cho thấy ô nhiễm đã lan tới cả những vùng sâu nhất của đại dương.",
            imgMain: "asset/Images/amphipod3.png",
            img1: "asset/Images/amphipod2.jpg",
            img2: "asset/Images/amphipod1.jpg",
            video: "asset/Videos/amphipodvideo.mp4",
            model3d: "asset/Model_3D/Fish_model/amphipod.glb",
            
        },
        "lophiiformes": {
            title: "Bạch tuộc Dumbo",
            desc1: "Bạch tuộc Dumbo là loài bạch tuộc nhỏ (khoảng 30 cm), nổi bật với “tai” giống voi nên trông rất dễ thương. Chúng sống ở độ sâu cực lớn (tới ~7.000 m), thuộc nhóm bạch tuộc ô với các xúc tu có màng như chiếc ô.",
            desc2: "Khác với nhiều loài khác, Dumbo không có túi mực, nuốt con mồi nguyên con và ăn các sinh vật nhỏ dưới đáy biển. Chúng có khả năng sinh sản quanh năm và thích nghi rất tốt với môi trường đại dương sâu khắc nghiệt.",
            imgMain: "asset/Images/dumbo3.png",
            img1: "asset/Images/dumbo2.webp",
            img2: "asset/Images/dumbo1.jpg",
            video: "asset/Videos/dumbovideo.mp4",
            model3d: "asset/Model_3D/Fish_model/dumbo_octopus2.glb",
        },
        "vampyroteuthis": {
            title: "Cá ốc sên",
            desc1: "Cá ốc sên là nhóm cá biển sâu có cơ thể mềm, gần như trong suốt và ít xương, giúp chịu được áp suất cực lớn. Chúng sống ở vùng nước rất sâu (6.000–8.000 m), thậm chí hơn 8.300 m – thuộc những loài cá sống sâu nhất từng ghi nhận.",
            desc2: "Nhờ cấu trúc cơ thể đặc biệt và chất TMAO giúp ổn định protein, cá ốc sên có thể tồn tại trong môi trường khắc nghiệt mà nhiều loài khác không sống được. Tuy nhiên, cơ thể chúng rất dễ bị “tan rã” khi đưa lên mặt nước do thay đổi áp suất.",
            imgMain: "asset/Images/snailfish3.png",
            img1: "asset/Images/snailfish2.jpg",
            img2: "asset/Images/snailfish1.jpg",
            video: "asset/Videos/snailfishvideo.mp4",
            
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
                const modelViewer = document.getElementById('modal-model-viewer');
                if (modelViewer) {
                    // Nếu có link 3D thì gán vào, không thì để trống
                    modelViewer.src = data.model3d ? data.model3d : ""; 
                }

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