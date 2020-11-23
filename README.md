# Mall and More

People refrain from offline shopping due to the spread of COVID-19, but existing online malls only support social interactions for efficient shopping and do not provide social interactions for social fun, which people enjoy during offline shopping. 

So, we present **Mall and More**, a new social interactive online shopping mall where people can feel like 'being there' and also shop together in real-time and non-real-time with their friends.

We designed and implemented 1) visualizing other users' behaviors for the presence, 2) following friends' screens for real-time shopping together, and 3) creating space-based comments for non-real-time communication.

## How To Test Prototype

We set the situation that two friend, Sally and Owen, are shopping together. Go to the prototype link below with your firend(one by one or open both link alone). Then you can test the three features we implemented.

* In case of first feature(visualizing other users' behaviors), It may be hard to check one or two people. This feature reacts based on users who visiting our prototype.

* Press C key and click anywhere to leave a comment there. In this prototype, we didn't implement 'mention' function. it is automatically shown only to friend.(Because in this prototype each user has only one friend.)

* When you click at the comment delivered in the chat room, you are brought to the location of the comment.

### Configuration

It has been tested with the following configuration:

* Google Chrome ver.87.0.4280.66
* Google Firebase ver.8.0.1
 
### Prototype Link

User1: [Sally](https://mallandmore.github.io/mockup/publish.html?groupId=0&studentId=20210374)

User2: [Owen](https://mallandmore.github.io/mockup/publish.html?groupId=0&studentId=20210473)


# Instruction
<!-- Instruction: Give a quick tour of the interface, and also show off some of the highlights of the interface. Note that this should not cover all features you have; focus on the most exciting and important parts. Use screenshots and callouts. -->

*1. Users can chat with their friends.*
![](https://i.imgur.com/7EEn2Zs.png)

*2. Users can request 'Shopping together mode' to their friends.*
![](https://i.imgur.com/80qDBX9.png)

*3. Users can see the location of their friends' mouse cursors on the 'Shopping together mode'.*
![](https://i.imgur.com/iJYAO9o.png)

*4. Users can follow what pages their friends actually see on the 'Shopping together mode'. (Green frame means that the friend is following your screen. And blue frame means that you are following the friend's screen.)*
![](https://i.imgur.com/7HweHSY.png)
![](https://i.imgur.com/G7QV92e.jpg)

*5. Users can create their comments on the exact position they want to leave it.*
![](https://i.imgur.com/VP6RLFD.jpg)

*6. Users can see their friends' comments anytime.*
![](https://i.imgur.com/VX0t5ps.jpg)

*7. Users can see where other users are and what they are doing with the moving cute characters.*
![](https://i.imgur.com/Emjt9XN.png)


## Code description
### Set-Up
* **connectToFirebase.js** : Initialize and set up Firebase Realtime Database.

### Web Pages
* **publish.html** : Thumbnail page
* **publish.css** : Main style sheets
* **detailPage1.html** to **detailPage12.html** : Product description pages

### Features
* **publish.js** : Implement a messenger.
* **chocome.js** : Visualize other users' behaviors.
* **togetherMode/getFriendState.js** : Trace friend's data to follow friend's location for real-time shopping together.
* **togetherMode/updateUserState.js** : Update user state to follow friend's location for real-time shopping together.
* **pinComment.js** : Create space-based comments for non-real-time communication.


# Acknowledgements
This work is carried out as a design project of [CS473: Introduction to Social Computing](https://www.kixlab.org/courses/cs473-fall-2020/index.html) in KAIST 2020.
