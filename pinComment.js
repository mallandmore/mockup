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

var fcomments = [];
firebase.database().ref('/pinComment/').on('value', function(snapshot) {
    console.log("on value")
    //remove elements iterating through fcomments
    fLen = fcomments.length;
    for (i = 0; i < fLen; i++) {
      fcomments[i].remove();
    }
    //clear fcomments
    fcomments = [];
    snapshot.forEach(function(childSnapshot) {
        if (myComments.indexOf(childSnapshot.key) < 0){
            console.log(childSnapshot.key);
            var fcomment = document.createElement("input",{type:"text"});
            fcomment.readOnly = true;
            fcomment.value = childSnapshot.child("comment").val();
            fcomment.style.position = "absolute";
            fcomment.style.left = childSnapshot.child("left").val()+'px';
            fcomment.style.top = childSnapshot.child("top").val()+'px';
            document.body.appendChild(fcomment);
            fcomment.zIndex = -1;
            fcomments.push(fcomment);
        }
    });
    console.log("fcomments ",fcomments.length);

});

var c_wasKeyDragged = false;
document.addEventListener('keydown', listen_for_click, false);
document.addEventListener('keyup', reset_drag, false);

function listen_for_click(e) {
  	if (e.code == "KeyC"){
        console.log("c");
        if (!c_wasKeyDragged) {
            document.addEventListener("click", create_comment, false);
            c_wasKeyDragged = true;
        }
	}
}

function reset_drag(e) {
    if (e.code == "KeyC"){
        c_wasKeyDragged = false;
        document.removeEventListener("click", create_comment, false);
    }
}

myComments = [];
function create_comment(x){
    var positionLeft = x.pageX;
    var positionTop = x.pageY;

    var comment_div = document.createElement("div");
    document.body.appendChild(comment_div);
    comment_div.style.position = "absolute";
    comment_div.style.left = positionLeft+'px';
    comment_div.style.top = positionTop+'px';
    comment_div.zIndex = 10;

    var comment = document.createElement("input",{type:"text"});
    comment_div.appendChild(comment);
    comment.className = "comment_div";
    comment.setAttribute("key","none");

    var modify = document.createElement("img");
    modify.className = "comment_div";
    comment_div.appendChild(modify);
    modify.src = "src/modify.png";
    modify.width = comment.offsetHeight;
    modify.height = comment.offsetHeight;
    modify.onclick = function(){
        comment.readOnly = false;
    };

    var commentKey = 0;
    comment.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            if (comment.getAttribute("key") === "none"){
                commentKey += 1;
                comment.setAttribute("key", String(commentKey));
                myComments.push(String(commentKey));
                firebase.database().ref('pinComment/'+String(commentKey)).set({
                    comment: comment.value,
                    left: positionLeft,
                    top: positionTop
                })
                console.log("Added ",comment.getAttribute("key"));
                console.log("   myComments: ",myComments.length)
            }
            else{
                firebase.database().ref('pinComment/'+comment.getAttribute("key")+'/').child("comment").set(comment.value);
                console.log("modified");
                console.log("   myComments: ",myComments.length);
            }
            comment.readOnly = true;
        }
    });

    var deletion = document.createElement("img");
    deletion.className = "comment_div";
    comment_div.appendChild(deletion);
    deletion.src = "src/delete.png";
    deletion.width = comment.offsetHeight;
    deletion.height = comment.offsetHeight;
    deletion.onclick = function(){
        firebase.database().ref('pinComment/'+comment.getAttribute("key")).remove();
        var i = myComments.indexOf(comment.getAttribute("key"));
        myComments.splice(i,1);
        comment_div.remove();
        console.log("deleted one, mycomments: ", myComments.length);
    }

    
}


