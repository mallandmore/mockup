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

// 브라우서 호환 ( 크로스브라우징 ) 체크 하여 문서 전체에 mousemove 이벤트를 걸어줍니다.
if ( document.addEventListener ) {
    document.addEventListener("mousemove",resultFun,false);
} else if ( document.attachEvent ) {
    document.attachEvent("onmousemove",resultFun);
} else {
    document.onmousemove = resultFun;
}

//  문서에서 마우스가 움직일때(mousemove) 마다 resultFun() 함수가 실행됩니다.
//  x.clientX,Y 는 페이지에서 이벤트 발생한 X,Y 좌표를 가져옵니다.
function resultFun(x) {
    var xY = x.clientX +  " * "  + x.clientY ;
    var positionLeft = x.clientX;
    var positionTop = x.clientY;
    // result  div 에 innerHTML 로 xY 변수를 적용 합니다.
    document.getElementById('result').innerHTML = xY;
    //  result  div 의 position 위치를  positionLeft, Top 변수 값으로 style 적용해줍니다.
    document.getElementById('result').style.left = ( positionLeft - 15 ) + "px";
    document.getElementById('result').style.top = ( positionTop + 50 ) + "px";

    firebase.database().ref('XY/').set({
        X : positionLeft,
        Y : positionTop 
    });
}

