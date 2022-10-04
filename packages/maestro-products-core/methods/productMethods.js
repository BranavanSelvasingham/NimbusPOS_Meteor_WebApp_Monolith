//all Product related methods
// Products, Categories, Addons

Meteor.methods({
    createProduct: function(productDetails){
        check(productDetails, Maestro.Schemas.Product);

        var productId;

        try{
            productId = Products.insert(productDetails);
        } catch(e){
            console.log("Error creating product: "+ e);
        }

        return Products.findOne({_id: productId});

    },

    setProductAttr: function(productId, productAttrMod){
        var updates;

        try{
            updates = Products.update(productId, {$set: productAttrMod});
            // console.log("Records updated: ", updates);
        } catch(e){
            console.log("Error updating product: "+ e);
        }

    },

    addProductAttr: function(productId, productAttrMod){
        var updates;

        try{
            updates = Products.update(productId, {$addToSet: productAttrMod});
            // console.log("Records updated: ", updates);
        } catch(e){
            console.log("Error updating product: ", e);
        }

    },

    removeProductAttr: function(productId, productAttrMod){
        var updates;

        try{
            updates = Products.update(productId, {$pull: productAttrMod});
            // console.log("Records updated: ", updates);
        } catch(e){
            console.log("Error updating product: "+ e);
        }

    },

    deleteProduct: function(productId){
        try{
            Products.remove(productId);
            console.log("Deleted product: ", productId);
        } catch(e){
            console.log("Error deleting product: ", e);
        }
    },

    createCategory: function(categoryDetails){
        check(categoryDetails, Maestro.Schemas.ProductCategory);

        var categoryId;

        try{
            categoryId = ProductCategories.insert(categoryDetails);
        } catch(e){
            console.log("Error creating category: "+ e);
        }

    },

    updateCategory: function(categoryId, categoryDetails){
        try{
            let updates = ProductCategories.update(categoryId, {$set: categoryDetails});
        } catch(e){
            console.log('Error updating category: '+e);
        }
    },

    removeCategory: function(categoryId){

        try{
            ProductCategories.remove(categoryId);
        } catch(e){
            console.log("Error removing category: "+ e);
        }

    },

    createAddon: function(addonDetails){
        check(addonDetails, Maestro.Schemas.ProductAddon);

        var addonId;

        try{
            addonId = ProductAddons.insert(addonDetails);
        } catch(e){
            console.log("Error creating addon: "+ e);
        }

    },

    updateAddon: function(addonId, addonDetails){
        var addonsUpdated;

        try{
            addonsUpdated = ProductAddons.update(addonId, {$set: addonDetails});
        } catch(e){
            console.log("Error creating addon: "+ e);
        }

    },	

    searchProducts: function (searchTerm) {
        var searchSplit = searchTerm.split(":");
        let user = Meteor.users.findOne({_id: this.userId});
        let businessId = user.profile.businessId;

        if (searchTerm == "" || !searchTerm){
            return Products.find({businessId: businessId}).fetch();
        } else if (searchSplit.length > 1 && searchSplit[0] =="Category"){
            return Products.find({businessId: businessId, categories:searchSplit[1]}).fetch();
        } else {
            return Maestro.UtilityMethods.RegExSearch(searchTerm, Products, this.userId);
        }
    },

    updateProductSort: function(productSortList){
        _.each(productSortList, function(productId, index){
            try {
                Products.update(productId, {$set: {sortPosition: index}});
            } catch(e){
                console.log("Error updating sort: ", e);
            }
        });
    },

    updateCategorySort: function(categorySortList){
        _.each(categorySortList, function(categoryId, index){
            try {
                ProductCategories.update(categoryId, {$set: {sortPosition: index}});
            } catch(e){
                console.log("Error updating sort: ", e);
            }
        });
    }

});