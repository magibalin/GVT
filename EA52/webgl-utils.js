WebGLUtils = function() {

  /**
   * Erstellt den HTML-Code für eine Fehlermeldung.
   * @param {string} msg Die Fehlermeldung.
   * @return {string} Der HTML-Code.
   */
  var makeFailHTML = function(msg) {
    return '' +
      '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
      '<td align="center">' +
      '<div style="display: table-cell; vertical-align: middle;">' +
      '<div style="">' + msg + '</div>' +
      '</div>' +
      '</td></tr></table>';
  };

  /**
   * Meldung für einen fehlenden WebGL-fähigen Browser.
   * @type {string}
   */
  var GET_A_WEBGL_BROWSER = '' +
    'Diese Seite erfordert einen Browser, der WebGL unterstützt.<br/>' +
    '<a href="http://get.webgl.org">Klicken Sie hier, um Ihren Browser zu aktualisieren.</a>';

  /**
   * Meldung für unzureichende Hardware.
   * @type {string}
   */
  var OTHER_PROBLEM = '' +
    "Es scheint, als ob Ihr Computer WebGL nicht unterstützt.<br/>" +
    '<a href="http://get.webgl.org/troubleshooting/">Klicken Sie hier für weitere Informationen.</a>';

  /**
   * Erstellt einen WebGL-Kontext.
   * @param {Element} canvas Das Canvas-Element, um den Kontext zu erstellen.
   * @param {WebGLContextCreationAttirbutes} opt_attribs Erstellungsoptionen.
   * @param {function:(msg)} opt_onError Funktion bei Fehlern.
   * @return {WebGLRenderingContext} Der erstellte Kontext.
   */
  var setupWebGL = function(canvas, opt_attribs, opt_onError) {
    function handleCreationError(msg) {
      var container = canvas.parentNode;
      if (container) {
        var str = window.WebGLRenderingContext ? OTHER_PROBLEM : GET_A_WEBGL_BROWSER;
        if (msg) {
          str += "<br/><br/>Status: " + msg;
        }
        container.innerHTML = makeFailHTML(str);
      }
    };

    opt_onError = opt_onError || handleCreationError;

    if (canvas.addEventListener) {
      canvas.addEventListener("webglcontextcreationerror", function(event) {
        opt_onError(event.statusMessage);
      }, false);
    }
    var context = create3DContext(canvas, opt_attribs);
    if (!context) {
      if (!window.WebGLRenderingContext) {
        opt_onError("");
      }
    }
    return context;
  };

  /**
   * Erstellt einen WebGL-Kontext.
   * @param {!Canvas} canvas Das Canvas-Element.
   * @return {!WebGLContext} Der erstellte Kontext.
   */
  var create3DContext = function(canvas, opt_attribs) {
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
      try {
        context = canvas.getContext(names[ii], opt_attribs);
      } catch(e) {}
      if (context) {
        break;
      }
    }
    return context;
  }

  return {
    create3DContext: create3DContext,
    setupWebGL: setupWebGL
  };
}();

/**
 * Bietet requestAnimationFrame für verschiedene Browser.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(callback, element) {
           window.setTimeout(callback, 1000/60);
         };
})();
