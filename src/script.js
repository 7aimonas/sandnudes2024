
let renderer, scene, camera, ground
let cw = document.body.clientWidth
let ch = document.body.clientHeight
let y = 0, step = 1/8, wave = []
let groundPosition, groundPositionLength


const buffer = 256
const dataArray = []

const world = {
  height: 500,
  width: 6000,
  depth: 5000
}

class App {

  constructor() {
    this._initData()
    this._initScene()
    this._bindEvent()
  }

  _initData() {
    const l = buffer / 2
    for (let i = 0; i < l; i++) {
      dataArray[i] = Math.floor(100 * Math.random())
    }
  }

  _updateWaveData() {
    const l = dataArray.length
    for (let i = 0; i < l; i++) {
      const data = 12 * Math.sin(y + i / 2) + 10 * Math.cos(y + i / 4) + 5 * Math.sin(y / 4 + i / 2)
      dataArray[i] = data
      const n = world.height * data / 300
      wave.unshift(n)
    }
    wave.splice(wave.length - dataArray.length, dataArray.length)
    y += 0.03
  }

  _updateWave() {
    groundPosition.needsUpdate = true
    for (let i = 0, j = 0; i < groundPositionLength; i += 3 * step) {
      groundPosition.array[i + 1] = wave[j]
      j += step
    }
  }

  _bindEvent() {
    window.addEventListener('resize', this._resize.bind(this), false)
  }

  _resize() {
    cw = document.body.clientWidth
    ch = document.body.clientHeight
    camera.aspect = cw / ch/6
    camera.updateProjectionMatrix()
    renderer.setSize(cw, 1.8*ch)
  }

  _initScene() {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    })
    renderer.autoClear = false
    scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2('rgb(255, 173, 0)', 0.0004)
    camera = new THREE.PerspectiveCamera(40, cw / ch, 0.1, 10000)
    camera.position.set(300, 200, world.depth / 2)
    camera.lookAt(400, 0, 0)

    this._createLights()
    this._createGround()

    document.body.appendChild(renderer.domElement)
    this._resize()
    this._render()
  }

  _createLights() {
    const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)')
    ambientLight.intensity = 0.9
    scene.add(ambientLight)
  }

  _createGround() {
    const segX = buffer / 2 - 1
    const segY = buffer / 2 - 1
    const groundGeo = new THREE.PlaneBufferGeometry(world.width, world.depth, segX, segY)
    groundGeo.rotateX(-Math.PI / 2)
    const groundMat = new THREE.MeshPhongMaterial({
      fog: true,
      transparent: true,
      flatShading: true,
      shininess: 30,
      color: 'rgb(4, 13, 30)',
      specular: 'rgb(0, 142, 146)'
    })
    ground = new THREE.Mesh(groundGeo, groundMat)
    scene.add(ground)
    groundPosition = ground.geometry.attributes.position
    groundPositionLength = groundPosition.array.length - buffer
    for (let i = 0; i < groundPositionLength; i += 3) {
      wave.push(0)
    }
  }

  _render() {
    this._updateWaveData()
    this._updateWave()
    renderer.render(scene, camera)
    requestAnimationFrame(this._render.bind(this))
  }

}

const app = new App()