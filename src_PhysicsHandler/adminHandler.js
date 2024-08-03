class Admin {
    constructor() {
        this.bodies = []
        this.clickStatus = false

        this.infoBar = document.getElementsByClassName("infoBar")[0]
        this.infoBar.addEventListener("click", (e) => {
            if (e.pointerType === "mouse") {
                if (this.clickStatus) {
                    try {
                        this.infoBar.appendChild(this.selectedId)
                        this.clickStatus = false
                    } catch (e) { }
                }
            }
        })

        this.clickStatus = false;

        for (const element of document.getElementsByClassName("ally")) {
            element.addEventListener("click", (e) => {
                if (e.pointerType === "mouse") {
                    if (this.clickStatus) {
                        try {
                            element.appendChild(this.selectedId)
                            this.clickStatus = false
                        } catch (e) { }
                    }
                }
            })
        }

        for (const element of document.getElementsByClassName("enemy")) {
            element.addEventListener("click", (e) => {
                if (e.pointerType === "mouse") {
                    if (this.clickStatus) {
                        try {
                            element.appendChild(this.selectedId)
                            this.clickStatus = false
                        } catch (e) { }
                    }
                }
            })
        }

        for (const element of document.getElementsByClassName("scene")) {
            this.button = element.getElementsByClassName("load")[0]
            this.button.state = false
            this.button.addEventListener("click", (e) => {
                if (e.pointerType === "mouse") {
                    if (!e.target.state) {
                        e.target.style.backgroundColor = "green"
                        e.target.state = true
                        var EnemyIds = []
                        var AllyIds = []
                        for (const id of e.target.parentNode.getElementsByClassName("ally")[0].children) {
                            AllyIds.push(id.innerHTML)
                        }
                        for (const id of e.target.parentNode.getElementsByClassName("enemy")[0].children) {
                            EnemyIds.push(id.innerHTML)
                        }
                        this.startLoad(e.target.parentNode.id[5], AllyIds, EnemyIds)
                    } else if (e.target.state) {
                        e.target.state = false
                        e.target.style.backgroundColor = "red"
                    }
                }
            })
        }

        for (const element of document.getElementsByClassName("scene")) {
            this.button = element.getElementsByClassName("start")[0]
            this.button.state = false
            this.button.addEventListener("click", (e) => {
                if (e.pointerType === "mouse") {
                    if (!e.target.state) {
                        e.target.style.backgroundColor = "green"
                        e.target.state = true
                        var EnemyIds = []
                        var AllyIds = []
                        for (const id of e.target.parentNode.getElementsByClassName("ally")[0].children) {
                            AllyIds.push(id.innerHTML)
                        }
                        for (const id of e.target.parentNode.getElementsByClassName("enemy")[0].children) {
                            EnemyIds.push(id.innerHTML)
                        }
                        this.startScene(e.target.parentNode.id[5], AllyIds, EnemyIds)
                    } else if (e.target.state) {
                        e.target.state = false
                        e.target.style.backgroundColor = "red"
                    }
                }
            })
        }
    }

    addPlayer(id) {
        this.bodies.push(id)
        this.info = document.createElement("div")
        this.info.className = "PlayerInfo"
        this.info.innerHTML = id
        this.info.addEventListener("click", (e) => {
            if (e.pointerType === "mouse") {
                if (!this.clickStatus) {
                    this.selectedId = e.target
                    this.selectedId.parentNode.removeChild(this.selectedId)
                    setTimeout(() => {
                        this.clickStatus = true
                    }, 200);
                }
            }
        })
        this.infoBar.appendChild(this.info)
    }

    removePlayer(id) {
        var player = this.bodies.find(obj => {
            return obj === id
        })
        this.bodies.splice(this.bodies.indexOf(player), 1)
        for (const element of document.getElementsByTagName('div')) {
            if (element.innerHTML.trim() == id) {
                element.remove()
            }
        }
    }

    startLoad(option, allyIds, enemyIds) {
        switch (option) {
            case "1":
                for (const id of allyIds) {
                    socket.emit("start game", { id: id })
                }
                for (const id of enemyIds) {
                    socket.emit("start game", { id: id })
                }
                break;
            case "2":
                for (const id of allyIds) {
                    socket.emit("start game", { id: id })
                }
                for (const id of enemyIds) {
                    socket.emit("start game", { id: id })
                }
                break;
        }

    }

    startScene(option, allyIds, enemyIds) {
        switch (option) {
            case "1":
                for (const id of allyIds) {
                    socket.emit("add Plane", { id: id, type: 2 })
                    physics.addPlane({ id: id, x: 40, y: 40, z: 0, type: 2 })
                }
                for (const id of enemyIds) {
                    socket.emit("add Plane", { id: id, type: 1 })
                    physics.addPlane({ id: id, x: 0, y: 0, z: 0, type: 1 })
                }
        }

    }
}

window.admin = new Admin()







/* const container = document.getElementById("elementsContainer");
container.innerHTML = ""; // Clear existing content

function displayInfo(array) {
    container.innerHTML = "";
    array.forEach((element) => {
        const elementDiv = document.createElement("div");
        elementDiv.className = "element";
        elementDiv.innerHTML = `
                      <strong>ID:</strong> ${element.name}<br>
                      <strong>position:</strong> x: ${element.position.x.toFixed(
            2
        )}, y: ${element.position.y.toFixed(
            2
        )}, z: ${element.position.z.toFixed(2)}<br>
                      <strong>Quaternion:</strong> x: ${element.quaternion.x.toFixed(
            2
        )}, y: ${element.quaternion.y.toFixed(
            2
        )}, z: ${element.quaternion.z.toFixed(
            2
        )}, w: ${element.quaternion.w.toFixed(2)}
                  `;
        container.appendChild(elementDiv);
    });
} */