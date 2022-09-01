const repositories_container = document.getElementById("repositories-container");
const cards = document.getElementsByClassName("card");

let sortable = new Sortable(repositories_container, {
    animation: 500,
    easing: "cubic-bezier(0.860,  0.000, 0.070, 1.000)",
    ghostClass: "sortable-ghost",
    chosenClass: "sortable-chosen",
    dragClass: "sortable-drag",
    disabled: true,
    dragoverBubble: false,
    "onChoose": function () {
        toggleCardDraggable();
    },
    "onUnchoose": function () {
        toggleCardDraggable();
    }
});

function updateCardsOrder() {
    let cards = document.getElementsByClassName("card");
    let order = {};
    for (let i = 0; i < cards.length; i++) {
        order[(cards[i].id)] = i;
    }

    saveCardsOrder(order);
}

function saveCardsOrder(order) {
    $.ajax(
        {
            url: '/repositories/update_order',
            type: 'POST',
            data: {
                'order': JSON.stringify(order)
            }
        }
    )
}

function reorderRepositories() {
    let isEnabled = sortable.option("disabled");
    sortable.option("disabled", !isEnabled);

    $(".reorder_button").toggleClass("reorder_button_active");
    toggleCardDraggable();

    if (!isEnabled) {
        $(".saved_prompt").css("display", "flex").hide().fadeIn(300, function() {
            $(this).delay(2000).fadeOut(300);
        });

        updateCardsOrder();
    }
}

function toggleCardDraggable() {
    for (let card of cards) {
        card.classList.toggle("card-draggable");
    }
}
