(function() {
  document.addEventListener('DOMNodeInserted', checksearch, false);

  function checksearch() {    
    if (window.location.hostname.match(/www\.facebook\.com/)) {       
      document.removeEventListener('DOMNodeInserted', checksearch, false);
      document.addEventListener('DOMNodeInserted', huntForLinks, false);
    }
  }
  
var fixEvilRedirect = function(event) {    
    var node = event.target;
    if(!node.getAttribute('onmouseover') ||  !node.getAttribute('onclick')) {
      node = this;
    }
    var mouseOverAttr = node.getAttribute('onmouseover');    
    node.removeAttribute('onclick');
    node.removeAttribute('onmouseover');    
    node.removeEventListener('mouseover', fixEvilRedirect, false);
    var refPattern = /LinkshimAsyncLink.swap\(this\, \"(.*)\"\);/;
    mouseOverAttr = mouseOverAttr.replace(/&quot;/g,'"');    
    var realHref = unescape(refPattern.exec(mouseOverAttr)[1]);
    realHref = realHref.replace(/\\\//g, "/");
    // For some reason, the % sign gets escaped into unicode like so: \u0025
    // Manually unescaping the url below.
    realHref = realHref.replace(/\\u0025([0-9a-fA-F]{2})/g,"%$1");
    node.href = realHref;
  };

var fixRegularRedirect = function(event)
{
  var node = event.target;      
    
  // remove facebook's event handlers.
  node.removeAttribute('onclick');
  node.removeAttribute('onmousedown');
  // disable this event handler
  node.removeEventListener('mouseover',fixRegularRedirect,false);
  
  // Remove facebook redirection. 
  var facebookRedirectString = "http://www.facebook.com/l.php?u=";  
  var realHref = unescape(node.href.replace(facebookRedirectString,""));  
  // set the href tag to the original URL as it should be.
  node.href = realHref;

};
  
  
  function huntForLinks() {     
    var items = document.getElementsByTagName('a');    
    var onMouseOverAttr;
    var onClickAttr;
    var onMouseDownAttr;

    var evilFunc1 = 'LinkshimAsyncLink.swap(this';
    var evilFunc2 = 'UntrustedLink.bootstrap(this';

    for (var i = items.length - 1; i >= 0; i--) {
      onMouseOverAttr = items[i].getAttribute('onmouseover');
      onClickAttr = items[i].getAttribute('onclick');
      onMouseDownAttr = items[i].getAttribute('onmousedown');
      
      if (onMouseOverAttr && onClickAttr) {        
        if (onMouseOverAttr.indexOf(evilFunc1) !== -1 && onClickAttr.indexOf(evilFunc1) !== -1) {
          items[i].addEventListener('mouseover', fixEvilRedirect, false);          
        }
      }

      if(onMouseDownAttr) {
        if(onMouseDownAttr.indexOf(evilFunc2) !== -1) {          
          items[i].addEventListener('mouseover',fixRegularRedirect,false);
        }
      }
    }
  }
  
})();