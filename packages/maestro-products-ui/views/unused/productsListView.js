Maestro.Templates.ProductsListView = "ProductsListView";

Template.ProductsListView.onCreated(function () {
    let template = this;

    template.selectedSort = new ReactiveVar();
    template.selectedSort.set('categories');

    template.selectedStatus = new ReactiveVar();
    template.selectedStatus.set('active');

    template.selectedCategoryFilter = new ReactiveVar();
    template.selectedCategoryFilter.set('All');

    template.selectedProduct = new ReactiveVar();

    template.selectedGroup = new ReactiveVar();

    template.newProduct = new ReactiveVar();
    template.newProduct.set();

    template.newGroup = new ReactiveVar();
    template.newGroup.set([]);

    template.newProductMode = new ReactiveVar();
    template.newProductMode.set(false);

    template.newGroupMode = new ReactiveVar();
    template.newGroupMode.set(false);

    template.samePriceVariants = new ReactiveVar();
    template.samePriceVariants.set(false);

    template.priceUpdateMode = new ReactiveVar();
    template.priceUpdateMode.set(false);

    template.savedSettings = new ReactiveVar();
    template.savedSettings.set({
        categories:[],
        addOns: [],
        taxRule: null, // Maestro.Tax.Types.RETAIL_TAX.key,
        locations:[]
    });

    template.addVariantMode = new ReactiveVar();
    template.addVariantMode.set(false);

    template.convertProductsToGroup = new ReactiveVar();
    template.convertProductsToGroup.set([]);

    template.newProductName = new ReactiveVar();
    template.firstVariantName = new ReactiveVar();

    template.chooseExistingGroupMode = new ReactiveVar();
    template.chooseExistingGroupMode.set(false);

    template.isViewProductMode = new ReactiveVar();
    template.isViewProductMode.set(false);

    template.isViewGroupMode = new ReactiveVar();
    template.isViewGroupMode.set(false);

    template.editName = new ReactiveVar();
    template.editName.set(false);

    template.addFirstVariantToGroup = function(){

        var currentSizes = Maestro.Client.getBusinessProductSizes();
        
        var newProductInGroupSizes = [];    

        for (i = 0; i < currentSizes.length; i++){ 
            let sizePrice = Number(document.getElementById("newProductSize_"+currentSizes[i].code).value);
            if ( sizePrice > 0.01){
                newProductInGroupSizes.push(
                    {
                        code: currentSizes[i].code,
                        label: Maestro.Client.getProductSizeName(currentSizes[i].code),
                        price: sizePrice
                    }
                );
            }
        }

        var productName = document.getElementById("firstVariantName").value;

        if(newProductInGroupSizes.length > 0 && productName){
            let productObject = {
                name: productName,
                sizes: newProductInGroupSizes
            };

            console.log('product object: ', productObject);

            let currentNewGroupProducts = template.newGroup.get();
            currentNewGroupProducts.push(productObject);
            template.newGroup.set(currentNewGroupProducts);

            return true;
        }

        return false;
    };

    template.addVariantToGroup = function(){

        var currentSizes = Maestro.Client.getBusinessProductSizes();
        
        var newProductInGroupSizes = [];    

        for (i = 0; i < currentSizes.length; i++){ 
            let sizePrice = Number(document.getElementById("addVariantSize_"+currentSizes[i].code).value);
            if ( sizePrice > 0.01){
                newProductInGroupSizes.push(
                    {
                        code: currentSizes[i].code,
                        label: Maestro.Client.getProductSizeName(currentSizes[i].code),
                        price: sizePrice
                    }
                );
            }
        }

        var productName = document.getElementById("addVariantName").value;

        if(newProductInGroupSizes.length > 0 && productName){
            let productObject = {
                name: productName,
                sizes: newProductInGroupSizes
            };

            console.log('product object: ', productObject);

            let currentNewGroupProducts = template.newGroup.get();
            currentNewGroupProducts.push(productObject);
            template.newGroup.set(currentNewGroupProducts);

            return true;
        }
        return false;
    };

    template.addNewVariantToExistingGroup = function(){
        let added = template.addVariantToGroup();

        if (added){
            let productSet = template.newGroup.get();
            var product = productSet[0];
            let group = template.selectedGroup.get();

            productSizes = _.map(product.sizes,function(size){return {
                code: size.code,
                price: size.price}; 
            });

            product.sizes = productSizes;
            product.categories= group.categories || [];
            product.locations= group.locations || [];
            product.taxRule= group.taxRule ||  Maestro.Tax.Types.RETAIL_TAX.key;
            product.addOns= group.addOns || [];
            product.status= 'Active';
            product.group= group.name;
            product.businessId = Maestro.Client.businessId();

            Meteor.call("createProduct", product);

            template.newGroup.set([]);
            template.addVariantMode.set(false);
        }
    };

    template.convertProduct = function(productId, groupName, groupSettings){
        console.log(productId, groupName, groupSettings);
        let convertProductDetails = {    
            categories: groupSettings.categories || [],
            locations: groupSettings.locations || [],
            taxRule: groupSettings.taxRule ||  Maestro.Tax.Types.RETAIL_TAX.key,
            addOns: groupSettings.addOns || [],
            status: 'Active',
            group: groupName
        };

        Meteor.call('setProductAttr', productId, convertProductDetails);
    };

    template.removeProductFromGroup = function(product){
        Meteor.call('setProductAttr', product._id, {group: null});
    };

    template.dismantleGroupProducts = function(group){
        let groupProducts = Maestro.Client.getProductsInGroup(group._id);

        if(groupProducts){
            for (i=0; i < groupProducts.length; i++){
                template.removeProductFromGroup(groupProducts[i]);
            }
        }

        template.selectedGroup.set();

    };
});

Template.ProductsListView.onRendered(function () {    
    $('#filterSection').hide();
    $('#hideFiltersButton').hide();
    // initializeProductSelected();

});

Template.ProductsListView.helpers({
    getSortedFilteredProductsAndGroups: function (){
        var findCriteria = {};

        let statusType = Template.instance().selectedStatus.get();
        
        if (statusType == "active"){
            findCriteria = {status:'Active'};
        } else if (statusType == "out-of-season"){
            findCriteria = {status:'Out of Season'}
        } else if (statusType == "archived"){
            findCriteria = {status:'Archived'}
        }

        let categoryName = Template.instance().selectedCategoryFilter.get();

        if (categoryName == "All"){
            findCriteria.categories = "";
            delete findCriteria.categories;
        } else if (categoryName){
            findCriteria.categories = categoryName;
        }

        let sortType = Template.instance().selectedSort.get();

        return Maestro.Client.getProductsAndGroups(findCriteria, sortType);
    },

    isSortSelected: function(sortType){
        if (sortType == Template.instance().selectedSort.get()){
            return 'background-color:lightblue;';
        } 
    },

    isStatusSelected: function(statusType){
        if (statusType == Template.instance().selectedStatus.get()){
            return 'background-color:lightblue;';
        }
    },

    isCategorySelected: function(categoryName){
        if (categoryName == Template.instance().selectedCategoryFilter.get()){
            return 'background-color:lightblue;';
        }
    },

    activeProduct: function(itemId){
        let chosenProduct = Maestro.Client.getProductOrGroup(itemId);
        if (chosenProduct.status =="Active"){
            return true;
        } else {
            return false;
        }
    },

    outOfSeasonProduct: function(itemId){
        let chosenProduct = Maestro.Client.getProductOrGroup(itemId);
        if (chosenProduct.status =="Out of Season"){
            return true;
        } else {
            return false;
        }
    },

    archivedProduct: function(itemId){
        let chosenProduct = Maestro.Client.getProductOrGroup(itemId);
        if (chosenProduct.status =="Archived"){
            return true;
        } else {
            return false;
        }
    },

    // products: function () {
    //     var tempProducts = Products.find({});
    //     if (tempProducts.count() == 0){
    //         var msgNoneDB = [{name:'Looking pretty empty in here.. Add New Products', _id:"0"}];
    //         return msgNoneDB;
    //     } else {
    //         return getProducts();
    //     }
    // },

    // isThisAGroupItem: function(groupFlag){
    //     if (groupFlag === true){
    //         return true;
    //     } else {
    //         return false;
    //     }
    // },

    productNotPartOfGroup: function(groupName){
        if (groupName == null){
            return true;
        } else {
            return false;
        }
    },

    getSelectedProduct: function(){
        let chosenProduct = Template.instance().selectedProduct.get();
        if (chosenProduct){
            return Products.findOne({_id: chosenProduct._id});
        }
    },

    getSelectedGroup: function(){
        if(Template.instance().selectedProduct.get()){
            return;
        } else {
            return Template.instance().selectedGroup.get();
        }
    },

    isSelectedProduct: function(productId){
        let chosenProduct = Template.instance().selectedProduct.get();
        if (chosenProduct){
            let chosenProductId = chosenProduct._id;

            if (productId == chosenProductId){
                return 'background-color:lightblue;';
            } else {
                return;
            }
        } else {return;}
    },

    isThisSelectedGroup: function(name){
        let chosenGroup = Template.instance().selectedGroup.get();
        if (chosenGroup){
            let chosenGroupName = chosenGroup.name;
            if (name == chosenGroupName){
                return true;
            } else {
                return false;
            }
        } else {return false;}
    },

    getSizes: function(productId) {
        var product = Maestro.transformProduct(Products.findOne({_id: productId}), true);
        return product.sizes;
    },

    getNewProductSizes: function(productSizes){
        var tempProduct = {}
        tempProduct.sizes = productSizes;

        tempProduct = Maestro.transformProduct(tempProduct, true);

        return tempProduct.sizes;
    },

    preferredSizes: function() {
        return Maestro.Client.getBusinessProductSizes();
    },

    ifNonZeroSizes: function(price){
        if (price < 0.01 ){
            return false;
        } else {
            return true;
        }
    },

    locations: function(){
        return Locations.find({});
    },

    categories: function(){
        return ProductCategories.find({});
    },

    addOns: function(){
        return ProductAddons.find({status: 'Active'}).fetch();
    },

    getAddOnName: function( addOnId ){
        return ProductAddons.findOne({_id: addOnId}).name;
    },

    getLocationName: function( locationId){
        return Locations.findOne({_id: locationId}).name;
    },

    ifCategorySelectedGetImportance: function( categoryName ) {
        let chosenProduct = Template.instance().selectedProduct.get();

        if (chosenProduct){
            let updatedProduct = Products.findOne({_id: chosenProduct._id});
            let categorySet = updatedProduct.categories;
            let categoryIndex = _.indexOf(categorySet, categoryName);
            if(categoryIndex == 0){
                return "Primary";
            } else if (categoryIndex == 1) {
                return "Secondary";
            } else if (categoryIndex >=2 ) {
                return "Tertiary & Other";
            }
        }

    },

    ifCategorySelectedGetImportanceInNew: function( categoryName ) {
        let chosenProduct = Template.instance().savedSettings.get();

        if (chosenProduct){
            let categorySet = chosenProduct.categories;
            let categoryIndex = _.indexOf(categorySet, categoryName);
            if(categoryIndex == 0){
                return "Primary";
            } else if (categoryIndex == 1) {
                return "Secondary";
            } else if (categoryIndex >=2 ) {
                return "Tertiary & Other";
            }
        }

    },

    getTaxRuleLabel: function(taxKey){
        let taxLabel = Maestro.Tax.Types.get(taxKey, "label", "Unknown");
        // if(taxLabel == "Taxed"){ taxLabel = Maestro.Tax.Types.get("RETAIL-TAX", "label", "Unknown"); }
        return taxLabel;
    },

    getTaxKeys: function(){
        // let taxKeys = Maestro.Tax.Types.keys();
        // return Maestro.Tax.Types.keys();
        return Maestro.Tax.GetTaxKeysForLocation();
    },

    getTaxLabel: function(taxKey){
        return Maestro.Tax.Types.get(taxKey, 'label', 'unknown');
    },

    getTaxDescription: function(taxKey){
        return Maestro.Tax.Types.get(taxKey, 'description', 'unknown');
    },

    priceUpdateModeEnabled: function(){
        return Template.instance().priceUpdateMode.get();
    },

    newProductModeEnabled: function(){
        return Template.instance().newProductMode.get();
    },

    newGroupModeEnabled: function(){
        return Template.instance().newGroupMode.get();
    },

    createModeEnabled: function(){
        return Template.instance().newProductMode.get() || Template.instance().newGroupMode.get();
    },

    createModeNotEnabled: function(){
        return ! (Template.instance().newProductMode.get() || Template.instance().newGroupMode.get());
    },

    viewGroupMode: function(){
        return Template.instance().isViewGroupMode.get();
        // if (Template.instance().selectedGroup.get() != null && Template.instance().selectedProduct.get() == null){
        //     return true;
        // } else {
        //     return false;
        // }
    },

    viewProductMode: function(){
        return Template.instance().isViewProductMode.get();
        // if(Template.instance().selectedProduct.get() != null){
        //     return true;
        // } else {
        //     return false;
        // }
    },

    savedCategories: function(){
        return Template.instance().savedSettings.get().categories;
    },

    savedAddOns: function(){
        return Template.instance().savedSettings.get().addOns;
    },

    savedTaxRule: function(){
        return Template.instance().savedSettings.get().taxRule;
    },

    savedLocations: function(){
        return Template.instance().savedSettings.get().locations;
    },

    newGroupProducts: function(){
        return Template.instance().newGroup.get();
    },

    getNewProductName: function(){
        return Template.instance().newProductName.get();
    },

    isAddVariantMode: function(){
        return Template.instance().addVariantMode.get();
    },

    isSamePriceVariantMode: function(){
        return Template.instance().samePriceVariants.get();
    },

    getFirstVariantPrice: function(code){
        let currentGroup = Template.instance().newGroup.get();
        let getVariantSize = _.find(currentGroup[0].sizes, function(variant){return variant.code == code;});
        if (getVariantSize){
            return getVariantSize.price;
        }
    },

    getUngroupedUnselectedProductIds: function(){
        return _.difference(_.pluck(Maestro.Client.getUngroupedProducts(), "_id"), _.pluck(Template.instance().convertProductsToGroup.get(), "_id"));
    },

    getAllGroups: function(){
        return Maestro.Client.getGroups();
    },

    getProductsToVariantSet: function(){
        return Template.instance().convertProductsToGroup.get();
    },

    getFirstVariantName: function(){
        return Template.instance().firstVariantName.get();
    },

    getEnableVariantStatus: function(){
        if(Template.instance().newGroupMode.get()){
            return "checked";
        }
    },

    isSelectedProductInGroup: function(){
        if (Template.instance().selectedProduct.get().group){
            return true;
        }
        return false;
    },

    isChooseExistingGroupMode: function(){
        return Template.instance().chooseExistingGroupMode.get();
    },

    isFirstVariantAdded: function(){
        if(Template.instance().newGroup.get().length == 0){
            return false;
        }
        return true;
    },

    editNameMode: function(){
        return Template.instance().editName.get();
    },

});

Template.ProductsListView.events({
    'keyup #newProductName': function(event, template){
        template.newProductName.set(document.getElementById('newProductName').value);
    },

    'click .editThisName': function(event, template){
        template.editName.set(true);
    },

    'click .cancelEditName': function(event, template){
        template.editName.set(false);
    },

    'click .saveNewProductName': function(event, template){
        let newName = document.getElementById('editProductName').value;
        let productId = template.selectedProduct.get()._id;

        Meteor.call('setProductAttr', productId, {name: newName}, function(error, result){
            if(error){
                console.log(error);
            }else {
                Materialize.toast('Updated Name', 1000);
                template.editName.set(false);
            }
        })
    },

    'click .saveNewGroupName': function(event, template){
        let currentGroupName = template.selectedGroup.get().name;
        let newName = document.getElementById('editGroupName').value;
        let products = Maestro.Client.getProductsInGroup(currentGroupName);

        for (i = 0; i < products.length; i++){
            Meteor.call('setProductAttr', products[i]._id, {group: newName});
        }

        template.editName.set(false);

        let groupName = newName;
        let groupObj = Maestro.Client.getProductOrGroup(groupName);

        template.selectedGroup.set(groupObj);
    },

    'click .addVariant': function(event, template){
        if(template.newGroup.get().length == 0){
            let firstAdded = template.addFirstVariantToGroup();
        } else {
            template.addVariantMode.set(true);
        }
    },
    
    'click .addNewVariantToGroup': function(event, template){
        template.addVariantMode.set(true);
    },


    'click .cancelAddVariant': function(event, template){
        template.addVariantMode.set(false);
    },

    'click .doneAddVariant': function(event, template){
        let added = template.addVariantToGroup();

        if(added){
            template.addVariantMode.set(false);
        }
    },

    'click .doneAddVariantToGroup': function(event, template){
        template.addNewVariantToExistingGroup();
    },

    'click #enableVariants': function(event, template){
        let isChecked = document.getElementById('enableVariants').checked;

        if (isChecked){
            template.newGroupMode.set(true);
            template.newProductMode.set(false);
            template.selectedProduct.set();
            template.selectedGroup.set();
            template.firstVariantName.set(template.newProductName.get());
        } else {
            template.newProductMode.set(true);
            template.newGroupMode.set(false);
            template.selectedProduct.set();
            template.selectedGroup.set();
        }
    },

    'click #samePriceAllVariants': function(event, template){
        if (document.getElementById('samePriceAllVariants').checked){
            template.samePriceVariants.set(true);
        } else {
            template.samePriceVariants.set(false);
        }
    },

    'click .addExistingProductVariant': function(event, template){
        $('#productToVariantModal').openModal();
    },

    'click .addProductToVariantSet': function(event, template){
        let product = Products.findOne({_id: this._id});
        var currentSet = template.convertProductsToGroup.get();
        currentSet.push(product);
        template.convertProductsToGroup.set(currentSet);
    },

    'click .removeProductFromConvertSet': function(event, template){
        let removeProduct = $(event.target).data('productid');
        var currentSet = template.convertProductsToGroup.get();
        currentSet = _.filter(currentSet, function(prod){ return prod._id != removeProduct;});
        template.convertProductsToGroup.set(currentSet);
    },

    'click .selectSort': function(event, template){
        let sortType = $(event.target).data("sort");
        template.selectedSort.set(sortType);
        // initializeProductSelected();
    },

    'click .selectStatus': function(event, template){
        let statusType = $(event.target).data("status");
        template.selectedStatus.set(statusType);
        // initializeProductSelected();
    },

    'click .selectCategory': function(event, template){
        let categoryName = $(event.target).data("category");
        template.selectedCategoryFilter.set(categoryName);
        // initializeProductSelected();
    },

    'click .selectProduct': function(event, template){
        let productId = $(event.target).data("productid");
        let chosenProduct = Products.findOne({_id:productId});
        template.selectedProduct.set(this);

        if (chosenProduct.group == null){
            template.selectedGroup.set();
        }

        template.isViewGroupMode.set(false);

        window.setTimeout(function(){template.isViewProductMode.set(true);}, 100 );
        
        
    },

    'click .selectGroup': function(event, template){
        let groupName = $(event.target).data("groupname");
        let groupObj = Maestro.Client.getProductOrGroup(groupName);

        if (template.selectedProduct.get()){
            template.selectedProduct.set();
        }

        if (template.selectedGroup.get() != groupObj){
            template.selectedGroup.set(groupObj);
        }

        template.isViewProductMode.set(false);

        window.setTimeout(function(){template.isViewGroupMode.set(true);}, 100 );
        
    },

    'click .new-Product': function(event, template){
        template.newProductMode.set(true);
        template.newGroupMode.set(false);
        template.selectedProduct.set();
        template.selectedGroup.set();
    },

    'click .new-Group': function(event, template){
        template.newGroupMode.set(true);
        template.newProductMode.set(false);
        template.selectedProduct.set();
        template.selectedGroup.set();
    },

    'click .cancelNewProduct': function(event, template){
        template.newProductMode.set(false);
        template.newProductName.set();
        template.firstVariantName.set();
    },

    'click .manage-Addons': function (event, template) {
        $('#manageAddonsModal').openModal();
    },

    'click .manage-Categories': function (event, template) {
        $('#manageCategoriesModal').openModal();
    },
    
    'click .manage-Sizes': function (event, template) {
        $('#manageSizesModal').openModal({ dismissible: true});
    },

    'click .manage-Locations': function(event, template){
        // $('#locationModal').closeModal();
        FlowRouter.go(Maestro.route.ListLocations);
    },

    'click .openAddOnModal' : function(event, template){
        $('#addOnModal').openModal();
    },

    'click .openNewProductAddOnModal' : function(event, template){
        $('#newProductAddOnModal').openModal();
    },

    'click .openCategoryModal' : function (event, template){
        $('#categoryModal').openModal();
    },

    'click .openNewProductCategoryModal' : function (event, template){
        $('#newProductCategoryModal').openModal();
    },

    'click .openTaxModal': function(event, template){
        $('#taxModal').openModal();
    },

    'click .openNewProductTaxModal' : function(event, template){
        $('#newProductTaxModal').openModal();
    },

    'click .openLocationModal' : function(event, template){
        $('#locationModal').openModal();
    },

    'click .openNewProductLocationModal' : function (event, template){
        $('#newProductLocationModal').openModal();
    },

    'click #hideFiltersButton': function(event, template){
        $('#hideFiltersButton').hide();
        $('#showFiltersButton').show();
        $('#filterSection').hide();
    },

    'click #showFiltersButton': function(event, template){
        $('#hideFiltersButton').show();
        $('#showFiltersButton').hide();
        $('#filterSection').show();
    },

    // 'click .pricingCells' : function(event, template){
    //     template.priceUpdateMode.set();
    // },

    'click .closeCategoryChip' : function(event, template){
        let productId = $(event.target).data("productid");
        let categoryLabel = $(event.target).data("category");

        var productAttrMod = {
            categories: categoryLabel
        };

        Meteor.call("removeProductAttr", productId, productAttrMod, function (error, result) {
            if (error) {
                console.log(error);
            }
        });
    },

    'click .closeNewProductCategoryChip' : function(event, template){
        let categoryLabel = $(event.target).data("category");

        var settings = template.savedSettings.get();
        settings.categories.splice(settings.categories.indexOf(categoryLabel),1);
        template.savedSettings.set(settings);

    },

    'click .closeGroupCategoryChip': function(event, template){
        let categoryLabel = $(event.target).data("category");
        let chosenGroup = template.selectedGroup.get();

        let productsInGroups = Maestro.Client.getProductsInGroup(chosenGroup.name);

        var productAttrMod = {};
        var productId;

        for (i = 0; i < productsInGroups.length; i++){
            productId = productsInGroups[i]._id;

            productAttrMod = {
                categories: categoryLabel
            };

            Meteor.call("removeProductAttr", productId, productAttrMod, function (error, result) {
                if (error) {
                    console.log(error);
                }
            });

            productAttrMod = {};
        }

        template.selectedGroup.set(Maestro.Client.getProductOrGroup(chosenGroup._id));
    },

    'click .addProductCategory': function(event, template){
        let productId = template.selectedProduct.get()._id;
        let selectedCategory = $(event.target).data('category');

        let productAttrMod = {
            categories: selectedCategory
        };

        Meteor.call("addProductAttr", productId, productAttrMod, function (error, result) {
            if (error) {
                console.log(error);
            }
        });
    },

    'click .chooseDeleteProduct': function(event, template){
        $('#confirmProductDeleteModal').openModal();
    },

    'click .deleteThisProduct': function(event, template){
        let product = template.selectedProduct.get();
        Meteor.call('deleteProduct', product._id);
    },

    'click .addGroupCategory': function(event, template){
        let categoryLabel = $(event.target).data("category");
        let chosenGroup = template.selectedGroup.get();

        let productsInGroups = Maestro.Client.getProductsInGroup(chosenGroup.name);

        var productAttrMod = {};
        var productId;

        for (i = 0; i < productsInGroups.length; i++){
            productId = productsInGroups[i]._id;

            productAttrMod = {
                categories: categoryLabel
            };

            Meteor.call("addProductAttr", productId, productAttrMod, function (error, result) {
                if (error) {
                    console.log(error);
                }
            });

            productAttrMod = {};
        }

        template.selectedGroup.set(Maestro.Client.getProductOrGroup(chosenGroup._id));
    },


    'click .addNewProductCategory': function(event, template){
        let selectedCategory = $(event.target).data('category');

        var settings = template.savedSettings.get();
        settings.categories.push(selectedCategory);
        template.savedSettings.set(settings);

    },

    'click .closeNewProductCategoryChip': function(event, template){
        let selectedCategory = $(event.target).data('category');

        var settings = template.savedSettings.get();
        settings.categories.splice(settings.categories.indexOf(selectedCategory),1);
        template.savedSettings.set(settings);
    },

    'click #variablePriceSetting': function(event, template){
        let enableStatus = document.getElementById('variablePriceSetting').checked;
        let productId = template.selectedProduct.get()._id;

        productDetails = {
            variablePrice: enableStatus
        };

        Meteor.call("setProductAttr", productId, productDetails, function (error, result) {
            if (error) {
                console.log(error);
            } 
        });
    },

    'click #unitBasedPriceSetting': function(event, template){
        let enableStatus = document.getElementById('unitBasedPriceSetting').checked;
        let productId = template.selectedProduct.get()._id;

        productDetails = {
            unitBasedPrice: enableStatus
        };

        Meteor.call("setProductAttr", productId, productDetails, function (error, result) {
            if (error) {
                console.log(error);
            } 
        });
    },

    'click #saveUnitLabel': function(event, template){
        let unitLabel = document.getElementById('unitLabel').value;

        if(unitLabel.length > 5) {Materialize.toast("Label should be less than 5 characters", 2000); return;}

        let productId = template.selectedProduct.get()._id;

        productDetails = {
            unitLabel: unitLabel
        };

        Meteor.call("setProductAttr", productId, productDetails, function (error, result) {
            if (error) {
                console.log(error);
            } 
        });
    },

    'click .attachSelectedAddon' : function(event, template){
        let addOnId = $(event.target).data('addonid');

        let productId = template.selectedProduct.get()._id;

        let productAttrMod = {
            addOns: addOnId
        };

        Meteor.call("addProductAttr", productId, productAttrMod, function (error, result) {
            if (error) {
                console.log(error);
            }
        });

    },

    'click .attachNewProductAddon' : function(event, template){
        let addOnId = $(event.target).data('addonid');

        var settings = template.savedSettings.get();
        settings.addOns.push(addOnId);
        template.savedSettings.set(settings);
    },

    'click .attachGroupSelectedAddon' : function(event, template){
        let addOnId = $(event.target).data('addonid');
        let chosenGroup = template.selectedGroup.get();

        let productsInGroups = Maestro.Client.getProductsInGroup(chosenGroup.name);

        var productAttrMod = {};
        var productId;

        for (i = 0; i < productsInGroups.length; i++){
            productId = productsInGroups[i]._id;

            productAttrMod = {
                addOns: addOnId
            };

            Meteor.call("addProductAttr", productId, productAttrMod, function (error, result) {
                if (error) {
                    console.log(error);
                }
            });

            productAttrMod = {};
        }

        template.selectedGroup.set(Maestro.Client.getProductOrGroup(chosenGroup._id));
    },

    'click .closeAddOnChip' : function(event, template){
        let addOnId = $(event.target).data("addonid");

        let productId = template.selectedProduct.get()._id;

        let productAttrMod = {
            addOns: addOnId
        };

        Meteor.call("removeProductAttr", productId, productAttrMod, function (error, result) {
            if (error) {
                console.log(error);
            }
        });
    },

    'click .closeGroupAddOnChip': function(event, template){
        let addOnId = $(event.target).data('addonid');
        let chosenGroup = template.selectedGroup.get();

        let productsInGroups = Maestro.Client.getProductsInGroup(chosenGroup.name);

        var productAttrMod = {};
        var productId;

        for (i = 0; i < productsInGroups.length; i++){
            productId = productsInGroups[i]._id;

            productAttrMod = {
                addOns: addOnId
            };

            Meteor.call("removeProductAttr", productId, productAttrMod, function (error, result) {
                if (error) {
                    console.log(error);
                }
            });

            productAttrMod = {};
        }

        template.selectedGroup.set(Maestro.Client.getProductOrGroup(chosenGroup._id));
    },

    'click .closeNewProductAddOnChip' : function(event, template){
        let addOnId = $(event.target).data("addonid");

        var settings = template.savedSettings.get();
        settings.addOns.splice(settings.addOns.indexOf(addOnId),1);
        template.savedSettings.set(settings);
    },

    'click .addTaxRule':function(event, template){
        let productId = template.selectedProduct.get()._id;
        let taxKey = $(event.target).data("taxkey");

        productDetails = {
            taxRule: taxKey
        };

        Meteor.call("setProductAttr", productId, productDetails, function (error, result) {
            if (error) {
                console.log(error);
            } 
        });            

        $('#taxModal').closeModal();
    },

    'click .addGroupTaxRule':function(event, template){
        let taxKey = $(event.target).data("taxkey");

        let chosenGroup = template.selectedGroup.get();

        let productsInGroups = Maestro.Client.getProductsInGroup(chosenGroup.name);

        var productDetails = {};
        var productId;

        for (i = 0; i < productsInGroups.length; i++){
            productId = productsInGroups[i]._id;
            
            productDetails = {
                taxRule: taxKey
            };

            Meteor.call("setProductAttr", productId, productDetails, function (error, result) {
                if (error) {
                    console.log(error);
                } 
            });            
           
            productDetails = {};
        }

        $('#taxModal').closeModal();

        template.selectedGroup.set(Maestro.Client.getProductOrGroup(chosenGroup._id));
    },

    'click .addNewProductTaxRule':function(event, template){
        let taxKey = $(event.target).data("taxkey");

        var settings = template.savedSettings.get();
        settings.taxRule = taxKey;
        template.savedSettings.set(settings);
    },

    'click .closeLocationChip' : function(event, template){
        let productId = $(event.target).data("productid");
        let locationLabel = $(event.target).data("locationid");

        var productAttrMod = {
            locations: locationLabel
        };

        Meteor.call("removeProductAttr", productId, productAttrMod, function (error, result) {
            if (error) {
                console.log(error);
            }
        });
    },

    'click .closeGroupLocationChip': function(event, template){
        let locationLabel = $(event.target).data("locationid");
        let chosenGroup = template.selectedGroup.get();

        let productsInGroups = Maestro.Client.getProductsInGroup(chosenGroup.name);

        var productAttrMod = {};
        var productId;

        for (i = 0; i < productsInGroups.length; i++){
            productId = productsInGroups[i]._id;

            productAttrMod = {
                locations: locationLabel
            };

            Meteor.call("removeProductAttr", productId, productAttrMod, function (error, result) {
                if (error) {
                    console.log(error);
                }
            });

            productAttrMod = {};
        }

        template.selectedGroup.set(Maestro.Client.getProductOrGroup(chosenGroup._id));
    },

    'click .closeNewProductLocationChip' : function(event, template){
        let locationLabel = $(event.target).data("locationid");

        var settings = template.savedSettings.get();
        settings.locations.splice(settings.locations.indexOf(locationLabel),1);
        template.savedSettings.set(settings);
    },

    'click .addLocation': function(event, template){
        let productId = template.selectedProduct.get()._id;

        let selectedLocation = $(event.target).data('locationid');

        var productAttrMod = {
            locations: selectedLocation
        };

        Meteor.call("addProductAttr", productId, productAttrMod, function (error, result) {
            if (error) {
                console.log(error);
            }
        });
    },

    'click .addGroupLocation' : function(event, template){
        let selectedLocation = $(event.target).data('locationid');

        let chosenGroup = template.selectedGroup.get();

        let productsInGroups = Maestro.Client.getProductsInGroup(chosenGroup.name);

        var productAttrMod = {};
        var productId;

        for (i = 0; i < productsInGroups.length; i++){
            productId = productsInGroups[i]._id;

            productAttrMod = {
                locations: selectedLocation
            };

            Meteor.call("addProductAttr", productId, productAttrMod, function (error, result) {
                if (error) {
                    console.log(error);
                }
            });

            productAttrMod = {};
        }

        template.selectedGroup.set(Maestro.Client.getProductOrGroup(chosenGroup._id));
    },


    'click .addNewProductLocation': function(event, template){
        let selectedLocation = $(event.target).data('locationid');

        var settings = template.savedSettings.get();
        settings.locations.push(selectedLocation);
        template.savedSettings.set(settings);
    },

    'click .editProductPricing' : function(event, template){
        template.priceUpdateMode.set(true);
    },

    'click .addProductToGroup': function(event, template){
        var currentSizes = Maestro.Client.getBusinessProductSizes();
        
        var newProductInGroupSizes = [];    

        for (i = 0; i < currentSizes.length; i++){ 
            let sizePrice = Number(document.getElementById("addVariantSize_"+currentSizes[i].code).value);
            if ( sizePrice > 0.01){
                newProductInGroupSizes.push(
                    {
                        code: currentSizes[i].code,
                        label: Maestro.Client.getProductSizeName(currentSizes[i].code),
                        price: sizePrice
                    }
                );
            }
        }

        var productName = document.getElementById("addVariantName").value;

        if(newProductInGroupSizes.length > 0){
            let productObject = {
                name: productName,
                sizes: newProductInGroupSizes
            };

            console.log('product object: ', productObject);

            let currentNewGroupProducts = template.newGroup.get();
            currentNewGroupProducts.push(productObject);
            template.newGroup.set(currentNewGroupProducts);

            document.getElementById('addVariantForm').reset();
        }
    },

    'click .updateProductPricing': function(event, template){
        let productId = template.selectedProduct.get()._id;

        let product = Maestro.transformProduct(Products.findOne({_id: productId}), true);

        var currentSizes = product.sizes;
        var newSizes = [];    

        for (i = 0; i < currentSizes.length; i++){ 
            let sizePrice = Number(document.getElementById(productId+"_"+currentSizes[i].code).value);
            if ( sizePrice > 0.01){
                newSizes.push(
                    {
                        code: currentSizes[i].code,
                        price: sizePrice
                    });
            }
        }

        var productAttrMod;
        productAttrMod = {sizes: newSizes};

        Meteor.call("setProductAttr", productId, productAttrMod, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                Materialize.toast("updated", 1000);
            }
        });
        template.priceUpdateMode.set(false);
    },

    'click .outOfSeason':function(event, template){
        let productId = $(event.target).data("productid");

        let activeSeason = document.getElementById('seasonality').checked;
        var status;

        if (!activeSeason){
            status = 'Out of Season';
        } else {
            status = 'Active';
        }

        productDetails = {
            status:status
        };

        Meteor.call("setProductAttr", productId, productDetails, function (error, result) {
            if (error) {
                console.log(error);
            } 
        });            
    },

    'click .longTermArchive':function(event, template){
        let productId = $(event.target).data("productid");

        productDetails = {
            status:'Archived'
        };

        Meteor.call("setProductAttr", productId, productDetails, function (error, result) {
            if (error) {
                console.log(error);
            } 
        });            

    },

    'click .activateProduct':function(event, template){
        let productId = $(event.target).data("productid");

        productDetails = {
            status:'Active'
        };

        Meteor.call("setProductAttr", productId, productDetails, function (error, result) {
            if (error) {
                console.log(error);
            } 
        });            

    },

    'click .createNewProduct': function (event, template) {
        event.preventDefault();

        var currentSizes = Maestro.Client.getBusinessProductSizes();
        
        var newSizes = [];    
        var productName = document.getElementById("newProductName").value;
        
        if(template.savedSettings.get().taxRule == null){
            Materialize.toast('Select a Tax Rule', 3000);
            return;
        }
        
        for (i = 0; i < currentSizes.length; i++){ 
            let sizePrice = Number(document.getElementById("newProductSize_"+currentSizes[i].code).value);
            if ( sizePrice >= 0.01){
                newSizes.push(
                    {
                        code: currentSizes[i].code,
                        price: sizePrice
                    });
            }
        }
            
        if(newSizes.length > 0 && productName !=""){   

            var businessId = Maestro.Client.businessId();

            settings = template.savedSettings.get();           

            let variablePriceEnable = document.getElementById('variablePriceSetting_newProduct').checked;
            let unitBasedPriceEnable = document.getElementById('unitBasedPriceSetting_newProduct').checked;
            let unitLabel = document.getElementById('unitLabel_newProduct').value;

            if(unitLabel.length > 5){Materialize.toast("Label should be less than 5 characters long", 2000); return;}

            var productDetails = {
                name: productName,
                categories: settings.categories || [],
                locations: settings.locations || [],
                taxRule: settings.taxRule ||  Maestro.Tax.Types.RETAIL_TAX.key,
                addOns: settings.addOns || [],
                status: 'Active',
                sizes: newSizes,
                variablePrice: variablePriceEnable,
                unitBasedPrice: unitBasedPriceEnable,
                unitLabel: unitLabel,
                businessId: businessId
            };

            console.log("creating product : ", productDetails);
            
            Meteor.call("createProduct", productDetails, function (error, result) {
                if (error) {
                    console.log(error);
                } else {
                    Materialize.toast("Added " + productName, 4000);
                    template.selectedProduct.set(result);
                }
            });     

            document.getElementById('addNewProductForm').reset();

            let rememberSettings = document.getElementById('rememberSelections').checked;
            // console.log(rememberSettings);

            if(!rememberSettings){
                template.savedSettings.set({
                    categories:[],
                    addOns: [],
                    taxRule: Maestro.Tax.Types.RETAIL_TAX.key,
                    locations:[]
                });
            }     

            template.newProductMode.set(false);
            template.newProductName.set();
            template.firstVariantName.set();
        } else {
            Materialize.toast('Enter at least a product name and price', 1000);
        }
    },

    'click .stopNewProductMode': function(event, template){
        template.newProductMode.set(false);
        template.newProductName.set();
        template.firstVariantName.set();
    },

    'click #convertThisProductToGroup': function(event, template){
        if(document.getElementById('convertThisProductToGroup').checked){
            $('#newGroupOrExistingConfirm').openModal();
            template.chooseExistingGroupMode.set(false);
        }
    },

    'click .confirmProductToNewGroup': function(event, template){
        var currentSet = template.convertProductsToGroup.get();
        let thisProduct = template.selectedProduct.get();
        currentSet.push(thisProduct);
        template.convertProductsToGroup.set(currentSet);
        template.newGroupMode.set(true);

        template.savedSettings.set({
            categories: thisProduct.categories,
            addOns: thisProduct.addOns,
            taxRule: thisProduct.taxRule,
            locations: thisProduct.locations
        });
    },

    'click .confirmProductToExistingGroup': function(event, template){
        template.chooseExistingGroupMode.set(true);
    },

    'click .addExistingProductsToGroup': function(event, template){
        let productsToBeConverted = template.convertProductsToGroup.get();
        let groupSettings = template.selectedGroup.get();
        let groupName = groupSettings.name;

        if (productsToBeConverted.length > 0){
            for (prod = 0; prod < productsToBeConverted.length; prod ++){
                template.convertProduct(productsToBeConverted[prod]._id, groupName, groupSettings);
            }
        }
        template.convertProductsToGroup.set([]);
    },

    'click .addProductToThisGroup': function(event, template){
        let group = this;
        let product = template.selectedProduct.get();
        template.selectedGroup.set(group);
        template.convertProduct(product._id, group.name, group);
        template.chooseExistingGroupMode.set(false);
        template.selectedProduct.set(Products.findOne({_id: product._id}));
        $('#newGroupOrExistingConfirm').closeModal();
    },

    'click #convertGroupToProducts': function(event, template){
        if(document.getElementById('convertGroupToProducts').checked == false){
             $('#dismantleGroupConfirm').openModal();
        }
    },

    'click .dismantleGroup': function(event, template){
        template.dismantleGroupProducts(template.selectedGroup.get());
    },

    'click #unGroupProduct': function(event, template){
        template.removeProductFromGroup(this);
        template.selectedGroup.set();
        template.selectedProduct.set(Products.findOne({_id: this._id}));
    },

    'click .setVariantStatus': function(event, template){
        document.getElementById('convertGroupToProducts').checked = true;
    },

    'click .createNewGroup': function (event, template) {
        event.preventDefault();

        if(template.savedSettings.get().taxRule == null){
            Materialize.toast('Select a Tax Rule', 3000);
            return;
        }

        var groupProducts = template.newGroup.get();
        let productsToBeConverted = template.convertProductsToGroup.get();
        var groupName = document.getElementById("newProductName").value;

        if ((groupName != "") && (groupProducts.length > 0 ||productsToBeConverted.length > 0)){
        
            if(groupProducts.length > 0){
                var businessId = Maestro.Client.businessId();

                let settings = template.savedSettings.get();

                var productDetails = {};           
                var productSizes = [];

                let variablePriceEnable = document.getElementById('variablePriceSetting_newProduct').checked;
                let unitBasedPriceEnable = document.getElementById('unitBasedPriceSetting_newProduct').checked;
                let unitLabel = document.getElementById('unitLabel_newProduct').value;

                if(unitLabel.length > 5){Materialize.toast("Label should be less than 5 characters long", 2000); return;}

                for (i = 0; i < groupProducts.length; i++){
                    
                    productSizes = _.map(groupProducts[i].sizes,function(size){return {
                        code: size.code,
                        price: size.price}; 
                    });

                    console.log('productSizes: ', productSizes);

                    productDetails = {
                        name: groupProducts[i].name,
                        categories: settings.categories || [],
                        locations: settings.locations || [],
                        taxRule: settings.taxRule ||  Maestro.Tax.Types.RETAIL_TAX.key,
                        addOns: settings.addOns || [],
                        status: 'Active',
                        sizes: productSizes,
                        group: groupName,
                        variablePrice: variablePriceEnable,
                        unitBasedPrice: unitBasedPriceEnable,
                        unitLabel: unitLabel,
                        businessId: businessId
                    };

                    console.log("creating product: ", productDetails);
                
                    Meteor.call("createProduct", productDetails, function (error, result) {
                        if (error) {
                            console.log(error);
                        }
                    });

                    productDetails = {};
                    productSizes = [];
                }           
            }


            let groupSettings = template.savedSettings.get();

            if (productsToBeConverted.length > 0){
                for (prod = 0; prod < productsToBeConverted.length; prod ++){
                    template.convertProduct(productsToBeConverted[prod]._id, groupName, groupSettings);
                }
            }
            
            template.convertProductsToGroup.set([]);

            document.getElementById('addNewProductForm').reset();
            template.newGroup.set([]);

            let rememberSettings = document.getElementById('rememberSelections').checked;

            if(!rememberSettings){
                template.savedSettings.set({
                    categories:[],
                    addOns: [],
                    taxRule: Maestro.Tax.Types.RETAIL_TAX.key,
                    locations:[]
                });
            }

            template.newGroupMode.set(false);
            template.newProductName.set();
            template.firstVariantName.set();
            template.selectedProduct.set();
        } else {
            Materialize.toast('Enter a group name and add variants', 1000);

        }
    },

    'click .stopNewGroupMode': function(event, template){
        template.newGroupMode.set(false);
        template.newProductName.set();
        template.firstVariantName.set();
        template.selectedProduct.set();
    },

    'click .cancelNewGroup': function(event, template){
        template.newGroupMode.set(false);
        template.selectedProduct.set();
        template.selectedGroup.set();
        template.convertProductsToGroup.set([]);
        document.getElementById('addNewProductForm').reset();
        template.newGroup.set([]);
        template.newProductName.set();
        template.firstVariantName.set();
    },

});

