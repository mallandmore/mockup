window.onload = function() {
    

    // update friend's cursor position
    const friend = document.getElementById('friend');

    var friendPositionX = 300;
    var friendPositionY = 300;
    var friendScrollY = 0;
    var friendScrollX = 0;
    var friendWindowH = 0;
    var friendWindowW = 0;
    var correctionForPosX = 0;
    var friendState;

    var friendUid = getParameterByName('fid');

    firebase.database().ref('/CursorPosition/'+ friendUid +'/pX/').on('value', function(posX){
        friendPositionX = posX.val();
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
        friendState = state.val();
    });
    
    function renderFriendCursor() {
        correctionForPosX = (friendWindowW - window.innerWidth) / 2;

        friendCursor.style.left = ( friendPositionX + friendScrollX - correctionForPosX) + "px";
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
        btn.addEventListener("click", checkAndFollow, false);
    }
    else if (btn.attachEvent) {
        btn.attachEvent('onclick', checkAndFollow);
    }

    function checkAndFollow() {
        if ( isFriendFollowingSomeone( )) {
            alert('Nope');
        } else {
            switchFollowing();
        }
    }

    function isFriendFollowingSomeone(){
        return friendState;
    }
}
