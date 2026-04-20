// CSS-based animated background — replaces particles.js (~87KB saved)
// Generates floating dot particles using canvas, zero dependencies
function initCanvasBackground() {
  var container = document.getElementById('particles-js')
  if (!container) return

  var canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none'
  container.insertBefore(canvas, container.firstChild)

  var ctx = canvas.getContext('2d')
  var dots = []
  var W, H

  function resize() {
    W = canvas.width = container.offsetWidth
    H = canvas.height = container.offsetHeight
  }

  function Dot() {
    this.x = Math.random() * W
    this.y = Math.random() * H
    this.r = Math.random() * 2 + 1
    this.vx = (Math.random() - 0.5) * 0.6
    this.vy = (Math.random() - 0.5) * 0.6
    this.alpha = Math.random() * 0.4 + 0.1
  }

  Dot.prototype.update = function() {
    this.x += this.vx
    this.y += this.vy
    if (this.x < 0 || this.x > W) this.vx *= -1
    if (this.y < 0 || this.y > H) this.vy *= -1
  }

  function init() {
    resize()
    dots = Array.from({ length: 60 }, function() { return new Dot() })
  }

  function draw() {
    ctx.clearRect(0, 0, W, H)
    // Draw connecting lines between nearby dots
    for (var i = 0; i < dots.length; i++) {
      for (var j = i + 1; j < dots.length; j++) {
        var dx = dots[i].x - dots[j].x
        var dy = dots[i].y - dots[j].y
        var dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 120) {
          ctx.beginPath()
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.15 * (1 - dist / 120)) + ')'
          ctx.lineWidth = 0.5
          ctx.moveTo(dots[i].x, dots[i].y)
          ctx.lineTo(dots[j].x, dots[j].y)
          ctx.stroke()
        }
      }
    }
    // Draw dots
    dots.forEach(function(d) {
      d.update()
      ctx.beginPath()
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,' + d.alpha + ')'
      ctx.fill()
    })
    requestAnimationFrame(draw)
  }

  window.addEventListener('resize', resize)
  init()

  // Defer first frame slightly so it doesn't block paint
  requestAnimationFrame(draw)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCanvasBackground)
} else {
  initCanvasBackground()
}
