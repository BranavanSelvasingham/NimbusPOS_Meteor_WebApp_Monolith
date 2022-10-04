Maestro.Templates.Home = "Home";

Template.Home.onCreated(function() {


});

Template.Home.onRendered(function() {
	$('.carousel.carousel-slider').carousel({full_width: true});

	let options = [
		{selector: '#growingPlatform', offset: 100, callback: function(el) {
				Materialize.showStaggeredList('#growingPlatform');
			} 
		},
		// {selector: '#anyDeviceVideo', offset: 100, callback: function(el) {
		// 		// Materialize.showStaggeredList('#onAnyDevice');
		// 		Materialize.fadeInImage('#anyDeviceVideo');
		// 	} 
		// },
		// {selector: '#systemSetupVideo', offset: 100, callback: function(el) {
		// 		// Materialize.showStaggeredList('#systemSetup');
		// 		Materialize.fadeInImage('#systemSetupVideo');
		// 	} 
		// },
		// {selector: '#availableOnStores', offset: 100, callback: function(el) {
		// 		Materialize.showStaggeredList('#availableOnStores');
		// 		Materialize.fadeInImage('#app_store');
		// 		Materialize.fadeInImage('#play_store');
		// 	} 
		// },
		// {selector: '#contactUs', offset: 100, callback: function(el) {
		// 		Materialize.showStaggeredList('#contactUs');
		// 	} 
		// },
		{selector: '#vegandanish_image', offset: 0, callback: function(el) {
				Materialize.fadeInImage('#vegandanish_image');
			} 
		},
		{selector: '#fahrenheit1_image', offset: 0, callback: function(el) {
				Materialize.fadeInImage('#fahrenheit1_image');
			} 
		},
		
		// {selector: '#fahrenheit2_image', offset: 0, callback: function(el) {
		// 		Materialize.fadeInImage('#fahrenheit2_image');
		// 	} 
		// },
    ];

    Materialize.scrollFire(options);

	window.setTimeout(function(){Materialize.showStaggeredList('#homeTop');}, 100 );



	$(window).scroll(function() {
		// console.log("triggered", getCurrentScroll());
		var scroll = getCurrentScroll();
		var elemTop = $("#mainLoginSignup").offset().top;
		var elemBottom = elemTop + $("#mainLoginSignup").height();
		var shrinkHeader = elemBottom - 30;

	  	if ( scroll >= shrinkHeader ) {
	    	$('.homeHeader').addClass('grow');
	    	$('#homeHeaderContent').show();
	        $('#exploreMore').fadeTo(3, 0, function(){
		        $(this).css("visibility", "hidden")
		    });	    	
	    }
	    else {
	        $('.homeHeader').removeClass('grow');
	        $('#homeHeaderContent').hide();
	        $('#exploreMore').fadeTo(5, 1, function(){
		        $(this).css("visibility", "visible")
		    });
	    }

	    function isScrolledIntoView(elem){
		    var docViewTop = $(window).scrollTop();
		    var docViewBottom = docViewTop + $(window).height();

		    var elemTop = $(elem).offset().top;
		    var elemBottom = elemTop + $(elem).height();

		    return ((elemBottom <= docViewBottom + 60 ) && (elemTop >= docViewTop - 60));
		}

		$('video').each(function(){
		    if (isScrolledIntoView($(this))) {
		        $(this)[0].play();
		    } else {
		        $(this)[0].pause();
		    }
		});
	});

	function getCurrentScroll() {
		return window.pageYOffset || document.documentElement.scrollTop;
	};


});

Template.Home.helpers({


});

Template.Home.events({
	'click #exploreMoreArrow': function(event, template){
		$('body, html').animate({scrollTop: $(window).height() - 100}, 800);
	},

});



