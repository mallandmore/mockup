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
        // fcomment.addEventListener("click", function(e) {
        //     console.log("Click fcomment")
        // });
    });
});


// document.addEventListener("dblclick", create_comment, false);

document.addEventListener('keypress', listen_for_click, false);

function listen_for_click(e) {
    // console.log("keypressed");
//   console.log(e.code);
  	if (e.code == "KeyC"){
    	console.log("c");
    	document.addEventListener("click", create_comment, {once:true});
    //   document.removeEventListener("click", create_comment, false);
	}
}

function create_comment(x){
    // document.removeEventListener("click");
	console.log("clicked")

    var positionLeft = x.pageX;
    var positionTop = x.pageY;

    //original
    // var comment = document.createElement("input",{type:"text"});
    // document.body.appendChild(comment);
    // comment.style.position = "absolute";
    // comment.style.left = positionLeft+'px';
    // comment.style.top = positionTop+'px';
    // comment.setAttribute("key","none");
    // comment.zIndex = 10;
    
    //introduced div
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
    }


    //button shape miss, image not appearing
    // var modify = document.createElement("button");
    // comment_div.appendChild(modify);
    // modify.className = "comment_div";
    // modify.style.background = "url('src/modify.png')";
    // modify.addEventListener ("click", function() {
    //     comment.readOnly = false;
    // });

    //Create img element
    // var modify = document.createElement("img");
    // document.body.appendChild(modify);
    // modify.src = "src/modify.png";
    // modify.width = comment.offsetHeight;
    // modify.height = comment.offsetHeight;
    // modify.style.left = comment.style.right + 'px';//doesnt work
    // modify.onclick = function(){
    //     comment.readOnly = false;
    // }

    //Create the button
    // var modify_button = document.createElement("button");
    // modify_button.className = "button";
    // modify_button.style.background = "url('src/modify.png')";
    // document.body.appendChild(modify_button);


    // modify_button.innerHTML = '<img src="src/modify.png"/>';
    // modify_button.style.position = "absolute";
    // modify_button.style.left = comment.style.right;
    // modify_button.style.top = comment.style.top;
    // modify_button.offsetHeight = comment.offsetHeight+"px";

    // var w=comment.offsetWidth;
    // modify_button.setAttribute("style","width:"+w+"px");
    // modify_button.setAttribute("style","height:"+w+"px");

    // // modify_button.offsetWidth = modify_button.offsetHeight+'px';
    
    // document.getElementById("modifyImg").setAttribute("style","width:"+w+"px");
    // document.getElementById("modifyImg").setAttribute("style","height:"+w+"px");


    // modify_button.addEventListener ("click", function() {
    //     comment.readOnly = false;
    // });

    /* Read 

    https://css-tricks.com/use-button-element/
    */


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
            // comment.entered = true;
        }
    });
    
    // comment.addEventListener("dblclick", function(e) {
    //     console.log("dblclick")
    //     comment.readOnly = false;
    // });
    // document.removeEventListener("click");
}


