// Cấu hình tài nguyên
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
let loadedModels = [];
let gameScore = 0;
let isGameRunning = false;

let spawnIntervalTime = 1200; 
let baseSpeed = 0.45; 
let gameDifficultyTimer;

const modal = document.getElementById('game-modal');
const container = document.getElementById('game-canvas-container');
const scoreEl = document.getElementById('game-score');
const slashCanvas = document.getElementById('slash-canvas');
let gameWidth, gameHeight;

function initMiniGame() {
    gameScene = new THREE.Scene();
    // Giảm độ dày của sương mù và làm nó sáng hơn để model nổi bật
    gameScene.fog = new THREE.FogExp2(0x001528, 0.012);

    gameWidth = container.clientWidth;
    gameHeight = container.clientHeight;

    gameCamera = new THREE.PerspectiveCamera(75, gameWidth / gameHeight, 0.1, 1000);
    gameCamera.position.z = 15;

    gameRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    gameRenderer.setSize(gameWidth, gameHeight);
    container.innerHTML = ''; 
    container.appendChild(gameRenderer.domElement);

    // Tăng ánh sáng môi trường lên để nhìn rõ màu của rác/sinh vật
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    gameScene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(0, 10, 5);
    gameScene.add(dirLight);

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

    // FIX TỎA RỘNG: Tăng biên độ trục X từ 16 lên 28 (Bay lan ra tận 2 bên mép)
    const randomX = (Math.random() - 0.5) * 28;
    clone.position.set(randomX, -16, (Math.random() - 0.5) * 4);
    clone.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

    // FIX TỎA RỘNG: Vận tốc văng ngang rộng hơn (0.15 thay vì 0.08)
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

function animateGame() {
    if (!isGameRunning) return;
    requestAnimationFrame(animateGame);

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

    gameRenderer.render(gameScene, gameCamera);
}

function setupSlicing() {
    let isDragging = false;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const ctx = slashCanvas.getContext('2d');
    slashCanvas.width = container.clientWidth;
    slashCanvas.height = container.clientHeight;
    let slashPoints = [];

    // HÀM RESET VỆT CHÉM ĐƯỢC DÙNG CHUNG
    function stopDragging() {
        isDragging = false; 
        slashPoints = []; // Phải làm rỗng mảng tọa độ
        ctx.clearRect(0,0,slashCanvas.width, slashCanvas.height);
    }

    // FIX KẸT CHUỘT: Thêm sự kiện bắt cả ở window và mouseleave
    container.addEventListener('mousedown', () => { isDragging = true; slashPoints = []; });
    container.addEventListener('mouseup', stopDragging);
    container.addEventListener('mouseleave', stopDragging); // Chuột chạy ra ngoài là ngắt
    window.addEventListener('mouseup', stopDragging); // Nhả chuột ở đâu cũng ngắt

    container.addEventListener('mousemove', (event) => {
        if (!isDragging || !isGameRunning) return;

        const rect = container.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        slashPoints.push({x: x, y: y});
        ctx.clearRect(0, 0, slashCanvas.width, slashCanvas.height);
        ctx.beginPath();
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 15;
        
        if(slashPoints.length > 0) ctx.moveTo(slashPoints[0].x, slashPoints[0].y);
        for (let i = 1; i < slashPoints.length; i++) {
            ctx.lineTo(slashPoints[i].x, slashPoints[i].y);
        }
        ctx.stroke();
        
        if(slashPoints.length > 12) slashPoints.shift();

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
                gameScore += hitObject.userData.points;
                scoreEl.innerText = gameScore;
                
                scoreEl.style.color = hitObject.userData.points > 0 ? '#00ffaa' : '#ff3333';
                setTimeout(() => scoreEl.style.color = 'white', 300);

                createExplosion(hitObject.position, hitObject.userData.points > 0);

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

document.getElementById('start-minigame-btn').addEventListener('click', () => {
    modal.style.display = 'flex'; 
    
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

    spawnObject();
    animateGame();
    gameDifficultyTimer = setInterval(increaseDifficulty, 5000);
});

document.getElementById('close-game-btn').addEventListener('click', () => {
    modal.style.display = 'none';
    isGameRunning = false;
    clearInterval(gameDifficultyTimer);
});