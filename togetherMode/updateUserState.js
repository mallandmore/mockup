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
    updateUserDataToDB();
}
function updateScrollPosition(x) {
    scrollY = window.pageYOffset;
    scrollX = window.pageXOffset;
    updateUserDataToDB();
}
function updateUserDataToDB() {
    firebase.database().ref('CursorPosition/' + studentId + '/').set({
        pX : positionLeft,
        pY : positionTop,
        sY : scrollY,
        sX : scrollX,
        WindowH : window.innerHeight,
        WindowW : Math.max(window.innerWidth, 1223),
        following : followingFriend
    });
}


var followingFriend = null;

// following fucntions 
function stopFollowing(){
    if (followingFriend == null) return;

    followingFriend = null;
    followingButton.style.pointerEvents = "inherit"
    followingButton.innerHTML = "Go to " + friendName;

    document.getElementById('body_frame').style.visibility = "hidden";
    updateUserDataToDB();
}
function startFollowing(fid){
    followingFriend = fid;
    followingButton.style.pointerEvents = "none"
    followingButton.innerHTML = "Going around with " + friendName + " now ";

    document.getElementById('body_frame').style.borderColor = "blue";
    document.getElementById('body_frame').style.visibility = "visible";
    updateUserDataToDB();
}
function isFollowing() {
    return followingFriend;
}



function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


