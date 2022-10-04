Maestro.Templates.AppHeader = "AppHeader";

Template.AppHeader.onRendered(function() {
    dropdownOptions = {
        constrain_width: false,
        belowOrigin: true,
        alignment: 'right'
    };

    if(Maestro.Client.isCordova) {
        $("#location-selection").dropdown(dropdownOptions);
    }
    $("#nav-selection").dropdown(dropdownOptions);
    //$("#action-selection").dropdown(dropdownOptions);

    $("#sidebar-toggle").sideNav({
        closeOnClick: false,
        menuWidth: 300,
        edge: 'left'
    });

    $(".collapsible").each(function (index, element) {
        $(element).collapsible({ accordion: false });
    });
});

Template.AppHeader.helpers({
    noConnection: function(){
        return !Meteor.status();
    },

    selectedMenu: function() {
        return Session.get("selected-menu");
    },

    hiddenClass: function() {
        return Meteor.userId() ? "" : "hide";
    },
    appMenu: function () {
        return Maestro.Client.Menu;
    },


});

Template.AppHeader.events({

    'click .hideMenuBar, click .drag-target': function (event, template) {
        $('#slide-out').sideNav('hide');
    }
});

