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
    var userRef = firebase.database().ref("games/player");

    // Initial Values
    var player;
    var opponent = "";
    var user;
    var userArr = {}
    var comment = "";
    var choice;
    var Oppchoice;
    var wins = 0;
    var wins2 = 0;
    var loss = 0;
    var loss2 = 0;
    var ties = 0;
    var ties2 = 0;
    var numPlayers = 0;
    var choiceArr = ["Rock", "Paper", "Scissors"];
    var gameStarted = false;
    var results;
    var action;

function displaySignin() {
  tempDiv = $("<form class='form-inline'>" );
  tempDiv.append("<div class= 'form-group'>");
  tempDiv.append("<label for='name-input'>Name:</label>");
  tempDiv.append("<input class='form-control' id='name-input' type='text'>");
  tempDiv.append("<button class='add-user'>Submit</button>");
  tempDiv.append("</div></form>");
  $("#connect").append(tempDiv);
}


function updateuser (playerArr) {
  console.log("updateUser + " + player + " " + playerArr[player] );

      firebase.database().ref('games/' + player).set(
        playerArr
       );
 };


function updatePage() {
  if (action ==="begin") {
      var tempBtn = $("<button>").html("Log out").attr("class", "logout");
      $("#signOut").append(tempBtn);
      $("#connect").html("");
    };
  if (action === "end") {
      $("#signOut").html("");
      $("#players").html("");
      $("#game").html("");
      $("#choiceBtn").html("");
      $("#currentResults").html("");
      $("#results").html("");
      $("#signOut").html("");
      $("#comments").html(""); 
      displaySignin();
      };
};


function addUser(event){
      
      user = $("#name-input").val().trim();
      console.log("username entered "+ user);
      action = "begin";
      updatePage();

     
      games.once("value")
        .then(function(snapshot) {
           numPlayers = snapshot.numChildren();
           console.log(snapshot.val());
           if ( numPlayers > 1)  {
              alert("Too many users");
           } else 
           {
            userArr =  {  
            user: user,
            loss: loss,
            wins: wins,
            ties: ties
        
          }
           if ( numPlayers === 0)
              // first player is being added
            {
               player = 1
               console.log("user1 is added");
               // displayWaiting; ***
           } else 
              // second player is being added
            {
                numPlayers = 2;
                player = 2;
                var temp = snapshot.val();
                opponent = temp[1].user;
                console.log(opponent + "was added to user2 game");
            }
          }
            // add the new user to the database
          updateuser(userArr);
                 console.log("came back from updateuser onclick add user");

         
       } );

    
};


function initVar(){
    player = ""
    opponent = "";
    user = "";
    userArr = {}
    comment = "";
    choice = "";
    Oppchoice = "";
    wins = 0;
    loss = 0;
    ties = 0;
    numPlayers = 0;
    gameStarted = false;
    results = "";
    action = ";

};



function establishPage() {
  console.log("establish Page");
 $("#game").empty();

  $("#players").html("players: "+ user + opponent);
  for (var i = 0; i < choiceArr.length; i++) {
    console.log(choiceArr[i]);
    var gameBtn = $("<button>").html(choiceArr[i]).attr("class", "choiceBtn").attr("data-choice", choiceArr[i]);
     $("#game").append(gameBtn);
   };
};


 function startgame () {
      console.log("Start Game");
      initVar();
      establishPage();
     
      $(document).on("click", ".choiceBtn", function() {
          choice = $(this).data("choice");
          $(this).removeData("choice");
          $("#choice").html("Your Choice: " + choice);
          $("#currentResults").html("");
        console.log(choice);
        $("#game").html("");
         userArr =  {  
            user: user,
            loss: loss,
            wins: wins,
            ties: ties,
            choice: choice
          }
       updateuser(userArr);
       console.log("came back from updateuser startgame");
  })
      
    };

function stopGame() {
    action = "end";
    userArr = null;
    updateUser();
    updatePage();
    alert("game ended");
};


function displayResults() {
  $("#currentResults").html(results);
  $("#results").html("Wins: " + wins);
  $("#results").append('<div> Losses: ' + loss + ' </div>');
  $("#results").append('<div> Ties: ' + ties + '</div>');
   
};

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

      userArr =  {  
        user: user,
        loss: loss,
        wins: wins,
        ties: ties 
      };
       choice = "";
       choicOpp = "";
       updateuser(userArr);
       displayResults();
              console.log("came back from updateuser determineWinner");


    };


// ******************************Main program*****************************************

    displaySignin();
    // Capture Button Click
    $(document).on("click", ".add-user", function(event) {
      event.preventDefault();
      addUser();
    });


   $(document).on("click", ".logout", function(event) {
       stopGame();
    });
  
 
     

    // });

    // Firebase watcher + initial loader HINT: .on("value")
    // this is the function that makes firebase real-time
    // room.child("position/start").on("value", onChange);
games.on('child_added', function(snapshot) {
     if (player === 1) {
      // second player was added so update Player 1 variables
      numPlayers  = 2;
      opponent = snapshot.val().user;
      console.log("child added.  user is user1 and user2 is " + opponent);
    }
       console.log("onchildadded " + numPlayers + " " + snapshot.val());

       if (numPlayers === 2) {
         startgame();
         
        }

});



// games.on('child_changed', function(snapshot) {
//   console.log("onChildchanged games " + numPlayers);
//   var test = snapshot.val();
//   debugger;
// }); 

games.on('child_removed', function(snapshot) {
  console.log("onChildRemoved " + numPlayers);
}); 





database.ref().on('child_changed', function(snapshot) {
  console.log("onChildChanged on DB " + choice);
  if (choice != ""  &
      snapshot.child("1/choice").exists() & 
      snapshot.child("2/choice").exists()){

      var dbObj = snapshot.val();
      console.log("user1 " + dbObj[1].choice + "user2 " + dbObj[2].choice);  
      if (player === 1) {
         $("#choice").html("Your choice: " + dbObj[1].choice);
         var tempDiv = ("<p>").html(dbObj[2].user + ": " + dbObj[2].choice).append("</p");
         $("#choice").append(tempDiv);
          determineWinner(dbObj[1].choice, dbObj[2].choice);
      } else {
          determineWinner(dbObj[2].choice, dbObj[1].choice);
          
      };
     establishPage();   
  };
});


    
  
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
