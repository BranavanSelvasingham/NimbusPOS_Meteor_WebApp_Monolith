
Maestro.Client.getAllBusinessProductSizes = function () {
    var business = Maestro.Business.getBusiness();
    if(!!business){
        return business.configuration.sizes;
    }
};

Maestro.Client.getBusinessProductSize = function (sizeCode) {
    var businessSizes = Maestro.Client.getAllBusinessProductSizes();
    return _.find(businessSizes, function (size) {
        return size.code === sizeCode;
    });
};

Maestro.Client.getBusinessProductSizes = function () {
    var businessSizes = Maestro.Client.getAllBusinessProductSizes();
    return _.filter(businessSizes, function (size) {
        return size.available;
    });
};

Maestro.Client.getPreferredBusinessProductSizes = function () {
    var businessSizes = Maestro.Client.getAllBusinessProductSizes();
    return _.filter(businessSizes, function (size) {
        return size.preferred;
    });
};

Maestro.Client.getProductSizeName = function (sizeCode) {
    var businessProductSize = Maestro.Client.getBusinessProductSize(sizeCode);
    return businessProductSize.label;
};

Maestro.Client.isProductSizePreferred = function (sizeCode) {
    var businessProductSize = Maestro.Client.getBusinessProductSize(sizeCode);
    return businessProductSize.preferred;
};

Maestro.Client.getCategoryColor = function (categoryId) {
    var color = "amethyst";
    var category = ProductCategories.findOne({_id: categoryId});
    if(category && category.color) {
        color = category.color;
    }

    return color;
};

Maestro.transformProduct = function (product, addMissingSizes) {
    if(product && !_.isEmpty(product)) {
        var newProductSizes = [];
        var businessSizes = Maestro.Client.getBusinessProductSizes();
        var productSizes = product.sizes || [];

        _.map(businessSizes, function (businessSize) {
            productSize = _.find(productSizes, function (sizeItem) {
                return sizeItem.code === businessSize.code;
            });

            if(productSize) {
                newProductSizes.push(_.extend(businessSize, productSize));
            } else if(addMissingSizes) {
                productSize = { price: 0.00 };
                newProductSizes.push(_.extend(businessSize, productSize));
            }
        });

        product.sizes = newProductSizes;
    }

    return product;
};

Maestro.Client.sortArrayOfProducts = function(sortedProductsAndGroups, sortCriteria = ""){
    if(!!sortCriteria){
        sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, sortCriteria);
    }
    sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, "sortPosition");
    return sortedProductsAndGroups;
};

Maestro.Client.getProductsAndGroupsOptimize = function(generalFilterCriteria,  sortCriteria = null, categoryFilter, optimize){
    let fieldsOptimize = {};

    if(optimize){
        fieldsOptimize.name = 1;
        fieldsOptimize.group = 1;
        fieldsOptimize.categories = 1;
    }

    let allProducts = Products.find(generalFilterCriteria, {fields: fieldsOptimize} ).fetch();

    let ungroupedProducts = _.filter(allProducts, function(product){return product.group == null;});

    let groupedProducts = _.filter(allProducts, function(product){return product.group != null;});

    let allGroupNames = _.uniq(_.pluck(groupedProducts, 'group'));

    let allGroupToProductObjects = [];

    for (i = 0; i< allGroupNames.length; i++){
        let referenceProduct = Products.findOne({group: allGroupNames[i]});

        allGroupToProductObjects.push({
            _id: allGroupNames[i],
            name: allGroupNames[i],
            // status: referenceProduct.status,
            // businessId: referenceProduct.businessId,
            // locations: referenceProduct.locations,
            categories: referenceProduct.categories,
            // addOns: referenceProduct.addOns,
            // taxRule: referenceProduct.taxRule,
            sortPosition: referenceProduct.sortPosition,
            thisIsGroup: true, 
        });
    }

    let allProductsAndGroups = _.union(allGroupToProductObjects, ungroupedProducts);

    var categoryFilteredProductsAndGroups = allProductsAndGroups;

    if (categoryFilter){
        let primaryCategoryName = categoryFilter.primary;
        if(primaryCategoryName != "All" && primaryCategoryName != ""){
            categoryFilteredProductsAndGroups = _.filter(categoryFilteredProductsAndGroups, function(item){
                return item.categories[0] == primaryCategoryName;
            });
        }

        if(categoryFilter.secondary){
            let secondaryCategoryName = categoryFilter.secondary;
            categoryFilteredProductsAndGroups = _.filter(categoryFilteredProductsAndGroups, function(item){
                return item.categories[1] == secondaryCategoryName;
            });
        }

    }


    if(sortCriteria){
        let filterKeys = _.keys(generalFilterCriteria) || [];
        let filterValues = _.values(generalFilterCriteria) || [];

        var filteredProductsAndGroups = categoryFilteredProductsAndGroups;

        var sortedProductsAndGroups = filteredProductsAndGroups;
    
        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, sortCriteria);

        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, "sortPosition");

        return Maestro.Client.sortArrayOfProducts(sortedProductsAndGroups, sortCriteria);

    } else {
        // categoryFilteredProductsAndGroups = _.sortBy(categoryFilteredProductsAndGroups, "sortPosition");

        return Maestro.Client.sortArrayOfProducts(categoryFilteredProductsAndGroups);
    }

};

Maestro.Client.getProductsAndGroups = function(generalFilterCriteria = {},  sortCriteria = null, categoryFilter){
    let highLevelFilters = {};
    if(!!generalFilterCriteria.status){
        highLevelFilters.status = generalFilterCriteria.status;
    }

    let allProducts = Products.find(highLevelFilters).fetch();

    let ungroupedProducts = _.filter(allProducts, function(product){return product.group == null;});

    let groupedProducts = _.filter(allProducts, function(product){return product.group != null;});

    let allGroupNames = _.uniq(_.pluck(groupedProducts, 'group'));

    let allGroupToProductObjects = [];

    _.each(allGroupNames, function(groupName){
        let referenceProduct = Products.findOne(_.extend({group: groupName}, highLevelFilters));

        allGroupToProductObjects.push({
            _id: groupName,
            name: groupName,
            status: referenceProduct.status,
            businessId: referenceProduct.businessId,
            locations: referenceProduct.locations,
            categories: referenceProduct.categories,
            addOns: referenceProduct.addOns,
            taxRule: referenceProduct.taxRule,
            sortPosition: referenceProduct.sortPosition,
            thisIsGroup: true, 
        });
    });

    let allProductsAndGroups = _.union(allGroupToProductObjects, ungroupedProducts);

    var categoryFilteredProductsAndGroups = allProductsAndGroups;

    if (categoryFilter){
        let primaryCategoryName = categoryFilter.primary;
        if(primaryCategoryName != "All" && primaryCategoryName != ""){
            categoryFilteredProductsAndGroups = _.filter(categoryFilteredProductsAndGroups, function(item){
                return item.categories[0] == primaryCategoryName;
            });
        }

        if(categoryFilter.secondary){
            let secondaryCategoryName = categoryFilter.secondary;
            categoryFilteredProductsAndGroups = _.filter(categoryFilteredProductsAndGroups, function(item){
                return item.categories[1] == secondaryCategoryName;
            });
        }
    }


    if(generalFilterCriteria || sortCriteria){
        let filterKeys = _.keys(generalFilterCriteria) || [];
        let filterValues = _.values(generalFilterCriteria) || [];

        var filteredProductsAndGroups = categoryFilteredProductsAndGroups;

        for (j = 0; j< filterKeys.length; j++){
            filteredProductsAndGroups = _.filter(filteredProductsAndGroups, function(product){
                if(_.isArray(product[filterKeys[j]])){
                    return _.contains(product[filterKeys[j]], filterValues[j]);
                }
                return product[filterKeys[j]]==filterValues[j];
            });
        }

        var sortedProductsAndGroups = filteredProductsAndGroups;
    
        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, sortCriteria);

        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, "sortPosition");

        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, "sortPosition");

        return Maestro.Client.sortArrayOfProducts(sortedProductsAndGroups, sortCriteria);

    } else {
        // categoryFilteredProductsAndGroups = _.sortBy(categoryFilteredProductsAndGroups, "sortPosition");

        return Maestro.Client.sortArrayOfProducts(categoryFilteredProductsAndGroups);
    }

};

Maestro.Client.getProductsAndGroupsFlattened = function(generalFilterCriteria = {}, sortCriteria = null, categoryFilter){
    let highLevelFilters = {};
    if(!!generalFilterCriteria.status){
        highLevelFilters.status = generalFilterCriteria.status;
    }

    let allProducts = Products.find(highLevelFilters).fetch();

    var categoryFilteredProductsAndGroups = allProducts;

    if (categoryFilter){
        let primaryCategoryName = categoryFilter.primary;
        if(primaryCategoryName != "All" && primaryCategoryName != ""){
            categoryFilteredProductsAndGroups = _.filter(categoryFilteredProductsAndGroups, function(item){
                return item.categories[0] == primaryCategoryName;
            });
        }

        if(categoryFilter.secondary){
            let secondaryCategoryName = categoryFilter.secondary;
            categoryFilteredProductsAndGroups = _.filter(categoryFilteredProductsAndGroups, function(item){
                return item.categories[1] == secondaryCategoryName;
            });
        }
    }


    if(generalFilterCriteria || sortCriteria){
        let filterKeys = _.keys(generalFilterCriteria) || [];
        let filterValues = _.values(generalFilterCriteria) || [];

        var filteredProductsAndGroups = categoryFilteredProductsAndGroups;

        for (j = 0; j< filterKeys.length; j++){
            filteredProductsAndGroups = _.filter(filteredProductsAndGroups, function(product){
                if(_.isArray(product[filterKeys[j]])){
                    return _.contains(product[filterKeys[j]], filterValues[j]);
                }
                return product[filterKeys[j]]==filterValues[j];
            });
        }

        var sortedProductsAndGroups = filteredProductsAndGroups;
    
        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, sortCriteria);

        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, "sortPosition");

        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, "sortPosition");

        return Maestro.Client.sortArrayOfProducts(sortedProductsAndGroups, sortCriteria);

    } else {
        // categoryFilteredProductsAndGroups = _.sortBy(categoryFilteredProductsAndGroups, "sortPosition");

        return Maestro.Client.sortArrayOfProducts(categoryFilteredProductsAndGroups);
    }
};

Maestro.Client.getGroups = function(){
    return _.filter(Maestro.Client.getProductsAndGroups(), function(item){return item.thisIsGroup == true;});
};

Maestro.Client.getUngroupedProducts = function(){
    return _.filter(Maestro.Client.getProductsAndGroups(), function(item){return item.thisIsGroup != true;});
};

Maestro.Client.getProductsInGroup = function(groupName, otherFilters = null){
    // console.log(groupName, otherFilters);
    let filters = _.extend({group: groupName}, otherFilters);
    // console.log('filters: ', filters);
    let productsInGroup = Products.find(filters).fetch();

    // productsInGroup = _.sortBy(productsInGroup, "sortPosition");

    return Maestro.Client.sortArrayOfProducts(productsInGroup);
};

Maestro.Client.getProductOrGroup = function(itemId){
    let itemAsProduct = Products.findOne({_id: itemId});
    if (itemAsProduct){
        return itemAsProduct;
    } 

    let itemAsGroup = _.find(Maestro.Client.getGroups(), function(group){return group._id == itemId;});
    if (itemAsGroup){
        return itemAsGroup;
    }

    return null;
};

Maestro.Client.getUncategorizedProducts = function(generalFilterCriteria = {}, sortCriteria){
    let highLevelFilters = {};
    if(!!generalFilterCriteria.status){
        highLevelFilters.status = generalFilterCriteria.status;
    }

    let allProducts = Products.find(highLevelFilters).fetch();

    let categoryFilteredProductsAndGroups = _.filter(allProducts, function(item){
        return item.categories[0] == null;
    });   

    if(generalFilterCriteria || sortCriteria){
        let filterKeys = _.keys(generalFilterCriteria) || [];
        let filterValues = _.values(generalFilterCriteria) || [];

        var filteredProductsAndGroups = categoryFilteredProductsAndGroups;

        for (j = 0; j< filterKeys.length; j++){
            filteredProductsAndGroups = _.filter(filteredProductsAndGroups, function(product){
                if(_.isArray(product[filterKeys[j]])){
                    return _.contains(product[filterKeys[j]], filterValues[j]);
                }
                return product[filterKeys[j]]==filterValues[j];
            });
        }

        var sortedProductsAndGroups = filteredProductsAndGroups;
    
        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, sortCriteria);

        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, "sortPosition");

        // sortedProductsAndGroups = _.sortBy(sortedProductsAndGroups, "sortPosition");

        return Maestro.Client.sortArrayOfProducts(sortedProductsAndGroups, sortCriteria);

    } else {
        // categoryFilteredProductsAndGroups = _.sortBy(categoryFilteredProductsAndGroups, "sortPosition");

        return Maestro.Client.sortArrayOfProducts(categoryFilteredProductsAndGroups);
    }
};

Maestro.Client.getAllCategories = function(){
    return ProductCategories.find({}, {sort: {sortPosition: 1}}).fetch();
};

Maestro.Client.getPrimaryCategories = function(){
    let allProducts = Products.find({status: 'Active'}).fetch();

    var primaryCategorySet = [];
    var primaryCategoryObjSet = [];

    for (prod = 0; prod < allProducts.length; prod ++){
        var ctg = allProducts[prod].categories[0];
        if (ctg){
            if(primaryCategorySet.indexOf(ctg) == -1){
                primaryCategorySet.push(ctg);
            }
        }
    }

    for (cat = 0; cat < primaryCategorySet.length; cat ++){
        primaryCategoryObjSet.push(ProductCategories.findOne({name: primaryCategorySet[cat]}));
    }

    return primaryCategoryObjSet;

};

Maestro.Client.getSecondaryCategories = function(primaryCategory){
    let allProducts = Products.find({status: 'Active'}).fetch();

    let allSecondaryProducts = _.filter(allProducts, function(product){ return product.categories[0] == primaryCategory;});

    var secondaryCategorySet = [];
    var secondaryCategoryObjSet = [];

    for (prod = 0; prod < allSecondaryProducts.length; prod ++){
        var ctg = allSecondaryProducts[prod].categories[1];
        if (ctg){
            if(secondaryCategorySet.indexOf(ctg) == -1){
                secondaryCategorySet.push(ctg);
            }
        }
    }

    for (cat = 0; cat < secondaryCategorySet.length; cat ++){
        secondaryCategoryObjSet.push(ProductCategories.findOne({name: secondaryCategorySet[cat]}));
    }

    return secondaryCategoryObjSet;
};

Maestro.Client.NoProductsExist = function(){
    return !Products.findOne({});
};

Maestro.Client.UpdateProductSort = function(ungroupedProducts, groupedProducts){
    let productSortList = [];

    _.each(ungroupedProducts, function(product, index){
        if(!!Products.findOne({_id: product._id})){
            productSortList.push(product._id);
            // productSortList.push(product.name);
        } else {
            _.each(groupedProducts[product._id], function(subProduct, index){
                productSortList.push(subProduct._id);
                // productSortList.push(subProduct.name);
            });
        }
    });

    // console.log("productSortList: ", productSortList);

    Meteor.call("updateProductSort", productSortList, function(error, result){
        if(error){
            console.log("Error updating sort: ", error);
        } else {
            console.log("Sort updating successful");
        }
    });    
};

Maestro.Client.UpdateCategorySort = function(categoryList){
    let categorySortList = _.pluck(categoryList, "_id");

    // console.log("categorySortList: ", categorySortList);

    Meteor.call("updateCategorySort", categorySortList, function(error, result){
        if(error){
            console.log("Error updating sort: ", error);
        } else {
            console.log("Sort updating successful");
        }
    });    
};


Maestro.Client.ClumpProductsByCategories = function(template){
    let productSortList = [];

    _.each(Maestro.Client.getAllCategories(), function(category){
        _.each(Maestro.Client.getProductsAndGroupsFlattened({}, "", {primary: category.name}), function(product){
            productSortList.push(product._id);
        });
    });

    _.each(Maestro.Client.getUncategorizedProducts({}, ""), function(product){
        productSortList.push(product._id);
    });

    Meteor.call("updateProductSort", productSortList, function(error, result){
        if(error){
            console.log("Error updating sort: ", error);
        } else {
            console.log("Sort updating successful");
        }
    });

    template.arrayOfMovableProducts.set(Maestro.Client.getProductsAndGroups());

    _.each(Maestro.Client.getGroups(), function(group){
        let groupedProducts = template.movableGroupedProducts.get();

        groupedProducts[group._id] = Maestro.Client.getProductsInGroup(group._id);

        template.movableGroupedProducts.set(groupedProducts);
    });

    template.movableCategories.set(Maestro.Client.getAllCategories());    
};