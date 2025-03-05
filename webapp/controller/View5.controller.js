
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/m/MessageBox"
], function (Controller, FlattenedDataset, FeedItem, MessageBox) {
    "use strict";

    return Controller.extend("financialhub.controller.View5", {
        onInit: function () {
          
        },
        onSubmit: function(){
            this.getOwnerComponent().getRouter().navTo("View1");
        }


    });
});