// variables for user cursor postion
var positionLeft = 0;
var positionTop = 0;
var scrollY = window.pageYOffset;
var scrollX = window.pageXOffset; 

var followingFriend;

function checkPreviousFollowingState(){
    firebase.database().ref('/data/' + getParameterByName('studentId') + '/following').once('value').then(function(snapshot){
        followingFriend = snapshot.val();
    });
    console.log(followingFriend);
    if (followingFriend != null) {
        // alert(followingFriend);
        // console.log(followingFriend);
        startFollowing(followingFriend);
    }
}

function addUserMovementListener(){
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
}



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
    firebase.database().ref('/data/' + studentId + '/position/').set({
        pX : positionLeft,
        pY : positionTop,
        sY : scrollY,
        sX : scrollX,
        WindowH : window.innerHeight,
        WindowW : Math.max(window.innerWidth, 1223),
    });
}
function updateUserFollowingDB(){
    firebase.database().ref('/data/' + studentId + '/following/').set(followingFriend);
}


// following fucntions 
function stopFollowing(){
    if (followingFriend == null) return;

    followingFriend = null;
    followingButton.style.visibility = 'visible';

    followingButton.innerHTML = "Go to " + friendName;

    document.getElementById('status').style.visibility = 'hidden';
    document.getElementById('statusRemark').style.visibility = 'hidden';
    document.getElementById('body_frame').style.visibility = "hidden";
    updateUserFollowingDB();
}
function startFollowing(fid){
    followingFriend = fid;

    followingButton.style.visibility = 'hidden';

    document.getElementById('status').innerHTML = 'Go around with ' + friendName + ' now';
    document.getElementById('status').style.background = '#4580ff';
    document.getElementById('status').style.visibility = 'visible';
    document.getElementById('statusRemark').style.visibility = 'visible';
    document.getElementById('body_frame').style.borderColor = "#4580ff";
    document.getElementById('body_frame').style.visibility = "visible";
    updateUserFollowingDB();
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


