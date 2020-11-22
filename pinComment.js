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
console.log("gid: ",groupId);


//Showing previous comments
var oldComments = [];
firebase.database().ref(groupId+'/messenger/').on('value', function(snapshot) {
    // remove elements iterating through oldComments
    fLen = oldComments.length;
    for (i = 0; i < fLen; i++) {
        oldComments[i].remove();
    }
    //clear oldComments
    oldComments = [];
    console.log("on value")
    snapshot.forEach(function(childSnapshot) {
        if (childSnapshot.child("type").val() == "comment"){
            if (childSnapshot.child("author").val() == studentId){
                var comment_div = create_comment(childSnapshot.child("left").val(), childSnapshot.child("top").val());
                comment_div.childNodes.item("comment").readOnly = true;
                comment_div.childNodes.item("comment").value = childSnapshot.child("string").val();
                comment_div.setAttribute("key", childSnapshot.key);
                oldComments.push(comment_div);
            }
            else{
                var fcomment = document.createElement("input",{type:"text"});
                fcomment.readOnly = true;
                fcomment.value = childSnapshot.child("string").val();
                fcomment.style.position = "absolute";
                fcomment.style.left = childSnapshot.child("left").val()+'px';
                fcomment.style.top = childSnapshot.child("top").val()+'px';
                document.body.appendChild(fcomment);
                oldComments.push(fcomment);
                console.log(fcomment.value);
            }
        }
    });
    // console.log("oldComments ",oldComments.length);

});


//Create comment box if user presses 'c' and clicks at certain location.
var c_wasKeyDragged = false;
document.addEventListener('keydown', listen_for_click, false);
document.addEventListener('keyup', reset_drag, false);

function listen_for_click(e) {
  	if (e.code == "KeyC"){
        console.log("c");
        if (!c_wasKeyDragged) {
            document.addEventListener("click", create_comment_at_event, false);
            c_wasKeyDragged = true;
        }
	}
}

function reset_drag(e) {
    if (e.code == "KeyC"){
        c_wasKeyDragged = false;
        document.removeEventListener("click", create_comment_at_event, false);
    }
}

// myComments = [];
function create_comment_at_event(e){
    create_comment(e.pageX, e.pageY);
}

function create_comment(positionLeft, positionTop){
    // console.log("create comment", positionLeft, positionTop);
    // var positionLeft = x.pageX;
    // var positionTop = x.pageY;

    var comment_div = document.createElement("div");
    document.body.appendChild(comment_div);
    comment_div.style.position = "absolute";
    comment_div.style.left = positionLeft+'px';
    comment_div.style.top = positionTop+'px';
    // comment_div.zIndex = 10;

    var comment = document.createElement("input",{type:"text"});
    comment_div.appendChild(comment);
    comment.className = "comment_div";
    comment.id = "comment";
    comment_div.setAttribute("key","none");

    var modify = document.createElement("img");
    modify.className = "comment_div";
    comment_div.appendChild(modify);
    modify.src = "src/modify.png";
    modify.width = comment.offsetHeight;
    modify.height = comment.offsetHeight;
    modify.onclick = function(){
        comment.readOnly = false;
    };

    var deletion = document.createElement("img");
    deletion.className = "comment_div";
    comment_div.appendChild(deletion);
    deletion.src = "src/delete.png";
    deletion.width = comment.offsetHeight;
    deletion.height = comment.offsetHeight;
    deletion.onclick = function(){
        console.log(comment_div.getAttribute("key"));
        firebase.database().ref(groupId+'/messenger/').child(comment_div.getAttribute("key")).remove();
        comment_div.remove();
    };

    // var commentKey = 0;
    comment.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            if (comment_div.getAttribute("key") === "none"){
                //When first entered the comment
                var commentKey = firebase.database().ref(groupId+'/messenger/').push({
                    type: "comment",
                    author: studentId,
                    time: Math.floor(Date.now() / 1000),
                    string: comment.value,
                    left: positionLeft,
                    top: positionTop,
                }).key;
                comment_div.setAttribute("key", commentKey);
                console.log("Added ",comment_div.getAttribute("key"));
            }
            else{
                //When modified the comment
                firebase.database().ref(groupId+'/messenger/'+comment_div.getAttribute("key")+"/").child("string").set(comment.value);
                console.log("modified");
            }
            comment.readOnly = true;
            comment_div.remove();
        }
    });
    return comment_div;
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}