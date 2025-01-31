(function ($) {
    // Cache jQuery objects
    var $window = $(window),
        $document = $(document),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $footer = $('#footer'),
        $panels = $wrapper.children('.panel'),
        $animatedLinks = $('.actions.animated a'),
        $animatedLink = null;

    // Set up responsive breakpoints
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });

    // Remove preload classes after page load
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload-0');
            window.setTimeout(function () {
                $body.removeClass('is-preload-1');
            }, 1500);
        }, 100);
    });
    
    // Handle animated link clicks
    $animatedLinks.on('click', function (event) {
        var href = $(this).attr('href');
        
        // Only handle internal hash links
        if (href.charAt(0) != '#' || (href.length > 1 && $panels.filter(href).length == 0)) return;
        
        event.preventDefault();
        event.stopPropagation();
        
        // Update hash
        window.location.hash = '';
        window.location.hash = href;
        $animatedLink = $(this);
    });

    // Panel initialization
    var locked = true;
    $panels.each(function () {
        var $this = $(this),
            $image = $this.children('.image'),
            $img = $image.find('img'),
            position = $img.data('position');
        
        // Set background image
        $image.css('background-image', 'url(' + $img.attr('src') + ')');
        if (position) $image.css('background-position', position);
        $img.hide();
    });

    // Unlock after initial load
    window.setTimeout(function () {
        locked = false;
    }, 1250);

    // Handle hash changes
    $window.on('hashchange', function (event) {
        var $ul, delay = 0, $panel;
        
        // Determine target panel
        if (window.location.hash && window.location.hash != '#') 
            $panel = $(window.location.hash);
        else 
            $panel = $panels.first();

        event.preventDefault();
        event.stopPropagation();
        if (locked) return;

        locked = true;

        // Handle active link state
        if ($animatedLink) {
            $ul = $animatedLink.parents('ul');
            $animatedLink.addClass('active');
            delay = 250;
        }

        // Panel transition sequence
        window.setTimeout(function () {
            $panels.addClass('inactive');
            $footer.addClass('inactive');

            window.setTimeout(function () {
                $panels.hide();
                $panel.show();
                $document.scrollTop(0);

                window.setTimeout(function () {
                    $panel.removeClass('inactive');
                    
                    // Reset active link
                    if ($animatedLink) {
                        $animatedLink.removeClass('active');
                        $animatedLink = null;
                    }

                    locked = false;
                    $window.triggerHandler('--refresh');

                    window.setTimeout(function () {
                        $footer.removeClass('inactive');
                    }, 250);
                }, 100);
            }, 350);
        }, delay);
    });

    // Initial panel setup
    (function () {
        var $panel;
        if (window.location.hash && window.location.hash != '#') 
            $panel = $(window.location.hash);
        else 
            $panel = $panels.first();

        $panels.not($panel).addClass('inactive').hide();
    })();

    // IE-specific fixes
    if (browser.name == 'ie') {
        $window.on('--refresh', function () {
            $wrapper.css('height', 'auto');
            window.setTimeout(function () {
                var h = $wrapper.height(),
                    wh = $window.height();
                if (h < wh) 
                    $wrapper.css('height', '100vh');
            }, 0);
        });

        $window.on('load', function () {
            $window.triggerHandler('--refresh');
        });

        $('.actions.animated').removeClass('animated');
    }
})(jQuery);