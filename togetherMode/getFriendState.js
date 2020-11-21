// variables for friend data
var friendPositionX = 300;
var friendPositionY = 300;
var friendScrollY = 0;
var friendScrollX = 0;
var friendWindowH = 0;
var friendWindowW = 0;
var friendIsFollowing;

var myContentsWidth = 1200; // min 1200 (default width)

function traceFriendData(){
    // alert(friendId);

    // get realtime data from firebase
    firebase.database().ref('/CursorPosition/'+ friendId +'/pX/').on('value', function(posX){
        friendPositionX = posX.val() - friendWindowW / 2 + myContentsWidth / 2;
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendId +'/pY/').on('value', function(posY){
        friendPositionY = posY.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendId +'/sX/').on('value', function(scrX){
        friendScrollX = scrX.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendId +'/sY/').on('value', function(scrY){
        friendScrollY = scrY.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendId +'/WindowH/').on('value', function(height){
        friendWindowH = height.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendId +'/WindowW/').on('value', function(width){
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
    followingFrame.style.visibility = "hidden";

    // trace friend following state
    firebase.database().ref('/CursorPosition/'+ friendId +'/following/').on('value', function(state){
        friendIsFollowing = state.val();

        // if friend starts to follow me, show the frame
        if(friendIsFollowing == studentId){
            // alert(studentId);
            followingFrame.style.visibility = "visible";
            followingFrame.style.borderColor = "green";
        } else {
            followingFrame.style.visibility = "hidden";
        }
    });
    
    // scripts for follwing button
    var btn = document.getElementById('followingButton');
    if (btn.addEventListener) {
        btn.addEventListener("click", event => getPermissionForFollowing(friendId), false);
    }
    else if (btn.attachEvent) {
        btn.attachEvent('onclick', event => getPermissionForFollowing(friendId));
    }

    function getPermissionForFollowing(friendId) {
        // THINGS TO DO 
        // 0. check the friend's state -> if follwing other, Deny it.
        // 1. show the current state (waiting for permission, accept, expried)
        // 2. if friend allows the requset, start the following mode
        if ( friendIsFollowing ) {
            alert('Nope');
        } else {
            followingFrame.style.visibility = "visible";
            followingFrame.style.borderColor = "blue";
            startFollwing(friendId);
        }
    }
}

function renderFriendCursor() {
    // update friend's cursor position
    const friendCursorSize = 62;

    // bounding firend cursor
    if (( friendPositionX + friendScrollX ) < 0){
        friendCursor.style.left = 0;
    } else if (( friendPositionX + friendScrollX ) > myContentsWidth - friendCursorSize) {
        friendCursor.style.left = myContentsWidth - cursorSize;
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