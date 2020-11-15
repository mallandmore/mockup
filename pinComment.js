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


firebase.database().ref('/pinComment/').once('value', function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        var fcomment = document.createElement("input",{type:"text"});
        fcomment.readOnly = true;
        fcomment.value = childSnapshot.child("comment").val();
        fcomment.style.position = "absolute";
        fcomment.style.left = childSnapshot.child("left").val()+'px';
        fcomment.style.top = childSnapshot.child("top").val()+'px';
        document.body.appendChild(fcomment);
        fcomment.zIndex = -1;
        fcomment.addEventListener("click", function(e) {
            console.log("Click fcomment")
        });
    });
});


document.addEventListener("dblclick", create_comment, false);

function create_comment(x){

    var positionLeft = x.pageX;
    var positionTop = x.pageY;

    var comment = document.createElement("input",{type:"text"});
    document.body.appendChild(comment);
    comment.style.position = "absolute";
    comment.style.left = positionLeft+'px';
    comment.style.top = positionTop+'px';
    comment.setAttribute("key","none");
    comment.zIndex = 10;
    
    comment.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            if (comment.getAttribute("key") === "none"){
                var commentKey = firebase.database().ref('pinComment/').push({
                    comment: comment.value,
                    left: positionLeft,
                    top: positionTop
                }).key; 
                comment.setAttribute("key", commentKey);
            }
            else{
                firebase.database().ref('pinComment/'+comment.getAttribute("key")+'/').child("comment").set(comment.value);
            }
            comment.readOnly = true;
            comment.entered = 'true';
        }
    });

    comment.addEventListener("click", function(e) {
        console.log("Click")
        comment.readOnly = false;
    });
    
}


