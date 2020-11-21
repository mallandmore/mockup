// variables for user cursor postion
var positionLeft = 0;
var positionTop = 0;
var scrollY = window.pageYOffset;
var scrollX = window.pageXOffset; 

// get uid
var uid = getParameterByName('uid');

// true if user following someone
var friend = null;

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
    friend = null;
    document.getElementById('body_frame').style.visibility = "hidden";
}

function startFollwing(fid){
    friend = fid;
    document.getElementById('body_frame').style.visibility = "visible";
}

function turnOnFollowing(fid) {
    if( friend ) {
        alert('stop Follwing');
        stopFollowing();
    } else {
        alert('start Follwing' + fid);
        startFollwing(fid);
    }
    updateUserCursorData();
}

function isFollowing() {
    return friend;
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
        WindowW : Math.max(window.innerWidth, 1223),
        following : friend
    });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

window.onresize = function() {
    frame.style.width = Math.max(window.innerWidth, 1223)-23;
}