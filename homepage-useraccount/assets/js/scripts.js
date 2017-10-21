$( document ).ready(function(){
  $(".button-collapse").sideNav();
  $('ul.tabs').tabs();
  
})


$('.owl-carousel').owlCarousel({
    loop:true,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:1
        },
        1000:{
            items:1
        }
    }
})