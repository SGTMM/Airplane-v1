class airplane {
    constructor() {
        this.loader = new GLTFLoader()
        game.socket.on("spawn bullet", (data) => {
            bulletManager.createBullet(data)
        })

        game.socket.on("update", (data) => {
            this.updatePlane(data)
        })

        game.socket.on("add Plane", (data) => {
            this.addPlane(data)
        })

        game.socket.on("hit", (data) => {
            if (data === game.id) {
                this.health -= 1
                health.innerText = this.health + "%"
                console.log(this.health)
            }
        })

        game.socket.on("player disconnected", (data) => {
            var body = this.planes.find(obj => {
                return obj.name === data
            })
            if (body) {
                body.textLabel.visible = false
                setTimeout(() => {
                    game.scene.remove(body)
                    this.removedPlanes.push(data)
                    this.planes.splice(this.planes.indexOf(body), 1)
                }, 200);
            }
        })

        this.listener = new THREE.AudioListener()
        game.camera.add(this.listener)
        this.flyingSound = new THREE.Audio(this.listener)

        new THREE.AudioLoader().load("stuka flying.mp3", (e) => {
            this.flyingSound.setBuffer(e)
            this.flyingSound.setLoop(true)
            this.flyingSound.setVolume(1)
            //this.flyingSound.play()
        })

        this.divingSound = new THREE.Audio(this.listener)

        new THREE.AudioLoader().load("stuka dive.mp3", (e) => {
            this.divingSound.setBuffer(e)
            this.divingSound.setLoop(true)
            this.divingSound.setVolume(1)
        })

        this.shootingSound = new THREE.Audio(this.listener)

        new THREE.AudioLoader().load("stuka shoot.mp3", (e) => {
            this.shootingSound.setBuffer(e)
            this.shootingSound.setLoop(true)
            this.shootingSound.setVolume(1)
        })

        this.raycaster = new THREE.Raycaster()

        this.planes = []
        this.removedPlanes = []
        this.idConfirmation = []

        this.camPos = new THREE.Vector3()
        this.camRot = new THREE.Quaternion()

        this.shooting = false
        this.shootingCount = 0
        this.shootingCoolDown = 2

        this.health = 100

        this.loader.load("stuka test6.glb", (obj) => {
            this.AllyPlane = obj.scene.children[0]
            this.loader.load("il2-3.glb", (obj) => {
                this.EnemyPlane = obj.scene.children[0]


                alert("DONE LOADING")
                game.update()
            })
        })
    }

    update() {
        if (this.shooting) { this.shoot(); if (!this.shootingSound.isPlaying) this.shootingSound.play() } else { this.shootingSound.stop() }
        bulletManager.update()
    }

    updatePlane(data) {
        for (const e of this.removedPlanes) {
            if (data.id === e) {
                return
            }
        }
        var body = this.planes.find(obj => {
            return obj.name === data.id
        })
        this.delta = game.clock.getDelta()
        if (body) {
            body.quaternion.set(data.rot.x, data.rot.y, data.rot.z, data.rot.w)
            body.position.set(data.pos.x, data.pos.y, data.pos.z)
            if (body.gameType === 1) {
                body.propeller.rotateX(Math.PI / 6 + this.delta * 10)
            } else if (body.gameType === 2) {
                body.propeller.rotateY(Math.PI / 6 + this.delta * 10)

            }
            if (game.id === data.id) {
                this.camPos.copy(body.camBox.getWorldPosition(new THREE.Vector3()))
                this.camRot.copy(body.camBox.getWorldQuaternion(new THREE.Quaternion()).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI))))
            }
        } /* else {
            var confirmation = this.idConfirmation.find(obj => {
                return obj == data.id
            })
            console.log(this.idConfirmation)
            if (confirmation) {
                return
            }
            this.idConfirmation.push(data.id)
            if (data.type === 1) {
                this.newPlane = this.EnemyPlane.clone()
            } else if (data.type === 2) {
                this.newPlane = this.AllyPlane.clone()
            }
            this.newPlane.traverse((e) => {
                if (e.name === "camBox") {
                    this.newPlane.camBox = e
                } else if (e.name === "Cylinder") {
                    this.newPlane.sight = e
                    if (data.type === 2) {
                        this.newPlane.sight.material = new THREE.MeshBasicMaterial({ color: 0xFFC200 })
                        this.newPlane.sight.rotation.x = 3.1001526612292984
                    } else if (data.type === 1) {
                        this.newPlane.sight.rotateX(Math.PI)
                        this.newPlane.sight.rotateY(Math.PI / 2)
                        this.newPlane.sight.rotation.y += 0.01
                    }
                } else if (e.name === "Spinner007_0") {
                    this.newPlane.propeller = e
                }
            })
            this.newPlane.gameType = data.type
            this.newPlane.name = data.id
            if (this.newPlane.name !== game.id) {
                this.textElement = document.createElement('p')
                if (data.type === 1) {
                    this.textElement.textContent = "Il-2"
                    this.textElement.style.color = "red"
                } else if (data.type === 2) {
                    this.textElement.textContent = "Stuka"
                    this.textElement.style.color = "blue"
                }
                this.textLabel = new CSS2DObject(this.textElement)
                this.newPlane.textLabel = this.textLabel
                this.newPlane.textElement = this.textElement
                this.newPlane.add(this.newPlane.textLabel)

                this.planeLight = new THREE.PointLight(0xfca26a, 75, 5, 0)
                this.planeLight.position.z += 2
                this.newPlane.add(this.planeLight)
                this.planeLight = new THREE.PointLight(0xfca26a, 50, 5, 0)
                this.planeLight.position.z -= 2
                this.newPlane.add(this.planeLight)

            } else {
                this.planeLight = new THREE.PointLight(0xfca26a, 25, 5, 0.02) //3.5
                this.planeLight.position.z += 2
                this.newPlane.add(this.planeLight)
                this.userPlane = new THREE.Object3D()
                this.newPlane.add(this.userPlane)
            }
            this.planes.push(this.newPlane)
            game.scene.add(this.planes[this.planes.length - 1])
            console.log("new player", data.id)
            var idToRemove = this.idConfirmation.find(obj => {
                return obj === data.id
            })
            console.log(idToRemove)
            setTimeout(() => {
                //this.idConfirmation.splice(this.idConfirmation.indexOf(idToRemove), 1)

            }, 5000);
        } */
    }
    addPlane(data) {
        if (data.type === 1) {
            this.newPlane = this.EnemyPlane.clone()
        } else if (data.type === 2) {
            this.newPlane = this.AllyPlane.clone()
        }
        this.newPlane.traverse((e) => {
            if (e.name === "camBox") {
                this.newPlane.camBox = e
            } else if (e.name === "Cylinder") {
                this.newPlane.sight = e
                if (data.type === 2) {
                    this.newPlane.sight.material = new THREE.MeshBasicMaterial({ color: 0xFFC200 })
                    this.newPlane.sight.rotation.x = 3.1001526612292984
                } else if (data.type === 1) {
                    this.newPlane.sight.rotateX(Math.PI)
                    this.newPlane.sight.rotateY(Math.PI / 2)
                    this.newPlane.sight.rotation.y += 0.01
                }
            } else if (e.name === "Spinner007_0") {
                this.newPlane.propeller = e
            }
        })
        this.newPlane.gameType = data.type
        this.newPlane.name = data.id
        if (this.newPlane.name !== game.id) {
            this.textElement = document.createElement('p')
            if (data.type === 1) {
                this.textElement.textContent = "Il-2"
                this.textElement.style.color = "red"
            } else if (data.type === 2) {
                this.textElement.textContent = "Stuka"
                this.textElement.style.color = "blue"
            }
            this.textLabel = new CSS2DObject(this.textElement)
            this.newPlane.textLabel = this.textLabel
            this.newPlane.textElement = this.textElement
            this.newPlane.add(this.newPlane.textLabel)

            this.planeLight = new THREE.PointLight(0xfca26a, 75, 5, 0)
            this.planeLight.position.z += 2
            this.newPlane.add(this.planeLight)
            this.planeLight = new THREE.PointLight(0xfca26a, 50, 5, 0)
            this.planeLight.position.z -= 2
            this.newPlane.add(this.planeLight)

        } else {
            this.planeLight = new THREE.PointLight(0xfca26a, 25, 5, 0.02) //3.5
            this.planeLight.position.z += 2
            this.newPlane.add(this.planeLight)
            this.userPlane = new THREE.Object3D()
            this.newPlane.add(this.userPlane)
        }
        this.planes.push(this.newPlane)
        game.scene.add(this.planes[this.planes.length - 1])
        console.log("new player", data.id)
    }

    shoot() {
        if (this.shootingCount === this.shootingCoolDown) {
            game.socket.emit("raycast", game.id)
            this.shootingCount = 0
        } else {
            this.shootingCount++
        }
    }
}

window.airplane = airplane