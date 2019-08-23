import { CELL_SIZE } from './Cell'
import GameScene from './GameScene'
import HomeScene from './HomeScene'
import ImageManager from './ImageManager'
import Map from './Map'
import Scene from './Scene'
import SceneTransition from './SceneTransition';

export default class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private map: Map
  private lastUpdate: number
  private zoom: number
  private scene: Scene
  private sceneTransition: SceneTransition

  public constructor() {
    this.canvas = document.getElementById('app') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.lastUpdate = Date.now()

    this.zoom = 1

    this.sceneTransition = new SceneTransition(this)

    window.addEventListener('resize', (e: UIEvent) => this.resize(e))

    const imagesLoader = ImageManager.load('assets/img/', {
      'tiles': 'tiles.png',
      'player': 'player.png',
      'background': 'background.png',
    })

    Promise.all(imagesLoader).then(() => {
      this.init()
    })
  }

  public init(): void {
    this.scene = new HomeScene(this)
    // this.scene = new GameScene(this)

    this.resize()

    this.update()
  }

  public update(): void {
    const now = Date.now()
    const dt = (now - this.lastUpdate) / 1000
    this.lastUpdate = now

    this.scene.update(dt)

    this.sceneTransition.update(dt)

    this.render(this.ctx)

    requestAnimationFrame(() => this.update())
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // let { width, height } = this.map.getSize()
    let [ width, height ] = this.getScreenSize()

    width *= this.zoom
    height *= this.zoom

    const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    const diffWidth = (screenWidth - width) / 2 / this.zoom
    const diffHeight = (screenHeight - height) / 2 / this.zoom

    ctx.save()
    ctx.translate(diffWidth, diffHeight)

    this.scene.render(ctx)

    this.sceneTransition.render(ctx)

    ctx.restore()
  }

  public getMap(): Map {
    return this.map
  }

  public resize(_e: UIEvent | null = null): void {
    // let { width, height } = this.map.getSize()
    const [ width, height ] = this.getScreenSize()

    const widthZoom = window.innerWidth / width
    const heightZoom = window.innerHeight / height

    this.zoom = Math.min(widthZoom, heightZoom)

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.ctx.imageSmoothingEnabled = false
    this.ctx.scale(this.zoom, this.zoom)
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas
  }

  public getCtx(): CanvasRenderingContext2D {
    return this.ctx
  }

  public getZoom(): number {
    return this.zoom
  }

  public changeScene<T extends Scene>(sceneName: new (game: Game) => T): void {
    this.scene = new sceneName(this)
  }

  public changeSceneWithTransition<T extends Scene>(sceneName: new (game: Game) => T): void {
    this.sceneTransition.changeScene(sceneName)
  }

  public getScreenSize(): [ number, number ] {
    let [ width, height ] = [ 9, 9 ]
    width *= CELL_SIZE
    height *= CELL_SIZE

    return [ width, height ]
  }
}
