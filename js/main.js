for (let i = 0, element; element = document.querySelectorAll('input[type="range"]')[i++];) {
    rangeSlider.create(element, {
        polyfill: true
    });
}

$(document).ready(function() {

    let speedSlider = $('input[name="speed"]');
    let spikesSlider = $('input[name="spikes"]');
    let processingSlider = $('input[name="processing"]');

    let $canvas = $('#blob canvas');
    let canvas = $canvas[0];
    let renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        context: canvas.getContext("webgl2"),
        antialias: true,
        alpha: true
    });
    let simplex = new SimplexNoise();

    renderer.setSize($canvas.width(), $canvas.height());
    renderer.setPixelRatio(window.devicePixelRatio || 1);

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera(45, $canvas.width() / $canvas.height(), 0.1, 1000);

    camera.position.z = 5;


    let geometry = new THREE.SphereGeometry(0.8, 128, 128);

    let material = new THREE.MeshPhongMaterial({
        color: 0xE4ECFA,
        //color: 0xFFFFFF,
        shininess: 100
    });

    let lightTop = new THREE.DirectionalLight(0xFFFFFF, 0.7);
    lightTop.position.set(0, 500, 200);
    lightTop.castShadow = true;
    scene.add(lightTop);

    let lightBottom = new THREE.DirectionalLight(0xFFFFFF, 0.25);
    lightBottom.position.set(0, -500, 400);
    lightBottom.castShadow = true;
    scene.add(lightBottom);

    let ambientLight = new THREE.AmbientLight(0x798296);
    scene.add(ambientLight);

    let sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);


    let update = () => {
        let time = performance.now() * 0.00001 * speedSlider.val() * Math.pow(processingSlider.val(), 3),
            spikes = spikesSlider.val() * processingSlider.val();

        for (let i = 0; i < sphere.geometry.vertices.length; i++) {
            let p = sphere.geometry.vertices[i];
            p.normalize().multiplyScalar(1 + 0.3 * simplex.noise3D(p.x * spikes, p.y * spikes, p.z * spikes + time));
        }

        sphere.geometry.computeVertexNormals();
        sphere.geometry.normalsNeedUpdate = true;
        sphere.geometry.verticesNeedUpdate = true;
    }

    function animate() {
        update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

});