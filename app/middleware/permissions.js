exports.permissions = {
    "Company" :{
        "Super Admin" :{
            "create_company":true,
            "update_company":true,
            "delete_company":true,
            "view_all_company":true,
            "view_single_company":true
        },
    },
    "Login" : {
        "Super Admin" :{
            "create_user":true,
            "delete_user":true,
            "view_all_user":true,
            "view_user":true,
            "update_user":true,
            "reset_password":true,
            "user_logout":true
        },
        "Admin" : {
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true
        },
        "Account" : {
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true
        },
        "Employee":{
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true
        },
        "Workers":{
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true
        },
        "Other":{
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true
        }
    },
    "Permission" : {
        "Super Admin" :{
            "view_all_permissions":true,
            "update_permissions":true
        },
        "Admin" :{
            "view_all_permissions":true,
            "update_permissions":true
        },
        "Account" :{
            "view_all_permissions":true,
            "update_permissions":true
        },
        "Employee" :{
            "view_all_permissions":true,
            "update_permissions":true
        },
        "Workers" :{
            "view_all_permissions":true,
            "update_permissions":true
        },
        "Other" :{
            "view_all_permissions":true,
            "update_permissions":true
        }
    },
    "ProFormaInvoice" : {
        "Super Admin" :{
            "create_ProFormaInvoice":true,
            "update_ProFormaInvoice":true,
            "delete_ProFormaInvoice":true,
            "view_single_ProFormaInvoice":true,
            "view_all_ProFormaInvoice":true
        },
        "Admin" :{
            "create_ProFormaInvoice":true,
            "update_ProFormaInvoice":true,
            "delete_ProFormaInvoice":true,
            "view_single_ProFormaInvoice":true,
            "view_all_ProFormaInvoice":true
        },
        "Account" :{
            "create_ProFormaInvoice":true,
            "update_ProFormaInvoice":true,
            "delete_ProFormaInvoice":true,
            "view_single_ProFormaInvoice":true,
            "view_all_ProFormaInvoice":true
        },
        "Employee" :{
            "create_ProFormaInvoice":true,
            "update_ProFormaInvoice":true,
            "delete_ProFormaInvoice":true,
            "view_single_ProFormaInvoice":true,
            "view_all_ProFormaInvoice":true
        },
        "Workers" :{
            "create_ProFormaInvoice":true,
            "update_ProFormaInvoice":true,
            "delete_ProFormaInvoice":true,
            "view_single_ProFormaInvoice":true,
            "view_all_ProFormaInvoice":true
        },
        "Other" :{
            "create_ProFormaInvoice":true,
            "update_ProFormaInvoice":true,
            "delete_ProFormaInvoice":true,
            "view_single_ProFormaInvoice":true,
            "view_all_ProFormaInvoice":true
        },
    },
    "Debit Note" : {
        "Super Admin" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true
        },
        "Admin" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true
        },
        "Account" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true
        },
        "Employee" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true
        },
        "Workers" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true
        },
        "Other" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true
        }
    },
    "Credit Note" : {
        "Super Admin" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true
        },
        "Admin" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true
        },
        "Account" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true
        },
        "Employee" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true
        },
        "Workers" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true
        },
        "Other" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true
        }
    },
    "Expense" : {
        "Super Admin" :{
            "create_expense":true,
            "update_expense":true,
            "delete_expense":true,
            "delete_expenseItem":true,
            "view_single_expense":true,
            "view_all_expense":true
        },
        "Admin" :{
            "create_expense":true,
            "update_expense":true,
            "delete_expense":true,
            "delete_expenseItem":true,
            "view_single_expense":true,
            "view_all_expense":true
        },
        "Account" :{
            "create_expense":true,
            "update_expense":true,
            "delete_expense":true,
            "delete_expenseItem":true,
            "view_single_expense":true,
            "view_all_expense":true
        },
        "Employee" :{
            "create_expense":true,
            "update_expense":true,
            "delete_expense":true,
            "delete_expenseItem":true,
            "view_single_expense":true,
            "view_all_expense":true
        },
        "Workers" :{
            "create_expense":true,
            "update_expense":true,
            "delete_expense":true,
            "delete_expenseItem":true,
            "view_single_expense":true,
            "view_all_expense":true
        },
        "Other" :{
            "create_expense":true,
            "update_expense":true,
            "delete_expense":true,
            "delete_expenseItem":true,
            "view_single_expense":true,
            "view_all_expense":true
        }
    },
    "Sales Invoice" : {
        "Super Admin" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        },
        "Admin" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        },
        "Account" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        },
        "Employee" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        },
        "Workers" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        },
        "Other" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        }
    },
    "Delivery Challan" : {
        "Super Admin" :{
            "create_deliverychallan":true,
            "update_deliverychallan":true,
            "delete_deliverychallan":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        },
        "Admin" :{
            "create_deliverychallan":true,
            "update_deliverychallan":true,
            "delete_deliverychallan":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        },
        "Account" :{
            "create_deliverychallan":true,
            "update_deliverychallan":true,
            "delete_deliverychallan":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        },
        "Employee" :{
            "create_deliverychallan":true,
            "update_deliverychallan":true,
            "delete_deliverychallan":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        },
        "Workers" :{
            "create_deliverychallan":true,
            "update_deliverychallan":true,
            "delete_deliverychallan":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        },
        "Other" :{
            "create_deliverychallan":true,
            "update_deliverychallan":true,
            "delete_deliverychallan":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        }
    },
    "Purchase Order" : {
        "Super Admin" :{
            "create_purchase":true,
            "create_purchaseitem":true,
            "update_purchase":true,
            "update_purchaseitem":true,
            "delete_purchase":true,
            "delete_purchaseitem":true,
            "view_single_purchase":true,
            "view_all_purchase":true
        },
        "Admin" :{
            "create_purchase":true,
            "create_purchaseitem":true,
            "update_purchase":true,
            "update_purchaseitem":true,
            "delete_purchase":true,
            "delete_purchaseitem":true,
            "view_single_purchase":true,
            "view_all_purchase":true
        },
        "Account" :{
            "create_purchase":true,
            "create_purchaseitem":true,
            "update_purchase":true,
            "update_purchaseitem":true,
            "delete_purchase":true,
            "delete_purchaseitem":true,
            "view_single_purchase":true,
            "view_all_purchase":true
        },
        "Employee" :{
            "create_purchase":true,
            "create_purchaseitem":true,
            "update_purchase":true,
            "update_purchaseitem":true,
            "delete_purchase":true,
            "delete_purchaseitem":true,
            "view_single_purchase":true,
            "view_all_purchase":true
        },
        "Workers" :{
            "create_purchase":true,
            "create_purchaseitem":true,
            "update_purchase":true,
            "update_purchaseitem":true,
            "delete_purchase":true,
            "delete_purchaseitem":true,
            "view_single_purchase":true,
            "view_all_purchase":true
        },
        "Other" :{
            "create_purchase":true,
            "create_purchaseitem":true,
            "update_purchase":true,
            "update_purchaseitem":true,
            "delete_purchase":true,
            "delete_purchaseitem":true,
            "view_single_purchase":true,
            "view_all_purchase":true
        }
    },
    "Payment" : {
        "Super Admin" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_single_payment":true,
            "view_all_payment":true,
        },
        "Admin" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_single_payment":true,
            "view_all_payment":true,
        },
        "Account" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_single_payment":true,
            "view_all_payment":true,
        },
        "Employee" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_single_payment":true,
            "view_all_payment":true,
        },
        "Workers" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_single_payment":true,
            "view_all_payment":true,
        },
        "Other" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_single_payment":true,
            "view_all_payment":true,
        }
    },
    "Stock" : {
        "Super Admin" :{
            "create_stockitem":true,
            "view_all_stock":true,
        },
        "Admin" :{
            "create_stockitem":true,
            "view_all_stock":true,
        },
        "Account" :{
            "create_stockitem":true,
            "view_all_stock":true,
        },
        "Employee" :{
            "create_stockitem":true,
            "view_all_stock":true,
        },
        "Workers" :{
            "create_stockitem":true,
            "view_all_stock":true,
        },
        "Other" :{
            "create_stockitem":true,
            "view_all_stock":true,
        }
    },
    "Customer" : {
        "Super Admin" :{
            "create_customer":true,
            "update_customer":true,
            "delete_customer":true,
            "view_single_customer":true,
            "view_all_customer":true,
        },
        "Admin" :{
            "create_customer":true,
            "update_customer":true,
            "delete_customer":true,
            "view_single_customer":true,
            "view_all_customer":true,
        },
        "Account" :{
            "create_customer":true,
            "update_customer":true,
            "delete_customer":true,
            "view_single_customer":true,
            "view_all_customer":true,
        },
        "Employee" :{
            "create_customer":true,
            "update_customer":true,
            "delete_customer":true,
            "view_single_customer":true,
            "view_all_customer":true,
        },
        "Workers" :{
            "create_customer":true,
            "update_customer":true,
            "delete_customer":true,
            "view_single_customer":true,
            "view_all_customer":true,
        },
        "Other" :{
            "create_customer":true,
            "update_customer":true,
            "delete_customer":true,
            "view_single_customer":true,
            "view_all_customer":true,
        }
    },
    "Product" : {
        "Super Admin" :{
            "create_product":true,
            "update_product":true,
            "delete_product":true,
            "view_single_product":true,
            "view_all_product":true,
        },
        "Admin" :{
            "create_product":true,
            "update_product":true,
            "delete_product":true,
            "view_single_product":true,
            "view_all_product":true,
        },
        "Account" :{
            "create_product":true,
            "update_product":true,
            "delete_product":true,
            "view_single_product":true,
            "view_all_product":true,
        },
        "Employee" :{
            "create_product":true,
            "update_product":true,
            "delete_product":true,
            "view_single_product":true,
            "view_all_product":true,
        },
        "Workers" :{
            "create_product":true,
            "update_product":true,
            "delete_product":true,
            "view_single_product":true,
            "view_all_product":true,
        },
        "Other" :{
            "create_product":true,
            "update_product":true,
            "delete_product":true,
            "view_single_product":true,
            "view_all_product":true,
        }
    },
    "Item Group" : {
        "Super Admin" :{
            "create_itemgroup":true,
            "update_itemgroup":true,
            "view_single_itemgroup":true,
            "view_all_itemgroup":true,
        },
        "Admin" :{
            "create_itemgroup":true,
            "update_itemgroup":true,
            "view_single_itemgroup":true,
            "view_all_itemgroup":true,
        },
        "Account" :{
            "create_itemgroup":true,
            "update_itemgroup":true,
            "view_single_itemgroup":true,
            "view_all_itemgroup":true,
        },
        "Employee" :{
            "create_itemgroup":true,
            "update_itemgroup":true,
            "view_single_itemgroup":true,
            "view_all_itemgroup":true,
        },
        "Workers" :{
            "create_itemgroup":true,
            "update_itemgroup":true,
            "view_single_itemgroup":true,
            "view_all_itemgroup":true,
        },
        "Other" :{
            "create_itemgroup":true,
            "update_itemgroup":true,
            "view_single_itemgroup":true,
            "view_all_itemgroup":true,
        }
    },
    "Item Category" : {
        "Super Admin" :{
            "create_itemcategory":true,
            "update_itemcategory":true,
            "view_single_itemcategory":true,
            "view_all_itemcategory":true,
        },
        "Admin" :{
            "create_itemcategory":true,
            "update_itemcategory":true,
            "view_single_itemcategory":true,
            "view_all_itemcategory":true,
        },
        "Account" :{
            "create_itemcategory":true,
            "update_itemcategory":true,
            "view_single_itemcategory":true,
            "view_all_itemcategory":true,
        },
        "Employee" :{
            "create_itemcategory":true,
            "update_itemcategory":true,
            "view_single_itemcategory":true,
            "view_all_itemcategory":true,
        },
        "Workers" :{
            "create_itemcategory":true,
            "update_itemcategory":true,
            "view_single_itemcategory":true,
            "view_all_itemcategory":true,
        },
        "Other" :{
            "create_itemcategory":true,
            "update_itemcategory":true,
            "view_single_itemcategory":true,
            "view_all_itemcategory":true,
        }
    },
    "Unit" : {
        "Super Admin" :{
            "create_unit":true,
            "update_unit":true,
            "view_single_unit":true,
            "view_all_unit":true,
        },
        "Admin" :{
            "create_unit":true,
            "update_unit":true,
            "view_single_unit":true,
            "view_all_unit":true,
        },
        "Account" :{
            "create_unit":true,
            "update_unit":true,
            "view_single_unit":true,
            "view_all_unit":true,
        },
        "Employee" :{
            "create_unit":true,
            "update_unit":true,
            "view_single_unit":true,
            "view_all_unit":true,
        },
        "Workers" :{
            "create_unit":true,
            "update_unit":true,
            "view_single_unit":true,
            "view_all_unit":true,
        },
        "Other" :{
            "create_unit":true,
            "update_unit":true,
            "view_single_unit":true,
            "view_all_unit":true,
        }
    },
    "Purchase Bill" : {
        "Super Admin" :{
            "create_purchasebill":true,
            "update_purchasebill":true,
            "delete_purchasebill":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        },
        "Admin" :{
            "create_purchasebill":true,
            "update_purchasebill":true,
            "delete_purchasebill":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        },
        "Account" :{
            "create_purchasebill":true,
            "update_purchasebill":true,
            "delete_purchasebill":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        },
        "Employee" :{
            "create_purchasebill":true,
            "update_purchasebill":true,
            "delete_purchasebill":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        },
        "Workers" :{
            "create_purchasebill":true,
            "update_purchasebill":true,
            "delete_purchasebill":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        },
        "Other" :{
            "create_purchasebill":true,
            "update_purchasebill":true,
            "delete_purchasebill":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        }
    },
    "Purchase Return" : {
        "Super Admin" :{
            "create_purchaseReturn":true,
            "create_purchaseReturn_item":true,
            "update_purchaseReturn":true,
            "update_purchaseReturn_item":true,
            "delete_purchasereturn":true,
            "delete_purchaseReturn_item":true,
            "view_single_purchaseReturn":true,
            "view_all_purchaseReturn":true,
        },
        "Admin" :{
            "create_purchaseReturn":true,
            "create_purchaseReturn_item":true,
            "update_purchaseReturn":true,
            "update_purchaseReturn_item":true,
            "delete_purchasereturn":true,
            "delete_purchaseReturn_item":true,
            "view_single_purchaseReturn":true,
            "view_all_purchaseReturn":true,
        },
        "Account" :{
            "create_purchaseReturn":true,
            "create_purchaseReturn_item":true,
            "update_purchaseReturn":true,
            "update_purchaseReturn_item":true,
            "delete_purchasereturn":true,
            "delete_purchaseReturn_item":true,
            "view_single_purchaseReturn":true,
            "view_all_purchaseReturn":true,
        },
        "Employee" :{
            "create_purchaseReturn":true,
            "create_purchaseReturn_item":true,
            "update_purchaseReturn":true,
            "update_purchaseReturn_item":true,
            "delete_purchasereturn":true,
            "delete_purchaseReturn_item":true,
            "view_single_purchaseReturn":true,
            "view_all_purchaseReturn":true,
        },
        "Workers" :{
            "create_purchaseReturn":true,
            "create_purchaseReturn_item":true,
            "update_purchaseReturn":true,
            "update_purchaseReturn_item":true,
            "delete_purchasereturn":true,
            "delete_purchaseReturn_item":true,
            "view_single_purchaseReturn":true,
            "view_all_purchaseReturn":true,
        },
        "Other" :{
            "create_purchaseReturn":true,
            "create_purchaseReturn_item":true,
            "update_purchaseReturn":true,
            "update_purchaseReturn_item":true,
            "delete_purchasereturn":true,
            "delete_purchaseReturn_item":true,
            "view_single_purchaseReturn":true,
            "view_all_purchaseReturn":true,
        }
    },
    "Receipt" : {
        "Super Admin" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_single_receipt":true,
            "view_all_receipt":true,
        },
        "Admin" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_single_receipt":true,
            "view_all_receipt":true,
        },
        "Account" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_single_receipt":true,
            "view_all_receipt":true,
        },
        "Employee" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_single_receipt":true,
            "view_all_receipt":true,
        },
        "Workers" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_single_receipt":true,
            "view_all_receipt":true,
        },
        "Other" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_single_receipt":true,
            "view_all_receipt":true,
        }
    },
    "Vendor" :{
        "Super Admin" :{
            "create_vendor":true,
            "update_vendor":true,
            "delete_vandor":true,
            "view_vendor":true,
            "get_all_vandor":true,
        },
    },
    "Sales Cash" : {
        "Super Admin" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true
        },
        "Admin" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true
        },
        "Account" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true
        },
        "Employee" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true
        },
        "Workers" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true
        },
        "Other" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true
        },
    },
    "Receive Cash" : {
        "Super Admin" :{
            "create_receive_Cash":true,
            "update_receive_Cash":true,
            "delete_receive_Cash":true,
            "view_receive_Cash":true,
            "view_all_receive_Cash":true
        },
        "Admin" :{
            "create_receive_Cash":true,
            "update_receive_Cash":true,
            "delete_receive_Cash":true,
            "view_receive_Cash":true,
            "view_all_receive_Cash":true
        },
        "Account" :{
            "create_receive_Cash":true,
            "update_receive_Cash":true,
            "delete_receive_Cash":true,
            "view_receive_Cash":true,
            "view_all_receive_Cash":true
        },
        "Employee" :{
            "create_receive_Cash":true,
            "update_receive_Cash":true,
            "delete_receive_Cash":true,
            "view_receive_Cash":true,
            "view_all_receive_Cash":true
        },
        "Workers" :{
            "create_receive_Cash":true,
            "update_receive_Cash":true,
            "delete_receive_Cash":true,
            "view_receive_Cash":true,
            "view_all_receive_Cash":true
        },
        "Other" :{
            "create_receive_Cash":true,
            "update_receive_Cash":true,
            "delete_receive_Cash":true,
            "view_receive_Cash":true,
            "view_all_receive_Cash":true
        },
    },
    "Payment Cash" : {
        "Super Admin" :{
            "create_payment_Cash":true,
            "update_payment_Cash":true,
            "delete_payment_Cash":true,
            "view_payment_Cash":true,
            "view_all_payment_Cash":true
        },
        "Admin" :{
            "create_payment_Cash":true,
            "update_payment_Cash":true,
            "delete_payment_Cash":true,
            "view_payment_Cash":true,
            "view_all_payment_Cash":true
        },
        "Account" :{
            "create_payment_Cash":true,
            "update_payment_Cash":true,
            "delete_payment_Cash":true,
            "view_payment_Cash":true,
            "view_all_payment_Cash":true
        },
        "Employee" :{
            "create_payment_Cash":true,
            "update_payment_Cash":true,
            "delete_payment_Cash":true,
            "view_payment_Cash":true,
            "view_all_payment_Cash":true
        },
        "Workers" :{
            "create_payment_Cash":true,
            "update_payment_Cash":true,
            "delete_payment_Cash":true,
            "view_payment_Cash":true,
            "view_all_payment_Cash":true
        },
        "Other" :{
            "create_payment_Cash":true,
            "update_payment_Cash":true,
            "delete_payment_Cash":true,
            "view_payment_Cash":true,
            "view_all_payment_Cash":true
        },
    },
    "Purchase Cash" : {
        "Super Admin" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true
        },
        "Admin" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true
        },
        "Account" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true
        },
        "Employee" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true
        },
        "Workers" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true
        },
        "Other" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true
        },
    },
    "Customer Cash" : {
        "Super Admin" :{
            "get_all_customer_cash":true,
        },
        "Admin" :{
            "get_all_customer_cash":true,
        },
        "Account" :{
            "get_all_customer_cash":true,
        },
        "Employee" :{
            "get_all_customer_cash":true,
        },
        "Workers" :{
            "get_all_customer_cash":true,
        },
        "Other" :{
            "get_all_customer_cash":true,
        },
    },
    "Vendor Cash" : {
        "Super Admin" :{
            "get_all_vandor_cash":true,
        },
        "Admin" :{
            "get_all_vandor_cash":true,
        },
        "Account" :{
            "get_all_vandor_cash":true,
        },
        "Employee" :{
            "get_all_vandor_cash":true,
        },
        "Workers" :{
            "get_all_vandor_cash":true,
        },
        "Other" :{
            "get_all_vandor_cash":true,
        },
    },
    "Product Cash" : {
        "Super Admin" :{
            "get_all_product_cash":true,
        },
        "Admin" :{
            "get_all_product_cash":true,
        },
        "Account" :{
            "get_all_product_cash":true,
        },
        "Employee" :{
            "get_all_product_cash":true,
        },
        "Workers" :{
            "get_all_product_cash":true,
        },
        "Other" :{
            "get_all_product_cash":true,
        },
    },
}