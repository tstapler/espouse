import 'jquery'
import '../dist/components/label.css'
import '../dist/components/table.css'

import '../dist/components/sticky.css'
import '../dist/components/sticky.js'

import '../dist/components/dimmer.css'
import '../dist/components/dimmer.js'

import '../dist/components/sidebar.css'
import '../dist/components/sidebar.js'

import '../dist/components/transition.css'
import '../dist/components/transition.js'

import '../dist/components/modal.css'
import '../dist/components/modal.js'



// fix main menu to page on passing
$('.main.menu').sticky({
  context: '#footer'
})

$('#menuButton').on('click keydown', function(e){
  if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return
  if (e.type === 'keydown') e.preventDefault()
  $('.ui.sidebar').sidebar('toggle')
  var expanded = $(this).attr('aria-expanded') === 'true'
  $(this).attr('aria-expanded', String(!expanded))
})

// --- Copy-to-clipboard for code blocks ---
function addCopyButtons() {
  document.querySelectorAll('article pre').forEach(function(pre) {
    var btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.textContent = 'Copy'
    btn.setAttribute('aria-label', 'Copy code to clipboard')
    btn.addEventListener('click', function() {
      var text = (pre.querySelector('code') || pre).innerText
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          btn.textContent = '✓ Copied'
          btn.classList.add('copied')
          setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied') }, 2000)
        }).catch(fallbackCopy)
      } else {
        fallbackCopy()
      }
      function fallbackCopy() {
        var ta = document.createElement('textarea')
        ta.value = text
        ta.style.cssText = 'position:fixed;opacity:0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
        btn.textContent = '✓ Copied'
        btn.classList.add('copied')
        setTimeout(function() { btn.textContent = 'Copy'; btn.classList.remove('copied') }, 2000)
      }
    })
    pre.appendChild(btn)
  })
}

// --- Heading anchor links ---
function addHeadingAnchors() {
  var article = document.querySelector('#content')
  if (!article) return
  article.querySelectorAll('h2[id], h3[id]').forEach(function(h) {
    var a = document.createElement('a')
    a.className = 'heading-anchor'
    a.href = '#' + h.id
    a.setAttribute('aria-label', 'Link to this section')
    a.textContent = '#'
    h.appendChild(a)
  })
}

// --- Reading progress bar ---
function initReadingProgress() {
  var bar = document.getElementById('reading-progress')
  if (!bar) return
  function update() {
    var scrolled = window.scrollY || window.pageYOffset
    var total = document.documentElement.scrollHeight - window.innerHeight
    bar.style.transform = 'scaleX(' + (total > 0 ? scrolled / total : 0) + ')'
  }
  window.addEventListener('scroll', update, { passive: true })
  update()
}

// --- TOC active section highlight ---
function initTOCHighlight() {
  var toc = document.getElementById('TableOfContents')
  if (!toc) return
  var headings = Array.from(document.querySelectorAll('#content h2[id], #content h3[id]'))
  if (!headings.length) return
  var links = {}
  headings.forEach(function(h) {
    var a = toc.querySelector('a[href="#' + h.id + '"]')
    if (a) links[h.id] = a
  })
  function update() {
    var current = headings[0]
    headings.forEach(function(h) {
      if (h.getBoundingClientRect().top < 120) current = h
    })
    Object.values(links).forEach(function(a) { a.classList.remove('toc-active') })
    if (links[current.id]) links[current.id].classList.add('toc-active')
  }
  window.addEventListener('scroll', update, { passive: true })
  update()
}

// Defer scripts run after DOM parsing; no need to wait for DOMContentLoaded
function initEnhancements() {
  addCopyButtons()
  addHeadingAnchors()
  initReadingProgress()
  initTOCHighlight()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEnhancements)
} else {
  initEnhancements()
}

function uuid() {
var result='';
for(var i=0; i<32; i++)
result += Math.floor(Math.random()*16).toString(16).toUpperCase
();
return result
}

// Lightbox for photos using Semantic UI
// Should work for the image shortcode
$('.post-image').click(function() {
  var image = $(this)
    .children('img')
    .attr('src')
  var id = uuid()
  $('body').append(
    `<div id=${id} class="ui modal">
        <img class="ui centered image" src="${image}"/>
    </div>`
  )

  $(`#${id}`).modal({
    onHidden: () => $(`#${id}`).remove()
  })

  $(`#${id}`).modal('show')
})
