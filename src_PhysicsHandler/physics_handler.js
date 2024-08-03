import * as CANNON from 'cannon-es'

class Physics {
    constructor() {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.81, 0), // m/s²
        })
        this.world.defaultContactMaterial.friction = 0

        this.lift = 0.25
        this.responseTime = 8

        this.bodies = []

        this.update()
    }

    update() {
        this.world.step(1 / 60)
        this.updatePlane()
        //displayInfo(this.bodies)
        setTimeout(() => {
            this.update()
        }, 16.67);
    }

    addPlane(data) {
        this.shape = new CANNON.Box(new CANNON.Vec3(0.75, 0.75, 0.75))
        this.body = new CANNON.Body({
            mass: 10,
            angularDamping: 0.75, // Small damping to reduce angular velocity over time
            linearDamping: 0.75,
        })
        this.body.addShape(this.shape)
        this.body.position.x = data.x
        this.body.position.y = data.y
        this.body.position.z = data.z
        this.body.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
        this.body.name = data.id
        this.body.gameType = data.type
        this.body.thrust = 0
        this.body.pitch = 0
        this.body.roll = 0
        this.body.yaw = 0
        this.bodies.push(this.body)
        this.world.addBody(this.bodies[this.bodies.length - 1])
    }

    updatePlane() {
        for (const e of this.bodies) {
            e.applyLocalForce(new CANNON.Vec3(0, -e.thrust, this.lift * e.thrust))
            this.localTorque = new CANNON.Vec3(e.pitch * this.responseTime / 3, -e.roll * this.responseTime, -e.yaw * this.responseTime);
            e.applyTorque(e.quaternion.vmult(this.localTorque))
            this.data = { id: e.name, type: e.gameType, pos: { x: e.position.x, y: e.position.y, z: e.position.z }, rot: { x: e.quaternion.x, y: e.quaternion.y, z: e.quaternion.z, w: e.quaternion.w } }
            socket.emit("update", this.data)
        }
    }

    updateControls(data) {
        for (const e of this.bodies) {
            if (e.name === data.id) {
                e.thrust = data.thrust
                e.pitch = data.pitch
                e.roll = data.roll
                e.yaw = data.yaw
                //console.log(e.thrust, e.pitch)
            }
        }
    }

    raycast(data) {
        this.result = new CANNON.RaycastResult()
        var selectedBody = this.bodies.find(obj => {
            return obj.name === data
        })
        var start = selectedBody.position
        var dir = selectedBody.quaternion.vmult(new CANNON.Vec3(0, -1, 0)).scale(700).vadd(start)
        //socket.emit("spawn bullet", { start: { x: start.x, y: start.y, z: start.z }, dir: { x: dir.x, y: dir.y, z: dir.z }, rot: { x: selectedBody.quaternion.x, y: selectedBody.quaternion.y, z: selectedBody.quaternion.z, w: selectedBody.quaternion.w } })
        socket.emit("spawn bullet", data)
        var ray = new CANNON.Ray(start, dir)
        var newArray = []
        for (const e of this.bodies) {
            if (e.name !== data) {
                newArray.push(e)
            }
        }
        ray.intersectBodies(newArray, this.result)
        if (this.result.hasHit) {
            socket.emit("hit", this.result.body.name)
        }
    }
}

window.Physics = Physics

window.physics = new Physics()