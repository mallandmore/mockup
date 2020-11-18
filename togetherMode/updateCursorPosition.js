var positionLeft = 0;
var positionTop = 0;
var positionScroll = window.pageYOffset;

var uid = getParameterByName('user');
var followingFlag = false;

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
} else if ( window.attachEvent ) {
    window.attachEvent("onscroll", updateScrollPosition);
} else {
    window.onscroll = updateScrollPosition;
}

if ( window.addEventListener ){
    window.addEventListener("mousewheel", stopFollowing);
}

function stopFollowing(){
    followingFlag = false;
}

function switchFollowing() {
    if( followingFlag ) {
        alert('stop Follwing');
    } else {
        alert('start Follwing');
    }
    followingFlag = !followingFlag;
    updateUserCursorData();
}

function isFollowing() {
    return followingFlag;
}


function updateCursorPosition(x) {
    positionLeft = x.clientX;
    positionTop = x.clientY;
    updateUserCursorData();
}

function updateScrollPosition(x) {
    positionScroll = window.pageYOffset;
    updateUserCursorData();
}

function updateUserCursorData() {
    firebase.database().ref('XY/' + uid + '/').set({
        X : positionLeft,
        Y : positionTop,
        S : positionScroll,
        WindowH : window.innerHeight,
        following : followingFlag
    });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
