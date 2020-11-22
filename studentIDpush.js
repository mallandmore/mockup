var studentId = getParameterByName('studentId');

var userData = firebase.database().ref('/onlineUsers/').push({
    uid : studentId
}).key;

window.addEventListener('beforeunload', function(e) {
    firebase.database().ref('/onlineUsers/'+userData).remove();
})

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

