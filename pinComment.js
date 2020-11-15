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
    console.log(positionLeft, positionTop);

    var comment = document.createElement("input",{type:"text"});
    // comment.type = "text";
    // click_counter += 1;
    // comment.id = "comment" + click_counter.toString();
    comment.style.position = "absolute";
    document.body.appendChild(comment);
    comment.style.left = positionLeft+'px';
    comment.style.top = positionTop+'px';
    console.log(comment.style.left)

    .addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            // Do work
        }
    });

}

