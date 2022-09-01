import {renderRepositories} from "./card_renderer.js";

let notify = (localStorage.getItem("notifications") === "true");

$.get("../static/templates/repository_card.html", function (data) {
    console.log("Card template loaded");
    window.localStorage.setItem("card_template", data);
});
$.get("../static/templates/card_skeleton.html", function (data) {
    console.log("Card skeleton template loaded");
    window.localStorage.setItem("card_loading_template", data);
});
$.getJSON("../static/assets/languages_colors.json", function(colors_json) {
    window.localStorage.setItem("languages_colors", JSON.stringify(colors_json));
    console.log("Languages colors loaded");
});


window.copyGitURL = function copyGitURL(this_element) {
    let copyButton = $(this_element);
    let gitUrl = copyButton.attr("value");
    let popup = copyButton.find($("span"));
    let copyButtonIcon = copyButton.find($("img"));

    copyButton.css("outline", "#1a812e solid 1px");
    setTimeout(function() {
        copyButton.css("outline", "none");
    } , 2000);

    popup.toggleClass("show");
    setTimeout(function() {
        popup.toggleClass("show");
    } , 2000);

    copyButtonIcon.attr("src", "../static/images/check.svg");
    navigator.clipboard.writeText(gitUrl).then(() => {
        console.log("Copied to clipboard");
    });
}


window.deleteRepository = function deleteRepository(url) {
    $.ajax({
        url: "/repositories",
        type: "DELETE",
        data: {
            'url': url
        },
        success: function (response) {
            console.log(response);
            if (notify) {
                new Notification(response);
            }
            renderRepositories();
        }
    });
}
