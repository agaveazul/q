$('document').ready(function(){

  App.app = App.cable.subscriptions.create('AppChannel', {

    connected: function(){
      console.log("connected");
    },

    disconnected: function(){
      console.log("disconnected");
    },

    received: function(data) {
      
      var regExp = /\d+/;
      var playlist_id = parseInt(regExp.exec(window.location.pathname)[0]);

      if (data[0].playlist_id === playlist_id) {

        if (data[1].public === true && data.length === 2) {
          console.log('This is going public');
          console.log(data);
          $('.upvote').css('display','hidden');
          $('.downvote').css('display','hidden');
          $('.add-search-container').css('display','hidden');
        }
        else if (data[1].public === false && data.length === 2) {
          console.log('This is going private');
          console.log(data);
          $('.upvote').css('display','inherit');
          $('.downvote').css('display','inherit');
          $('.add-search-container').css('display','inherit');
        }

        if (data.length === 1) {
          var nextSong = data[0].song_id;
          var nextRecord = data[0].id;
          setTimeout(function(){DZ.player.playTracks([nextSong])}, 3000);
          setTimeout(function(){DZ.Event.subscribe('track_end', function(){
            console.log("Track has ended");
            $.ajax({
              url: '/playlists/' + playlist_id + '/update_song?song_id=' + nextRecord,
              method: 'get',
            }).done(function(data){
              nextRecord = data['song_record'];
              nextSong = data['song_id'];
              DZ.player.playTracks([nextSong]);
              })
            })}
          , 3000)
          }

        //   var unplayedSongs = []
        //   var playedSongs = []
        //   data.forEach(function(data){
        //     if (data.played === false) {
        //       unplayedSongs.push(data)
        //     }
        //     else {
        //       playedSongs.push(data)
        //     }
        //   })
        //
        // if (playedSongs.length != data.length) {
        //   nextSong = unplayedSongs[0];
        //   console.log(nextSong);
        //   DZ.player.playTracks([nextSong.song_id])
        // }

        $('.song-list').html('');
        data.forEach(function(data) {
          console.log("test");

          if (data.played) {
            var divContainer = $('<div>').attr('class', 'song-in-queue played').attr('data-playlist-id', playlist_id).attr('data-suggested-song-id', data.id);
          }
          else {
            var divContainer = $('<div>').attr('class', 'song-in-queue').attr('data-playlist-id', playlist_id).attr('data-suggested-song-id', data.id).attr('data-deezer-id',data.song_id);
            var span = $('<span>').attr('class',"buttons")
            var buttonUp = $('<button>').attr('type',"button").attr('name','button').attr('class','upvote btn waves-effect waves-light blue lighten-2')
            var iconUp = $('<i>').attr('class','material-icons').html('thumb_up')
            var upButton = $(buttonUp).append(iconUp)
            var buttonDown = $('<button>').attr('type',"button").attr('name','button').attr('class','downvote btn waves-effect waves-light red lighten-2')
            var iconDown = $('<i>').attr('class','material-icons').html('thumb_down')
            var downButton = $(buttonDown).append(iconDown)
          }
        var spanHeart = $('<span>').attr('class','heart')
        var iconHeart = $('<i>').attr('class','fa fa-heart').attr('style','font-size:12px')
        var netVote = $('<span>').attr('class','netvote').attr('id',data.id).html(data.net_vote)

        var heart = $(spanHeart).append(netVote).append(" ").append(iconHeart)
        var votes = $(span).append(upButton).append(" ").append(downButton)
        var div_replace = $(divContainer).html(data.name + ' - ' + data.artist + ' | Added By: ' + data.user_name)

        $(div_replace).append(votes).append(heart)
        $('.song-list').append(div_replace);
        })

      }
    }
    })
  }
)
