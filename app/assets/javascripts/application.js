// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
//= require materialize



function getRandomInt() {
  min = Math.ceil(1);
  max = Math.floor(7);
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomColor() {
  var num = getRandomInt()
  if (num === 1) {
    return 'pink lighten-3'
  } else if (num === 2){
    return 'purple accent-2'
  } else if (num === 3) {
    return 'indigo accent-1'
  } else if (num === 4) {
    return 'green accent-4'
  } else if (num === 5) {
    return 'teal lighten-1'
  } else if (num === 6) {
    return 'orange lighten-1'
  }
};

function randomPhrase() {
  var num = getRandomInt()
  if (num === 1) {
    return "Your song was added. Let's party!"
  } else if (num === 2){
    return "Woohoo! Song added!"
  } else if (num === 3) {
    return 'Nice taste in music! Song added.'
  } else if (num === 4) {
    return 'Achievement unlocked! Just kidding. Your song was still added though!'
  } else if (num === 5) {
    return 'Song added, sweet pick!'
  } else if (num === 6) {
    return 'Your song was successfully added, now go vote it up the Q!'
  }
};


$(document).on("ready", function(){

  if ($('.song-list').html().trim() === '') {
    $('.search-container').css('display','none');
  }

  var regExp = /\d+/
  var playlistId = parseInt(regExp.exec(window.location.pathname)[0])


  $('.add-search-container').on('click', function(){
    $('.search-container').toggleClass('hidden');
    $('.search-container').css('z-index',3);
    $('.search-container').fadeIn(800).addClass('search-container-show');
    $('.add-search-container').addClass('hidden');
    $('.upvote').css('z-index', 1);
    $('.downvote').css('z-index', 1);
  })

  $('.back').on('click', function(){
    $('.search-container').css('display','none');
    $('.search-container').css('z-index', -1).fadeOut(800);
    $('.add-search-container').toggleClass('hidden');
    $('.upvote').css('z-index', 1);
    $('.downvote').css('z-index', 1);
  })


  // User add a song to SuggeatedSong
  $("body").delegate('.suggest_song1', 'click', function (event){
       event.preventDefault();
       console.log("this button was clicked");
       $.ajax({
          url:'/playlists/' + playlistId + '/suggestedsongs',
          method:'POST',
          data:{
           song_id: $(this).attr('song_id'),
           name: $(this).attr('song_name'),
           artist: $(this).attr('artist')
         }
       }).done(function(data){
         console.log('here comes the data');
         console.log(data);
         if (data.status === true){
           Materialize.toast(randomPhrase(), 3000, randomColor());
         }
         else if (data.status === false){
           Materialize.toast("Your song has already been Q'd up", 3000, randomColor());
         }

         $(this).addClass('suggest_song1-active');

       })
  });

  // Inital Search submit
  $("body").delegate('.search-submit','click',function(event) {
    event.preventDefault();
    var searchValue = $('#search').val();
    // console.log(searchValue);
    $.ajax({
      url: '/playlists/' + playlistId + '/suggestedsongs/',
      method: 'get',
      data: {q: searchValue},
      dataType: 'json'
    }).done(function(data){
      console.log(data);
      var albumsContainer = $('<div>').attr('id', 'search_results_albums');
      var albumsHeader = $('<div>').addClass('header').html('Albums');
      $(albumsContainer).append(albumsHeader);

      var artistsContainer = $('<div>').attr('id', 'search_results_artists');
      var artistsHeader = $('<div>').addClass('header').html('Artists');
      $(artistsContainer).append(artistsHeader);

      var tracksContainer = $('<div>').attr('id', 'search_results_tracks');
      var tracksHeader = $('<div>').addClass('header').html('Tracks');
      $(tracksContainer).append(tracksHeader);

      var albumsLength = data['albums']['data'].length;
      console.log(albumsLength);

      var artistsLength = data['artists']['data'].length;
      console.log(artistsLength);

      var allArtists = $('<div>').addClass('all-artists').css('display', 'none');
      $('body').append(allArtists);

      var allAlbums = $('<div>').addClass('all-albums').css('display', 'none');
      $('body').append(allAlbums);

      var allTracks = $('<div>').addClass('all-tracks').css('display', 'none');
      $('body').append(allTracks);



      $('#search_results').html('')

      if (data['artists']['data'].length > 0) {
        $('#search_results').append(artistsContainer);
      }
      if (data['albums']['data'].length > 0) {
        $('#search_results').append(albumsContainer);
      }
      if (data['tracks']['data'].length > 0) {
        $('#search_results').append(tracksContainer);
      }

      //displaying tracks with album cover
      for (var i = 0; i < data['tracks']['data'].length; i++){

        var icon = $('<i>').attr('class','fa fa-plus-circle').attr('aria-hidden', 'true')
        var div = $('<div>').attr('class','song-listing suggest_song1').attr('song_id', data["tracks"]['data'][i]['id']).attr('song_name', data["tracks"]['data'][i]['title']).attr('artist', data["tracks"]['data'][i]["artist"]["name"]);

        var image_container = $('<div>').addClass('track-img-container');
        var img = $('<img>').attr('src',data['tracks']['data'][i]['album']['cover_medium']).addClass('track-img');
        image_container =$(image_container).append(img).append(icon);

        $(div).append(image_container);

        var trackInfo = $('<div>').attr('class','track-info')
        var trackTitle = $('<div>').html(data["tracks"]['data'][i]["title"])
        var trackArtist = $('<div>').attr('class', 'trackArtist').html(data["tracks"]['data'][i]["artist"]["name"]);

        $(trackInfo).append(trackTitle).append(trackArtist);
        $(div).append(trackInfo);
        $('#search_results_tracks').append(div);
      }

      var contain = $('<div>').addClass('contain');

      if (albumsLength < 5) {
        var i_albumsLength = albumsLength;
      }
      else {
        var i_albumsLength = 5;
      }
      // Loop through albums
      for (var i = 0; i < i_albumsLength; i++){
        var div = $('<div>').addClass('album').attr('album_title', data["albums"]['data'][i]['title']).attr('album-id', data["albums"]['data'][i]['id']);
        var image_container = $('<div>').addClass('album-img-container');
        var img = $('<img>').attr('src',data["albums"]['data'][i]["cover_medium"]).addClass('album-img');
        image_container =$(image_container).append(img);
        var album_title = $('<div>').addClass('album-title').html(data["albums"]['data'][i]["title"]);

        $(contain).append((div).append(image_container).append(album_title));

      }
        $('#search_results_albums').append(contain);

        var contain = $('<div>').addClass('contain');
        for (var i = 0; i < data['albums']['data'].length; i++){
          var div = $('<div>').addClass('inner-album').attr('album_title', data["albums"]['data'][i]['title']).attr('album-id', data["albums"]['data'][i]['id']);
          var image_container = $('<div>').addClass('album-img-container');
          var img = $('<img>').attr('src',data["albums"]['data'][i]["cover_medium"]).addClass('album-img');
          image_container =$(image_container).append(img);
          var album_title = $('<div>').addClass('album-title').html(data["albums"]['data'][i]["title"]);

          $(contain).append((div).append(image_container).append(album_title));

        }
        $('.all-albums').html('').append(contain);


      var contain = $('<div>').addClass('contain');

      if (artistsLength < 5) {
        var i_artistsLength = artistsLength;
      }
      else {
        var i_artistsLength = 5;
      }
      // Loop through artists
      for (var i = 0; i < i_artistsLength; i++){

        var div = $('<div>').addClass('artist').attr('artist-name', data["artists"]['data'][i]['name']).attr('artist-id', data["artists"]['data'][i]['id']);
        var image_container = $('<div>').addClass('artist-img-container');
        var img = $('<img>').attr('src',data["artists"]['data'][i]["picture_medium"]).addClass('artist-img');
        image_container =$(image_container).append(img);
        var artist_title = $('<div>').addClass('artist-title').html(data["artists"]['data'][i]["name"]);

        $(contain).append((div).append(image_container).append(artist_title));

      }
        $('#search_results_artists').append(contain);

        var contain = $('<div>').addClass('contain');
        for (var i = 0; i < data['artists']['data'].length; i++){
          var div = $('<div>').addClass('inner-artist').attr('artist-name', data["artists"]['data'][i]['name']).attr('artist-id', data["artists"]['data'][i]['id']);
          var image_container = $('<div>').addClass('artist-img-container');
          var img = $('<img>').attr('src',data["artists"]['data'][i]["picture_medium"]).addClass('artist-img');
          image_container =$(image_container).append(img);
          var artist_title = $('<div>').addClass('artist-title').html(data["artists"]['data'][i]["name"]);

          $(contain).append((div).append(image_container).append(artist_title));

        }
        $('.all-artists').html('').append(contain);
    })
   })

   // Display the search results for artist
   $("body").delegate('.artist','click',function(event) {
   event.preventDefault();
   console.log("this button was clicked!");
   var artist_id = parseInt($(this).attr('artist-id'));


  $.ajax({
    url: '/playlists/' + playlistId + '/suggestedsongs/get_artist',
    method: 'get',
    data: {artist: artist_id},
    dataType: 'json'
  }).done(function(data){

   console.log(data);

   $('#search_results_tracks').html("");

   for (var i = 0; i < data["artists"]['data'].length; i++){

   var icon = $('<i>').attr('class','fa fa-plus-circle').attr('aria-hidden', 'true')
   var div = $('<div>').attr('class','song-listing suggest_song1').attr('song_id', data["artists"]['data'][i]['id']).attr('song_name', data["artists"]['data'][i]['title']).attr('artist', data["artists"]['data'][i]["artist"]["name"]);

   var image_container = $('<div>').addClass('track-img-container');
   var img = $('<img>').attr('src',data['artists']['data'][i]['album']['cover_medium']).addClass('track-img');
   image_container =$(image_container).append(img).append(icon);

   $(div).append(image_container);

   var trackInfo = $('<div>').attr('class','track-info')
   var trackTitle = $('<div>').html(data["artists"]['data'][i]["title"])
   var trackArtist = $('<div>').attr('class', 'trackArtist').html(data["artists"]['data'][i]["artist"]["name"]);

   $(trackInfo).append(trackTitle).append(trackArtist);
   $(div).append(trackInfo);
   $('#search_results_tracks').append(backButton).append(div);
   }
   })
  })


   $("body").delegate('.album','click',function(event) {
     event.preventDefault();

     var album_id = parseInt($(this).attr('album-id'));

     $.ajax({
       url: '/playlists/' + playlistId + '/suggestedsongs/get_album',
       method: 'get',
       data: {album: album_id},
       dataType: 'json'
     }).done(function(data){
       console.log(data);


       //displays tracks with album cover when clicking on album from initial search results page
       $('#search_results_tracks').html("");
       for (var i = 0; i < data['albums']['tracks']['data'].length; i++){

         var icon = $('<i>').attr('class','fa fa-plus-circle').attr('aria-hidden', 'true')
         var div = $('<div>').attr('class','song-listing suggest_song1').attr('song_id', data['albums']["tracks"]['data'][i]['id']).attr('song_name', data['albums']["tracks"]['data'][i]['title']).attr('artist', data['albums']["tracks"]['data'][i]["artist"]["name"]);

         var image_container = $('<div>').addClass('track-img-container');
         var img = $('<img>').attr('src',data['albums']['cover_medium']).addClass('track-img');
         image_container =$(image_container).append(img).append(icon);

         $(div).append(image_container);

         var trackInfo = $('<div>').attr('class','track-info')
         var trackTitle = $('<div>').html(data['albums']["tracks"]['data'][i]["title"])
         var trackArtist = $('<div>').attr('class', 'trackArtist').html(data['albums']["tracks"]['data'][i]["artist"]["name"]);

         $(trackInfo).append(trackTitle).append(trackArtist);
         $(div).append(trackInfo);
         $('#search_results_tracks').append(div);
       }

     })
   })

   var backButton = $('<button>').addClass('back-button').html('Back');

   $("body").delegate('.inner-album','click',function(event) {
     event.preventDefault();

     var album_id = parseInt($(this).attr('album-id'));

     $.ajax({
       url: '/playlists/' + playlistId + '/suggestedsongs/get_album',
       method: 'get',
       data: {album: album_id},
       dataType: 'json'
     }).done(function(data){
       console.log(data);
      $('#search_results').html("");


      //displays tracks with album cover when searching for a specific album
      for (var i = 0; i < data['albums']["tracks"]['data'].length; i++){

        var icon = $('<i>').attr('class','fa fa-plus-circle').attr('aria-hidden', 'true')
        var div = $('<div>').attr('class','song-listing suggest_song1').attr('song_id', data["albums"]["tracks"]['data'][i]['id']).attr('song_name', data["albums"]["tracks"]['data'][i]['title']).attr('artist', data["albums"]["tracks"]['data'][i]["artist"]["name"]);

        var image_container = $('<div>').addClass('track-img-container');
        var img = $('<img>').attr('src',data['albums']['cover_medium']).addClass('track-img');
        image_container =$(image_container).append(img).append(icon);

        $(div).append(image_container);

        var trackInfo = $('<div>').attr('class','track-info')
        var trackTitle = $('<div>').html(data["albums"]["tracks"]['data'][i]["title"])
        var trackArtist = $('<div>').attr('class', 'trackArtist').html(data["albums"]["tracks"]['data'][i]["artist"]["name"]);

        $(trackInfo).append(trackTitle).append(trackArtist);
        $(div).append(trackInfo);
        $('#search_results').append(backButton).append(div);
      }
     })
   })

   $("body").delegate('.header', 'click', function(){
     if ($(this).html().trim() === 'Albums'){
      $('#search_results').html($('.all-albums').html()).append(backButton);
     }
     else if ($(this).html().trim() === 'Artists'){
      $('#search_results').html($('.all-artists').html()).append(backButton);
     }
   })

   $("body").delegate('.inner-artist','click',function(event) {
     event.preventDefault();

     console.log("this button was clicked!");
     var artist_id = parseInt($(this).attr('artist-id'));

     console.log(artist_id);

     $.ajax({
       url: '/playlists/' + playlistId + '/suggestedsongs/get_artist',
       method: 'get',
       data: {artist: artist_id},
       dataType: 'json'
     }).done(function(data){

       console.log(data);


       //displaying tracks for one album
       $('#search_results').html("");
       for (var i = 0; i < data['artists']['data'].length; i++){

         var icon = $('<i>').attr('class','fa fa-plus-circle').attr('aria-hidden', 'true')
         var div = $('<div>').attr('class','song-listing suggest_song1').attr('song_id', data["artists"]['data'][i]['id']).attr('song_name', data["artists"]['data'][i]['title']).attr('artist', data["artists"]['data'][i]["artist"]["name"]);

         var image_container = $('<div>').addClass('track-img-container');
         var img = $('<img>').attr('src',data['artists']['data'][i]['album']['cover_medium']).addClass('track-img');
         image_container =$(image_container).append(img).append(icon);

         $(div).append(image_container);

         var trackInfo = $('<div>').attr('class','track-info')
         var trackTitle = $('<div>').html(data["artists"]['data'][i]["title"])
         var trackArtist = $('<div>').attr('class', 'trackArtist').html(data["artists"]['data'][i]["artist"]["name"]);

         $(trackInfo).append(trackTitle).append(trackArtist);
         $(div).append(trackInfo);
         $('#search_results').append(backButton).append(div);
       }

     })
   })



   $("body").delegate('.back-button','click',function(event) {
     event.preventDefault();
     var searchValue = $('#search').val();
     // console.log(searchValue);
     $.ajax({
       url: '/playlists/' + playlistId + '/suggestedsongs/',
       method: 'get',
       data: {q: searchValue},
       dataType: 'json'
     }).done(function(data){
       console.log(data);


       var albumsContainer = $('<div>').attr('id', 'search_results_albums');
       var albumsHeader = $('<div>').addClass('header').html('Albums');
       $(albumsContainer).append(albumsHeader);

       var artistsContainer = $('<div>').attr('id', 'search_results_artists');
       var artistsHeader = $('<div>').addClass('header').html('Artists');
       $(artistsContainer).append(artistsHeader);


       var tracksContainer = $('<div>').attr('id', 'search_results_tracks');
       var tracksHeader = $('<div>').addClass('header').html('Tracks');
       $(tracksContainer).append(tracksHeader);

       var albumsLength = data['albums']['data'].length;
       console.log(albumsLength);

       var artistsLength = data['artists']['data'].length;
       console.log(artistsLength);


       $('#search_results').html('').append(artistsContainer).append(albumsContainer).append(tracksContainer);

       //tracks displayed with album cover when back button clicked
       for (var i = 0; i < data['tracks']['data'].length; i++){

         var icon = $('<i>').attr('class','fa fa-plus-circle').attr('aria-hidden', 'true')
         var div = $('<div>').attr('class','song-listing suggest_song1').attr('song_id', data["tracks"]['data'][i]['id']).attr('song_name', data["tracks"]['data'][i]['title']).attr('artist', data["tracks"]['data'][i]["artist"]["name"]);

         var image_container = $('<div>').addClass('track-img-container');
         var img = $('<img>').attr('src',data['tracks']['data'][i]['album']['cover_medium']).addClass('track-img');
         image_container =$(image_container).append(img).append(icon);

         $(div).append(image_container);

         var trackInfo = $('<div>').attr('class','track-info')
         var trackTitle = $('<div>').html(data["tracks"]['data'][i]["title"])
         var trackArtist = $('<div>').attr('class', 'trackArtist').html(data["tracks"]['data'][i]["artist"]["name"]);

         $(trackInfo).append(trackTitle).append(trackArtist);
         $(div).append(trackInfo);
         $('#search_results_tracks').append(div);
       }

       if (albumsLength < 5) {
         var i_albumsLength = albumsLength;
       }
       else {
         var i_albumsLength = 5;
       }
       var contain = $('<div>').addClass('contain');
       for (var i = 0; i < i_albumsLength; i++){
         var div = $('<div>').addClass('album').attr('album_title', data["albums"]['data'][i]['title']).attr('album-id', data["albums"]['data'][i]['id']);
         var image_container = $('<div>').addClass('album-img-container');
         var img = $('<img>').attr('src',data["albums"]['data'][i]["cover_medium"]).addClass('album-img');
         image_container =$(image_container).append(img);
         var album_title = $('<div>').addClass('album-title').html(data["albums"]['data'][i]["title"]);

         $(contain).append((div).append(image_container).append(album_title));

       }
         $('#search_results_albums').append(contain);

       if (artistsLength < 5) {
         var i_artistsLength = artistsLength;
       }
       else {
         var i_artistsLength = 5;
       }
       var contain = $('<div>').addClass('contain');
       for (var i = 0; i < i_artistsLength; i++){

         var div = $('<div>').addClass('artist').attr('artist-name', data["artists"]['data'][i]['name']).attr('artist-id', data["artists"]['data'][i]['id']);
         var image_container = $('<div>').addClass('artist-img-container');
         var img = $('<img>').attr('src',data["artists"]['data'][i]["picture_medium"]).addClass('artist-img');
         image_container =$(image_container).append(img);
         var artist_title = $('<div>').addClass('artist-title').html(data["artists"]['data'][i]["name"]);

         $(contain).append((div).append(image_container).append(artist_title));

       }
         $('#search_results_artists').append(contain);

     })
    })


  $('#make-public').on('click', function(){
    var status = $('#make-public').html().trim();
    console.log('clicked');
    $.ajax({
      url: '/playlists/' + playlistId + '/update_publicity',
      method: 'post'
    })
  });

  $("body").delegate('.upvote','click', function() {
    var playlist_id = $(this).parents('.song-in-queue').data('playlist-id');
    var suggestedsong_id = $(this).parents('.song-in-queue').data('suggested-song-id');
    var replacement = $(this).parents('.contain').children('.heart').children('.netvote');

    setTimeout(function(){
      $.ajax({
        url:"/playlists/" + playlist_id + "/suggestedsongs/" + suggestedsong_id + "/votes",
        method: 'POST',
        data: {
          status: 'up',
        }
      });
    }, 350);

  });

  $("body").delegate('.downvote','click', function() {
    var playlist_id = $(this).parents('.song-in-queue').data('playlist-id');
    var suggestedsong_id = $(this).parents('.song-in-queue').data('suggested-song-id');
    var replacement = $(this).parents('.contain').children('.heart').children('.netvote')
    setTimeout(function(){
      $.ajax({
        url:"/playlists/" + playlist_id + "/suggestedsongs/" + suggestedsong_id + "/votes",
        method: 'POST',
        data: {
          status: 'down'
        }
      });
    }, 350);
  });
 });
