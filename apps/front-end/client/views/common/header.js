Maestro.Templates.AppHeader = "AppHeader";

Template.AppHeader.onCreated(function(){

    
});

Template.AppHeader.onRendered(function() {

    let dropdownOptions = {
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
   
});

Template.AppHeader.events({
   
});

