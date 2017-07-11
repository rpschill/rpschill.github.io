$(function() {

    /**
     *
     * Define navbar style based on screen width
     *
     */

    
    if ( $("#myNavbar").width() <= 768) {
        $( "#myNavbar" ).removeClass( "w3-white w3-opacity-min" );
        $( "#menuToggle" ).removeClass( "w3-black" );
    }

    /**
     *
     * Change style of navbar on scroll
     *
     */

    window.onscroll = function () { myFunction() };
    function myFunction() {
        var navbar = document.getElementById( "myNavbar" );
        
        if ( document.body.scrollTop > 100 || document.documentElement.scrollTop > 100 ) {
            navbar.className = "w3-bar" + " w3-card-2" + " w3-animate-top" + " w3-white";
            if ( $( window ).width() <= 768 ) {
                $( "#navTitle" ).removeClass( "w3-hide-small w3-black" ).addClass( "w3-text-black" );
                $( "#menuToggle" ).removeClass("w3-opacity-min").addClass( "w3-black" );
            }
        } else {
            navbar.className = navbar.className.replace( " w3-card-2 w3-animate-top", " w3-opacity-min" );
            if ( $( window ).width() <= 768 ) {
                $( "#navTitle" ).addClass( "w3-hide-small" );
                $( "#menuToggle" ).addClass("w3-opacity-min").removeClass("w3-black")
            }
        }
    }
    
    /**
     *
     * Toggle mobile nav menu
     *
     */

    $( '.menuToggle' ).click( function () {
        $( '#mobileNav' ).toggleClass( 'w3-show' );
        $( "#myNavbar" ).toggleClass( "w3-black" );
    } );

    /**
     *
     * Smooth scrolling to target elements
     *
     */

    // Select all links with hashes
    $( 'a[href*="#"]' )
        // Remove links that don't link to anything
        .not( '[href="#"]' )
        .not( '[href="#0"]' )
        .click( function ( event ) {
            // On-page links
            if (
                location.pathname.replace( /^\//, '' ) == this.pathname.replace( /^\//, '' )
                &&
                location.hostname == this.hostname
            ) {
                // Figure element to scroll to
                var target = $( this.hash );
                target = target.length ? target : $( '[name=' + this.hash.slice( 1 ) + ']' );
                // Does a scroll target exist?
                if ( target.length ) {
                    // Only prevent default if animation is actually going to happen
                    event.preventDefault();
                    $( 'html, body' ).animate( {
                        scrollTop: target.offset().top
                    }, 800, function () {
                        // Callback after animation
                        // Must change focus for accessibility!!
                        var $target = $( target );
                        $target.focus();
                        // Check if the target was focused
                        if ( $target.is( ":focus" ) ) {
                            return false;
                        } else {
                            // Add tabindex for elements that are not focusable
                            $target.attr( 'tabindex', '-1' );
                            // Set focus again
                            $target.focus();
                        }
                    } );
                }
            }
        } );
    
    /**
     *
     * Animate graphs when div enters viewport
     *
     */
    
    var $skills = $( '#skills' );
    var $hGraph = $( '#hGraph95' );
    var $jsGraph = $( '#jsGraph90' );
    var $ngGraph = $( '#ngGraph85' );
    var $pyGraph = $( '#pyGraph80' );

    $hGraph.css( 'width', '0' );
    $jsGraph.css( 'width', '0' );
    $ngGraph.css( 'width', '0' );
    $pyGraph.css( 'width', '0' );

    $( window ).scroll( function () {
        $hGraph.isInViewport().css( 'width', '95%' );
        $jsGraph.isInViewport().css( 'width', '90%' );
        $ngGraph.isInViewport().css( 'width', '85%' );
        $pyGraph.isInViewport().css( 'width', '80%' );
    } );

    /**
     *
     *  Animate social media icons when div enters viewport
     *
     */

    var $socialIcons = $( '#social-icons' );

    $( window ).scroll( function () {
        $socialIcons.isInViewport().addClass( 'animated fadeInUp' );
    } );

    /**
     *
     *  Animate About section when div enters viewport
     *
     */
    
    var $aboutContent = $( '#about-content' );

    $( window ).scroll( function () {
        $aboutContent.isInViewport().addClass( 'animated fadeInUp' );
    } );

    /**
     *
     *  Animate Portfolio section when div enters viewport
     *
     */

    var $portfolioContent = $( '.portfolio-content' );

    $( window ).scroll( function () {
        $portfolioContent.isInViewport().addClass( 'animated fadeInUp' );
    })

} );