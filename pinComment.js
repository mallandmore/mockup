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

document.addEventListener("click", myFunction, false);

function myFunction(x){
    var positionLeft = x.clientX;
    var positionTop = x.clientY;
    context.fillStyle = "#000000";
    context.beginPath();
    context.arc(positionLeft, positionTop, 50, 0, 2*Math.PI);
    context.fill();
}
