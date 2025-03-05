// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/ui/model/Filter",
//     "sap/ui/model/FilterOperator",
//     "sap/ui/model/Sorter",
//     "sap/m/Dialog",
//     "sap/m/Input",
//     "sap/m/Button",
//     "sap/m/MessageBox"
// ], (Controller, Filter, FilterOperator, Sorter, Dialog, Input, Button, MessageBox) => {
//     "use strict";
//     var that;
//     return Controller.extend("financialhub.controller.View3", {
//         onInit() {
//             that=this;
//             var oModel = this.getOwnerComponent().getModel();
//             oModel.read("/bankmaster",{
//                 success: function(bankType){
//                     var uniqueBank = [];
//                     bankType.results.forEach(function(bank){
//                         var obank = bank.BankType;
//                         if (uniqueBank.indexOf(obank) === -1) {
//                             uniqueBank.push(obank);
//                         }
//                     })
//                     var uniqueType= new sap.ui.model.json.JSONModel({
//                         aBank: uniqueBank,
//                     });
//                     that.getView().setModel(uniqueType, "unique");
//                 }
//             })
//             this._fetchCIBILScore();
//         },

//         _fetchCIBILScore: function () {
//             var oModel = this.getOwnerComponent().getModel();
//             var sEmployeeId = "FIN1"; // Replace with the actual employee ID or dynamic value

//             oModel.read("/employeemaster", {
//                 filters: [new Filter("EmpID", FilterOperator.EQ, sEmployeeId)],
//                 success: function (oData) {
//                     if (oData.results.length > 0) {
//                         var cibilScore = oData.results[0].EmpCibil; // Assuming CIBILScore is the field name
//                         var oCibilModel = new sap.ui.model.json.JSONModel({
//                             cibilScore: cibilScore
//                         });
//                         that.getView().setModel(oCibilModel, "cibilModel");
//                     } else {
//                         MessageBox.error("No CIBIL score found for the employee.");
//                     }
//                 },
//                 error: function (oError) {
//                     MessageBox.error("Failed to fetch CIBIL score.");
//                 }
//             });
//         },

//         NavBack: function () {
//             var oRouter = this.getOwnerComponent().getRouter();
//             oRouter.navTo("View1"); 
//         },

//         onSearch: function (oEvent) {
//             var sQuery = oEvent.getParameter("query");
//             var oTable = this.byId("employeeTable");
//             var oBinding = oTable.getBinding("items");

//             if (sQuery) {
//                 var oFilter = new Filter({
//                     path: "BankName",
//                     operator: FilterOperator.Contains,
//                     value1: sQuery,
//                     caseSensitive : false
//                 });
//                 oBinding.filter([oFilter]);
//             } else {
//                 oBinding.filter([]);
//             }
//         },

//         onBankType: function(){
//             var oFilter = [];
//             var oselectedBank = that.byId("bankType").getSelectedKey();
//             if(oselectedBank){
//                 oFilter.push(new Filter("BankType", FilterOperator.EQ, oselectedBank));
//             }
//             var oTable = that.byId("employeeTable");
//             var oBinding = oTable.getBinding("items");
//             oBinding.filter(oFilter);
//         },

//         onRowPress: function () {
//             var oTable = that.getView().byId("employeeTable");
//             var oSelectedRow = oTable.getSelectedItem().getBindingContext().getObject();
//             if(!that.bankQuote){
//                 that.bankQuote = sap.ui.xmlfragment("financialhub.fragments.Bank",that);
//             }
//             sap.ui.getCore().byId("bankId").setText(oSelectedRow.BID);
//             sap.ui.getCore().byId("bankInterest").setText(oSelectedRow.BANK_ROI);
//             sap.ui.getCore().byId("process").setText(oSelectedRow.BANK_PROCESSTYM);

//             that.bankQuote.open();
//         },
//         onSubmit: function(){
//             var oView = this.getView();
//             var oModel = oView.getModel();
//             var fLoanAmount = parseFloat(sap.ui.getCore().byId("loanAmount").getValue());
//             var fTenure = parseFloat(sap.ui.getCore().byId("tenure").getValue());
//             var fInterestRate = parseFloat(sap.ui.getCore().byId("bankInterest").getText());
 
//            var repay = fLoanAmount * (fTenure) * (fInterestRate/12);
//            var emi = repay/(fTenure*12);
//            that.bankQuote.close() ;
//            that.byId("sendQuotation").open();
//            oView.byId("amount").setText(fLoanAmount);
//             oView.byId("duration").setText(fTenure);
//             oView.byId("int").setText(fInterestRate);
//             oView.byId("emi").setText(emi);
//             oView.byId("repay").setText(repay);
//         },
//         closeDialog: function(){
//             that.byId("sendQuotation").close();
//         },
//         sendDialog: function(){
            
//         }
//     });
// });


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
            that = this;
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/bankmaster", {
                success: function(bankType) {
                    var uniqueBank = [];
                    bankType.results.forEach(function(bank) {
                        var obank = bank.BankType;
                        if (uniqueBank.indexOf(obank) === -1) {
                            uniqueBank.push(obank);
                        }
                    });
                    var uniqueType = new sap.ui.model.json.JSONModel({
                        aBank: uniqueBank,
                    });
                    that.getView().setModel(uniqueType, "unique");
                }
            });
            this._fetchCIBILScore();
        },

        _fetchCIBILScore: function() {
            var oModel = this.getOwnerComponent().getModel();
            var sEmployeeId = "FIN1"; // Replace with the actual employee ID or dynamic value

            oModel.read("/employeemaster", {
                filters: [new Filter("EmpID", FilterOperator.EQ, sEmployeeId)],
                success: function(oData) {
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
                error: function(oError) {
                    MessageBox.error("Failed to fetch CIBIL score.");
                }
            });
        },

        NavBack: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("View1");
        },

        onSearch: function(oEvent) {
            var sQuery = oEvent.getParameter("query");
            var oTable = this.byId("employeeTable");
            var oBinding = oTable.getBinding("items");

            if (sQuery) {
                var oFilter = new Filter({
                    path: "BankName",
                    operator: FilterOperator.Contains,
                    value1: sQuery,
                    caseSensitive: false
                });
                oBinding.filter([oFilter]);
            } else {
                oBinding.filter([]);
            }
        },

        onBankType: function() {
            var oFilter = [];
            var oselectedBank = that.byId("bankType").getSelectedKey();
            if (oselectedBank) {
                oFilter.push(new Filter("BankType", FilterOperator.EQ, oselectedBank));
            }
            var oTable = that.byId("employeeTable");
            var oBinding = oTable.getBinding("items");
            oBinding.filter(oFilter);
        },

        onRowPress: function() {
            var oTable = that.getView().byId("employeeTable");
            var oSelectedRow = oTable.getSelectedItem().getBindingContext().getObject();
            if (!that.bankQuote) {
                that.bankQuote = sap.ui.xmlfragment("financialhub.fragments.Bank", that);
            }
            sap.ui.getCore().byId("bankId").setText(oSelectedRow.BID);
            sap.ui.getCore().byId("bankInterest").setText(oSelectedRow.BANK_ROI);
            sap.ui.getCore().byId("process").setText(oSelectedRow.BANK_PROCESSTYM);

            that.bankQuote.open();
        },
        onSubmit: function() {
            var oView = this.getView();
            var oModel = oView.getModel();
            var fLoanAmount = parseFloat(sap.ui.getCore().byId("loanAmount").getValue());
            var fTenure = parseFloat(sap.ui.getCore().byId("tenure").getValue());
            var fInterestRate = parseFloat(sap.ui.getCore().byId("bankInterest").getText());

            var repay = fLoanAmount * (fTenure) * (fInterestRate / 12);
            var emi = repay / (fTenure * 12);
            that.bankQuote.close();
            that.byId("sendQuotation").open();
            oView.byId("amount").setText(fLoanAmount);
            oView.byId("duration").setText(fTenure);
            oView.byId("int").setText(fInterestRate);
            oView.byId("emi").setText(emi);
            oView.byId("repay").setText(repay);
        },
        closeDialog: function() {
            that.byId("sendQuotation").close();
        },
        sendDialog: function() {
            var oView = this.getView();
            var oModel = oView.getModel();

            // Retrieve the necessary data from the view
            var fLoanAmount = parseFloat(oView.byId("amount").getText());
            var fTenure = parseFloat(oView.byId("duration").getText());
            var fInterestRate = parseFloat(oView.byId("int").getText());
            var fEMI = parseFloat(oView.byId("emi").getText());
            var fRepay = parseFloat(oView.byId("repay").getText());

            // Create the object to be sent
            var obj = {
                LoanAmount: fLoanAmount,
                Tenure: fTenure,
                InterestRate: fInterestRate,
                EMI: fEMI,
                TotalRepayableAmount: fRepay
            };

            // Call the function to send the quotation
            oModel.callFunction('/SendQuotation', {
                method: 'GET',
                urlParameters: {
                    DATA: JSON.stringify([obj])
                },
                success: function(res) {
                    sap.m.MessageBox.success("Quotation sent successfully!");
                    that.byId("sendQuotation").close(); // Close the dialog on success
                },
                error: function(err) {
                    sap.m.MessageBox.error("Failed to send quotation. Please try again.");
                }
            });
        }
    });
});