
jQuery.fn.timeLineRail = function (options) {
    // default plugin settings
    settings = jQuery.extend({
        containerDiv: '#timeline',		// value: any HTML tag or #id, default to #timeline
        datesDiv: '#dates',			// value: any HTML tag or #id, default to #dates
        datesSelectedClass: 'selected',			// value: any class, default to selected
        datesSpeed: 'normal',			// value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to normal
        prevButton: '#prev',			// value: any HTML tag or #id, default to #prev
        pauseButton: '#pause',			// value: any HTML tag or #id, default to #pause
        pauseClass: 'time-player-pause',			// value: any class, default to time-player-pause
        playClass: 'time-player-play',			// value: any class, default to time-player-play
        nextButton: '#next',			// value: any HTML tag or #id, default to #next
        arrowKeys: 'false',			// value: true | false, default to false
        startAt: 1,					// value: integer, default to 1 (first)
        autoPlay: 'false',			// value: true | false, default to false
        autoPlayDirection: 'forward',			// value: forward | backward, default to forward
        autoPlayPause: 2000			// value: integer (1000 = 1 seg), default to 2000 (2segs)

    }, options);

    $(function () {
        // setting variables... many of them
        var howManyDates = $(settings.datesDiv + ' li').length;
        var currentDate = $(settings.datesDiv).find('a.' + settings.datesSelectedClass);
        var widthContainer = $(settings.containerDiv).width();
        var heightContainer = $(settings.containerDiv).height();
        var widthDates = $(settings.datesDiv).width();
        var heightDates = $(settings.datesDiv).height();
        var widthDate = $(settings.datesDiv + ' li').width();
        var heightDate = $(settings.datesDiv + ' li').height();
        var clickCallBackFun = settings.clickCallBack;
        var setInterval_id;
        $(settings.datesDiv).width(widthDate * howManyDates).css('marginLeft', widthContainer / 2 - widthDate / 2);
        var defaultPositionDates = parseInt($(settings.datesDiv).css('marginLeft').substring(0, $(settings.datesDiv).css('marginLeft').indexOf('px')));

        /*div/a click event*/
        $(settings.datesDiv + ' a').click(function (event) {
            var currentIndex = $(this).parent().prevAll().length;
            // now moving the dates
            $(settings.datesDiv + ' a').removeClass(settings.datesSelectedClass);
            $(this).addClass(settings.datesSelectedClass);
            $(settings.datesDiv).animate({'marginLeft': defaultPositionDates - (widthDate * currentIndex)}, {queue: false, duration: 'settings.datesSpeed'});
        });

        /*on mouseover event*/
        $(settings.datesDiv).mouseover(function () {
            if($(settings.pauseButton).hasClass(settings.pauseClass)){
                clearInterval(setInterval_id);
            }
        });

        /*on mouseout event*/
        $(settings.datesDiv).mouseout(function () {
           if($(settings.pauseButton).hasClass(settings.pauseClass)){
                if (settings.autoPlay == 'true') {
                    setInterval_id = setInterval("autoPlay()", settings.autoPlayPause);
                }
            }
        });


        /*next button click event*/
        $(settings.nextButton).bind('click', function (event) {
            event.preventDefault();
            last2first();
        });
        /*pre button click event*/
        $(settings.prevButton).click(function (event) {
            event.preventDefault();
            first2last();

        });
        /*pause Button button click event*/
        $(settings.pauseButton).click(function (event) {
            if($(this).hasClass(settings.pauseClass)) {//playing
                clearInterval(setInterval_id);
                $(this).removeClass(settings.pauseClass).addClass(settings.playClass);
            }else{
                if (settings.autoPlay == 'true') {
                    setInterval_id = setInterval("autoPlay()", settings.autoPlayPause);
                }
                $(this).removeClass(settings.playClass).addClass(settings.pauseClass);
            }
        });

        // keyboard navigation, added since 0.9.1
        if (settings.arrowKeys == 'true') {
            $(document).keydown(function (event) {
                if (event.keyCode == 39) {
                    $(settings.nextButton).click();
                }
                if (event.keyCode == 37) {
                    $(settings.prevButton).click();
                }
            });
        }

        // default position startAt, added since 0.9.3
        $(settings.datesDiv + ' li').eq(settings.startAt - 1).find('a').trigger('click');
        // autoPlay, added since 0.9.4
        if (settings.autoPlay == 'true') {
            setInterval_id = setInterval("autoPlay()", settings.autoPlayPause);
        }
    });
};

// autoPlay, added since 0.9.4
function autoPlay() {
    if (settings.autoPlayDirection == 'forward') {
        last2first();
    } else if (settings.autoPlayDirection == 'backward') {
        first2last();
    }
}

function first2last() {
    var currentDate = $(settings.datesDiv).find('a.' + settings.datesSelectedClass);
    if (currentDate.parent().is('li:first-child')) {
        $(settings.datesDiv + ' li:last-child').find('a').trigger('click');
    } else {
        currentDate.parent().prev().find('a').trigger('click');
    }
}

function last2first() {
    var currentDate = $(settings.datesDiv).find('a.' + settings.datesSelectedClass);
    if (currentDate.parent().is('li:last-child')) {
        $(settings.datesDiv + ' li:first-child').find('a').trigger('click');
    } else {
        currentDate.parent().next().find('a').trigger('click');
    }
}