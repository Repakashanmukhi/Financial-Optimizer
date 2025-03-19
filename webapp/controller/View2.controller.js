sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("financialhub.controller.View2", {
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel({
                month: "",
                salary: 0,
                groceries: 0,
                hospitality: 0,
                entertainment: 0,
                variableExpenses: 0,
                billPayments: 0,
                totalExpenses: 0,
                remainingSalary: 0,
                financialStatus: "",
                suggestions: "",
                expenseData: [],
                monthlyData: [],
                months: [] 
            });
            this.getOwnerComponent().setModel(oModel, "sharedModel"); 
            this.getView().setModel(oModel);

            var oExpensesModel = new sap.ui.model.json.JSONModel({
                PredictedExpenses: []
            });
            this.getView().setModel(oExpensesModel, "expensesModel");
        },

        onEstimateExpenses: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var oExpensesModel = oView.getModel("expensesModel");
            var month = oView.byId("month").getValue();
            var salary = parseFloat(oModel.getProperty("/salary")) || 0;

            var groceriesRange = { min: 0.18, max: 0.22 };
            var hospitalityRange = { min: 0.07, max: 0.09 };
            var entertainmentRange = { min: 0.08, max: 0.12 };
            var variableExpensesRange = { min: 0.04, max: 0.06 };
            var billPaymentsRange = { min: 0.2, max: 0.3 };

            var predictedGroceries = salary * ((groceriesRange.min + groceriesRange.max) / 2);
            var predictedHospitality = salary * ((hospitalityRange.min + hospitalityRange.max) / 2);
            var predictedEntertainment = salary * ((entertainmentRange.min + entertainmentRange.max) / 2);
            var predictedVariableExpenses = salary * ((variableExpensesRange.min + variableExpensesRange.max) / 2);
            var predictedBillPayments = salary * ((billPaymentsRange.min + billPaymentsRange.max) / 2);

            oModel.setProperty("/groceries", predictedGroceries);
            oModel.setProperty("/hospitality", predictedHospitality);
            oModel.setProperty("/entertainment", predictedEntertainment);
            oModel.setProperty("/variableExpenses", predictedVariableExpenses);
            oModel.setProperty("/billPayments", predictedBillPayments);

            this.calculateTotals();
            this.byId("predictedExpensesPanel").setVisible(true);
            this.byId("chartPanel").setVisible(true);
            this.byId("statusPanel").setVisible(true);
            this.byId("historyPanel").setVisible(true);
            this.updateChartData();
        },

        onExpenseChange: function () {
            this.calculateTotals();
            this.updateChartData();
        },

        calculateTotals: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
            var oExpensesModel = oView.getModel("expensesModel");

            var month = oView.byId("month").getValue();
            var salary = parseFloat(oModel.getProperty("/salary")) || 0;
            var groceries = parseFloat(oModel.getProperty("/groceries")) || 0;
            var hospitality = parseFloat(oModel.getProperty("/hospitality")) || 0;
            var entertainment = parseFloat(oModel.getProperty("/entertainment")) || 0;
            var variableExpenses = parseFloat(oModel.getProperty("/variableExpenses")) || 0;
            var billPayments = parseFloat(oModel.getProperty("/billPayments")) || 0;

            var totalExpenses = groceries + hospitality + entertainment + variableExpenses + billPayments;
            var remainingSalary = salary - totalExpenses;
            var remainingPercentage = (remainingSalary / salary) * 100;

            var financialStatus = "";
            var suggestions = "";
            if (remainingPercentage <= 15) {
                financialStatus = "Loss";
                suggestions = "You are in loss. Consider reducing expenses in:\n" +
                             "1. Entertainment (limit dining out and subscriptions).\n" +
                             "2. Hospitality (reduce unnecessary travel expenses).\n" +
                             "3. Variable Expenses (cut down on impulsive purchases).\n" +
                             "4. Review your grocery and utility bills for savings.";
            } else if (remainingPercentage <= 30) {
                financialStatus = "Break-even";
                suggestions = "You are at break-even. Consider:\n" +
                              "1. Increasing your savings to build a financial cushion.\n" +
                              "2. Reducing discretionary expenses (entertainment, hospitality).\n" +
                              "3. Exploring small investments like recurring deposits (RDs).";
            } else {
                financialStatus = "Profit";
                suggestions = "You are in profit! Consider investing your remaining amount in:\n" +
                               "1. Fixed Deposits (FDs) for safe returns.\n" +
                               "2. Mutual Funds for higher growth potential.\n" +
                               "3. Stock Market (if you have a higher risk appetite).\n" +
                               "4. Emergency Fund to secure your future.";
            }

            var aPredictedExpenses = [
                { "label": "Total Expenses", "value": totalExpenses },
                { "label": "Remaining Amount", "value": remainingSalary }
            ];
        
            oExpensesModel.setProperty("/PredictedExpenses", aPredictedExpenses);

            var aMonthlyData = oModel.getProperty("/monthlyData");
            aMonthlyData.push({
                "month": month,
                "totalPredictedExpenses": totalExpenses,
                "remainingSalary": remainingSalary
            });

            oModel.setProperty("/totalExpenses", totalExpenses);
            oModel.setProperty("/remainingSalary", remainingSalary);
            oModel.setProperty("/financialStatus", financialStatus);
            oModel.setProperty("/suggestions", suggestions);
            oModel.setProperty("/monthlyData", aMonthlyData);
        },

        updateChartData: function () {
            var oModel = this.getView().getModel();
            var expenseData = [
                { category: "Groceries", amount: parseFloat(oModel.getProperty("/groceries")) || 0 },
                { category: "Hospitality", amount: parseFloat(oModel.getProperty("/hospitality")) || 0 },
                { category: "Entertainment", amount: parseFloat(oModel.getProperty("/entertainment")) || 0 },
                { category: "Variable Expenses", amount: parseFloat(oModel.getProperty("/variableExpenses")) || 0 },
                { category: "Bill Payments", amount: parseFloat(oModel.getProperty("/billPayments")) || 0 },
                { category: "Remaining Salary", amount: parseFloat(oModel.getProperty("/remainingSalary")) || 0 }
            ];
            oModel.setProperty("/expenseData", expenseData);
        },

        onSaveMonthlyData: function () {
            var oModel = this.getView().getModel();
            var oData = oModel.getData();

            if (!oData.month || !oData.salary || oData.totalExpenses === undefined) {
                MessageBox.error("Please fill in all required fields.");
                return;
            }

            var isDuplicate = oData.months.some(function (entry) {
                return entry.month === oData.month;
            });

            if (isDuplicate) {
                MessageBox.error("Data for this month already exists.");
                return;
            }

            var newEntry = {
                month: oData.month,
                salary: oData.salary,
                totalExpenses: oData.totalExpenses,
                remainingSalary: oData.remainingSalary,
                financialStatus: oData.financialStatus
            };

            oData.months.push(newEntry);
            oModel.setData(oData);

            MessageBox.success("Monthly data saved successfully!");
        },

        onNavBack: function () {
            var oView = this.getView();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("View1"); 
            this.byId("predictedExpensesPanel").setExpanded(false);
            this.byId("chartPanel").setExpanded(false);
            this.byId("statusPanel").setExpanded(false);
            this.byId("historyPanel").setExpanded(false);
            oView.byId("month").setValue("");
            oView.byId("salary").setValue("");
        }
    });
});