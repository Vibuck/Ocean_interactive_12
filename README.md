## 🚀 Giới thiệu
**Ocean Interactive** là một Web tương tác 2.5D mô phỏng hành trình khám phá đại dương. Dự án sử dụng **GSAP ScrollTrigger** để điều hướng không gian và tích hợp **Minigame "Ocean Cleaner"** giúp người dùng vừa giải trí vừa nâng cao ý thức bảo vệ môi trường biển.

## 📁 Project Structure

    BT_DHMT/
    ├── index.html              # Cấu trúc DOM chính & Overlay Game
    ├── css/                    # Quản lý giao diện (Module hóa)
    │   ├── global.css          # Định dạng cốt lõi & Parallax Background 500vh
    │   ├── sunlight.css        # UI Tầng mặt nước (0m - 200m)
    │   ├── twilight.css        # UI Tầng chạng vạng (200m - 1000m)
    │   ├── midnight.css        # UI Tầng biển sâu (1000m - 4000m)
    │   └── abyssal.css         # UI Tầng đáy vực (> 4000m)
    ├── js/                     # Logic xử lý (Vanilla ES6)
    │   ├── main.js             # Event listeners & Hệ thống âm thanh
    │   ├── minigame.js         # Engine trò chơi: Vòng lặp, Va chạm, Tính điểm
    │   ├── mouse.js            # HTML5 Canvas vẽ vệt chém (Slash effect)
    │   └── [tầng_biển].js      # GSAP ScrollTrigger điều khiển cảnh quan
    └── asset/                  # Kho tài nguyên đa phương tiện
        ├── Images/             # Ảnh nền đại dương, ảnh sinh vật, video mô phỏng (All_background1.jpg)
        ├── Model_3D/           # File .glb (Rác, Rùa, Cá hề, Tàu Titanic...)
        └── Audio/              # Nhạc nền BGM & Hiệu ứng SFX

## 📦 Assets Detail

### 3D Models (`.glb`)
* **Minigame Targets**: `trash1_minigame`, `turtle_minigame`... (Kết xuất qua thẻ model-viewer).
* **Rewards**: `titanic.glb` (Mốc 2000 điểm), `aquaman.glb` (Mốc 3000 điểm).

### Audio (`.mp3`)
* **BGM**: `ocean_bgm.mp3` (Nhạc nền đại dương).
* **SFX**: `slash.mp3` (Âm thanh chém rác), `reward.mp3` (Âm thanh nhận thưởng).

## 🎮 Hệ thống Minigame (Ocean Cleaner)

Trò chơi chạy trên vòng lặp `requestAnimationFrame` với cơ chế tăng dần độ khó:

| Đối tượng | Điểm số | Hành vi AI |
| :--- | :--- | :--- |
| **Rác thải nhựa** | **+10** | Rơi tự động, tốc độ tăng theo thời gian. |
| **Gói quà lớn** | **+50** | Xuất hiện hiếm, rơi nhanh. |
| **Rùa / Cá hề** | **-10** | Sinh vật biển, xuất hiện xen kẽ để gây nhiễu. |
| **Sao biển Patrick**| **-50** | Bay ngang màn hình, trừ điểm cực nặng nếu chém nhầm. |

## 🕹️ Điều khiển (Controls)

* **Cuộn chuột (Scroll)**: Lặn xuống các tầng đại dương (Kích hoạt GSAP ScrollTrigger).
* **Kéo / Giữ chuột trái**: Vẽ vệt chém (Slash) lên Canvas để dọn rác trong Minigame.
* **Click (Lên Model 3D)**: Xoay, thu phóng và tương tác trực tiếp với vật thể.
* **Góc UI (Nút Loa)**: Bật / Tắt toàn bộ hệ thống âm thanh phân lớp.

## 💻 Cài đặt & Chạy thử

Dự án là Web tĩnh thuần (Client-side), không yêu cầu cài đặt Node.js hay Build Tools.

1. Clone repo:
    
    git clone [https://github.com/your-username/BT_DHMT.git](https://github.com/your-username/BT_DHMT.git)

2. Mở thư mục bằng VS Code.
3. Click chuột phải vào file `index.html` -> Chọn **Open with Live Server** để đảm bảo các tài nguyên 3D (`.glb`) được tải đúng giao thức mạng.

---
<div align="center">
  <p><i>Phát triển bởi Group 12 © 2024. Dự án vì mục đích giáo dục môi trường biển.</i></p>
</div>
