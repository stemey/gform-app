define([
    'dojo/topic',
    'dijit/Menu',
    'dijit/MenuItem',
    'dijit/form/ComboButton',
    './ContainerFactory',
    "dojo/_base/declare"
], function (topic, Menu, MenuItem, ComboButton, ContainerFactory, declare) {


    return declare([ContainerFactory], {
        create: function (ctx, config) {
            var menu = new Menu();//{ style: "display: none;"});
            var menuItem1 = new MenuItem({
                label: "Full size",
                onClick: function(){ topic.publish("/previewer",{width:"100%"});}
            });
            menu.addChild(menuItem1);
            var menuItem1 = new MenuItem({
                label: "Normal size",
                onClick: function(){ topic.publish("/previewer",{width:"60%"});}
            });
            menu.addChild(menuItem1);


            //menu.startup();

            var button = new ComboButton({
                label: "size",
                dropDown: menu
            });
            return button;
        }
    });


});
