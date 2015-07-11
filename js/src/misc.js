define(function(require, exports, module){

  /*
   * == Exports ==========
   */
  var exps = module.exports = {
      transitionEnd : ""
    , animationEnd  : ""
    , threed     : false
    , transition : false
  };


  /*
   * == Debounced Resize Event:( "debouncedResize" )==========
   */
  var resizeDebounceTO = null;
  var RESIZE_THRESHOLD = 250;
  $(window).on("resize", function() {

      function debounced () { $(window).trigger("debouncedResize"); }

      if ( resizeDebounceTO ) {
        clearTimeout(resizeDebounceTO);
      } else {
        debounced();
      }
      resizeDebounceTO = setTimeout( debounced, RESIZE_THRESHOLD );
  });


  /*
   * == $.fn.watchAutoResize ==========
   * Resize Event for Element which's size is based on body
   */
  var autoresize_els = [];
  $.fn.watchAutoResize = function() {
    if ( this.data("_ar_width") != undefined ) return;
    this.data("_ar_width",  this.width())
        .data("_ar_height", this.height());
    autoresize_els.push(this);
    if ( autoresize_els.length == 1) {
      $(window).on("debouncedResize", function(){
        for ( var i = 0; i < autoresize_els.length; ++i )
        {
          var t = autoresize_els[i];
          var w = t.width();
          var h = t.height();
          if ( w != t.data("_ar_width") || h != t.data("_ar_height") ) {
            t.data("_ar_width",  w)
             .data("_ar_height", h)
             .trigger("autoresize");
          }
        }
      });
    }
    return this;
  }


  /*
   * == $.fn.transform ==========
   * Apply transform css to the first element.
   */
  var theVendor = null;
  $.fn.transform = function ( value ) {
    var ss = this[0].style;

    if ( !theVendor ) {
      var vendors = ["webkitTransform", "MozTransform", "msTransform", "OTransform", "transform"];
      for ( var i = 0; i < vendors.length; ++i ) {
        if ( ss.hasOwnProperty( vendors[i] ) ) {
          theVendor = vendors[i];
          break;
        }
      }
    }

    if ( value ) ss[ theVendor ] = value;
    return this;
  }

  /*
   * == Get transform css ==========
   */
  exps.transformCSS = function ( value ) {
    var self = arguments.callee;
    if ( !self.prefix ) {
      var vendors  = ["webkitTransform", "MozTransform", "msTransform", "OTransform", "transform"];
      var prefixes = ["-webkit-transform", "-moz-transform", "-ms-transform", "-o-transform", "transform"];
      var ss       = $("body")[0].style;
      for ( var i = 0; i < vendors.length; ++i ) {
        if ( ss.hasOwnProperty( vendors[i] ) ) {
          self.prefix = prefixes[i];
        }
      }

      if ( !self.prefix ) { self.prefix = "transform"; }
    }

    return self.prefix + ":" + value + ";";
  }


  /*
   * == Feature Detection ==========
   */
  ;(function(){
    var threed     = "none";
    var el         = document.createElement('div');
    var transforms = {
          'WebkitTransform':'-webkit-transform'
        , 'OTransform'     :'-o-transform'
        , 'MSTransform'    :'-ms-transform'
        , 'MozTransform'   :'-moz-transform'
        , 'Transform'      :'transform'
        , 'transform'      :'transform'
    };

    document.body.insertBefore(el, document.body.lastChild);
    for(var t in transforms){
      if( el.style[ t ] !== undefined ){
        el.style[ t ] = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';
        threed = window.getComputedStyle(el).getPropertyValue( transforms[t] );
      }
    }

    if( threed !== undefined ) { threed = threed !== 'none'; }
    exps.threed = threed;

    var p, pre = ["", "O", "Webkit", "Moz"];
    for (p in pre) {
        if (el.style[ pre[p] + "Transition" ] !== undefined) {
            exps.transition = true;
            break;
        }
    }
    exps.transition = exps.transition || el.style["transition"] != undefined;
    document.body.removeChild(el);

    var baseTREnd  = " transitionEnd transitionend";
    var baseANIEnd = " animationEnd animationend";
    if ( $.browser.firefox ) {
      baseTREnd  = "mozTransitionEnd" + baseTREnd;
      baseANIEnd = "mozAnimationEnd"  + baseANIEnd;
    } else if ( window.opera ) {
      baseTREnd  = "oTransitionEnd otransitionend" + baseTREnd;
      baseANIEnd = "oAnimationEnd oanimationend"  + baseANIEnd;
    } else {
      baseTREnd  = "webkitTransitionEnd" + baseTREnd;
      baseANIEnd = "webkitAnimationEnd"  + baseANIEnd;
    }
    exps.transitionEnd = baseTREnd;
    exps.animationEnd  = baseANIEnd;
  })();


  /*
   * == window.requestAnimationFrame ==========
   */
  ;(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
  })();


  /*
   * == $.genericAnimate ==========
   */
  ;(function(){
    // Easing functions copied from Chart.js
    // https://github.com/nnnick/Chart.js/blob/master/Chart.js

    var EASING_FUNC = {
        linear        : function (t){ return t; }
      , easeInCubic    : function (t) { return t*t*t; }
      , easeOutCubic   : function (t) { return 1*((t = t/1-1)*t*t + 1); }
      , easeInOutCubic : function (t) {
        if ((t/=1/2) < 1) return 1/2*t*t*t;
        return 1/2*((t-=2)*t*t + 2);
      }
      , easeInQuart    : function (t) { return t*t*t*t; }
      , easeOutQuart   : function (t) { return -1 * ((t=t/1-1)*t*t*t - 1); }
      , easeInOutQuart : function (t) {
        if ((t/=1/2) < 1) return 1/2*t*t*t*t;
        return -1/2 * ((t-=2)*t*t*t - 2);
      }
      , easeInExpo    : function (t) { return (t==0) ? 1 : 1 * Math.pow(2, 10 * (t/1 - 1)); }
      , easeOutExpo   : function (t) { return (t==1) ? 1 : 1 * (-Math.pow(2, -10 * t/1) + 1); }
      , easeInOutExpo : function (t) {
        if (t==0) return 0;
        if (t==1) return 1;
        if ((t/=1/2) < 1) return 1/2 * Math.pow(2, 10 * (t - 1));
        return 1/2 * (-Math.pow(2, -10 * --t) + 2);
      }
    };

    $.easing = function ( t, easing ) { return EASING_FUNC[easing]( t ); }

    // duration in ms
    // onFrame = function ( value, position ) {}
    $.genericAnimate = function ( length, duration, easing, onFrame ) {

      if ( typeof duration == "function" ) {
        onFrame = duration;
        easing   = "easeInOutCubic";
        duration = 400;
      } else if ( typeof easing == "function" ) {
        onFrame = easing;
        if ( typeof duration == "string" )
        {
          easing   = duration;
          duration = 400;
        } else {
          easing   = "easeInOutCubic";
        }
      }

      var startTime = Date.now();

      var doAni = function () {
        var time  = Date.now();
        var frame = time - startTime;
        var p     = EASING_FUNC[easing]( frame / duration );

        if ( frame >= duration ) {
          if ( p > 1 ) { p = 1; }
        }

        onFrame( length * p, p );

        if ( frame < duration ) {
          requestAnimationFrame(doAni);
        }
      };

      requestAnimationFrame(doAni);
    }
  })();


  /*
   * == Inject new style ==========
   * If targetEl is supplied, then the stylesheet will replace
   * whatever in the targetEl.
   */
  exps.insertCSS = function ( $targetEl, stylesheet ) {
    if ( !stylesheet ) {
      stylesheet = $targetEl;
      $targetEl  = null;
    }

    var isStyleTag = true;

    if ( !$targetEl ) {
      $targetEl = $("<style type='text/css' />").appendTo("head");
    } else {
      isStyleTag = $targetEl.attr("tagName").toLowerCase() == "style";
    }

    return $targetEl.html( isStyleTag ? stylesheet : '&shy;<style>' + stylesheet + '</style>' );
  }
});
