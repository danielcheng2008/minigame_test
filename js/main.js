import Player     from './player/index'
import Enemy      from './npc/enemy'
import bgfirst from './runtime/bgfirst'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import DataBus    from './databus'

let ctx   = canvas.getContext('2d')
let databus = new DataBus()
let nCountEnemy = 0;
/**
 * 游戏主函数
 */
export default class Main {
  constructor() { 

    this.touchHandler = this.touchEventHandler.bind(this)
    canvas.addEventListener('touchstart', this.touchHandler)
    this.restart()
    
  }

  restart() {
    databus.reset()

  /*
     canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    ) */

    this.bgfirst = new bgfirst(ctx)
    this.bg       = new BackGround(ctx)
    this.player   = new Player(ctx)


    this.gameinfo = new GameInfo()
    this.music    = new Music()


    
    
    window.requestAnimationFrame(
      this.loop.bind(this), 
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑 
   * 帧数取模定义成生成的频率
   */

  
  enemyGenerate() {

    if ( databus.frame % 30 === 0 ) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6, nCountEnemy)
      databus.enemys.push(enemy)

      nCountEnemy++
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this

    databus.bullets.forEach((bullet) => {
      for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
        let enemy = databus.enemys[i]

        if ( !enemy.isPlaying && enemy.isCollideWith(bullet) ) {
          enemy.playAnimation()
          that.music.playExplosion()

          bullet.visible = false
          databus.score  += 1

          break
        }
      }
    })

    for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
      let enemy = databus.enemys[i]

      if ( this.player.isCollideWith(enemy) ) {
        enemy.playAnimation()
        console.log("game over")
        databus.gameOver = true

        break
      }
    }
  }

  //游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
     e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    console.log("x="+x,"y="+y)

    if(databus.layer==0){
      this.gotoMain();return;
    }

    let area = this.gameinfo.btnArea

 

    if (   x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY  )
      this.restart()
    }
    /**
     * canvas重绘函数
     * 每一帧重新绘制所有的需要展示的元素
     */
    render() {


    ctx.clearRect(0, 0, canvas.width, canvas.height)

    


    switch (databus.layer) {
      case 0:
        this.bgfirst.render(ctx)
      
        this.gameinfo.renderFirst(ctx)

      break;

      case 1:
        this.bg.render(ctx)
        this.player.render(ctx)


        databus.bullets
           .concat(databus.enemys)
           .forEach((item) => {
              item.drawToCanvas(ctx)
            })

      //this.player.drawToCanvas(ctx)

    databus.animations.forEach((ani) => {
      if ( ani.isPlaying ) {
        ani.aniRender(ctx)
      }
    })

    this.gameinfo.renderGameScore(ctx, databus.score)

    break;

    }
  }

  // 游戏逻辑更新主函数
  update() {

    console.log(databus.layer)
    switch(databus.layer)
    {
      case 0:
        this.bgfirst.update()

      break;
      case 1:
        this.bg.update()
      
        databus.bullets
          .concat(databus.enemys)
          .forEach((item) => {
            item.update()
          })

        this.enemyGenerate()
        this.collisionDetection()



        if (databus.frame % 20 === 0) {
          this.player.shoot()
          this.music.playShoot()
        }



      break;
    }

    
  


  }
  gotoMain(){
    databus.layer=1
    canvas.removeEventListener('touchstart', this.touchHandler)

    console.log("gotoMain")
  }

  
  // 实现游戏帧循环
  loop() {
    databus.frame++
 
    this.update()
    this.render()
 

    // 游戏结束停止帧循环
    if (databus.gameOver) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      this.touchHandler = this.touchEventHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)
      return
    }

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }
}


