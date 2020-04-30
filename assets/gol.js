window.color1 = new THREE.Color(247/255, 247/255, 241/255);
window.color2 = new THREE.Color(41/255, 41/255, 41/255);
window.timer = 0;
window.mouse = { x: 0, y: 0 };
window.clear = 0;
window.iterations = 1;
window.interpolate = 1;
window.dT = 0.01;
window.pixelSize = 10.;
window.stepp = 2.;
window.threshold = 0.5;

window.cara0 = new THREE.TextureLoader().load('/assets/cara0.jpg' );
window.cara1 =  new THREE.TextureLoader().load('/assets/cara1.jpg' );
window.cara2 = new THREE.TextureLoader().load('/assets/cara2.jpg' );


function setStartTex() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 1024, 512);
    ctx.font = '800 400px Courier';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('welcome', 1024 / 5, 512 / 4);
}


function initStartTex() {
    var cnvs = document.createElement('canvas');
    cnvs.width = 1024;
    cnvs.height = 512;
    ctx = cnvs.getContext('2d');
    setStartTex();
    startText = new THREE.Texture(cnvs);
}


var scene, camera, renderer, width, height, controls;
function setupMainScene() {
    scene = new THREE.Scene();
    var width = window.innerWidth;
    var height = window.innerHeight;
    camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    camera.position.z = 2;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var canvas = window.renderer.domElement.style;
    canvas.width = '1536px';
    canvas.height = '806px';
    canvas.zIndex = -2;
    canvas.opacity =0.75;
    canvas.position = 'absolute';
    canvas.left = 0;
    canvas.top = 0;
}

var bufferScene, textureA, textureB, startText;
function setupBufferScene() {

    bufferScene = new THREE.Scene();

    textureA = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearMipMapLinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    });

    textureB = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearMipMapLinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType
    });
}


var plane, bufferObject;
function initBufferScene() {

    startText = [cara0, cara1, cara2][Math.floor(Math.random()*3)]
    bufferMaterial = new THREE.ShaderMaterial({
        uniforms: {
            timer: { type: 'i', value: 0 },
            resolution: { type: 'v2', value: new THREE.Vector2() },
            mouse: { type: 'v2', value: new THREE.Vector2() },
            color1: { type: 'v3', value: color1 },
            color2: { type: 'v3', value: color2 },
            texture: { type: 't', value: textureA.texture },
            dT: { type: 'f', value: dT },
            start: { type: "t", value: startText },
            t: { type: 'f', value: interpolate },
            pixelSize: { type: 'f', value: pixelSize },
            stepp: { type: 'f', value: stepp },
            threshold: { type: 'f', value: threshold },


        },

        vertexShader: document.getElementById('vertexShader').innerHTML,
        fragmentShader: this.document.getElementById('fragShader').innerHTML
    });

    plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    bufferObject = new THREE.Mesh(plane, bufferMaterial);
    bufferScene.add(bufferObject);

}

var finalMaterial, geom, quad;
function initFinalScene() {
    finalMaterial = new THREE.ShaderMaterial({
        uniforms: {
            resolution: { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            start: { type: "t", value: startText },
            texture: { type: 't', value: textureB.texture, minFilter: THREE.NearestFilter },
            color1: { type: 'c', value: color1 },
            color2: { type: 'c', value: color2 }
        },
        vertexShader: document.getElementById('vertexShader').innerHTML,
        fragmentShader: document.getElementById('color').textContent
    });

    geom = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
    quad = new THREE.Mesh(geom, finalMaterial);
    scene.add(quad);
}

function setupEvents() {
    function updateMouse(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        mouse.x = evt.clientX - rect.left;
        mouse.y = evt.clientY - rect.top;
    }

    renderer.domElement.addEventListener('mousemove', function (evt) {
        updateMouse(renderer.domElement, evt);
        bufferMaterial.uniforms.mouse.value.x = mouse.x;
        bufferMaterial.uniforms.mouse.value.y = (h - mouse.y);
    });

    document.addEventListener('keydown',function(e) {
      var n = e.keyCode%40;
      if (Number.isInteger(n)){
        bufferMaterial.uniforms.pixelSize.value = n;
      }
      console.log(e.key)
      if (e.key=='s'){
          console.log("yeay"
          )
          bufferMaterial.uniforms.pixelSize.value = 150;
      }
     
    })


    function onWindowResize(event) {
        w = window.innerWidth;
        h = window.innerHeight;

        renderer.setSize(w, h);
        finalMaterial.uniforms.resolution.value.x = w;
        finalMaterial.uniforms.resolution.value.y = h;

        textureA.setSize(w, h);
        textureB.setSize(w, h);

        bufferMaterial.uniforms.resolution.value.x = w;
        bufferMaterial.uniforms.resolution.value.y = h;
        bufferMaterial.uniforms.timer.value = 0;
    }
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);
}

function nStepSimulation() {
    for (var i = 0; i < iterations; i++) {
        renderer.setRenderTarget(textureB);
        renderer.render(bufferScene, camera);

        renderer.setRenderTarget(null);
        renderer.clear();

        var temp = textureA;
        textureA = textureB;
        textureB = temp;

        quad.material.map = textureB.texture;
        bufferMaterial.uniforms.texture.value = textureA.texture;
    }
}

var frame = 0;
function render() {

    requestAnimationFrame(render);

    if (frame % 4 == 1) {
        nStepSimulation();

    };
    ++frame;

    ++bufferMaterial.uniforms.timer.value;

    renderer.render(scene, camera);

}

initStartTex();

setupMainScene();
setupBufferScene();
initBufferScene();
initFinalScene();
setupEvents();

render();
