/**
 * uiMorphingButton_fixed.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
/* eslint-disable */
;( function( window ) {

	'use strict';

	var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'msTransition': 'MSTransitionEnd',
			'transition': 'transitionend'
		},
		transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
		support = { transitions : Modernizr.csstransitions };

	function extend( a, b ) {
		for( var key in b ) {
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function addListenerWithArgs(elem, evt, func, vars){
		var f = function(ff, vv){
			return (function (){
				ff(vv);
			});
		}(func, vars);

		elem.addEventListener(evt, f);

		return f;
	}

	function UIMorphingButton( el, options ) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this._init();
	}

	function detectOutsideClick(self) {
			let targetElement = event.target;

			if (targetElement == self.el) {
				self.toggle();
			}
	}

	UIMorphingButton.prototype.options = {
		closeEl : '',
		onBeforeOpen : function() { return false; },
		onAfterOpen : function() { return false; },
		onBeforeClose : function() { return false; },
		onAfterClose : function() { return false; }
	}

	UIMorphingButton.prototype._init = function() {
		// the button
		this.button = this.el.querySelector( 'button' );
		// state
		this.expanded = false;
		// content el
		this.contentEl = this.el.querySelector( '.morph-content' );
		// init events
		this._initEvents();
	}

	UIMorphingButton.prototype._initEvents = function() {
		var self = this;
		// open
		this.button.addEventListener( 'click', function() { self.toggle(); } );
		// close
		if( this.options.closeEl !== '' ) {
			var closeEl = this.el.querySelector( this.options.closeEl );
			if( closeEl ) {
				closeEl.addEventListener( 'click', function() { self.toggle(); } );
			}
		}
	}

	UIMorphingButton.prototype.toggle = function() {
		if( this.isAnimating ) return false;

		// callback
		if( this.expanded ) {
			this.options.onBeforeClose();
		}
		else {
			// add class active (solves z-index problem when more than one button is in the page)
			classie.addClass( this.el, 'active' );
			const storeFunc = addListenerWithArgs(window.document, 'click', detectOutsideClick, this);
			this.clickEvent = storeFunc;
			this.options.onBeforeOpen();
		}

		this.isAnimating = true;

		var self = this,
			onEndTransitionFn = function( ev ) {
				if( ev.target !== this ) return false;

				if( support.transitions ) {
					// open: first opacity then width/height/left/top
					// close: first width/height/left/top then opacity
					if( self.expanded && ev.propertyName !== 'opacity' || !self.expanded && ev.propertyName !== 'width' && ev.propertyName !== 'height' && ev.propertyName !== 'left' && ev.propertyName !== 'top' ) {
						return false;
					}
					this.removeEventListener( transEndEventName, onEndTransitionFn );
				}
				self.isAnimating = false;

				// callback
				if( self.expanded ) {
					// remove class active (after closing)
					classie.removeClass( self.el, 'active' );
					window.document.removeEventListener('click', self.clickEvent);
					self.options.onAfterClose();
				}
				else {
					self.options.onAfterOpen();
				}

				self.expanded = !self.expanded;
			};

		if( support.transitions ) {
			this.contentEl.addEventListener( transEndEventName, onEndTransitionFn );
		}
		else {
			onEndTransitionFn();
		}

		// set the left and top values of the contentEl (same like the button)
		var buttonPos = this.button.getBoundingClientRect();
		// need to reset
		classie.addClass( this.contentEl, 'no-transition' );
		this.contentEl.style.left = 'auto';
		this.contentEl.style.top = 'auto';

		// add/remove class "open" to the button wraper
		setTimeout( function() {
			self.contentEl.style.left = buttonPos.left + 'px';
			self.contentEl.style.top = buttonPos.top + 'px';

			if( self.expanded ) {
				classie.removeClass( self.contentEl, 'no-transition' );
				classie.removeClass( self.el, 'open' );
			}
			else {
				setTimeout( function() {
					classie.removeClass( self.contentEl, 'no-transition' );
					classie.addClass( self.el, 'open' );
				}, 25 );
			}
		}, 25 );
	}

	// add to global namespace
	window.UIMorphingButton = UIMorphingButton;

})( window );
/* eslint-enable */
