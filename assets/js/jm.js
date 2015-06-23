var jm = {
  
  init: function()
  {
    jm.manifesto.init()
  },
  
  manifesto: {
    
    scroll: {
      speed: 100,
      easing: 'easeOutCubic'
    },
    m: document.getElementById('manifesto'),
    a: document.querySelectorAll('#manifesto article'),
    o: {},
    s: false,
    
    init: function()
    {
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
        var c = jm.manifesto.get.curr()
        return c.nextElementSibling || jm.manifesto.get.first()
      }
      
    },
    
    play: function()
    {
      jm.manifesto.s = setInterval(function(){
        var n = '#'+ jm.manifesto.get.next().id
        smoothScroll.animateScroll( null, n, { speed: jm.manifesto.scroll.speed, easing: jm.manifesto.scroll.easing })
      }, 2000)
    },
    
    pause: function()
    {
      clearInterval( jm.manifesto.s )
    }
    
  }
  
}

domready( jm.init )
