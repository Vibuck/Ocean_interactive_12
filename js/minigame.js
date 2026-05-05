// ==================== CẤU HÌNH TÀI NGUYÊN ====================
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
let activeParticles = []; 
let bubbleParticles = []; // Mảng quản lý bong bóng
let loadedModels = [];
let gameScore = 0;
let isGameRunning = false;
let currentCombo = 0;
let comboTimeout = null;
let comboUI = null;

let spawnIntervalTime = 1200; 
let baseSpeed = 0.45; 
let gameDifficultyTimer;

const modal = document.getElementById('game-modal');
const container = document.getElementById('game-canvas-container');
const scoreEl = document.getElementById('game-score');
const slashCanvas = document.getElementById('slash-canvas');
let gameWidth, gameHeight;

// ==================== XỬ LÝ BONG BÓNG 2D ====================

// Hàm reset vị trí bong bóng (dùng khi mới tạo và khi bay vượt màn hình)
function resetBubble(bubble) {
    bubble.position.x = (Math.random() - 0.5) * 30; // Phân bổ chiều ngang
    bubble.position.y = -10 - Math.random() * 20;    // Dưới đáy màn hình
    bubble.position.z = -3 - Math.random() * 3;     // Đẩy ra sau để không đè lên rác/cá

    let scale = 0.2 + Math.random() * 0.4;
    bubble.scale.set(scale, scale, 1);

    bubble.userData = {
        speedY: 0.01 + Math.random() * 0.03, // Tốc độ nổi ngẫu nhiên
        sineOffset: Math.random() * Math.PI * 2, // Góc sin ban đầu
        sineSpeed: 0.01 + Math.random() * 0.02,  // Tốc độ lắc lư
        originalX: bubble.position.x
    };
}

// Hàm khởi tạo toàn bộ bong bóng
function createBubbles() {
    // LƯU Ý NHỎ: Ảnh JPG thường không có nền trong suốt, nếu bong bóng bị viền đen, ông hãy đổi sang file PNG nhé.
    const bubbleTexture = new THREE.TextureLoader().load('asset/Images/Minigame/bubble.png'); 
    
    const bubbleMaterial = new THREE.SpriteMaterial({ 
        map: bubbleTexture, 
        transparent: true, 
        opacity: 0.9, 
        depthWrite: false 
    });

    for (let i = 0; i < 20; i++) {
        let sprite = new THREE.Sprite(bubbleMaterial);
        resetBubble(sprite);
        gameScene.add(sprite);
        bubbleParticles.push(sprite);
    }
}

// ==================== KHỞI TẠO GAME ====================

function initMiniGame() {
    gameScene = new THREE.Scene();
    gameScene.fog = new THREE.FogExp2(0x001528, 0.012);

    gameWidth = container.clientWidth;
    gameHeight = container.clientHeight;

    gameCamera = new THREE.PerspectiveCamera(75, gameWidth / gameHeight, 0.1, 1000);
    gameCamera.position.z = 15;

    gameRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    gameRenderer.setSize(gameWidth, gameHeight);
    container.innerHTML = ''; 
    container.appendChild(gameRenderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    gameScene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(0, 10, 5);
    gameScene.add(dirLight);

    // ĐÃ FIX: Gọi hàm sinh bong bóng ngay khi khởi tạo scene
    createBubbles();

    const loader = new THREE.GLTFLoader();
    GAME_ASSETS.forEach(asset => {
        loader.load(asset.path, (gltf) => {
            const model = gltf.scene;
            
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            box.getSize(size);
            
            const maxDim = Math.max(size.x, size.y, size.z) || 1; 
            const targetSize = 3; 
            const scaleRatio = targetSize / maxDim;
            model.scale.set(scaleRatio, scaleRatio, scaleRatio);

            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.sub(center.multiplyScalar(scaleRatio));

            const group = new THREE.Group();
            group.add(model);
            group.userData.points = asset.points; 

            // Hitbox
            const hitGeo = new THREE.SphereGeometry(2.5); 
            const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }); 
            const hitbox = new THREE.Mesh(hitGeo, hitMat);
            hitbox.userData.isHitbox = true; 
            group.add(hitbox);

            loadedModels.push(group);
        });
    });

    setupSlicing();

    window.addEventListener('resize', () => {
        if (!isGameRunning) return;
        gameWidth = container.clientWidth;
        gameHeight = container.clientHeight;
        gameCamera.aspect = gameWidth / gameHeight;
        gameCamera.updateProjectionMatrix();
        gameRenderer.setSize(gameWidth, gameHeight);
        slashCanvas.width = gameWidth;
        slashCanvas.height = gameHeight;
    });
}

function spawnObject() {
    if (!isGameRunning) return;

    if (loadedModels.length === 0) {
        setTimeout(spawnObject, 500);
        return;
    }

    const randomModel = loadedModels[Math.floor(Math.random() * loadedModels.length)];
    const clone = THREE.SkeletonUtils.clone(randomModel);

    const randomX = (Math.random() - 0.5) * 28;
    clone.position.set(randomX, -16, (Math.random() - 0.5) * 4);
    clone.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    clone.userData.velocityY = baseSpeed + (Math.random() * 0.15); 
    clone.userData.velocityX = (Math.random() - 0.5) * 0.15;
    
    clone.userData.rotationSpeedX = (Math.random() - 0.5) * 0.1;
    clone.userData.rotationSpeedY = (Math.random() - 0.5) * 0.1;
    clone.userData.isHit = false; 

    gameScene.add(clone);
    activeObjects.push(clone);

    setTimeout(spawnObject, spawnIntervalTime);
}

function createExplosion(position, isPositivePoints) {
    const particleCount = 12; 
    const color = isPositivePoints ? 0x00ffaa : 0xff3333; 
    const geometry = new THREE.DodecahedronGeometry(0.3); 
    const material = new THREE.MeshBasicMaterial({ color: color });

    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(position);
        particle.userData = {
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6 + 0.2,
            vz: (Math.random() - 0.5) * 0.6,
            life: 1.0
        };
        gameScene.add(particle);
        activeParticles.push(particle);
    }
}

// ==================== VÒNG LẶP CHÍNH (RENDER LOOP) ====================

function animateGame() {
    if (!isGameRunning) return;
    requestAnimationFrame(animateGame);

    // 1. Cập nhật rác/cá bay lên
    for (let i = activeObjects.length - 1; i >= 0; i--) {
        let obj = activeObjects[i];
        
        obj.position.y += obj.userData.velocityY;
        obj.position.x += obj.userData.velocityX;
        obj.rotation.x += obj.userData.rotationSpeedX;
        obj.rotation.y += obj.userData.rotationSpeedY;

        obj.userData.velocityY -= 0.008; 

        if (obj.position.y < -16) {
            gameScene.remove(obj);
            activeObjects.splice(i, 1);
        }
    }

    // 2. Cập nhật vệt nổ particle
    for (let i = activeParticles.length - 1; i >= 0; i--) {
        let p = activeParticles[i];
        p.position.x += p.userData.vx;
        p.position.y += p.userData.vy;
        p.position.z += p.userData.vz;
        
        p.userData.vy -= 0.02; 
        p.userData.life -= 0.02; 
        p.scale.setScalar(p.userData.life); 

        if (p.userData.life <= 0) {
            gameScene.remove(p);
            activeParticles.splice(i, 1);
        }
    }

    // 3. ĐÃ FIX: Cập nhật bong bóng bay uốn lượn
    for (let i = 0; i < bubbleParticles.length; i++) {
        let bubble = bubbleParticles[i];
        
        // Bay dần lên
        bubble.position.y += bubble.userData.speedY;
        // Lắc lư qua lại
        bubble.userData.sineOffset += bubble.userData.sineSpeed;
        bubble.position.x = bubble.userData.originalX + Math.sin(bubble.userData.sineOffset) * 0.4;

        // Nếu bay vượt quá màn hình bên trên thì reset lại xuống dưới
        if (bubble.position.y > 10) {
            resetBubble(bubble);
        }
    }

    gameRenderer.render(gameScene, gameCamera);
}

// ==================== XỬ LÝ CHÉM VÀ LOGIC GAME ====================

function setupSlicing() {
    let isDragging = false;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const ctx = slashCanvas.getContext('2d');
    slashCanvas.width = container.clientWidth;
    slashCanvas.height = container.clientHeight;
    let slashPoints = [];

    function stopDragging() {
        isDragging = false; 
        slashPoints = []; 
        ctx.clearRect(0,0,slashCanvas.width, slashCanvas.height);
    }

    container.addEventListener('mousedown', () => { isDragging = true; slashPoints = []; });
    container.addEventListener('mouseup', stopDragging);
    container.addEventListener('mouseleave', stopDragging); 
    window.addEventListener('mouseup', stopDragging); 

    container.addEventListener('mousemove', (event) => {
        if (!isDragging || !isGameRunning) return;

        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        slashPoints.push({x: x, y: y});
        // ================= BẮT ĐẦU NÂNG CẤP ĐƯỜNG KIẾM =================
        ctx.clearRect(0, 0, slashCanvas.width, slashCanvas.height);
        
        if (slashPoints.length > 1) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round'; // Chỗ gấp khúc sẽ được bo tròn mượt mà

            // LỚP 1: Viền Hào Quang (Glow xanh neon)
            for (let i = 1; i < slashPoints.length; i++) {
                ctx.beginPath();
                ctx.moveTo(slashPoints[i-1].x, slashPoints[i-1].y);
                ctx.lineTo(slashPoints[i].x, slashPoints[i].y);
                
                let ratio = i / slashPoints.length; // Tỷ lệ: 0 là đuôi kiếm, 1 là mũi kiếm
                
                ctx.lineWidth = ratio * 20; // Mũi kiếm to 20px, vuốt nhọn dần về đuôi
                ctx.strokeStyle = `rgba(0, 242, 254, ${ratio * 0.7})`; // Đuôi kiếm mờ dần đi
                ctx.shadowColor = '#00f2fe';
                ctx.shadowBlur = ratio * 20;
                ctx.stroke();
            }

            // LỚP 2: Lõi Kiếm (Màu trắng, nét căng)
            for (let i = 1; i < slashPoints.length; i++) {
                ctx.beginPath();
                ctx.moveTo(slashPoints[i-1].x, slashPoints[i-1].y);
                ctx.lineTo(slashPoints[i].x, slashPoints[i].y);
                
                let ratio = i / slashPoints.length;
                
                ctx.lineWidth = ratio * 6; // Lõi mỏng hơn, mũi kiếm lõi 6px
                ctx.strokeStyle = `rgba(255, 255, 255, ${ratio})`;
                ctx.shadowBlur = 0; // Tắt blur ở lõi để tạo độ sắc nét
                ctx.stroke();
            }
        }
        
        // Tăng chiều dài đuôi từ 12 lên 18 điểm để vệt chém dài và ngầu hơn
        if(slashPoints.length > 18) slashPoints.shift();
        // ===============================================================

        mouse.x = (x / gameWidth) * 2 - 1;
        mouse.y = -(y / gameHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, gameCamera);

        const intersects = raycaster.intersectObjects(activeObjects, true);

        if (intersects.length > 0) {
            let hitObject = null;
            
            for(let i = 0; i < intersects.length; i++) {
                if(intersects[i].object.userData.isHitbox) {
                    hitObject = intersects[i].object.parent; 
                    break;
                }
            }

            if(hitObject && hitObject.userData.points && !hitObject.userData.isHit) {
                hitObject.userData.isHit = true; 
                
                // === HỆ THỐNG COMBO ===
                let points = hitObject.userData.points;
                let finalPoints = points;
                
                if (points > 0) {
                    // 1. Chém trúng Rác -> Tăng Combo
                    currentCombo++;
                    finalPoints = points * currentCombo; // Nhân điểm lên x2, x3...
                    
                    // Reset đồng hồ 3 giây đếm ngược
                    clearTimeout(comboTimeout);
                    comboTimeout = setTimeout(() => {
                        currentCombo = 0; // Quá 3s thì mất chuỗi
                        if(comboUI) comboUI.style.opacity = 0; // Mờ chữ combo đi
                    }, 3000);
                    
                    // Bắn chữ Combo ra màn hình
                    showComboEffect(currentCombo, x, y);
                    
                } else {
                    // 2. Chém nhầm sinh vật biển -> Trừ điểm & Gãy Combo ngay lập tức
                    currentCombo = 0;
                    clearTimeout(comboTimeout);
                    if(comboUI) comboUI.style.opacity = 0;
                }
                
                gameScore += finalPoints;
                scoreEl.innerText = gameScore;
                
                // Đổi màu số điểm: Đỏ (Trừ điểm), Vàng (Đang combo), Xanh (Bình thường)
                if (points < 0) scoreEl.style.color = '#ff3333';
                else if (currentCombo > 1) scoreEl.style.color = '#ffd700'; 
                else scoreEl.style.color = '#00ffaa'; 
                
                setTimeout(() => scoreEl.style.color = 'white', 300);

                createExplosion(hitObject.position, points > 0);

                gameScene.remove(hitObject);
                const index = activeObjects.indexOf(hitObject);
                if(index > -1) activeObjects.splice(index, 1);
            }
        }
    });
}

function increaseDifficulty() {
    if(!isGameRunning) return;
    spawnIntervalTime = Math.max(500, spawnIntervalTime - 100); 
    baseSpeed = Math.min(0.6, baseSpeed + 0.05); 
}

// ==================== BẬT / TẮT GAME ====================

document.getElementById('start-minigame-btn').addEventListener('click', () => {
    modal.style.display = 'flex'; 
// --- 1. SỬA LỖI CUỘN TRANG & NỀN TRONG SUỐT ---
    document.body.style.overflow = 'hidden'; // Khóa chết cuộn chuột của web ở background
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'; // Phủ đen background bên ngoài game

    const gameWin = document.getElementById('game-window');
    gameWin.style.background = 'radial-gradient(circle at 50% 30%, #00f2fe 0%, #11998e 55%, #003056 100%)'; 
    gameWin.style.border = '2px solid #ffd700'; 
    gameWin.style.boxShadow = '0 0 15px #00f2fe, inset 0 0 15px rgba(0, 242, 254, 0.2)';
    gameWin.style.borderRadius = '15px';

    // --- 2. DỌN SẠCH MỎ NEO CŨ (NẾU CÓ) ---
    const oldGlow = document.getElementById('ultimate-ocean-border');
    if (oldGlow) oldGlow.remove();

    // --- 3. GẮN 4 MỎ NEO DÍNH CHẶT VÀO 4 GÓC ---
    const borderGlow = document.createElement('div');
    borderGlow.id = 'ultimate-ocean-border';
    borderGlow.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: 9999999;
    `;
    
    // SVG Mỏ neo
    const anchorSVG = "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath fill='%2300f2fe' d='M312 24V34.5c6.4 1.2 12.6 2.7 18.2 4.2c12.8 3.4 20.4 16.6 17 29.4s-16.6 20.4-29.4 17c-10.9-2.9-21.1-4.9-34-4.9s-23.1 2-34 4.9c-12.8 3.4-26-4.2-29.4-17s4.2-26 17-29.4c5.6-1.5 11.8-3 18.2-4.2V24C256 10.7 266.7 0 280 0s24 10.7 24 24zM142.4 162.2l-39.6-39.6c-9.4-9.4-24.6-9.4-33.9 0l-45.3 45.3c-9.4 9.4-9.4 24.6 0 33.9l39.6 39.6c9.4 9.4 24.6 9.4 33.9 0l45.3-45.3c9.4-9.4 9.4-24.6 0-33.9zM433.6 162.2c-9.4 9.4-9.4 24.6 0 33.9l45.3 45.3c9.4 9.4 24.6 9.4 33.9 0l39.6-39.6c9.4-9.4 9.4-24.6 0-33.9l-45.3-45.3c-9.4-9.4-24.6-9.4-33.9 0l-39.6 39.6zM280 416c-79.5 0-144-64.5-144-144v-32c0-13.3-10.7-24-24-24s-24 10.7-24 24v32c0 97.4 72.8 178 166 190.5V512c0 13.3 10.7 24 24 24s24-10.7 24-24V462.5C395.2 450 468 369.4 468 272v-32c0-13.3-10.7-24-24-24s-24 10.7-24 24v32c0 79.5-64.5 144-144 144zM240 272v32c0 22.1 17.9 40 40 40s40-17.9 40-40v-32c0-22.1-17.9-40-40-40s-40 17.9-40 40z'/%3E%3C/svg%3E\")";

    // Ép vị trí lấn ra ngoài viền 2px để ôm trọn cái góc
    const positions = [
        { top: '-2px', left: '-2px' },
        { top: '-2px', right: '-2px' },
        { bottom: '-2px', left: '-2px' },
        { bottom: '-2px', right: '-2px' }
    ];

    positions.forEach(pos => {
        const anchor = document.createElement('div');
        let css = `position: absolute; width: 30px; height: 30px; background-image: ${anchorSVG}; background-size: contain; background-repeat: no-repeat; filter: drop-shadow(0 0 5px #00f2fe);`;
        for (let key in pos) css += ` ${key}: ${pos[key]};`;
        anchor.style.cssText = css;
        borderGlow.appendChild(anchor);
    });

    gameWin.appendChild(borderGlow);
    // ------------------------------------------------------------
    currentCombo = 0;
    clearTimeout(comboTimeout);
    if (comboUI) comboUI.style.opacity = 0;
    
    if(!gameScene) initMiniGame();
    
    gameWidth = container.clientWidth;
    gameHeight = container.clientHeight;
    if(gameRenderer) gameRenderer.setSize(gameWidth, gameHeight);
    if(slashCanvas) {
        slashCanvas.width = gameWidth;
        slashCanvas.height = gameHeight;
    }
    
    isGameRunning = true;
    gameScore = 0;
    scoreEl.innerText = gameScore;
    spawnIntervalTime = 1200;
    baseSpeed = 0.45;
    
    activeObjects.forEach(obj => gameScene.remove(obj));
    activeObjects = [];
    activeParticles.forEach(p => gameScene.remove(p));
    activeParticles = [];

    // Reset lại bong bóng luôn cho mượt
    bubbleParticles.forEach(bubble => resetBubble(bubble));

    spawnObject();
    animateGame();
    gameDifficultyTimer = setInterval(increaseDifficulty, 5000);
});

document.getElementById('close-game-btn').addEventListener('click', () => {
    modal.style.display = 'none';
    isGameRunning = false;
    clearInterval(gameDifficultyTimer);
});

function showComboEffect(combo, x, y) {
    if (combo < 2) return; // Combo x1 thì chưa cần hiện cho đỡ vướng mắt
    
    if (!comboUI) {
        comboUI = document.createElement('div');
        // CSS cho chữ Combo siêu ngầu, viền đen bóng vàng
        comboUI.style.cssText = 'position: absolute; color: #ffd700; font-size: 36px; font-weight: 900; font-family: "Segoe UI", Arial, sans-serif; text-shadow: 0 0 20px #ff9800, 2px 2px 0px #000; pointer-events: none; opacity: 0; transition: all 0.15s ease-out; z-index: 10001;';
        document.getElementById('game-window').appendChild(comboUI);
    }
    
    comboUI.innerText = `Combo x${combo}!`;
    // Đặt lệch ra phải + trên một chút so với mũi kiếm để dễ nhìn
    comboUI.style.left = (x + 30) + 'px';
    comboUI.style.top = (y - 30) + 'px';
    
    // Hiệu ứng giật (Scale to rồi thu lại)
    comboUI.style.opacity = 1;
    comboUI.style.transform = 'scale(1.5) rotate(-5deg)';
    setTimeout(() => {
        if(comboUI) comboUI.style.transform = 'scale(1) rotate(0deg)';
    }, 150);
}