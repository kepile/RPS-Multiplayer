  <!-- // Initialize Firebase -->
    var config = {
        apiKey: "AIzaSyBZ8e4ClW9C64cgeY4rfrNAOmTP1kPMLYY",
        authDomain: "rockpaperscissors-2791e.firebaseapp.com",
        databaseURL: "https://rockpaperscissors-2791e.firebaseio.com",
        storageBucket: "rockpaperscissors-2791e.appspot.com",
        messagingSenderId: "152624637765"
      };

    firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();
    var games = firebase.database().ref("games");
    var userRef = firebase.database().ref("games/user");

    // Initial Values
   
    var user1 = "";
    var user2 = "";
    var user;
    var comment = "";
    var choice1;
    var choice2;
    var wins1 = 0;
    var wins2 = 0;
    var loss1 = 0;
    var loss2 = 0;
    var tie1 = 0;
    var tie2 = 0;
    var numPlayers = 0;


function updateuser (player, user, wins, loss, ties) {
  console.log("update +" + player + user + wins + loss + ties );
   // database.ref().set({
      firebase.database().ref('games/' + player).set(
        {   user: user,
            loss: loss,
            wins: wins,
            ties: ties
        
          });
 };



    // Capture Button Click
    $(".add-user").on("click", function(event) {
    // $("#add-user").on("click", function(event) {
      event.preventDefault();
      var name = $("#name-input").val().trim();
      console.log("username entered "+ name);
     
      games.once("value")
        .then(function(snapshot) {
           numPlayers = snapshot.numChildren();
       

           if ( numPlayers === 0) {
             updateuser(1, name, wins1, loss1, tie1);
             user1= name;
             user = 1;
             // displayWaiting;
           } else if ( numPlayers === 1) {
              updateuser(2, name, wins2, loss2, tie1);
              user2 = name;
              user = 2;
              // displayGame;
           } else {
            alert("Too many users");
           }
         
        });

    
    });
  
   // Code for handling the push
     

    // });

    // Firebase watcher + initial loader HINT: .on("value")
    // this is the function that makes firebase real-time
    // room.child("position/start").on("value", onChange);
games.on('child_added', function(snapshot) {
 console.log("onchildadded " + numPlayers + " " + snapshot.val());
       if (numPlayers === 2) {
       
      startgame(snapshot);
      }

});



games.on('child_removed', function(snapshot) {
  console.log("onChildRemoved " + numPlayers + " " + snapshot.val());
}); 

// commentsRef.on('child_changed', function(data) {
//   setCommentValues(postElement, data.key, data.val().text, data.val().author);
// });


    
  
    // }

      // onCancelled(DataSnapshot dataSnapshot) {
      // console.log("onChildRemoved " + numPlayers + " " + snapshot.val());

    // }
// }); 
 // games.on("child_added", function(snapshot){ 
 //       console.log("starting game" + numPlayers);
 //      if (numPlayers === 2) {
       
 //      startgame(snapshot);
 //      }
    

    // games.on("child_changed"), function(snap)
    //   snapshot.ref().child("position/end").on()})
    // userRef.ref().on("value", function(snapshot) {
     
    //   console.log("performing snapshot of user");
   
 // if (snapshot.child("games").exists()) {
  // var players = snapshot.child(players);
  // console.log(players);
  // console.log(snapshot.val().players);
   
  // }
  


  // else {console.log("players doesnt exist")};
  // console.log(snapshot);
      // storing the snapshot.val() in a variable for convenience
      // var rpsdata = snapshot.val();
      
      // Getting an array of each key In the snapshot object
      // var svArr = Object.keys(sv);

      // Finding the last user's key
      // var lastIndex = svArr.length - 1;

      // var lastKey = svArr[lastIndex];

      // Using the last user's key to access the last added user object
      // var lastObj = sv[lastKey]

      // Console.loging the last user's data
      // console.log(lastObj.name);
      // console.log(lastObj.email);
      // console.log(lastObj.age);
      // console.log(lastObj.comment);

      // Change the HTML to reflect
      // $("#name-display").html(lastObj.name);
      // $("#email-display").html(lastObj.email);
      // $("#age-display").html(lastObj.age);
      // $("#comment-display").html(lastObj.comment);

      // Handle the errors
    // }, function(errorObject) {
    //   console.log("Errors handled: " + errorObject.code);
    // });
