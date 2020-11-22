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
                traceFriendData();
            }
        });
        document.getElementById('messenger_header').innerText = friendName;
    });

    db.child('messenger').on('value', function(snapshot){
        snapshot.forEach(element => {
            const wow = element.key;
            const id = element.child("author").val();
            const string = element.child("string").val();
            const type = element.child("type").val();
            const message = document.createElement("div");
            message.className = type;
            document.getElementById("messenger_body").appendChild(message);
            if (type == "shopping_together_request") {
                message.innerHTML = "<div class = 'shopping_together_request_label'>" +
                "Do you want to accept " + friendName + "'s request?" + "</div>" + 
                "<div class = 'shopping_together_request_buttons'>" +
                "<div class = 'shopping_together_request_button' id = 'shopping_together_request_yes'>" + "yes" +
                "</div>" + "<div class = 'shopping_together_request_button' id = 'shopping_together_request_no'>" +
                "no" + "</div>" + "</div>"
                document.getElementById('shopping_together_request_yes').addEventListener('click', function(){
                    db.child('friends').child(friendId).child('togetherModeState').set('on');
                    message.className = "shopping_together_info";
                    message.innerHTML = "Accepted " + friendName + "'s request.";
                }, false)
                document.getElementById('shopping_together_request_no').addEventListener('click', function(){
                    db.child('friends').child(friendId).child('togetherModeState').set('off');
                    message.className = "shopping_together_info";
                    message.innerHTML = "Rejected " + friendName + "'s request.";
                }, false)
            } else {
                if (id == friendId) {
                    message.innerText = friendName + ": " + string;
                } else if (id == studentId) {
                    message.innerText = "Me: " + string;
                }
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