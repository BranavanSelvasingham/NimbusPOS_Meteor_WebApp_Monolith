Maestro.Templates.CreateCustomer = "CreateCustomer";

Template.CreateCustomer.onRendered(function () {
    // document.getElementById('customer-name').focus();
});

Template.CreateCustomer.helpers({
    selectText: function(){
        document.getElementById('customer-name').focus();
    }
});

Template.CreateCustomer.events({
    'blur #customer-name': function(event, template) {
        $('#customer-name').removeClass("invalid");

        Meteor.call("customerNameExists", template.find("#customer-name").value, function(error, result) {
            if(!error) {
                console.log(result);
                if (result){
                    $('#error-message-name').text('An identical customer name already exists');
                    $('#customer-name').addClass("invalid");
                } else {
                    $('#error-message-name').text('');
                }
            }
        });
    },
    'blur #email': function(event, template) {
        $('#email').removeClass("invalid");

        Meteor.call("customerEmailExists", template.find("#email").value, function(error, result) {
            if(!error) {
                if(result){
                    $('#error-message-email').text('An identical email already exists');
                    $('#email').addClass("invalid");
                } else {
                    $('#error-message-email').text('');
                }
            }
        });
    },

    'click #cancel-create-customer': function(event, target){
        document.getElementById('create-customer').reset();
    },

    'submit #create-customer': function(event, template) {
        event.preventDefault();

        var customerName = template.find("#customer-name").value,
                email = template.find("#email").value;

        var inputErrors = $('#customer-name').hasClass('invalid') || $('#email').hasClass('invalid') || !customerName;

        if (!inputErrors){
            var doesCustomerNameExist;
            var doesEmailExist;

            //var businessId = Maestro.Business.getBusinessId();

            var customerInfo = {
                name: customerName,
                email: email //,
              //  businessId: businessId
            };
            Meteor.call("createCustomer", customerInfo, function(error, result) {
                if(error) {
                    console.log(error);
                } else {
                    Materialize.toast("Created a customer", 4000);
                }

                document.getElementById('create-customer').reset();

                // document.getElementById('customer-name').focus();

            });
        } else {
            $('#error-message-submit').text('Please review input fields');
        }

    }

});