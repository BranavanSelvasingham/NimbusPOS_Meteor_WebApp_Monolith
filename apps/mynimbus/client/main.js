import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Accounts } from 'meteor/accounts-base';

import './main.html';

toggleExplorationDetails = function(explore){
    if($('#'+explore).css("display") == "block"){
        $('.explorationDetails').css("display", "none");
    } else {
        $('.explorationDetails').css("display", "none");
        $('#' + explore).css("display", "block");
    }
};

toggleExpandTile = function(tileId){
    $('.expandedTile').addClass('condensedTile').removeClass('expandedTile');
    $('#'+tileId).removeClass('condensedTile');
    $('#'+tileId).addClass('expandedTile');
};

closeTile = function(){
    $('.explorationDetails').css("display", "none");
    $('.expandedTile').addClass('condensedTile').removeClass('expandedTile');
};

showSnackBar = function(message, classType) {
    // Get the snackbar DIV
    $('#snackbar').addClass("show");
    $('#snackbar').addClass(classType);
    $('#snackbar').html(message);

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ $('#snackbar').removeClass("show"); }, 3000);
};

toggleHide = function(elementId){
    $("#"+elementId).toggleClass("hide");
};

Template.Home.onCreated(function(){
	let template = this;
});

Template.Home.onRendered(function(){

});

Template.Home.helpers({
    checkIfUserLoggedIn: function(){
        if(!!Meteor.user()){
            // console.log(Meteor.user());
            FlowRouter.go('/');
        }
    }
});

Template.Home.events({
 	'click .condensedTile': function(event, template){
 		let explore = $(event.target).data("activates");
 		let tileId = $(event.target).attr("id");

 		toggleExplorationDetails(explore);
 		toggleExpandTile(tileId);
 	},

 	'click .closeTile': function(event, template){
 		closeTile();
 	},

 	'click #loginUser': function(event, template){
        event.preventDefault();

 		let userEmail = document.getElementById("userEmail").value;
 		let password = document.getElementById("userPassword").value;

        if(!userEmail){
            showSnackBar("Enter your email first.", "error");
            return;
        }

        if(!password){
            showSnackBar("Enter your password first.", "error");
            return;
        }

        toggleHide("loginUser");
        toggleHide("loginLoading");

 		Meteor.loginWithPassword(userEmail, password, function(error){
 			if(!error){
 				// console.log("Logged in");
                FlowRouter.go('/home');
 			} else {
                // console.log(error);
                if(error.reason == "Login forbidden"){
                    showSnackBar("Login disabled. Please contact us.", "error");
                } else {
                    showSnackBar("Incorrect email or password.", "error");   
                }
            }
            toggleHide("loginUser");
            toggleHide("loginLoading");
 		});
 	},

    'click #forgotPassword': function(event, template){
        event.preventDefault();

        let userEmail = document.getElementById("userEmail").value;

        if(!userEmail){
            showSnackBar("Enter your email first.", "error");
            return;
        }

        toggleHide("forgotPassword");
        toggleHide("forgotPasswordLoading");

        Accounts.forgotPassword({email: userEmail}, function(){
            toggleHide("forgotPassword");
            toggleHide("forgotPasswordLoading");
            showSnackBar("You will receive an email shorlty with instructions for resetting your password", "success");
        });
    },

 	'click #createUser': function(event, template){
        event.preventDefault();

 		let userEmail = document.getElementById("newUserEmail").value;
 		let password = document.getElementById("newPassword").value;
 		let confirmPassword = document.getElementById("confirmUserPassword").value;
        let resultsObject = new ReactiveVar();

        if(!userEmail){
            showSnackBar("Enter your email first.", "error");
            return;
        }

        if(!password){
            showSnackBar("Enter a password first.", "error");
            return;
        }

        if(!confirmPassword){
            showSnackBar("Confirm your password.", "error");
            return;
        }

        if(!(password == confirmPassword)){
            showSnackBar("The passwords don't match. Please re-type.", "error");
            return;
        }

        toggleHide("createUser");
        toggleHide("createUserLoading");

 		Meteor.call("createNewCustomer", userEmail, password, function(error, result){
 			if(error){
 				console.log(error);
                showSnackBar(error.reason, "error");
 			} else {
 				Meteor.loginWithPassword(userEmail, password, function(error){
                    if(!error){
                        FlowRouter.go("/home");
                        Meteor.call('sendVerificationEmail', function(error, result){
                            if(!!error){
                                console.log(error);
                            } else {
                                console.log('email sent');
                                showSnackBar("Email registered. Please check inbox for email verification.", "success");
                            }
                        });
                    }
                });
 			}
            toggleHide("createUser");
            toggleHide("createUserLoading");
 		});
 	},

 	'click #emailBalances': function(event, template){
 		let userEmail = document.getElementById("emailBalancesInput").value;
        let resultsObject = new ReactiveVar();

        if(!userEmail){
            showSnackBar("Enter your email first.", "error");
            return;
        }

        toggleHide("emailBalances");
        toggleHide("emailBalancesLoading");

 		Meteor.call("sendBalancesByEmail", userEmail, function(error, result){
            if(!error){
                resultsObject.set(result);
                if(resultsObject.get().emailSent === true){
                    showSnackBar("If we have any cards associated with this email, you will receive an email. \nIt may take a few minutes.", "success");
                }
            }
            toggleHide("emailBalances");
            toggleHide("emailBalancesLoading");
        });
 	},
});

////////////

Template.CardBalances.onCreated(function(){
	let template = this;
	template.output = new ReactiveVar();
});


Template.CardBalances.onRendered(function(){
	let template = this;
    template.output.set();
	Meteor.call('fetchBalances', function(error, result){
		template.output.set(result);
	});
});


Template.CardBalances.helpers({
    emailUnverified: function(){
        // console.log(Meteor.user());
        return !Meteor.user().emails[0].verified;
    },

    getUserProfile: function(){
        // console.log(Meteor.user());
        return Meteor.user();
    },

	getBalances: function(){
		// console.log(Template.instance().output.get());
		return Template.instance().output.get();
	},

    getLoyaltyBalance: function(remainingQuantity, remainingAmount){
        if(remainingAmount){
            return "Balance: $"+ remainingAmount.toFixed(2);
        } else if (remainingQuantity){
            return "Balance: "+remainingQuantity + (remainingQuantity == 1? " item" : " items");
        }
    },

    getTallyCount: function(tally){
    	if(tally){
    		return "Tally: x" + tally;
    	}
    },

    getLoyaltyExpiration: function(card){
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
    },
});


Template.CardBalances.events({
	'click .accordion': function(event, template){
		var accordion = $(event.target);

        var panel = accordion.next();
        // console.log(accordion, panel);
        if (panel.css("display") == "block") {
            panel.css("display", "none");
        } else {
            panel.css("display", "block");
        }
	},

    'click .verifyEmail': function(event, template){
        Meteor.call('sendVerificationEmail', function(error, result){
            if(!!error){
                console.log(error);
            } else {
                console.log('email sent');
                showSnackBar("Verification email sent. This may take a few minutes.", "success");
            }
        });
    },

    'click .refreshBalances': function(event, template){
        event.preventDefault();
        template.output.set();
        
        toggleHide("refreshBalances");
        toggleHide("refreshBalancesLoading");

        Meteor.call('fetchBalances', function(error, result){
            template.output.set(result);
            toggleHide("refreshBalances");
            toggleHide("refreshBalancesLoading");
        });
    }


});

////////////

Template.AppHeader.onCreated(function(){

});


Template.AppHeader.onRendered(function(){

});


Template.AppHeader.helpers({

});


Template.AppHeader.events({
    'click .goHome': function(event, template){
        FlowRouter.go('/');
    }
});

////////


Template.AppFooter.onCreated(function(){

});


Template.AppFooter.onCreated(function(){

});


Template.AppFooter.helpers({
	userLoggedIn: function(){
		return !!Meteor.user();
	}
});


Template.AppFooter.events({

});

////////////

Template.AccountPage.onCreated(function(){
    let template = this;
    template.customerOnlyAccount = new ReactiveVar();
});


Template.AccountPage.onRendered(function(){
    let template = this;
    Meteor.call("isAccountCustomerOnly", function(error, result){
        if(!error){
            template.customerOnlyAccount.set(result);
        }
    });
});


Template.AccountPage.helpers({
	getUserProfile: function(){
		return Meteor.user();
	},

    isAccountCustomerOnly: function(){
        return Template.instance().customerOnlyAccount.get();
    }
});


Template.AccountPage.events({
    'click .verifyEmail': function(event, template){
        Meteor.call('sendVerificationEmail', function(error, result){
            if(!!error){
                console.log(error);
            } else {
                console.log('email sent')
            }
        });
    },

    'click #Logout_Tile': function(event, template){
        FlowRouter.go("/logout");
    },

    'click .condensedTile': function(event, template){
        let explore = $(event.target).data("activates");
        let tileId = $(event.target).attr("id");

        if(!!explore){
            toggleExplorationDetails(explore);
            toggleExpandTile(tileId);
        }
    },

    'click .closeTile': function(event, template){
        closeTile();
    },

    'click #changePassword': function(event, template){
        let oldPassword = document.getElementById("oldPassword").value;

        let newPassword = document.getElementById("newPassword").value;
        let confirmPassword = document.getElementById("confirmUserPassword").value;

        Accounts.changePassword(oldPassword, newPassword, function(error){
            if(!error){
                console.log('password chagned');
            }
        });
    }
});

////////