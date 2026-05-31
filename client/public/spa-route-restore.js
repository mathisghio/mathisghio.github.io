(function (l) {
  // /index.html → / redirect: prevents Google soft 404 duplicate
  if (l.pathname === '/index.html') {
    l.replace(l.protocol + '//' + l.host + '/' + l.search + l.hash);
    return;
  }
  if (l.search[1] === '/') {
    var decoded = l.search.slice(1).split('&').map(function (s) {
      return s.replace(/~and~/g, '&');
    }).join('?');
    // Inject canonical so Google doesn't index the /?/path form as a separate page
    var link = document.createElement('link');
    link.rel = 'canonical';
    link.href = l.protocol + '//' + l.host + decoded;
    document.head.appendChild(link);
    window.history.replaceState(null, null, decoded + l.hash);
  }
}(window.location));
