// variables for user cursor postion
var positionLeft = 0;
var positionTop = 0;
var scrollY = window.pageYOffset;
var scrollX = window.pageXOffset; 

window.addEventListener('load', function() {
    // event listener
    if ( document.addEventListener ) {
        document.addEventListener("mousemove", updateCursorPosition, false);
    } else if ( document.attachEvent ) {
        document.attachEvent("onmousemove",updateCursorPosition);
    } else {
        document.onmousemove = updateCursorPosition;
    }
    if ( window.addEventListener ) {
        window.addEventListener("scroll", updateScrollPosition);
        window.addEventListener("mousewheel", stopFollowing);
    } else if ( window.attachEvent ) {
        window.attachEvent("onscroll", updateScrollPosition);
    } else {
        window.onscroll = updateScrollPosition;
    }
});

// update user cursor position
function updateCursorPosition(x) {
    positionLeft = x.clientX;
    positionTop = x.clientY;
    updateUserPositionToDB();
}
function updateScrollPosition(x) {
    scrollY = window.pageYOffset;
    scrollX = window.pageXOffset;
    updateUserPositionToDB();
}
function updateUserPositionToDB() {
    firebase.database().ref('CursorPosition/' + studentId + '/').set({
        pX : positionLeft,
        pY : positionTop,
        sY : scrollY,
        sX : scrollX,
        WindowH : window.innerHeight,
        WindowW : Math.max(window.innerWidth, 1223),
        following : follwingFriend
    });
}


var follwingFriend = null;

// following fucntions 
function stopFollowing(){
    if (follwingFriend != null){
        follwingFriend = null;
        document.getElementById('body_frame').style.visibility = "hidden";
    }
}
function startFollwing(fid){
    follwingFriend = fid;
    document.getElementById('body_frame').style.visibility = "visible";
}
function isFollowing() {
    return follwingFriend;
}

function turnOnFollowing(fid) {
    if( follwingFriend ) {
        alert('stop Follwing');
        stopFollowing();
    } else {
        alert('start Follwing' + fid);
        startFollwing(fid);
    }
    updateUserPositionToDB();
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


