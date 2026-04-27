// Cấu hình tài nguyên (Đường dẫn dựa trên ảnh bạn cung cấp)
const GAME_ASSETS = [
    { path: 'asset/Model_3D/Minigame/trash1_minigame.glb', points: 10 },
    { path: 'asset/Model_3D/Minigame/trash2_minigame.glb', points: 10 },
    { path: 'asset/Model_3D/Minigame/grandprize_minigame.glb', points: 50 },
    { path: 'asset/Model_3D/Minigame/turtle_minigame.glb', points: -10 },
    { path: 'asset/Model_3D/Minigame/clownfish_minigame.glb', points: -10 },
    { path: 'asset/Model_3D/Minigame/patrickstar_minigame.glb', points: -50 }
];

let gameScene, gameCamera, gameRenderer;
let activeObjects = [];
let loadedModels = [];
let gameScore = 0;
let isGameRunning = false;

// Hệ số độ khó
let spawnIntervalTime = 1500; // Ban đầu 1.5s ra 1 vật
let baseSpeed = 0.15; // Tốc độ bay ban đầu
let gameDifficultyTimer;

// DOM Elements
const modal = document.getElementById('game-modal');
const container = document.getElementById('game-canvas-container');
const scoreEl = document.getElementById('game-score');

// 1. KHỞI TẠO THREE.JS VÀ LOAD MODEL
function initMiniGame() {
    gameScene = new THREE.Scene();
    gameScene.fog = new THREE.FogExp2(0x001e3f, 0.02);

    gameCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    gameCamera.position.z = 15;

    gameRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    gameRenderer.setSize(window.innerWidth, window.innerHeight);
    container.innerHTML = ''; 
    container.appendChild(gameRenderer.domElement);

    // Ánh sáng
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    gameScene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(0, 10, 5);
    gameScene.add(dirLight);

    // Load tất cả model trước khi chơi
    const loader = new THREE.GLTFLoader();
    GAME_ASSETS.forEach(asset => {
        loader.load(asset.path, (gltf) => {
            const model = gltf.scene;
            model.userData.points = asset.points; // Gắn điểm vào model
            // Scale cho vừa vặn (Bạn có thể phải tinh chỉnh lại số 2 này tùy độ to của file gốc)
            model.scale.set(2, 2, 2); 
            loadedModels.push(model);
        });
    });

    setupSlicing();
}

// 2. LOGIC SPAWN VÀ BAY LÊN (Kinematics)
function spawnObject() {
    if (!isGameRunning || loadedModels.length === 0) return;

    // Chọn ngẫu nhiên 1 model đã load
    const randomModel = loadedModels[Math.floor(Math.random() * loadedModels.length)];
    const clone = randomModel.clone();

    // Vị trí xuất phát ở dưới đáy màn hình
    clone.position.set((Math.random() - 0.5) * 20, -12, (Math.random() - 0.5) * 5);
    
    // Random xoay
    clone.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    // Vận tốc (Bay lên + bay ngang chút xíu)
    clone.userData.velocityY = baseSpeed + (Math.random() * 0.1); 
    clone.userData.velocityX = (Math.random() - 0.5) * 0.05;
    clone.userData.rotationSpeed = (Math.random() - 0.5) * 0.1;

    gameScene.add(clone);
    activeObjects.push(clone);

    // Hẹn giờ spawn tiếp (Tăng độ khó)
    setTimeout(spawnObject, spawnIntervalTime);
}

// 3. VÒNG LẶP RENDER (Xử lý trọng lực)
function animateGame() {
    if (!isGameRunning) return;
    requestAnimationFrame(animateGame);

    for (let i = activeObjects.length - 1; i >= 0; i--) {
        let obj = activeObjects[i];
        
        // Cập nhật vị trí
        obj.position.y += obj.userData.velocityY;
        obj.position.x += obj.userData.velocityX;
        obj.rotation.x += obj.userData.rotationSpeed;
        obj.rotation.y += obj.userData.rotationSpeed;

        // Trọng lực kéo xuống dần
        obj.userData.velocityY -= 0.003; 

        // Nếu rớt khỏi màn hình -> Xóa
        if (obj.position.y < -15) {
            gameScene.remove(obj);
            activeObjects.splice(i, 1);
        }
    }

    gameRenderer.render(gameScene, gameCamera);
}

// 4. HỆ THỐNG CHÉM (Slicing & Raycaster)
function setupSlicing() {
    let isDragging = false;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Setup hiệu ứng vẽ vệt chém (2D Canvas cho nhẹ mượt)
    const slashCanvas = document.getElementById('slash-canvas');
    const ctx = slashCanvas.getContext('2d');
    slashCanvas.width = window.innerWidth;
    slashCanvas.height = window.innerHeight;
    let slashPoints = [];

    container.addEventListener('mousedown', () => { isDragging = true; slashPoints = []; });
    container.addEventListener('mouseup', () => { isDragging = false; ctx.clearRect(0,0,slashCanvas.width, slashCanvas.height); });
    
    container.addEventListener('mousemove', (event) => {
        if (!isDragging || !isGameRunning) return;

        // --- 1. Vẽ vệt nước chém ---
        slashPoints.push({x: event.clientX, y: event.clientY, age: 0});
        ctx.clearRect(0, 0, slashCanvas.width, slashCanvas.height);
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)'; // Màu nước biển lấp lánh
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 10;
        
        if(slashPoints.length > 0) ctx.moveTo(slashPoints[0].x, slashPoints[0].y);
        for (let i = 1; i < slashPoints.length; i++) {
            ctx.lineTo(slashPoints[i].x, slashPoints[i].y);
        }
        ctx.stroke();
        
        // Cắt bớt đuôi vệt chém (hiệu ứng mờ dần)
        if(slashPoints.length > 10) slashPoints.shift();

        // --- 2. Xử lý va chạm 3D (Raycasting) ---
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, gameCamera);

        const intersects = raycaster.intersectObjects(activeObjects, true); // true để lấy cả model con

        if (intersects.length > 0) {
            // Lấy group model gốc chứa điểm
            let hitObject = intersects[0].object;
            while(!hitObject.userData.points && hitObject.parent) {
                hitObject = hitObject.parent;
            }

            if(hitObject.userData.points && !hitObject.userData.isHit) {
                hitObject.userData.isHit = true; // Đánh dấu đã chém
                gameScore += hitObject.userData.points;
                scoreEl.innerText = gameScore;

                // Hiệu ứng vật thể nổ (Scale nhỏ đi)
                hitObject.scale.set(0,0,0); 

                // Xóa khỏi mảng để không render nữa
                const index = activeObjects.indexOf(hitObject);
                if(index > -1) activeObjects.splice(index, 1);
            }
        }
    });
}

// 5. QUẢN LÝ ĐỘ KHÓ
function increaseDifficulty() {
    if(!isGameRunning) return;
    // Cứ 5 giây tăng tốc độ và mật độ một chút
    spawnIntervalTime = Math.max(500, spawnIntervalTime - 100); // Nhanh nhất là 0.5s ra 1 cái
    baseSpeed = Math.min(0.35, baseSpeed + 0.02); // Tốc độ giới hạn ở 0.35
}

// 6. NÚT ĐIỀU KHIỂN
document.getElementById('start-minigame-btn').addEventListener('click', () => {
    modal.style.display = 'block';
    if(!gameScene) initMiniGame(); // Khởi tạo lần đầu
    
    // Reset Game
    isGameRunning = true;
    gameScore = 0;
    scoreEl.innerText = gameScore;
    spawnIntervalTime = 1500;
    baseSpeed = 0.15;
    
    // Dọn sạch rác cũ nếu có
    activeObjects.forEach(obj => gameScene.remove(obj));
    activeObjects = [];

    spawnObject();
    animateGame();
    gameDifficultyTimer = setInterval(increaseDifficulty, 5000);
});

document.getElementById('close-game-btn').addEventListener('click', () => {
    modal.style.display = 'none';
    isGameRunning = false;
    clearInterval(gameDifficultyTimer);
});