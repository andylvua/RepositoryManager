// noinspection JSUnresolvedVariable

import {animate} from "./utils/animation.js";
import {renderLanguageStats} from "./utils/language_stats.js";
import {Selector, fillSelectors} from "./utils/fill_selectors.js";

window.refreshRepositories = function refreshRepositories() {
    renderRepositories();
}

let repositoriesContainer = $('.repositories-container');


(async () => {
    repositoriesContainer.empty();
    renderRepositories();
})();

async function renderCardSkeletons() {
    let repositoriesCount = 0;

    $.ajax({
        url: 'repositories_count',
        type: 'GET',
        success: function(data) {
            repositoriesCount = data;
            console.log("Repositories found: " + repositoriesCount);

            let cardLoadingTemplate = window.localStorage.getItem("card_loading_template");
            cardLoadingTemplate = cardLoadingTemplate.repeat(repositoriesCount);
            animate(repositoriesContainer, cardLoadingTemplate, 300);
        }
    });
}

let repositories = [];

function renderRepositories() {
    repositoriesContainer.fadeOut(200, function () {
        repositoriesContainer.empty();
    });

    renderCardSkeletons().then(() => {
        $.ajax({
                url: '/repositories',
                type: 'GET',
                success: function(data) {
                    repositories = data;
                    console.log("Loaded repositories: " + repositories);

                    appendCards("all", "all", true);
                }
        });
    });
}

function renderCards(author = "all", language = "all") {
    console.log("Rendering cards");

    globalThis.authors = new Set();
    globalThis.languages = new Set();

    let cardsHTML = '';

    repositories.forEach(function (repository) {
        let card = window.localStorage.getItem("card_template");

        let repositoryLanguages = repository.languages.map(language => language.language);

        authors.add(repository.author);
        repositoryLanguages.forEach(language => languages.add(language));

        if (author !== "all" && repository.author !== author) {
            return;
        }
        if (language !== "all" && !repositoryLanguages.includes(language)) {
            return;
        }

        repository.description = (repository.description === "") ? "No description provided." : repository.description;

        let languageStats = renderLanguageStats(repository.languages);

        card = card.replace(/{{ repository_url }}/g, repository.repository_url);
        card = card.replace(/{{ repository_name }}/g, repository.repository_name);
        card = card.replace(/{{ author }}/g, repository.author);
        card = card.replace(/{{ avatar_url }}/g, repository.avatar_url);
        card = card.replace(/{{ download_url }}/g, repository.download_url);
        card = card.replace(/{{ languages }}/g, languageStats.languages_spans);
        card = card.replace(/{{ languages_legend }}/g, languageStats.languages_legend);
        card = card.replace(/{{ description }}/g, repository.description);
        card = card.replace(/{{ stars }}/g, repository.stars);
        card = card.replace(/{{ forks }}/g, repository.forks);
        card = card.replace(/{{ created_at }}/g, repository.created_at);
        card = card.replace(/{{ updated_at }}/g, repository.updated_at);

        cardsHTML += card;
    });

    return cardsHTML;
}

function appendCards(author = "all", language = "all", updateSelectors = false) {

    let cardsHTML = renderCards(author, language);

    animate(repositoriesContainer, cardsHTML, 300, function () {
        if (cardsHTML === "") {
            animate(
                repositoriesContainer, "<h3 class='text-center'>No repositories found</h3>", 300
            );
        }
    });



    if (updateSelectors) {
        let selectors = [
            new Selector($('#authors-selector'), authors, "authors"),
            new Selector($('#languages-selector'), languages, "languages")
        ];

        fillSelectors(selectors);
    }
    console.log("Repositories loaded. Cards updated.");
}


let authorsSelector = document.getElementById("authors-selector");
let languagesSelector = document.getElementById("languages-selector");

if (authorsSelector) {
    authorsSelector.addEventListener("change", function () {
        let selectedAuthor = authorsSelector.value;
        let selectedLanguage = languagesSelector.value;

        appendCards(selectedAuthor, selectedLanguage);
    });
}

if (languagesSelector) {
    languagesSelector.addEventListener("change", function () {
        let selectedAuthor = authorsSelector.value;
        let selectedLanguage = languagesSelector.value;

        appendCards(selectedAuthor, selectedLanguage);
    });
}

export { renderRepositories }