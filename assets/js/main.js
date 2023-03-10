
(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 500
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header')
    let offset = header.offsetHeight

    let elementPos = select(el).offsetTop
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    })
  }

  /**
   * 상단바 스크롤시 위로 올라가기
   */
  let selectHeader = select('#header')
  let selectTopbar = select('#topbar')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.add('topbar-scrolled')
        }
      } else {
        selectHeader.classList.remove('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.remove('topbar-scrolled')
        }
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * 탑버튼 스크롤시 나타남
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 2000) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function (e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('bi-list')
    this.classList.toggle('bi-x')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function (e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on('click', '.scrollto', function (e) {
    if (select(this.hash)) {
      e.preventDefault()

      let navbar = select('#navbar')
      if (navbar.classList.contains('navbar-mobile')) {
        navbar.classList.remove('navbar-mobile')
        let navbarToggle = select('.mobile-nav-toggle')
        navbarToggle.classList.toggle('bi-list')
        navbarToggle.classList.toggle('bi-x')
      }
      scrollto(this.hash)
    }
  }, true)

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash)
      }
    }
  });

  /**
   * Preloader */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * 스킬섹션 필터 기능 */
  window.addEventListener('load', () => {
    let skillContainer = select('.skill-container');
    if (skillContainer) {
      let skillIsotope = new Isotope(skillContainer, {
        itemSelector: '.skill-item',
        layoutMode: 'fitRows'
      });

      let skillFilters = select('#skill-flters li', true);

      on('click', '#skill-flters li', function (e) {
        e.preventDefault();
        skillFilters.forEach(function (el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        skillIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        skillIsotope.on('arrangeComplete', function () {
          AOS.refresh()
        });
      }, true);
    }

  });

  /**
   * Initiate glightbox 
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * 포트폴리오 스와이퍼
   */
  var portfolio = new Swiper('.portfolio-slider', {
    speed: 1000,
    loop: true,
    // autoplay: {
    //   delay: 8000,
    //   disableOnInteraction: false
    // },
    navigation: {
      nextEl: "#portfolio .swiper-button-next",
      prevEl: "#portfolio .swiper-button-prev",
    },
    pagination: {
      el: '.portfolio .swiper-pagination',
      type: 'bullets',
      clickable: true
    },
    paginationClickable: true,
    autoplayDisableOnInteraction: true,
  });
  portfolio.init();

  const cursor = document.querySelector('#cursor');
  const cursorCircle = cursor.querySelector('.cursor-circle');
  
  const mouse = { x: -100, y: -100 }; // mouse pointer's coordinates
  const pos = { x: 0, y: 0 }; // cursor's coordinates
  const speed = 0.3; // between 0 and 1
  
  const updateCoordinates = e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }
  
  window.addEventListener('mousemove', updateCoordinates);
  
  
  function getAngle(diffX, diffY) {
    return Math.atan2(diffY, diffX) * 180 / Math.PI;
  }
  
  function getSqueeze(diffX, diffY) {
    const distance = Math.sqrt(
      Math.pow(diffX, 2) + Math.pow(diffY, 2)
    );
    const maxSqueeze = 0.15;
    const accelerator = 1500;
    return Math.min(distance / accelerator, maxSqueeze);
  }
  
  
  const updateCursor = () => {
    const diffX = Math.round(mouse.x - pos.x);
    const diffY = Math.round(mouse.y - pos.y);
  
    pos.x += diffX * speed;
    pos.y += diffY * speed;
  
    const angle = getAngle(diffX, diffY);
    const squeeze = getSqueeze(diffX, diffY);
  
    const scale = 'scale(' + (1 + squeeze) + ', ' + (1 - squeeze) +')';
    const rotate = 'rotate(' + angle +'deg)';
    const translate = 'translate3d(' + pos.x + 'px ,' + pos.y + 'px, 0)';
  
    cursor.style.transform = translate;
    cursorCircle.style.transform = rotate + scale;
  };
  
  function loop() {
    updateCursor();
    requestAnimationFrame(loop);
  }
  
  requestAnimationFrame(loop);
  
  const cursorModifiers = document.querySelectorAll('[cursor-class]');
  
  cursorModifiers.forEach(curosrModifier => {
    curosrModifier.addEventListener('mouseenter', function() {
      const className = this.getAttribute('cursor-class');
      cursor.classList.add(className);
    });
  
    curosrModifier.addEventListener('mouseleave', function() {
      const className = this.getAttribute('cursor-class');
      cursor.classList.remove(className);
    });
  });


  /**
   * Initiate gallery lightbox 
   */
  const galleryLightbox = GLightbox({
    selector: '.activity-lightbox'
  });

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  new Swiper(".mainswiper", {
    spaceBetween: 30,
    effect: "fade",
    speed: 3000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },

  });


})()