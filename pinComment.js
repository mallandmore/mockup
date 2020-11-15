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

// var canvas = document.getElementById("canvas");
// var context = canvas.getContext("2d");

document.addEventListener("dblclick", myFunction, false);
// var click_counter = 0;

function myFunction(x){
    var positionLeft = x.pageX;
    var positionTop = x.pageY;

    var comment = document.createElement("input",{type:"text"});
    // click_counter += 1;
    // comment.id = "comment" + click_counter.toString();
    document.body.appendChild(comment);
    comment.style.position = "absolute";
    comment.style.left = positionLeft+'px';
    comment.style.top = positionTop+'px';
    // comment.setAttribute('entered','false');
    comment.setAttribute("key","none");
    
    comment.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            if (comment.getAttribute("key") === "none"){
                var commentKey = firebase.database().ref('pinComment/').push({
                    comment: comment.value,
                    left: positionLeft,
                    top: positionTop
                }).key; //string?
                comment.setAttribute("key", commentKey);
            }
            else{
                // console.log(comment.getAttribute("key"));
                firebase.database().ref('pinComment/'+comment.getAttribute("key")+'/').child("comment").set(comment.value);
                // console.log("entered again")
            }
            // comment.remove();
            comment.readOnly = true;
            // console.log(comment.readOnly)
            comment.entered = 'true';
            // console.log(comment.enter_counter.value)
        }

    });

    comment.addEventListener("click", function(e) {
        comment.readOnly = false;
    });

    // firebase.database().ref('/pinComment/').on('value', function(snapshot) {
    //     // var sb = '';
    //     snapshot.on(function(childSnapshot) {
    //         // var childKey = childSnapshot.key;
    //         // console.log(childSnapshot.val().string);
    //         sb = sb + childSnapshot.val().string + "<br>";
    //     });

    //     root.innerHTML = sb;
    // });
    

}

