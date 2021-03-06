var togetherModeState;
var currentRequestKey;
var myContentsWidth = 1200; // min 1200 (default width)
var prevTogetherModeState = null;

// shopping together mode
window.addEventListener('load', function() {
    var startTogetherBtn = document.getElementById('startTogetherButton');
    if (startTogetherBtn.addEventListener) {
        startTogetherBtn.addEventListener("click", manageTogetherMode, false);
    }
    else if (startTogetherBtn.attachEvent) {
        startTogetherBtn.attachEvent('onclick', manageTogetherMode);
    }
});


function manageTogetherMode(){
    const myTogetherModeDB = firebase.database().ref('/'+ groupId + '/friends/' + studentId + '/togetherModeState/');
    const friendTogetherModeDB = firebase.database().ref('/'+ groupId + '/friends/' + friendId + '/togetherModeState/');
    const messengerDB = firebase.database().ref('/' + groupId).child('messenger');

    // quit together mode
    if (togetherModeState == 'on') {
        stopFollowing();

        // send a report to me that together mode is off.
        messengerDB.push({
            type: "shopping_together_end"
        });

        // reset the states
        myTogetherModeDB.set('off');
        friendTogetherModeDB.set('off');
    }

    // cancel the request
    else if (togetherModeState == 'waiting') {
        // reset my state
        myTogetherModeDB.set('off');
        // reset button
        // startTogetherButton.style.background = 'white';
        // startTogetherButton.style.color = '#444444';
        startTogetherButton.innerHTML = "Shopping together with " + friendName;

        // cancel request
        messengerDB.child(currentRequestKey).set({
            sender: studentId,
            receiver: friendId,
            type: "shopping_together_cancel"
        });
    }

    // send requset for together mode
    else if (togetherModeState == 'off') {

        myTogetherModeDB.set('waiting');
        // startTogetherButton.style.background = 'white';
        // startTogetherButton.style.color = '#444444';
        startTogetherButton.innerHTML = 'Cancle the request to '+ friendName;

        // send a request
        currentRequestKey = messengerDB.push({
            sender: studentId,
            receiver: friendId,
            type: "shopping_together_request"
        }).key;
    }
}


function startTogetherMode() {
    // updateUserDataToDB();

    traceFriendData(friendId);

    // show cursor
    friendCursor.style.visibility = 'visible';

    // change button text
    startTogetherButton.innerHTML = "Quit together mode";

    // show go-to function
    if(!isFollowing()) {
        followingButton.innerHTML = "Go to " + friendName;
        followingButton.style.visibility = 'visible';
    }
}
function quitTogetherMode() {
    // quit following mode
    stopFollowing();
    body_frame.style.visibility = 'hidden';
    document.getElementById('status').style.visibility = 'hidden';
    document.getElementById('statusRemark').style.visibility = 'hidden';
    

    // updateUserDataToDB();

    stopTraceFriendData(friendId);

    // hide cursor
    friendCursor.style.visibility = 'hidden';

    // change button text
    startTogetherButton.innerHTML = "Shopping together with " + friendName;
    // hide go-to function
    followingButton.style.visibility = 'hidden';

}


function traceTogetherModeState() { // always on
    const myTogetherModeDB = firebase.database().ref('/'+ groupId + '/friends/' + studentId + '/togetherModeState/');
    const friendTogetherModeDB = firebase.database().ref('/'+ groupId + '/friends/' + friendId + '/togetherModeState/');
    const messengerDB = firebase.database().ref('/' + groupId).child('messenger');

    myTogetherModeDB.on('value', function(state){
        togetherModeState = state.val();

        if( togetherModeState == 'off') {
            quitTogetherMode();
            if(prevTogetherModeState != 'off' && prevTogetherModeState != null ){
                toastr.success("Shopping with " + friendName +" is over.", "" , {"iconClass": 'customer-info'});
            }
            prevTogetherModeState = 'off';
        }
        else if ( togetherModeState == 'waiting' ) {
            prevTogetherModeState = 'waiting';
        }
        else if ( togetherModeState == 'on') {
            startTogetherMode();
            if(prevTogetherModeState != 'on' && prevTogetherModeState != null ){
                toastr.success("Shopping together with "+ friendName +"!" , "" , {"iconClass": 'customer-info'});
            }
            prevTogetherModeState = 'on';
        }
        else if ( togetherModeState.split(":")[0] == 'accept' ) {
            var requestKey = togetherModeState.split(":")[1];

            // send a report for me (receiver)
            messengerDB.child(requestKey).set({
                sender: studentId,
                receiver: friendId,
                type: "shopping_together_accept"
            });
            // send a result report that enjoy shopping together (both)
            messengerDB.push({
                type: "shopping_together_start"
            });

            // change state to start together mode
            myTogetherModeDB.set('on');
            friendTogetherModeDB.set('on');
        }
        else if ( togetherModeState.split(":")[0] == 'reject' ) {
            var requestKey = togetherModeState.split(":")[1];

            // send a report for me (receiver)
            messengerDB.child(requestKey).set({
                sender: studentId,
                receiver: friendId,
                type: "shopping_together_reject"
            });

            // change state to stop together mode
            myTogetherModeDB.set('off');
            friendTogetherModeDB.set('off');
        }
    });
}


// -- trace for following mode --
var friendPositionX = 300;
var friendPositionY = 300;
var friendScrollY = 0;
var friendScrollX = 0;
var friendWindowH = 0;
var friendWindowW = 0;
var friendIsFollowing = null;
var friendLink = null;

function stopTraceFriendData(fid) {
    firebase.database().ref('/data/' + fid + '/position/pX/').off('value');
    firebase.database().ref('/data/' + fid + '/position/pY/').off('value');
    firebase.database().ref('/data/' + fid + '/position/sX/').off('value');
    firebase.database().ref('/data/' + fid + '/position/sY/').off('value');
    firebase.database().ref('/data/' + fid + '/position/WindowH/').off('value');
    firebase.database().ref('/data/' + fid + '/position/WindowW/').off('value');
    firebase.database().ref('/data/' + studentId + '/position/WindowW/').off('value');
    firebase.database().ref('/data/' + fid + '/following/').off('value');
    firebase.database().ref('/data/' + fid + '/url/').off('value');
}

function traceFriendData(fid){
    // alert(fid);
    // get realtime data from firebase
    firebase.database().ref('/data/' + fid + '/position/pX/').on('value', function(posX){
        friendPositionX = posX.val() - friendWindowW / 2 + myContentsWidth / 2;
        renderFriendCursor();
    });
    firebase.database().ref('/data/' + fid + '/position/pY/').on('value', function(posY){
        friendPositionY = posY.val();
        renderFriendCursor();
    });
    firebase.database().ref('/data/' + fid + '/position/sX/').on('value', function(scrX){
        friendScrollX = scrX.val();
        renderFriendCursor();
    });
    firebase.database().ref('/data/' + fid + '/position/sY/').on('value', function(scrY){
        friendScrollY = scrY.val();
        renderFriendCursor();
    });
    firebase.database().ref('/data/' + fid + '/position/WindowH/').on('value', function(height){
        friendWindowH = height.val();
        renderFriendCursor();
    });
    firebase.database().ref('/data/' + fid + '/position/WindowW/').on('value', function(width){
        friendWindowW = width.val();
        renderFriendCursor();
    });
    firebase.database().ref('/data/' + studentId + '/position/WindowW/').on('value', function(width){
        myContentsWidth = width.val();
    });
    firebase.database().ref('/data/' + fid + '/url/').on('value', function(link){
        friendLink = link.val();
        if(!checkWeAreInSameLink() && isFollowing()) {
           window.location.href = friendLink + '?groupId=' + groupId + '&studentId=' + studentId;
        }
    });


    // prepare frame for following mode
    var followingFrame = document.getElementById('body_frame');
    followingFrame.style.width = Math.max(window.innerWidth, 1223)-24;
    followingFrame.style.height = document.body.clientHeight - 70;

    // trace friend's following state
    firebase.database().ref('/data/' + fid + '/following/').on('value', function(state){
        friendIsFollowing = state.val();

        if(friendIsFollowing == studentId){
            // friend start following me
            document.getElementById('status').innerHTML = friendName + ' is following you now';
            document.getElementById('status').style.background = '#11D275';
            document.getElementById('status').style.visibility = 'visible';
            document.getElementById('statusRemark').style.visibility = 'hidden';

            followingFrame.style.visibility = "visible";
            followingFrame.style.borderColor = "#11D275";    

            document.getElementById('followingButton').style.pointerEvents = "inherit"
            document.getElementById('followingButton').innerHTML = "Switch leader with " + friendName;
            document.getElementById('followingButton').style.visibility = 'visible';
            updateUserDataToDB();
            toastr.success(friendName + " start to following me");
        } else if (!isFollowing()) {
            // friend stops following me
            document.getElementById('followingButton').innerHTML = "Go to " + friendName;
            document.getElementById('followingButton').style.visibility = 'visible';
            document.getElementById('status').style.visibility = 'hidden';
            followingFrame.style.visibility = "hidden";
        }
    });


    firebase.database().ref('/data/' + studentId + '/following/').on('value', function(state){
        if(state.val() == null) {
            stopFollowing();
        }
    });

    // scripts for following button
    
    var btn = document.getElementById('followingButton');
    if (btn.addEventListener) {
        btn.addEventListener("click", event => goToFriendLocation(fid), false);
    }
    else if (btn.attachEvent) {
        btn.attachEvent('onclick', event => goToFriendLocation(fid));
    }

    window.addEventListener('resize', function(event){
        followingFrame.style.width = Math.max(window.innerWidth, 1223)-23;
        followingFrame.style.height = window.innerHeight;
    });
}

function goToFriendLocation(fid) {
    if ( friendIsFollowing != null ) {
        // drop follower
        firebase.database().ref('/data/' + fid + '/following/').set(null);
    }
    console.log(fid);
    startFollowing(fid);
    if(!checkWeAreInSameLink()) {
        window.location.href = friendLink + '?groupId=' + groupId + '&studentId=' + studentId;
    }
}
function checkWeAreInSameLink(){
    return (friendLink == location.href.split('?')[0]);
}

function renderFriendCursor() {
    // update friend's cursor position
    const friendCursorSize = 62;

    // if same link, visible
    if(checkWeAreInSameLink()){
        friendCursor.style.visibility = 'visible';
    } else {
        friendCursor.style.visibility = 'hidden';
    }

    // bounding firend cursor
    if (( friendPositionX + friendScrollX ) < 0){
        friendCursor.style.left = 0;
    } else if (( friendPositionX + friendScrollX ) > myContentsWidth - friendCursorSize) {
        friendCursor.style.left = myContentsWidth - friendCursorSize;
    } else {
        friendCursor.style.left = ( friendPositionX + friendScrollX ) + "px";
    }
    friendCursor.style.top = ( friendPositionY + friendScrollY ) + "px";

    // auto scroll for correction of different window size
    if (isFollowing()) {
        var dW = friendWindowW - window.innerWidth;
        var percentW = 1 - ( (friendWindowW - friendPositionX) / friendWindowW );

        var dH = friendWindowH - window.innerHeight;
        var percentH = 1 - ( (friendWindowH - friendPositionY) / friendWindowH );

        window.scrollTo(friendScrollX + dW * percentW, friendScrollY + dH * percentH);
    }
}


