// const defaultLink = 'file:///Users/oooo/Documents/GitHub/mockup/';
// const defaultLink = 'file:///C:/Users/qkek0/Documents/GitHub/mockup/';

// const defaultLink = 'file:///C:/Users/SketchLab/Documents/GitHub/mockup/';
const defaultLink = 'https://mallandmore.github.io/mockup/';

// variables for user cursor postion


var positionLeft = 0;
var positionTop = 0;
var scrollY = window.pageYOffset;
var scrollX = window.pageXOffset; 

var followingFriend;

function checkPreviousFollowingState(){
    firebase.database().ref('/data/' + getParameterByName('studentId') + '/following/').once('value').then(function(snapshot){
        followingFriend = snapshot.val();
        // console.log(followingFriend);
        checkit(followingFriend);
    });
    function checkit(fid){
        if (fid != null) {
            startFollowing(fid);
        }
    }
}

function addUserMovementListener(){

    updateUserUrlDB(location.href.split('?')[0]);
    checkPreviousFollowingState();

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
    updateUserUrlDB(location.href.split('?')[0]);
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
function updateUserUrlDB(link){
    firebase.database().ref('/data/' + studentId + '/url').set(link);
}


// following fucntions 
function stopFollowing(){
    // alert(followingFriend);
    if (followingFriend == null) return;

    followingFriend = null;
    document.getElementById('followingButton').innerHTML = "Go to " + friendName;
    document.getElementById('followingButton').style.visibility = 'visible';

    document.getElementById('status').style.visibility = 'hidden';
    document.getElementById('statusRemark').style.visibility = 'hidden';
    document.getElementById('body_frame').style.visibility = "hidden";
    updateUserFollowingDB();
    reloadForPrivatePage();
}
function startFollowing(fid){
    if(followingFriend != fid){
        toastr.info("Start to following " + friendName);
        reloadForPrivatePage();
    }
    followingFriend = fid;

    document.getElementById('followingButton').style.visibility = 'hidden';
    document.getElementById('status').innerHTML = 'Go around with ' + friendName + ' now';
    document.getElementById('status').style.background = '#4580ff';
    document.getElementById('status').style.visibility = 'visible';
    document.getElementById('statusRemark').style.visibility = 'visible';
    document.getElementById('body_frame').style.borderColor = "#4580ff";
    document.getElementById('body_frame').style.visibility = "visible";
    updateUserFollowingDB();
}
function isFollowing() {
    return (followingFriend != null);
}

function reloadForPrivatePage(){
    var bagPage = defaultLink + "shoppingBag.html";
    if (location.href.split('?')[0] == bagPage){
        window.location.href = bagPage + '?groupId=' + groupId + '&studentId=' + studentId ;
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function goToLink(linkid) {
    if(curKeyisC){
        return;
    }
    if(isFollowing()){
        stopFollowing();
    }
    var newPage = defaultLink + linkid;
    updateUserUrlDB(newPage);
    window.location.href = newPage + '?groupId=' + groupId + '&studentId=' + studentId ;
}