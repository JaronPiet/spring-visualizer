var windowHeight = window.innerHeight/ 1.5;
    windowWidth = window.innerWidth ;

var mouseX = 0,
    mouseY = 0,
    windowHalfX = windowWidth / 2,
    windowHalfY = windowHeight / 2,
    SEPARATION = 20,
    AMOUNTX = 10,
    AMOUNTY = 10,
    camera,
    scene,
    renderer;

var _Material;
var _GraphCenter = { X: 0, Y: 0, Z: 100 };

init();
animate();

function init()
{
    var container, separation = 10, amountX = 5, amountY = 5, particles, particle;

    container = document.createElement('div');
    document.getElementById("ViewPortDiv").appendChild(container);

    camera = new THREE.PerspectiveCamera(90, windowWidth / windowHeight, 1, 10000);
    camera.position.z = 0;

    scene = new THREE.Scene();

    renderer = new THREE.CanvasRenderer();
    renderer.setSize(windowWidth, windowHeight);
    container.appendChild(renderer.domElement);

    // particles
    var PI2 = Math.PI * 2;
    var material = new THREE.SpriteCanvasMaterial({

        color: 0xffffff,
        program: function (context) {

            context.beginPath();
            context.arc(0, 0, 0.5, 0, PI2, true);
            context.fill();

        }
    });

    _Material = material;
    // lines

    //var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5 } ),THREE.LinePieces );
    //scene.add( line );

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    window.addEventListener('resize', onWindowResize, false);
}


function addParticle(step)
{
    var geometry = new THREE.Geometry();

    var canvas = document.createElement('canvas');
    var size = 250;
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.font = '24px Arial';
    context.fillText("Object: " + step, size / 2, size / 2);

    var amap = new THREE.Texture(canvas);
    amap.needsUpdate = true;

    var mat = new THREE.SpriteMaterial({
        map: amap,
        transparent: false,
        useScreenCoordinates: false,
        color: 0xffffff
    });

    var xPos = _GraphCenter.X;
    var yPos = _GraphCenter.Y; 
    var zPos = _GraphCenter.Z;

    //var textLabel = new THREE.Sprite(mat);
    //textLabel.position.x = xPos;
    //textLabel.position.y = yPos;
    //textLabel.position.z = zPos;
    //textLabel.position.normalize();
    //textLabel.position.multiplyScalar(500);
    //textLabel.scale.x = textLabel.scale.y = 200;
    
    //scene.add(textLabel);
    //render();
   
    var particle = new THREE.Sprite(_Material);
    particle.position.x = xPos*step;
    particle.position.y = yPos * step;
    particle.position.z = zPos;
    particle.position.normalize();
    particle.position.multiplyScalar(500);
    particle.scale.x = particle.scale.y = 60;

    scene.add(particle);
}


function onWindowResize() {
    windowHalfX = windowWidth / 2;
    windowHalfY = windowHeight / 2;

    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(windowWidth, windowHeight);
}

//

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

}

function onDocumentTouchStart(event) {
    if (event.touches.length > 1) {
        event.preventDefault();
        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

function onDocumentTouchMove(event) {
    if (event.touches.length == 1) {
        event.preventDefault();

        mouseX = event.touches[0].pageX - windowHalfX;
        mouseY = event.touches[0].pageY - windowHalfY;
    }
}

//

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (-mouseY + 200 - camera.position.y) * .05;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}