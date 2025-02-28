sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("financialhub.controller.View4", {
        onInit() {
        },
        NavBack: function() {
            this.getOwnerComponent().getRouter().navTo("View1");
        }
    });
});