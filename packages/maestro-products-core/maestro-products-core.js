//apply default product sizes to businesses when they are created
Maestro.Business.onCreateBusiness(function(businessId, userId) {
    let businessConfiguration = Businesses.findOne({_id: businessId}).configuration;

    console.log("Products business configuration update!!");
    businessConfiguration["sizes"] = Maestro.Products.Sizes; //todo rename sizs to product-sizes
    Businesses.update({_id: businessId}, { $set: {configuration: businessConfiguration}}, {extendAutoValueContext: {userId: userId}});
});
