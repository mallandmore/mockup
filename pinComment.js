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

var groupId = getParameterByName('groupId');
var studentId = getParameterByName('studentId');

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
});

//Showing previous comments
var oldComments = [];
firebase.database().ref(groupId+'/messenger/').on('value', function(snapshot) {
    // remove elements iterating through oldComments
    oldLen = oldComments.length;
    for (i = 0; i < oldLen; i++) {
        oldComments[i].remove();
    }
    //clear oldComments
    oldComments = [];
    snapshot.forEach(function(childSnapshot) {
        //For each comment
        if (childSnapshot.child("type").val() == "comment"){
            var comment = document.createElement("div");
            oldComments.push(comment);
            comment.className = "pinComment";
            comment.style.position = "absolute";
            comment.style.left = childSnapshot.child("left").val()-600+window.innerWidth/2+'px';
            comment.style.top = childSnapshot.child("top").val()+'px';
            comment.setAttribute("commentKey", childSnapshot.key);
            document.body.appendChild(comment);

            //For each comment thread
            childSnapshot.child('thread').forEach(function(childSnapshot) {
                comment.setAttribute("threadKey", childSnapshot.key);
                var old_thread = create_old_thread();
                comment.appendChild(old_thread);
                var sender = childSnapshot.child("sender").val();
                var sender_name;
                firebase.database().ref(groupId+'/friends/'+sender).child("name").once('value').then(function(snapshot){
                    sender_name = snapshot.val();
                }).then(function() {
                    old_thread.getElementsByClassName("pinComment_author_name")[0].innerHTML = sender_name;
                    old_thread.getElementsByClassName("pinComment_time")[0].innerHTML = childSnapshot.child("time").val();
                    old_thread.getElementsByClassName("pinComment_author_profile")[0].src = "src/"+sender_name+"_profile.png";
                    old_thread.getElementsByClassName("pinComment_text_readOnly")[0].readOnly = true;
                    old_thread.getElementsByClassName("pinComment_text_readOnly")[0].innerHTML = childSnapshot.child("string").val();
                    var old_thread_edit = old_thread.getElementsByClassName("pinComment_edit")[0];
                    var old_thread_delete = old_thread.getElementsByClassName("pinComment_delete")[0];
                    if (childSnapshot.child("sender").val() == studentId){
                        
                        old_thread_edit.onclick = function(){
                            var old_text_readOnly = old_thread.getElementsByClassName("pinComment_text_readOnly")[0]; 

                            //Switch to input box
                            var str = '<a href="http://www.com">item to replace</a>'; //it can be anything
                            var Obj = old_text_readOnly;
                            var tmpObj=document.createElement("div");
                            tmpChild = document.createElement("input",{type:"text"});
                            tmpChild.className = "pinComment_text_readOnly";
                            tmpChild.value = old_text_readOnly.innerHTML;
                            tmpObj.appendChild(tmpChild);
                            ObjParent=Obj.parentNode; 
                            ObjParent.replaceChild(tmpObj,Obj); //here we placing our temporary data instead of our target
                            
                            
                            tmpChild.addEventListener("keyup", function(event) {
                                if (event.key === "Enter") {
                                    //When modified the comment
                                    firebase.database().ref(groupId+'/messenger/'+comment.getAttribute("commentKey")+"/thread/" + comment.getAttribute("threadKey")).child("string").set(tmpChild.value); //child.set로 해야되나?
                                    comment.remove();
                                }
                            });
                        };
                        old_thread_delete.onclick = function(){
                            firebase.database().ref(groupId+'/messenger/').child(comment.getAttribute("commentKey")).remove();
                            comment.remove();
                        };
                    }
                    else{
                        old_thread_edit.remove();
                        old_thread_delete.remove();
                    }
                })

            });
            // var reply = document.createElement("div");
            // reply.className = 
        }
    });

});


//Create comment box if user presses 'c' and clicks at certain location.
var c_wasKeyDragged = false;
document.addEventListener('keydown', listen_for_click, false);
document.addEventListener('keyup', reset_drag, false);

function listen_for_click(e) {
  	if (e.code == "KeyC"){
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

function create_comment_at_event(e){
    create_comment(e.pageX, e.pageY);
}

function create_comment(positionLeft, positionTop){

    var comment = document.createElement("div");
    comment.className = "pinComment";
    document.body.appendChild(comment);
    comment.style.position = "absolute";
    comment.style.left = positionLeft+'px';
    comment.style.top = positionTop+'px';
    comment.setAttribute("commentKey","none");
    comment.innerHTML = '<div class = "pinComment_thread"><div class = "pinComment_thread_header"> <img class = "pinComment_author_profile"> <div class = "pinComment_author_info"><div class = "pinComment_author_name"></div><div class = "pinComment_time"></div></div><img class = "pinComment_delete" src = "src/delete.png"></div><div class = "pinComment_input"><input class = "pinComment_text_input"><input type="submit" class="pinComment_text_input_enter" value="comment"></div></div></div>';
    comment.getElementsByClassName("pinComment_author_profile")[0].src = "src/"+myName+"_profile.png";
    comment.getElementsByClassName("pinComment_author_name")[0].innerHTML = myName;

    var today = new Date();
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    comment.getElementsByClassName("pinComment_time")[0].innerHTML = today.getHours() + ":" + today.getMinutes() + " " + months[today.getMonth()] + " " + today.getDate();

    var comment_text_input = comment.getElementsByClassName("pinComment_text_input")[0];
    comment_text_input.id = "pinComment_text_input";
    comment_text_input.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {send_comment();}
    });

    var enter = comment.getElementsByClassName("pinComment_text_input_enter")[0];
    enter.onclick = send_comment;
    comment.getElementsByClassName("pinComment_delete")[0].onclick = function(){
        firebase.database().ref(groupId+'/messenger/'+comment.getAttribute("commentKkey")).remove();
        comment.remove();
    };

    function send_comment(){
        if (comment.getAttribute("commentKey") === "none"){
            //When first entered the comment
            var commentKey = firebase.database().ref(groupId+'/messenger/').push({
                type: "comment",
                left: 600 + (positionLeft - window.innerWidth/2),
                top: positionTop,
                thread: "none"
            }).key;
            var threadKey = firebase.database().ref(groupId+'/messenger/'+commentKey+'/thread/').push({
                sender: studentId,
                time: today.getHours() + ":" + today.getMinutes() + " " + months[today.getMonth()] + " " + today.getDate(),
                string: comment_text_input.value
            }).key;
            comment.setAttribute("commentKey", commentKey);
            comment.setAttribute("threadKey", threadKey);
        }
        else{
            //When modified the comment
            firebase.database().ref(groupId+'/messenger/'+comment.getAttribute("commentKey")+"/thread/" + comment.getAttribute("threadKey")).child("string").set(comment_text_input.value); //child.set로 해야되나?
        }
        comment.remove();
    }
    return comment;
}



function create_old_thread(){
    var pinComment_thread = document.createElement("div");
    pinComment_thread.className = "pinComment_thread";
    pinComment_thread.innerHTML = '<div class = "pinComment_thread_header"><img class = "pinComment_author_profile"><div class = "pinComment_author_info"><div class = "pinComment_author_name"></div><div class = "pinComment_time"></div></div><img class = "pinComment_edit" src = "src/modify.png"><img class = "pinComment_delete" src = "src/delete.png"></div><div class = "pinComment_input"><div class = "pinComment_text_readOnly"></div></div>';

    return pinComment_thread;
}



function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

