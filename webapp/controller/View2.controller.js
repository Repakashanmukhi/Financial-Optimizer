sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("financialhub.controller.View2", {
        onInit() {
                // Apply custom CSS classes using addStyleClass
                this.getView().byId("simpleForm").addStyleClass("customFormBackground");
                this.getView().byId("display").addStyleClass("customTableBackground");
        },
        onNavBack: function(){
            this.getOwnerComponent().getRouter().navTo("View1");
        },
        onPredictExpenses: function () {
            var oView = this.getView();
            // Get user inputs
            var fMonth= oView.byId("MonthInput").getValue();
            var fSalary = parseFloat(oView.byId("salaryInput").getValue());
            var fFixedExpenses = parseFloat(oView.byId("fixedExpensesInput").getValue());
            var fVariableExpenses = parseFloat(oView.byId("variableExpensesInput").getValue());
            var fSavingsGoal = parseFloat(oView.byId("savingsGoalInput").getValue());
            // Validate inputs
            if (isNaN(fSalary) || isNaN(fFixedExpenses) || isNaN(fVariableExpenses) || isNaN(fSavingsGoal)) {
                MessageBox.error("Please enter valid numbers for all fields.");
                return;
            }
            // Calculate predicted expenses
            var fSavingsAmount = (fSalary * fSavingsGoal) / 100;
            var fPredictedExpenses = fFixedExpenses + fVariableExpenses + fSavingsAmount;
            // Display the predicted expenses
            oView.byId("predictedExpensesText").setText(fPredictedExpenses.toFixed(2));
            // Calculate profit or loss
            var fDifference = fSalary - fPredictedExpenses;
            var sProfitLossText = "";
            if (fDifference > 0) {
                sProfitLossText = "You are in PROFIT!";
            } else if (fDifference < 0) {
                sProfitLossText = "You are in LOSS!";
            } else {
                sProfitLossText = "You are breaking even.";
            }
            oView.byId("profitLossText").setText(sProfitLossText);
            oView.byId("RemainingAmount").setText(fDifference);
            var oModel = new sap.ui.model.json.JSONModel({
                PredictedExpenses: [
                    { Month: fMonth, Expenses: fPredictedExpenses, RemainingAmount: fDifference }
                ]
            });
            this.getView().setModel(oModel);
            var oTable = this.byId("display");
            oTable.bindItems({
                path: "/PredictedExpenses",
                template: new sap.m.ColumnListItem({
                    cells: [
                        new sap.m.Text({ text: "{Month}" }),
                        new sap.m.Text({ text: "{Expenses}" }),
                        new sap.m.Text({ text: "{RemainingAmount}" })
                    ]
                })
            }); 
        },
    });
}); 


