Maestro.Templates.CreateOrderTiles = "CreateOrderTiles";

Template.CreateOrderTiles.onCreated(function() {
    initializeOrder(this);
});

Template.CreateOrderTiles.onRendered(function() {
    let modalOptions = {
        dismissible: false,
        opacity: .6,
        in_duration: 100,
        out_duration: 100,
        complete: function () {
            $('.lean-overlay').remove();
        }
    };

    $('#begin-checkout').leanModal(modalOptions);

    $('#create-order-tabs').tabs();
    $("#checkout-tabs").tabs();

    $('#expand-customer-select').collapsible();


    $('#product-search-category').material_select();
    this.autorun(function () {
        if(this.selectedProduct && this.selectedProduct.get()) {
            $('#select-product-options').leanModal(modalOptions);
        }
    });
});

Template.CreateOrderTiles.helpers(_.extend(orderHelpers, {
    'candidateOrderItem': function () {
        return Template.instance().candidateOrderItem.get();
    },
    'selectedCandidateSize': function () {
        let candidateOrderItem = Template.instance().candidateOrderItem.get();
        let candidateOrderItemSize = candidateOrderItem.size;
        if(candidateOrderItemSize && candidateOrderItemSize.code) {
            return this.code === candidateOrderItemSize.code;
        }
        return false;
    }
}));

Template.CreateOrderTiles.events(_.extend(orderEvents, {
    'click .decrease-quantity': function (event, template) {
        event.preventDefault();

        let candidateOrderItem = template.candidateOrderItem.get();
        candidateOrderItem.quantity = candidateOrderItem.quantity - 1;

        if(candidateOrderItem.quantity < 0) {
            candidateOrderItem.quantity = 0;
        }

        template.candidateOrderItem.set(candidateOrderItem);
    },
    'click .increase-quantity': function (event, template) {
        event.preventDefault();

        let candidateOrderItem = template.candidateOrderItem.get();
        candidateOrderItem.quantity = candidateOrderItem.quantity + 1;

        template.candidateOrderItem.set(candidateOrderItem);
    },
    'click .product-item-select': function (event, template) {
        event.preventDefault();
        let candidateProduct = this;
        let candidateSize = null;
        let candidateKey = null;
        let existingOrderItem = null;

        if(candidateProduct.sizes.length === 1) {
            candidateSize = candidateProduct.sizes[0];
        }

        let candidateOrderItem = createOrderItem(candidateProduct, candidateSize, null);

        if(candidateSize) {
            candidateKey = candidateSize.code + "-" + candidateProduct._id;
        }

        if(candidateKey) {
            existingOrderItem = template.orderItems.get(candidateKey);
        }

        if(existingOrderItem) {
            candidateOrderItem = existingOrderItem;
        } else {
            let existingItems = [];

            _.each(template.orderItems.all(), function (orderItem, key) {
                if(key.endsWith("-" + candidateProduct._id)) {
                    existingItems.push(orderItem);
                }
            });

            if(existingItems.length === 1) {
                candidateOrderItem = existingItems[0];
            }
        }

        //add order item
        template.candidateOrderItem.set(candidateOrderItem);

        //open modal
        $('#select-product-options').openModal();
    },
    'click .product-size-select': function (event, template) {
        let candidateOrderItem = template.candidateOrderItem.get();
        candidateOrderItem.size = this;

        let key = candidateOrderItem.size.code + "-" + candidateOrderItem.product._id;
        let existingOrderItem = template.orderItems.get(key);

        if(existingOrderItem) {
            candidateOrderItem = existingOrderItem;
        }

        template.candidateOrderItem.set(candidateOrderItem);
    },
    'click #complete-product-selection': function (event, template) {
        let candidateOrderItem = template.candidateOrderItem.get();
        if(candidateOrderItem && candidateOrderItem.size) {
            selectProduct(candidateOrderItem.product, candidateOrderItem.size.code, candidateOrderItem.quantity, template);
        }
    }
}));