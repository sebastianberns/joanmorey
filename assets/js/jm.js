var jm = {
  
  config: {
    next: 2000,
    timeout: 10000,
    scroll: 150
  },
  m: document.getElementById('manifesto'),
  a: document.querySelectorAll('#manifesto article'),
  s: false, t: false,
  
  init: function()
  {
    window.scrollTo(0, 100)
    jm.m.scrollTop = 1
    
    jm.setup()
    
    var resizeDebounce = eina.debounce( jm.setup, jm.config.next )
    bean.on( window, 'resize', resizeDebounce )
    
    bean.on( jm.m, 'click', jm.toggle )
    
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
    
    bean.on( jm.m, 'scroll', jm.loop )
  },
  
  setup: function()
  {
    jm.pause()
    jm.play()
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
        if( jm.a[i].offsetTop + h >= jm.m.scrollTop ) 
          return jm.a[i]
      }
      return null
    },
    
    next: function()
    {
      var c = jm.get.curr()
      return c.nextElementSibling
    }
    
  },
  
  play: function()
  {
    jm.s = setInterval(function(){
      var n = jm.get.next()
      if( n )
        jm.scroll( n, jm.config.scroll )
      else {
        jm.jump.start()
        jm.scroll( jm.get.next(), jm.config.scroll )
      }
    }, jm.config.next)
  },
  
  pause: function()
  {
    clearInterval( jm.s )
    clearInterval( jm.t )
  },
  
  scroll: function( elem, time )
  // http://stackoverflow.com/questions/26093394/smooth-scroll-into-view-vanilla-javascript
  {
    if( !elem ) return
    var to = elem.offsetTop
    var from = jm.m.scrollTop
    var start = new Date().getTime()
    
    jm.t = setInterval(function() {
        var step = Math.min( 1, ( new Date().getTime() - start ) / time )
        jm.m.scrollTop = ( from + step * ( to - from ) ) + 1
        if( step == 1 )
          clearInterval( jm.t )
    }, 25 )
    jm.m.scrollTop = from + 1
  },
  
  loop: function( _e )
  {
    if( jm.m.scrollTop >= document.getElementById('manifesto-end').offsetTop )
      jm.jump.start()
    else if( jm.m.scrollTop <= 0 )
      jm.jump.end()
  },
  
  jump: {
    
    start: function()
    {
      jm.pause()
      jm.m.scrollTop = 1
      jm.play()
    },
    
    end: function()
    {
      jm.pause()
      jm.m.scrollTop = document.getElementById('manifesto-end').offsetTop
      jm.play()
    }
    
  },
  
  toggle: function()
  {
    if( document.documentElement.hasAttribute('data-section') )
      document.documentElement.removeAttribute('data-section')
    else
      document.documentElement.setAttribute('data-section', 'info')
  }
  
}

domready( jm.init )
