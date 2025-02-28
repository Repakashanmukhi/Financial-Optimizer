sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("financialhub.controller.View5", {
        onInit() {
        },
        NavBack: function() {
            this.getOwnerComponent().getRouter().navTo("View1");
        }
    });
});