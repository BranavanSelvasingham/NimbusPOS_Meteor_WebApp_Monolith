Maestro.Templates.ManageSize = "ManageSize";

var intializeBusinessSizes = function (template) {
    var businessSizes = Maestro.Client.getAllBusinessProductSizes();

    template.sizes = new ReactiveDict();
    _.each(businessSizes, function (productSize) {
        template.sizes.set(productSize.code, productSize);
    });
};

Template.ManageSize.onCreated(function () {
    var template = this;
    intializeBusinessSizes(template);
});

Template.ManageSize.helpers({
    business: function(){
        var businessSizesObj;// = Businesses.find({}, {fields: {"sizes":1}}).fetch();
        return businessSizesObj;
    },
    productSizes: function () {
        return _.values(Template.instance().sizes.all());
    },
    isSizeAvailable: function (sizeCode) {
        return Template.instance().sizes.get(sizeCode)["available"];
    },
    isSizePreferred: function (sizeCode) {
        return Template.instance().sizes.get(sizeCode)["preferred"];
    }
});

Template.ManageSize.events({
    'change .size-preferred': function (event, template) {
        var currentTarget = $(event.currentTarget);
        var sizeCode = currentTarget.data("sizeCode");
        var preferred = currentTarget.prop("checked");

        var size = template.sizes.get(sizeCode);
        size.preferred = preferred;
        template.sizes.set(sizeCode, size);
    },
    'change .size-available': function (event, template) {
        var currentTarget = $(event.currentTarget);
        var sizeCode = currentTarget.data("sizeCode");
        var available = currentTarget.prop("checked");

        var size = template.sizes.get(sizeCode);
        size.available = available;
        template.sizes.set(sizeCode, size);
    },
    'change .size-label': function (event, template) {
        var currentTarget = $(event.currentTarget);
        var sizeCode = currentTarget.data("sizeCode");
        var label = currentTarget.val();

        var size = template.sizes.get(sizeCode);
        size.label = label;
        template.sizes.set(sizeCode, size);
    },
	'click #complete-size-update': function (event, template) {
        Meteor.call("updateBusinessProductSizes", Maestro.Client.businessId(), _.values(template.sizes.all()), function (error, result) {
            if(!error) {
                Materialize.toast("Size labels updated", 2000);
            }
        });
    },
    'click #cancel-size-update': function (event, template) {
        template.sizes.clear();
        intializeBusinessSizes(template);
    }
});