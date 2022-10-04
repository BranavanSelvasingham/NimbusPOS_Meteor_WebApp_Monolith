Maestro.Templates.AccountInfo = "AccountInfo";

var GetMonthName = function(monthNum){
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNum];
};


Template.AccountInfo.onCreated(function(){
	Template.instance().subscribe('invoices', UserSession.get(Maestro.UserSessionConstants.BUSINESS_ID));

    let template = Template.instance();
  
    template.processing = new ReactiveVar( false );
    template.selectedInvoice = new ReactiveVar();
    template.paymentResponse = new ReactiveVar();

    template.stripeCustomer = new ReactiveVar();

    template.checkout = StripeCheckout.configure({
        key: Meteor.settings.public.stripe,
        image: 'https://www.nimbuspos.com/nimbus_logo_blue.png',
        locale: 'auto',
        token( token ) {
            let customer = null;

            let business = Maestro.Business.getBusiness();
            if(!!business.billing){customer = business.billing.stripeCustomerId;}

            let charge  = {
                amount: token.amount || Math.round(template.selectedInvoice.get().paymentDue * 100),
                currency: 'cad',
                source: token.id,
                description: token.description || 'Nimbus POS Invoice for ' + GetMonthName(template.selectedInvoice.get().billingMonth) + ", " + template.selectedInvoice.get().billingYear,
                receipt_email: token.email || Maestro.Business.getBusiness().email,
                customer: customer
            };

            Meteor.call( 'processPayment', charge, template.selectedInvoice.get(), ( error, result ) => {
                if ( error ) {
                    template.processing.set( false );
                    console.log('++error: ', error.reason);
                } else {
                    console.log('++success' );
                    template.paymentResponse.set(result);
                    // console.log(template.paymentResponse.get());
                }
            });
        },
        closed() {
            template.processing.set( false );
            // console.log('++closed');
        }
    });

    template.startCustomer = StripeCheckout.configure({
        key: Meteor.settings.public.stripe,
        image: 'https://www.nimbuspos.com/nimbus_logo_blue.png',
        locale: 'auto',
        panelLabel: 'Automatic Billing',
        token( token ) {
            let business = Maestro.Business.getBusiness();
            let businessId = business._id;
            let customer = {
                metadata : {
                    businessId: business._id,
                    businessName: business.name,
                },
                email: business.email,
                description: business.name,
                source: token.id,
            };

            // console.log("+++customer: ", customer );

            Meteor.call( 'createStripeCustomer', businessId, customer, ( error, result ) => {
                if ( error ) {
                    template.processing.set( false );
                    console.log('++error adding customer: ', error.reason);
                } else {
                    console.log('++success adding customer' );
                    template.paymentResponse.set(result);
                    // console.log(template.paymentResponse.get());
                }
            });
        },
        closed() {
            template.processing.set( false );
            // console.log('++closed');
        }
    });

    template.saveCard = StripeCheckout.configure({
        key: Meteor.settings.public.stripe,
        image: 'https://www.nimbuspos.com/nimbus_logo_blue.png',
        locale: 'auto',
        panelLabel: 'Add Card',
        token( token ) {
            let business = Maestro.Business.getBusiness();
            let stripeCustomerId = business.billing.stripeCustomerId;
            let card = {source: token.id};
            
            Meteor.call( 'createStripeCustomerCard', stripeCustomerId, card, ( error, result ) => {
                if ( error ) {
                    console.log('++error adding card: ', error.reason);
                } else {
                    Materialize.toast('Added Card', 1000);
                    Meteor.call( 'getStripeCustomerInfo', stripeCustomerId, ( error, result ) => {
                        if ( error ) {
                            console.log('++error retreiving customer: ', error.reason);
                        } else {
                            template.stripeCustomer.set(result);
                        }
                    });
                }
            });
        },
        closed() {
            // console.log('++closed');
        }
    });
});

Template.AccountInfo.onRendered(function(){
    let template = Template.instance();

	$('.collapsible').collapsible({
    	accordion : true // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    this.autorun(function(){
        if (template.subscriptionsReady()){
            let business = Businesses.findOne({});

            if(!!business.billing){
                if(!!business.billing.stripeCustomerId){
                    Meteor.call( 'getStripeCustomerInfo', business.billing.stripeCustomerId, ( error, result ) => {
                        if ( error ) {
                            console.log('++error retreiving customer: ', error.reason);
                        } else {
                            template.stripeCustomer.set(result);
                        }
                    });
                }
            }
        }
    });
});

Template.AccountInfo.helpers({
	getBusinessInfo: function(){
		return Businesses.findOne({});
	},

	formatDate: function(dateObj){
		// var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		// return expenseDate.getDate() + " - " + months[expenseDate.getMonth()] + " - " + expenseDate.getFullYear();
		return dateObj.toDateString();
	},

	businessInvoices: function(){
		return Invoices.find({},{sort:{billingYear: 1, billingMonth: 1}});
	},

    thisInvoicePricingBySales: function(pricingPlanType){
        return pricingPlanType == "SALES_BASED_PRICE";
    },

    thisInvoicePricingByLocation: function(pricingPlanType){
        return pricingPlanType == "LOCATION_BASED_PRICE";
    },

    getMonthName: function(monthNum){
       return GetMonthName(monthNum);
    },

    isAmountZero: function(payment){
    	if(payment.toFixed(2) == '0.00'){
    		return true;
    	} else {
    		return false;
    	}
    },

    isInvoicePaid: function(status){
    	if(status == "Paid"){
    		return true;
    	}
    	return false;
    },

    processing: function() {
        return Template.instance().processing.get();
    },

    isAlreadyStripeCustomer: function(billing){
        if(!!billing){
            if(!!billing.stripeCustomerId){
                return true;
            }
        }

        return false;
    },

    getBalanceOwing: function(){
        let allUnpaidInvoices = Invoices.find({status:"Invoiced"},{sort:{billingYear: 1, billingMonth: 1}}).fetch();
        let balanceOwing = _.reduce(allUnpaidInvoices, function(memo, invoice){
            return Math.round(invoice.paymentDue*100)/100 + memo;
        }, 0.00);

        return balanceOwing;
    },

    getStripeCustomerDetails: function(){
        // console.log('stripe customer: ', Template.instance().stripeCustomer.get());
        return Template.instance().stripeCustomer.get();
    },

    cardSource: function(){
        let customer = Template.instance().stripeCustomer.get();
        if(!!customer){
            if(!!customer.default_source){
                return true;
            }
        }
        return false;
    }

});

Template.AccountInfo.events({
    'click .payBalance': function(event, template){
        template.selectedInvoice.set(this);

        template.processing.set( true );

        template.checkout.open({
            name: 'Nimbus POS',
            description: 'Nimbus POS Invoice for ' + GetMonthName(template.selectedInvoice.get().billingMonth) + ", " + template.selectedInvoice.get().billingYear,
            amount: Math.round(template.selectedInvoice.get().paymentDue * 100),
            email: Maestro.Business.getBusiness().email,
            bitcoin: false,
            zipCode: false,
            allowRememberMe: false
        });
    },

    'click .automaticBilling': function(event, template){
        template.processing.set( true );

        template.startCustomer.open({
            name: 'Nimbus POS',
            description: 'Sign up for Automatic Billing',
            email: Maestro.Business.getBusiness().email,
            bitcoin: false,
            zipCode: false,
            allowRememberMe: false
        });
    },

    'click .removeThisCard': function(event, template){
        let card = this;

        Meteor.call( 'removeStripeCustomerCard', card.customer, card.id, ( error, result ) => {
            if ( error ) {
                console.log('++error removing customer card: ', error.reason);
            } else {
                Materialize.toast('Card Removed', 1000);
                Meteor.call( 'getStripeCustomerInfo', card.customer, ( error, result ) => {
                    if ( error ) {
                        console.log('++error retreiving customer: ', error.reason);
                    } else {
                        template.stripeCustomer.set(result);
                    }
                });
            }
        });
    },

    'click .addNewCard': function(event, template){
        template.saveCard.open({
            name: 'Nimbus POS',
            description: 'Add Card for Automatic Billing',
            email: Maestro.Business.getBusiness().email,
            bitcoin: false,
            zipCode: false,
            allowRememberMe: false
        });
    }

    // 'click .selectInvoice': function(event, template){
    //     console.log(this);
    // }

});