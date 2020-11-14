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

    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const img3 = document.getElementById('img3');

    const train1 = document.getElementById('train1');

    var imgNum;

    img1.onclick = function() {
        const currImg = 1;
        firebase.database().ref('/imageClick/curr').once('value').then(function(currVal){
            const temp = currVal.val();
            firebase.database().ref('imageClick/').set({
                prev : temp,
                curr : currImg
            });
        });

        firebase.database().ref('/imageClick/prev').once('value').then(function(prevVal) {
            const prevImg = prevVal.val();
            if (prevImg < currImg) {
                train1.setAttribute('state', '1');
            } else {
                train1.setAttribute('state', '2');
            }

            if (train1.getAttribute('state') == '1') {
                train1.style.transform = 'rotate(-90deg)';
            } else if (train1.getAttribute('state') == '2') {
                train1.style.transform = 'rotate(90deg)';
            }
            train1.style.left = img1.getBoundingClientRect().left;
        });
    }

    img2.onclick = function() {
        const currImg = 2;
        firebase.database().ref('/imageClick/curr').once('value').then(function(currVal){
            const temp = currVal.val();
            firebase.database().ref('imageClick/').set({
                prev : temp,
                curr : currImg
            });
        });

        firebase.database().ref('/imageClick/prev').once('value').then(function(prevVal) {
            const prevImg = prevVal.val();
            if (prevImg < currImg) {
                train1.setAttribute('state', '1');
            } else {
                train1.setAttribute('state', '2');
            }

            if (train1.getAttribute('state') == '1') {
                train1.style.transform = 'rotate(-90deg)';
            } else if (train1.getAttribute('state') == '2') {
                train1.style.transform = 'rotate(90deg)';
            }
            train1.style.left = img2.getBoundingClientRect().left;
        });
    }

    img3.onclick = function() {
        const currImg = 3;
        firebase.database().ref('/imageClick/curr').once('value').then(function(currVal){
            const temp = currVal.val();
            firebase.database().ref('imageClick/').set({
                prev : temp,
                curr : currImg
            });
        });

        firebase.database().ref('/imageClick/prev').once('value').then(function(prevVal) {
            const prevImg = prevVal.val();
            if (prevImg < currImg) {
                train1.setAttribute('state', '1');
            } else {
                train1.setAttribute('state', '2');
            }

            if (train1.getAttribute('state') == '1') {
                train1.style.transform = 'rotate(-90deg)';
            } else if (train1.getAttribute('state') == '2') {
                train1.style.transform = 'rotate(90deg)';
            }
            train1.style.left = img3.getBoundingClientRect().left;
        });
    }

    
    //alert(rect.left);
    // train1.onclick = function() {
    //     if (this.getAttribute('state') == '1') {
    //         this.style.transform = 'rotate(-90deg)';
    //         this.style.left = '900px';
    //         this.setAttribute('state', '2');
    //     } else if (this.getAttribute('state') == '2') {
    //         this.style.transform = 'rotate(90deg)';
    //         this.style.left = '0px';
    //         this.setAttribute('state', '1');
    //     }
    // }

    // firebase.database().ref('/imageClick/').once('value').then(function(snapshot) {
    //     snapshot.forEach(function(childSnapshot) {
    //         const currImg = childSnapshot.val().curr;
    //         const prevImg = childSnapshot.val().prev;
            
    //         if (currImg >= prevImg) {
    //             train1.setAttribute('state', '1');
    //         } else {
    //             train1.setAttribute('state', '2');
    //         }

    //         if (currImg == 1) {
    //             rect = img1.getBoundingClientRect();
    //             if (train1.getAttribute('state') == '1') {
    //                 train1.style.transform = 'rotate(90deg)';
    //             } else if (train1.getAttribute('state') == '2') {
    //                 train1.style.transform = 'rotate(-90deg)';
    //             }
    //             train1.style.left = rect.left;
    //         } else if (currImg == 2) {
    //             rect = img2.getBoundingClientRect();
    //             if (train1.getAttribute('state') == '1') {
    //                 train1.style.transform = 'rotate(90deg)';
    //             } else if (train1.getAttribute('state') == '2') {
    //                 train1.style.transform = 'rotate(-90deg)';
    //             }
    //             train1.style.left = '400px';
    //         } else if (currImg == 3) {
    //             rect = img3.getBoundingClientRect();
    //             if (train1.getAttribute('state') == '1') {
    //                 train1.style.transform = 'rotate(90deg)';
    //             } else if (train1.getAttribute('state') == '2') {
    //                 train1.style.transform = 'rotate(-90deg)';
    //             }
    //             train1.style.left = rect.left;
    //         }
    //     });
    // });


}
