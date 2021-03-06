  <!-- // Initialize Firebase -->
    var config = {
        apiKey: "AIzaSyBZ8e4ClW9C64cgeY4rfrNAOmTP1kPMLYY",
        authDomain: "rockpaperscissors-2791e.firebaseapp.com",
        databaseURL: "https://rockpaperscissors-2791e.firebaseio.com",
        storageBucket: "rockpaperscissors-2791e.appspot.com",
        messagingSenderId: "152624637765"
      };

    firebase.initializeApp(config);

    // Create  variables to reference the database.
    var database = firebase.database();
    var games = firebase.database().ref("games");
    var commentRef = firebase.database().ref("comments");
    var userRef = firebase.database().ref("games/player");


    // Initial Values
    var player;
    var opponent = "";
    var user;
    var userArr = {}
    var comment = "";
    var choice;
    var wins = 0;
    var loss = 0;
    var ties = 0;
    var numPlayers = 0;
    var choiceArr = ["Rock", "Paper", "Scissors"];
    var gameNew = true;
    var results;
    var action;

// *************************Start of functions


// initialize variables when a new player is added to a game
function initVar(){
    player = ""
    opponent = "";
    user = "";
    userArr = {}
    comment = "";
    choice = "";
    wins = 0;
    loss = 0;
    ties = 0;
    numPlayers = 0;
    gameStarted = false;
    results = "";
   

};



// setup page to display player sign in
function displaySignin() {
  initVar();
  tempDiv = $("<form class='form-inline'>" );
  tempDiv.append("<label for='name-input'>Name:</label>");
  tempDiv.append("<input class='form-control' id='name-input' type='text'>");
  tempDiv.append("<button class='add-user'>Submit</button>");
  tempDiv.append("</form>");
  $("#connect").append(tempDiv);
}



// update the firebase with player when added or changed
function updateuser(playerArr) {

  console.log("updateUser + " + player + " " + playerArr[player] );
  var ref = firebase.database().ref('games/' + player);
  ref.onDisconnect().remove();

      firebase.database().ref('games/' + player).set(
        playerArr
       );
// var user = database.ref('gmaes/'+player);
// var connectedRef = database.ref(".info/connected");
// When the client's connection state changes...
// connectedRef.on("value", function(snap) {
//     console.log(snap.val()) 
//      user.onDisconnect.remove();
 // user.onDisconnect().remove()
 // });
};







// remove a player from the database
function removeuser() {
  firebase.database().ref('games/' + player).remove()
     .then(function() {
       console.log("Remove succeeded.")
  })
  .catch(function(error) {
    console.log("Remove failed: " + error.message)
  });
};




// clear the page when a new game is played
function clearPage() {
   $("#players").empty();
   $("#opponent").empty();
   $("#game").html("");
   $("#choiceBtn").html("");
   $("#mychoice").empty();
   $("#oppchoice").empty();
   $("#currentResults").html("");
   $("#results").html("");
   $("#listcomments").html(""); 
   $("#commentform").html(""); 
    $("#commentDisp").empty();

};
     



// Control availability of login/logout buttons at beginning and ending of a game
function updatePage() {
  console.log("updatePage action:" + action);
  if (action ==="begin") {
      var tempBtn = $("<button class='logout btn gamer'>Log Out</button>");
       // $("<button>").html("Log out").attr("class", "logout").attr("class", "gamer");
      $("#signOut").append(tempBtn);
      $("#connect").html("");
      console.log(numPlayers);
      if (numPlayers === 1) {
       console.log("call modal from update page "+" action:"+action+ player);
   
        showModal();
      }; 
     
      console.log("updatePage button added" + action);
  };


  if (action === "end") {
     console.log("updatePage button removed" + action);
      $("#signOut").html("");
       $("#game").empty();
       $("#commentDisp").empty();
      displaySignin();
      };
};



// Execute this function when a player signs in
function addUser(event){
      
      // retrieve the sign in name
      user = $("#name-input").val().trim();
      console.log("username entered "+ user);

     
     // execute this function once when the player signs in
      games.once("value")
        .then(function(snapshot) {
           // determine the number of people playing
           var children = snapshot.numChildren();
           console.log(snapshot.val());
           // if 2 players are playing already, alert player
           if ( children > 1)  {
              $(".modal-body").empty();
               var tempDiv = $('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');
               $(".modal-body").append(tempDiv);
               $(".modal-header").html("Game not Available.  Too many users.");
               $("#myModal").modal("show");
           } else 
           // player can be added so create object to be added
           {
              userArr =  {  
              user: user,
                           };
             
             if (children === 0) {
                // first player is being added
                 player = 1
                 numPlayers = 1
                 console.log("user1 is added");
                 // displayWaiting; ***
             } else {
                // second player is being added
                numPlayers = 2;
                var temp = snapshot.val();
               //  check to see if the player that exists in the DB is player 1 or 2
                if (snapshot.child("1").exists()){   
                    player = 2;
                    opponent = temp[1].user;
                    console.log(opponent + "was added to user2 game");
                  } else {
                    player = 1;
                    opponent = temp[2].user;
                    console.log(opponent + "was added to user1 game");

                    }

              }
            // update the page for beginning of the game
              action = "begin";
              updatePage();
            // add the new user to the database
              updateuser(userArr);
               console.log("came back from updateuser onclick add user");
                  
          }
         
       } );
    
};



// display input field for comments
function displayCommentInp() {
  $("#commentDisp").empty();
  var tempDiv = $("<form class='form-inline'>" );
  tempDiv.append("<label for = 'comment'>Message:</label>");
  tempDiv.append("<input id = 'comment' class = 'form-control' placeholder='Message your opponent here' type = 'text'>");
  tempDiv.append("<button class='add-comment btn gamer'>Submit</button>");
  $("#commentDisp").append(tempDiv);
};




// set up the page when game starts
function establishPage() {
   console.log("establish Page");
   $("#myModal").modal("hide");
   $("#players").html("Player: " + user).attr("class", "playerDsp");
   $("#opponent").html("Opponent: " + opponent).attr("class", "playerDsp");
   var temp = $("<p>").html("PICK ONE").attr("class", "directions");
   temp.append("</p>");
   $("#game").append(temp);
   // display rock, paper, scissors
   for (var i = 0; i < choiceArr.length; i++) {
      console.log(choiceArr[i]);
      var gameBtn = $("<button>").html(choiceArr[i]).attr("class", "choiceBtn").attr("data-choice", choiceArr[i]);
      
      
      // html(choiceArr[i]).attr("class", "choiceBtn").attr("class", "choiceBtn").attr("data-choice", choiceArr[i]);
       $("#game").append(gameBtn);
     };
};


// when both users are present, start game
 function startgame () {
      console.log("Start Game");
      // display choices of RPS
      establishPage();
      displayCommentInp();
  
       // Listen for a choice to be made
      $(document).on("click", ".choiceBtn", function() {
          choice = $(this).data("choice");
          $("#mychoice").empty();
          $("#oppchoice").empty();
          // display player's choice
          $(this).removeData("choice");
          $("#mychoice").append("Your Choice: " + choice);
          $("#currentResults").html("");
        console.log(choice);
        $("#game").html("");
        // set the array to update the database
         userArr =  {  
            user: user,
            choice: choice
          };
        // update the database
       updateuser(userArr);
       console.log("startgame: came back from updateuser ");
  });
      
    };


 
function showModal() {
  if (player >= 1) {

   $(".modal-body").empty();
   // var tempDiv = $('<button type="button" class="btn btn-default" data-dismiss="modal">Log Out</button>');
   // $(".modal-body").append(tempDiv);
  
   $(".modal-header").html("Waiting for another Player");

   $("#myModal").modal("show");
 }

};

// restart the game
function restartGame() {
    console.log("restartGame for user who is staying");
    numplayers = 1;
    console.log("call from restartgame "+" action:"+action+ player);
    showModal();
    comment = "";
    choice = "";
    wins = 0;
    loss = 0;
    ties = 0;
    opponent = "";
    
    results = "";
     userArr =  {  
            user: user,
            
          };
  };


// when player logs out, stop the game
function stopGame() {
    action = "end";
    console.log("stopgame: calling updateUser.  Player: " + player);
    removeuser();
    deleteComments();
    console.log("stop game: back from update user");
    updatePage();
    console.log("stop game: back from update page");
  
   $(".modal-body").empty();
   $(".modal-body").html("GAME OVER");
   $(".modal-header").empty();
   $("#myModal").modal("show");
};



// Determine who won
function determineWinner(choice, choiceOpp) {

      console.log("determineWinner choice " + choice + " opp " + choiceOpp);
       if (choice === choiceOpp ) {
            console.log(choice + "=" + choiceOpp + " ties before add" + ties);
            ties++;
            results = "You tied";
            console.log(ties + user + " log tie");
           } 
       else if ((choice === "Paper" & choiceOpp === "Rock") | 
               (choice === "Rock" & choiceOpp === "Scissors") |
               (choice === "Scissors" & choiceOpp === "Paper"))  {
                console.log(choice + " " + choiceOpp + " wins before add" + wins);
                    wins++;
                results = "You won";
                console.log(user + " log win");
              }
       else if ((choice === "Rock" & choiceOpp === "Paper") | 
               (choice === "Paper" & choiceOpp === "Scissors") |
               (choice === "Scissors" & choiceOpp === "Rock")) {
               console.log(choice + " " + choiceOpp + " loss before add" + loss);
                   loss++;
              results = "You lost";
              console.log(user + " log loss");
              };

       choice = "";
       choicOpp = "";
       displayResults();
              console.log("came back from displayresults determineWinner");


    };





// display the result of RPS game
function displayResults() {
  $("#currentResults").html(results);
  $("#results").html("Wins: " + wins);
  $("#results").append('<div> Losses: ' + loss + ' </div>');
  $("#results").append('<div> Ties: ' + ties + '</div>');
   
};



// add a comment to the database
function addComment(){
   console.log($('#comment').val());

   comment = $("#comment").val().trim();
   displayCommentInp();
   firebase.database().ref('comments').push(
        {user: user,
         comment: comment}
       );
   comment = "";
};


// display a new comment on the screen
function displayComment(obj){
  var tempDiv = $("<div>").html(obj.user + ": " + obj.comment).attr("class", "commentform");
  $("#listcomments").prepend(tempDiv);
};


// delete comments from database when a user logs out
function deleteComments(){
   firebase.database().ref('comments').remove();
};




// ******************************Main program*****************************************
   // display sign in for player
    displaySignin();


    // Capture Button Click when player sign in
    $(document).on("click", ".add-user", function(event) {
      event.preventDefault();
      addUser();
    });

 
  // capture button click when a player logs out
   $(document).on("click", ".logout", function(event) {
       stopGame();
    });
  
 

  // capture button click when player adds a comment
   $(document).on("click", ".add-comment", function(event){
      event.preventDefault();
     
      addComment();

   });

    

  // firebase function to listen for a player to be added to the database
  games.on('child_added', function(snapshot) {

  
     if (player != ""  &  player != snapshot.key) {
      
      // second player was added so update Player 1 variables
      numPlayers  = 2;
      opponent = snapshot.val().user;
      console.log("child added.  user is user1 and user2 is " + opponent);
    }
       console.log("onchildadded " + numPlayers + " " + snapshot.val());

       if (numPlayers === 2) {
         clearPage();
         startgame();
         
        }

  });



// firebase function to listen for when a player logs out
games.on('child_removed', function(snapshot) {
  deleteComments();
  console.log("onChildRemoved " + " numplayers:" +  numPlayers + " user" + user + " action:" + action);
  if (player != snapshot.key & action != "end") {
    gameStarted = false;
    restartGame();

  };
}); 



// firebase function to listen for when a choice is made (problem goes thru when totals updated)
database.ref().on('child_changed', function(snapshot) {
  console.log("onChildChanged on DB " + choice);
  if (choice != ""  &
      snapshot.child("1/choice").exists() & 
      snapshot.child("2/choice").exists()){
      var dbObj = snapshot.val();
      console.log("user1 " + dbObj[1].choice + "user2 " + dbObj[2].choice);  
      if (player === 1) {
         $("#oppchoice").append("Your opponent's choice: " + dbObj[2].choice);
         // var tempBr = $("<br>");
         // var tempDiv = $("<div>").html(dbObj[2].user + ": " + dbObj[2].choice);
         // $("#choice").append(tempBr).append(tempDiv);
          determineWinner(dbObj[1].choice, dbObj[2].choice);
      } else {
           $("#oppchoice").append("Your opponent's choice: " + dbObj[1].choice);
           determineWinner(dbObj[2].choice, dbObj[1].choice);
      };
      userArr =  {  
        user: user
     };
     establishPage();  
     updateuser(userArr);
     
  };
});

commentRef.on('child_added', function(snapshot){
  displayComment(snapshot.val());
});
    
  
// var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
// connectedRef.on("value", function(snap) {

  // If they are connected..
  // if (snap.val()) {

    // Add user to the connections list.
//  console.log("connected");
// connectedRef.ondisconnect, function() {
// removeuser;

//   };
// }
//   });

// var connectedRef = firebase.database().ref('.info/connected');
// connectedRef.onDisconnect
// // connectedRef.on('value', function(connectedSnap) {
// //   if (connectedSnap.val() === true) {
// //     console.log("connected");
// //   } else {
// //     console.log("disconnected");
// //     if (player != ""){
// //       removeuser;
// //     };

// }
// });

 