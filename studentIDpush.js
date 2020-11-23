var studentId = getParameterByName('studentId');

window.addEventListener('load', function() {
    window.addEventListener('beforeunload', function(e) {
        deleteChocome();
    });

    function deleteChocome() {
        var rootRef = firebase.database().ref('/chocome/');
        rootRef.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                if (studentId == childSnapshot.val().userId && childSnapshot.val().yetOnline) {
                    firebase.database().ref('/removeQueue/').push({
                        key: myChocomeKey,
                        uid: studentId
                    });
                    firebase.database().ref('/chocome/'+childSnapshot.key).remove();
                }
            })
        })
    }
})

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

