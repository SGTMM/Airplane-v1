class BulletManager {
    constructor() {
        this.id = 0
        this.bullets = []
    }

    createBullet(id) {
        var selectedBody = user.planes.find(obj => {
            return obj.name === id
        })

        this.starting_pos = selectedBody.sight.getWorldPosition(new THREE.Vector3())
        if (this.id % 2 === 0) {
            this.starting_pos.add(new THREE.Vector3(-1.5, -2.25, 0.65).applyQuaternion(selectedBody.sight.getWorldQuaternion(new THREE.Quaternion())))
        } else {
            this.starting_pos.add(new THREE.Vector3(1.5, -2.25, 0.65).applyQuaternion(selectedBody.sight.getWorldQuaternion(new THREE.Quaternion())))

        }
        this.dir = new THREE.Vector3(0, 1, 0).applyQuaternion(selectedBody.sight.getWorldQuaternion(new THREE.Quaternion()))
        this.bullets.push(new Bullet(this.starting_pos, this.dir, this.id))
        this.id++
    }

    removeBullet(id) {
        for (var i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].id === id) {
                this.bullets.splice(i, 1)
            }
        }
    }

    update() {
        for (var i = 0; i < this.bullets.length; i++) {
            this.bullets[i].update()
        }
    }
}

window.bulletManager = new BulletManager()
/*
this.starting_pos = new THREE.Vector3(obj.start.x, obj.start.y, obj.start.z)
        this.dir = new THREE.Vector3(obj.dir.x, obj.dir.y, obj.dir.z).sub(this.starting_pos).normalize() */
//this.dir = new THREE.Vector3(0, -1, 0).applyQuaternion(/* new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 100).multiply( */new THREE.Quaternion(obj.rot.x, obj.rot.y, obj.rot.z, obj.rot.w))
/*         console.log(this.dir)
        this.starting_pos.add(new THREE.Vector3(-1.25, 0, 1).applyQuaternion(new THREE.Quaternion(obj.rot.x, obj.rot.y, obj.rot.z, obj.rot.w)))
        this.bullets.push(new Bullet(this.starting_pos, this.dir, this.id)) */