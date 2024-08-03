var user;
var game = new Game()

var pitch = 0
var roll = 0
var yaw = 0
var thrust = 500

var roll_calib = 0
var pitch_calib = 0

var health = document.getElementById("health")
var speed = document.getElementById("speed")

setupEventHandlers()

async function ciao() {
    // Request a port and open a connection
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });

    const decoder = new TextDecoderStream();
    const inputDone = port.readable.pipeTo(decoder.writable);
    const inputStream = decoder.readable.pipeThrough(new TransformStream({
        transform(chunk, controller) {
            chunk.split('\n').forEach(line => controller.enqueue(line));
        }
    }));

    const reader = inputStream.getReader();

    // Read data from the serial port
    while (true) {
        const { value, done } = await reader.read();
        if (done) {
            console.log("serial close")
            break;
        }
        try {
            const jsonData = JSON.parse(value);
            if (typeof jsonData.x !== "undefined") pitch = ((jsonData.x * 1.5) / 4095) - 0.75 - pitch_calib
            if (typeof jsonData.y !== "undefined") roll = ((jsonData.y * 1.5) / 4095) - 0.75 - roll_calib
            console.log(jsonData)
        } catch (err) {
        }
    }

    await inputDone.catch(console.error);
    await port.close();
}

function handleKeyDown(event) {

    let keyCode = event.key;


    switch (keyCode) {
        case 'w': //W: FORWARD
            pitch = 0.75
            break;

        case 's': //S: BACK
            pitch = -0.75
            break;

        case 'a': //A: LEFT
            roll = -0.75
            break;

        case 'd': //D: RIGHT
            roll = 0.75
            break;

        case 'q': //D: RIGHT
            yaw = -0.3
            break;

        case 'e': //D: RIGHT
            yaw = 0.3
            break;

        case 'ArrowUp': // Increase thrust
            if (thrust < 600) {
                thrust += 10;
            }
            speed.innerText = parseInt((thrust - 400) / 2) + "%"
            break;

        case 'ArrowDown': // Decrease thrust
            if (thrust > 400) {
                thrust -= 10;
            }
            speed.innerText = parseInt((thrust - 400) / 2) + "%"
            break;

        case 'z': // Decrease thrust
            game.controls.lock()
            break;

        case ' ':
            user.shooting = true
            break;

        case 'b':
            roll_calib = roll
            pitch_calib = pitch
    }
}

function handleKeyUp(event) {

    let keyCode = event.key;

    switch (keyCode) {
        case 'w': //W: FORWARD
            pitch = 0
            break;

        case 's': //S: BACK
            pitch = 0
            break;

        case 'a': //A: LEFT
            roll = 0
            break;

        case 'd': //D: RIGHT
            roll = 0
            break;

        case 'q': //D: RIGHT
            yaw = 0
            break;

        case 'e': //D: RIGHT
            yaw = 0
            break;

        case ' ':
            user.shooting = false
            break;
    }

}

function setupEventHandlers() {
    window.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('keyup', handleKeyUp, false);
}
