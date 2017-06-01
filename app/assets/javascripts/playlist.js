$(document).on("ready", function(){

var regExp = /\d+/;
var playlistId = parseInt(regExp.exec(window.location.pathname)[0]);

  $(window).scroll( function(){
      /* Check the location of each desired element */
      $('.hideme').each( function(i){
          var bottom_of_object = $(this).offset().top + $(this).outerHeight();
          var bottom_of_window = $(window).scrollTop() + $(window).height();
          /* If the object is completely visible in the window, fade it it */
          if( bottom_of_window > bottom_of_object ){
              $(this).animate({'opacity':'1'},500);
          }
      });
  });

  $('.song-in-queue')
    .on('mouseenter', function(){ $(this).addClass('blue-grey darken-4') })
    .on('mouseleave', function() { $(this).removeClass('blue-grey darken-4') });

  $("body").delegate('.upvote', 'click', function (event){

    var currentVote = parseInt($(this).parents('.buttons').siblings('.heart').children(".netvote").html());
    console.log(currentVote);
    console.log($(this).siblings('.downvote').hasClass('darken-2'));

    if ($(this).hasClass("darken-2")) {
      Materialize.toast("Vote withdrawn!", 3000);
      var netVote = currentVote - 1;
      $(this).parents('.buttons').siblings('.heart').children(".netvote").html(netVote);
      $(this).addClass("btn lighten-2");
      $(this).removeClass("darken-2 btn-flat")

    } else {

      if ($(this).siblings('.downvote').hasClass('darken-2')) {
        var netVote = currentVote + 2;
        $(this).siblings('.downvote').removeClass('darken-2 btn-flat');
      } else {
        var netVote = currentVote + 1;
      }

      $(this).parents('.buttons').siblings('.heart').children(".netvote").html(netVote);
      Materialize.toast("Voted Up!", 3000, 'blue');

      $(this).addClass("darken-2 btn-flat")
      // $(this).removeClass("lighten-2 btn")
      // $(this).siblings('button').removeClass('clicked btn-flat darken-2').addClass('red lighten-2 btn')
    };
  });
  $("body").delegate('.downvote', 'click', function (event){

    var currentVote = parseInt($(this).parents('.buttons').siblings('.heart').children(".netvote").html());
    console.log(currentVote);

    if ($(this).hasClass("darken-2"))  {
      Materialize.toast("Vote Withdrawn!", 3000);
      var netVote = currentVote + 1;
      $(this).parents('.buttons').siblings('.heart').children(".netvote").html(netVote);
      $(this).addClass("btn lighten-2");
      $(this).removeClass("darken-2 btn-flat")

    } else {

      if ($(this).siblings('.upvote').hasClass('darken-2')) {
        var netVote = currentVote - 2;
        $(this).siblings('.upvote').removeClass('darken-2 btn-flat');
      } else {
        var netVote = currentVote - 1;
      }

      Materialize.toast("Voted Down!", 3000, 'red');
      $(this).parents('.buttons').siblings('.heart').children(".netvote").html(netVote);
      $(this).addClass("darken-2 btn-flat")
      // $(this).removeClass("lighten-2 btn")
      // $(this).siblings('button').removeClass('clicked btn-flat darken-2').addClass('blue lighten-2 btn')
    };
  });

  $("body").delegate('.delete-song', 'click', function(event){
    console.log('clicked')
    $.ajax({
       url:'/playlists/' + playlistId + '/suggestedsongs/' + $(this).parent().attr('data-suggested-song-id'),
       method:'DELETE'
    }).done(function(data){
        Materialize.toast("Song deleted!", 3000, 'red');
    })
  });

  $("body").delegate('.delete-song-show', 'click', function(event){
    console.log('clicked')
    $.ajax({
       url:'/playlists/' + playlistId + '/suggestedsongs/' + $(this).parent().parent().attr('data-suggested-song-id'),
       method:'DELETE'
    }).done(function(data){
        Materialize.toast("Song deleted!", 3000, 'red');
    })
  });

});
