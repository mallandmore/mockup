var studentId = getParameterByName('studentId');

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

window.addEventListener('load', function() {
    var avenueRows = document.getElementsByClassName('avenue_row');
    var avenueColumns = document.getElementsByClassName('avenue_col');

    let rowPosition = [];
    let columnPosition = [];

    let initDirection = ['rotate(0deg)', 'rotate(-90deg)', 'rotate(90deg)', 'rotate(180deg)'];

    for (let i of avenueRows) {
        var abTop = i.getBoundingClientRect().top + window.pageYOffset;
        var abBottom = i.getBoundingClientRect().bottom + window.pageYOffset;
        var rowPos = (abTop + abBottom) / 2;
        rowPosition.push(rowPos);
    }

    for (let j of avenueColumns) {
        var abLeft = j.getBoundingClientRect().left + window.pageXOffset;
        var abRight = j.getBoundingClientRect().right + window.pageXOffset;
        var columnPos = (abLeft + abRight) / 2;
        columnPosition.push(columnPos);
    }

    columnPosition.splice(2, columnPosition.length - 1);

    const IndexX = Math.floor(Math.random() * 100) % (columnPosition.length);
    const IndexY = Math.floor(Math.random() * 100) % (rowPosition.length);
    const RandD = Math.floor(Math.random() * 100) % (initDirection.length);
    
    var XRandPos = columnPosition[IndexX];
    var YRandPos = rowPosition[IndexY];
    var randDirection = initDirection[RandD];

    overallPos = getOverallPos();

    function getOverallPos() {
        if (IndexX == 0) {
            if (IndexY == 0) {
                return 1;
            } else if (IndexY == 1) {
                return 3;
            } else if (IndexY == 2) {
                return 5;
            }
        } else if (IndexX == 1) {
            if (IndexY == 0) {
                return 2;
            } else if (IndexY == 1) {
                return 4;
            } else if (IndexY == 2) {
                return 6;
            }
        }
    }

    function getPositionFromPath(path) {
        let pos = [];
        if (path % 2) {
            pos.push(Number(columnPosition[0]));
        } else {
            pos.push(Number(columnPosition[1]));
        }
        
        if (path == 1 || path == 2) {
            pos.push(Number(rowPosition[0]));
        } else if (path == 3 || path == 4) {
            pos.push(Number(rowPosition[1]));
        } else if (path == 5 || path == 6) {
            pos.push(Number(rowPosition[2]));
        }
        
        return pos;
    }

    var thumbnailImages = document.getElementsByClassName('thumbnail_image');
    var thumbnailImagesArr = Array.from(thumbnailImages);

    let posOnImg = [];
    for (let thumbnailImg of thumbnailImagesArr) {
        const imgNum = thumbnailImagesArr.indexOf(thumbnailImg) + 1;
        var imgTop = thumbnailImg.getBoundingClientRect().top + window.pageYOffset;
        var imgLeft = thumbnailImg.getBoundingClientRect().left + window.pageXOffset;
        var imgRight = thumbnailImg.getBoundingClientRect().right + window.pageXOffset;

        if (imgNum % 3 == 1 || imgNum == 2 || imgNum == 8) {
            let a = [];
            a.push(imgRight - 8);
            a.push(imgTop);
            posOnImg.push(a);
        } else {
            let b = [];
            b.push(imgLeft - 8);
            b.push(imgTop);
            posOnImg.push(b);
        }
    }

    firebase.database().ref('chocomeUsers/' + studentId).set({onDiffPage : false});

    showHuman();
    var myChocomeKey = null;
    newChocomeAdd().then(function(chocomeKey) {
        myChocomeKey = chocomeKey;
        console.log(myChocomeKey);
        window.addEventListener('beforeunload', function(e) {
            var rootRef = firebase.database().ref('/chocome/');
            rootRef.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    if (studentId == childSnapshot.val().userId && !childSnapshot.val().yetOnline) {
                        firebase.database().ref('/removeQueue/').push({
                            key: myChocomeKey,
                            uid: studentId
                        });
                        firebase.database().ref('/chocome/'+chocomeKey).remove();
                    }
                })
            })
        });
        listenToClick();
        moveHumans(chocomeKey);
    });

    var d = new Date();
    var insertionTime = d.getTime();

    function humanOnBody() {
        var otherHuman = document.createElement("div");
        otherHuman.className = "human_with_state";
        var humanImg = document.createElement("img");
        humanImg.src = "src/human.gif";
        humanImg.className = "human";
        var stateImg = document.createElement("img");
        stateImg.src = "src/lookState.png";
        stateImg.className = "human_state";                            
        otherHuman.appendChild(stateImg);
        otherHuman.appendChild(humanImg);
        return otherHuman;
    }

    function showHuman() {
        firebase.database().ref('/chocome/').on('value', function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                const uid = childSnapshot.val().userId;
                
                const removeQueueEntry = firebase.database().ref('/removeQueue/');
                removeQueueEntry.on('value', function(removeSnapshot){
                    removeSnapshot.forEach(function(removeChildSnapshot) {
                        var removeUser = removeChildSnapshot.val().uid;
                        var removeHuman = document.getElementById(removeUser);
                        if (removeHuman != null) {
                            removeHuman.remove();
                        }
                        removeQueueEntry.child(removeChildSnapshot.key).remove();
                    });
                });
                
                if (uid != studentId) {
                    const curr = childSnapshot.val().currImg;
                    const prev = childSnapshot.val().prevImg;
                    const initPath = childSnapshot.val().initPath;
                    const facingDir = childSnapshot.val().direction;
                    const movingOrNot = childSnapshot.val().isMoving;
                    const movingTime = childSnapshot.val().movingStartTime;
                    const yetOnlineOrNot = childSnapshot.val().yetOnline;
                    console.log(uid);
                    if (document.getElementById(uid) == null){
                        if (insertionTime > movingTime && movingOrNot) {
                            var otherHuman = humanOnBody();
                            otherHuman.style.left = (posOnImg[curr - 1])[0];
                            otherHuman.style.top = (posOnImg[curr - 1])[1];
                            if (curr % 3 == 1 || curr == 2 || curr == 8) {
                                otherHuman.childNodes[1].style.transform = 'rotate(90deg)';
                            } else {
                                otherHuman.childNodes[1].style.transform = 'rotate(-90deg)';
                            }
                            otherHuman.childNodes[0].style.visibility = 'visible';
                            otherHuman.setAttribute('key', childSnapshot.key);
                            otherHuman.id = uid;
                            document.body.appendChild(otherHuman);
                        } else if (!movingOrNot) {
                            var otherHuman = humanOnBody();
                            if (curr == 0) {
                                var initPos = getPositionFromPath(initPath);
                                otherHuman.style.left = initPos[0] - 8;
                                otherHuman.style.top = initPos[1] - 8;
                                otherHuman.childNodes[1].style.transform = facingDir;
                            } else {
                                otherHuman.style.left = (posOnImg[curr - 1])[0];
                                otherHuman.style.top = (posOnImg[curr - 1])[1];
                                if (curr % 3 == 1 || curr == 2 || curr == 8) {
                                    otherHuman.childNodes[1].style.transform = 'rotate(90deg)';
                                } else {
                                    otherHuman.childNodes[1].style.transform = 'rotate(-90deg)';
                                }
                                otherHuman.childNodes[0].style.visibility = 'visible';
                            }
                            otherHuman.setAttribute('key', childSnapshot.key);
                            otherHuman.id = uid;
                            document.body.appendChild(otherHuman);
                        }
                    }
                }
            });
        });
    }
    
    function newChocomeAdd () {
        return new Promise (function(resolve, reject) {
            var rootRef = firebase.database().ref('/chocome/');
            var newChocome = null;
            var yetOnlineOrNot = false;
            rootRef.once('value').then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                    if (studentId == childSnapshot.val().userId) {
                        yetOnlineOrNot = true;
                        newChocome = childSnapshot.key;
                    }
                })
            }).then(function() {
                if (!yetOnlineOrNot) {
                    newChocome = firebase.database().ref('/chocome/').push({
                        prevImg : 0,
                        currImg : 0,
                        initPath : overallPos,
                        isMoving : false,
                        direction : randDirection,
                        userId : studentId,
                        movingStartTime : 0,
                        yetOnline : false
                    }).key;
                }
            }).then(function() {
                console.log(newChocome);
                resolve(newChocome);
            })
        })
    }

    function listenToClick() {
        for (let thumbnailImg of thumbnailImagesArr) {
            thumbnailImg.onclick = function() {
                const imgNum = thumbnailImagesArr.indexOf(thumbnailImg) + 1;
                var thisChocome = firebase.database().ref('/chocome/'+myChocomeKey);
                var movingOrNot;
                firebase.database().ref('chocomeUsers/' + studentId).set({onDiffPage : true});
                thisChocome.child('isMoving').once('value').then(function(moveTF){
                    movingOrNot = moveTF.val();
                }).then(function(){
                    if (!movingOrNot) {
                        thisChocome.child('currImg').once('value').then(function(currVal){
                            const curr = currVal.val();
                            var day = new Date();
                            var time = day.getTime();
                            thisChocome.update({
                                prevImg : curr,
                                currImg : imgNum,
                                movingStartTime : time,
                                isMoving : true,
                                yetOnline : true
                            });
                        });
                    }
                });
            }
        }
    }

    function moveHumans(myChocomeKey) {
        firebase.database().ref('/chocome/').on('child_changed', function(childSnapshot, prevValue) {
            //console.log(childSnapshot.key);
            const initPath = childSnapshot.val().initPath;
            const movingTime = childSnapshot.val().movingStartTime;
            const movingOrNot = childSnapshot.val().isMoving;
            const uid = childSnapshot.val().userId;
            const onlineOrNot = childSnapshot.val().yetOnline;
            const thisDirection = childSnapshot.val().direction;
            const thisInitPath = childSnapshot.val().initPath;
            var eachHuman = document.getElementById(uid);
            if (uid != studentId) {
                if (movingOrNot && insertionTime < movingTime) {
                    var curr = childSnapshot.child('currImg').val();
                    var prev = childSnapshot.child('prevImg').val();
                    eachHuman.childNodes[0].style.visibility = 'hidden';
                    pathAlgo(prev, curr, initPath, eachHuman).then(function(flag) {
                        if (flag)  {
                            firebase.database().ref('/chocome/'+childSnapshot.key).set({
                                prevImg : prev,
                                currImg : curr,
                                initPath : thisInitPath,
                                isMoving : false,
                                direction : thisDirection,
                                userId : uid,
                                movingStartTime : movingTime,
                                yetOnline : false
                            });
                            eachHuman.childNodes[0].style.visibility = 'visible';
                        }
                    });
                }
            }
        });
    }
    
    function move(element, direction, distance, duration) {
        // function originally from https://medium.com/@theredwillows/moving-an-element-with-javascript-part-1-765c6a083d45
        return new Promise(function (resolve, reject) {
            var topOrLeft = (direction=="left" || direction=="right") ? "left" : "top";
            var isNegated = (direction=="up" || direction=="left");
            if (isNegated) { distance *= -1; }
            var elStyle = window.getComputedStyle(element);
            var value = elStyle.getPropertyValue(topOrLeft).replace("px", "");
            var destination = Number(value) + distance;
            var frameDistance = distance / (duration / 10);
            function moveAFrame() {
            elStyle = window.getComputedStyle(element);
            value = elStyle.getPropertyValue(topOrLeft).replace("px", "");
            var newLocation = Number(value) + frameDistance;
            var beyondDestination = ( (!isNegated && newLocation>=destination) || (isNegated && newLocation<=destination) );
            if (beyondDestination) {
                element.style[topOrLeft] = destination + "px";
                clearInterval(movingFrames);
            }
            else {
                element.style[topOrLeft] = newLocation + "px";
            }
            }
            var movingFrames = setInterval(moveAFrame, 10);
            setTimeout(function() {
                resolve(true)
            }, duration);
        });
    }
    
    var horizontalBlockDist = Number(columnPosition[1] - columnPosition[0]);
    var verticalBlockDist = Number(rowPosition[1] - rowPosition[0]);

    function moveRightOneBlock(element) {
        element.childNodes[1].style.transform = 'rotate(-90deg)'
        return move(element, 'right', horizontalBlockDist, 6000);
    }

    function moveLeftOneBlock(element) {
        element.childNodes[1].style.transform = 'rotate(90deg)';
        return move(element, 'left', horizontalBlockDist, 6000);
    }

    function moveUpOneBlock(element) {
        element.childNodes[1].style.transform = 'rotate(180deg)';
        return move(element, 'up', verticalBlockDist, 8000);
    }

    function moveDownOneBlock(element) {
        element.childNodes[1].style.transform = 'rotate(0deg)';
        return move(element, 'down', verticalBlockDist, 8000);
    }

    var img0 = thumbnailImagesArr[0];
    var img1 = thumbnailImagesArr[3];
    var img0Top = img0.getBoundingClientRect().top + window.pageYOffset;
    var img0Right = img0.getBoundingClientRect().right + window.pageXOffset;
    var img1Top = img1.getBoundingClientRect().top + window.pageYOffset;

    var posX = columnPosition[0];
    var posY = rowPosition[0];

    var horizontalLittleDist = Number(posX - img0Right);
    var upLittleDist = Number(posY - img0Top) - 8;
    var downLittleDist = Number(img1Top - posY) + 8;

    function moveRightLittle(element) {
        element.childNodes[1].style.transform = 'rotate(-90deg)'
        return move(element, 'right', horizontalLittleDist, 2000);
    }

    function moveLeftLittle(element) {
        element.childNodes[1].style.transform = 'rotate(90deg)';
        return move(element, 'left', horizontalLittleDist, 2000);
    }

    function moveUpLittle(element) {
        element.childNodes[1].style.transform = 'rotate(180deg)';
        return move(element, 'up', upLittleDist, 6000);
    }

    function moveDownLittle(element) {
        element.childNodes[1].style.transform = 'rotate(0deg)';
        return move(element, 'down', downLittleDist, 2000);
    }

    function exitRightLittle(element) {
        element.childNodes[1].style.transform = 'rotate(-90deg)'
        return move(element, 'right', horizontalLittleDist, 2000);
    }

    function exitLeftLittle(element) {
        element.childNodes[1].style.transform = 'rotate(90deg)';
        return move(element, 'left', horizontalLittleDist, 2000);
    }

    function exitUpLittle(element) {
        element.childNodes[1].style.transform = 'rotate(180deg)';
        return move(element, 'up', downLittleDist, 2000);
    }

    function exitDownLittle(element) {
        element.childNodes[1].style.transform = 'rotate(0deg)';
        return move(element, 'down', upLittleDist, 6000);
    }

    function pathAlgo(fromImg, toImg, initPath, element) {
        return new Promise(function(resolve, reject) {
            if (fromImg == toImg) {
                console.log('this');
                resolve(true);
                return;
            }
            let pathArr = whereToGo(fromImg, toImg, element);
            let path2 = pathArr[0];
            if (fromImg == 0) {
                if (initPath != path2) {
                    PathToPath(initPath, path2, element).then(function(flag1) {
                        if (flag1) PathToImg(toImg, element).then(function(flag2) {
                            if (flag2) {
                                resolve(true);
                                return;
                            }
                        });
                    });
                } else {
                    PathToImg(toImg, element).then(function(flag) {
                        if (flag) {
                            resolve(true);
                            return;
                        }
                    });
                }
            } else {
                let path1 = pathArr[1];
                ImgToPath(fromImg, element).then(function(flag1) {
                    if (flag1) {
                        if (path1 != path2) {
                            PathToPath(path1, path2, element).then(function(flag2) {
                                if (flag2) PathToImg(toImg, element).then(function(flag3) {
                                    if (flag3) {
                                        resolve(true);
                                        return;
                                    }
                                });
                            });
                        } else {
                            PathToImg(toImg, element).then(function(flag2) {
                                if (flag2) {
                                    resolve(true);
                                    return;
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    function whereToGo(imgNum1, imgNum2) {
        let pathArr = [];
        
        if (imgNum2 == 1) {
            pathArr.push(1);
        } else if (imgNum2 == 2 || imgNum2 == 3) {
            pathArr.push(2);
        } else if (imgNum2 == 4 || imgNum2 == 5) {
            pathArr.push(3);
        } else if (imgNum2 == 6) {
            pathArr.push(4);
        } else if (imgNum2 == 7 || imgNum2 == 10 || imgNum2 == 11) {
            pathArr.push(5);
        } else {
            pathArr.push(6);
        }

        if (imgNum1 == 0) {
            return pathArr;
        }

        if (imgNum1 == 1) {
            pathArr.push(1);
        } else if (imgNum1 == 3 || imgNum1 == 2) {
            pathArr.push(2);
        } else if (imgNum1 == 4 || imgNum1 == 5) {
            pathArr.push(3);
        } else if (imgNum1 == 6) {
            pathArr.push(4);
        } else if (imgNum1 == 7 || imgNum1 == 11 || imgNum1 == 10) {
            pathArr.push(5);
        } else {
            pathArr.push(6);
        }

        return pathArr;
    }

    function ImgToPath(imgNum, element) {
        return new Promise(function(resolve, reject) {
            if (imgNum == 1 || imgNum == 2 || imgNum == 4 || imgNum == 7 || imgNum == 8) {
                exitRightLittle(element).then(function(flag1) {
                    if (flag1) exitDownLittle(element).then(function(flag2) {
                        if (flag2) {
                            resolve(true);
                            return;
                        }
                    });
                });
            } else if (imgNum == 3 || imgNum == 5 || imgNum == 6 || imgNum == 9 ) {
                exitLeftLittle(element).then(function(flag1) {
                    if (flag1) exitDownLittle(element).then(function(flag2) {
                        if (flag2) {
                            resolve(true);
                            return;
                        }
                    });
                });
            } else if (imgNum == 11 || imgNum == 12) {
                exitLeftLittle(element).then(function(flag1) {
                    if (flag1) exitUpLittle(element).then(function(flag2) {
                        if (flag2) {
                            resolve(true);
                            return;
                        }
                    });
                });
            } else if (imgNum == 10) {
                exitRightLittle(element).then(function(flag1) {
                    if (flag1) exitUpLittle(element).then(function(flag2) {
                        if (flag2) {
                            resolve(true);
                            return;
                        }
                    });
                });
            }
        });
    }

    function PathToImg(imgNum, element) {
        return new Promise(function(resolve, reject) {
            if (imgNum == 1 || imgNum == 2 || imgNum == 4 || imgNum == 7 || imgNum == 8) {
                moveUpLittle(element).then(function(flag1) {
                    if (flag1) moveLeftLittle(element).then(function(flag2) {
                        if (flag2) {
                            resolve(true);
                            return;
                        }
                    });
                });
            } else if (imgNum == 3 || imgNum == 5 || imgNum == 6 || imgNum == 9) {
                moveUpLittle(element).then(function(flag1) {
                    if (flag1) moveRightLittle(element).then(function(flag2) {
                        if (flag2) {
                            resolve(true);
                            return;
                        }
                    });
                });
            } else if (imgNum == 11 || imgNum == 12) {
                moveDownLittle(element).then(function(flag1) {
                    if (flag1) moveRightLittle(element).then(function(flag2) {
                        if (flag2) {
                            resolve(true);
                            return;
                        }
                    });
                });
            } else if (imgNum == 10) {
                moveDownLittle(element).then(function(flag1) {
                    if (flag1) moveLeftLittle(element).then(function(flag2) {
                        if (flag2) {
                            resolve(true);
                            return;
                        }
                    });
                });
            }
        });
    }

    function PathToPath(pathNum1, pathNum2, element) {
        return new Promise(function(resolve, reject) {
            var sub = pathNum2 - pathNum1;
            var posDirection = true;
            if (sub < 0) {
                sub = (-1) * sub;
                posDirection = false;
            }
            
            if (sub == 0) {
                resolve(true);
                return;
            } else if (sub == 1) {
                if (posDirection) {
                    if (pathNum1 % 2) {
                        moveRightOneBlock(element).then(function(flag) {
                            if (flag) {
                                resolve(true);
                                return;
                            }
                        });
                    } else {
                        moveLeftOneBlock(element).then(function(flag1) {
                            if (flag1) moveDownOneBlock(element).then(function(flag2) {
                                if (flag2) {
                                    resolve(true);
                                    return;
                                }
                            });
                        });
                    }
                } else {
                    if (pathNum1 % 2) {
                        moveRightOneBlock(element).then(function(flag1) {
                            if (flag1) moveUpOneBlock(element).then(function(flag2) {
                                if (flag2) {
                                    resolve(true);
                                    return;
                                }
                            });
                        });
                    } else {
                        moveLeftOneBlock(element).then(function(flag) {
                            if (flag) {
                                resolve(true);
                                return;
                            }
                        });
                    }
                }
            } else if (sub == 2) {
                if (posDirection) {
                    moveDownOneBlock(element).then(function(flag) {
                        if (flag) {
                            resolve(true);
                            return;
                        }
                    });
                } else {
                    moveUpOneBlock(element).then(function(flag) {
                        if (flag) {
                            resolve(true);
                            return;
                        }
                    });
                }
            } else if (sub == 3) {
                if (posDirection) {
                    if (pathNum1 % 2) {
                        moveDownOneBlock(element).then(function(flag1) {
                            if (flag1) moveRightOneBlock(element).then(function(flag2) {
                                if (flag2) {
                                    resolve(true);
                                    return;
                                }
                            });
                        });
                    } else {
                        moveLeftOneBlock(element).then(function(flag1) {
                            if (flag1) moveDownOneBlock(element).then(function(flag2) {
                                if (flag2) {
                                    resolve(true);
                                    return;
                                }
                            });
                        });
                    }
                } else {
                    if (pathNum2 % 2) {
                        moveUpOneBlock(element).then(function(flag1) {
                            if (flag1) moveLeftOneBlock(element).then(function(flag2) {
                                if (flag2) {
                                    resolve(true);
                                    return;
                                }
                            });
                        });
                    } else {
                        moveRightOneBlock(element).then(function(flag1) {
                            if (flag1) moveUpOneBlock(element).then(function(flag2) {
                                if (flag2) moveUpOneBlock(element).then(function(flag3) {
                                    if (flag3) {
                                        resolve(true);
                                        return;
                                    }
                                });
                            });
                        });
                    }
                }
            } else if (sub == 4) {
                if (posDirection) {
                    moveDownOneBlock(element).then(function(flag1) {
                        if (flag1) moveDownOneBlock(element).then(function(flag2) {
                            if (flag2) {
                                resolve(true);
                                return;
                            }
                        });
                    });
                } else {
                    moveUpOneBlock(element).then(function(flag1) {
                        if (flag1) moveUpOneBlock(element).then(function(flag2) {
                            if (flag2) {
                                resolve(true);
                                return;
                            }
                        });
                    });
                }
            } else if (sub == 5) {
                if (posDirection) {
                    moveRightOneBlock(element).then(function(flag1) {
                        if (flag1) moveDownOneBlock(element).then(function(flag2) {
                            if (flag2) moveDownOneBlock(element).then(function(flag3) {
                                if (flag3) {
                                    resolve(true);
                                    return;
                                }
                            });
                        });
                    });
                } else {
                    moveLeftOneBlock(element).then(function(flag1) {
                        if (flag1) moveUpOneBlock(element).then(function(flag2) {
                            if (flag2) moveUpOneBlock(element).then(function(flag3) {
                                if (flag3) {
                                    resolve(true);
                                    return;
                                }
                            });
                        });
                    });
                }
            }
        });
    }            
})
