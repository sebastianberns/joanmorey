var jm = {
  
  config: {
    resize: 300,
    scroll: 150,
    next: 2000,
    resume: 6000
  },
  m: document.getElementById('manifesto'),
  a: document.querySelectorAll('#manifesto article'),
  s: false, t: false,
  
  init: function()
  {
    window.scrollTo(0, 100)
    jm.m.scrollTop = 0
    
    jm.setup()
    
    var resizeDebounce = eina.debounce( jm.setup, jm.config.resize )
    bean.on( window, 'resize', resizeDebounce )
    
    bean.on( jm.m, 'click', jm.toggle )
    
    // Pause on mousewheel
    var mousewheelThrottle = eina.throttle( jm.pause, 300, { trailing: false })
    bean.on( jm.m, 'DOMMouseScroll', mousewheelThrottle, false ) // Firefox
    bean.on( jm.m, 'mousewheel', mousewheelThrottle, false )     // all others
    bean.on( jm.m, 'touchmove', jm.pause, false )      // Touch
    // Resume after timeout
    var scrollTimeout = eina.debounce( jm.play, jm.config.resume )
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
      return jm.get.curr().nextElementSibling
    }
    
  },
  
  play: function()
  {
    jm.s = setInterval(function(){
      jm.scroll( jm.get.next() )
    }, jm.config.next)
  },
  
  pause: function()
  {
    clearInterval( jm.s )
    if( jm.t )
      jm.t.stop()
  },
  
  scroll: function( _e )
  {
    if( _e ){
      jm.t = morpheus.tween(
        jm.config.scroll,                              // duration
        function animate( _y ){ jm.m.scrollTop = _y }, // animation function
        null,                                          // callback on complete
        function linear( _t ){ return _t },            // easing function
        jm.m.scrollTop,                                // start int
        _e.offsetTop                                   // end int
      )
    }
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
