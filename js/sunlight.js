document.addEventListener("DOMContentLoaded", () => {
    const sunlight = document.querySelector('#sunlight-wrapper');
    const grid = sunlight.querySelector('.sl-fish-container');
    const detail = sunlight.querySelector('#sl-detail-view');
    const backBtn = sunlight.querySelector('#sl-back-btn');

    sunlight.querySelectorAll('.sl-fish-card').forEach(card => {
        card.addEventListener('click', function() {
            const originalImg = this.querySelector('.sl-fish-img');
            const rect = originalImg.getBoundingClientRect();

            
            const mainDetailImg = detail.querySelector('#sl-target-image-container img');
            if (mainDetailImg) {
                mainDetailImg.src = originalImg.src;
                mainDetailImg.style.display = 'block'; 
            }

            
            detail.querySelector('#sl-detail-model').src = this.getAttribute('data-model');
            detail.querySelector('#sl-detail-title').innerText = this.querySelector('.sl-fish-name').innerText;
            const descElem = this.querySelector('p');
            detail.querySelector('#sl-detail-desc').innerText = (descElem && descElem.innerText) ? descElem.innerText : 'Thông tin đang cập nhật.';
            const placeholder = 'asset/Images/Background/background1.jpg';
            for(let i=1; i<=4; i++) {
                const thumb = detail.querySelector(`#sl-detail-img${i}`);
                if (thumb) {
                    const src = this.getAttribute(`data-img${i}`) || placeholder;
                    thumb.src = src;
                }
            }

            
            const burst = originalImg.cloneNode(true);
            Object.assign(burst.style, {
                position: 'fixed',
                top: rect.top + 'px',
                left: rect.left + 'px',
                width: rect.width + 'px',
                zIndex: '10000',
                pointerEvents: 'none'
            });
            document.body.appendChild(burst);

            
            gsap.to(burst, {
                top: "50%",
                left: "50%",
                xPercent: -50,
                yPercent: -50,
                scale: 15,
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
                onComplete: () => {
                    burst.remove();
                    grid.style.display = 'none';
                    detail.style.display = 'block';

                    
                    gsap.fromTo(".sl-detail-fade", 
                        { opacity: 0, y: 30 }, 
                        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
                    );
                }
            });
        });
    });

    // NÚT QUAY LẠI
    backBtn.addEventListener('click', () => {
        detail.style.display = 'none';
        grid.style.display = 'grid';
    });

    
    document.querySelectorAll('.sl-video-item').forEach(item => {
        const video = item.querySelector('video');
        const btn = item.querySelector('.play-pause-btn');
        if (btn && video) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video.paused) { video.play(); btn.innerText = '⏸'; }
                else { video.pause(); btn.innerText = '▶'; }
            });
        }
    });

    
    const slBubbles = sunlight.querySelectorAll('.sl-bubble-item');
    slBubbles.forEach(bubble => {
        bubble.addEventListener('mousemove', (e) => {
            const rect = bubble.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            bubble.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        bubble.addEventListener('mouseleave', () => {
            bubble.style.transform = ``;
        });
    });
});
function initGlobalMarineSnow() {
    const container = document.getElementById('sl-marine-snow-global');
    if (!container) return;

    
    const particleCount = 420; 

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'sl-snow-particle';
        
        
        const size = Math.random() * 4 + 1 + 'px';
        particle.style.width = size;
        particle.style.height = size;
        
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        
        const duration = Math.random() * 7 + 5 + 's';
        particle.style.animationDuration = duration;
        
        
        particle.style.animationDelay = Math.random() * 5 + 's';

        container.appendChild(particle);
    }
}


document.addEventListener("DOMContentLoaded", initGlobalMarineSnow);

var currentSunlightFish = null;
function showSunlightDetail(fishKey, card) {
  currentSunlightFish = fishKey;
  
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

  
  var hemi = new THREE.HemisphereLight(0xffffff, 0x202040, 1.2);
  scene.add(hemi);
  var dir = new THREE.DirectionalLight(0xffffff, 2.0);
  dir.position.set(5, 10, 7);
  dir.castShadow = true;
  scene.add(dir);
  var ambient = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambient);
  
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
  
  try { var loadingEl = document.getElementById('sunlight-3d-loading'); if (loadingEl) loadingEl.style.display = 'block'; } catch(e){}
  loader.load(modelPath, function(gltf) {
    try {
      var model = gltf.scene || gltf.scenes[0];
      
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
          
          model.position.sub(correction);
          console.log('Applied animation position correction:', correction);
        }
      } catch(e) { console.warn('animation correction failed', e); }

      model.traverse(function(node){
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          
          var mats = Array.isArray(node.material) ? node.material : [node.material];
          mats.forEach(function(m){
            if (!m) return;
            try {
              m.side = THREE.DoubleSide;
              if (m.color) {
                
                m.color.lerp(new THREE.Color(0x88b6ff), 0.6);
              }
              if (m.emissive) m.emissive.lerp(new THREE.Color(0x050505), 0.6);
              if (m.map) m.map.encoding = (THREE.sRGBEncoding) ? THREE.sRGBEncoding : m.map.encoding;
              m.needsUpdate = true;
            } catch(e) { console.warn('material adjust failed', e); }
          });
        }
      });

      
      var bbox = new THREE.Box3().setFromObject(model);
      var size = bbox.getSize(new THREE.Vector3());
      var maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim <= 0) maxDim = 1;
      var override = (fishKey && modelOverrides[fishKey]) || {};
      var desiredSize = override.desiredSize || 2.0;
      var scaleFactor = desiredSize / maxDim;
      model.scale.setScalar(scaleFactor);

      
      bbox.setFromObject(model);
      var center = bbox.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.y -= center.y;
      model.position.z -= center.z;

      
      if (override.yOffset) model.position.y += override.yOffset;
      if (override.rotation) {
        model.rotation.x = override.rotation.x || 0;
        model.rotation.y = override.rotation.y || 0;
        model.rotation.z = override.rotation.z || 0;
      }

      model.visible = true;
      group.add(model);

      
      bbox.setFromObject(model);
      var sphere = bbox.getBoundingSphere(new THREE.Sphere());
      var radius = sphere.radius || (desiredSize/2);
      var fov = camera.fov * (Math.PI / 180);
      
      var camMultiplier = override.cameraOffsetMultiplier || 2.4;
      var fitMultiplier = override.fitMultiplier || 1.6;
      var cameraZ = Math.max(radius * camMultiplier, Math.abs(radius / Math.sin(fov / 2)) * fitMultiplier);
      if (!isFinite(cameraZ) || cameraZ === 0) cameraZ = Math.max(5, radius * 2.5);

      
      if (override.cameraDistance) {
        var camZFixed = override.cameraDistance + (override.camZ || 0);
        camera.position.set(0, Math.max(radius * 0.25, 0.1) + (override.camY || 0), camZFixed);
      } else {
        camera.position.set(0, Math.max(radius * 0.25, 0.1) + (override.camY || 0), cameraZ + (override.camZ || 0));
      }
      camera.lookAt(0,0,0);
      controls.target.set(0,0,0);
      controls.update();

      
      try { renderer.setClearColor(0x001122, 1); } catch(e){}

      
      try {
        var axes = new THREE.AxesHelper(Math.max(desiredSize, 1));
        axes.visible = false; 
        scene.add(axes);
        var debugDot = new THREE.Mesh(new THREE.SphereGeometry(Math.max(radius*0.06, 0.02), 10, 8), new THREE.MeshBasicMaterial({color:0xff4444}));
        debugDot.position.set(0,0,0);
        debugDot.visible = false;
        scene.add(debugDot);
        
        setTimeout(function(){ axes.visible = true; debugDot.visible = true; setTimeout(function(){ axes.visible = false; debugDot.visible = false; }, 2500); }, 80);
      } catch(e) { console.warn('helper failed', e); }

      console.log('3D model loaded:', fishKey, 'radius=', radius, 'cameraZ=', cameraZ);

      
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
          
          var t = clock.getElapsedTime();
          group.position.y = Math.sin(t * 0.8) * 0.03;
        }
        controls.update();
        renderer.render(scene, camera);
      }
      animate();

      
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
