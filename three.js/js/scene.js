const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 2, window.innerWidth / window.innerHeight, 1, 200 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.set(0,0,100);
camera.lookAt(0,0,0);


const material = new THREE.MeshBasicMaterial( { color: 0x885566 } );
const geometry = new THREE.BufferGeometry();

const vertices = new Float32Array( [
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,

	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0, -1.0,  1.0,

] );

geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh);
renderer.render(scene, camera);


function animate() {
  requestAnimationFrame( animate );
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.005;
  renderer.render( scene, camera );
};

animate();