Maestro.Templates.ManageCategory = "ManageCategory";

assignRandomColor = function(){
    let allowedColorSet = _.pluck(Maestro.Products.Categories.Colors, 'key');
    let filteredAllowedSet = _.difference(allowedColorSet, ['e65100', 'bf360c', 'fdd835', 'ffa000', '039be5', '00acc1', '3949ab', '0d47a1']);
    let usedColorSet = _.pluck(ProductCategories.find({}).fetch(), 'color');
    let availableColorSet = _.difference(filteredAllowedSet, usedColorSet);

    if (availableColorSet.length == 0){
        let randomIndex = _.random(0, filteredAllowedSet.length -1);
        return _.find(Maestro.Products.Categories.Colors, function (color) { return color.key == filteredAllowedSet[randomIndex]});
    } else {
        let randomIndex = _.random(0, availableColorSet.length - 1);
        return _.find(Maestro.Products.Categories.Colors, function (color) { return color.key == availableColorSet[randomIndex]});
    }

};

Template.ManageCategory.onCreated(function () {
    this.selectedColor = new ReactiveVar();
    this.changeColorMode = new ReactiveVar();
});

Template.ManageCategory.onRendered(function () {
    $("#category-color").material_select();
});

Template.ManageCategory.helpers({
    list_categories: function() {
        return ProductCategories.find({});
    },
    selectedColor: function () {
        return Template.instance().selectedColor.get();
    },
    categoryColors: function () {
        return Maestro.Products.Categories.Colors;  
    },

    isAllowedColor: function(colorKey){
        let allowedColorSet = Maestro.Products.Categories.Colors;
        let isValidColor = _.find(allowedColorSet, function(color){return color.key == colorKey}) || false;

        if (isValidColor){
            return true;
        } else { 
            return false;
        }
    },

    isChangeColorMode: function(categoryId){
        if (categoryId == Template.instance().changeColorMode.get()){
            return true;
        } else {
            return false;
        }
    },

    isUsedColor: function(colorKey){
        let usedColorSet = _.pluck(ProductCategories.find({}).fetch(), 'color');
        let colorContains = _.indexOf(usedColorSet, colorKey);

        if (colorContains == -1){
            return false;
        } else {
            return true;
        }
    },

    getCategoryTileColor: function(categoryName, colorCode){
        let allowedColors = Maestro.Products.Categories.Colors;

        if (_.find(allowedColors, function(color){return color.key == colorCode;})){
            // if (categoryName == categoryFilter.primary){
                return "background-color:#" + colorCode + ";";
            // } else {
            //     return "background-color:#" + colorCode + ";";
            // }
        } else {
            // if (categoryName == categoryFilter.primary){
                return "background-color:#bdbdbd;";
            // } else {
            //     return "background-color:#bdbdbd;";
            // }
        }
    },
});

Template.ManageCategory.events({
    'click .chooseColor': function(event, template){
        template.selectedColor.set(this);
    },

    'click .changeColor': function(event, template){
        template.changeColorMode.set(this._id);
    },

    'click .enterNewName': function(event, template){
        let colorKey = assignRandomColor();
        template.selectedColor.set(colorKey);
    },

    'click .chooseNewColor': function(event, template){
        let categoryId = $(event.target).data('categoryid');
        let colorKey = $(event.target).data('colorkey');

        updateCategoryDetails = {
            color: colorKey        
        };

        Meteor.call("updateCategory", categoryId, updateCategoryDetails, function(error, result){
            if (error) {
                console.log(error);
            }
        });

        template.changeColorMode.set();
    },

    'change #category-color': function (event, template) {
        var color = $("#category-color").val();
        if(color) {
            template.selectedColor.set(color);
        }
    },
	'click .create-Category': function (event, template) {
        event.preventDefault();

        var categoryName = template.find("#inputCategoryName").value;

        var businessId = Maestro.Business.getBusinessId();

        var categoryDetails = {
            name: categoryName,
            businessId: businessId,
            color: template.selectedColor.get().key || null
        };

        Meteor.call("createCategory", categoryDetails, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                Materialize.toast("Added " + categoryName, 4000);
            }

            document.getElementById("manageCategoryForm").reset();

            template.selectedColor.set();
        });
    },

    'click .removeCategory': function(event, target){
    	event.preventDefault();

        let categoryId = $(event.target).data('categoryid');

        Meteor.call("removeCategory", categoryId, function (error, result) {
            if (error) {
                console.log(error);
            } 

            document.getElementById("manageCategoryForm").reset();

        });


    }

});