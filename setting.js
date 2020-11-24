
window.addEventListener('load', function() {
    document.getElementById("resetDatabase").addEventListener('click', function() {
        firebase.database().ref().set(null);
        firebase.database().ref('/0/friends/20210374/').set({
            goToLink: 0,
            name: "Sally",
            togetherModeState: "off"
        });
        firebase.database().ref('/0/friends/20210473/').set({
            goToLink: 0,
            name: "Owen",
            togetherModeState: "off"
        });
        alert("Reset Success!");
    });
});
