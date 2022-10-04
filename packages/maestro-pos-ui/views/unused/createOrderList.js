Maestro.Templates.CreateOrderList = "CreateOrderList";

Template.CreateOrderList.onCreated(function() {
    initializeOrder(this);
});

Template.CreateOrderList.onRendered(function() {
    $("#create-order-tabs").tabs();

    $('#products-list').collapsible();

    $('#begin-checkout').leanModal({
        dismissible: false,
        opacity: .6,
        in_duration: 300,
        out_duration: 100
    });
});

Template.CreateOrderList.helpers(orderHelpers);

Template.CreateOrderList.events(orderEvents);
