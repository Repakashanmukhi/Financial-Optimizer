sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";
    return Controller.extend("financialhub.controller.View1", {
        onInit() {
        },
        onEP: function(){
            this.getOwnerComponent().getRouter().navTo("View2");
        },
        onLoans: function(){
            this.getOwnerComponent().getRouter().navTo("View3");
        },
        onWH: function(){
            this.getOwnerComponent().getRouter().navTo("View4");
        },
        onFed: function(){
            this.getOwnerComponent().getRouter().navTo("View5");
        }
    });
});
