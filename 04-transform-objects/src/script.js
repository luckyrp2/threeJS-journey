import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const group = new THREE.Group()
group.position.y = 1
scene.add(group)

const cube1 = new THREE.Mesh (
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 'blue'})
)
const cube2 = new THREE.Mesh (
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({color: 'green'})
)

cube2.position.x = -2
group.add(cube1)
group.add(cube2)


/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
mesh.position.set(0.7, -0.6, 1)

//scale 
mesh.scale.set(2, 0.5, 0.5)


//rotation reorder so we don't lock the rotation
mesh.rotation.reorder('YXZ')

//rotation
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 0.7
camera.position.z = -0.6
camera.position.z = 3

scene.add(camera)

//have camera follow another object
//can have it look at one point or mesh.position 
camera.lookAt(0,0,0)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)