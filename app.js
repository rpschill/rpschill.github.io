$(function () {

    /**
     *
     * Define navbar style based on screen width
     *
     */


    if ($("#myNavbar").width() <= 768) {
        $("#myNavbar").removeClass("w3-white w3-opacity-min");
        $("#menuToggle").removeClass("w3-black");
    }

    /**
     *
     * Change style of navbar on scroll
     *
     */

    window.onscroll = function () { myFunction() };
    function myFunction () {
        var navbar = document.getElementById("myNavbar");

        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            navbar.className = "w3-bar" + " w3-card-2" + " w3-animate-top" + " w3-white";
            if ($(window).width() <= 768) {
                $("#navTitle").removeClass("w3-hide-small w3-black").addClass("w3-text-black");
                $("#menuToggle").removeClass("w3-opacity-min").addClass("w3-black");
            }
        } else {
            if ($(window).width() <= 768) {
                navbar.className = navbar.className.replace(" w3-card-2 w3-animate-top", " w3-opacity-min");
                $("#navTitle").addClass("w3-hide-small");
            }
        }
    }

    /**
     *
     * Toggle mobile nav menu
     *
     */

    $('.menuToggle').click(function () {
        $('#mobileNav').toggleClass('w3-show');
        $("#myNavbar").toggleClass("w3-black");
    });

    /**
     *
     * Smooth scrolling to target elements
     *
     */

    // Select all links with hashes
    $('a[href*="#"]')
        // Remove links that don't link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually going to happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 800, function () {
                        // Callback after animation
                        // Must change focus for accessibility!!
                        var $target = $(target);
                        $target.focus();
                        // Check if the target was focused
                        if ($target.is(":focus")) {
                            return false;
                        } else {
                            // Add tabindex for elements that are not focusable
                            $target.attr('tabindex', '-1');
                            // Set focus again
                            $target.focus();
                        }
                    });
                }
            }
        });

    /**
     *
     * Animate graphs when div enters viewport
     *
     */

    var $skills = $('#skills');
    var $hGraph = $('#hGraph95');
    var $jsGraph = $('#jsGraph90');
    var $ngGraph = $('#ngGraph85');
    var $pyGraph = $('#pyGraph80');

    $hGraph.css('width', '0');
    $jsGraph.css('width', '0');
    $ngGraph.css('width', '0');
    $pyGraph.css('width', '0');

    $(window).scroll(function () {
        $hGraph.isInViewport().css('width', '95%');
        $jsGraph.isInViewport().css('width', '90%');
        $ngGraph.isInViewport().css('width', '85%');
        $pyGraph.isInViewport().css('width', '80%');
    });

    /**
     *
     *  Animate social media icons when div enters viewport
     *
     */

    var $socialIcons = $('#social-icons');

    $(window).scroll(function () {
        $socialIcons.isInViewport().addClass('animated fadeInUp');
    });

    /**
     *
     *  Animate About section when div enters viewport
     *
     */

    var $aboutContent = $('#about-content');

    $(window).scroll(function () {
        $aboutContent.isInViewport().addClass('animated fadeInUp');
    });

    /**
     *
     *  Animate Portfolio section when div enters viewport
     *
     */

    var $portfolioFilter = $('.portfolio-filter');
    var $portfolioWrapper = $('#portfolio-wrapper');
    var $portfolio = $('.portfolio');

    $(window).scroll(function () {
        
        $portfolioFilter.isInViewport().addClass('animated fadeInDown');
        $portfolioWrapper.isInViewport().addClass('animated fadeInUp');
        $portfolio.isInViewport().addClass('animated fadeInUp');
    });

    /**
     * 
     * Keep copyright date updated
     * 
     */

    var currentDate = new Date();
    var copyrightYear = currentDate.getFullYear();
    var copyrightText = 'Copyright &copy; ' + copyrightYear + ' Ryan Schill'
    var copyrightElement = document.getElementById('copyright');

    copyrightElement.innerHTML = copyrightText;


    /**
     * 
     * Filter portfolio
     * 
     */

    var allButton = $('#all');
    var webAppsButton = $('#webapps');
    var websitesButton = $('#websites');
    var adsButton = $('#advertisements');

    function filterPortfolio (category) {
        var portfolioDiv, itemDivs;
        var cat = category;

        portfolioDiv = document.getElementById('portfolio-wrapper');
        itemDivs = $('div.portfolio');
        console.log('itemDivs', itemDivs);

        itemDivs.each(function (index) {
            if ($(this).hasClass(cat)) {
                $(this).removeClass('w3-hide');
            } else {
                $(this).addClass('w3-hide');
            }
        });

    }

    function removeActiveButton () {
        return $('.active-button').each(function () {
            $(this).removeClass('active-button');
        });
    }

    allButton.click(function () {
        removeActiveButton();
        $(this).addClass('active-button');
        return filterPortfolio('portfolio');
    });

    webAppsButton.click(function () {
        removeActiveButton();
        $(this).addClass('active-button');
        return filterPortfolio('webapps');
    });

    websitesButton.click(function () {
        removeActiveButton();
        $(this).addClass('active-button');
        return filterPortfolio('websites');
    });

    adsButton.click(function () {
        removeActiveButton();
        $(this).addClass('active-button');
        return filterPortfolio('advertisements');
    });


    /**
     * 
     * Portfolio object
     * 
     */

    var portfolioContent = [
        {
            'name': 'Dewars',
            'url': 'http://specless.io/view_623?ad=djl8RX',
            'imgSrc': './assets/dewars.png',
            'type': 'advertisements',
            'year': '2017',
            'status': 'complete',
            'textColor': 'white'
        },
        {
            'name': "Hulu Future Man",
            'url': 'http://specless.io/view_623?ad=Phsae1',
            'imgSrc': './assets/future_man.gif',
            'type': 'advertisements',
            'year': '2017',
            'status': 'complete',
            'textColor': 'white'
        },
        {
            'name': 'VanessaSchill.com',
            'url': 'http://vanessaschill.com',
            'imgSrc': './assets/vanessaschill.gif',
            'type': 'websites',
            'year': '2017-2018',
            'status': 'ongoing',
            'textColor': 'white'
        },
        {
            'name': 'Altice Interactive Game',
            'url': 'http://specless.io/view_623?ad=gZex0u&height=415&width=970&tagId=0ZLw1qLG7R',
            'imgSrc': './assets/space_invaders.gif',
            'type': 'advertisements',
            'year': '2018',
            'status': 'complete',
            'textColor': 'white'
        },
        {
            'name': 'projectr - task management',
            'url': '/projectr/',
            'imgSrc': './assets/projectr.png',
            'type': 'webapps',
            'year': '2016',
            'status': 'beta',
            'textColor': 'black'
        },
        {
            'name': 'JJIE.org',
            'url': 'http://jjie.org',
            'imgSrc': './assets/jjie.png',
            'type': 'websites',
            'year': '2014',
            'status': 'complete',
            'textColor': 'black'
        },
        {
            'name': 'YouthToday.org',
            'url': 'http://youthtoday.org',
            'imgSrc': './assets/youthtoday.png',
            'type': 'websites',
            'year': '2015',
            'status': 'complete',
            'textColor': 'black'
        },
        {
            'name': 'PomoDerp Timer',
            'url': '/pomoderp/',
            'imgSrc': './assets/pomoderp.png',
            'type': 'webapps',
            'year': '2016',
            'status': 'complete',
            'textColor': 'black'
        },
        {
            'name': 'Calculator',
            'url': '/calculator/',
            'imgSrc': './assets/calculator.png',
            'type': 'webapps',
            'year': '2016',
            'status': 'complete',
            'textColor': 'black'
        },
        
    ];

    /**
     * 
     * Build portfolio items
     * 
     */

    function checkForOnClick (type) {
        if (type === 'webapps') {
            return true;
        }

        return false;
    }

    function buildPortfolioItem (item) {
        var lower = item.type;
        var upper = lower.charAt(0).toUpperCase() + lower.substr(1, lower.length - 1);
        var onclick = "";
        var onclickStatus = checkForOnClick(item.type);

        if (onclickStatus) {
            onclick = 'onclick="onClick(this)"';
        }

        return `<div class="portfolio w3-animate-zoom ${item.type}">
                <a href="${item.url}">
                    <img src="${item.imgSrc}" ${onclick} class="w3-image w3-opacity" alt="${item.name}">
                    <div class="w3-container w3-light-gray portfolio-card">
                        <p class="w3-large">${item.name} | ${item.year}</p>
                        <p>${upper}</p>
                    </div>
                </a>
        </div>`;
    }

    /**
     * 
     * Build portfolio
     * 
     */

    function buildPortfolio () {
        var wrapper = $('#portfolio-wrapper');
        portfolioContent.forEach(function (item) {
            var itemHtml = buildPortfolioItem(item);
            wrapper.append(itemHtml);
        });
    }

    buildPortfolio();

    /**
     * 
     * Toggle portfolio item opacity effect on hover
     * 
     */

    var portfolioItem = $('.portfolio img.w3-image');
    portfolioItem.hover(
        function () {
            $(this).removeClass('w3-opacity');
            // $(this, 'div.portfolio-card').addClass('hover');
        },
        function () {
            $(this).addClass('w3-opacity');
            // $(this, 'div.portfolio-card').removeClass('hover');
        }
    );

});