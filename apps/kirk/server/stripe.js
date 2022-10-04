let Stripe = StripeAPI( Meteor.settings.private.stripe );

Meteor.methods({
  processPayment( charge, invoice ) {

    check( charge, {
      amount: Number,
      currency: String,
      source: String,
      description: String,
      receipt_email: String
    });

    let handleCharge = Meteor.wrapAsync( Stripe.charges.create, Stripe.charges ),
        payment      = handleCharge( charge );

    if (!!payment){
        if(payment.paid && payment.status == 'succeeded'){
            console.log('payment received', payment.id);
            Invoices.update({_id: invoice._id}, {$set: {status: 'Paid', paymentReferenceNumber: payment.id}});
        }
    }

    return payment;
  },

  createStripeCustomer( businessId, customer ) {
    // check (customer, {
    //   metadata: Object,
    //   email: String,
    //   description: String,
    //   source: Object
    // });

    let handleCustomer = Meteor.wrapAsync( Stripe.customers.create, Stripe.customers),
      stripeCustomer = handleCustomer (customer);

    if(!!stripeCustomer){
      Businesses.update({_id: businessId}, {$set: {'billing.stripeCustomerId': stripeCustomer.id}});
    }

    return stripeCustomer;

  },

  getStripeCustomerInfo (customerId) {
    let handleCustomerRetreive = Meteor.wrapAsync( Stripe.customers.retrieve, Stripe.customers ),
      stripeCustomer = handleCustomerRetreive (customerId);

    if(!!stripeCustomer){
      return stripeCustomer;
    }

    return null;
  },

  updateStripeCustomerInfo (customerId, updateFields) {
    let handleCustomerUpdate = Meteor.wrapAsync( Stripe.customers.retrieve, Stripe.customers ),
      updateCustomer = handleCustomerUpdate (customerId, updateFields);

    if(!!updateCustomer){
      return updateCustomer;
    }

    return null;

  },

  createStripeCustomerCard (customerId, card ) {
    let handleAdd = Meteor.wrapAsync( Stripe.customers.createSource, Stripe.customers ),
      addCard = handleAdd (customerId, card);

    if(!!addCard){
      return addCard;
    }

    return null;
  },

  removeStripeCustomerCard (customerId, cardId) {
    let handleRemove = Meteor.wrapAsync( Stripe.customers.deleteCard, Stripe.customers ),
      removeCard = handleRemove (customerId, cardId);

    if(!!removeCard){
      return removeCard;
    }

    return null;
  }


});