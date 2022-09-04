const notificationButton = $(".notification_button");

(() => {
    console.log("Checking notifications state");

    if (localStorage.getItem('notifications') === "true") {
        console.log("Notifications are enabled");
        notificationButton.addClass("active");
    } else {
        console.log("Notifications are disabled");
        notificationButton.removeClass("active");
    }
})();

async function requestNotificationsPermission() {
    console.log("Awaiting notifications permission");
    let permission = await Notification.requestPermission();
    if (permission === "granted") {
        console.log("Notification permission granted.");
    }
}

async function toggleNotifications() {
    if (localStorage.getItem('notifications') === "true") {
        localStorage.setItem('notifications', "false");
        notificationButton.removeClass("active");
    } else {
        notificationButton.addClass("pending");
        await requestNotificationsPermission();
        notificationButton.removeClass("pending");

        localStorage.setItem('notifications', "true");
        notificationButton.addClass("active");
    }
}
