// Đăng ký Plugin ScrollTo của GSAP
gsap.registerPlugin(ScrollToPlugin);

// Lắng nghe sự kiện click vào nút LETS DIVE
const diveButton = document.getElementById("dive-btn");

if (diveButton) {
    diveButton.addEventListener("click", () => {
        // Dùng GSAP để cuộn màn hình mượt mà
        gsap.to(window, {
            duration: 1.5, // Thời gian cuộn (1.5 giây - cuộn chậm rớt xuống đáy biển)
            scrollTo: {
                y: "#sunlight-zone", // Mục tiêu cuộn tới (ID của section đầu tiên)
                offsetY: 60 // Trừ hao đi 60px của thanh Navbar (nếu bạn có Navbar cố định ở trên)
            },
            ease: "power2.inOut" // Gia tốc cuộn: nhanh ở giữa, chậm lúc đầu và cuối
        });
    });
}