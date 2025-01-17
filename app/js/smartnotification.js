function SmartUnLoading() {
    $(".divMessageBox").fadeOut(300, function() {
        $(this).remove()
    }), $(".LoadingBoxContainer").fadeOut(300, function() {
        $(this).remove()
    })
}
jQuery(document).ready(function() {
    $("body").append("<div id='divSmallBoxes'></div>"), $("body").append("<div id='divMiniIcons'></div><div id='divbigBoxes'></div>")
});
var ExistMsg = 0,
    SmartMSGboxCount = 0,
    PrevTop = 0;
$.SmartMessageBox = function(o, t) {
    var e;
    o = $.extend({
        title: "",
        content: "",
        NormalButton: void 0,
        ActiveButton: void 0,
        buttons: void 0,
        input: void 0,
        inputValue: void 0,
        placeholder: "",
        options: void 0
    }, o);
    if (1, 0 == isIE8orlower() && $.sound_on) {
        var i = document.createElement("audio");
        i.setAttribute("src", $.sound_path + "messagebox.mp3"), i.addEventListener("load", function() {
            i.play()
        }, !0), i.pause(), i.play()
    }
    SmartMSGboxCount += 1, 0 == ExistMsg && (ExistMsg = 1, "<div class='divMessageBox animated fadeIn fast' id='MsgBoxBack'></div>", $("body").append("<div class='divMessageBox animated fadeIn fast' id='MsgBoxBack'></div>"), 1 == isIE8orlower() && $("#MsgBoxBack").addClass("MessageIE"));
    var s = "",
        a = 0;
    if (null != o.input) switch (a = 1, o.input = o.input.toLowerCase(), o.input) {
        case "text":
            o.inputValue = "string" === $.type(o.inputValue) ? o.inputValue.replace(/'/g, "&#x27;") : o.inputValue, s = "<input class='form-control' type='" + o.input + "' id='txt" + SmartMSGboxCount + "' placeholder='" + o.placeholder + "' value='" + o.inputValue + "'/><br/><br/>";
            break;
        case "file":
            o.inputValue = "string" === $.type(o.inputValue) ? o.inputValue.replace(/'/g, "&#x27;") : o.inputValue, s = "<input class='form-control' type='" + o.input + "' id='csv" + SmartMSGboxCount + "' /><br/><br/>";
            break;
        case "password":
            s = "<input class='form-control' type='" + o.input + "' id='txt" + SmartMSGboxCount + "' placeholder='" + o.placeholder + "'/><br/><br/>";
            break;
        case "select":
            if (null == o.options) alert("For this type of input, the options parameter is required.");
            else {
                s = "<select class='form-control' id='txt" + SmartMSGboxCount + "'>";
                for (var n = 0; n <= o.options.length - 1; n++) "[" == o.options[n] ? l = "" : "]" == o.options[n] ? (r += 1, s += l = "<option>" + l + "</option>") : l += o.options[n];
                s += "</select>"
            }
            break;
        default:
            alert("That type of input is not handled yet")
    }
    e = "<div class='MessageBoxContainer animated fadeIn fast' id='Msg" + SmartMSGboxCount + "'>", e += "<div class='MessageBoxMiddle'>", e += "<span class='MsgTitle'>" + o.title + "</span class='MsgTitle'>", e += "<p class='pText'>" + o.content + "</p>", e += s, e += "<div class='MessageBoxButtonSection'>", null == o.buttons && (o.buttons = "[Accept]"), o.buttons = $.trim(o.buttons), o.buttons = o.buttons.split("");
    var l = "",
        r = 0;
    null == o.NormalButton && (o.NormalButton = "#232323"), null == o.ActiveButton && (o.ActiveButton = "#ed145b");
    for (n = 0; n <= o.buttons.length - 1; n++) "[" == o.buttons[n] ? l = "" : "]" == o.buttons[n] ? e += l = "<button id='bot" + (r += 1) + "-Msg" + SmartMSGboxCount + "' class='btn btn-default btn-sm botTempo'> " + l + "</button>" : l += o.buttons[n];
    e += "</div>", e += "</div>", e += "</div>", SmartMSGboxCount > 1 && ($(".MessageBoxContainer").hide(), $(".MessageBoxContainer").css("z-index", 99999)), $(".divMessageBox").append(e), 1 == a && $("#txt" + SmartMSGboxCount).focus(), $(".botTempo").hover(function() {
        $(this).attr("id")
    }, function() {
        $(this).attr("id")
    }), $(".botTempo").click(function() {
        var o = $(this).attr("id"),
            e = o.substr(o.indexOf("-") + 1),
            i = $.trim($(this).text());
        if (1 == a) {
            if ("function" == typeof t) {
                var s = e.replace("Msg", ""),
                    n = $("#txt" + s).val();
                t && t(i, n)
            }
        } else "function" == typeof t && t && t(i);
        $("#" + e).addClass("animated fadeOut fast"), 0 == (SmartMSGboxCount -= 1) && $("#MsgBoxBack").removeClass("fadeIn").addClass("fadeOut").delay(300).queue(function() {
            ExistMsg = 0, $(this).remove()
        })
    })
};
var BigBoxes = 0;
$.bigBox = function(o, t) {
    var e;
    if ((o = $.extend({
            title: "",
            content: "",
            icon: void 0,
            number: void 0,
            color: void 0,
            sound: $.sound_on,
            sound_file: "bigbox",
            timeout: void 0,
            colortime: 1500,
            colors: void 0
        }, o)).sound && 0 == isIE8orlower()) {
        var i = document.createElement("audio");
        navigator.userAgent.match("Firefox/") ? i.setAttribute("src", $.sound_path + o.sound_file + ".ogg") : i.setAttribute("src", $.sound_path + o.sound_file + ".mp3"), i.addEventListener("load", function() {
            i.play()
        }, !0), i.pause(), i.play()
    }
    e = "<div id='bigBox" + (BigBoxes += 1) + "' class='bigBox animated fadeIn fast'><div id='bigBoxColor" + BigBoxes + "'><i class='botClose fa fa-times' id='botClose" + BigBoxes + "'></i>", e += "<span>" + o.title + "</span>", e += "<p>" + o.content + "</p>", e += "<div class='bigboxicon'>", null == o.icon && (o.icon = "fa fa-cloud"), e += "<i class='" + o.icon + "'></i>", e += "</div>", e += "<div class='bigboxnumber'>", null != o.number && (e += o.number), e += "</div></div>", e += "</div>", $("#divbigBoxes").append(e), null == o.color && (o.color = "#004d60"), $("#bigBox" + BigBoxes).css("background-color", o.color), $("#divMiniIcons").append("<div id='miniIcon" + BigBoxes + "' class='cajita animated fadeIn' style='background-color: " + o.color + ";'><i class='" + o.icon + "'/></i></div>"), $("#miniIcon" + BigBoxes).bind("click", function() {
        var o = $(this).attr("id"),
            t = o.replace("miniIcon", "bigBox"),
            e = o.replace("miniIcon", "bigBoxColor");
        $(".cajita").each(function(o) {
            var t = $(this).attr("id").replace("miniIcon", "bigBox");
            $("#" + t).css("z-index", 9998)
        }), $("#" + t).css("z-index", 9999), $("#" + e).removeClass("animated fadeIn").delay(1).queue(function() {
            $(this).show(), $(this).addClass("animated fadeIn"), $(this).clearQueue()
        })
    });
    var s, a = $("#botClose" + BigBoxes),
        n = $("#bigBox" + BigBoxes),
        l = $("#miniIcon" + BigBoxes);
    if (null != o.colors && o.colors.length > 0 && (a.attr("colorcount", "0"), s = setInterval(function() {
            var t = a.attr("colorcount");
            a.animate({
                backgroundColor: o.colors[t].color
            }), n.animate({
                backgroundColor: o.colors[t].color
            }), l.animate({
                backgroundColor: o.colors[t].color
            }), t < o.colors.length - 1 ? a.attr("colorcount", 1 * t + 1) : a.attr("colorcount", 0)
        }, o.colortime)), a.bind("click", function() {
            clearInterval(s), "function" == typeof t && t && t();
            var o = $(this).attr("id"),
                e = o.replace("botClose", "bigBox"),
                i = o.replace("botClose", "miniIcon");
            $("#" + e).removeClass("fadeIn fast"), $("#" + e).addClass("fadeOut fast").delay(300).queue(function() {
                $(this).clearQueue(), $(this).remove()
            }), $("#" + i).removeClass("fadeIn fast"), $("#" + i).addClass("fadeOut fast").delay(300).queue(function() {
                $(this).clearQueue(), $(this).remove()
            })
        }), null != o.timeout) {
        var r = BigBoxes;
        setTimeout(function() {
            clearInterval(s), $("#bigBox" + r).removeClass("fadeIn fast"), $("#bigBox" + r).addClass("fadeOut fast").delay(300).queue(function() {
                $(this).clearQueue(), $(this).remove()
            }), $("#miniIcon" + r).removeClass("fadeIn fast"), $("#miniIcon" + r).addClass("fadeOut fast").delay(300).queue(function() {
                $(this).clearQueue(), $(this).remove()
            })
        }, o.timeout)
    }
};
var SmallBoxes = 0,
    SmallCount = 0,
    SmallBoxesAnchos = 0;

function getInternetExplorerVersion() {
    var o = -1;
    if ("Microsoft Internet Explorer" == navigator.appName) {
        var t = navigator.userAgent;
        null != new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(t) && (o = parseFloat(RegExp.$1))
    }
    return o
}

function checkVersion() {
    var o = "You're not using Windows Internet Explorer.",
        t = getInternetExplorerVersion();
    t > -1 && (o = t >= 8 ? "You're using a recent copy of Windows Internet Explorer." : "You should upgrade your copy of Windows Internet Explorer."), alert(o)
}

function isIE8orlower() {
    var o = "0",
        t = getInternetExplorerVersion();
    return t > -1 && (o = t >= 9 ? 0 : 1), o
}
$.smallBox = function(o, t) {
    var e;
    if ((o = $.extend({
            title: "",
            content: "",
            icon: void 0,
            iconSmall: void 0,
            sound: $.sound_on,
            sound_file: "smallbox",
            color: void 0,
            timeout: void 0,
            colortime: 1500,
            colors: void 0
        }, o)).sound && 0 == isIE8orlower()) {
        var i = document.createElement("audio");
        navigator.userAgent.match("Firefox/") ? i.setAttribute("src", $.sound_path + o.sound_file + ".ogg") : i.setAttribute("src", $.sound_path + o.sound_file + ".mp3"), i.addEventListener("load", function() {
            i.play()
        }, !0), i.pause(), i.play()
    }
    e = "";
    var s = "",
        a = "smallbox" + (SmallBoxes += 1);
    (s = null == o.iconSmall ? "<div class='miniIcono'></div>" : "<div class='miniIcono'><i class='miniPic " + o.iconSmall + "'></i></div>", e = null == o.icon ? "<div id='smallbox" + SmallBoxes + "' class='SmallBox animated fadeInRight fast'><div class='textoFull'><span>" + o.title + "</span><p>" + o.content + "</p></div>" + s + "</div>" : "<div id='smallbox" + SmallBoxes + "' class='SmallBox animated fadeInRight fast'><div class='foto'><i class='" + o.icon + "'></i></div><div class='textoFoto'><span>" + o.title + "</span><p>" + o.content + "</p></div>" + s + "</div>", 1 == SmallBoxes) ? ($("#divSmallBoxes").append(e), SmallBoxesAnchos = $("#smallbox" + SmallBoxes).height() + 40) : 0 == $(".SmallBox").length ? ($("#divSmallBoxes").append(e), SmallBoxesAnchos = $("#smallbox" + SmallBoxes).height() + 40) : ($("#divSmallBoxes").append(e), $("#smallbox" + SmallBoxes).css("top", SmallBoxesAnchos), SmallBoxesAnchos = SmallBoxesAnchos + $("#smallbox" + SmallBoxes).height() + 20, $(".SmallBox").each(function(o) {
        0 == o ? ($(this).css("top", 20), heightPrev = $(this).height() + 40, SmallBoxesAnchos = $(this).height() + 40) : ($(this).css("top", heightPrev), heightPrev = heightPrev + $(this).height() + 20, SmallBoxesAnchos = SmallBoxesAnchos + $(this).height() + 20)
    }));
    var n, l = $("#smallbox" + SmallBoxes);
    null == o.color ? l.css("background-color", "#004d60") : l.css("background-color", o.color), null != o.colors && o.colors.length > 0 && (l.attr("colorcount", "0"), n = setInterval(function() {
        var t = l.attr("colorcount");
        l.animate({
            backgroundColor: o.colors[t].color
        }), t < o.colors.length - 1 ? l.attr("colorcount", 1 * t + 1) : l.attr("colorcount", 0)
    }, o.colortime)), null != o.timeout && setTimeout(function() {
        clearInterval(n);
        var o = $(this).height() + 20;
        $("#" + a).css("top");
        0 != $("#" + a + ":hover").length ? $("#" + a).on("mouseleave", function() {
            SmallBoxesAnchos -= o, $("#" + a).remove(), "function" == typeof t && t && t();
            var e = 0;
            $(".SmallBox").each(function(o) {
                0 == o ? ($(this).animate({
                    top: 20
                }, 300), e = $(this).height() + 40, SmallBoxesAnchos = $(this).height() + 40) : ($(this).animate({
                    top: e
                }, 350), e = e + $(this).height() + 20, SmallBoxesAnchos = SmallBoxesAnchos + $(this).height() + 20)
            })
        }) : (clearInterval(n), SmallBoxesAnchos -= o, "function" == typeof t && t && t(), $("#" + a).removeClass().addClass("SmallBox").animate({
            opacity: 0
        }, 300, function() {
            $(this).remove();
            var o = 0;
            $(".SmallBox").each(function(t) {
                0 == t ? ($(this).animate({
                    top: 20
                }, 300), o = $(this).height() + 40, SmallBoxesAnchos = $(this).height() + 40) : ($(this).animate({
                    top: o
                }), o = o + $(this).height() + 20, SmallBoxesAnchos = SmallBoxesAnchos + $(this).height() + 20)
            })
        }))
    }, o.timeout), $("#smallbox" + SmallBoxes).bind("click", function() {
        clearInterval(n), "function" == typeof t && t && t();
        var o = $(this).height() + 20;
        $(this).attr("id"), $(this).css("top");
        SmallBoxesAnchos -= o, $(this).removeClass().addClass("SmallBox").animate({
            opacity: 0
        }, 300, function() {
            $(this).remove();
            var o = 0;
            $(".SmallBox").each(function(t) {
                0 == t ? ($(this).animate({
                    top: 20
                }, 300), o = $(this).height() + 40, SmallBoxesAnchos = $(this).height() + 40) : ($(this).animate({
                    top: o
                }, 350), o = o + $(this).height() + 20, SmallBoxesAnchos = SmallBoxesAnchos + $(this).height() + 20)
            })
        })
    })
};