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

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

var init = firebase.initializeApp({
    apiKey: "만든키",
    authDomain: "만든도메인",
    databaseURL: "만든주소",
    projectId: "아이디0",
    storageBucket: "만든버킷저장소",
    messagingSenderId: "아이디1",
    appId: "아이디2",
    measurementId: "아이디3"
});

var db = init.firestore();  //위 설정대로 저장소에 접속합니다.
let ref = db.collection('board');  //내가 사용할 컬렉션입니다.