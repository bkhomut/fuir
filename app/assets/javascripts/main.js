var qtext;
var currentCat = $("#f-ing_with span").html();

var contentH;
var new_left;
var old_left;
var prev_left;
var curr_left;
var next_left;

var topquestions = false;
var viewed = [];

function topQInit(period) {
    var wndw = $('#top');
    if($('html').hasClass('touch')) {
        wndw.off('swiperight').off('swipeleft');
    } else {
        $('.prev1').unbind('click'); $('.next1').unbind('click');
        wndw.find("img.slide_arrow").unbind('click').unbind('mouseenter').unbind('mouseleave').css('cursor', 'default');           
    }
    wndw.load("includes/top_questions.php", "period="+period, function() {
        $("#tqn_opts li:eq("+period+")").addClass('active');
        $("#tqn-container").show();
        setSlides();
        wndw.find(".qcontainer").show();
        $("#random").hide();
        footerInit();
        // REBIND
        socialInit(wndw);
        var currentContext = wndw.find(".qcontainer.current");
        $(".response.clickable", currentContext).click(respond);
        $("#like_question.sub", currentContext).submit(processLike).find(".like_vote").click(function() {
            $('#likeval', currentContext).val($(this).attr('id')[0]);
            $("form#like_question", currentContext).submit();
        });
        setArrowBindings(wndw);
        if($('html').hasClass('touch')) {
            wndw.on('swiperight', clickPrev).on('swipeleft', clickNext);
        } else {
            wndw.find(".qcontainer.prev1").click(clickPrev); // BY DEFAULT THERE IS NO PREV...
            wndw.find(".qcontainer.next1").click(clickNext);
            wndw.find("img.slide_arrow").hover(function() {
                var id = $(this).attr('id');
                $(this).attr('src', 'img/' + id + '_red.png');
            }, function() {
                var id = $(this).attr('id');
                $(this).attr('src', 'img/' + id + '_gray.png');
            });
        }
        topquestions = true;
        $(".cat").click(catSelect);
        $(".submit_button").click(submitQuestionClick);
    }).show();    
}

function topQClick() {
    $('.top_button').unbind('click').find('.nav_item').addClass('active-nav');
    $(".cat").unbind('click');
    $(".submit_button").unbind('click');
    if($('#submit_new').length) { closeQuestionForm($('#random')); }
    $('#page.slid').slideBack();
    topQInit(3);// default - year
}

function topToRand() {
    if(topquestions) {
        topquestions = false;
        $(".top_button").click(topQClick).find('.nav_item').removeClass('active-nav');
        $("#tqn-container").hide().find('#tqn_opts li').removeClass('active');
        $("#top").hide();
        $("#random").show();
        setSlides();
        footerInit();
    }    
}

function catSelect() {
    topToRand();
    var newcat = this.innerHTML;
    $("#f-ing_with span").html(newcat);
    if(newcat != currentCat) {
        currentCat = newcat;
        $("#cat_select").submit();
    }
}

// setSlides -- set absolute position of current and next question slides
function setSlides() {
    var vpw = $(window).width();
    var vph = $(window).height();
    var currwindow = $('.slide_window:visible');
    var currentContext = currwindow.find(".current");
    var slideW = currentContext.width();
    var slideH = Math.max(currentContext.height(),currwindow.find('.next1').height());
    $('#site-container').height(vph).width(vpw);
    contentH = $("#hn_container").height() + 30 + Math.max($('.content_main').height()+40, slideH+10);
    var pageH = Math.max(vph, contentH); // is footer set yet?
    //alert('container w/h set');
    //$('#page').width(vpw).height(pageH);
    //alert('page w/h set'); // only menu visible at this pt
    //alert('slideH: '+slideH+' | contentH: '+contentH+' | hncont: '+$("#hn_container").height());
    $(".slide_window").height(slideH).css('margin-top', (Math.max(10, (vph-contentH)/2)) + 'px');
    $('#page').width(vpw).height(pageH).css('visibility','visible');
    curr_left = (vpw/2)-(slideW/2);
    if(vpw > 979) {
        new_left = vpw+1000;
        old_left = -2000;
        prev_left = 50-slideW;
        next_left = vpw-50;
        $("html.no-touch img.slide_arrow#next").css('left', ((vpw/2)+(slideW/2)+50) + 'px');
        $("html.no-touch img.slide_arrow#prev").css('left', (curr_left-100) + 'px');
    } else if(vpw <= 979 && vpw > 767) {
        new_left = vpw+800;
        old_left = -1600;
        prev_left = 50-slideW;
        next_left = vpw-50;
        $("html.no-touch img.slide_arrow#next").css('left', ((vpw/2)+(slideW/2)+25) + 'px');
        $("html.no-touch img.slide_arrow#prev").css('left', (curr_left-65) + 'px');
    } else {
        new_left = vpw+600;
        old_left = -1200;
        prev_left = -(400+slideW);
        next_left = vpw+400;
        $("html.no-touch img.slide_arrow#next").css('left', ((vpw/2)+(slideW/2)+10) + 'px');
        $("html.no-touch img.slide_arrow#prev").css('left', (curr_left-35) + 'px');
    }
    $(".qcontainer[class*='prev']").css('left', old_left + 'px');
    currentContext.css('left', curr_left + 'px');
    $('#top_quest_nav').css('left', curr_left + 'px');
    $(".qcontainer[class*='next']").css('left', new_left + 'px');
    $(".prev1").css('left', prev_left + 'px');
    $(".next1").css('left', next_left + 'px');
}
window.onresize = function(event) {
    //if($('html').hasClass('no-touch')) {
    $('#page.slid').slideBack();
    setSlides();
    footerInit();
    //}
}

// invoked on click of next arrow or question
function clickNext() {
    var wndw = $('.slide_window:visible');
    if(wndw.find('.qcontainer.next1').length)  { // only won't exist when user views last of top questions, in which case nothing should happen
        if($('html').hasClass('touch')) {
            wndw.off('swiperight').off('swipeleft');
        } else {
            wndw.find("img.slide_arrow").unbind('click');
            wndw.find('.qcontainer').unbind('click');
        }
        var currentContext = wndw.find(".qcontainer.current");
        $(".response", currentContext).unbind('click');
        $(".submit_button").unbind('click');
        $('.cat').unbind('click');
        var newnext;
        if(topquestions || wndw.find('.qcontainer.next2').length) {
            newnext = wndw.find('.qcontainer.next2');
        } else {
            generateNewQuestions(1);
            newnext = wndw.find('#new1');
        }
        setNextQuestion(wndw, newnext);
    } else { // DEBUGGING...
        //alert('ClickNext triggered with no next slide');
    }
}

function updateSlides(which, right) { // remove slides pushed out of range and update classes
    var selector;
    var ns;
    if(right) {
        which.find('.next9').remove();
        for(var n=8;n>0;n--) {
            selector = 'next' + n;
            ns = 'next' + (n+1);
            which.find('.'+selector).removeClass(selector).addClass(ns);
        }
        for(var m=2;m<10;m++) {
            selector = 'prev' + m;
            ns = 'prev' + (m-1);
            which.find('.'+selector).removeClass(selector).addClass(ns);
        }
    } else {
        which.find('.prev9').remove();
        for(var n=8;n>0;n--) {
            selector = 'prev' + n;
            ns = 'prev' + (n+1);
            which.find('.'+selector).removeClass(selector).addClass(ns);
        }
        for(var m=2;m<10;m++) {
            selector = 'next' + m;
            ns = 'next' + (m-1);
            which.find('.'+selector).removeClass(selector).addClass(ns);
        }
    }
}

function clickPrev() {
    var wndw = $('.slide_window:visible');
    if(wndw.find(".qcontainer.prev1").length) { // CHANGED
        var olderprev = wndw.find('.qcontainer.prev2');
        var oldprev = wndw.find(".qcontainer.prev1"); //CHANGED
        var oldcurr = wndw.find(".qcontainer.current");
        var oldnext = wndw.find(".qcontainer.next1"); // CHANGED
        if($('html').hasClass('touch')) {
            wndw.off('swiperight').off('swipeleft');
        } else {
            wndw.find("img.slide_arrow").unbind('click');
            oldprev.unbind('click'); oldnext.unbind('click');
        }
        $(".response", oldcurr).unbind('click');
        $("form#like_question", oldcurr).unbind('submit').find(".like_vote").unbind('click');
        $("#social_container li", oldcurr).unbind('mouseenter').unbind('mouseleave');
        $(".submit_button").unbind('click');
        $('.cat').unbind('click');
        oldnext.animate({
            left: new_left
        }, 500, function() {
        });
        oldcurr.animate({
            left: next_left
        }, 500, function() {
        });
        oldprev.animate({
            left: curr_left
        }, 500, function() {
            if(!olderprev.length) { // ADDED -- and copied to next block -- need to refactor this
                $(".response.clickable", oldprev).click(respond);
                $("#like_question.sub .like_vote", oldprev).bind('click', function() {
                    $('#likeval', oldprev).val($(this).attr('id')[0]);
                    $("#like_question", oldprev).submit();
                });
                socialInit(wndw);
                $(".submit_button").click(submitQuestionClick); 
                $(".cat").click(catSelect);
                if($('html').hasClass('touch')) {
                    wndw.on('swiperight', clickPrev).on('swipeleft', clickNext);
                } else {
                    oldcurr.click(clickNext);
                    setArrowBindings(wndw);
                }
            }
        });
        olderprev.animate({ // ADDED
            left: prev_left
        }, 500, function () {
            $(".response.clickable", oldprev).click(respond);
            $("#like_question.sub .like_vote", oldprev).bind('click', function() {
                $('#likeval', oldprev).val($(this).attr('id')[0]);
                $("#like_question", oldprev).submit();
            });
            socialInit(wndw);
            $(".submit_button").click(submitQuestionClick); 
            $(".cat").click(catSelect);
            if($('html').hasClass('touch')) {
                wndw.on('swiperight', clickPrev).on('swipeleft', clickNext);
            } else {
                olderprev.click(clickPrev);
                oldcurr.click(clickNext);
                setArrowBindings(wndw);
            }
        });
        updateSlides(wndw, true); // ADDED
        oldcurr.removeClass("current").addClass("next1"); // CHANGED -- MOVE THESE??
        oldprev.removeClass("prev1").addClass("current");

    } else {
        if(!topquestions) {
            if($('html').hasClass('touch')) {
                wndw.off('swiperight').off('swipeleft');
                wndw.find("#no_more_prevs").css('margin-top', wndw.find(".qcontainer.current").css('margin-top')).animate({
                    'left': '0px'
                }, 500).delay(2000).animate({
                    'left': '-300px'
                }, 500, function() {
                    wndw.on('swiperight', clickPrev).on('swipeleft', clickNext);
                });
            } else {
                wndw.find('.qcontainer').unbind('click');
                wndw.find("img.slide_arrow").unbind('click');
                wndw.find("#no_more_prevs").css('margin-top', wndw.find(".qcontainer.current").css('margin-top')).animate({
                    'left': '0px'
                }, 500).delay(2000).animate({
                    'left': '-300px'
                }, 500, function() {
                    setArrowBindings(wndw);
                    wndw.find('.qcontainer.next1').bind('click', clickNext);
                });
            }
        }
    }
}

// setArrowBindings -- bind prev and next arrow click events
function setArrowBindings(which) {
    which.find("img.slide_arrow#prev").click(clickPrev);
    which.find("img.slide_arrow#next").click(clickNext);
}

// setNextQuestion -- only called when there is known to be a next question
function setNextQuestion(wndw, newnext) { // newnext may be empty or .next2 or #new1
    var oldprev = wndw.find(".qcontainer.prev1"); // CHANGED
    var oldcurr = wndw.find(".qcontainer.current");
    var oldnext = wndw.find(".qcontainer.next1"); // CHANGED
    $(".like_vote", oldcurr).unbind('click');
    $("#social_container li", oldcurr).unbind('mouseenter').unbind('mouseleave');
    oldprev.animate({
        left: old_left
    }, 500, function() {
    });    
    oldcurr.animate({
        left: prev_left
    }, 500, function() {
    });
    oldnext.animate({
        left: curr_left
    }, 500, function() {
        if(!newnext.length) {
            $('.response.clickable', oldnext).bind('click', respond);
            $("#like_question.sub", oldnext).submit(processLike).find(".like_vote").bind('click', function() {
                $('#likeval', oldnext).val($(this).attr('id')[0]);
                $("form#like_question", oldnext).submit();
            });
            socialInit(wndw);
            if($('html').hasClass('touch')) {
                wndw.on('swiperight', clickPrev).on('swipeleft', clickNext);
            } else {
                oldcurr.click(clickPrev);
                newnext.click(clickNext);
                setArrowBindings(wndw);      
            }
            /* for auto-switching */
            $(".submit_button").click(submitQuestionClick);
            $(".cat").click(catSelect);
        }
    });
    newnext.animate({
        left: next_left
    }, 500, function() {
        $('.response.clickable', oldnext).bind('click', respond);
        $("#like_question.sub", oldnext).submit(processLike).find(".like_vote").bind('click', function() {
            $('#likeval', oldnext).val($(this).attr('id')[0]);
            $("form#like_question", oldnext).submit();
        });
        socialInit(wndw);
        if($('html').hasClass('touch')) {
            wndw.on('swiperight', clickPrev).on('swipeleft', clickNext);
        } else {
            oldcurr.click(clickPrev);
            newnext.click(clickNext);
            setArrowBindings(wndw);       
        }
        /* for auto-switching */
        $(".submit_button").click(submitQuestionClick);
        $(".cat").click(catSelect);
    });
    if(!oldnext.hasClass('viewed') && !topquestions) {
        var viewData = 'qid=' + $("#q_id", oldnext).val();
        $.get('includes/processView.php', viewData);
        viewed.push(viewData);
    }
    updateSlides(wndw, false);
    oldcurr.removeClass('current').addClass('prev1');
    oldnext.removeClass('next1').addClass('current').addClass('viewed').unbind('click');
    newnext.removeAttr('id').attr('class','qcontainer next1');
}

// processCatSwap -- invoked on click of new category
function processCatSwap(event) {
    event.preventDefault();
    $(".cat").unbind('click');
    var swindow = $('#random');    
    var prev = swindow.find(".qcontainer.prev1");
    var oldcurr = swindow.find(".qcontainer.current");
    var oldnext = swindow.find(".qcontainer.next1");
    $(".response", oldcurr).unbind('click');
    $(".submit_button").unbind('click');
    if($('html').hasClass('touch')) {
        swindow.off('swiperight').off('swipeleft');
    } else {
        swindow.find("img.slide_arrow").unbind('click');
        prev.unbind('click'); oldnext.unbind('click');        
    }
    for(var i=2; i<10; i++) { $('.next'+i).remove(); }
    var new_q = '<div class="qcontainer" id="new1" style="left: ' + new_left + 'px;"></div>';
    swindow.append(new_q);
    new_q = '<div class="qcontainer" id="new2" style="left: ' + new_left + 'px;"></div>';
    swindow.append(new_q);
    var new1 = $("#new1");
    var new2 = $("#new2");
    var dataStr = 'category=' + currentCat;
    // structure of call below is necessary to prevent duplicate first 2 questions in the 'all' category
    new1.load('includes/question_template.php', dataStr, function() {
        new2.load('includes/question_template.php', dataStr);
    });
    new1.show();
    new2.show();

    // slide current and next out to the right, and delete them
    oldcurr.animate({
        left: new_left
    }, 500, function() {
        oldcurr.remove();
    });
    oldnext.animate({
        left: new_left
    }, 500, function() {
        oldnext.remove();
    });
    new1.animate({
        left: curr_left
    }, 500, function() {
    });
    new2.animate({
        left: next_left
    }, 500, function() {
        $('.response.clickable', new1).bind('click', respond);
        $("#like_question.sub", new1).submit(processLike).find(".like_vote").bind('click', function() {
            $('#likeval', new1).val($(this).attr('id')[0]);
            $("#like_question", new1).submit();
        });
        socialInit(swindow);
        if($('html').hasClass('touch')) {
            swindow.on('swiperight', clickPrev).on('swipeleft', clickNext);
        } else {
            prev.click(clickPrev);
            new2.click(clickNext);
            setArrowBindings(swindow);
        }
        $(".submit_button").click(submitQuestionClick);
        $(".cat").click(catSelect);
    });
    
    if(!topquestions) {
        var viewData = 'qid=' + $("#q_id", new1).val();
        $.get('includes/processView.php', viewData);
        viewed.push(viewData);
        new1.addClass('viewed');
    }
    new1.removeAttr('id').addClass('current');
    new2.removeAttr('id').addClass('next1');
    
    return false;
}

// answerQuestion -- display answer data
function answerQuestion(wdw, tot, r1, r2) {
    var currentContext = $(".current",wdw);
    var w = $("#answer_display").width()
    $(".q_or_a_small #letter", currentContext).css("font-size","2.5em").css("line-height","1.5");
    $("#left #letter", currentContext).hide().html(r1);
    $("#right #letter", currentContext).hide().html(r2);
    if($(window).width() < 480) {
        $("html.touch .current #swipe_memo").html(tot);
        $("html.no-touch .current #resdata_l").html(tot).css('display','inline');
    } else {
        $(".current #resdata_l").html(tot).css('display','inline');
    }
    $(".q_or_a_small", currentContext).animate({
        width: w
    }, 300, function() {
        $(".response #letter", currentContext).fadeIn();
    });
}

// generateNewQuestions
function generateNewQuestions(n) {
    for(var i=0; i<n;i++) {
        var new_id = 'new' + (i+1);
        var new_q = '<div class="qcontainer" id="' + new_id + '" style="left: ' + new_left + 'px;"></div>';
        $(".slide_window:visible").append(new_q);
        var new_q_url = 'includes/question_template.php?category=' + currentCat;
        new_id = '#' + new_id;
        new_q = $(new_id);
        new_q.load(new_q_url);
        new_q.show();
    }
}

// respond -- sequence of functions bound to click of a response
function respond() {
    var wndw = $('.slide_window:visible');
    wndw.find(".current .response").unbind('click').removeClass('clickable');
    var q = wndw.find(".current #q_id").val();
    if(q) {
        var dataStr = 'qid=' + q + '&choice=' + $(this).attr('id');
        $.getJSON('includes/processResponse.php', dataStr, function(data) {
            answerQuestion(wndw, data.tot, data.res1, data.res2);
            if(!topquestions || $('.qcontainer.next2').length) {
                if($('html').hasClass('touch')) {
                    wndw.off('swiperight').off('swipeleft');
                } else {
                    wndw.find("img.slide_arrow").unbind('click');
                    wndw.find('.qcontainer').unbind('click');
                }
                $(".submit_button").unbind('click');
                $(".cat").unbind('click');
                var newnext;
                if(topquestions || wndw.find('.qcontainer.next2').length) {
                    newnext = wndw.find('.qcontainer.next2');
                } else {
                    generateNewQuestions(1);
                    newnext = wndw.find('#new1');
                }
                setTimeout(function () { setNextQuestion(wndw, newnext); }, 2400); // auto switch
            } 
        });
    }
}

// submitNewQuestion -- invoked on (attempted) submission of new question
function submitNewQuestion(original_q) {
    var good = true;
    
    var new_q_text = $("#new_question_text").val();
    var q_err = $("#submit_new .error:first");
    if($.trim(new_q_text).length < 4) {
        good = false;
        q_err.html('Min 4 characters');
    } else if(new_q_text.length > 140) {
        q_err.html('Max 140 characters');
        good = false;
    }
    var new_q_res_a = $("textarea#res_a_text").val();
    var resa_err = $("#submit_new .error:eq(1)");
    if($.trim(new_q_res_a).length == 0) {
        good = false;
        resa_err.html('Response cannot be empty');
    } else if(new_q_res_a.length > 64) {
        good = false;
        resa_err.html('Max 64 characters');
    }
    var new_q_res_b = $("textarea#res_b_text").val();
    var resb_err = $("#submit_new .error:eq(2)");
    if($.trim(new_q_res_b).length == 0) {
        good = false;
        resb_err.html('Response cannot be empty');
    } else if(new_q_res_b.length > 64) {
        good = false;
        resb_err.html('Max 64 characters');
    }
    /*
    var new_q_cat = $("#submit_new select").val();
    if(new_q_cat == '') {
        $("#submit_new .error:eq(3)").html('No category selected');
        good = false;
    }
    */
    
    if(good) {
        var dataStr = 'q=' + new_q_text + '&a=' + new_q_res_a + '&b=' + new_q_res_b; //'&c=' + new_q_cat;
        $.getJSON('includes/submitNew.php', dataStr, function(data) {
            if(data.valid) {
                var wndw = $('.slide_window:visible');
                if(wndw.find(".current .response#left").hasClass('clickable')) { //don't copy answered or defunct questions
                    wndw.find(".qcontainer.next1").html(original_q);
                }
                swapInNewQ(wndw, new_q_text, new_q_res_a, new_q_res_b, data.q_id);                
            }
        });
    } 
}

function closeQuestionForm(wndw) {
    var currentContext = wndw.find(".qcontainer.current");
    $(".qbox_large", currentContext).css("height",'');
    $("form#submit_new", currentContext).hide();
    $("#q_or_a_large", currentContext).css("height",'').css('width','').show();   
    $("#q_or_a_large #letter", currentContext).show();
    $("#question_aux", currentContext).show(); // need to store response data in a var
    socialInit(wndw);
    $(".response", currentContext).show();
    $("#question", currentContext).html(qtext);
    $("#question p", currentContext).show();
    $(".cat").click(catSelect);
    if($('html').hasClass('touch')) {
        $('#swipe_memo', currentContext).show();
        wndw.on('swiperight', clickPrev).on('swipeleft', clickNext);
    } else {
        wndw.find(".qcontainer.prev1").bind('click', clickPrev);
        wndw.find(".qcontainer.next1").bind('click', clickNext);
        wndw.find("img.slide_arrow").hover(function() {
            var id = $(this).attr('id');
            $(this).attr('src', 'img/' + id + '_red.png');
        }, function() {
            var id = $(this).attr('id');
            $(this).attr('src', 'img/' + id + '_gray.png');
        }).css('cursor', 'pointer');
        setArrowBindings(wndw);
    }
    $(".submit_button").click(submitQuestionClick).find('.nav_item').removeClass('active-nav');
}

function swapInNewQ(w, q, r1, r2, id) {
    var currentContext = w.find(".qcontainer.current");
    
    qtext = '<p>' + q + '</p>';
    $(".response", currentContext).html(newResponse).addClass('clickable').addClass('guy1');
    $(".response#left p", currentContext).html(r1);
    $(".response#right #letter", currentContext).html('B:');
    $(".response#right p", currentContext).html(r2);
    $(".response_data", currentContext).hide();
    
    $("#social_container li", currentContext).eq('2').find('a').removeClass('short').attr('href','https://twitter.com/share?url=http%3A%2F%2Ffuimright.com%2F%3Fq%3D'+id+'&related=fuimright&via=fuimright'); // remove short class and write function to gen twitter url
    $("#like_question", currentContext).removeClass('nosub').addClass('sub').html('<input name="likeval" id="likeval" type="hidden" /><li id="like_button" class="social_btn like_vote"><img id="like" src="img/like_red.png" /><div class="share_txt">Favorite</div></li><li id="dislike_button" class="social_btn like_vote"><img id="dislike" src="img/dislike_red.png" /><div class="share_txt">Dislike</div></li>').submit(processLike).find(".like_vote").bind('click', function() {
        $('#likeval', currentContext).val($(this).attr('id')[0]);
        $("#like_question", currentContext).submit();
    });
    $("#q_id", currentContext).val(id);
    $(".response.clickable", currentContext).click(respond);
    
    // currentContext should already have viewed class
    var viewData = 'qid=' + id;
    $.get('includes/processView.php', viewData);
    viewed.push(viewData);

    // close question form as per usual
    closeQuestionForm(w);
}

function submitQuestionClick() {
    $(".submit_button").unbind('click').find('.nav_item').addClass('active-nav').click(function() {
        $("#ask_dropdown").toggle();
    });
    var wndw = $('#random'); // NOTE THIS
    var currentContext = wndw.find(".qcontainer.current");
    var prev = wndw.find(".qcontainer.prev1");
    var next = wndw.find(".qcontainer.next1");
    var original_q = '';
    if($('.response#left', currentContext).hasClass('clickable')) {
        original_q = currentContext.html();
        //$('.response', currentContext).unbind('click'); ??
    }
    $(".cat").unbind('click');
    $('.social_btn', currentContext).unbind('mouseenter').unbind('mouseleave');
    $(".response", currentContext).unbind('click');
    if($('html').hasClass('touch')) {
        wndw.off('swiperight').off('swipeleft');
    } else {
        prev.unbind('click'); next.unbind('click');
        wndw.find("img.slide_arrow").unbind('click').unbind('mouseenter').unbind('mouseleave').css('cursor', 'default');           
    }
    $('#page.slid').slideBack();
    topToRand();
    qtext = $("#question",currentContext).html();
    var hgt = $(".qbox_large", currentContext).height();
    $(".qbox_large", currentContext).height(hgt); // set heights for loading animation
    $("#q_or_a_large", currentContext).height(hgt);
    // hide all question-related stuff
    $("#question p", currentContext).hide();
    $("#question_aux", currentContext).hide();
    $('#swipe_memo', currentContext).hide();
    $("#q_or_a_large #letter", currentContext).hide();
    $(".response", currentContext).hide();
    $("#q_or_a_large", currentContext).animate({
        'width': currentContext.width() + 'px'    
    }, 500, function() {
        $(this).hide();
        $("#question",currentContext).html(submit_new_html);
        $("#close_submission", currentContext).click(function() {
            closeQuestionForm(wndw);
        });
        $("#new_question_text").keyup(function() {
            $("#submit_new .error:first").html(140 - $(this).val().length);
        });
        $("#res_a_text").keyup(function() {
            $("#submit_new .error:eq(1)").html(64 - $(this).val().length);
        });
        $("#res_b_text").keyup(function() {
            $("#submit_new .error:eq(2)").html(64 - $(this).val().length);
        });
        // bind submission of new question
        $("form#submit_new", currentContext).submit(function(e) {
            e.preventDefault;
            submitNewQuestion(original_q);
            return false;
        });
    });
}

function processLike(event) {
    event.preventDefault;
    var currentContext = $('.slide_window:visible').find(".qcontainer.current");
    var likeOrDislike = $("#likeval", currentContext).val();
    var dataStr = 'q=' + $("#q_id", currentContext).val() + '&l=' + likeOrDislike;
    $.get('includes/processLike.php', dataStr);
    if(likeOrDislike === 'l') {
        var like = $("#like", currentContext);
        like.attr('src','img/like_black.png');
        if($(window).width() > 480) {
            like.next().html('Added');
        } else {
            like.next().html('');
        }
    } else {
        var dislike = $("#dislike", currentContext);
        dislike.attr('src','img/dislike_black.png');
        if($(window).width() > 480) {
            dislike.next().html('Disliked');
        } else {
            dislike.next().html('');
        }
    }
    $(".like_vote", currentContext).unbind('click').unbind('mouseenter').unbind('mouseleave').addClass('clicked').removeClass('social_btn');
    $("#like_question", currentContext).unbind('submit').removeClass('sub').addClass('noSub');
        
    return false;
}

(function( $ ) {
    $.fn.slideBack = function () {
        this.removeClass('slid').unbind('click').animate({
            left: '0px'
        }, 400, function () {
            $('#dark').hide();
        });
    };
    $.fn.slideOut = function () {
        var $th = this;
        $('#dark').show();
        $th.addClass('slid').animate({
            left: '260px'
        }, 400, function() {
            $th.click(function () {
                $th.slideBack();
            });
        });        
    };
})( jQuery );

function navInit() {
    if($('html').hasClass('touch')) {
        var linkInnerHTML = $('a', $("li#f-ing_with")).html();
        $('a', $("li#f-ing_with")).remove();
        $("li#f-ing_with").prepend(linkInnerHTML).click(function() {
            $("ul#cat_dropdown").toggle();
        });
        $("#ask_nav_button").click(function() {
            $("#ask_dropdown").toggle();
        });
        $("#login_drop_init").click(function() {
            $("#login_dropdown").toggle();
        });
        $("#usr_options").click(function() {
            $("#usr_dropdown").toggle();
        });
    } else {
        $("#f-ing_with").hover(function() {
            $("ul#cat_dropdown").show();
        }, function() {
            $("ul#cat_dropdown").hide();
        });
        $("#ask_nav_button").hover(function() {
            $("#ask_dropdown").show();
        }, function() {
            $("#ask_dropdown").hide();
        });
        $("#merch").hover(function() {
            $("#merch_dropdown").show();
        }, function() {
            $("#merch_dropdown").hide();
        });
        $("#login").hover(function() {
            $("#login_dropdown").show();
        }, function() {
            $("#login_dropdown").hide();
        });
        $("#usr_options").hover(function() {
            $("#usr_dropdown").show();
        }, function() {
            $("#usr_dropdown").hide();
        });
    }
    $("#touch_menu_hdr").click(function() {
        $('ul#nav_list').slideToggle();
    });
    $("#nav_icon").click(function() {
        $("#mob-nav").show();
        var page = $('#page');
        if(page.hasClass('slid')) {
            page.slideBack();
        } else {
            page.slideOut();
        }
    });
}

function footerInit() {
    var foot = $('#footer');
    if(contentH > $(window).height()) {
        foot.css('position','relative');
    } else {
        foot.css('position','absolute');
    }
}

function socialInit(wndw) {
    if($('html').hasClass('no-touch')) {
        wndw.find(".current .social_btn").hoverIntent(function() {
            var img = $(this).find('img');
            img.attr('src','img/'+img.attr('id')+'_black.png');
            if($(window).width() > 480) {$('.share_txt',$(this)).animate({width: 'toggle'},300);}          
        }, function () {
            var img = $(this).find('img');
            img.attr('src','img/'+img.attr('id')+'_red.png');
            if($(window).width() > 480) {$('.share_txt',$(this)).animate({width: 'toggle'},300);}
        });
    }
}

$(document).ready(function(){
    var wndw = $('#random');
    var currentContext = wndw.find(".qcontainer.current");
    navInit();
    setSlides();
    footerInit();
    wndw.find(".qcontainer").show();
    $('.close_dialog').click(function() { $('.dim_bg').hide(); });
    $("#like_question.sub", currentContext).submit(processLike).find(".like_vote").click(function() {
        $('#likeval', currentContext).val($(this).attr('id')[0]);
        $("form#like_question", currentContext).submit();
    });
    $(".es").keydown(function () {
        $(this).prev().find('.error').html('');
    });
    socialInit(wndw);
    // when a response is clicked...
    $(".response.clickable", currentContext).click(respond);
    if(!topquestions) { // not really necessary unless topquestions is set to be the default
        var viewData = 'qid=' + $("#q_id", currentContext).val();
        $.get('includes/processView.php', viewData);
        currentContext.addClass('viewed');
        viewed.push(viewData);
    }
    setArrowBindings(wndw);
    if($('html').hasClass('touch')) {
        wndw.on('swiperight', clickPrev).on('swipeleft', clickNext);
    } else {
        wndw.find(".qcontainer.prev1").click(clickPrev); // BY DEFAULT THERE IS NO PREV...
        wndw.find(".qcontainer.next1").click(clickNext);
        wndw.find("img.slide_arrow").hover(function() {
            var id = $(this).attr('id');
            $(this).attr('src', 'img/' + id + '_red.png');
        }, function() {
            var id = $(this).attr('id');
            $(this).attr('src', 'img/' + id + '_gray.png');
        });
    }
    
    // top questions init
    $('#tqn_opts li').click(function () {
        if(!$(this).hasClass('active')) {
            $('#tqn_opts li').removeClass('active');
            $(this).addClass('active');
            topQInit($(this).index());
        }
    });
});