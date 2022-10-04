Maestro.Templates.ListLoyaltyPrograms = "ListLoyaltyPrograms";

var selectedProgramId = new ReactiveVar();

var editMode = new ReactiveVar();
var editProgram = {};

Template.ListLoyaltyPrograms.onRendered(function(){
    editMode.set(false);

    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

});

Template.ListLoyaltyPrograms.helpers({
    isSelectedProgram: function(programId){
        let chosenProgramId = selectedProgramId.get();
        if (chosenProgramId){
            if (programId == chosenProgramId){
                return 'background-color:lightblue;'
            } else {
                return;
            }
        } else {return;}
    },

    getProgramTaxRule: function(taxRule){
        if (taxRule){
            if (taxRule == "RETAIL_TAX"){
                return "Retail Tax Applies";
            } else if (taxRule == "NOT_TAXED"){
                return "Not Taxed";
            }
        } else {
            return "Retail Tax Applies";
        }
    },

    isStaticMode: function(){
        if(!editMode.get()){
            return;
        } else {
            return "display: none;";
        }
    },

    isEditMode: function(){
        if(editMode.get()){
            return;
        } else {
            return "display: none;";
        }
    },

    listPrograms: function(){
        return LoyaltyPrograms.find({});
    },

    getSelectedProgram: function(){
        return LoyaltyPrograms.findOne({_id: selectedProgramId.get()});
    },

    getProductName: function(productId){
    	nameObj = _.pluck(Products.find({_id: productId},{fields: {name:1}}).fetch(), 'name');
    	return nameObj[0];
    },
    getSizeLabels: function(sizeCodes){
        var labels = "";

        for (i=0; i<sizeCodes.length; i++){
            labels += Maestro.Client.getProductSizeName(sizeCodes[i]);
            if (i<(sizeCodes.length-1)){
                labels += ", ";
            }
        }

        return labels;
    },

    getPriceInfo: function(price){
    	if (price){
    		return "Price: $" + price.toFixed(2);
    	} else if (!price){
    		return "Free coupon / reward";
    	}
    },

    getExpiryDays: function(expiry){
    	if (expiry){
    		return "Expires " + expiry + " days after purchase";
    	} 
    },

    getExpiryDate: function(expiry){
        if (expiry > new Date(1969, 12, 31)){
            return "Expires on "+expiry.toDateString()+".";
        }
    },

    getProgramTypeInfo: function(program){
        var type = program.type;
        if(type=="Quantity"){
            return "Program type: Quantity based. "+program.quantity+" of any below items";
        } else if (type=="Percentage"){
            return "Program type: Discount of "+program.creditPercentage+"%";
        } else if (type=="Amount"){
            return "Program type: Monetary value of $"+program.creditAmount;
        }
    },

    editExpiryDays:function(expiry){
    	if (expiry){
    		return expiry;
    	} else {
    		return;
    	}
    },

    editExpiryDate:function(expiry){
        if (expiry > new Date(1969, 12, 31)){
            return expiry.toDateString();
        } 
    },

    editPrice: function(price){
    	if (price){
    		return price;
    	} else {
    		return;
    	}
    },

    isProgramActive: function(status){
        if (status=="Active"){
            return "checked";
        } else {
            return;
        }
    }

});

Template.ListLoyaltyPrograms.events({
    'click .programSelected': function(event, target){
        editMode.set(false);
        editProgram = {};
        let programId = this._id;
        selectedProgramId.set(programId);
    },

	'click .editThisCard':function(event, target){
        editMode.set(true);

        var programId = selectedProgramId.get();

        editProgram = {};

        editProgram = LoyaltyPrograms.findOne({_id: programId});

        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 15 // Creates a dropdown of 15 years to control year
        });

	},


	'click .clearChangesOnCard': function(event, target){
        editMode.set(false);

        editProgram = {};
	},

	'click .saveThisCard': function(event, target){
        var programId = selectedProgramId.get();

        delete editProgram._id;

        editProgram.name = document.getElementById('editProgramNameField').value;
        editProgram.price = Number(document.getElementById('editProgramPriceField').value);
        editProgram.expiryDays = Number(document.getElementById('editProgramExpiryDays').value);
        
        if(document.getElementById('editProgramExpiryDate').value){
            editProgram.expiryDate = new Date(document.getElementById('editProgramExpiryDate').value);
        }

        if(document.getElementById('editProgramStatus').checked){
            editProgram.status = "Active";
        } else {
            editProgram.status = "Disabled";
        }

        if (document.getElementById('yesTax').checked){
            editProgram.taxRule = Maestro.Tax.Types.RETAIL_TAX.key;
        } else if (document.getElementById('noTax').checked){
            editProgram.taxRule = Maestro.Tax.Types.NOT_TAXED.key;
        }

        Meteor.call("editLoyaltyProgram", programId, editProgram, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Modified loyalty program", 1000);

                editProgram = {};
            }
        });

        editMode.set(false);
	}


});