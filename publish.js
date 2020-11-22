var groupId;

var studentId;
var myName;

var friendId;
var friendName;

window.onload = function() {

    studentId = getParameterByName('studentId');
    groupId = getParameterByName('groupId');

    const db = firebase.database().ref('/' + groupId);
    
    db.child('friends').once('value').then(function(snapshot){
        snapshot.forEach(element => {
            const id = element.key;
            if (id == studentId) {
                myName = element.child("name").val();
            } else {
                friendName = element.child("name").val();
                friendId = id;

                traceFriendRequest(friendId);
                // prepare shop together interface
                document.getElementById('startTogetherButton').innerHTML = "Shopping together with " + friendName;
                document.getElementById('startTogetherButton').style.visibility = "visible";

            }
        });
        document.getElementById('messenger_header').innerText = friendName;
    });

    db.child('messenger').on('value', function(snapshot){
        snapshot.forEach(element => {
            const id = element.child("author").val();
            const string = element.child("string").val();
            const type = element.child("type").val();
            const message = document.createElement("div");
            message.className = type;
            document.getElementById("messenger_body").appendChild(message);
            if (id == friendId) {
                console.log("w");
                message.innerText = friendName + ": " + string;
            } else if (id == studentId) {
                message.innerText = "Me: " + string;
            }

            var objDiv = document.getElementById("messenger_body");
            objDiv.scrollTop = objDiv.scrollHeight; 
        });
    });

    const message_input = document.getElementById("message_input");

    message_input.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            const value = message_input.value;
            if (value != '') {
                const date = new Date;
                db.child('messenger').push({
                    author: studentId,
                    string: value,
                    type: 'chat',
                    time: date.getTime()
                });
                message_input.value = '';
            }
        }
    });
}