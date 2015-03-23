(function ($) {
    var editorScss, displayCss, snippetData, rootPath;

    $(document).ready(function () {
        rootPath = $("#rootPath").val();
        initData();
        setButtonEvents();
    });

    function initData(callback) {
        var url = rootPath + "public/snippets/snippets.json";
        $.ajax({
            url: url,
            dataType: "json",
            type: "GET",
            success: function (response) {
                if (response) {
                    snippetData = response;
                    local("scssSnippets", response);
                    setEditors();
                    setChangedEvents();
                    var snippetId = getCurrentSnippetId();
                    setSnippet(snippetId);
                    setNavigationEvents();
                    setMenuLinks();
                }
                if (typeof callback === "function") {
                    callback();
                }
            },
            error: function (e) {
                console.log("set data");
                console.error(e);
            }
        });
    }

    function setButtonEvents() {
        $("#openSlide").on("click", function() {
            openPopup();
        });

        $(".popup-close-button").on("click", function() {
            closePopup();
        });

        $("#overlay").on("click", function() {
            closePopup();
        });

        $("#open-menu-button").on("click", function () {
            var $menu = $(".menu"),
                $menuList = $("#menu-index").find(".menu-index-list");
            if ($menu.hasClass("open")) {
                $menu.removeClass("open");
            } else {
                $menu.addClass("open");
                $menuList.find(".current a").focus();
            }
        });
    }

    function openPopup() {
        $("#overlay").fadeIn(100, function() {
            $("#popup").fadeIn();
            setColors();
        });
    }


    function closePopup() {
        $("#popup").fadeOut(100, function() {
            $("#overlay").fadeOut();
        });
    }

    function setColors() {
        $(".color-block").each(function () {
            var $this = $(this), color = "#" + $this.data("color");
            $this.css({ "background-color":  color});
            $this.text($this.data("label") + " = " + color);
        });
    }

    function getCurrentSnippetId() {
        return parseInt($("#snippetId").val());
    }

    function setEditors() {
        editorScss = ace.edit(document.getElementById("editorScss"));
        editorScss.setTheme("ace/theme/clouds");
        editorScss.getSession().setMode("ace/mode/scss");
        editorScss.renderer.setShowGutter(false);

        displayCss = ace.edit(document.getElementById("displayCss"));
        displayCss.setTheme("ace/theme/clouds");
        displayCss.getSession().setMode("ace/mode/css");
        displayCss.renderer.setShowGutter(false);
        displayCss.setReadOnly(true);
        updateOutput();
    }

    function setChangedEvents() {
        editorScss.getSession().on("change", function () {
            waitUpdateOutput();
        });
        displayCss.getSession().on("changeAnnotation", function () {
            var annotations = displayCss.getSession().getAnnotations();
            if (annotations.length > 0) {
                var errorMessage = "";
                annotations.map(function (obj) {
                    errorMessage += obj.text + " ";
                });
                $(".errorMessage").text(errorMessage);
            } else if (!$(".error-text").is(":visible")) {
                $(".errorMessage").html("&nbsp;");
            }
        });
    }

    function setNavigationEvents() {
        var snippetId = getCurrentSnippetId(),
            $prevButton = $("#navButtonPrev"),
            $nextButton = $("#navButtonNext"),
            dataArr = getSnippetData();
        if (snippetId > 0) {
            $prevButton.removeClass("navButtonHide");
        }
        if (snippetId < dataArr.length - 1) {
            $nextButton.removeClass("navButtonHide");
        }

        $prevButton.on("click", function (e) {
            e.preventDefault();
            var href = $(this).attr("href");
            animateOutPrev(function () {
                window.location = href;
            });
        });

        $nextButton.on("click", function (e) {
            e.preventDefault();
            var href = $(this).attr("href");
            animateOut(function () {
                window.location = href;
            });
        });
    }

    function setMenuLinks() {
        var $menu = $("#menu-index").find(".menu-index-list"),
            html = "",
            dataArr = getSnippetData(),
            count = 0,
            snippetId = getCurrentSnippetId();

        for (var key in dataArr) {
            var snippet = dataArr[key], classVal = "";
            console.log(key, snippetId);
            if (key == snippetId) {
                classVal = " class='current' ";
            }
            html += "<li" + classVal + "><a href='" + rootPath  + count++ + "'>" + $("<p>" + snippet.title + "</p>").text() + "</a></li>";
        }

        $menu.html(html);
    }

    function setSnippet(snippetNumber) {
        snippetNumber = snippetNumber || 0;
        if (snippetNumber >= 0) {
            var dataArr = getSnippetData();
            snippetNumber = snippetNumber < dataArr.length - 1 ? snippetNumber : dataArr.length - 1;
            var data = dataArr[snippetNumber];
            $("#descriptionTitle").html(data.title);
            $("#descriptionText").html(data.desc);
            var fileName = data.ask;
            if ($("#isSolution").val() === "true" && data.ans) {
                fileName = data.ans;
            }
            $.get(rootPath + "public/snippets/css/" + fileName, function (res) {
                editorScss.setValue(res, 1);
                waitUpdateOutput();
                animateIn();
            });

            if (!data.ans) {
                $("#navButtonAnser").addClass("navButtonHide");
            }

            if (data.slide) {
                $(".description-text").addClass("with-button");
                $.get(rootPath + "public/snippets/html/" + data.slide, function (res) {
                    var $page = $(res);
                    var title = $page.find("#title").html();
                    var content = $page.find("#content").html();
                    $("#popup-title").html(title);
                    $("#popup-content").html(content.replace(/{ROOT}/g, rootPath).replace(/{NEXT_HREF}/g, $("#navButtonNext").attr("href")));
                    $("#openSlide").fadeIn();
                    
                    if (data.openFirst) {
                        if ($("#isSolution").val() !== "true") {
                            openPopup();
                        }
                    } else {
                        $("#navButtonNext").addClass("check-slide");
                    }
                });
            }
        }
    }

    function animateIn(callback) {
        $("#animateWrapper").velocity({
            left: 0,
            top: 0,
            opacity: 1
        }, 200, function () {
            $(".navButtons").velocity({ opacity: 1 }, 50, callback);
        });
    }

    function animateOut(callback) {
        $("#animateWrapper").velocity({
            left: "10px",
            top: "10px",
            opacity: 0
        }, 200, function() {
            $(".navButtons").velocity({ opacity: 0 }, 50, callback);
        } );
    }

    function animateOutPrev(callback) {
        $("#animateWrapper").velocity({
            left: "-10px",
            top: "10px",
            opacity: 0
        }, 200, function () {
            $(".navButtons").velocity({ opacity: 0 }, 50, callback);
        });
    }

    function getSnippetData() {
        if (typeof snippetData === "object") {
            return snippetData.snippets;
        }
        else if (typeof local("scssSnippets") === "object") {
            snippetData = local("scssSnippets");
            return snippetData.snippets;
        }
        return undefined;
    }

    function waitUpdateOutput() {
        clearTimeout(window.waitUpdateOutput);
        window.waitUpdateOutput = setTimeout(function () {
            updateOutput();
        }, 200);
    }

    function updateOutput() {
        $.ajax({
            url: rootPath + "style/getcss",
            dataType: "json",
            type: "POST",
            data: {
                scss: encodeURIComponent(editorScss.getValue())
            },
            success: function (response) {
                if (response) {
                    $(".error-text").hide();
                    if (response.success) {
                        displayCss.setValue(response.css, 1);
                    } else {
                        $(".errorMessage").html(response.css);
                        $(".error-text").fadeIn(200);
                    }
                }
            },
            error: function (e) {
                console.error(e);
            }
        });
    }

    function local(key, value) {
        if (window.localStorage) {
            if (value === undefined) {
                return key in localStorage ? JSON.parse(localStorage[key]) : undefined;
            } else {
                localStorage[key] = JSON.stringify(value);
                return value;
            }
        }
        return undefined;
    }
})(jQuery);
