window.dzAsyncInit = function() {

  if($(window).width() < 480){
    DZ.init({
      appId  : '226822',
      channelUrl : 'http://localhost:3000/playlist/player',
      player : {
        container: 'd_player',
        color: 'EB00D4',

layout: 'light',
        // format: "square",
        // height: "100%",
        width: "95%",
        // size: "medium",
        onload : function(){}
      }
    })

  } else { //window width > 480px
    DZ.init({
      appId  : '226822',
      channelUrl : 'http://localhost:3000/playlist/player',
      player : {
        container: 'd_player',
        height : 90,
        color: 'EB00D4',

layout: 'light',
        onload : function(){}
      }
    })
  }

};

(function() {
  var e = document.createElement('script');
  e.src = 'http://e-cdn-files.deezer.com/js/min/dz.js';
  e.async = true;
  document.getElementById('dz-root').appendChild(e);
}());
