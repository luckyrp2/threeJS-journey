import * as THREE from 'three'

console.log(THREE)

const scene = new THREE.Scene()

//Mesh is a combination of a geometry and the material 
const geometry = new THREE.BoxGeometry(1,1,1)
const material = new THREE.MeshBasicMaterial({color: 'red'})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)