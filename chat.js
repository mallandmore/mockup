


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

    const root = document.getElementById('root');

    // root.onclick = function(){
    //     console.log('s');
    //     firebase.database().ref('users/').push({
    //         string: 'hi'
    //     });
    // };

    const fname = document.getElementById('fname');
    const fsubmit = document.getElementById('fsubmit');

    fsubmit.onclick = function() {
        firebase.database().ref('users/').push({
            string: fname.value
        });
    }

    const train1 = document.getElementById('train1');

    train1.onclick = function() {
        if (this.getAttribute('state') == '1') {
            this.style.transform = 'rotate(-90deg)';
            this.style.left = '450px';
            this.setAttribute('state', '2');
        } else if (this.getAttribute('state') == '2') {
            this.style.transform = 'rotate(90deg)';
            this.style.left = '0px';
            this.setAttribute('state', '1');
        }
    }


    firebase.database().ref('/users/').on('value', function(snapshot) {
        var sb = '';
        snapshot.forEach(function(childSnapshot) {
            var childKey = childSnapshot.key;
            console.log(childSnapshot.val().string);
            sb = sb + childSnapshot.val().string + "<br>";
        });

        root.innerHTML = sb;
    });

    // update friend's cursor position
    const friend = document.getElementById('friend');
    firebase.database().ref('/XY/X').on('value', function(posX){
        friend.style.left = posX.val() + "px";
    });
    firebase.database().ref('/XY/Y').on('value', function(posY){
        friend.style.top = posY.val() + "px";
    });

}





