var togetherModeState;
var currentRequestKey;

var myContentsWidth = 1200; // min 1200 (default width)


// shopping together mode
window.addEventListener('load', function() {
    var startTogetherBtn = document.getElementById('startTogetherButton');
    if (startTogetherBtn.addEventListener) {
        startTogetherBtn.addEventListener("click", manageTogethetMode, false);
    }
    else if (startTogetherBtn.attachEvent) {
        startTogetherBtn.attachEvent('onclick', manageTogethetMode);
    }
});


function manageTogethetMode(){
    const myTogetherModeDB = firebase.database().ref('/'+ groupId + '/friends/' + studentId + '/togetherModeState/');
    const friendTogetherModeDB = firebase.database().ref('/'+ groupId + '/friends/' + friendId + '/togetherModeState/');
    const messengerDB = firebase.database().ref('/' + groupId).child('messenger');
    
    // send requset for together mode
    if (togetherModeState == 'off') {

        myTogetherModeDB.set('waiting');
        startTogetherButton.style.background = 'gray';
        startTogetherButton.style.color = 'white';
        startTogetherButton.innerHTML = 'Cancle the request to '+ friendName;

        // send a request
        currentRequestKey = messengerDB.push({
            author : studentId,
            type : "shopping_together_request"
        });

        // send a report for me
        messengerDB.push({ 
            author : studentId,
            type : "shopping_together_info",
            string: "Sent a request to "+ friendName
        });
    }

    // quit together mode
    else if (togetherModeState == 'on') {

        // send a report to me that together mode is off.
        messengerDB.push({
            author: studentId,
            type: "shopping_together_info",
            string: "Finish shopping with " + friendId
        });

        // send a report to firend that together mode is off.
        messengerDB.push({
            author: friendId,
            type: "shopping_together_info",
            string: "Finish shopping with " + studentId
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
        startTogetherButton.style.background = 'white';
        startTogetherButton.style.color = '#444444';
        startTogetherButton.innerHTML = "Shopping together with " + friendName;
        
        // cancel request
        messengerDB.child(currentRequestKey).set({
            author: "all",
            type: "shopping_together_info",
            string: "This request is canceled."
        });
    }
}


function startTogetherMode() {
    // updateUserDataToDB();

    traceFriendData(friendId);

    // show cursor
    friendCursor.style.visibility = 'visible';
    
    // change button text
    startTogetherButton.style.background = 'white';
    startTogetherButton.style.color = '#444444';
    startTogetherButton.innerHTML = "Quit together mode";
    startTogetherButton.style.pointerEvents = 'inherit';
    // show go-to function
    followingButton.innerHTML = "Go to " + friendName;
    followingButton.style.visibility = 'visible';
}
function quitTogetherMode() {
    // quit following mode
    stopFollowing();
    body_frame.style.visibility = 'hidden';

    // updateUserDataToDB();

    stopTraceFriendData(friendId);

    // hide cursor
    friendCursor.style.visibility = 'hidden';
    
    // change button text
    startTogetherButton.style.background = 'white';
    startTogetherButton.style.color = '#444444';
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

        if( togetherModeState == 'off' ) {
            quitTogetherMode();
        } 
        else if ( togetherModeState == 'waiting' ) {

        }  
        else if ( togetherModeState == 'on' ) {
            startTogetherMode();
        }
        else if ( togetherModeState.split(":")[0] == 'accept' ) {
            var requestKey = togetherModeState.split(":")[1];

            // send a report for me (receiver)
            messengerDB.child(requestKey).set({
                author: studentId,
                type: "shopping_together_info",
                string: "Accepted " + friendName + "'s request."
            });
            // send a result report that enjoy shopping together (both)
            messengerDB.push({
                author: "all",
                type: "shopping_together_info",
                string: "Shopping together!"
            });

            // change state to start together mode
            myTogetherModeDB.set('on');
            friendTogetherModeDB.set('on');
        } 
        else if ( togetherModeState.split(":")[0] == 'reject' ) {
            var requestKey = togetherModeState.split(":")[1];

            // send a report for me (receiver)
            messengerDB.child(requestKey).set({
                author: studentId,
                type: "shopping_together_info",
                string: "Rejected " + friendName + "'s request."
            });

            // send a result report for friend (sender)
            messengerDB.push({
                author: friendId,
                type: "shopping_together_info",
                string: "My request is rejected."
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

function stopTraceFriendData(fid) {
    firebase.database().ref('/CursorPosition/'+ fid +'/pX/').off('value');
    firebase.database().ref('/CursorPosition/'+ fid +'/pY/').off('value');
    firebase.database().ref('/CursorPosition/'+ fid +'/sX/').off('value');
    firebase.database().ref('/CursorPosition/'+ fid +'/sY/').off('value');
    firebase.database().ref('/CursorPosition/'+ fid +'/WindowH/').off('value');
    firebase.database().ref('/CursorPosition/'+ fid +'/WindowW/').off('value');
    firebase.database().ref('/CursorPosition/'+ studentId +'/WindowW/').off('value');
    firebase.database().ref('/CursorPosition/'+ fid +'/following/').off('value');
}

function traceFriendData(fid){
    // get realtime data from firebase
    firebase.database().ref('/CursorPosition/'+ fid +'/pX/').on('value', function(posX){
        friendPositionX = posX.val() - friendWindowW / 2 + myContentsWidth / 2;
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ fid +'/pY/').on('value', function(posY){
        friendPositionY = posY.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ fid +'/sX/').on('value', function(scrX){
        friendScrollX = scrX.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ fid +'/sY/').on('value', function(scrY){
        friendScrollY = scrY.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ fid +'/WindowH/').on('value', function(height){
        friendWindowH = height.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ fid +'/WindowW/').on('value', function(width){
        friendWindowW = width.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ studentId +'/WindowW/').on('value', function(width){
        myContentsWidth = width.val();
    });


    // prepare frame for following mode
    var followingFrame = document.getElementById('body_frame');
    followingFrame.style.width = Math.max(window.innerWidth, 1223)-24;
    followingFrame.style.height = document.body.clientHeight - 70;

    // trace friend's following state
    firebase.database().ref('/CursorPosition/'+ fid +'/following/').on('value', function(state){
        friendIsFollowing = state.val();

        if(friendIsFollowing == studentId){
            // friend start following me
            followingFrame.style.visibility = "visible";
            followingFrame.style.borderColor = "green";

            followingButton.style.pointerEvents = "inherit"
            followingButton.innerHTML = "Switch leader with " + friendName;
            updateUserDataToDB();
        } else {
            // friend stops following me
            followingFrame.style.visibility = "hidden";
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

    function goToFriendLocation(fid) {
        if ( friendIsFollowing != null ) {
        } else {
            startFollowing(fid);
        }
    }

    window.addEventListener('resize', function(event){
        followingFrame.style.width = Math.max(window.innerWidth, 1223)-23;
        followingFrame.style.height = window.innerHeight;
    });
}

function renderFriendCursor() {
    // update friend's cursor position
    const friendCursorSize = 62;

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



// 이거 자기 private page 에도 올 수 있게 하는거랑
// 각자의 옵션 선택?이 팔로잉 모드에서 같이 나오는걸 보여주면 좋긴할듯..

// 팔로잉 허가할 즉시 커서, 스크롤 포지션 업데이트 필요
// 클릭시 데이터 전송 ? (옵션 선택 하면)
