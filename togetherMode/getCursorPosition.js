window.onload = function() {

    // update friend's cursor position
    const friend = document.getElementById('friend');

    var friendPositionX = 300;
    var friendPositionY = 300;
    var friendScrollY = 0;
    var friendScrollX = 0;
    var friendWindowH = 0;
    var friendWindowW = 0;
    var myWindowW = 0;
    var correctionForX = 0;
    var friendState;

    var friendUid = getParameterByName('fid');
    var myUid = getParameterByName('uid');

    var followingFrame = document.getElementById('body_frame');
    followingFrame.style.width = Math.max(window.innerWidth, 1223)-23;
    followingFrame.style.height = document.body.clientHeight - 70;
    followingFrame.style.color = "rgb(88,88,88)";
    followingFrame.style.visibility = "hidden";

    firebase.database().ref('/CursorPosition/'+ friendUid +'/pX/').on('value', function(posX){
        friendPositionX = posX.val() - friendWindowW / 2 + myWindowW / 2;
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendUid +'/pY/').on('value', function(posY){
        friendPositionY = posY.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendUid +'/sX/').on('value', function(scrX){
        friendScrollX = scrX.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendUid +'/sY/').on('value', function(scrY){
        friendScrollY = scrY.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendUid +'/WindowH/').on('value', function(height){
        friendWindowH = height.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendUid +'/WindowW/').on('value', function(width){
        friendWindowW = width.val();
        renderFriendCursor();
    });
    firebase.database().ref('/CursorPosition/'+ friendUid +'/following/').on('value', function(state){
        friendIsFollowing = state.val();
        if(friendIsFollowing == myUid){
            followingFrame.style.visibility = "visible";
            followingFrame.style.borderColor = "green";
        }
    });
    firebase.database().ref('/CursorPosition/'+ myUid +'/WindowW/').on('value', function(width){
        myWindowW = width.val();
    });
    
    function renderFriendCursor() {

        // bounding firend cursor
        if (( friendPositionX + friendScrollX ) < 0){
            friendCursor.style.left = 0;
        } else if (( friendPositionX + friendScrollX ) > myWindowW) {
            friendCursor.style.left = myWindowW;
        } else {
            friendCursor.style.left = ( friendPositionX + friendScrollX ) + "px";
        }
        friendCursor.style.top = ( friendPositionY + friendScrollY ) + "px";

        if (isFollowing()) {
            var dW = friendWindowW - window.innerWidth;
            var percentW = 1 - ( (friendWindowW - friendPositionX) / friendWindowW );

            var dH = friendWindowH - window.innerHeight;
            var percentH = 1 - ( (friendWindowH - friendPositionY) / friendWindowH );
            
            window.scrollTo(friendScrollX + dW * percentW, friendScrollY + dH * percentH);
        }
    }

    var btn = document.getElementById('followingButton');
    if (btn.addEventListener) {
        btn.addEventListener("click", event => checkAndFollow(friendUid), false);
    }
    else if (btn.attachEvent) {
        btn.attachEvent('onclick', event => checkAndFollow(friendUid));
    }

    function checkAndFollow(fid) {
        if ( isFriendFollowingSomeone( )) {
            alert('Nope');
        } else {
            turnOnFollowing(fid);
        }
    }

    function isFriendFollowingSomeone(){
        return friendIsFollowing;
    }
}
