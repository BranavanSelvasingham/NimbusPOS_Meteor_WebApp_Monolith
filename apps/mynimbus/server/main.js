import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email'

Meteor.startup(() => {
  // code to run on server at startup
});

LoyaltyCards = new Mongo.Collection("loyalty-cards");
LoyaltyPrograms = new Mongo.Collection("loyalty-programs");
Customers = new Mongo.Collection("customers");
Businesses = new Mongo.Collection("businesses");

let generateBalancesObject = function(email){
	let customerRecords = Customers.find({email: email}).fetch();
	let balances = [];

	_.each(customerRecords, function(customerObj){
		let businessObj = Businesses.findOne({_id: customerObj.businessId});
		let companyInfo = {name: businessObj.name};

		let customerCards = LoyaltyCards.find({customerId: customerObj._id}).fetch();
		// console.log("customerCards: ", customerCards);
		customerCards = _.map(customerCards, function(card){
			let loyaltyProgramObj = LoyaltyPrograms.findOne({_id: card.programId});
			card.name = loyaltyProgramObj.name;
			card.expiryDays = loyaltyProgramObj.expiryDays;
			card.expiryDate = loyaltyProgramObj.expiryDate;
			// card.loyaltyProgram = loyaltyProgramObj;
			return card;
		});

		balances.push({
			companyInfo: companyInfo,
			cards: customerCards
		})
	});
	return balances;
};

let getLoyaltyBalance = function(remainingQuantity, remainingAmount){
    if(remainingAmount){
        return "Balance: $"+ remainingAmount.toFixed(2);
    } else if (remainingQuantity){
        return "Balance: "+remainingQuantity + (remainingQuantity == 1? " item" : " items");
    }
};

let getLoyaltyExpiration = function(card){
    let purchasedOn= new Date(card.boughtOn);
    purchasedOn.setHours(0);
    purchasedOn.setMinutes(0);
    purchasedOn.setSeconds(0);
    purchasedOn.setMilliseconds(1);

    let todayDate = new Date();
    todayDate.setHours(23);
    todayDate.setMinutes(59);
    todayDate.setSeconds(59);
    todayDate.setMilliseconds(999);

    if(card.expiryDays){
        let remainingDays = card.expiryDays - ((todayDate.valueOf() - purchasedOn.valueOf())/(1000*60*60*24)).toFixed(0);
        if (remainingDays < 0 ){
            return "Program Expired";
        } else {
            return remainingDays + " days left till expiry";
        }
    } else if (card.expiryDate){
        if (todayDate>card.expiryDate){
            return "Program Expired";
        } else {
            return "Expires on " + card.expiryDate.toDateString();
        }
    }
};

let getTallyCount = function(tally){
	if(tally){
		return "Tally: x" + tally;
	}
};

let sendBalancesEmail = function(email, balances){
	let toEmail = email;
	let fromEmail = "My Nimbus <do-not-reply@nimbuspos.com>";
	let subjectLine = "Your Loyalty Card Balances";
	let messageBody = "";

	let title = "<h1>Loyalty Card Balances:</h1>";

	let allCompanyBlocks = "";

	_.each(balances, function(companyGroup){
		allCompanyBlocks += "<tr><td><h2>" + companyGroup.companyInfo.name + "</h2></td></tr>";
		_.each(companyGroup.cards, function(card){
			allCompanyBlocks += '<tr style="border: 1px solid #cccccc; border-collapse: collapse; box-shadow: 10px 10px 5px #888888;"><td style="margin: 2.5%;\
							    width: 95%; \
							    min-height: 100px; \
							    text-align: left;\
							    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);\
							    transition: 0.3s;' + 
							    (card.expired ? 'color: #a6a6a6;':'') + 
							    '">\
								<div style="padding: 15px;"> \
								<h4><b>' + card.name + '</b>' + (card.expired ? '<i> (Expired)</i></h4>': '</h4>');
			
			if(getLoyaltyBalance(card.remainingQuantity, card.remainingAmount)){
				allCompanyBlocks += '<p>'+ getLoyaltyBalance(card.remainingQuantity, card.remainingAmount) + '</p>';
			}

			if(getLoyaltyExpiration(card)){
				allCompanyBlocks += '<p>' + getLoyaltyExpiration(card) + '</p>';
			}
			
			if(getTallyCount(card.tally)){
				allCompanyBlocks += '<p>' + getTallyCount(card.tally) + '</p>';
			}
			
			allCompanyBlocks += '</div>';
			allCompanyBlocks += '</td></tr>';
		});
	});

	let balancesBlock = '<table border="0" cellpadding="0" cellspacing="0" width="100%"> \
							<tr> \
								<td style="padding: 10px 0 30px 0;"> \
									<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">' +
										allCompanyBlocks +
									'</table> \
								</tb>\
							</tr>\
						</table>';

	let htmlBody = "<!DOCTYPE html> \
					<html> \
						<head> \
							<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /> \
							<title>Demystifying Email Design</title> \
							<meta name='viewport' content='width=device-width, initial-scale=1.0'/> \
						</head> \
						<body>" + 
							title +
							balancesBlock + 
						"</body> \
					</html>";

	Email.send({
		to: toEmail, 
		from: fromEmail, 
		subject: subjectLine, 
		text: messageBody, 
		html: htmlBody
	});
};

let doesEmailExist = function(email){
	return !!Customers.findOne({email: email});
};

Meteor.methods({
	'createNewCustomer': function(userEmail, password){
		let userId = Accounts.createUser({
							email: userEmail,
							password: password,
						});

		if(!!userId){
			Meteor.users.update({_id: userId}, {$set: {isEndCustomer: true}});
		}
	},

	'sendBalancesByEmail': function(userEmail){
		if(doesEmailExist(userEmail)){
			let balancesObject = generateBalancesObject(userEmail);
			sendBalancesEmail(userEmail, balancesObject);
		}
		return {emailSent: true};
	},

	'isAccountCustomerOnly': function(){
		if(this.userId){
			let user = Meteor.users.findOne({_id: this.userId});
			return user.isEndCustomer;
		}
	},

	'fetchBalances': function(){
		if(this.userId){
			let user = Meteor.users.findOne({_id: this.userId});

			let finalOutput = {
				finishedLoading: true,
				balances: []
			};

			// finishedLoading: true
			// balances: [{}, 
			// {
			// 	companyInfo: {name: "", locations: []},
			// 	cards: [{}, {}...],
			// },
			// {}]

			_.each(user.emails, function(userEmail){
				if(!!userEmail.address && userEmail.verified){
					finalOutput.balances = generateBalancesObject(userEmail.address);
				}
			});

			return finalOutput;
		}
	},

	'sendVerificationEmail': function(){
		Accounts.sendVerificationEmail(this.userId);
	},


});