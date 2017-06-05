$( document ).ready( function () {

    // Change style of navbar on scroll
    window.onscroll = function () { myFunction() };
    function myFunction() {
        var navbar = document.getElementById( "myNavbar" );
        var navItems = document.getElementsByClassName( "nav-item" );
        if ( document.body.scrollTop > 100 || document.documentElement.scrollTop > 100 ) {
            navbar.className = "w3-bar" + " w3-card-2" + " w3-animate-top" + " w3-white";
            navIems.className = navItems.className.replace( " w3-hover-black w3-text-white", " w3-hover-white w3-text-black")
        } else {
            navbar.className = navbar.className.replace( " w3-card-2 w3-animate-top w3-white", "" );
            navItems.className = navItems.className.replace( " w3-hover-white w3-text-black", " w3-hover-black w3-text-white");
        }
    }
    
    /**
     *
     * Toggle mobile nav
     *
     */

    $( '.menuToggle' ).click( function () {
        $( '#mobileNav' ).toggleClass( 'w3-show' );
    } );

} );