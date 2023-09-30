import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let vel = 0.0;
let voar = 0.0;
let rumo = 0.0;
let velSol = 0.0;
let velSol2 = 1.046;
let velVoo = 0.0;
let velocidadeAngular = 0.0;
let acel = 0.0;
var limiteMinY = 3;
var robo;
var arvore;

function foiAtingido(X1, Y1, Z1, X2, Y2, Z2){
	var deltaX = X1 - X2;
	var deltaY = Y1 - Y2;
	var deltaZ = Z1 - Z2;
	var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
	return dist < 1.5;
}
//Som
/*const listener = new THREE.AudioListener();
const audioLoader = new THREE.AudioLoader();
const sound = new THREE.PositionalAudio(listener);*/

// Inicialize a cena
var scene = new THREE.Scene();

// Crie uma câmera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 3, 0);

// Crie uma renderização
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Criação das sombras
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Criação do plano
var geometry = new THREE.PlaneGeometry(200, 200);
var material = new THREE.MeshStandardMaterial({ color: 0x000000, side:THREE.DoubleSide });
var surface = new THREE.Mesh(geometry, material);
surface.receiveShadow = true;
scene.add(surface);




//Criação do cenário
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load('paisagem/violence_ft.jpg');
let texture_bk = new THREE.TextureLoader().load('paisagem/violence_bk.jpg');
let texture_up = new THREE.TextureLoader().load('paisagem/violence_up.jpg');
let texture_dn = new THREE.TextureLoader().load('paisagem/violence_dn.jpg');
let texture_rt = new THREE.TextureLoader().load('paisagem/violence_rt.jpg'); 
let texture_lf = new THREE.TextureLoader().load('paisagem/violence_lf.jpg');

materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft})); 
materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk})); 
materialArray.push (new THREE.MeshBasicMaterial({map: texture_up})); 
materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn})); 
materialArray.push (new THREE.MeshBasicMaterial ({map: texture_rt})); 
materialArray.push(new THREE.MeshBasicMaterial ({map: texture_lf}));

for(let i= 0; i<6; i++){
  materialArray[i].side=THREE.BackSide;
}

let skyboxGeo = new THREE.BoxGeometry(400,200,400);
let skybox = new THREE.Mesh(skyboxGeo, materialArray);
skybox.position.y = 80;
scene.add(skybox);





//Esfera para ser ponto de referência
const geometry0 = new THREE.SphereGeometry( 1, 15, 16 ); 
const material0 = new THREE.MeshBasicMaterial( { color: 0xffffff} ); 
const sphere0 = new THREE.Mesh( geometry0, material0 ); 
sphere0.position.set(0, -1, 0);
scene.add( sphere0 );

let boxWidth = 5;
let boxHeight = 0;
let boxDepth = 5;
let gap = 2; // Espaço entre as caixas

let numBlocosCols = 3;
let numBlocosRows = 4;
let numRows = 6; // Número de linhas
let numCols = 6; // Número de colunas
let totalWidth = numBlocosCols * (numCols*boxWidth + (numCols-1)*gap) + (numBlocosCols - 1) * 10;
let totalDepth = numBlocosRows * (numRows*boxDepth + (numRows-1)*gap) + (numBlocosRows - 1) * 10;
for (let y = 0; y < numBlocosRows; y++){
	for (let k = 0; k < numBlocosCols; k++ ){
		for (let i = 0; i < numRows; i++) {
			for (let j = 0; j < numCols; j++) {
			boxHeight = 5 + (Math.random() * 20);
			const geometryBox = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
			//const moonTextureBox = new THREE.TextureLoader().load("Imagens/2k_mars.jpg");
			const materialBox = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
			//materialBox.map = moonTextureBox;
			const pre1 = new THREE.Mesh(geometryBox, materialBox);
			pre1.castShadow = true;
			pre1.receiveShadow = true;
		
			// Calcula as posições das caixas
			const xPosition = (j * (boxWidth + gap) + k * (numCols*boxWidth + (numCols-1)*gap + 10)) - ((totalWidth / 2) - (boxWidth / 2));
			const zPosition = (i * (boxDepth + gap) + y * (numRows*boxDepth + (numRows-1)*gap + 10)) - ((totalDepth / 2) - (boxDepth / 2));
		
			pre1.position.set(xPosition, (boxHeight) / 2, zPosition); // Define a posição da caixa
			scene.add(pre1); // Adiciona a caixa à cena
			}
		}
	}
}

var objetos = [];

const loader = new GLTFLoader();

for (let q = 0; q < 5; q++){
	let posX = Math.random();
	let posY = Math.random();
	let localSphereX = Math.random() * totalWidth;
	let localSphereZ = Math.random() * totalDepth;
	const geometrySphe = new THREE.SphereGeometry( 1, 15, 16 ); 
	const moonTextureSphe = new THREE.TextureLoader().load("Imagens/2k_mars.jpg");
	const materialSphe = new THREE.MeshPhongMaterial(); 
	materialSphe.map = moonTextureSphe;
	const sphere = new THREE.Mesh( geometrySphe, materialSphe ); 
	scene.add( sphere );

	if(posX < 0.5 && posY < 0.5){
		sphere.position.set(-localSphereX + (localSphereX / 2), 2, - localSphereZ + (localSphereZ / 2)); 
	}else if(posX > 0.5 && posY < 0.5){
		sphere.position.set(localSphereX - (localSphereX / 2), 2, -localSphereZ + (localSphereZ / 2));
	}else if(posX < 0.5 && posY > 0.5){
		sphere.position.set(-localSphereX + (localSphereX / 2), 2, localSphereZ - (localSphereZ / 2));
	}else{
		sphere.position.set(localSphereX - (localSphereX / 2), 2, localSphereZ - (localSphereZ / 2));
	}

	objetos.push(sphere);
}

loader.load(    'modelos/coot_the_robot.glb',
                function ( gltf ) {
                    robo = gltf.scene;
                    scene.add( gltf.scene );
                },
                undefined,
                function ( error ) {
                    console.error( error );
                }
);

/*for (let q = 0; q < 10 ; q++){
	loader.load('modelos/arvore.glb',
					function ( gltf ) {
						arvore = gltf.scene;
						arvore.position.set(
							100, 
							0, 
							200 - (Math.random()*100));
						arvore.scale.set(15, 15, 15);
						scene.add( gltf.scene );
					},
					undefined,
					function ( error ) {
						console.error( error );
					}
	);
}*/

const geometrySpheRob = new THREE.SphereGeometry( 0.5, 15, 16 ); 
const materialSpheRob = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true, opacity: 0.0} ); 
const sphereRob = new THREE.Mesh( geometrySpheRob, materialSpheRob ); 
scene.add( sphereRob );

const light = new THREE.PointLight( 0xFFFFFF, 3, 6 );
light.position.set(0, 0, 0);
scene.add( light );

const lightObj = new THREE.HemisphereLight( 0x777777, 0x000000, 1 );
scene.add( lightObj );

const directionalLight = new THREE.DirectionalLight( 0xFC5404, 16);
directionalLight.position.set(totalWidth/2, 30, 0);
directionalLight.shadow.camera.left = 90;
directionalLight.shadow.camera.right = -90 ;
directionalLight.shadow.camera.top = 80;
directionalLight.shadow.camera.bottom = -80;
directionalLight.castShadow = true;
directionalLight.target = sphere0;
scene.add( directionalLight );

//Configurando as propriedades da sombra
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.shadow.camera.near = 0.8;
directionalLight.shadow.camera.far = 1000;

//const helper = new THREE.CameraHelper( directionalLight.shadow.camera );
//scene.add( helper );

//Esfera para ser o Sol
const geometrySol = new THREE.SphereGeometry( 10, 15, 16 ); 
const moonTextureSol = new THREE.TextureLoader().load("Imagens/Sol.jpeg");
const materialSol = new THREE.MeshPhongMaterial({emissive: 0xFC5404, emissiveIntensity: 0.8});
materialSol.map = moonTextureSol; 
const sphereSol = new THREE.Mesh( geometrySol, materialSol ); 
sphereSol.position.set((totalWidth / 2) + 20, 0, 0);
scene.add( sphereSol );

const geometryLua = new THREE.SphereGeometry( 10, 15, 16 ); 
const moonTexture = new THREE.TextureLoader().load("Imagens/Lua.jpeg");
const materialLua = new THREE.MeshPhongMaterial();
materialLua.map = moonTexture; 
const sphereLua = new THREE.Mesh( geometryLua, materialLua ); 
sphereLua.position.set(-((totalWidth / 2) + 20), 0, 0);
scene.add( sphereLua );

var animate = function () {
requestAnimationFrame(animate);

/*audioLoader.load(`Sound/rda.mp3`, function (buffer) {
	sound.setBuffer(buffer);
	sound.setLoop(true);
	sound.play();
});*/

surface.rotation.x = 1.5708;
camera.position.x += -vel * Math.sin(rumo);
camera.position.z += -vel * Math.cos(rumo);
camera.position.y += voar;
if(camera.position.y < limiteMinY){
	voar = 0;	
	} 
if(camera.position.x >= (totalWidth / 2) - 10){
	camera.position.x = camera.position.x - 2;
}
if(camera.position.x <= -(totalWidth / 2) + 10){
	camera.position.x = camera.position.x + 2;
}
if(camera.position.z >= (totalDepth / 2) - 10){
	camera.position.z = camera.position.z - 2;
}
if(camera.position.z <= -(totalDepth / 2) + 10){
	camera.position.z = camera.position.z + 2;
}
if(camera.position.y >= (totalDepth / 2) - 20){
	camera.position.y = camera.position.y - 2;
}
if(camera.position.x >= (totalWidth / 2) + 10 || 
	camera.position.x <= -(totalWidth / 2) - 10 || 
	camera.position.z >= (totalDepth / 2) + 10 || 
	camera.position.z <= -(totalDepth / 2) - 10 ||
	camera.position.y >= (totalDepth / 2)){
		camera.position.set(0, limiteMinY, 0);
	}


robo.position.x = (- 2 * Math.sin(rumo)) + camera.position.x;
robo.position.y = camera.position.y - 0.5;
robo.position.z = (- 2 * Math.cos(rumo)) + camera.position.z;
robo.rotation.y = 3.14 + rumo;

sphereRob.position.x = robo.position.x;
sphereRob.position.y = robo.position.y;
sphereRob.position.z = robo.position.z;

light.position.x = (- 0.75 * Math.sin(rumo)) + camera.position.x;;
light.position.y = robo.position.y + 1;
light.position.z = (- 0.75 * Math.cos(rumo)) + camera.position.z;

velSol += 0.001;
sphereSol.position.x = (totalWidth / 2 + 100) * Math.sin(velSol) * Math.sin(velSol2);
sphereSol.position.y = (totalWidth / 2 + 100) * Math.cos(velSol);
sphereSol.position.z = ((totalWidth / 2 + 100)*2) * Math.sin(velSol) * Math.cos(velSol2);

sphereLua.position.x = - sphereSol.position.x;
sphereLua.position.y = - sphereSol.position.y;
sphereLua.position.z = - sphereSol.position.z;

if(sphereSol.position.y > 0){
	directionalLight.intensity = sphereSol.position.y / 10;
} else {
	directionalLight.intensity = sphereLua.position.y / 10;
}

if(sphereSol.position.y > 0){
	directionalLight.color.set(0xFC5404);
	directionalLight.position.x = sphereSol.position.x;
	directionalLight.position.y = sphereSol.position.y;
	directionalLight.position.z = sphereSol.position.z;
} else {
	directionalLight.color.set(0x396992);
	directionalLight.position.x = sphereLua.position.x;
	directionalLight.position.y = sphereLua.position.y;
	directionalLight.position.z = sphereLua.position.z;}
rumo += velocidadeAngular;
camera.rotation.y = rumo; 
renderer.render(scene, camera);

for (var i = 0; i < 5; i++){
	var atingido = foiAtingido(objetos[i].position.x, objetos[i].position.y, objetos[i].position.z, 
			sphereRob.position.x, sphereRob.position.y, sphereRob.position.z);


	if(atingido){
			objetos[i].position.x = robo.position.x;
			objetos[i].position.y = robo.position.y - 5;
			objetos[i].position.z = robo.position.z;
	}

}
};

document.onkeydown = function(e) {
	console.log(e);

	if(e.key == " "){
		voar = voar + velVoo;
		velVoo = velVoo + 0.001;
	}

	if(e.key == "ArrowUp") {
		vel = vel + acel;
		acel = acel + 0.001;
	}

	if(e.key == "ArrowDown") {
		vel = vel + acel;
		acel = acel - 0.001;
	}

	if(e.key == "ArrowLeft") {
		velocidadeAngular = 0.05;
	}

	if(e.key == "ArrowRight") {
		velocidadeAngular = -0.05;
	}

}

document.onkeyup = function(e) {
	console.log(e);
	if(e.key == " "){
		if(camera.position.y <= 0){
			voar = 0.1;
		}else(voar = -0.1)
	}

	if(e.key == "ArrowUp") {
		vel = 0.0;
		acel = 0.0;
	}

	if(e.key == "ArrowDown") {
		vel = 0.0;
		acel = 0.0;
	}

	if(e.key == "ArrowLeft") {
		velocidadeAngular = 0.0;
	}

	if(e.key == "ArrowRight") {
		velocidadeAngular = 0.0;
	}
}

animate();

