//************************************************//
//*****       set required npm modules       *****//
//************************************************//
//
//-- file system  --//
	var fs = require("fs");

//-- inquirer  --//
	var inquirer = require("inquirer");

//-- timestamp
//	var timestamp = require("time-stamp");

//-- flashcards
	var basicCard = require("./basic.js")
	var clozeCard = require("./cloze.js")
	var card_library = require("./cardLibrary.json")




//************************************************//
//*****    declare global variables          *****//
//************************************************//
//
	var cardType = "";
	var round = 0;
	var getCard;
	var selectQuestion;
	var correctAns = 0;
	var wrongAns = 0; 


//************************************************//
//*****             Menu Inputs              *****//
//************************************************//
//
//console.log("begin main menu");

	function mainMenu(){
		inquirer.prompt([
		 	{
			    type: "list",
			    message: "What do you want to do?",
			    choices: ["create-flashcards", "play-game", "exit"],
			    name: "cardGame"
		  	}
	  	])
		.then(function(main_menu) {
			switch(main_menu.cardGame){
				case "create-flashcards":
					createCard();
					break;
				case "play-game":
					playGame();
					break;
				case "exit":
				console.log("Thank you for your interest in our flashcards.")
				return;
				break;
			};
		});

	};

//************************************************//
//*****            Create Cards              *****//
//************************************************//
//

//---  Create Menu
	function createCard(){
		inquirer.prompt([
			{
				type: "list",
				message: "What kind of cards would you like to create?",
				choices: ["basic", "cloze"],
				name: "cardChoice"
			}
		])
		.then(function(card_menu){
			switch(card_menu.cardChoice){
				case "basic":
					console.log("OK, lets create a Basic card");
					createBasic();
					break;
				case "cloze":
					console.log("Ok, this will be a cloze call, ha ha ha ha!")
					createCloze();
					break;
			};

		});
	};

//--- Create Basic Cards 
	function createBasic(){
		cardType = "basic";

		inquirer.prompt([
			{
				type: "input",
				message: "Please enter your question, this will be the front of the card: ",
				name: "front"
			},
			{
				type: "input",
				message: "Please enter your answer, this will be the back of the card: ",
				name: "back"
			}
		])
		.then(function(basicData){
			var basicObj = {
				type: "basic",
				front: basicData.front,
				back: basicData.back
				};
			card_library.push(basicObj);
			fs.writeFile("cardLibrary.json", JSON.stringify(card_library, null, 2));
			// --- check to see if they want to add more cards
			inquirer.prompt([
				{
					type: "confirm",
					message: "Do you want to create another card?",
					name: "basic_repeat"
				}
			])
			.then(function(repeatAns){
				if (repeatAns.basic_repeat)
					{createBasic();
					}
				else 
					{mainMenu();
					};

			});
		});
	};



//--- Create Cloze Cards 
	function createCloze(){
		cardType = "cloze";

		inquirer.prompt([
			{
				type: "input",
				message: "Please enter the full text of your statement: ",
				name: "text"
			},
			{
				type: "input",
				message: "Please enter your cloze (answer portion of the full text statement: ",
				name: "cloze"
			}
		])
		.then(function(clozeData){
			var clozeObj = {
				type: "cloze",
				text: clozeData.text,
				cloze: clozeData.cloze
				};
			if (clozeData.text.indexof(clozeData.cloze) !==-1) {
				card_library.push(clozeObj);
				fs.writeFile("cardLibrary.json", JSON.stringify(card_library, null, 2));
				}
			else {
				console.log("Your cloze text must match your full text statement")
				};

			// --- check to see if they want to add more cards
			inquirer.prompt([
				{
					type: "confirm",
					message: "Do you want to create another card?",
					name: "cloze_repeat"
				}
			])
			.then(function(repeatAns){
				if (repeatAns.cloze_repeat)
					{createCloze();
					}
				else 
					{mainMenu();
					};

			});
		});
	};



//************************************************//
//*****             Play a Game              *****//
//************************************************//
//

//--- Play menu  -----
	function playGame(){
		
		if(round < card_library.length){
			cardType = card_library[round].type;
			console.log("Round: " + round + " type: "+ cardType + " question: " + JSON.stringify(card_library[round], null, 2))
		
			if(cardType === "basic"){
				getCard = new basicCard(card_library[round].front, card_library[round].back);
				selectQuestion = getCard.front;
				selectAnswer = getCard.back;
				}
			else {
				getCard = new clozeCard(card_library[round].text, card_library[round].cloze);
				selectQuestion = getCard.partial;
				selectAnswer = getCard.cloze;
			}

			inquirer.prompt([
				{
					type: "input",
					message: selectQuestion,
					name: "question"
				}
			])
			.then(function(userAns){
				round++;
				if(userAns.question === selectAnswer)
					{
						console.log("You are correct!");
						correctAns++
					}
				else {
					console.log("Sorry, the correct answer is " + selectAnswer)
					wrongAns++
					};
				playGame();
			});
			
		}
		else {
			console.log ("You got " + correctAns + " correct answers and  " + wrongAns + " wrong answers" );
			round = 0;
			correctAns = 0; 
			wrongAns = 0;
			mainMenu();
		}

	};










//************************************************//
//*****         Start the Program            *****//
//************************************************//
//

	mainMenu();