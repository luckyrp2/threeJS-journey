import * as THREE from 'three'


const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

//Mesh is a combination of a geometry and the material 
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color: 'red', wireframe:true})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Camera POV
//first paramater is degree, ratio of scene 
const sizes = { 
    width: 800, 
    height: 600
}
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
//by default everything is centered
camera.position.z = 3
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

