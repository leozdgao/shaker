const supportDeviceMotion = 'ondevicemotion' in window

function startWatch (watcher, { threshold = 15, timeout = 1000 }) {
  if (!supportDeviceMotion) return

  let last = null, lastTime = null
  window.addEventListener('devicemotion', devicemotionHandler)

  function devicemotionHandler (e) {
    const current = e.accelerationIncludingGravity

    if (!last) {
      last = current
      return
    }

    const deltaX = delta(last.x, current.x)
    const deltaY = delta(last.y, current.y)
    const deltaZ = delta(last.z, current.z)

    // 摇晃的剧烈程度
    if (deltaX > threshold && deltaY > threshold ||
    deltaY > threshold && deltaZ > threshold ||
    deltaX > threshold && deltaZ > threshold) {
      if (new Date() - lastTime > timeout) {
        watcher.apply(null, [])
        lastTime = new Date()
      }
    }

    function delta (a, b) {
      return Math.abs(a - b)
    }
  }

  return _ => {
    window.removeEventListener('devicemotion', devicemotionHandler)
    last = null
    lastTime = null
  }
}

module.exports = {
  startWatch, supportDeviceMotion
}

//
// var Shaker = (function (options) {
//
//   // var threshold = options.threshold || 15
//   // var timeout = options.timeout || 1000
//   // var listeners = []
//   // var last = null, lastTime = null
//
//   function init () {
//
//
//   }
//   function dispose () {
//     window.removeEventListener('devicemotion', devicemotionHandler)
//     last = null
//     listeners = []
//   }
//
//   function devicemotionHandler (e) {
//     var current = e.accelerationIncludingGravity
//
//     if (!last) {
//       last = current
//       return
//     }
//
//     var deltaX = delta(last.x, current.x)
//     var deltaY = delta(last.y, current.y)
//     var deltaZ = delta(last.z, current.z)
//
//     // 摇晃的剧烈程度
//     if (deltaX > threshold && deltaY > threshold ||
//     deltaY > threshold && deltaZ > threshold ||
//     deltaX > threshold && deltaZ > threshold) {
//       if (new Date() - lastTime > timeout) {
//         listeners.forEach(function (fn) {
//           fn.apply(null, [])
//         })
//         lastTime = new Date()
//       }
//     }
//
//     function delta (a, b) {
//       return Math.abs(a - b)
//     }
//   }
//
//   return {
//     addWatcher: function (fn) {
//       listeners.push(fn)
//
//       if (listeners.length <= 1) {
//         lastTime = new Date()
//         init()
//       }
//     },
//     removeWatcher: function (fn) {
//       var i = listeners.indexOf(fn)
//       if (i >= 0) {
//         listeners.splice(i, 1)
//       }
//     },
//     once: function (fn) {
//       var self = this
//       this.addWatcher(function handler () {
//         fn.apply(null, [])
//         self.removeWatcher(handler)
//       })
//     },
//     stopWatch: function () {
//       dispose()
//     },
//     supportDeviceMotion: supportDeviceMotion
//   }
// })({})
//
// Shaker.once(function () {
//   alert('shake')
// })
