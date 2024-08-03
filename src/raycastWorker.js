onmessage = (e) => {
    var startVector = JSON.parse(e.data[0])
    var dirVector = JSON.parse(e.data[1])
    var raycaster = JSON.parse(e.data[2])
    var collisionPlanes = e.data[3]
    console.log(raycaster)
    raycaster.set(startVector, dirVector)
    const intersects = raycaster.intersectObjects(collisionPlanes, false);

    for (let i = 0; i < intersects.length; i++) {
        if (intersects[i].distance < 150) {
            //game.socket.emit("hit", intersects[i].object.name)
        }
        console.log(intersects[i])
    }
}