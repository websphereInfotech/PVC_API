exports.permissions = {
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
        "Financial" : {
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
        }
    },
    "Quotation" : {
        "Super Admin" :{
            "create_quotation":true,
            "update_quotation":true,
            "delete_quotation":true,
            "delete_quotationitem":true,
            "view_single_quotation":true,
            "view_all_quotation":true
        },
        "Admin" :{
            "create_quotation":true,
            "update_quotation":true,
            "delete_quotation":true,
            "delete_quotationitem":true,
            "view_single_quotation":true,
            "view_all_quotation":true
        },
        "Financial" :{
            "create_quotation":true,
            "update_quotation":true,
            "delete_quotation":true,
            "delete_quotationitem":true,
            "view_single_quotation":true,
            "view_all_quotation":true
        },
        "Employee" :{
            "create_quotation":true,
            "update_quotation":true,
            "delete_quotation":true,
            "delete_quotationitem":true,
            "view_single_quotation":true,
            "view_all_quotation":true
        },
        "Workers" :{
            "create_quotation":true,
            "update_quotation":true,
            "delete_quotation":true,
            "delete_quotationitem":true,
            "view_single_quotation":true,
            "view_all_quotation":true
        },
        "Other" :{
            "create_quotation":true,
            "update_quotation":true,
            "delete_quotation":true,
            "delete_quotationitem":true,
            "view_single_quotation":true,
            "view_all_quotation":true
        },
    },
    "Sales Return" : {
        "Super Admin" :{
            "create_salesReturn":true,
            "view_all_salesReturn":true,
        },
        "Admin" :{
            "create_salesReturn":true,
            "view_all_salesReturn":true,
        },
        "Financial" :{
            "create_salesReturn":true,
            "view_all_salesReturn":true,
        },
        "Employee" :{
            "create_salesReturn":true,
            "view_all_salesReturn":true,
        },
        "Workers" :{
            "create_salesReturn":true,
            "view_all_salesReturn":true,
        },
        "Other" :{
            "create_salesReturn":true,
            "view_all_salesReturn":true,
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
        "Financial" :{
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
            "delete_salesInvoiceItem":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        },
        "Admin" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "delete_salesInvoiceItem":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        },
        "Financial" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "delete_salesInvoiceItem":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        },
        "Employee" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "delete_salesInvoiceItem":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        },
        "Workers" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "delete_salesInvoiceItem":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        },
        "Other" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "delete_salesInvoiceItem":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true
        }
    },
    "Delivery Challan" : {
        "Super Admin" :{
            "create_deliverychallan":true,
            "create_deliverychallanitem":true,
            "update_deliverychallan":true,
            "update_deliverychallanitem":true,
            "delete_deliverychallan":true,
            "delete_deliverychallanitem":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        },
        "Admin" :{
            "create_deliverychallan":true,
            "create_deliverychallanitem":true,
            "update_deliverychallan":true,
            "update_deliverychallanitem":true,
            "delete_deliverychallan":true,
            "delete_deliverychallanitem":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        },
        "Financial" :{
            "create_deliverychallan":true,
            "create_deliverychallanitem":true,
            "update_deliverychallan":true,
            "update_deliverychallanitem":true,
            "delete_deliverychallan":true,
            "delete_deliverychallanitem":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        },
        "Employee" :{
            "create_deliverychallan":true,
            "create_deliverychallanitem":true,
            "update_deliverychallan":true,
            "update_deliverychallanitem":true,
            "delete_deliverychallan":true,
            "delete_deliverychallanitem":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        },
        "Workers" :{
            "create_deliverychallan":true,
            "create_deliverychallanitem":true,
            "update_deliverychallan":true,
            "update_deliverychallanitem":true,
            "delete_deliverychallan":true,
            "delete_deliverychallanitem":true,
            "view_single_deliverychallan":true,
            "view_all_deliverychallan":true
        },
        "Other" :{
            "create_deliverychallan":true,
            "create_deliverychallanitem":true,
            "update_deliverychallan":true,
            "update_deliverychallanitem":true,
            "delete_deliverychallan":true,
            "delete_deliverychallanitem":true,
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
        "Financial" :{
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
        "Financial" :{
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
        "Financial" :{
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
            "create_customfeild":true,
            "update_customer":true,
            "update_customfeild":true,
            "delete_customer":true,
            "delete_customfeild":true,
            "view_single_customer":true,
            "view_all_customer":true,
        },
        "Admin" :{
            "create_customer":true,
            "create_customfeild":true,
            "update_customer":true,
            "update_customfeild":true,
            "delete_customer":true,
            "delete_customfeild":true,
            "view_single_customer":true,
            "view_all_customer":true,
        },
        "Financial" :{
            "create_customer":true,
            "create_customfeild":true,
            "update_customer":true,
            "update_customfeild":true,
            "delete_customer":true,
            "delete_customfeild":true,
            "view_single_customer":true,
            "view_all_customer":true,
        },
        "Employee" :{
            "create_customer":true,
            "create_customfeild":true,
            "update_customer":true,
            "update_customfeild":true,
            "delete_customer":true,
            "delete_customfeild":true,
            "view_single_customer":true,
            "view_all_customer":true,
        },
        "Workers" :{
            "create_customer":true,
            "create_customfeild":true,
            "update_customer":true,
            "update_customfeild":true,
            "delete_customer":true,
            "delete_customfeild":true,
            "view_single_customer":true,
            "view_all_customer":true,
        },
        "Other" :{
            "create_customer":true,
            "create_customfeild":true,
            "update_customer":true,
            "update_customfeild":true,
            "delete_customer":true,
            "delete_customfeild":true,
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
        "Financial" :{
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
        "Financial" :{
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
        "Financial" :{
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
        "Financial" :{
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
            "create_purchasebill_item":true,
            "update_purchasebill":true,
            "update_purchasebill_item":true,
            "delete_purchasebill":true,
            "delete_purchasebill_item":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        },
        "Admin" :{
            "create_purchasebill":true,
            "create_purchasebill_item":true,
            "update_purchasebill":true,
            "update_purchasebill_item":true,
            "delete_purchasebill":true,
            "delete_purchasebill_item":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        },
        "Financial" :{
            "create_purchasebill":true,
            "create_purchasebill_item":true,
            "update_purchasebill":true,
            "update_purchasebill_item":true,
            "delete_purchasebill":true,
            "delete_purchasebill_item":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        },
        "Employee" :{
            "create_purchasebill":true,
            "create_purchasebill_item":true,
            "update_purchasebill":true,
            "update_purchasebill_item":true,
            "delete_purchasebill":true,
            "delete_purchasebill_item":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        },
        "Workers" :{
            "create_purchasebill":true,
            "create_purchasebill_item":true,
            "update_purchasebill":true,
            "update_purchasebill_item":true,
            "delete_purchasebill":true,
            "delete_purchasebill_item":true,
            "view_single_purchasebill":true,
            "view_all_purchasebill":true,
        },
        "Other" :{
            "create_purchasebill":true,
            "create_purchasebill_item":true,
            "update_purchasebill":true,
            "update_purchasebill_item":true,
            "delete_purchasebill":true,
            "delete_purchasebill_item":true,
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
        "Financial" :{
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
        "Financial" :{
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
    "Bank Account" : {
        "Super Admin" :{
            "create_bankaccount":true,
            "update_bankaccount":true,
            "delete_bankaccount":true,
            "view_single_bankaccount":true,
            "view_all_bankaccount":true,
        },
        "Admin" :{
            "create_bankaccount":true,
            "update_bankaccount":true,
            "delete_bankaccount":true,
            "view_single_bankaccount":true,
            "view_all_bankaccount":true,
        },
        "Financial" :{
            "create_bankaccount":true,
            "update_bankaccount":true,
            "delete_bankaccount":true,
            "view_single_bankaccount":true,
            "view_all_bankaccount":true,
        },
        "Employee" :{
            "create_bankaccount":true,
            "update_bankaccount":true,
            "delete_bankaccount":true,
            "view_single_bankaccount":true,
            "view_all_bankaccount":true,
        },
        "Workers" :{
            "create_bankaccount":true,
            "update_bankaccount":true,
            "delete_bankaccount":true,
            "view_single_bankaccount":true,
            "view_all_bankaccount":true,
        },
        "Other" :{
            "create_bankaccount":true,
            "update_bankaccount":true,
            "delete_bankaccount":true,
            "view_single_bankaccount":true,
            "view_all_bankaccount":true,
        }
    },
}