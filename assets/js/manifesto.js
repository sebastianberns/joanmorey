var jm = {
  
  config: {
    next: 2000,
    timeout: 10000,
    scroll: {
      speed: 150,
      easing: 'easeOutCubic',
      updateURL: false
    }
  },
  m: document.getElementById('manifesto'),
  a: document.querySelectorAll('#manifesto article'),
  o: {},
  s: false,
  
  init: function()
  {
    jm.setup()
    // 
    var resizeDebounce = eina.debounce( jm.setup, jm.config.next )
    bean.on( window, 'resize', resizeDebounce )
    
    bean.on( document.documentElement, 'click', window.parent.toggle )
    
    // Pause on mousewheel
    var mousewheelThrottle = eina.throttle( jm.pause, 300, { trailing: false })
    bean.on( jm.m, 'DOMMouseScroll', mousewheelThrottle, false ) // Firefox
    bean.on( jm.m, 'mousewheel', mousewheelThrottle, false )     // all others
    bean.on( jm.m, 'touchmove', jm.pause, false )      // Touch
    // Resume after timeout
    var scrollTimeout = eina.debounce( jm.play, jm.config.next )
    bean.on( jm.m, 'DOMMouseScroll', scrollTimeout, false )      // Firefox
    bean.on( jm.m, 'mousewheel', scrollTimeout, false )          // all others
    bean.on( jm.m, 'touchmove', scrollTimeout, false )           // Touch  
  },
  
  setup: function()
  {
    if( /iPhone|iPod|iPad/.test( navigator.userAgent ) )
      jm.fixIOS()
    
    jm.pause()
    
    for( var i = 0; i < jm.a.length; i++ )
      jm.o[ jm.a[i].id ] = eina.offset( jm.a[i] )
    
    jm.play()
  },
  
  fixIOS: function()
  {
    var vp = window.parent.eina.vp()
    console.log( 'fixIOS', eina.vp(), window.parent.eina.vp() )
    
    document.documentElement.style.width  = vp.w +'px'
    document.documentElement.style.height = vp.h +'px'
    document.body.style.width  = vp.w +'px'
    document.body.style.height = vp.h +'px'
    jm.m.style.width  = vp.w +'px'
    jm.m.style.height = vp.h +'px'
    for( var i = 0; i < jm.a.length; i++ ){
      jm.a[i].style.height = vp.h +'px'
    }
  },
  
  get: {
    
    first: function()
    {
      return jm.a[ 0 ]
    },
    
    curr: function()
    {
      var h = parseInt( eina.vp().h / 2 )
      for( var i = 0; i < jm.a.length; i++ ){
        if( jm.o[ jm.a[i].id ].t + h >= window.scrollY ) 
          return jm.a[i]
      }
      return null
    },
    
    next: function()
    {
      var c = jm.get.curr() || jm.get.first()
      return c.nextElementSibling || jm.get.first()
    }
    
  },
  
  play: function()
  {
    jm.s = setInterval(function(){
      var n = '#'+ jm.get.next().id
        smoothScroll.animateScroll( null, n, jm.config.scroll )
    }, jm.config.next)
  },
  
  pause: function()
  {
    clearInterval( jm.s )
  }
  
}

domready( jm.init )
