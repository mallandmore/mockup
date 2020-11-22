var groupId;

var studentId;
var myName;

var friendId;
var friendName;

var changing_key;

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

                traceTogetherModeState();
                // prepare shop together interface
                document.getElementById('startTogetherButton').innerHTML = "Shopping together with " + friendName;
                document.getElementById('startTogetherButton').style.visibility = "visible";

            }
        });
        document.getElementById('messenger_header').innerText = friendName;
    });

    db.child('messenger').on('value', function(snapshot){
        snapshot.forEach(element => {
            const key = element.key;
            const id = element.child("author").val();
            const string = element.child("string").val();
            const type = element.child("type").val();
            if (type == "shopping_together_request") {
                if (id == friendId) {
                    const message = document.createElement("div");
                    message.className = type;
                    document.getElementById("messenger_body").appendChild(message);
                    message.innerHTML = "<div class = 'shopping_together_request_label'>" +
                    "Do you want to accept " + friendName + "'s request?" + "</div>" + 
                    "<div class = 'shopping_together_request_buttons'>" +
                    "<div class = 'shopping_together_request_button' id = 'shopping_together_request_yes'>" + "yes" +
                    "</div>" + "<div class = 'shopping_together_request_button' id = 'shopping_together_request_no'>" +
                    "no" + "</div>" + "</div>"
                    document.getElementById('shopping_together_request_yes').addEventListener('click', function(){
                        alert('yes');
                        db.child('friends').child(studentId).child('togetherModeState').set('accept');
                    }, false);
                    document.getElementById('shopping_together_request_no').addEventListener('click', function(){
                        db.child('friends').child(studentId).child('togetherModeState').set('reject');
                    }, false);
                }
            } else if (type == "shopping_together_info") {
                if (id == studentId || id == "all") {
                    const message = document.createElement("div");
                    message.className = type;
                    document.getElementById("messenger_body").appendChild(message);
                    message.innerHTML = string;
                }
            } else {
                if (id == friendId) {
                    const message = document.createElement("div");
                    message.className = type;
                    document.getElementById("messenger_body").appendChild(message);
                    message.innerText = friendName + ": " + string;
                } else if (id == studentId) {
                    const message = document.createElement("div");
                    message.className = type;
                    document.getElementById("messenger_body").appendChild(message);
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