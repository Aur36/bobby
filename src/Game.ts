import Direction from './Direction'
import ImageManager from './ImageManager'
import { Key, Keyboard } from './Keyboard'
import Map from './Map'
import Player from './Player'

export default class Game {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private map: Map
  private player: Player
  private keyboard: Keyboard
  private lastUpdate: number
  private zoom: number

  public constructor() {
    this.canvas = document.getElementById('app') as HTMLCanvasElement
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D

    this.zoom = 2

    this.canvas.width = 320 * this.zoom
    this.canvas.height = 240 * this.zoom

    this.ctx.imageSmoothingEnabled = false
    this.ctx.scale(this.zoom, this.zoom)

    this.lastUpdate = Date.now()

    this.keyboard = new Keyboard()

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
    this.map = Map.firstLevel()

    this.player = new Player(this, this.map.startLocation())

    this.update()
  }

  public update(): void {
    const now = Date.now()
    const dt = (now - this.lastUpdate) / 1000
    this.lastUpdate = now

    if (this.player.isAbleToMove()) {
      if (this.keyboard.down(Key.Up)) {
        this.player.move(Direction.Up)
      }

      if (this.keyboard.down(Key.Down)) {
        this.player.move(Direction.Down)
      }

      if (this.keyboard.down(Key.Right)) {
        this.player.move(Direction.Right)
      }

      if (this.keyboard.down(Key.Left)) {
        this.player.move(Direction.Left)
      }
    }

    this.map.update(dt)
    this.player.update(dt)

    this.render()

    requestAnimationFrame(() => this.update())
  }

  public render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const bgImg = ImageManager.getImage('background')
    const pat = this.ctx.createPattern(bgImg, 'repeat')
    this.ctx.rect(0, 0, 140, 140)
    this.ctx.fillStyle = pat
    this.ctx.fill()

    this.map.render(this.ctx)
    this.player.render(this.ctx)
  }

  public getMap(): Map {
    return this.map
  }
}
