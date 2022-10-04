Maestro.Templates.CreateLoyaltyProgram = "CreateLoyaltyProgram";

var selectedProductsList = new ReactiveDict;
selectedProductsList.set("products", []);

var selectedCategoriesList = new ReactiveDict;
selectedCategoriesList.set("categories", []);

var newInputFlag = new ReactiveVar;
newInputFlag.set(false);

var value = new ReactiveVar;
value.set(0);

var programType = new ReactiveVar;
var appliesTo = new ReactiveVar;
var programTaxed = new ReactiveVar;
programTaxed.set(false);

var selectedGroup = new ReactiveVar();

var hideSelectionCard = function(){
    $('#chooseProductsCard').hide();
    $('#chooseCategoriesCard').hide();
};

var showSelectionCard = function(){
    $('#chooseProductsCard').show();
    $('#chooseCategoriesCard').show();
};

var clearAppliesToSelections = function(){

    document.getElementById('appliesToProducts').checked = false;
    document.getElementById('appliesToCategories').checked = false;

    document.getElementById('percentageAppliesToEntirePurchase').checked = false;
    document.getElementById('percentageAppliesToCategories').checked = false;
};

var clearProductCategorySelections = function(){
    selectedCategoriesList.set("categories", []);
    selectedProductsList.set("products", []);
};

var hideInputFields = function(){
    $('#quantityField').hide();
    $('#percentageField').hide();
    $('#amountField').hide();
    $('#tallyField').hide();
};

Template.CreateLoyaltyProgram.onRendered(function(){
    $('#selected_Products').hide();
    $('#selected_Categories').hide();

    $('#quantityAppliesTo').hide();
    $('#percentageAppliesTo').hide();

    hideSelectionCard();

    hideInputFields();


    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15 // Creates a dropdown of 15 years to control year
    });

});

Template.CreateLoyaltyProgram.helpers({
    getSortedFilteredProductsAndGroups: function (){
        var findCriteria = {};

        let sortType = "categories";

        findCriteria = {status:'Active'};

        return Maestro.Client.getProductsAndGroups(findCriteria, sortType);
    },

    isThisSelectedGroup: function(name){
        let chosenGroup = selectedGroup.get();
        if (chosenGroup){
            let chosenGroupName = chosenGroup.name;
            if (name == chosenGroupName){
                return true;
            } else {
                return false;
            }
        } else {return false;}
    },

    isAppliesToOptional: function(){
        if (programType.get()=="Quantity"){
            return "(required)";
        } else if (programType.get()=="Percentage"){
            return "(optional)";
        } else if (programType.get()=="Amount"){
            return "(optional)";
        }
    },

    selectProductsCategories: function(){
        if (appliesTo.get()=="Products"){
            $('#chooseProductsCard').show();
            $('#chooseCategoriesCard').hide();
            return "Selected Products:";
        } else if (appliesTo.get()=="Categories"){
            $('#chooseProductsCard').hide();
            $('#chooseCategoriesCard').show();
            return "Selected Categories:";
        }
    },

	products: function () {
        return Products.find({status:'Active'},{sort: {categories:1, name:1}});
    },

    category: function(){
        return ProductCategories.find({},{sort: {name:1}})
    },

    selectedProducts: function(){
    	return selectedProductsList.get("products");
    },

    selectedCategories: function(){
        return selectedCategoriesList.get("categories");
    },

    getSizes: function(productId){
        var productsObj = Products.find({_id: productId}).fetch();

        var productSizesObj = productsObj[0].sizes;
        var productSizeCodes = _.pluck(productSizesObj, 'code');
        var productSizeLabels = [];
        var productSizePrices = _.pluck(productSizesObj, 'price');

        var productSizes = [];

        for (i=0; i<productSizeCodes.length; i++){
            productSizes.push({
                code: productSizeCodes[i],
                label: Maestro.Client.getProductSizeName(productSizeCodes[i]),
                price: productSizePrices[i]
            });
        }

        return productSizes;
    },

    isTallyProgram: function(){
        if(programType.get() == "Tally"){
            return true;
        }
        return false;
    }
});

Template.CreateLoyaltyProgram.events({
    'click .selectGroup': function(event, target){
        if (selectedGroup.get() == this){
            selectedGroup.set();
        } else  {
            selectedGroup.set(this);
        }
    },

    'click deselectGroup': function(event, target){
        selectedGroup.set();
    },

    'click .selectProgramType': function(event, target){
        if (document.getElementById("radioQuantity").checked){
            programType.set('Quantity');
            $('#quantityAppliesTo').show();
            $('#percentageAppliesTo').hide();

            hideInputFields();
            $('#quantityField').show();

            hideSelectionCard();
            clearAppliesToSelections();
            clearProductCategorySelections();
        } else if (document.getElementById("radioPercentage").checked){
            programType.set('Percentage');
            $('#quantityAppliesTo').hide();
            $('#percentageAppliesTo').show();
            
            hideInputFields();
            $('#percentageField').show();

            hideSelectionCard();
            clearAppliesToSelections();
            clearProductCategorySelections();
            appliesTo.set("Entire-Purchase");
            document.getElementById('percentageAppliesToEntirePurchase').checked = true;
        } else if (document.getElementById("radioAmount").checked){
            programType.set('Amount');
            $('#quantityAppliesTo').hide();
            $('#percentageAppliesTo').hide();

            hideInputFields();
            $('#amountField').show();

            hideSelectionCard();
            clearAppliesToSelections();
            clearProductCategorySelections();
        } else if (document.getElementById("radioTally").checked){
            programType.set('Tally');
            $('#quantityAppliesTo').hide();
            $('#percentageAppliesTo').hide();

            hideInputFields();
            $('#tallyField').show();

            appliesTo.set("Products");
            $('#selected_Products').show();

            hideSelectionCard();
            clearAppliesToSelections();
            clearProductCategorySelections();
        }
    },

    'click .programAppliesTo':function(event, target){
        if (document.getElementById('appliesToProducts').checked){
            appliesTo.set("Products");
            $('#selected_Products').show();
            $('#selected_Categories').hide();
            clearProductCategorySelections();
        } else if (document.getElementById('appliesToCategories').checked){
            appliesTo.set("Categories");
            $('#selected_Products').hide();
            $('#selected_Categories').show();
            clearProductCategorySelections();
        }

    },

    'click .percentageProgramAppliesTo':function(event, target){
        if (document.getElementById('percentageAppliesToEntirePurchase').checked){
            appliesTo.set("Entire-Purchase");
            $('#selected_Categories').hide();
            clearProductCategorySelections();
            clearProductCategorySelections();
            hideSelectionCard();
        } else if (document.getElementById('percentageAppliesToCategories').checked){
            appliesTo.set("Categories");
            $('#selected_Categories').show();
            clearProductCategorySelections();
        }

    },

    'click .chooseProgramTax': function(event, target){
        if (document.getElementById('yesTax').checked){
            programTaxed.set(true);
        } else if (document.getElementById('noTax').checked){
            programTaxed.set(false);
        }

    },

    'click #radioQuantity': function(event, target){
        document.getElementById("quantityField").disabled = false;

        document.getElementById("percentageField").value = 0;
        document.getElementById("percentageField").disabled = true;

        document.getElementById("amountField").value = 0;
        document.getElementById("amountField").disabled = true;
    },

    'click #radioPercentage': function(event, target){
        document.getElementById("percentageField").disabled = false;

        document.getElementById("quantityField").value = 0;
        document.getElementById("quantityField").disabled = true;

        document.getElementById("amountField").value = 0;
        document.getElementById("amountField").disabled = true;
    },

    'click #radioAmount': function(event, target){
        document.getElementById("amountField").disabled = false;

        document.getElementById("quantityField").value = 0;
        document.getElementById("quantityField").disabled = true;

        document.getElementById("percentageField").value = 0;
        document.getElementById("percentageField").disabled = true;
    },


	'click .selectProduct': function(event, target){
        var productId = $(event.target).data('productid');

        var productName = _.pluck(Products.find({_id: productId}).fetch(), 'name');

		var productSet = selectedProductsList.get("products");

		var contains = false;

		for (var i = 0, len = productSet.length; i < len; i ++){
			if (productSet[i]['productId']===productId){
				Materialize.toast('Already selected', 4000);
				contains = true;
				break;
			}
		}
		
		if(!contains){
			var newSelect = {
    			        	productId : productId,
    			        	name: productName[0]
			    		};

			productSet.push(newSelect);
			selectedProductsList.set("products", productSet);
		}
	},

    'click .selectCategory':function(event, target){
        var categoryName = $(event.target).data('categoryname');

        var categorySelect = selectedCategoriesList.get("categories");
        var contains = false;

        for (var i = 0, len = categorySelect.length; i < len; i ++){
            if (categorySelect[i]['name']===categoryName){
                Materialize.toast('Already selected', 4000);
                contains = true;
                break;
            }
        }
        
        if(!contains){
            var newSelect = {
                        name : categoryName,
                        };

            categorySelect.push(newSelect);
            selectedCategoriesList.set("categories", categorySelect);
        }

    },

    'click .removeProduct': function(event, target){
        var productId = $(event.target).data('productid');

        var productName = _.pluck(Products.find({_id: productId}).fetch(), 'name');

        productSet = selectedProductsList.get("products");

        var removeSelect = {
                            productId : productId,
                            name: productName[0]
                            };

        var removeIndex = productSet.indexOf(removeSelect);

        productSet.splice(removeIndex, 1);

        selectedProductsList.set("products", productSet);
    },

    'click .removeCategory': function(event, target){
        var categoryName = $(event.target).data('categoryname');

        categorySet = selectedCategoriesList.get("categories");

        var removeSelect = {
                            name: categoryName
                            };

        var removeIndex = categorySet.indexOf(removeSelect);

        categorySet.splice(removeIndex, 1);

        selectedCategoriesList.set("categories", categorySet);
    },

	'click #createLoyaltyProgram': function(event, target){
        event.preventDefault();

        var newLoyaltyProgram = {};

		var programName = document.getElementById('loyalty-name').value;

        var checkForMatch = _.pluck(LoyaltyPrograms.find({name: programName}).fetch(), 'name');

        if (!programName.length){
            $('#errorMessages').text('Enter a loyalty program name');
            return;
        }

        if (checkForMatch.length > 0){
            $('#errorMessages').text('A matching loyalty program name already exists');
            return; 
        }

        var type = programType.get();

        // if(type == "Percentage"){
        //     if (appliesTo.get() == "")
        // }

        if (!type){
            $('#errorMessages').text('Select a loyalty program type');
            return;
        }

        var quantityField = 0;
        var percentageField = 0;
        var amountField = 0;
        var tallyField = null;

        if (type=="Quantity"){
            quantityField = Number(document.getElementById('quantityField').value);
            if(!appliesTo.get()){
                $('#errorMessages').text('Select either Products or Categories');
                return;
            }
        } else if (type=="Percentage"){
            percentageField = Number(document.getElementById('percentageField').value);
        } else if (type=="Amount"){
            amountField = Number(document.getElementById('amountField').value);
        } else if (type=="Tally"){
            tallyField = Number(document.getElementById('tallyField').value);
        }

        if (!quantityField && !percentageField && !amountField && !tallyField){
            $('#errorMessages').text('Enter a valid value for selected program type');
            return;
        }

        var programTypeObj = {
                            type: type,
                            quantity: quantityField,
                            creditPercentage: percentageField,
                            creditAmount: amountField,
                            tally: tallyField
                        };


        var programPrice = Number(document.getElementById('programPriceField').value);
        var programExpiryDays = Number(document.getElementById('programExpiryField').value);
        var programExpiryDate;

        var businessId = Maestro.Business.getBusinessId();
        
        var programProducts = [];
        var programCategories = [];
        
        if (appliesTo.get()=="Products"){
            
            var productSet = selectedProductsList.get("products");

            if (productSet.length == 0){
                $('#errorMessages').text('Select at least one product');
                return; 
            }

            var productsObj; 
            var productSizesObj;
            var productSizeCodes; 
            var sizes;

            for (i=0; i<productSet.length; i++){
                productObj = Products.find({_id: productSet[i].productId}).fetch();
                productSizesObj = productObj[0].sizes;
                productSizeCodes = _.pluck(productSizesObj, 'code');
                sizes = [];

                for (j=0; j<productSizeCodes.length; j++){
                    if(document.getElementById(productSet[i].productId+'_'+productSizeCodes[j]).checked){
                        sizes.push(productSizeCodes[j]);
                    }
                }

                if(!sizes.length){
                    $('#errorMessages').text('Select at least one product size');
                    return;
                }

                programProducts.push({
                    productId: productSet[i].productId,
                    sizeCodes: sizes
                });
            }
        } else if (appliesTo.get()=="Categories") {
            var selectedCategories = selectedCategoriesList.get("categories");

            if(!selectedCategories.length){
                $('#errorMessages').text('Select at least one category');
                return;
            }

            for (i=0; i<selectedCategories.length; i++){
                programCategories.push({
                    name: selectedCategories[i].name
                });
            }
        }

        var taxRule;

        if (programTaxed.get()){
            taxRule = Maestro.Tax.Types.RETAIL_TAX.key;
        } else {
            taxRule = Maestro.Tax.Types.NOT_TAXED.key;
        }

        newLoyaltyProgram = {
                                name: programName,
                                programType: programTypeObj,
                                appliesTo: appliesTo.get(),
                                products: programProducts,
                                categories: programCategories,
                                price: programPrice,
                                expiryDays: programExpiryDays,
                                taxRule: taxRule,
                                // expiryDate: programExpiryDate, 
                                businessId: businessId,
                                status: "Active"
                            };

        if (document.getElementById('programExpiryDateField').value){
            console.log('valid expiry date received');
            programExpiryDate = new Date(document.getElementById('programExpiryDateField').value);
            programExpiryDate.setHours(23);
            programExpiryDate.setMinutes(59);
            programExpiryDate.setSeconds(59);
            programExpiryDate.setMilliseconds(999);
            newLoyaltyProgram.expiryDate = new Date(programExpiryDate);
        } 

        console.log(newLoyaltyProgram);

        Meteor.call("createNewLoyaltyProgram", newLoyaltyProgram, function(error, result) {
            if(error) {
                console.log(error);
            } else {
                Materialize.toast("Created a new loyalty program", 4000);

                clearProductCategorySelections();

                newInputFlag.set(false);
                value.set(0);

                programType.set();
                appliesTo.set();

                FlowRouter.go("/loyaltyPrograms");
            }
        });
    
	},

    'click #cancel-create-loyalty':function(event, target){
        clearProductCategorySelections();

        FlowRouter.go("/loyaltyPrograms");
    }
});
