exports.permissions = {
    "Login" : {
        "Super Admin" :{
            "create_user":true,
        }
    },
    "Quotation" : {
        "Super Admin" :{
            "create_quotation":true,
            "create_quatationItem":true,
            "update_quotation":true,
            "update_quotationItem":true,
            "delete_quotation":true,
            "delete_quotationitem":true,
            "view_single_quotation":true,
            "view_all_quotation":true
        },
        "Admin" :{
            "create_quotation":true,
            "create_quatationItem":true,
            "update_quotation":true,
            "update_quotationItem":true,
            "delete_quotation":true,
            "delete_quotationitem":true,
            "view_single_quotation":true,
            "view_all_quotation":true
        }
    },
    "Sales Return" : {
        "Super Admin" :{
            "create_salesReturn":true,
            "view_all_salesReturn":true,
        }
    },
    "Expense" : {
        "Super Admin" :{
            "create_expense":true,
            "create_expenseItem":true,
            "update_expense":true,
            "update_expenseItem":true,
            "delete_expense":true,
            "delete_expenseItem":true,
            "view_single_expense":true,
            "view_all_expense":true
        }
    },
    "Sales Invoice" : {
        "Super Admin" :{
            "create_salesinvoice":true,
            "create_salesinvoice_item":true,
            "update_salesInvoice":true,
            "update_salesInvoiceItem":true,
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
        }
    },
    "Payment" : {
        "Super Admin" :{
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
        }
    },
    "Product" : {
        "Super Admin" :{
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
        }
    },
    "Item Category" : {
        "Super Admin" :{
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
        }
    },
    "Receipt" : {
        "Super Admin" :{
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
        }
    },
}