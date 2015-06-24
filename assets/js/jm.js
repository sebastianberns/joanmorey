var jm = {
  
  init: function()
  {
    jm.manifesto.init()
  },
  
  manifesto: {
    
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
      jm.manifesto.setup()
      // 
      var resizeDebounce = eina.debounce( jm.manifesto.setup, jm.manifesto.scroll.next )
      bean.on( window, 'resize', resizeDebounce )
      
      // Pause on mousewheel
      var mousewheelThrottle = eina.throttle( jm.manifesto.pause, 300, { trailing: false })
      bean.on( jm.manifesto.m, 'DOMMouseScroll', mousewheelThrottle, false ) // Firefox
      bean.on( jm.manifesto.m, 'mousewheel', mousewheelThrottle, false )     // all others
      bean.on( jm.manifesto.m, 'touchmove', jm.manifesto.pause, false )      // Touch
      // Resume after timeout
      var scrollTimeout = eina.debounce( jm.manifesto.play, jm.manifesto.scroll.next )
      bean.on( jm.manifesto.m, 'DOMMouseScroll', scrollTimeout, false )      // Firefox
      bean.on( jm.manifesto.m, 'mousewheel', scrollTimeout, false )          // all others
      bean.on( jm.manifesto.m, 'touchmove', scrollTimeout, false )           // Touch  
    },
    
    setup: function()
    {
      jm.manifesto.pause()
      
      for( var i = 0; i < jm.manifesto.a.length; i++ )
        jm.manifesto.o[ jm.manifesto.a[i].id ] = eina.offset( jm.manifesto.a[i] )
      
      jm.manifesto.play()
    },
    
    get: {
      
      first: function()
      {
        return jm.manifesto.a[ 0 ]
      },
      
      curr: function()
      {
        var h = parseInt( eina.vp().h / 2 )
        for( var i = 0; i < jm.manifesto.a.length; i++ ){
          if( jm.manifesto.o[ jm.manifesto.a[i].id ].t + h >= window.scrollY ) 
            return jm.manifesto.a[i]
        }
        return null
      },
      
      next: function()
      {
        var c = jm.manifesto.get.curr() || jm.manifesto.get.first()
        return c.nextElementSibling || jm.manifesto.get.first()
      }
      
    },
    
    play: function()
    {
      jm.manifesto.s = setInterval(function(){
        var n = '#'+ jm.manifesto.get.next().id
        smoothScroll.animateScroll( null, n, jm.manifesto.config.scroll )
      }, jm.manifesto.scroll.next)
    },
    
    pause: function()
    {
      clearInterval( jm.manifesto.s )
    }
    
  }
  
}

domready( jm.init )
