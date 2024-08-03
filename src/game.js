class Game {
    constructor() {
        this.wait = this.wait.bind(this)
        this.wait()
    }

    wait() {
        if (typeof THREE === "undefined" && typeof io === "undefined") { requestAnimationFrame(this.wait) } else { this.loadingDone() }
    }

    loadingDone() {
        this.socket = io("ws://192.168.66.101:4000");
        this.socket.on("id config", (data) => {
            this.id = data
            //user = new airplane()
        })

        this.frameCap = 1000 / 60

        this.socket.on("start game", (data) => {
            if (data.id === this.id) {
                user = new airplane()
            }
        })

        this.scene = new THREE.Scene()

        this.camera1 = new THREE.Object3D()
        this.camera2 = new THREE.Object3D()

        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000000);
        this.camera.updateProjectionMatrix()

        this.camera1.add(this.camera2)
        this.camera2.add(this.camera)
        this.scene.add(this.camera1)

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping
        this.renderer.toneMappingExposure = .25

        this.controls = new PointerLockControls(this.camera, this.renderer.domElement);

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.cssRenderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.body.appendChild(VRButton.createButton(this.renderer));
        this.renderer.xr.enabled = true;

        document.body.appendChild(this.renderer.domElement);

        this.cssRenderer = new CSS2DRenderer()
        this.cssRenderer.setSize(window.innerWidth, window.innerHeight)
        this.cssRenderer.domElement.style.position = "absolute"
        this.cssRenderer.domElement.style.top = "0px"
        this.cssRenderer.domElement.style.pointetEvents = "none"
        document.body.appendChild(this.cssRenderer.domElement)

        this.clock = new THREE.Clock()

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.bloom = new SelectiveBloomEffect(this.scene, this.camera, {
            blendFunction: BlendFunction.ADD,
            mipmapBlur: true,
            luminanceThreshold: 0.4,
            luminanceSmoothing: 0.2,
            intensity: 30

        })
        this.bloom.setBackgroundDisabled(true)
        this.composer.addPass(new EffectPass(this.camera, this.bloom))

        this.stats = new Stats()
        document.body.appendChild(this.stats.dom)

        this.loadScene1()
    }

    loadScene1() {
        new RGBELoader().load("scene1/background2.hdr", (texture) => {
            texture.encoding = THREE.LinearSRGBColorSpace
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = texture
            this.scene.backgroundIntensity = 0.01
            //this.scene.environment = new THREE.PMREMGenerator(this.renderer).fromEquirectangular(texture).texture
        })
    }

    update() {
        setTimeout(() => {
            this.update()
        }, this.frameCap);
        this.socket.emit("updateControls", { id: this.id, thrust: thrust, pitch: pitch, roll: roll, yaw: yaw })
        this.delta = this.clock.getDelta()
        user.update()
        this.camera1.position.copy(user.camPos)
        this.camera1.quaternion.copy(user.camRot)
        this.stats.update()
        this.cssRenderer.render(this.scene, this.camera)
        this.renderer.render(this.scene, this.camera);
        this.composer.render();
    }
}

window.Game = Game
