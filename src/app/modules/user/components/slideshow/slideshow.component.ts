import {AfterViewInit, Component, OnInit} from '@angular/core';
 import { WOW } from 'wowjs/dist/wow.min';
import {delay} from 'q';
@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements  AfterViewInit  {

  constructor() { }

  ngAfterViewInit() {

    (<any>$('.count')).each(function () {
      $(this).prop('Counter',0).animate({
        Counter: $(this).text()
      }, {
        duration: 4000,
        easing: 'swing',
        step: function (now) {
          $(this).text(Math.ceil(now));
        }
      });
    });

    (<any>$('#changeBg')).easybg({
      images: [ // an array of background dimages
        'assets/images/bg2.jpg',
        'assets/images/bg.jpg',
        'assets/images/bg3.jpg'
      ],
      interval: 10000,
      speed : 1000, // 1 minute
      ignoreError : false,
      changeMode : 'normal', // normal or random
      initIndex : 0,
      cloneClassId : null,
      cloneClassName : 'easybgClone',
      debug : false
    });

    (<any>$(".img-check")).click(function(){
      $(this).toggleClass("check");
    });

    (<any>$('#datepicker')).datepicker({
      uiLibrary: 'bootstrap'
    });
   // (<any>$('[data-toggle="tooltip"]')).tooltip()

    (<any>$(document)).ready(function(){
   /*   let swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflow: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows : true
        }
      });*/

    });

    delay(2000).then(()=>{
      console.log("Before Init");
      /*new WOW({
        live: false
      }).init();
*/
      let wow = new WOW()(
        {
          animateClass: 'animated',
          offset:       100,
          live: false,
          callback:     function(box) {
            console.log("WOW: animating <" + box.tagName.toLowerCase() + ">");
          }
        }
      );
     wow.init();


      console.log("After Init");
    });
    (<any>$('#moar')).on("click", function() {
      var section = document.createElement('section');
      section.className = 'section--purple wow fadeInDown';
      this.parentNode.insertBefore(section, this);
    });

    // Hide the div
    (<any>$("#adToggle")).hide();
    // $('#video1').get(0).pause();

    // Show the div in 5s
    (<any>$("#adToggle")).delay(20000).fadeIn(500);


    (<any>$("#adToggle")).delay(20000).fadeOut(500);

    let ONLYONETIME_EXECUTE = null;
    window.addEventListener('load', function(){ // on page load

      document.body.addEventListener('touchstart', function(e){

        if (ONLYONETIME_EXECUTE == null) {

          //video.play();

          //if you want to prepare more than one video/audios use this trick :
        //  video2.play();
        //  video2.pause();
          // now video2 is buffering and you can play it programmability later

          ONLYONETIME_EXECUTE = 0;
        }

      }, false);

    }, false);
  }

}
