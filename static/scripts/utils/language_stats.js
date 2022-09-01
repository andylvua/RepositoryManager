// noinspection JSUnresolvedVariable

function createLegendItem(color, language, percentage) {
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        let a = document.createElement("a");
        let languageSpan = document.createElement("span");
        let percentageSpan = document.createElement("span");

        languageSpan.setAttribute("class", "language");
        percentageSpan.setAttribute("class", "percentage");
        languageSpan.innerHTML = language;
        percentageSpan.innerHTML = percentage + "%";

        circle.setAttribute("cx", "8");
        circle.setAttribute("cy", "8");
        circle.setAttribute("r", "8");
        circle.setAttribute("fill", color);
        svg.setAttribute("viewBox", "0 0 16 16");

        svg.appendChild(circle);
        a.appendChild(svg)
        a.appendChild(languageSpan)
        a.appendChild(percentageSpan)

        return a.outerHTML;
    }

function createLanguageSpan(percentage, color) {
    let span = document.createElement("span")
    span.setAttribute("class", "languages-bar__item");
    span.style.width = percentage + "%";
    span.style.background = color

    return span.outerHTML;
}

function renderLanguageStats (repositoryLanguages) {
    let languagesSpans = '';
    let languagesLegend = '';
    let otherLanguagesPercentage = 0;

    for (const [i, language] of repositoryLanguages.entries()) {
        if (i < 5) {
            let color = JSON.parse(window.localStorage.getItem("languages_colors"))[language.language];

            let languageSpan = createLanguageSpan(language.percentage, color);
            let legendItem = createLegendItem(color, language.language, language.percentage);

            languagesSpans += languageSpan;
            languagesLegend += legendItem;
        } else {
            otherLanguagesPercentage += language.percentage;
        }
    }

    if (otherLanguagesPercentage > 0) {
        let languageSpan = createLanguageSpan(other_languages_percentage, "#DCDAD4");
        let legendItem = createLegendItem("#DCDAD4", "Other", other_languages_percentage);

        languagesSpans += languageSpan;
        languagesLegend += legendItem;
    }

    return {
        languages_spans: languagesSpans,
        languages_legend: languagesLegend
    }
}

export { renderLanguageStats };
