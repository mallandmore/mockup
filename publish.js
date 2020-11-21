window.onload = function() {

    var firebaseConfig = {
        apiKey: "AIzaSyCg6CX4vETntZ2VrDzsDioc6_Vuk3GZHC0",
        authDomain: "mallandmore.firebaseapp.com",
        databaseURL: "https://mallandmore.firebaseio.com",
        projectId: "mallandmore",
        storageBucket: "mallandmore.appspot.com",
        messagingSenderId: "304964816878",
        appId: "1:304964816878:web:cc31032799331e167088ff",
        measurementId: "G-77TJCD88E7"
    };

    firebase.initializeApp(firebaseConfig);

    var studentId = getParameterByName('studentId');
    var groupId = getParameterByName('groupId');

    var myName;
    var friendName;
    var friendId;

    const db = firebase.database().ref('/' + groupId);

    
    db.child('friends').once('value').then(function(snapshot){
        snapshot.forEach(element => {
            const id = element.key;
            if (id == studentId) {
                myName = element.child("name").val();
            } else {
                friendName = element.child("name").val();
                friendId = id;
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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}