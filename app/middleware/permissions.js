exports.permissions = {
    "Company" :{
        "Super Admin" :{
            "create_company":true,
            "update_company":true,
            "delete_company":true,
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true,
            "view_company_balance":true,
            "view_single_bank_balance":true
        },
        "Admin" :{
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true,
            "view_company_balance":true,
            "view_single_bank_balance":true
        },
        "Account" :{
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true,
            "view_company_balance":true,
            "view_single_company_balance":true
        },
        "Employee" :{
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true,
            "view_company_balance":true,
            "view_single_bank_balance":true
        },
        "Workers" :{
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true,
            "view_company_balance":true,
            "view_single_bank_balance":true
        },
        "Other" :{
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true,
            "view_company_balance":true,
            "view_single_bank_balance":true
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
            "user_logout":true,
            "check_user":true,
            "add_user":true,
            "view_all_JoinComapny":true,
            "remove_company": true,
            "add_user_bank_account": true,
            "edit_user_bank_account":true,
            "delete_user_bank_account":true,
            "view_user_bank_account": true,
            "view_all_user_bank_account": true,
            "wallet_approve": true,
        },
        "Admin" : {
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true,
            "view_all_JoinComapny":true,
        },
        "Account" : {
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true,
            "view_all_ClaimUser":true,
            "view_all_JoinComapny":true,
        },
        "Employee":{
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true,
            "view_all_JoinComapny":true,
        },
        "Workers":{
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true,
            "view_all_JoinComapny":true,
        },
        "Other":{
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true,
            "view_all_JoinComapny":true,
        }
    },
    "Permission" : {
        "Super Admin" :{
            "view_all_permissions":true,
            "update_permissions":true
        },
        "Admin" :{
            "view_all_permissions":true,
        },
        "Account" :{
            "view_all_permissions":true,
        },
        "Employee" :{
            "view_all_permissions":true,
        },
        "Workers" :{
            "view_all_permissions":true,
        },
        "Other" :{
            "view_all_permissions":true,
        }
    },
    "ProFormaInvoice" : {
        "Super Admin" :{
            "create_ProFormaInvoice":true,
            "update_ProFormaInvoice":true,
            "delete_ProFormaInvoice":true,
            "view_single_ProFormaInvoice":true,
            "view_all_ProFormaInvoice":true,
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
            "view_all_ProFormaInvoice":true,

        },
    },
    "Debit Note" : {
        "Super Admin" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        },
        "Admin" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        },
        "Account" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        },
        "Employee" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        },
        "Workers" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        },
        "Other" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        }
    },
    "Credit Note" : {
        "Super Admin" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel":true,
            "creditNote_excel": true,
            "creditNote_html":true
        },
        "Admin" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel":true,
            "creditNote_excel": true,
            "creditNote_html":true
        },
        "Account" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel":true,
            "creditNote_excel": true,
            "creditNote_html":true
        },
        "Employee" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel":true,
            "creditNote_excel": true,
            "creditNote_html":true
        },
        "Workers" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel":true,
            "creditNote_excel": true,
            "creditNote_html":true
        },
        "Other" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel":true,
            "creditNote_excel": true,
            "creditNote_html":true
        }
    },
    "Sales Invoice" : {
        "Super Admin" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true,
            "salesInvoice_pdf": true,
            "salesInvoice_excel": true,
            "view_salesInvoice_excel": true,
            "view_salesInvoice_jpg": true,
            "salesInvoice_html": true
        },
        "Admin" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true,
            "salesInvoice_pdf": true,
            "salesInvoice_excel": true,
            "view_salesInvoice_excel": true,
            "view_salesInvoice_jpg": true,
            "salesInvoice_html": true
        },
        "Account" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true,
            "salesInvoice_pdf": true,
            "salesInvoice_excel": true,
            "view_salesInvoice_excel": true,
            "view_salesInvoice_jpg": true,
            "salesInvoice_html": true
        },
        "Employee" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true,
            "salesInvoice_pdf": true,
            "salesInvoice_excel": true,
            "view_salesInvoice_excel": true,
            "view_salesInvoice_jpg": true,
            "salesInvoice_html": true
        },
        "Workers" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true,
            "salesInvoice_pdf": true,
            "salesInvoice_excel": true,
            "view_salesInvoice_excel": true,
            "view_salesInvoice_jpg": true,
            "salesInvoice_html": true
        },
        "Other" :{
            "create_salesinvoice":true,
            "update_salesInvoice":true,
            "delete_salesInvoice":true,
            "view_single_salesInvoice":true,
            "view_all_salesInvoice":true,
            "salesInvoice_pdf": true,
            "salesInvoice_excel": true,
            "view_salesInvoice_excel": true,
            "view_salesInvoice_jpg": true,
            "salesInvoice_html": true
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
    "Stock" : {
        "Super Admin" :{
            "view_all_item_stock": true,
            "view_item_stock": true,
            "update_item_stock": true,
        },
        "Admin" :{
            "view_all_item_stock": true,
            "view_item_stock": true,
            "update_item_stock": true,
        },
        "Account" :{
            "view_all_item_stock": true,
            "view_item_stock": true,
            "update_item_stock": true,
        },
        "Employee" :{
            "view_all_item_stock": true,
            "view_item_stock": true,
            "update_item_stock": true,
        },
        "Workers" :{
            "view_all_item_stock": true,
            "view_item_stock": true,
            "update_item_stock": true,
        },
        "Other" :{
            "view_all_item_stock": true,
            "view_item_stock": true,
            "update_item_stock": true,
        }
    },
    "Items" : {
        "Super Admin" :{
            "create_item":true,
            "update_item":true,
            "delete_item":true,
            "view_single_item":true,
            "view_all_item":true,
        },
        "Admin" :{
            "create_item":true,
            "update_item":true,
            "delete_item":true,
            "view_single_item":true,
            "view_all_item":true,
        },
        "Account" :{
            "create_item":true,
            "update_item":true,
            "delete_item":true,
            "view_single_item":true,
            "view_all_item":true,
        },
        "Employee" :{
            "create_item":true,
            "update_item":true,
            "delete_item":true,
            "view_single_item":true,
            "view_all_item":true,
        },
        "Workers" :{
            "create_item":true,
            "update_item":true,
            "delete_item":true,
            "view_single_item":true,
            "view_all_item":true,
        },
        "Other" :{
            "create_item":true,
            "update_item":true,
            "delete_item":true,
            "view_single_item":true,
            "view_all_item":true,
        }
    },
    "Purchase Invoice" : {
        "Super Admin" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
            "purchaseInvoice_pdf": true,
            "purchaseInvoice_jpg": true,
            "purchaseInvoice_excel": true,
            "view_all_purchaseInvoice_excel":true,
            "purchaseInvoice_html":true
        },
        "Admin" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
            "purchaseInvoice_pdf": true,
            "purchaseInvoice_jpg": true,
            "purchaseInvoice_excel": true,
            "view_all_purchaseInvoice_excel":true,
            "purchaseInvoice_html":true
        },
        "Account" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
            "purchaseInvoice_pdf": true,
            "purchaseInvoice_jpg": true,
            "purchaseInvoice_excel": true,
            "view_all_purchaseInvoice_excel":true,
            "purchaseInvoice_html":true
        },
        "Employee" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
            "purchaseInvoice_pdf": true,
            "purchaseInvoice_jpg": true,
            "purchaseInvoice_excel": true,
            "view_all_purchaseInvoice_excel":true,
            "purchaseInvoice_html":true
        },
        "Workers" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
            "purchaseInvoice_pdf": true,
            "purchaseInvoice_jpg": true,
            "purchaseInvoice_excel": true,
            "view_all_purchaseInvoice_excel":true,
            "purchaseInvoice_html":true
        },
        "Other" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
            "purchaseInvoice_pdf": true,
            "purchaseInvoice_jpg": true,
            "purchaseInvoice_excel": true,
            "view_all_purchaseInvoice_excel":true,
            "purchaseInvoice_html":true
        }
    },
    "Company Bank Details" : {
        "Super Admin" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
        },
        "Admin" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
        },
        "Account" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
        },
        "Employee" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
        },
        "Workers" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
        },
        "Other" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
        },
    },
    "Receipt" : {
        "Super Admin" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_receipt":true,
            "get_all_receipt":true

        },
        "Admin" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_receipt":true,
            "get_all_receipt":true
        },
        "Account" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_receipt":true,
            "get_all_receipt":true
        },
        "Employee" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_receipt":true,
            "get_all_receipt":true
        },
        "Workers" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_receipt":true,
            "get_all_receipt":true
        },
        "Other" :{
            "create_receipt":true,
            "update_receipt":true,
            "delete_receipt":true,
            "view_receipt":true,
            "get_all_receipt":true
        },
    },
    "Payment" : {
        "Super Admin" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
        "Admin" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
        "Account" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
        "Employee" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
        "Workers" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
        "Other" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
    },
    "Sales Cash" : {
        "Super Admin" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true,
            "view_sales_cash_jpg": true,
            "view_sales_cash_excel": true,
            "sales_cash_excel":true,
            "sales_cash_html": true
        },
        "Admin" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true,
            "view_sales_cash_jpg": true,
            "view_sales_cash_excel": true,
            "sales_cash_excel":true,
            "sales_cash_html": true
        },
        "Account" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true,
            "view_sales_cash_jpg": true,
            "view_sales_cash_excel": true,
            "sales_cash_excel":true,
            "sales_cash_html": true
        },
        "Employee" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true,
            "view_sales_cash_jpg": true,
            "view_sales_cash_excel": true,
            "sales_cash_excel":true,
            "sales_cash_html": true
        },
        "Workers" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true,
            "view_sales_cash_jpg": true,
            "view_sales_cash_excel": true,
            "sales_cash_excel":true,
            "sales_cash_html": true
        },
        "Other" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true,
            "view_sales_cash_jpg": true,
            "view_sales_cash_excel": true,
            "sales_cash_excel":true,
            "sales_cash_html": true
        },
    },
    "Receipt Cash" : {
        "Super Admin" :{
            "create_receipt":true,
            "view_all_receipt":true,
            "view_receipt":true,
            "update_receipt":true,
            "delete_receipt":true
        },
        "Admin" :{
            "create_receipt":true,
            "view_all_receipt":true,
            "view_receipt":true,
            "update_receipt":true,
            "delete_receipt":true
        },
        "Account" :{
            "create_receipt":true,
            "view_all_receipt":true,
            "view_receipt":true,
            "update_receipt":true,
            "delete_receipt":true
        },
        "Employee" :{
            "create_receipt":true,
            "view_all_receipt":true,
            "view_receipt":true,
            "update_receipt":true,
            "delete_receipt":true
        },
        "Workers" :{
            "create_receipt":true,
            "view_all_receipt":true,
            "view_receipt":true,
            "update_receipt":true,
            "delete_receipt":true
        },
        "Other" :{
            "create_receipt":true,
            "view_all_receipt":true,
            "view_receipt":true,
            "update_receipt":true,
            "delete_receipt":true
        },
    },
    "Payment Cash" : {
        "Super Admin" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
        "Admin" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
        "Account" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
        "Employee" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
        "Workers" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
        "Other" :{
            "create_payment":true,
            "update_payment":true,
            "delete_payment":true,
            "view_payment":true,
            "view_all_payment":true
        },
    },
    "Purchase Cash" : {
        "Super Admin" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true,
            "view_purchase_cash_jpg": true,
            "view_purchase_cash_excel":true,
            "purchase_cash_excel": true,
            "purchase_cash_html": true
        },
        "Admin" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true,
            "view_purchase_cash_jpg": true,
            "view_purchase_cash_excel":true,
            "purchase_cash_excel": true,
            "purchase_cash_html": true
        },
        "Account" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true,
            "view_purchase_cash_jpg": true,
            "view_purchase_cash_excel":true,
            "purchase_cash_excel": true,
            "purchase_cash_html": true
        },
        "Employee" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true,
            "view_purchase_cash_jpg": true,
            "view_purchase_cash_excel":true,
            "purchase_cash_excel": true,
            "purchase_cash_html": true
        },
        "Workers" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true,
            "view_purchase_cash_jpg": true,
            "view_purchase_cash_excel":true,
            "purchase_cash_excel": true,
            "purchase_cash_html": true
        },
        "Other" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true,
            "view_purchase_cash_jpg": true,
            "view_purchase_cash_excel":true,
            "purchase_cash_excel": true,
            "purchase_cash_html": true
        },
    },
    "Items Cash" : {
        "Super Admin" :{
            "get_all_item_cash":true,
        },
        "Admin" :{
            "get_all_item_cash":true,
        },
        "Account" :{
            "get_all_item_cash":true,
        },
        "Employee" :{
            "get_all_item_cash":true,
        },
        "Workers" :{
            "get_all_item_cash":true,
        },
        "Other" :{
            "get_all_item_cash":true,
        },
    },
    "Company Cash" : {
        "Super Admin" :{
            "view_company_cash_balance":true,
        },
        "Admin" :{
            "view_company_cash_balance":true,
        },
        "Account" :{
            "view_company_cash_balance":true,
        },
        "Employee" :{
            "view_company_cash_balance":true,
        },
        "Workers" :{
            "view_company_cash_balance":true,
        },
        "Other" :{
            "view_company_cash_balance":true,
        },
    },
    "Claim Cash" : {
        "Super Admin" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true,
            "view_wallet": true,
            "view_company_wallet": true
        },
        "Admin" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true,
            "view_wallet": true,
            "view_company_wallet": true
        },
        "Account" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true,
            "view_wallet": true
        },
        "Employee" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true,
            "view_wallet": true
        },
        "Workers" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true,
            "view_wallet": true
        },
        "Other" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true,
            "view_wallet": true
        },
    },
    "Production" : {
        "Super Admin" :{
            "create_production":true,
            "update_production":true,
            "view_all_production":true,
            "view_production":true,
            "delete_production":true,
        },
        "Admin" :{
            "create_production":true,
            "update_production":true,
            "view_all_production":true,
            "view_production":true,
            "delete_production":true,
        },
        "Account" :{
            "create_production":true,
            "update_production":true,
            "view_all_production":true,
            "view_production":true,
            "delete_production":true,
        },
        "Employee" :{
            "create_production":true,
            "update_production":true,
            "view_all_production":true,
            "view_production":true,
            "delete_production":true,
        },
        "Workers" :{
            "create_production":true,
            "update_production":true,
            "view_all_production":true,
            "view_production":true,
            "delete_production":true,
        },
        "Other" :{
            "create_production":true,
            "update_production":true,
            "view_all_production":true,
            "view_production":true,
            "delete_production":true,
        },
    },
    "Notification" : {
        "Super Admin" :{
            "view_all_notification":true,
        },
        "Admin" :{
            "view_all_notification":true,
        },
        "Account" :{
            "view_all_notification":true,
        },
        "Employee" :{
            "view_all_notification":true,
        },
        "Workers" :{
            "view_all_notification":true,
        },
        "Other" :{
            "view_all_notification":true,
        }
    },
    "Salary" : {
        "Super Admin" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true,
            "employee": true,
        },
        "Admin" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true,
            "employee": true,
        },
        "Account" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true,
            "employee": true,
        },
        "Employee" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true,
            "employee": true,
        },
        "Workers" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true,
            "employee": true,
        },
        "Other" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true,
            "employee": true,
        }
    },
    "Machine" : {
        "Super Admin" :{
            "create_machine":true,
            "view_all_machine": true,
            "view_one_machine": true,
            "update_machine": true,
            "delete_machine": true
        },
        "Admin" :{
            "create_machine":true,
            "view_all_machine": true,
            "view_one_machine": true,
            "update_machine": true,
            "delete_machine": true
        },
        "Account" :{
            "create_machine":true,
            "view_all_machine": true,
            "view_one_machine": true,
            "update_machine": true,
            "delete_machine": true
        },
        "Employee" :{
            "create_machine":true,
            "view_all_machine": true,
            "view_one_machine": true,
            "update_machine": true,
            "delete_machine": true
        },
        "Workers" :{
            "create_machine":true,
            "view_all_machine": true,
            "view_one_machine": true,
            "update_machine": true,
            "delete_machine": true
        },
        "Other" :{
            "create_machine":true,
            "view_all_machine": true,
            "view_one_machine": true,
            "update_machine": true,
            "delete_machine": true
        }
    },
    "Dashboard" : {
        "Super Admin" :{
            "total_sales":true,
            "total_purchase": true
        },
        "Admin" :{
            "total_sales":true,
            "total_purchase": true
        },
        "Account" :{
            "total_sales":true,
            "total_purchase": true
        },
        "Employee" :{
            "total_sales":true,
            "total_purchase": true
        },
        "Workers" :{
            "total_sales":true,
            "total_purchase": true
        },
        "Other" :{
            "total_sales":true,
            "total_purchase": true
        }
    },
    "Item Group" : {
        "Super Admin" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true,
            "update_itemGroup": true,
            "delete_itemGroup": true
        },
        "Admin" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true,
            "update_itemGroup": true,
            "delete_itemGroup": true
        },
        "Account" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true,
            "update_itemGroup": true,
            "delete_itemGroup": true
        },
        "Employee" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true,
            "update_itemGroup": true,
            "delete_itemGroup": true
        },
        "Workers" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true,
            "update_itemGroup": true,
            "delete_itemGroup": true
        },
        "Other" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true,
            "update_itemGroup": true,
            "delete_itemGroup": true
        }
    },
    "Item Category" : {
        "Super Admin" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true,
            "delete_itemCategory": true,
            "view_all_itemCategory": true,
            "update_itemCategory": true
        },
        "Admin" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true,
            "delete_itemCategory": true,
            "view_all_itemCategory": true,
            "update_itemCategory": true
        },
        "Account" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true,
            "delete_itemCategory": true,
            "view_all_itemCategory": true,
            "update_itemCategory": true
        },
        "Employee" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true,
            "delete_itemCategory": true,
            "view_all_itemCategory": true,
            "update_itemCategory": true
        },
        "Workers" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true,
            "delete_itemCategory": true,
            "view_all_itemCategory": true,
            "update_itemCategory": true
        },
        "Other" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true,
            "delete_itemCategory": true,
            "view_all_itemCategory": true,
            "update_itemCategory": true
        }
    },
    "Account" : {
        "Super Admin" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true,
            "view_all_bank_account": true
        },
        "Admin" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true,
            "view_all_bank_account": true
        },
        "Account" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true,
            "view_all_bank_account": true
        },
        "Employee" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true,
            "view_all_bank_account": true
        },
        "Workers" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true,
            "view_all_bank_account": true
        },
        "Other" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true,
            "view_all_bank_account": true
        }
    },
    "Account Cash" : {
        "Super Admin" :{
            "view_all_account": true,
        },
        "Admin" :{
            "view_all_account": true,
        },
        "Account" :{
            "view_all_account": true,
        },
        "Employee" :{
            "view_all_account": true,
        },
        "Workers" :{
            "view_all_account": true,
        },
        "Other" :{
            "view_all_account": true,
        }
    },
    "Machine Schedule" : {
        "Super Admin" :{
            "create_machine_schedule":true,
            "update_machine_schedule":true,
            "view_machine_schedule":true,
            "view_all_machine_schedule":true,
            "delete_machine_schedule":true,
        },
        "Admin" :{
            "create_machine_schedule":true,
            "update_machine_schedule":true,
            "view_machine_schedule":true,
            "view_all_machine_schedule":true,
            "delete_machine_schedule":true,
        },
        "Account" :{
            "create_machine_schedule":true,
            "update_machine_schedule":true,
            "view_machine_schedule":true,
            "view_all_machine_schedule":true,
            "delete_machine_schedule":true,
        },
        "Employee" :{
            "create_machine_schedule":true,
            "update_machine_schedule":true,
            "view_machine_schedule":true,
            "view_all_machine_schedule":true,
            "delete_machine_schedule":true,
        },
        "Workers" :{
            "create_machine_schedule":true,
            "update_machine_schedule":true,
            "view_machine_schedule":true,
            "view_all_machine_schedule":true,
            "delete_machine_schedule":true,
        },
        "Other" :{
            "create_machine_schedule":true,
            "update_machine_schedule":true,
            "view_machine_schedule":true,
            "view_all_machine_schedule":true,
            "delete_machine_schedule":true,
        }
    },
    "Ledger": {
        "Super Admin" :{
            "account_ledger":true,
            "daybook":true,
            "account_ledger_pdf": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        },
        "Admin" :{
            "account_ledger":true,
            "daybook":true,
            "account_ledger_pdf": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        },
        "Account" :{
            "account_ledger":true,
            "daybook":true,
            "account_ledger_pdf": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        },
        "Employee" :{
            "account_ledger":true,
            "daybook":true,
            "account_ledger_pdf": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        },
        "Workers" :{
            "account_ledger":true,
            "daybook":true,
            "account_ledger_pdf": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        },
        "Other" :{
            "account_ledger":true,
            "daybook":true,
            "account_ledger_pdf": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        }
    },
    "Ledger Cash": {
        "Super Admin" :{
            "account_ledger":true,
            "daybook":true,
            "cashbook": true,
            "wallet_ledger": true,
            "account_ledger_pdf": true,
            "passbook": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        },
        "Admin" :{
            "account_ledger":true,
            "daybook":true,
            "cashbook": true,
            "wallet_ledger": true,
            "account_ledger_pdf": true,
            "passbook": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        },
        "Account" :{
            "account_ledger":true,
            "daybook":true,
            "cashbook": true,
            "wallet_ledger": true,
            "account_ledger_pdf": true,
            "passbook": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        },
        "Employee" :{
            "account_ledger":true,
            "daybook":true,
            "cashbook": true,
            "wallet_ledger": true,
            "account_ledger_pdf": true,
            "passbook": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        },
        "Workers" :{
            "account_ledger":true,
            "daybook":true,
            "cashbook": true,
            "wallet_ledger": true,
            "account_ledger_pdf": true,
            "passbook": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        },
        "Other" :{
            "account_ledger":true,
            "daybook":true,
            "cashbook": true,
            "wallet_ledger": true,
            "account_ledger_pdf": true,
            "passbook": true,
            "account_ledger_excel": true,
            "account_ledger_jpg": true,
            "account_ledger_html": true
        }
    },
    "Purchase Order": {
        "Super Admin" :{
            "create_purchaseOrder":true,
            "update_purchaseOrder": true,
            "view_single_purchaseOrder": true,
            "view_all_purchaseOrder": true,
            "delete_purchaseOrder": true
        },
        "Admin" :{
            "create_purchaseOrder":true,
            "update_purchaseOrder": true,
            "view_single_purchaseOrder": true,
            "view_all_purchaseOrder": true,
            "delete_purchaseOrder": true
        },
        "Account" :{
            "create_purchaseOrder":true,
            "update_purchaseOrder": true,
            "view_single_purchaseOrder": true,
            "view_all_purchaseOrder": true,
            "delete_purchaseOrder": true
        },
        "Employee" :{
            "create_purchaseOrder":true,
            "update_purchaseOrder": true,
            "view_single_purchaseOrder": true,
            "view_all_purchaseOrder": true,
            "delete_purchaseOrder": true
        },
        "Workers" :{
            "create_purchaseOrder":true,
            "update_purchaseOrder": true,
            "view_single_purchaseOrder": true,
            "view_all_purchaseOrder": true,
            "delete_purchaseOrder": true
        },
        "Other" :{
            "create_purchaseOrder":true,
            "update_purchaseOrder": true,
            "view_single_purchaseOrder": true,
            "view_all_purchaseOrder": true,
            "delete_purchaseOrder": true
        }
    },
    "Debit Note Cash" : {
        "Super Admin" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        },
        "Admin" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        },
        "Account" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        },
        "Employee" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        },
        "Workers" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        },
        "Other" :{
            "create_debitNote":true,
            "update_debitNote":true,
            "view_all_debitNote":true,
            "view_single_debitNote":true,
            "delete_debitNote":true,
            "debitNote_pdf": true,
            "debitNote_jpg": true,
            "debitNote_single_excel": true,
            "debitNote_excel": true
        }
    },
    "Credit Note Cash" : {
        "Super Admin" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel": true,
            "creditNote_excel": true,
            "creditNote_html":true
        },
        "Admin" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel": true,
            "creditNote_excel": true,
            "creditNote_html":true
        },
        "Account" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel": true,
            "creditNote_excel": true,
            "creditNote_html":true
        },
        "Employee" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel": true,
            "creditNote_excel": true,
            "creditNote_html":true
        },
        "Workers" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel": true,
            "creditNote_excel": true,
            "creditNote_html":true
        },
        "Other" :{
            "create_creditNote":true,
            "update_creditNote":true,
            "view_all_creditNote":true,
            "delete_creditNote":true,
            "view_single_creditNote":true,
            "creditNote_pdf": true,
            "creditNote_jpg": true,
            "creditNote_single_excel": true,
            "creditNote_excel": true,
            "creditNote_html":true
        }
    },
    "Wastage" : {
        "Super Admin" :{
            "create_wastage":true,
            "update_wastage":true,
            "view_all_wastage":true,
            "delete_wastage":true,
            "view_single_wastage":true
        },
        "Admin" :{
            "create_wastage":true,
            "update_wastage":true,
            "view_all_wastage":true,
            "delete_wastage":true,
            "view_single_wastage":true
        },
        "Account" :{
            "create_wastage":true,
            "update_wastage":true,
            "view_all_wastage":true,
            "delete_wastage":true,
            "view_single_wastage":true
        },
        "Employee" :{
            "create_wastage":true,
            "update_wastage":true,
            "view_all_wastage":true,
            "delete_wastage":true,
            "view_single_wastage":true
        },
        "Workers" :{
            "create_wastage":true,
            "update_wastage":true,
            "view_all_wastage":true,
            "delete_wastage":true,
            "view_single_wastage":true
        },
        "Other" :{
            "create_wastage":true,
            "update_wastage":true,
            "view_all_wastage":true,
            "delete_wastage":true,
            "view_single_wastage":true
        }
    },
    "Maintenance Type" : {
        "Super Admin" :{
            "create_maintenanceType":true,
            "update_maintenanceType":true,
            "view_all_maintenanceType":true,
            "view_single_maintenanceType":true,
            "delete_maintenanceType":true
        },
        "Admin" :{
            "create_maintenanceType":true,
            "update_maintenanceType":true,
            "view_all_maintenanceType":true,
            "view_single_maintenanceType":true,
            "delete_maintenanceType":true
        },
        "Account" :{
            "create_maintenanceType":true,
            "update_maintenanceType":true,
            "view_all_maintenanceType":true,
            "view_single_maintenanceType":true,
            "delete_maintenanceType":true
        },
        "Employee" :{
            "create_maintenanceType":true,
            "update_maintenanceType":true,
            "view_all_maintenanceType":true,
            "view_single_maintenanceType":true,
            "delete_maintenanceType":true
        },
        "Workers" :{
            "create_maintenanceType":true,
            "update_maintenanceType":true,
            "view_all_maintenanceType":true,
            "view_single_maintenanceType":true,
            "delete_maintenanceType":true
        },
        "Other" :{
            "create_maintenanceType":true,
            "update_maintenanceType":true,
            "view_all_maintenanceType":true,
            "view_single_maintenanceType":true,
            "delete_maintenanceType":true
        }
    },
    "Purpose" : {
        "Super Admin" :{
            "create_purpose":true,
            "update_purpose": true,
            "view_single_purpose": true,
            "view_all_purpose": true,
            "delete_purpose": true
        },
        "Admin" :{
            "create_purpose":true,
            "update_purpose": true,
            "view_single_purpose": true,
            "view_all_purpose": true,
            "delete_purpose": true
        },
        "Account" :{
            "create_purpose":true,
            "update_purpose": true,
            "view_single_purpose": true,
            "view_all_purpose": true,
            "delete_purpose": true
        },
        "Employee" :{
           "create_purpose":true,
            "update_purpose": true,
            "view_single_purpose": true,
            "view_all_purpose": true,
            "delete_purpose": true
        },
        "Workers" :{
            "create_purpose":true,
            "update_purpose": true,
            "view_single_purpose": true,
            "view_all_purpose": true,
            "delete_purpose": true
        },
        "Other" :{
            "create_purpose":true,
            "update_purpose": true,
            "view_single_purpose": true,
            "view_all_purpose": true,
            "delete_purpose": true
        }
    },
    "Maintenance" : {
        "Super Admin" :{
            "create_maintenance":true,
            "update_maintenance": true,
            "view_all_maintenance": true,
            "view_one_maintenance": true,
            "delete_maintenance": true
        },
        "Admin" :{
            "create_maintenance":true,
            "update_maintenance": true,
            "view_all_maintenance": true,
            "view_one_maintenance": true,
            "delete_maintenance": true
        },
        "Account" :{
            "create_maintenance":true,
            "update_maintenance": true,
            "view_all_maintenance": true,
            "view_one_maintenance": true,
            "delete_maintenance": true
        },
        "Employee" :{
            "create_maintenance":true,
            "update_maintenance": true,
            "view_all_maintenance": true,
            "view_one_maintenance": true,
            "delete_maintenance": true
        },
        "Workers" :{
           "create_maintenance":true,
           "update_maintenance": true,
           "view_all_maintenance": true,
           "view_one_maintenance": true,
           "delete_maintenance": true
        },
        "Other" :{
            "create_maintenance":true,
            "update_maintenance": true,
            "view_all_maintenance": true,
            "view_one_maintenance": true,
            "delete_maintenance": true
        }
    },
}