$(function() {

var regExp = /\d+/
var playlistId = parseInt(regExp.exec(window.location.pathname)[0])

var nextSongId
var nextSongRecord

$.ajax({
  url: '/playlists/' + playlistId + '/next_song',
  method: 'get',
}).done(function(data){
  nextSongId = data['song_id'];
  nextSongRecord = data['song_record'];
  setTimeout(function(){DZ.player.playTracks([nextSongId])},3000);
  $.ajax({
    url: '/playlists/' + playlistId + '/update_song_playing?song_id=' + nextSongRecord,
    method: 'get',
  }).done(function(data){
    console.log("Update song to playing");
    
    $('.playing').first().addClass('que').removeClass('playing');
    $('.que .fa-volume-down').removeClass('fa-volume-down').addClass('fa-long-arrow-up');
    $('.que').first().addClass('playing').removeClass('que');
    $('.playing .fa-long-arrow-up').removeClass('fa-long-arrow-up').addClass('fa-volume-down');
  });
  setTimeout(function(){DZ.Event.subscribe('track_end', function(){
    $.ajax({
      url: '/playlists/' + playlistId + '/update_song?song_id=' + nextSongRecord,
      method: 'get',
    }).done(function(data){
      DZ.player.playTracks([data['song_id']]);
      nextSongRecord = data['song_record'];
      $.ajax({
        url: '/playlists/' + playlistId + '/playlist_broadcast',
        method: 'get',
      }).done(function(data){
        console.log(data);
        console.log('created the latest playlist to send to actioncable');
      })
      })
    })},3000);
  })
})
