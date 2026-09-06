(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Animated background — connected particle network (hero only)
  --------------------------------------------------------- */
  var canvas = document.getElementById('bgCanvas');
  var heroEl = document.querySelector('.hero');
  if(canvas && heroEl && !reduceMotion){
    var ctx = canvas.getContext('2d');
    var W, H, dpr = Math.min(window.devicePixelRatio || 1, 2);
    var points = [];
    var POINT_COUNT = 0;

    function resize(){
      W = heroEl.offsetWidth;
      H = heroEl.offsetHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      POINT_COUNT = Math.max(14, Math.min(55, Math.floor((W * H) / 28000)));
      points = [];
      for(var i=0;i<POINT_COUNT;i++){
        points.push({
          x: Math.random()*W,
          y: Math.random()*H,
          vx: (Math.random()-0.5)*0.18,
          vy: (Math.random()-0.5)*0.18,
          r: Math.random()*1.3+0.6
        });
      }
    }

    var LINK_DIST = 140;
    function tick(){
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<points.length;i++){
        var p = points[i];
        p.x += p.vx; p.y += p.vy;
        if(p.x < 0 || p.x > W) p.vx *= -1;
        if(p.y < 0 || p.y > H) p.vy *= -1;
      }
      for(var i=0;i<points.length;i++){
        for(var j=i+1;j<points.length;j++){
          var a = points[i], b = points[j];
          var dx = a.x-b.x, dy = a.y-b.y;
          var dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < LINK_DIST){
            var op = (1 - dist/LINK_DIST) * 0.28;
            ctx.strokeStyle = 'rgba(255,255,255,'+op+')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y);
            ctx.lineTo(b.x,b.y);
            ctx.stroke();
          }
        }
      }
      for(var i=0;i<points.length;i++){
        var p = points[i];
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(tick);
  }

  /* ---------------------------------------------------------
     Nav scroll state / progress bar / back-to-top
  --------------------------------------------------------- */
  var nav = document.getElementById('nav');
  var scrollProgress = document.getElementById('scrollProgress');

  function onScroll(){
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('scrolled', y > 30);
    var h = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  document.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* ---------------------------------------------------------
     Mobile menu
  --------------------------------------------------------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  var scrim = document.getElementById('navScrim');
  function closeMenu(){
    links.classList.remove('open');
    scrim.classList.remove('show');
    toggle.setAttribute('aria-expanded','false');
  }
  toggle.addEventListener('click', function(){
    var open = links.classList.toggle('open');
    scrim.classList.toggle('show', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  scrim.addEventListener('click', closeMenu);

  /* ---------------------------------------------------------
     Mobile "gate opening" page transition on navigation
  --------------------------------------------------------- */
  var pageTransition = document.getElementById('pageTransition');
  function isMobile(){ return window.matchMedia('(max-width:720px)').matches; }

  function gateNavigate(href){
    var target = document.querySelector(href);
    if(!target || !pageTransition || reduceMotion){
      if(target){ target.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'}); }
      return;
    }
    pageTransition.classList.remove('opening');
    pageTransition.classList.add('closed');
    void pageTransition.offsetWidth; // force reflow
    var y = target.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({top: Math.max(y,0), left:0, behavior:'auto'});
    requestAnimationFrame(function(){
      pageTransition.classList.remove('closed');
      pageTransition.classList.add('opening');
    });
    setTimeout(function(){ pageTransition.classList.remove('opening'); }, 420);
  }

  links.querySelectorAll('a.nav-link').forEach(function(a){
    a.addEventListener('click', function(e){
      if(isMobile()){
        e.preventDefault();
        var href = a.getAttribute('href');
        closeMenu();
        setTimeout(function(){ gateNavigate(href); }, 90);
      } else {
        closeMenu();
      }
    });
  });
  links.querySelectorAll('a:not(.nav-link)').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  /* ---------------------------------------------------------
     Active link on scroll
  --------------------------------------------------------- */
  var navLinkEls = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinkEls.map(function(a){ return document.querySelector(a.getAttribute('href')); }).filter(Boolean);

  function setActive(link){
    navLinkEls.forEach(function(a){ a.classList.remove('active'); });
    link.classList.add('active');
  }

  var activeObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var id = '#' + entry.target.id;
      var link = navLinkEls.find(function(a){ return a.getAttribute('href') === id; });
      if(!link) return;
      if(entry.isIntersecting){
        setActive(link);
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px', threshold:0});
  sections.forEach(function(s){ activeObserver.observe(s); });

  /* ---------------------------------------------------------
     Reveal on scroll
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.14});
  revealEls.forEach(function(el){ revealObserver.observe(el); });

  /* ---------------------------------------------------------
     Hero one-time load sequence
  --------------------------------------------------------- */
  var heroCopy = document.getElementById('heroCopy');
  var heroHud = document.getElementById('heroHud');
  requestAnimationFrame(function(){
    setTimeout(function(){
      heroCopy.classList.add('in');
      heroHud.classList.add('in');
    }, 60);
  });

  /* ---------------------------------------------------------
     Hero cursor spotlight + HUD tilt (desktop only)
  --------------------------------------------------------- */
  var heroEl = document.querySelector('.hero');
  var heroSpot = document.getElementById('heroSpot');
  if(heroEl && !reduceMotion && window.matchMedia('(pointer:fine)').matches){
    heroEl.addEventListener('mousemove', function(e){
      var rect = heroEl.getBoundingClientRect();
      var mx = ((e.clientX - rect.left) / rect.width) * 100;
      var my = ((e.clientY - rect.top) / rect.height) * 100;
      heroSpot.style.setProperty('--mx', mx + '%');
      heroSpot.style.setProperty('--my', my + '%');

      var hx = (e.clientX / window.innerWidth - 0.5);
      var hy = (e.clientY / window.innerHeight - 0.5);
      heroHud.style.transform = 'rotateY(' + (hx*4) + 'deg) rotateX(' + (-hy*4) + 'deg)';
    });
    heroEl.addEventListener('mouseleave', function(){
      heroHud.style.transform = 'rotateY(0deg) rotateX(0deg)';
    });
  }

  /* ---------------------------------------------------------
     Count-up stats
  --------------------------------------------------------- */
  var counted = false;
  var hudStats = document.querySelectorAll('.hud-stat .num');
  function countUp(){
    if(counted) return;
    counted = true;
    hudStats.forEach(function(el){
      var target = parseInt(el.getAttribute('data-count'), 10);
      var small = el.querySelector('small');
      var smallHTML = small ? small.outerHTML : '';
      var duration = reduceMotion ? 1 : 1100;
      var startTime = null;
      function step(ts){
        if(!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var val = Math.round(target * eased);
        el.innerHTML = val + smallHTML;
        if(progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  var hud = document.querySelector('.hud');
  if(hud){
    new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting) countUp(); });
    }, {threshold:0.4}).observe(hud);
  }

  /* ---------------------------------------------------------
     HUD illustrative activity log
  --------------------------------------------------------- */
  var LOG_MESSAGES = [
    'Acesso liberado — Portaria 1',
    'Câmera 03 · gravação ativa',
    'Ronda automática concluída',
    'Portão social · fechado',
    'Relógio de ponto · sincronizado',
    'Sensor perimetral · normal',
    'Backup em nuvem · concluído',
    'Catraca 2 · fluxo normal'
  ];
  var hudLog = document.getElementById('hudLog');
  if(hudLog){
    var logIndex = 0;
    function pushLog(){
      var li = document.createElement('li');
      var now = new Date();
      var hh = String(now.getHours()).padStart(2,'0');
      var mm = String(now.getMinutes()).padStart(2,'0');
      li.innerHTML = '<span class="lg"></span><span class="lt">'+hh+':'+mm+'</span><span>'+LOG_MESSAGES[logIndex % LOG_MESSAGES.length]+'</span>';
      hudLog.appendChild(li);
      logIndex++;
      while(hudLog.children.length > 4){ hudLog.removeChild(hudLog.firstChild); }
    }
    pushLog();
    if(!reduceMotion){
      setInterval(pushLog, 2600);
    } else {
      pushLog(); pushLog(); pushLog();
    }
  }

  /* ---------------------------------------------------------
     Marquee duplicate for seamless loop
  --------------------------------------------------------- */
  var track = document.getElementById('marqueeTrack');
  if(track){ track.innerHTML += track.innerHTML; }

  /* ---------------------------------------------------------
     Carousel
  --------------------------------------------------------- */
  var carousel = document.getElementById('carousel');
  if(carousel){
    var carTrack = document.getElementById('carouselTrack');
    var slides = Array.prototype.slice.call(carTrack.children);
    var dotsWrap = document.getElementById('carDots');
    var prevBtn = document.getElementById('carPrev');
    var nextBtn = document.getElementById('carNext');
    var index = 0;
    var autoplayTimer = null;

    slides.forEach(function(_, i){
      var b = document.createElement('button');
      b.setAttribute('aria-label', 'Ir para slide ' + (i+1));
      if(i === 0) b.classList.add('active');
      b.addEventListener('click', function(){ goTo(i); resetAutoplay(); });
      dotsWrap.appendChild(b);
    });
    var dots = Array.prototype.slice.call(dotsWrap.children);

    function goTo(i){
      index = (i + slides.length) % slides.length;
      carTrack.style.transform = 'translateX(-' + (index*100) + '%)';
      dots.forEach(function(d,di){ d.classList.toggle('active', di===index); });
    }
    function next(){ goTo(index+1); }
    function prev(){ goTo(index-1); }

    nextBtn.addEventListener('click', function(){ next(); resetAutoplay(); });
    prevBtn.addEventListener('click', function(){ prev(); resetAutoplay(); });

    function startAutoplay(){
      if(reduceMotion) return;
      autoplayTimer = setInterval(next, 7000);
    }
    function resetAutoplay(){
      clearInterval(autoplayTimer);
      startAutoplay();
    }
    startAutoplay();
    carousel.addEventListener('mouseenter', function(){ clearInterval(autoplayTimer); });
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin', function(){ clearInterval(autoplayTimer); });
    carousel.addEventListener('focusout', startAutoplay);

    // Keyboard
    carousel.setAttribute('tabindex','0');
    carousel.addEventListener('keydown', function(e){
      if(e.key === 'ArrowRight'){ next(); resetAutoplay(); }
      if(e.key === 'ArrowLeft'){ prev(); resetAutoplay(); }
    });

    // Swipe / drag
    var startX = 0, currentX = 0, dragging = false;
    function pointerDown(e){
      dragging = true;
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      clearInterval(autoplayTimer);
      carTrack.style.transition = 'none';
    }
    function pointerMove(e){
      if(!dragging) return;
      currentX = (e.touches ? e.touches[0].clientX : e.clientX);
      var delta = currentX - startX;
      var pct = (delta / carousel.offsetWidth) * 100;
      carTrack.style.transform = 'translateX(calc(-' + (index*100) + '% + ' + delta + 'px))';
    }
    function pointerUp(e){
      if(!dragging) return;
      dragging = false;
      carTrack.style.transition = '';
      var delta = currentX - startX;
      if(Math.abs(delta) > 60){
        if(delta < 0) next(); else prev();
      } else {
        goTo(index);
      }
      currentX = 0; startX = 0;
      resetAutoplay();
    }
    carTrack.addEventListener('touchstart', pointerDown, {passive:true});
    carTrack.addEventListener('touchmove', pointerMove, {passive:true});
    carTrack.addEventListener('touchend', pointerUp);
    carTrack.addEventListener('mousedown', pointerDown);
    window.addEventListener('mousemove', pointerMove);
    window.addEventListener('mouseup', pointerUp);
  }

  /* ---------------------------------------------------------
     Copy phone number
  --------------------------------------------------------- */
  var copyBtn = document.getElementById('copyPhoneBtn');
  if(copyBtn){
    copyBtn.addEventListener('click', function(){
      var number = '+55 81 98687-9234';
      var label = document.getElementById('copyPhoneLabel');
      function done(ok){
        label.textContent = ok ? 'Copiado!' : 'Copiar número';
        copyBtn.classList.toggle('copied', ok);
        setTimeout(function(){
          label.textContent = 'Copiar número';
          copyBtn.classList.remove('copied');
        }, 2000);
      }
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(number).then(function(){ done(true); }).catch(function(){ done(false); });
      } else {
        done(false);
      }
    });
  }

  /* ---------------------------------------------------------
     Quote form -> WhatsApp
  --------------------------------------------------------- */
  var form = document.getElementById('quoteForm');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = document.getElementById('qname').value.trim();
      var service = document.getElementById('qservice').value;
      var msg = document.getElementById('qmsg').value.trim();
      var text = 'Olá! Meu nome é ' + (name || '—') + '. Tenho interesse em: ' + service + '.';
      if(msg){ text += ' Detalhes: ' + msg; }
      var url = 'https://wa.me/5581986879234?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
    });
  }
})();
