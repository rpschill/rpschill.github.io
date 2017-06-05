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
            navbar.className = navbar.className.replace( " w3-card-2 w3-animate-top w3-white", "" );
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

} );