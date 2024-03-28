import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => 
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader() 
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')

gradientTexture.magFilter = THREE.NearestFilter
const material = new THREE.MeshToonMaterial({
    color: parameters.materialColor,
    gradientMap: gradientTexture

})
const torus = new THREE.Mesh( 
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const cone = new THREE.Mesh( 
    new THREE.ConeGeometry(1, 2, 32),
    material

)
const knot = new THREE.Mesh( 
    new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16),
    material

)

const objectsDistance = 4
torus.position.y = - objectsDistance * 0
cone.position.y = - objectsDistance * 1
knot.position.y = - objectsDistance * 2

torus.position.x = 2
cone.position.x = -2
knot.position.x = 2
scene.add(torus, cone, knot)
const meshArray = [torus, cone, knot]


//Particles
const particlesCount = 200
const position = new Float32Array(particlesCount * 3)

for(let i = 0; i < particlesCount; i++){ 
    position[i * 3] = (Math.random() - 0.5) * 10
    position[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * meshArray.length
    position[i * 3 + 2] = (Math.random() - 0.5) * 10

}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(position, 3))

//Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true, 
    size: 0.03
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


/**
 * Sizes
 */

const light = new THREE.DirectionalLight('#ffffff', 2)
light.position.set(1,1,0)
scene.add(light)


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
//Field of view is vertical

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)


const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

let scrollY = window.scrollY
let currentSection = 0
/**
 * Animate
 */

window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
    //when this hits one then we are in the next section 
    const newSection = Math.round(scrollY / sizes.height)

    if(newSection != currentSection) { 
        currentSection = newSection
        gsap.to(
            meshArray[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    //make it 0 to 1 so camera doesn't move too much
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

const clock = new THREE.Clock()
let previousTime = 0


const tick = () =>
{


    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Animate meshes

    camera.position.y = - scrollY / sizes.height * objectsDistance

    

    const parallaxX = cursor.x * 0.5
    //usually need to negate the y because going down is really going up
    const parallaxY = - cursor.y * 0.5

    //helps to normalize with frame rate when using delatTime
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY -cameraGroup.position.y) * 5 * deltaTime
    for(const mesh of meshArray) { 
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()