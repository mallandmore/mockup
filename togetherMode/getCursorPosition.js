window.onload = function() {
    

    // update friend's cursor position
    const friend = document.getElementById('friend');

    var friendPositionX = 300;
    var friendPositionY = 300;
    var friendPositionScroll = 0;
    var friendWindowH = 0;
    var friendState;

    var friendUid = getParameterByName('fid');

    firebase.database().ref('/XY/'+ friendUid +'/X/').on('value', function(posX){
        friendPositionX = posX.val();
        renderFriendCursor();
    });
    firebase.database().ref('/XY/'+ friendUid +'/Y/').on('value', function(posY){
        friendPositionY = posY.val();
        renderFriendCursor();
    });
    firebase.database().ref('/XY/'+ friendUid +'/S/').on('value', function(posS){
        friendPositionScroll = posS.val();
        renderFriendCursor();
    });
    firebase.database().ref('/XY/'+ friendUid +'/WindowH/').on('value', function(posWH){
        friendWindowH = posWH.val();
        renderFriendCursor();
    });
    firebase.database().ref('/XY/'+ friendUid +'/following/').on('value', function(state){
        friendState = state.val();
    });
    
    function renderFriendCursor() {
        friendCursor.style.left = friendPositionX + "px";
        friendCursor.style.top = ( friendPositionY + friendPositionScroll ) + "px";
        
        if (isFollowing()) {
            var alpha = 0;
            var dH = friendWindowH - window.innerHeight;
            var percent = 1 - ( (friendWindowH - friendPositionY) / friendWindowH );
            alpha = dH * percent;
            console.log(alpha);
            window.scrollTo(0, friendPositionScroll + alpha);
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
