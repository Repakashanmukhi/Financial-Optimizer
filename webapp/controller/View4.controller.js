sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/m/MessageBox"
], function (Controller, FlattenedDataset, FeedItem, MessageBox) {
    "use strict";

    return Controller.extend("financialhub.controller.View4", {
        onInit: function () {
            // Attach route matched event to load data when the view is displayed
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("View4").attachMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function () {
            // Load and bind the chart data when the view is matched
            this._loadAndBindChartData();
        },

        _loadAndBindChartData: function () {
            // Get the shared model (component-level JSON model)
            var oSharedModel = this.getOwnerComponent().getModel("sharedModel");
            var aMonthlyData = oSharedModel.getProperty("/monthlyData");

            // Check if monthlyData is defined and not empty
            if (!aMonthlyData || aMonthlyData.length === 0) {
                MessageBox.error("No monthly data available. Please go back and add data.");
                return;
            }

            // Prepare data for the chart
            var aChartData = aMonthlyData.map(function (oData) {
                return {
                    Month: oData.month,
                    PredictedExpenses: oData.totalPredictedExpenses,
                    RemainingSalary: oData.remainingSalary
                };
            });

            // Create or update the JSON model for the chart data
            var oChartModel = this.getView().getModel("chartModel");
            if (!oChartModel) {
                oChartModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oChartModel, "chartModel");
            }
            oChartModel.setData({
                chartData: aChartData
            });

            // Reset and rebind the chart
            this._resetAndBindChart();
        },

        _resetAndBindChart: function () {
            var oView = this.getView();
            var oVizFrame = oView.byId("idVizFrame");

            // Clear existing dataset and feeds
            oVizFrame.destroyDataset();
            oVizFrame.destroyFeeds();

            // Create a new FlattenedDataset for the chart
            var oDataset = new FlattenedDataset({
                dimensions: [{
                    name: "Month",
                    value: "{chartModel>Month}"
                }],
                measures: [
                    {
                        name: "Predicted Expenses",
                        value: "{chartModel>PredictedExpenses}"
                    },
                    {
                        name: "Remaining Salary",
                        value: "{chartModel>RemainingSalary}"
                    }
                ],
                data: {
                    path: "chartModel>/chartData"
                }
            });

            // Set the dataset to the VizFrame
            oVizFrame.setDataset(oDataset);

            // Add feeds to the VizFrame
            oVizFrame.addFeed(new FeedItem({
                uid: "categoryAxis",
                type: "Dimension",
                values: ["Month"]
            }));
            oVizFrame.addFeed(new FeedItem({
                uid: "valueAxis",
                type: "Measure",
                values: ["Predicted Expenses", "Remaining Salary"]
            }));
        },

        onNavBack: function () {
            // Navigate back to the previous view
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("View1");
        }
    });
});