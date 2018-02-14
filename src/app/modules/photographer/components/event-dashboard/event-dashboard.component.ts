import { Component, OnInit } from '@angular/core';
import { Swiper, Navigation, Pagination, Scrollbar } from 'swiper/dist/js/swiper.esm.js';
@Component({
  selector: 'app-event-dashboard',
  templateUrl: './event-dashboard.component.html',
  styleUrls: ['./event-dashboard.component.css']
})
export class EventDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.loadGallery(true, 'a.thumbnail');
    $('.count').each(function () {
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

    $(".img-check").click(function(){
      $(this).toggleClass("check");
    });

    (<any>$('#datepicker')).datepicker({
      uiLibrary: 'bootstrap'
    });

    (<any>$('[data-toggle="tooltip"]')).tooltip();

    const swiper = new Swiper('.swiper-container', {
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
    });

    $("#doneEdit").hide();
    $("#editEvent").click(function(){
      $(this).hide();
      $(".toggler").show();
      $(".togglerFace").hide();
      $("#doneEdit").show();
      $("#deleteTrash").show();
    });
    $("#doneEdit").click(function(){
      $(this).hide();
      $(".toggler").hide();
      $(".togglerFace").show();
      $("#editEvent").show();
      $("#deleteTrash").hide();
    });
    $('.thumb').height($('.thumb').width());
  }

  // This function disables buttons when needed
  disableButtons(counter_max, counter_current){
    $('#show-previous-image, #show-next-image').show();
    if (counter_max === counter_current){
      $('#show-next-image').hide();
    } else if (counter_current === 1) {
      $('#show-previous-image').hide();
    }
  }

  loadGallery(setIDs, setClickAttr) {
    const thisComponent = this;
    let current_image,
      selector,
      counter = 0;

    $('#show-next-image, #show-previous-image').click(function(){
      if($(this).attr('id') === 'show-previous-image'){
        current_image--;
      } else {
        current_image++;
      }

      selector = $('[data-image-id="' + current_image + '"]');
      thisComponent.updateGallery(selector, counter);
    });

    if (setIDs == true) {
      $('[data-image-id]').each(function(){
        counter++;
        $(this).attr('data-image-id', counter);
      });
    }
    $(setClickAttr).on('click',function() {
      thisComponent.updateGallery($(this), counter);
    });
  }

  updateGallery(selector, counter) {
    const $sel = selector;
    const current_image = $sel.data('image-id');
    $('#image-gallery-caption').text($sel.data('caption'));
    $('#image-gallery-title').text($sel.data('title'));
    $('#image-gallery-image').attr('src', $sel.data('image'));
    this.disableButtons(counter, $sel.data('image-id'));
  }

}
