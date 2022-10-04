Maestro.Templates.CreateProduct = "CreateProduct";

Template.CreateProduct.onRendered(function () {
	$('#productType').material_select();
});

Template.CreateProduct.helpers({
    categories: function() {
        return ProductCategories.find({});
    },

    preferredSizes: function() {
        return Maestro.Client.getBusinessProductSizes();
    },

    initCategorySelect: function(){
        $('#productType').material_select();
    }
});

Template.CreateProduct.events({
    'click #save-Product': function (event, target) {
        event.preventDefault();

        var productSizes = [];
        var allSizes = $(".product-size");
        _.each(allSizes, function (sizeItem) {
            var size = $(sizeItem);
            var sizeCode = size.data("sizeCode");
            var sizePrice = Number(size.val());

            if(sizePrice > 0) {
                productSizes.push({
                    code: sizeCode,
                    price: sizePrice
                });
            }

        });

        var productName = target.find("#name").value,
            category = target.find("#productType").value,
            status = "Active",
            sizes = productSizes;

        var businessId = Maestro.Client.businessId();
        var categories = [];
        if(!!category) {
            categories.push(category);
        }

        var productDetails = {
            name: productName,
            categories: categories,
            status: status,
            sizes: sizes,
            businessId: businessId
        };
        console.log("creating product : ", productDetails);
        Meteor.call("createProduct", productDetails, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                Materialize.toast("Added " + productName, 4000);
            }

            var products = (Products.find({})).count();
            console.log(products);

            // if (products<=1){
            //     location.reload();
            // }

            document.getElementById("addNewProductForm").reset();

            $('#activeList').collapsible({
                accordion : true 
            });


            FlowRouter.go(Maestro.route.Products);

            console.log('routed');

            $('.priceUpdate').hide();

            $('.categoryUpdateSelect').material_select('destroy');
            $('.categoryUpdateSelect').parent().find('.caret').remove();

            $('.locationUpdateSelect').material_select('destroy');
            $('.locationUpdateSelect').parent().find('.caret').remove();

            $('.categoryUpdateSelect').material_select();
			$('.locationUpdateSelect').material_select();

        });
    }

});