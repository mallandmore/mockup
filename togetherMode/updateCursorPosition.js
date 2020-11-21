// variables for user cursor postion
var positionLeft = 0;
var positionTop = 0;
var scrollY = window.pageYOffset;
var scrollX = window.pageXOffset; 

// get uid
var uid = getParameterByName('uid');

// true if user following someone
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
    window.addEventListener("mousewheel", stopFollowing);
} else if ( window.attachEvent ) {
    window.attachEvent("onscroll", updateScrollPosition);
} else {
    window.onscroll = updateScrollPosition;
}


// following fucntions 
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

// update user cursor position
function updateCursorPosition(x) {
    positionLeft = x.clientX;
    positionTop = x.clientY;
    updateUserCursorData();
}

function updateScrollPosition(x) {
    scrollY = window.pageYOffset;
    scrollX = window.pageXOffset;
    updateUserCursorData();
}

function updateUserCursorData() {
    firebase.database().ref('CursorPosition/' + uid + '/').set({
        pX : positionLeft,
        pY : positionTop,
        sY : scrollY,
        sX : scrollX,
        WindowH : window.innerHeight,
        WindowW : window.innerWidth,
        following : followingFlag
    });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
