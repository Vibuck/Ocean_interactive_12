// Sunlight Zone JS - ellipse layout, animation, modal, 3D, gif
const sunlightFishData = {
  dolphin: {
    name: 'Cá heo',
    img: 'asset/Images/Background/dolphin.jpg',
    description: '<p><b>Tên khoa học:</b> Delphinidae</p><p><b>Kích thước:</b> 2–4m, nặng 150–650kg.</p><p><b>Đặc tính:</b> Thông minh, giao tiếp bằng âm thanh, sống theo bầy đàn lớn.</p><p><b>Chế độ ăn:</b> Cá nhỏ, mực, tôm.</p>',
    model: 'asset/Model_3D/Fish_model/model_61a_-_bottlenose_dolphin.glb',
    gif: 'asset/Images/Background/dolphin.gif',
  },
  sea_horse: {
    name: 'Cá ngựa',
    img: 'asset/Images/Background/sea_horse.png',
    description: '<p><b>Tên khoa học:</b> Hippocampus</p><p><b>Kích thước:</b> 2–35cm.</p><p><b>Đặc tính:</b> Đầu giống ngựa, đực mang thai, bơi chậm.</p><p><b>Chế độ ăn:</b> Động vật phù du, giáp xác nhỏ.</p>',
    model: 'asset/Model_3D/Fish_model/sea_horse.glb',
    gif: 'asset/Images/Background/seahorse.gif',
  },
  shark: {
    name: 'Cá mập',
    img: 'asset/Images/Background/shark.jpeg',
    description: '<p><b>Tên khoa học:</b> Selachimorpha</p><p><b>Kích thước:</b> 1–7m (tùy loài).</p><p><b>Đặc tính:</b> Săn mồi đỉnh chuỗi thức ăn, khứu giác nhạy bén.</p><p><b>Chế độ ăn:</b> Cá, động vật biển lớn nhỏ.</p>',
    model: 'asset/Model_3D/Fish_model/crysis_shark.glb',
    gif: 'asset/Images/Background/shark.gif',
  },
  tuna: {
    name: 'Cá ngừ',
    img: 'asset/Images/Background/Yellowfin-Tuna.jpg',
    description: '<p><b>Tên khoa học:</b> Thunnini</p><p><b>Kích thước:</b> 0.5–2m, nặng 20–200kg.</p><p><b>Đặc tính:</b> Bơi rất nhanh, di cư xa, thịt giàu dinh dưỡng.</p><p><b>Chế độ ăn:</b> Cá nhỏ, mực, giáp xác.</p>',
    model: 'asset/Model_3D/Fish_model/tuna_fish.glb',
    gif: 'asset/Images/Background/tuna.gif',
  },
};

// Per-model display overrides (tweak when a model's internal scale/center is odd)
const modelOverrides = {
  // Turtle: increase desiredSize so the auto-fit camera frames it much larger
  turtle: { desiredSize: 16.0, yOffset: 0.12, cameraOffsetMultiplier: 1.2 },
  sea_horse: { desiredSize: 1.6, yOffset: -0.05, cameraOffsetMultiplier: 2.2 },
  tuna: { desiredSize: 2.4, cameraOffsetMultiplier: 2.6 },
  dolphin: { desiredSize: 2.0, cameraOffsetMultiplier: 2.2 },
  shark: { desiredSize: 2.8, cameraOffsetMultiplier: 2.6 }
};

// Arrange cards in ellipse (visually pleasing, responsive)
function arrangeEllipse() {
  const cards = document.querySelectorAll('.sunlight-fish-card');
  const ellipse = document.getElementById('sunlight-ellipse');
  if (!ellipse || cards.length === 0) return;
  const cx = ellipse.offsetWidth / 2;
  const cy = ellipse.offsetHeight / 2 + 10;
  const rx = ellipse.offsetWidth / 2.5;
  const ry = ellipse.offsetHeight / 2.7;
  const n = cards.length;
  cards.forEach((card, i) => {
    const theta = (2 * Math.PI * i) / n - Math.PI / 2;
    const x = cx + rx * Math.cos(theta) - card.offsetWidth / 2;
    const y = cy + ry * Math.sin(theta) - card.offsetHeight / 2;
    card.style.left = x + 'px';
    card.style.top = y + 'px';
    card.style.transform = 'scale(1)';
    card.classList.remove('selected');
    card.style.zIndex = 1;
  });
}

window.addEventListener('resize', arrangeEllipse);
document.addEventListener('DOMContentLoaded', function() {
  arrangeEllipse();
  // Card click
  document.querySelectorAll('.sunlight-fish-card').forEach(function(card) {
    card.addEventListener('click', function() {
      showSunlightDetail(card.dataset.fish, card);
    });
  });
  // Back
  document.getElementById('sunlight-detail-back').onclick = hideSunlightDetail;
  // Model
  document.getElementById('sunlight-detail-model').onclick = showSunlight3D;
  // Video
  document.getElementById('sunlight-detail-video').onclick = showSunlightVideo;
  // Close 3D
  document.getElementById('sunlight-3d-close').onclick = function() {
    document.getElementById('sunlight-3d-modal').classList.remove('active');
    try {
      if (window.sunlight3dAnimationId) { cancelAnimationFrame(window.sunlight3dAnimationId); window.sunlight3dAnimationId = null; }
      if (window.sunlight3dResizeHandler) { window.removeEventListener('resize', window.sunlight3dResizeHandler); window.sunlight3dResizeHandler = null; }
      if (window.sunlight3dRenderer) {
        try { window.sunlight3dRenderer.forceContextLoss && window.sunlight3dRenderer.forceContextLoss(); } catch(e){}
        try { window.sunlight3dRenderer.domElement && window.sunlight3dRenderer.domElement.remove(); } catch(e){}
        try { window.sunlight3dRenderer.dispose && window.sunlight3dRenderer.dispose(); } catch(e){}
        window.sunlight3dRenderer = null;
      }
      window.sunlight3dMixer = null;
    } catch(e) { console.warn('error cleaning 3d on close', e); }
    document.getElementById('sunlight-3d-viewer').innerHTML = '';
  };
  // Close Video
  document.getElementById('sunlight-video-close').onclick = function() {
    document.getElementById('sunlight-video-modal').classList.remove('active');
  };
});

var currentSunlightFish = null;
function showSunlightDetail(fishKey, card) {
  currentSunlightFish = fishKey;
  // Animate card to center, overlay modal giống Midnight
  document.querySelectorAll('.sunlight-fish-card').forEach(function(c) {
    c.classList.remove('selected');
    c.style.zIndex = 1;
    c.style.transform = 'scale(1)';
  });
  card.classList.add('selected');
  card.style.zIndex = 10;
  card.style.transform = 'translate(-50%, -50%) scale(1.15)';
  card.style.left = '50%';
  card.style.top = '50%';
  // Show detail modal
  var data = sunlightFishData[fishKey];
  var img = document.getElementById('sunlight-detail-image');
  img.src = data.img;
  img.alt = data.name;
  document.getElementById('sunlight-detail-name').textContent = data.name;
  document.getElementById('sunlight-detail-description').innerHTML = data.description;
  document.getElementById('sunlight-detail-page').classList.add('active');
}
function hideSunlightDetail() {
  document.getElementById('sunlight-detail-page').classList.remove('active');
  arrangeEllipse();
}
function showSunlight3D() {
  var fishKey = currentSunlightFish;
  var data = sunlightFishData[fishKey];
  document.getElementById('sunlight-3d-modal').classList.add('active');
  // Load 3D model
  loadSunlight3DModel(data.model, fishKey);
}
function showSunlightVideo() {
  var fishKey = currentSunlightFish;
  var data = sunlightFishData[fishKey];
  var gif = document.getElementById('sunlight-gif');
  gif.src = data.gif;
  gif.alt = data.name + ' gif';
  document.getElementById('sunlight-video-modal').classList.add('active');
}
// 3D Viewer with three.js
function loadSunlight3DModel(modelPath, fishKey) {
  // cleanup previous renderer/loop/resize if any
  try {
    if (window.sunlight3dAnimationId) {
      cancelAnimationFrame(window.sunlight3dAnimationId);
      window.sunlight3dAnimationId = null;
    }
    if (window.sunlight3dResizeHandler) {
      window.removeEventListener('resize', window.sunlight3dResizeHandler);
      window.sunlight3dResizeHandler = null;
    }
    if (window.sunlight3dRenderer) {
      try { window.sunlight3dRenderer.forceContextLoss && window.sunlight3dRenderer.forceContextLoss(); } catch(e){}
      try { window.sunlight3dRenderer.domElement && window.sunlight3dRenderer.domElement.remove(); } catch(e){}
      try { window.sunlight3dRenderer.dispose && window.sunlight3dRenderer.dispose(); } catch(e){}
      window.sunlight3dRenderer = null;
    }
    window.sunlight3dScene = null;
    window.sunlight3dCamera = null;
    window.sunlight3dMixer = null;
  } catch(e) { console.warn('cleanup 3d error', e); }

  var container = document.getElementById('sunlight-3d-viewer');
  container.innerHTML = '';
  var width = container.clientWidth || 600;
  var height = container.clientHeight || 400;
  var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio || 1);
  renderer.shadowMap.enabled = true;
  if (typeof THREE.sRGBEncoding !== 'undefined') renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setSize(width, height, false);
  // ensure the canvas will fill the viewer element and be positioned correctly
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x001122);
  var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // stronger, more balanced lighting so dark PBR models become visible
  var hemi = new THREE.HemisphereLight(0xffffff, 0x202040, 1.2);
  scene.add(hemi);
  var dir = new THREE.DirectionalLight(0xffffff, 2.0);
  dir.position.set(5, 10, 7);
  dir.castShadow = true;
  scene.add(dir);
  var ambient = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambient);
  // small camera-key light to brighten front-facing areas
  var key = new THREE.PointLight(0xffffff, 0.8);
  camera.add(key);
  scene.add(camera);

  if (!THREE.OrbitControls) console.warn('OrbitControls not found');
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 0.5;
  controls.maxDistance = 50;

  var group = new THREE.Group();
  scene.add(group);

  var mixer = null;

  var loader = new THREE.GLTFLoader();
  // show loading indicator if present
  try { var loadingEl = document.getElementById('sunlight-3d-loading'); if (loadingEl) loadingEl.style.display = 'block'; } catch(e){}
  loader.load(modelPath, function(gltf) {
    try {
      var model = gltf.scene || gltf.scenes[0];
      // If animations contain position keyframes on nodes, those initial
      // translations can shift the visible model away from the origin. Detect
      // initial position keyframes and subtract their average from the model
      // so the animated root appears centered along Z (and other axes).
      try {
        var correction = new THREE.Vector3(0,0,0);
        var correctionCount = 0;
        if (gltf.animations && gltf.animations.length) {
          gltf.animations.forEach(function(clip){
            clip.tracks.forEach(function(track){
              if (!track.name) return;
              if (track.name.match(/\.position$/)) {
                var nodeName = track.name.split('.').slice(0, -1).join('.');
                var values = track.values;
                if (values && values.length >= 3) {
                  var px = values[0], py = values[1], pz = values[2];
                  var node = model.getObjectByName(nodeName);
                  if (!node) {
                    var last = nodeName.split('/').pop();
                    node = model.getObjectByName(last);
                  }
                  if (node) {
                    correction.add(new THREE.Vector3(px, py, pz));
                    correctionCount++;
                  }
                }
              }
            });
          });
        }
        if (correctionCount > 0) {
          correction.divideScalar(correctionCount);
          // subtract the mean initial translation from the model so the root
          // animation's offset is neutralized.
          model.position.sub(correction);
          console.log('Applied animation position correction:', correction);
        }
      } catch(e) { console.warn('animation correction failed', e); }

      model.traverse(function(node){
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          // ensure material is visible: prefer double side and gently brighten dark materials
          var mats = Array.isArray(node.material) ? node.material : [node.material];
          mats.forEach(function(m){
            if (!m) return;
            try {
              m.side = THREE.DoubleSide;
              if (m.color) {
                // lighten base color toward a soft blue tint for visibility
                m.color.lerp(new THREE.Color(0x88b6ff), 0.6);
              }
              if (m.emissive) m.emissive.lerp(new THREE.Color(0x050505), 0.6);
              if (m.map) m.map.encoding = (THREE.sRGBEncoding) ? THREE.sRGBEncoding : m.map.encoding;
              m.needsUpdate = true;
            } catch(e) { console.warn('material adjust failed', e); }
          });
        }
      });

      // compute bbox, scale, center
      var bbox = new THREE.Box3().setFromObject(model);
      var size = bbox.getSize(new THREE.Vector3());
      var maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim <= 0) maxDim = 1;
      var override = (fishKey && modelOverrides[fishKey]) || {};
      var desiredSize = override.desiredSize || 2.0;
      var scaleFactor = desiredSize / maxDim;
      model.scale.setScalar(scaleFactor);

      // recenter
      bbox.setFromObject(model);
      var center = bbox.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.y -= center.y;
      model.position.z -= center.z;

      // apply override offsets
      if (override.yOffset) model.position.y += override.yOffset;
      if (override.rotation) {
        model.rotation.x = override.rotation.x || 0;
        model.rotation.y = override.rotation.y || 0;
        model.rotation.z = override.rotation.z || 0;
      }

      model.visible = true;
      group.add(model);

      // compute bounding sphere and position camera (more robust algorithm)
      bbox.setFromObject(model);
      var sphere = bbox.getBoundingSphere(new THREE.Sphere());
      var radius = sphere.radius || (desiredSize/2);
      var fov = camera.fov * (Math.PI / 180);
      // prefer a camera distance proportional to radius to avoid being inside the model
      var camMultiplier = override.cameraOffsetMultiplier || 2.4;
      var fitMultiplier = override.fitMultiplier || 1.6;
      var cameraZ = Math.max(radius * camMultiplier, Math.abs(radius / Math.sin(fov / 2)) * fitMultiplier);
      if (!isFinite(cameraZ) || cameraZ === 0) cameraZ = Math.max(5, radius * 2.5);

      // If a per-model fixed camera distance is provided, use it (this decouples
      // camera distance from model radius so we can make specific models appear bigger).
      if (override.cameraDistance) {
        var camZFixed = override.cameraDistance + (override.camZ || 0);
        camera.position.set(0, Math.max(radius * 0.25, 0.1) + (override.camY || 0), camZFixed);
      } else {
        camera.position.set(0, Math.max(radius * 0.25, 0.1) + (override.camY || 0), cameraZ + (override.camZ || 0));
      }
      camera.lookAt(0,0,0);
      controls.target.set(0,0,0);
      controls.update();

      // Force renderer clear color so canvas isn't transparent behind rounded panel
      try { renderer.setClearColor(0x001122, 1); } catch(e){}

      // Add temporary helpers to ensure we can visually debug placement
      try {
        var axes = new THREE.AxesHelper(Math.max(desiredSize, 1));
        axes.visible = false; // keep off by default
        scene.add(axes);
        var debugDot = new THREE.Mesh(new THREE.SphereGeometry(Math.max(radius*0.06, 0.02), 10, 8), new THREE.MeshBasicMaterial({color:0xff4444}));
        debugDot.position.set(0,0,0);
        debugDot.visible = false;
        scene.add(debugDot);
        // briefly flash helpers if user has console open
        setTimeout(function(){ axes.visible = true; debugDot.visible = true; setTimeout(function(){ axes.visible = false; debugDot.visible = false; }, 2500); }, 80);
      } catch(e) { console.warn('helper failed', e); }

      console.log('3D model loaded:', fishKey, 'radius=', radius, 'cameraZ=', cameraZ);

      // play built-in animations if available; do NOT auto-rotate model when animations exist
      if (gltf.animations && gltf.animations.length) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach(function(clip){
          var action = mixer.clipAction(clip);
          action.reset();
          action.play();
        });
        window.sunlight3dMixer = mixer;
      }

      var clock = new THREE.Clock();
      function animate() {
        window.sunlight3dAnimationId = requestAnimationFrame(animate);
        var delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        } else {
          // gentle bob when no animation provided
          var t = clock.getElapsedTime();
          group.position.y = Math.sin(t * 0.8) * 0.03;
        }
        controls.update();
        renderer.render(scene, camera);
      }
      animate();

      // hide loading indicator
      try { if (loadingEl) loadingEl.style.display = 'none'; } catch(e){}
    } catch(e) {
      console.error('Error processing GLTF', e);
    }
  }, undefined, function(err) {
    try { if (loadingEl) loadingEl.style.display = 'none'; } catch(e){}
    container.innerHTML = '<div style="color:#fff;text-align:center;padding:40px">Không thể tải model 3D!</div>';
    console.error('GLTF load error', err);
  });

  function onWindowResize() {
    var w = container.clientWidth || 600;
    var h = container.clientHeight || 400;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.sunlight3dResizeHandler = onWindowResize;
  window.addEventListener('resize', onWindowResize);

  window.sunlight3dRenderer = renderer;
  window.sunlight3dScene = scene;
  window.sunlight3dCamera = camera;
}
