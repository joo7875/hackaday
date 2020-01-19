// Slider #1
      var carousel = document.querySelector('.carousel');
      var carouselContent = document.querySelector('.carousel-content');
      var slides = document.querySelectorAll('.slide');
      var arrayOfSlides = Array.prototype.slice.call(slides);
      var carouselDisplaying;
      var screenSize;
      setScreenSize();
      var lengthOfSlide;

      function addClone() {
         var lastSlide = carouselContent.lastElementChild.cloneNode(true);
         lastSlide.style.left = (-lengthOfSlide) + "px";
         carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
      }
      // addClone();

      function removeClone() {
        var firstSlide = carouselContent.firstElementChild;
        firstSlide.parentNode.removeChild(firstSlide);
      }

      function moveSlidesRight() {
        var slides = document.querySelectorAll('.slide');
        var slidesArray = Array.prototype.slice.call(slides);
        var width = 0;

        slidesArray.forEach(function(el, i){
          el.style.left = width + "px";
          width += lengthOfSlide;
        });
        addClone();
      }

      moveSlidesRight();

      function moveSlidesLeft() {
        var slides = document.querySelectorAll('.slide');
        var slidesArray = Array.prototype.slice.call(slides);
        slidesArray = slidesArray.reverse();
        var maxWidth = (slidesArray.length - 1) * lengthOfSlide;

        slidesArray.forEach(function(el, i){
          maxWidth -= lengthOfSlide;
          el.style.left = maxWidth + "px";
        });
      }

      // window.addEventListener('resize', setScreenSize);

      function setScreenSize() {
        if ( window.innerWidth >= 300 ) {
          carouselDisplaying = 3;
        } else if ( window.innerWidth >= 100 ) {
          carouselDisplaying = 2;
        } else {
          carouselDisplaying = 1;
        }
        getScreenSize();
      }

      function getScreenSize() {
        var slides = document.querySelectorAll('.slide');
        var slidesArray = Array.prototype.slice.call(slides);
        lengthOfSlide = ( carousel.offsetWidth  / carouselDisplaying );
        var initialWidth = -lengthOfSlide;
        slidesArray.forEach(function(el) {
          el.style.width = lengthOfSlide + "px";
          el.style.left = initialWidth + "px";
          initialWidth += lengthOfSlide;
        });
      }

      var rightNav = document.querySelector('.nav-right');
      rightNav.addEventListener('click', moveLeft);

      var moving = true;

      function moveRight() {
        if ( moving ) {
          moving = false;
          var lastSlide = carouselContent.lastElementChild;
          lastSlide.parentNode.removeChild(lastSlide);
          carouselContent.insertBefore(lastSlide, carouselContent.firstChild);
          removeClone();
          var firstSlide = carouselContent.firstElementChild;
          firstSlide.addEventListener('transitionend', activateAgain);
          moveSlidesRight();
        }
      }

      function activateAgain() {
        var firstSlide = carouselContent.firstElementChild;
        moving = true;
        firstSlide.removeEventListener('transitionend', activateAgain);
      }

      var leftNav = document.querySelector('.nav-left');
      leftNav.addEventListener('click', moveRight);

      // var moveLeftAgain = true;

      function moveLeft() {
        if ( moving ) {
          moving = false;
          removeClone();
          var firstSlide = carouselContent.firstElementChild;
          firstSlide.addEventListener('transitionend', replaceToEnd);
          moveSlidesLeft();
        }
      }

      function replaceToEnd() {
        var firstSlide = carouselContent.firstElementChild;
        firstSlide.parentNode.removeChild(firstSlide);
        carouselContent.appendChild(firstSlide);
        firstSlide.style.left = ( (arrayOfSlides.length -1) * lengthOfSlide) + "px";
        addClone();
        moving = true;
        firstSlide.removeEventListener('transitionend', replaceToEnd);
      }

// ************************************************************* Slider #2

    var carousel1 = document.querySelector('.carousel1');
    var carouselContent1 = document.querySelector('.carousel-content1');
    var slides1 = document.querySelectorAll('.slide1');
    var arrayOfSlides1 = Array.prototype.slice.call(slides1);
    var carouselDisplaying1;
    var screenSize1;
    setScreenSize1();
    var lengthOfSlide1;

    function addClone1() {
       var lastSlide = carouselContent1.lastElementChild.cloneNode(true);
       lastSlide.style.left = (-lengthOfSlide1) + "px";
       carouselContent1.insertBefore(lastSlide, carouselContent1.firstChild);
    }

    function removeClone1() {
      var firstSlide = carouselContent1.firstElementChild;
      firstSlide.parentNode.removeChild(firstSlide);
    }

    function moveSlidesRight1() {
      var slides1 = document.querySelectorAll('.slide1');
      var slidesArray = Array.prototype.slice.call(slides1);
      var width = 0;

      slidesArray.forEach(function(el, i){
        el.style.left = width + "px";
        width += lengthOfSlide1;
      });
      addClone1();
    }

    moveSlidesRight1();

    function moveSlidesLeft1() {
      var slides1 = document.querySelectorAll('.slide1');
      var slidesArray = Array.prototype.slice.call(slides1);
      slidesArray = slidesArray.reverse();
      var maxWidth = (slidesArray.length - 1) * lengthOfSlide1;

      slidesArray.forEach(function(el, i){
        maxWidth -= lengthOfSlide1;
        el.style.left = maxWidth + "px";
      });
    }


    function setScreenSize1() {
      if ( window.innerWidth >= 500 ) {
        carouselDisplaying1 = 3;
      } else if ( window.innerWidth >= 300 ) {
        carouselDisplaying1 = 2;
      } else {
        carouselDisplaying1 = 1;
      }
      getScreenSize1();
    }

    function getScreenSize1() {
      var slides1 = document.querySelectorAll('.slide1');
      var slidesArray = Array.prototype.slice.call(slides1);
      lengthOfSlide1 = ( carousel1.offsetWidth  / carouselDisplaying1 );
      var initialWidth = -lengthOfSlide1;
      slidesArray.forEach(function(el) {
        el.style.width = lengthOfSlide1 + "px";
        el.style.left = initialWidth + "px";
        initialWidth += lengthOfSlide1;
      });
    }

    var rightNav1 = document.querySelector('.nav-right1');
    rightNav1.addEventListener('click', moveLeft1);

    var moving1 = true;

    function moveRight1() {
      if ( moving1 ) {
        moving1 = false;
        var lastSlide = carouselContent1.lastElementChild;
        lastSlide.parentNode.removeChild(lastSlide);
        carouselContent1.insertBefore(lastSlide, carouselContent1.firstChild);
        removeClone1();
        var firstSlide = carouselContent1.firstElementChild;
        firstSlide.addEventListener('transitionend', activateAgain1);
        moveSlidesRight1();
      }
    }

    function activateAgain1() {
      var firstSlide = carouselContent1.firstElementChild;
      moving1 = true;
      firstSlide.removeEventListener('transitionend', activateAgain1);
    }

    var leftNav1 = document.querySelector('.nav-left1');
    leftNav1.addEventListener('click', moveRight1);

    // var moveLeftAgain = true;

    function moveLeft1() {
      if ( moving1 ) {
        moving1 = false;
        removeClone1();
        var firstSlide = carouselContent1.firstElementChild;
        firstSlide.addEventListener('transitionend', replaceToEnd1);
        moveSlidesLeft1();
      }
    }

    function replaceToEnd1() {
      var firstSlide = carouselContent1.firstElementChild;
      firstSlide.parentNode.removeChild(firstSlide);
      carouselContent1.appendChild(firstSlide);
      firstSlide.style.left = ( (arrayOfSlides1.length -1) * lengthOfSlide1) + "px";
      addClone1();
      moving1 = true;
      firstSlide.removeEventListener('transitionend', replaceToEnd1);
    }


// ************************************************************* IMAGE SLIDER

var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("demo");
  var captionText = document.getElementById("caption");
  
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
  captionText.innerHTML = dots[slideIndex-1].alt;
}