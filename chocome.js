window.onload = function() {
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

    var overallPos = getOverallPos();

    var thumbnailImages = document.getElementsByClassName('thumbnail_image');
    var thumbnailImagesArr = Array.from(thumbnailImages);

    let posOnImg = [];
    for (let thumbnailImg of thumbnailImagesArr) {
        const imgNum = thumbnailImagesArr.indexOf(thumbnailImg) + 1;
        var imgTop = thumbnailImg.getBoundingClientRect().top;
        var imgLeft = thumbnailImg.getBoundingClientRect().left;
        var imgRight = thumbnailImg.getBoundingClientRect().right;

        if (imgNum % 3 == 1 || imgNum == 5) {
            let a = [];
            a.push(imgRight - 15);
            a.push(imgTop);
            posOnImg.push(a);
        } else {
            let b = [];
            b.push(imgLeft - 15);
            b.push(imgTop);
            posOnImg.push(b);
        }
    }

    var movingHuman = document.createElement("img");
    movingHuman.src = "src/human.gif";
    movingHuman.className = "human";
    movingHuman.style.left = XRandPos - 15;
    movingHuman.style.top = YRandPos - 15;
    movingHuman.style.transform = randDirection;

    

    firebase.database().ref('/chocome/').once('value').then(function(snapshot){
        snapshot.forEach(function(childSnapshot) {
            const curr = childSnapshot.val().currImg;
            const prev = childSnapshot.val().prevImg;
            const initPath = childSnapshot.val().initPath;
            const facingDir = childSnapshot.val().direction;
            var otherHuman = document.createElement("img");
            otherHuman.src = "src/human.gif";
            otherHuman.className = "human";
            
            if (curr == 0) {
                var initPos = getPositionFromPath(initPath);
                console.log(initPos);
                otherHuman.style.left = initPos[0] - 15;
                otherHuman.style.top = initPos[1] - 15;
                otherHuman.style.transform = facingDir;
            } else {
                otherHuman.style.left = (posOnImg[curr - 1])[0];
                otherHuman.style.top = (posOnImg[curr - 1])[1];
                if (curr % 3 == 1 || curr == 5) {
                    otherHuman.style.transform = 'rotate(90deg)';
                } else {
                    otherHuman.style.transform = 'rotate(-90deg)';
                }
            }
            otherHuman.setAttribute('key', childSnapshot.key);
            otherHuman.id = childSnapshot.key;
            document.body.appendChild(otherHuman);
        });
    }).then(function() {
        var newChocome = firebase.database().ref('/chocome/').push({
            prevImg : 0,
            currImg : 0,
            initPath : overallPos,
            isMoving : false,
            direction : randDirection
        }).key;
        movingHuman.setAttribute("key", newChocome);
        movingHuman.id = newChocome;
    });

    window.addEventListener('beforeunload', function(e) {
        deleteChocome();
    });

    document.body.appendChild(movingHuman);

    
    for (let thumbnailImg of thumbnailImagesArr) {
        thumbnailImg.onclick = function() {
            const imgNum = thumbnailImagesArr.indexOf(thumbnailImg) + 1;
            var thisChocome = firebase.database().ref('/chocome/'+movingHuman.getAttribute("key"));
            thisChocome.child('isMoving').once('value').then(function(moveTF){
                const movingOrNot = moveTF.val();
                if (!movingOrNot) {
                    thisChocome.child('isMoving').set(true);
                    thisChocome.child('currImg').once('value').then(function(currVal){
                        const curr = currVal.val();
                        thisChocome.child('prevImg').set(curr);
                        thisChocome.child('currImg').set(imgNum);
                        pathAlgo(curr, imgNum, overallPos, movingHuman).then(function(flag) {
                            thisChocome.child('isMoving').set(flag);
                        });
                    });
                }
            })
        };   
    }    

    function otherHumanMove() {
        firebase.database().ref('/chocome/').on('value', function(snapshot){
            snapshot.forEach(function(childSnapshot) {
                const curr = childSnapshot.val().currImg;
                const prev = childSnapshot.val().prevImg;
                const initPath = childSnapshot.val().initPath;
                const movingOrNot = childSnapshot.val().isMoving;
                var eachHuman = document.getElementById(childSnapshot.key);
                
                if (childSnapshot.key != movingHuman.getAttribute('key')) {
                    if (movingOrNot) {
                        pathAlgo(prev, curr, initPath, eachHuman);
                    }
                }
            });
        })
    }

    otherHumanMove();

    function deleteChocome() {
        console.log('hell');
        let rootRef = firebase.database().ref('/chocome/' + movingHuman.getAttribute("key"));
        rootRef.remove();
    }
      
    function move(element, direction, distance, duration=8000) {
        // function originally from https://medium.com/@theredwillows/moving-an-element-with-javascript-part-1-765c6a083d45
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
    }

    var horizontalBlockDist = Number(columnPosition[1] - columnPosition[0]);
    var verticalBlockDist = Number(rowPosition[1] - rowPosition[0]);

    function moveRightOneBlock(element) {
        element.style.transform = 'rotate(-90deg)'
        move(element, 'right', horizontalBlockDist);
    }

    function moveLeftOneBlock(element) {
        element.style.transform = 'rotate(90deg)';
        move(element, 'left', horizontalBlockDist);
    }

    function moveUpOneBlock(element) {
        element.style.transform = 'rotate(180deg)';
        move(element, 'up', verticalBlockDist);
    }

    function moveDownOneBlock(element) {
        element.style.transform = 'rotate(0deg)';
        move(element, 'down', verticalBlockDist);
    }

    var img0 = thumbnailImagesArr[0];
    var img1 = thumbnailImagesArr[3];
    var img0Top = img0.getBoundingClientRect().top;
    var img0Right = img0.getBoundingClientRect().right;
    var img1Top = img1.getBoundingClientRect().top;

    var posX = columnPosition[0];
    var posY = rowPosition[0];

    var horizontalLittleDist = Number(posX - img0Right);
    var upLittleDist = Number(posY - img0Top) - 15;
    var downLittleDist = Number(img1Top - posY) + 15;

    function moveRightLittle(element) {
        element.style.transform = 'rotate(-90deg)'
        move(element, 'right', horizontalLittleDist, 3000);
    }

    function moveLeftLittle(element) {
        element.style.transform = 'rotate(90deg)';
        move(element, 'left', horizontalLittleDist, 3000);
    }

    function moveUpLittle(element) {
        element.style.transform = 'rotate(180deg)';
        move(element, 'up', upLittleDist, 6000);
    }

    function moveDownLittle(element) {
        element.style.transform = 'rotate(0deg)';
        move(element, 'down', downLittleDist, 2000);
    }

    function exitRightLittle(element) {
        element.style.transform = 'rotate(-90deg)'
        move(element, 'right', horizontalLittleDist, 3000);
    }

    function exitLeftLittle(element) {
        element.style.transform = 'rotate(90deg)';
        move(element, 'left', horizontalLittleDist, 3000);
    }

    function exitUpLittle(element) {
        element.style.transform = 'rotate(180deg)';
        move(element, 'up', downLittleDist, 2000);
    }

    function exitDownLittle(element) {
        element.style.transform = 'rotate(0deg)';
        move(element, 'down', upLittleDist, 6000);
    }

    function pathAlgo(fromImg, toImg, initPath, element) {
        return new Promise(function(resolve, reject) {
            if (fromImg == toImg) {
                resolve(false);
            }
            let pathArr = whereToGo(fromImg, toImg, element);
            let path2 = pathArr[0];
            var delay = 0;
            if (fromImg == 0) {
                if (initPath != path2) {
                    delay = PathToPath(initPath, path2, delay, element);
                }
            } else {
                let path1 = pathArr[1];
    
                delay = ImgToPath(fromImg, delay, element);
                if (path1 != path2) {
                    delay = PathToPath(path1, path2, delay, element);
                }
            }
            delay = PathToImg(toImg, delay, element);
            setTimeout(function() {
                resolve(false); 
            }, delay);
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

    function ImgToPath(imgNum, delay, element) {
        delay += 1000;
        if (imgNum == 1 || imgNum == 2 || imgNum == 4 || imgNum == 7 || imgNum == 8) {
            setTimeout(exitRightLittle, delay, element);
            delay+=4000;
            setTimeout(exitDownLittle, delay, element);
            delay+=7000;
            return delay;
        }

        if (imgNum == 3 || imgNum == 5 || imgNum == 6 || imgNum == 9 ) {
            setTimeout(exitLeftLittle, delay, element);
            delay+=4000;
            setTimeout(exitDownLittle, delay, element);
            delay+=7000;
            return delay;
        }

        if (imgNum == 11 || imgNum == 12) {
            setTimeout(exitLeftLittle, delay, element);
            delay+=4000;
            setTimeout(exitUpLittle, delay, element);
            delay+=3000;
            return delay;
        }

        if (imgNum == 10) {
            setTimeout(exitRightLittle, delay, element);
            delay+=4000;
            setTimeout(exitUpLittle, delay, element);
            delay+=3000;
            return delay;
        }
    }

    function PathToImg(imgNum, delay, element) {
        delay += 1000;
        if (imgNum == 1 || imgNum == 2 || imgNum == 4 || imgNum == 7 || imgNum == 8) {
            setTimeout(moveUpLittle, delay, element);
            delay+=7000;
            setTimeout(moveLeftLittle, delay, element);
            delay += 4000;
            return delay;
        }

        else if (imgNum == 3 || imgNum == 5 || imgNum == 6 || imgNum == 9) {
            setTimeout(moveUpLittle, delay, element);
            delay+=7000;
            setTimeout(moveRightLittle, delay, element);
            delay += 4000;
            return delay;
        }

        else if (imgNum == 11 || imgNum == 12) {
            setTimeout(moveDownLittle, delay, element);
            delay+=3000;
            setTimeout(moveRightLittle, delay, element);
            delay += 4000;
            return delay;
        }

        else if (imgNum == 10) {
            setTimeout(moveDownLittle, delay, element);
            delay += 3000;
            setTimeout(moveLeftLittle, delay, element);
            delay += 4000;
            return delay;
        }
    }

    function PathToPath(pathNum1, pathNum2, delay, element) {
        delay += 1000;
        if (sub == 0) {
            return delay;
        }
        var sub = pathNum2 - pathNum1;
        var posDirection = true;

        if (sub < 0) {
            sub = (-1) * sub;
            posDirection = false;
        }

        if (sub == 1) {
            if (posDirection) {
                if (pathNum1 % 2) {
                    setTimeout(moveRightOneBlock, delay, element);
                    delay += 9000;
                    return delay;
                } else {
                    setTimeout(moveLeftOneBlock, delay, element);
                    delay += 9000;
                    setTimeout(moveDownOneBlock, delay, element);
                    delay += 9000;
                    return delay;
                }
            } else {
                if (pathNum1 % 2) {
                    setTimeout(moveRightOneBlock, delay, element);
                    delay += 9000;
                    setTimeout(moveUpOneBlock, delay, element);
                    delay += 9000;
                    return delay;
                } else {
                    setTimeout(moveLeftOneBlock, delay, element);
                    delay += 9000;
                    return delay;
                }
            }
        }

        if (sub == 5) {
            if (posDirection) {
                setTimeout(moveRightOneBlock, delay, element);
                delay += 9000;
                setTimeout(moveDownOneBlock, delay, element);
                delay += 9000;
                setTimeout(moveDownOneBlock, delay, element);
                delay += 9000;
            } else {
                setTimeout(moveLeftOneBlock, delay, element);
                delay += 9000;
                setTimeout(moveUpOneBlock, delay, element);
                delay += 9000;
                setTimeout(moveUpOneBlock, delay, element);
                delay += 9000;
            }
            return delay;
        }

        if (sub == 3) {
            if (posDirection) {
                if (pathNum1 % 2) {
                    setTimeout(moveDownOneBlock, delay, element);
                    delay += 9000;
                    setTimeout(moveRightOneBlock, delay, element);
                    delay += 9000;
                } else {
                    setTimeout(moveLeftOneBlock, delay, element);
                    delay += 9000;
                    setTimeout(moveDownOneBlock, delay, element);
                    delay += 9000;
                }
            } else {
                if (pathNum2 % 2) {
                    setTimeout(moveUpOneBlock, delay, element);
                    delay += 9000;
                    setTimeout(moveLeftOneBlock, delay, element);
                    delay += 9000;
                } else {
                    setTimeout(moveRightOneBlock, delay, element);
                    delay += 9000;
                    setTimeout(moveUpOneBlock, delay, element);
                    delay += 9000;
                    setTimeout(moveUpOneBlock, delay, element);
                    delay += 9000;
                }
            }
            return delay;
        }

        if (sub == 4) {
            if (posDirection) {
                setTimeout(moveDownOneBlock, delay, element);
                delay += 9000;
                setTimeout(moveDownOneBlock, delay, element);
                delay += 9000;
            } else {
                setTimeout(moveUpOneBlock, delay, element);
                delay += 9000;
                setTimeout(moveUpOneBlock, delay, element);
                delay += 9000;
            }
            return delay;
        }

        if (sub == 2) {
            if (posDirection) {
                setTimeout(moveDownOneBlock, delay, element);
                delay += 9000;
                return delay;
            } else {
                setTimeout(moveUpOneBlock, delay, element);
                delay += 9000;
                return delay;
            }
        }
    }
}
