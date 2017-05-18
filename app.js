$( document ).ready( function () {
    $( '#fullpage' ).fullpage( {
        navigation: true,
        slidesNavigation: true,
        anchors: [
            'home',
            'about',
            'portfolio'
        ],
        menu: '#myNavbar',
        controlArrows: true,
        verticalCentered: false
    } );
} );