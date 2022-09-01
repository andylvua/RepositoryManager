let addRepositoryInput = document.querySelector('#repository_url') ||
    document.querySelector('#repository_name');
let descriptionInput = document.querySelector('#description');

let notify = (localStorage.getItem('notifications') === "true");

// Input validation
addRepositoryInput.addEventListener('input' , function () {
    if (addRepositoryInput.validity.patternMismatch) {
        $('#repository_url').css('outline', '2px solid #AB0909FF');
        addRepositoryInput.setCustomValidity(
            "Looks like it's not a GitHub repository URL. It must start with https://github.com. Try again.");
        addRepositoryInput.reportValidity();
    } else {
        $('#repository_url').css('outline', '2px solid #1f6feb');
        addRepositoryInput.setCustomValidity('');
        addRepositoryInput.reportValidity();
    }
});

descriptionInput.addEventListener('input' , function () {
    if (descriptionInput.validity.patternMismatch) {
        $('#description').css('outline', '2px solid #AB0909FF');
        descriptionInput.setCustomValidity(
            "Description is too long. It must be less than 150 characters.");
        descriptionInput.reportValidity();
    } else {
        $('#description').css('outline', '2px solid #1f6feb');
        descriptionInput.setCustomValidity('');
        descriptionInput.reportValidity();
    }
});

function redirectToHome() {
   window.location.href = '/';
}

$('#add_form').submit( function() {
    let url = $('#repository_url').val();
    let description = $('#description').val();

    console.log("Form submitted: " + url);
    $.ajax({
        url: '/repositories',
        type: 'POST',
        data: {
            'url': url,
            'description': description
        },
        success: function (response) {
            console.log(response);
            if (notify) {
                new Notification(response);
            }
            return redirectToHome();
        },
        error: function (error) {
            console.log(error.responseText);
            $('#repository_url').css('outline', '2px solid #AB0909FF');
            addRepositoryInput.setCustomValidity(error.responseText);
            addRepositoryInput.reportValidity();
        }
    });

    return false;
});

$('#edit_form').submit( function() {
    let queryString = window.location.search;
    const parameters = new URLSearchParams(queryString)

    let url = parameters.get('url');
    let description = $('#description').val();

    $.ajax({
        url: '/repositories',
        type: 'PUT',
        data: {
            'url': url,
            'description': description
        },
        success: function (response) {
            console.log(response);
            if (notify) {
                new Notification(response);
            }
            return redirectToHome();
        },
        error: function (error) {
            console.log(error.responseText);
        }
    });

    return false;
});
