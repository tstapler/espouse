import pJS from "particles.js"
var particleJSConfig = {
    "particles": {
          "number": {
                  "value": 80,
                  "density": {
                            "enable": true,
                            "value_area": 800
                          }
                },
          "color": {
                  "value": "#ffffff"
                },
          "shape": {
                  "type": "circle",
                  "stroke": {
                            "width": 0,
                            "color": "#000000"
                          },
                  "polygon": {
                            "nb_sides": 5
                          },
                },
          "opacity": {
                  "value": 0.5,
                  "random": false,
                  "anim": {
                            "enable": false,
                            "speed": 1,
                            "opacity_min": 0.1,
                            "sync": false
                          }
                },
          "size": {
                  "value": 3,
                  "random": true,
                  "anim": {
                            "enable": false,
                            "speed": 40,
                            "size_min": 0.1,
                            "sync": false
                          }
                },
          "line_linked": {
                  "enable": true,
                  "distance": 150,
                  "color": "#ffffff",
                  "opacity": 0.4,
                  "width": 1
                },
          "move": {
                  "enable": true,
                  "speed": 6,
                  "direction": "none",
                  "random": false,
                  "straight": false,
                  "out_mode": "out",
                  "attract": {
                            "enable": false,
                            "rotateX": 600,
                            "rotateY": 1200
                          }
                }
        },
    "interactivity": {
          "detect_on": "canvas",
          "events": {
                  "onhover": {
                            "enable": true,
                            "mode": "repulse"
                          },
                  "onclick": {
                            "enable": true,
                            "mode": "push"
                          },
                  "resize": true
                },
        },
    "retina_detect": true,
};

if(typeof particlesJS !== 'undefined') {
  // Remove the canvas element if it was created by running preprocessing
 window.addEventListener('load', function() {
  let exist_canvas = document.getElementsByTagName('canvas')
  console.log(exist_canvas[0])
  if(exist_canvas[0]) {
    exist_canvas[0].remove()
    console.log("Deleted canvas")
  }
  particlesJS(particleJSConfig);
})
}
