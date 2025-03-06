sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/Dialog",
    "sap/m/Input",
    "sap/m/Button",
    "sap/m/MessageBox"
], (Controller, Filter, FilterOperator, Sorter, Dialog, Input, Button, MessageBox) => {
    "use strict";
    var that;
    return Controller.extend("financialhub.controller.View3", {
        onInit() {
            that=this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/bankmaster", {
                success: function(bankType) {
                    var uniqueBank = [];
                    var uniqueLoan = [];
                    bankType.results.forEach(function(bank) {
                        var obank = bank.BankType;
                        var oloan = bank.BANK_LOANTYPE;
                        if (uniqueBank.indexOf(obank) === -1) {
                            uniqueBank.push(obank);
                        }
                        if (uniqueLoan.indexOf(oloan) === -1) {
                            uniqueLoan.push(oloan);
                        }
                    });
                    var uniqueType = new sap.ui.model.json.JSONModel({
                        aBank: uniqueBank,
                        aLoan : uniqueLoan
                    });
                    that.getView().setModel(uniqueType, "unique");
                    that.getView().setModel(uniqueType, "unique");
                }
            });
            
            this._fetchCIBILScore();
        },
        _fetchCIBILScore: function () {
            var oModel = this.getOwnerComponent().getModel();
            var sEmployeeId = "FIN1"; // Replace with the actual employee ID or dynamic value

            oModel.read("/employeemaster", {
                filters: [new Filter("EmpID", FilterOperator.EQ, sEmployeeId)],
                success: function (oData) {
                    if (oData.results.length > 0) {
                        var cibilScore = oData.results[0].EmpCibil; // Assuming CIBILScore is the field name
                        var oCibilModel = new sap.ui.model.json.JSONModel({
                            cibilScore: cibilScore
                        });
                        that.getView().setModel(oCibilModel, "cibilModel");
                    } else {
                        MessageBox.error("No CIBIL score found for the employee.");
                    }
                },
                error: function (oError) {
                    MessageBox.error("Failed to fetch CIBIL score.");
                }
            });
        },

        NavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("View1"); 
        },

        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("employeeTable");
            var oBinding = oTable.getBinding("items");

            if (sQuery) {
                var oFilter = new Filter({
                    path: "BankName",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive : false
                });
                oBinding.filter([oFilter]);
            } else {
                oBinding.filter([]);
            }
        },

        onBankType: function(){
            var oFilter = [];
            var oselectedBank = that.byId("bankType").getSelectedKey();
            if(oselectedBank){
                oFilter.push(new Filter("BankType", FilterOperator.EQ, oselectedBank));
            }
            var oTable = that.byId("employeeTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oFilter);
        },

        onLoanType: function(){
            var oFilter = [];
            var oSelectedLoan = that.byId("loanType").getSelectedKey();
            if(oSelectedLoan){
                oFilter.push(new Filter("BANK_LOANTYPE",FilterOperator.EQ, oSelectedLoan));
            }
            var oTable = that.byId("employeeTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oFilter);
        },
        
        onRowPress: function () {
            var oTable = that.getView().byId("employeeTable");
            var oSelectedRow = oTable.getSelectedItem().getBindingContext().getObject();
            if(!that.bankQuote){
                that.bankQuote = sap.ui.xmlfragment("financialhub.fragments.Bank",that);
            }
            sap.ui.getCore().byId("bankId").setText(oSelectedRow.BID);
            sap.ui.getCore().byId("bankInterest").setText(oSelectedRow.BANK_ROI);
            sap.ui.getCore().byId("process").setText(oSelectedRow.BANK_PROCESSTYM);

            that.bankQuote.open();
        },
        onSubmit: function(){
            var oView = this.getView();
            var oModel = oView.getModel();
            var fLoanAmount = parseFloat(sap.ui.getCore().byId("loanAmount").getValue());
            var fTenure = parseFloat(sap.ui.getCore().byId("tenure").getValue());
            var fInterestRate = parseFloat(sap.ui.getCore().byId("bankInterest").getText());
 
           var repay = fLoanAmount * (fTenure) * (fInterestRate/12);
           var emi = repay/(fTenure*12);
           that.bankQuote.close() ;
           that.byId("sendQuotation").open();
           oView.byId("amount").setText(fLoanAmount);
            oView.byId("duration").setText(fTenure);
            oView.byId("int").setText(fInterestRate);
            oView.byId("emi").setText(emi);
            oView.byId("repay").setText(repay);
        },
        closeDialog: function(){
            that.byId("sendQuotation").close();
        },
        send: function () {
            var oView = this.getView();
            var oModel = oView.getModel();
        
            // Gather data from the dialog
            var fLoanAmount = parseFloat(oView.byId("amount").getText());
            var fTenure = parseFloat(oView.byId("duration").getText());
            var fInterestRate = parseFloat(oView.byId("int").getText());
            var fEMI = parseFloat(oView.byId("emi").getText());
            var fRepayableAmount = parseFloat(oView.byId("repay").getText());
        
            // Prepare the payload
            var oPayload = {
                loanAmount: fLoanAmount,
                tenure: fTenure,
                interestRate: fInterestRate,
                emi: fEMI,
                totalRepayableAmount: fRepayableAmount
            };
        
            // Call the backend service to send the email
            oModel.callFunction('/SendQuotation', {
                method: 'GET',
                urlParameters: {
                    DATA: JSON.stringify(oPayload)
                },
                success: function (oData) {
                    MessageBox.success("Quotation sent successfully!");
                    that.byId("sendQuotation").close();
                },
                error: function (oError) {
                    MessageBox.error("Failed to send quotation. Please try again.");
                }
            });
        }
    });
});