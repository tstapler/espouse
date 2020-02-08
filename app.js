import 'jquery'
import 'jquery-lazy'
import mermaid from 'mermaid'
import 'semantic-ui-forest-themes/semantic.spacelab.min.css'
import 'semantic-ui-forest-themes/semantic.js'
mermaid.initialize({})
$(document).ready(function() {
  $('code.language-mermaid').each(function(index, element) {
    var content = $(element).html().replace(/&amp;/g, '&')
    $(element).parent().replaceWith('<div class="mermaid" align="center">' + content + '</div>')
  });
});
import './src/espouse.js'
import './sass/espouse.scss'
import * as OfflinePluginRuntime from 'offline-plugin/runtime';
OfflinePluginRuntime.install();
