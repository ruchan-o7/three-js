import {OrbitControls} from "https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js"
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.127/build/three.module.js';
    import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.127/examples/jsm/loaders/GLTFLoader.js';
import * as dat from "./node_modules/dat.gui/build/dat.gui.module.js"


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera
(
    50, innerWidth/innerHeight,
    0.1,
    1000
);

camera.position.z = 10
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth,innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera,renderer.domElement);
const rayCaster = new THREE.Raycaster();

const loader = new GLTFLoader();



//GUI
const gui = new dat.GUI(); 
const world = {
    planeMesh:{
        width:  1,
        height: 1,
        widthSegments:1,
        heightSegments:1,
        wireframeMode : false
    },
    LightSource:{
        intensity: 1,
        color:0xffffff
    }
};
// gui.add(world.planeMesh,'width',0.1,10).onChange(generate);
// gui.add(world.planeMesh,'height',0.1,10).onChange(generate);
// gui.add(world.planeMesh,"widthSegments",1,20).onChange(generate);
// gui.add(world.planeMesh,"heightSegments",1,20).onChange(generate);
// gui.add(world.planeMesh,"wireframeMode",false,true).onChange(wireframeModeChange);

gui.add(world.LightSource,"intensity",0,5).onChange(()=>{
    directionalLight.intensity = world.LightSource.intensity;
});

function generate() {
    planeMesh.geometry.dispose();
    planeMesh.geometry = new THREE.PlaneGeometry
    (
        world.planeMesh.width, world.planeMesh.height,
        world.planeMesh.widthSegments,world.planeMesh.heightSegments
    );

    const { array }= planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i+=2) {
        const x = array[i];
        const y = array[i+1];
        const z = array[i+2];
        array[i+2] =z + Math.random();
        
    }
}
function wireframeModeChange(){
    planeMaterial.dispose()
    world.planeMesh.wireframeMode = !world.planeMesh.wireframeMode;
    console.log(world.planeMesh.wireframeMode);
    
    
    planeMaterial = new THREE.MeshPhongMaterial
    (
        {
            color: 0xff1E6ADF,
            side:THREE.DoubleSide,
            wireframe: world.planeMesh.wireframeMode
        }

    );
}

//SCENE AND GEOMETRY


loadAsset('/assets/spher-box.gltf');
loadAsset('/assets/monkey.gltf')


 
//---------------LIGHTS-----------------------------------
const directionalLight = new THREE.DirectionalLight
(
    0xffffff,
    world.LightSource.intensity
);

directionalLight.position.z = 10
scene.add(directionalLight);



//Scene startup
const mouse = {
    x:undefined,
    y:undefined
}


function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
   
}
animate();



//      FUNCTIONS
addEventListener("mousemove",(event)=>{
    mouse.x = (event.clientX / innerWidth )*2-1;
    mouse.y = -(event.clientY / innerHeight)*2+1;
});


function loadAsset(url){
    loader.load(url , function ( gltf ) {
        gltf.scene.traverse(function (child) {
            if ((child).isMesh) {
                const m = child
                m.receiveShadow = true
                m.castShadow = true
            }
            if ((child).isLight) {
                const l = child 
                l.castShadow = true
                l.shadow.bias = -0.003
                l.shadow.mapSize.width = 2048
                l.shadow.mapSize.height = 2048
            }
        })
        scene.add(gltf.scene)
    
    }, function (xhr){
        console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
    }, function ( error ) {
    
        console.error("error is: " + error );
    
    } );
}