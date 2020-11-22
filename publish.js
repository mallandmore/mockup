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

    db.child('friends').child(studentId).child('goToLink').once('value').then(function(snapshot){
        if (snapshot.val() != 0) {
            var top = snapshot.val();
            window.scrollTo(0, top - window.innerHeight * 0.2);
            db.child('friends').child(studentId).child('goToLink').set(0);
        }
    })
    

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
    
    addUserMovementListener();

    db.child('messenger').on('value', function(snapshot){
        document.getElementById("messenger_body").innerHTML = '';
        snapshot.forEach(element => {
            const key = element.key;
            var sender = element.child("sender").val();
            var receiver = element.child("receiver").val();
            var string = element.child("string").val();
            var time = element.child("time").val();
            const type = element.child("type").val();
            if (type == "shopping_together_request") {
                 if (sender == studentId) {
                    const message = document.createElement("div");
                    message.className = "shopping_together_info";
                    const message_wrap = document.createElement("div");
                    message_wrap.className = "message_wrap";
                    message_wrap.style.marginLeft = "0px";
                    message_wrap.style.marginRight = "0px";
                    document.getElementById("messenger_body").appendChild(message_wrap).appendChild(message);
                    message.innerHTML = "Sent a request to " + friendName;
                } else if (receiver == studentId) {
                    const message = document.createElement("div");
                    message.className = type;
                    const message_wrap = document.createElement("div");
                    message_wrap.className = "message_wrap";
                    message_wrap.style.marginLeft = "0px";
                    message_wrap.style.marginRight = "0px";
                    document.getElementById("messenger_body").appendChild(message_wrap).appendChild(message);
                    message.innerHTML = "<div class = 'shopping_together_request_label'>" +
                    "Do you want to accept " + friendName + "'s request?" + "</div>" + 
                    "<div class = 'shopping_together_request_buttons'>" +
                    "<div class = 'shopping_together_request_button' id = 'shopping_together_request_yes'>" + "yes" +
                    "</div>" + "<div class = 'shopping_together_request_button' id = 'shopping_together_request_no'>" +
                    "no" + "</div>" + "</div>"
                    document.getElementById('shopping_together_request_yes').addEventListener('click', function(){
                        db.child('friends').child(studentId).child('togetherModeState').set('accept:' + key);
                    }, false);
                    document.getElementById('shopping_together_request_no').addEventListener('click', function(){
                        db.child('friends').child(studentId).child('togetherModeState').set('reject:' + key);
                    }, false);
                }
            } else if (type == "shopping_together_accept") {
                const message = document.createElement("div");
                message.className = "shopping_together_info";
                const message_wrap = document.createElement("div");
                message_wrap.className = "message_wrap";
                message_wrap.style.width = "230px";
                message_wrap.style.marginLeft = "0px";
                message_wrap.style.marginRight = "0px";
                document.getElementById("messenger_body").appendChild(message_wrap).appendChild(message);
                if (sender == studentId) {
                    message.innerHTML = "Accepted " + friendName + "'s request."
                } else if (receiver == studentId) {
                    message.innerHTML = "My request is accepted.";
                }
            } else if (type == "shopping_together_reject") {
                const message = document.createElement("div");
                message.className = "shopping_together_info";
                const message_wrap = document.createElement("div");
                message_wrap.className = "message_wrap";
                message_wrap.style.width = "230px";
                message_wrap.style.marginLeft = "0px";
                message_wrap.style.marginRight = "0px";
                document.getElementById("messenger_body").appendChild(message_wrap).appendChild(message);
                if (sender == studentId) {
                    message.innerHTML = "Rejected " + friendName + "'s request."
                } else if (receiver == studentId) {
                    message.innerHTML = "My request is rejected.";
                }
            } else if (type == "shopping_together_start") {
                const message = document.createElement("div");
                message.className = "shopping_together_info";
                const message_wrap = document.createElement("div");
                message_wrap.className = "message_wrap";
                message_wrap.style.width = "230px";
                message_wrap.style.marginLeft = "0px";
                message_wrap.style.marginRight = "0px";
                document.getElementById("messenger_body").appendChild(message_wrap).appendChild(message);
                message.innerHTML = "Shopping together!"
            } else if (type == "shopping_together_end") {
                const message = document.createElement("div");
                message.className = "shopping_together_info";
                const message_wrap = document.createElement("div");
                message_wrap.className = "message_wrap";
                message_wrap.style.width = "230px";
                message_wrap.style.marginLeft = "0px";
                message_wrap.style.marginRight = "0px";
                document.getElementById("messenger_body").appendChild(message_wrap).appendChild(message);
                message.innerHTML = "Finished shopping with " + friendName;
            } else if (type == "shopping_together_cancel") {
                const message = document.createElement("div");
                message.className = "shopping_together_info";
                const message_wrap = document.createElement("div");
                message_wrap.className = "message_wrap";
                message_wrap.style.width = "230px";
                message_wrap.style.marginLeft = "0px";
                message_wrap.style.marginRight = "0px";
                document.getElementById("messenger_body").appendChild(message_wrap).appendChild(message);
                if (sender == studentId) {
                    message.innerHTML = "Canceled my request.";
                } else if (receiver == studentId) {
                    message.innerHTML = "This request is canceled.";
                }
            } else if (type == "comment") {
                element.child('thread').forEach(elementDD => {
                    console.log(elementDD.key);
                    sender = elementDD.child('sender').val();
                    receiver = elementDD.child('receiver').val();
                    string = elementDD.child('string').val();
                    time = elementDD.child('time').val();
                });
                const url_key = element.child('url').val();
                console.log(url_key);
                const top = element.child('top').val();
                const left = element.child('left').val();
                const message = document.createElement("div");
                message.className = type;
                const message_wrap = document.createElement("div");
                message_wrap.className = "message_wrap";
                message_wrap.style.width = "230px";
                message_wrap.style.marginLeft = "0px";
                message_wrap.style.marginRight = "0px";
                document.getElementById("messenger_body").appendChild(message_wrap).appendChild(message); 
                if (sender == studentId) {
                    message.innerHTML = "<div class = 'pinComment_thread_header'>" +
                    "<img class = 'pinComment_author_profile' src = 'src/profile.png'>" +
                    "<div class = 'pinComment_author_info'>" + "<div class = 'pinComment_author_name'>"
                    + myName + "</div> <div class = 'pinComment_time'>" + time + "</div></div></div>" +
                    "<div class = 'pinComment_input'><div class = 'pinComment_text_readOnly'>" + string + 
                    "</div></div>";
                } else if (sender == friendId) {
                    message.innerHTML = "<div class = 'pinComment_thread_header'>" +
                    "<img class = 'pinComment_author_profile' src = 'src/profile.png'>" +
                    "<div class = 'pinComment_author_info'>" + "<div class = 'pinComment_author_name'>"
                    + friendName + "</div> <div class = 'pinComment_time'>" + time + "</div></div></div>" +
                    "<div class = 'pinComment_input'><div class = 'pinComment_text_readOnly'>" + string + 
                    "</div></div>";
                }
                message.addEventListener('click', function(){
                    var url = location.href.split("?")[0].split("/");
                    var url_id = url[url.length-1];
                    console.log(url_id);
                    if (url_key != url_id ) {
                        db.child('friends').child(studentId).child('goToLink').set(top).then(goToLink(url_key));
                    } else {
                        window.scrollTo(0, top - window.innerHeight * 0.2);
                    }
                    // window.location.href = 'pinComment.html?studentId=' + studentId + "&groupId=" + groupId;
                }, false);
            } else if (type == "chat") {
                const message = document.createElement("div");
                message.className = type;
                const message_wrap = document.createElement("div");
                message_wrap.className = "message_wrap";
                document.getElementById("messenger_body").appendChild(message_wrap).appendChild(message);
                if (sender == studentId) {
                    message_wrap.style.marginLeft = "20px";
                    message.style.borderRadius = "18px 4px 18px 18px";
                    message.style.float = "right";
                    message.style.color = "white";
                    message.style.background = "#424242";
                    message.style.border = "#424242";
                    message.style.fontWeight = "400";
                    message.innerText = string;
                } else if (sender == friendId) {
                    message_wrap.style.marginRight = "20px";
                    message.style.borderRadius = "4px 18px 18px 18px";
                    message.style.float = "left";
                    message.innerText = string;
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
                    sender: studentId,
                    receiver: friendId,
                    string: value,
                    type: 'chat',
                    time: date.getTime()
                });
                message_input.value = '';
            }
        }
    });
}