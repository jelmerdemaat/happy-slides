class HappySlides {
  constructor(el) {

    this.slidesContainer = this.query("[data-slider-slides]");
    this.slides = this.queryAll("[data-slider-slide]");
    this.prevBtn = this.query("[data-slider-prev]");
    this.nextBtn = this.query("[data-slider-next]");
    this.counterCurrent = this.query("[data-slider-current]");
    this.counterTotal = this.query("[data-slider-total]");

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
    this.update = this.update.bind(this);
    this.goLeft = this.goLeft.bind(this);
    this.goRight = this.goRight.bind(this);

    this.el.addEventListener("touchstart", this.handleTouchStart, false);
    this.el.addEventListener("touchmove", this.handleTouchMove, false);
    this.el.addEventListener("touchend", this.handleTouchEnd, false);
    this.el.addEventListener("touchcancel", this.handleTouchEnd, false);
    this.el.addEventListener("transitionend", this.handleTransitionEnd, false);

    this.prevBtn.addEventListener(
      "click",
      this.handleClick.bind(this, "prev"),
      false
    );
    this.nextBtn.addEventListener(
      "click",
      this.handleClick.bind(this, "next"),
      false
    );

    this.transitionProperty = "transform";
    this.slidesBCR = this.slidesContainer.getBoundingClientRect();

    this.threshold = 0.3;
    this.startX = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.prevX = 0;
    this.prevY = 0;
    this.rootX = 0;
    this.current = 0;

    this.dragging = false;
    this.animating = false;

    this.counterTotal.textContent = this.slides.length;

    this.checkFirstOrLast();
  }

  recalculate() {
    this.slidesBCR = this.slidesContainer.getBoundingClientRect();
  }

  applyTransitionSafely(distance) {
    this.slidesContainer.style.transitionProperty = this.transitionProperty;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.slidesContainer.style.webkitTransform = `translateX(${distance}px)`;
        this.slidesContainer.style.transform = `translateX(${distance}px)`;
      });
    });
  }

  slide() {
    this.animating = true;

    this.rootX = this.slides[this.current].offsetLeft * -1;

    this.applyTransitionSafely(this.rootX);

    // Add classes to style active slide in CSS
    this.slides.forEach(slide =>
      slide.classList.remove("Slider__Slide--active")
    );
    this.slides[this.current].classList.add("Slider__Slide--active");

    this.updateCounter();
    this.checkFirstOrLast();
  }

  checkFirstOrLast() {
    // Add classes to slider to style based on first or last item active
    if (this.current === this.slides.length - 1) {
      this.el.classList.add("Slider--last-active");
      this.nextBtn.setAttribute("tabindex", -1);
    } else {
      this.el.classList.remove("Slider--last-active");
      this.nextBtn.setAttribute("tabindex", 0);
    }

    if (this.current === 0) {
      this.el.classList.add("Slider--first-active");
      this.prevBtn.setAttribute("tabindex", -1);
    } else {
      this.el.classList.remove("Slider--first-active");
      this.prevBtn.setAttribute("tabindex", 0);
    }
  }

  updateCounter() {
    this.counterCurrent.textContent = this.current + 1;
  }

  goLeft() {
    if (this.current === 0) {
      return;
    }

    this.current -= 1;

    this.slide();
  }

  goRight() {
    if (this.current === this.slides.length - 1) {
      return;
    }

    this.current += 1;

    this.slide();
  }

  handleClick(direction, evt) {
    evt.preventDefault();

    this.recalculate();

    if (direction === "prev") {
      this.goLeft();
    } else if (direction === "next") {
      this.goRight();
    }
  }

  handleTouchStart(evt) {
    if (!evt.target || !evt.cancelable) {
      return;
    }

    this.recalculate();

    this.startX = evt.pageX || evt.touches[0].pageX;
    this.currentX = this.startX;
    this.dragging = true;
    this.animating = false;
  }

  handleTouchEnd(evt) {
    if (!evt.target || !evt.cancelable) {
      return;
    }

    this.targetX = 0;
    this.dragging = false;

    if (
      this.currentX - this.startX > this.slidesBCR.width * this.threshold &&
      this.current !== 0
    ) {
      // Successfully wiped to the right, so the slides go left
      this.goLeft();
    } else if (
      this.startX - this.currentX > this.slidesBCR.width * this.threshold &&
      this.current !== this.slides.length - 1
    ) {
      // Successfully wiped to the left, so the slides go right
      this.goRight();
    } else {
      this.update();
    }
  }

  handleTouchMove(evt) {
    if (!evt.target || !evt.cancelable || this.animating) {
      return;
    }

    evt.preventDefault();

    this.currentX = evt.pageX || evt.touches[0].pageX;

    this.update();
  }

  handleTransitionEnd(evt) {
    if (evt.target !== this.slidesContainer) {
      return;
    }

    this.slidesContainer.style.webkitTransform = `translateX(${this.rootX}px)`;
    this.slidesContainer.style.transform = `translateX(${this.rootX}px)`;
    this.slidesContainer.style.transitionProperty = "none";

    this.animating = false;
  }

  update() {
    if (this.dragging) {
      // Move slider to be under mouse touch
      requestAnimationFrame(() => {
        this.slidesContainer.style.webkitTransform = `translateX(${this
          .currentX -
          this.startX +
          this.rootX}px)`;
        this.slidesContainer.style.transform = `translateX(${this.currentX -
          this.startX +
          this.rootX}px)`;
      });
    } else {
      // Animate slider back to the start
      this.animating = true;

      this.applyTransitionSafely(this.rootX);
    }
  }
}

export default HappySlides;
