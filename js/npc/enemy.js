import Animation from '../base/animation'
import DataBus   from '../databus'

const ENEMY_IMG_SRC = 'images/enemy.png'
const ENEMY_WIDTH   = 60
const ENEMY_HEIGHT  = 60

const __ = {
  speed: Symbol('speed'),
  init_point:[
    { x: 100, y: 200 },
    { x: 100, y: 100 },
    { x: 90, y: 20 },
    { x:80, y: 30 },
    { x: 100, y: 50 },
    { x: 210, y: 150 },
    { x:170,  y:230 },
  ]
}
let nCountEnemy=0;
let databus = new DataBus()

function rnd(start, end){
  return Math.floor(Math.random() * (end - start) + start)
}

export default class Enemy extends Animation {
  constructor() {
    super(ENEMY_IMG_SRC, ENEMY_WIDTH, ENEMY_HEIGHT)

    this.initExplosionAnimation()
  }

  init(speed,nCurrentEnemyIndex) {


    let iIndex=nCurrentEnemyIndex % __.init_point.length ;

    this.x = __.init_point[ iIndex].x;
    this.y = __.init_point[iIndex].y;
    /*
    this.x = rnd(0, window.innerWidth - ENEMY_WIDTH)
    this.y = 100+ rnd(0,50);// -this.height
*/
    this[__.speed] = speed

    this.visible = true
  }

  // 预定义爆炸的帧动画
  initExplosionAnimation() {
    let frames = []

    const EXPLO_IMG_PREFIX  = 'images/explosion'
    const EXPLO_FRAME_COUNT = 19

    for ( let i = 0;i < EXPLO_FRAME_COUNT;i++ ) {
      frames.push(EXPLO_IMG_PREFIX + (i + 1) + '.png')
    }

    this.initFrames(frames)
  }

  // 每一帧更新子弹位置
  update() {
    this.y +=  this[__.speed]

    // 对象回收
    if ( this.y > window.innerHeight + this.height )
      databus.removeEnemey(this)
  }
}
