class Selector {
    constructor(selector, value, name) {
        this.selector = selector;
        this.value = value;
        this.name = name;
    }
}

function fillSelectors(selectors) {
    selectors.forEach(selector => {
        selector.selector.empty();
        selector.selector.append(new Option("All " + selector.name, "all"));
        for (let item of selector.value) {
            selector.selector.append(new Option(item, item));
        }
    });
}

export { Selector, fillSelectors };
