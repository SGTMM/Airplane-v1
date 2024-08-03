class Bullet {
    constructor(starting_pos, dir, id) {
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: 0xFFAE42 }))
        this.mesh.position.copy(starting_pos)
        this.dir = dir
        this.id = id
        game.scene.add(this.mesh)
        game.bloom.selection.toggle(this.mesh)
        this.active = true
        this.dropRate = 0.00075
        setTimeout(() => {
            this.active = false
        }, 5000);
    }

    update() {
        if (this.active) {
            this.mesh.position.add(this.dir.clone().multiplyScalar(2.5))
            this.dir.y -= this.dropRate
        } else {
            new Promise((resolve, reject) => {
                game.bloom.selection.toggle(this.mesh)
                game.scene.remove(this.mesh)
            })
            bulletManager.removeBullet(this.id)
        }
    }
}

window.Bullet = Bullet