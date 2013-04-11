// used in dashboard.ejs

// handle home tab click
$("#home_table").click(function () {
    $("#main-body").load("/partials/home");
});

// handle chat tab click
$("#chat_table").click(function () {
    $("#main-body").load("/partials/search");
});

// handle statistics tab click
$("#statistics_table").click(function () {
    $("#main-body").load("/partials/statistics");
});

// load initial content of main body
$("#main-body").load("/partials/home");

// load friend list
function loadFriendList() {
    $('#friends-container').load('/partials/friends');
}

var friendManager = {
    timerId: false,
    startTimer: function () {
        if (this.timerId === false) {
            this.timerId = window.setInterval(loadFriendList, 10000);
            // load 1st time right now
            loadFriendList();
        }
    },
    stopTimer: function () {
        if (this.timerId !== false) {
            window.clearInterval(this.timerId);
            this.timerId = false;
        }
    }
}

// start auto refresh friends list
friendManager.startTimer();

$("#button-modal-abuse").click(function () {
    toastr.success('Success! We received your request.');
});

$("#button-modal-support").click(function () {
    toastr.success('Success! We received your request.');
});