(async () => {
    console.log("Awaiting notifications permission");
    let permission = await Notification.requestPermission();
    if (permission === "granted") {
        console.log("Notification permission granted.");
    }
})();

checkNotifications()

function checkNotifications() {
    console.log("Checking notifications state");

    if (localStorage.getItem('notifications') === "true") {
        $(".notification_button").addClass("active");
    } else {
        $(".notification_button").removeClass("active");
    }
}

function toggleNotifications() {
    if (localStorage.getItem('notifications') === "true") {
        localStorage.setItem('notifications', "false");
        $(".notification_button").removeClass("active");
    } else {
        localStorage.setItem('notifications', "true");
        $(".notification_button").addClass("active");
    }
}
