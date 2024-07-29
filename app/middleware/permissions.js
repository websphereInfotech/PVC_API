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
            "view_all_user_bank_account": true
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
        },
        "Admin" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
        },
        "Account" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
        },
        "Employee" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
        },
        "Workers" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
        },
        "Other" :{
            "create_purchase_Invoice":true,
            "update_purchase_Invoice":true,
            "delete_purchase_Invoice":true,
            "view_single_purchase_Invoice":true,
            "view_all_purchase_Invoice":true,
        }
    },
    "Vendor" :{
        "Super Admin" :{
            "create_vendor":true,
            "update_vendor":true,
            "delete_vandor":true,
            "view_vendor":true,
            "view_all_vandor":true,
        },
        "Admin" :{
            "create_vendor":true,
            "update_vendor":true,
            "delete_vandor":true,
            "view_vendor":true,
            "view_all_vandor":true,
        },
        "Account" :{
            "create_vendor":true,
            "update_vendor":true,
            "delete_vandor":true,
            "view_vendor":true,
            "view_all_vandor":true,
        },
        "Employee" :{
            "create_vendor":true,
            "update_vendor":true,
            "delete_vandor":true,
            "view_vendor":true,
            "view_all_vandor":true,
        },
        "Workers" :{
            "create_vendor":true,
            "update_vendor":true,
            "delete_vandor":true,
            "view_vendor":true,
            "view_all_vandor":true,
        },
        "Other" :{
            "create_vendor":true,
            "update_vendor":true,
            "delete_vandor":true,
            "view_vendor":true,
            "view_all_vandor":true,
        }
    },
    "Customer Ledger" : {
        "Super Admin" :{
            "View_customer_Ledger":true,
            "Pdf_Download": true
        },
        "Admin" :{
            "View_customer_Ledger":true,
            "Pdf_Download": true
        },
        "Account" :{
            "View_customer_Ledger":true,
            "Pdf_Download": true
        },
        "Employee" :{
            "View_customer_Ledger":true,
            "Pdf_Download": true
        },
        "Workers" :{
            "View_customer_Ledger":true,
            "Pdf_Download": true
        },
        "Other" :{
            "View_customer_Ledger":true,
            "Pdf_Download": true
        },
    },
    "Vendor Ledger" : {
        "Super Admin" :{
            "View_vendor_Ledger":true,
            "Pdf_Download": true
        },
        "Admin" :{
            "View_vendor_Ledger":true,
            "Pdf_Download": true
        },
        "Account" :{
            "View_vendor_Ledger":true,
            "Pdf_Download": true
        },
        "Employee" :{
            "View_vendor_Ledger":true,
            "Pdf_Download": true
        },
        "Workers" :{
            "View_vendor_Ledger":true,
            "Pdf_Download": true
        },
        "Other" :{
            "View_vendor_Ledger":true,
            "Pdf_Download": true
        },
    },
    "Company Bank Details" : {
        "Super Admin" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
            "view_company_bankLedger":true,
            "view_single_bankLedger":true
        },
        "Admin" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
            "view_company_bankLedger":true,
            "view_single_bankLedger":true
        },
        "Account" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
            "view_company_bankLedger":true,
            "view_single_bankLedger":true
        },
        "Employee" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
            "view_company_bankLedger":true,
            "view_single_bankLedger":true
        },
        "Workers" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
            "view_company_bankLedger":true,
            "view_single_bankLedger":true
        },
        "Other" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true,
            "view_company_bankLedger":true,
            "view_single_bankLedger":true
        },
    },
    "Receive Bank" : {
        "Super Admin" :{
            "create_receive_bank":true,
            "update_receive_bank":true,
            "delete_receive_bank":true,
            "view_receive_bank":true,
            "get_all_receive_bank":true

        },
        "Admin" :{
            "create_receive_bank":true,
            "update_receive_bank":true,
            "delete_receive_bank":true,
            "view_receive_bank":true,
            "get_all_receive_bank":true
        },
        "Account" :{
            "create_receive_bank":true,
            "update_receive_bank":true,
            "delete_receive_bank":true,
            "view_receive_bank":true,
            "get_all_receive_bank":true
        },
        "Employee" :{
            "create_receive_bank":true,
            "update_receive_bank":true,
            "delete_receive_bank":true,
            "view_receive_bank":true,
            "get_all_receive_bank":true
        },
        "Workers" :{
            "create_receive_bank":true,
            "update_receive_bank":true,
            "delete_receive_bank":true,
            "view_receive_bank":true,
            "get_all_receive_bank":true
        },
        "Other" :{
            "create_receive_bank":true,
            "update_receive_bank":true,
            "delete_receive_bank":true,
            "view_receive_bank":true,
            "get_all_receive_bank":true
        },
    },
    "Payment Bank" : {
        "Super Admin" :{
            "create_payment_bank":true,
            "update_payment_bank":true,
            "delete_payment_bank":true,
            "view_payment_bank":true,
            "view_all_payment_bank":true

        },
        "Admin" :{
            "create_payment_bank":true,
            "update_payment_bank":true,
            "delete_payment_bank":true,
            "view_payment_bank":true,
            "view_all_payment_bank":true
        },
        "Account" :{
            "create_payment_bank":true,
            "update_payment_bank":true,
            "delete_payment_bank":true,
            "view_payment_bank":true,
            "view_all_payment_bank":true
        },
        "Employee" :{
            "create_payment_bank":true,
            "update_payment_bank":true,
            "delete_payment_bank":true,
            "view_payment_bank":true,
            "view_all_payment_bank":true
        },
        "Workers" :{
            "create_payment_bank":true,
            "update_payment_bank":true,
            "delete_payment_bank":true,
            "view_payment_bank":true,
            "view_all_payment_bank":true
        },
        "Other" :{
            "create_payment_bank":true,
            "update_payment_bank":true,
            "delete_payment_bank":true,
            "view_payment_bank":true,
            "view_all_payment_bank":true
        },
    },
    "Sales Cash" : {
        "Super Admin" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true
        },
        "Admin" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true
        },
        "Account" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true
        },
        "Employee" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true
        },
        "Workers" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true
        },
        "Other" :{
            "create_sales_cash":true,
            "update_sales_cash":true,
            "delete_sales_cash":true,
            "view_sales_cash":true,
            "view_all_sales_cash":true,
            "view_sales_cash_pdf": true
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
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true
        },
        "Admin" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true
        },
        "Account" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true
        },
        "Employee" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true
        },
        "Workers" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true
        },
        "Other" :{
            "create_purchase_cash":true,
            "update_purchase_cash":true,
            "delete_purchase_cash":true,
            "view_purchase_cash":true,
            "view_all_purchase_cash":true,
            "view_purchase_cash_pdf": true
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
    "Customer Ledger Cash" : {
        "Super Admin" :{
            "View_Cash_customer_Ledger":true,
            "Pdf_Download": true
        },
        "Admin" :{
            "View_Cash_customer_Ledger":true,
            "Pdf_Download": true
        },
        "Account" :{
            "View_Cash_customer_Ledger":true,
            "Pdf_Download": true
        },
        "Employee" :{
            "View_Cash_customer_Ledger":true,
            "Pdf_Download": true
        },
        "Workers" :{
            "View_Cash_customer_Ledger":true,
            "Pdf_Download": true
        },
        "Other" :{
            "View_Cash_customer_Ledger":true,
            "Pdf_Download": true
        },
    },
    "Vendor Ledger Cash" : {
        "Super Admin" :{
            "View_Cash_vendor_Ledger":true,
            "Pdf_Download": true
        },
        "Admin" :{
            "View_Cash_vendor_Ledger":true,
            "Pdf_Download": true
        },
        "Account" :{
            "View_Cash_vendor_Ledger":true,
            "Pdf_Download": true
        },
        "Employee" :{
            "View_Cash_vendor_Ledger":true,
            "Pdf_Download": true
        },
        "Workers" :{
            "View_Cash_vendor_Ledger":true,
            "Pdf_Download": true
        },
        "Other" :{
            "View_Cash_vendor_Ledger":true,
            "Pdf_Download": true
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
            "view_claimBalance_ledger":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true
        },
        "Admin" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_claimBalance_ledger":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true
        },
        "Account" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_claimBalance_ledger":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true
        },
        "Employee" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_claimBalance_ledger":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true
        },
        "Workers" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_claimBalance_ledger":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true
        },
        "Other" :{
            "create_claim":true,
            "update_claim":true,
            "delete_claim":true,
            "view_myclaim":true,
            "view_reciveclaim":true,
            "isapproved_claim":true,
            "view_single_claim":true,
            "view_claimBalance_ledger":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true
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
            "view_all_salary_payment": true
        },
        "Admin" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true
        },
        "Account" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true
        },
        "Employee" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true
        },
        "Workers" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true
        },
        "Other" :{
            "view_all_salary":true,
            "add_salary_payment": true,
            "edit_salary_payment": true,
            "delete_salary_payment": true,
            "view_all_salary_payment": true
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
    "Regular Maintenance" : {
        "Super Admin" :{
            "create_regular_maintenance":true,
            "update_regular_maintenance": true,
            "view_all_regular_maintenance": true,
            "view_one_regular_maintenance": true,
            "delete_regular_maintenance": true
        },
        "Admin" :{
            "create_regular_maintenance":true,
            "update_regular_maintenance": true,
            "view_all_regular_maintenance": true,
            "view_one_regular_maintenance": true,
            "delete_regular_maintenance": true
        },
        "Account" :{
            "create_regular_maintenance":true,
            "update_regular_maintenance": true,
            "view_all_regular_maintenance": true,
            "view_one_regular_maintenance": true,
            "delete_regular_maintenance": true
        },
        "Employee" :{
            "create_regular_maintenance":true,
            "update_regular_maintenance": true,
            "view_all_regular_maintenance": true,
            "view_one_regular_maintenance": true,
            "delete_regular_maintenance": true
        },
        "Workers" :{
            "create_regular_maintenance":true,
            "update_regular_maintenance": true,
            "view_all_regular_maintenance": true,
            "view_one_regular_maintenance": true,
            "delete_regular_maintenance": true
        },
        "Other" :{
            "create_regular_maintenance":true,
            "update_regular_maintenance": true,
            "view_all_regular_maintenance": true,
            "view_one_regular_maintenance": true,
            "delete_regular_maintenance": true
        }
    },
    "Preventive Maintenance" : {
        "Super Admin" :{
            "create_preventive_maintenance":true,
            "update_preventive_maintenance": true,
            "view_all_preventive_maintenance": true,
            "view_one_preventive_maintenance": true,
            "delete_preventive_maintenance": true
        },
        "Admin" :{
            "create_preventive_maintenance":true,
            "update_preventive_maintenance": true,
            "view_all_preventive_maintenance": true,
            "view_one_preventive_maintenance": true,
            "delete_preventive_maintenance": true
        },
        "Account" :{
            "create_preventive_maintenance":true,
            "update_preventive_maintenance": true,
            "view_all_preventive_maintenance": true,
            "view_one_preventive_maintenance": true,
            "delete_preventive_maintenance": true
        },
        "Employee" :{
            "create_preventive_maintenance":true,
            "update_preventive_maintenance": true,
            "view_all_preventive_maintenance": true,
            "view_one_preventive_maintenance": true,
            "delete_preventive_maintenance": true
        },
        "Workers" :{
            "create_preventive_maintenance":true,
            "update_preventive_maintenance": true,
            "view_all_preventive_maintenance": true,
            "view_one_preventive_maintenance": true,
            "delete_preventive_maintenance": true
        },
        "Other" :{
            "create_preventive_maintenance":true,
            "update_preventive_maintenance": true,
            "view_all_preventive_maintenance": true,
            "view_one_preventive_maintenance": true,
            "delete_preventive_maintenance": true
        }
    },
    "Breakdown Maintenance" : {
        "Super Admin" :{
            "create_breakdown_maintenance":true,
            "update_breakdown_maintenance": true,
            "view_all_breakdown_maintenance": true,
            "view_one_breakdown_maintenance": true,
            "delete_breakdown_maintenance": true
        },
        "Admin" :{
            "create_breakdown_maintenance":true,
            "update_breakdown_maintenance": true,
            "view_all_breakdown_maintenance": true,
            "view_one_breakdown_maintenance": true,
            "delete_breakdown_maintenance": true
        },
        "Account" :{
            "create_breakdown_maintenance":true,
            "update_breakdown_maintenance": true,
            "view_all_breakdown_maintenance": true,
            "view_one_breakdown_maintenance": true,
            "delete_breakdown_maintenance": true
        },
        "Employee" :{
            "create_breakdown_maintenance":true,
            "update_breakdown_maintenance": true,
            "view_all_breakdown_maintenance": true,
            "view_one_breakdown_maintenance": true,
            "delete_breakdown_maintenance": true
        },
        "Workers" :{
            "create_breakdown_maintenance":true,
            "update_breakdown_maintenance": true,
            "view_all_breakdown_maintenance": true,
            "view_one_breakdown_maintenance": true,
            "delete_breakdown_maintenance": true
        },
        "Other" :{
            "create_breakdown_maintenance":true,
            "update_breakdown_maintenance": true,
            "view_all_breakdown_maintenance": true,
            "view_one_breakdown_maintenance": true,
            "delete_breakdown_maintenance": true
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
            "view_all_itemGroup": true
        },
        "Admin" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true
        },
        "Account" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true
        },
        "Employee" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true
        },
        "Workers" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true
        },
        "Other" :{
            "create_itemGroup":true,
            "view_single_itemGroup": true,
            "view_all_itemGroup": true
        }
    },
    "Item Category" : {
        "Super Admin" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true
        },
        "Admin" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true
        },
        "Account" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true
        },
        "Employee" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true
        },
        "Workers" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true
        },
        "Other" :{
            "create_itemCategory":true,
            "view_single_itemCategory": true,
            "view_all_itemCategory_group": true
        }
    },
    "Account" : {
        "Super Admin" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true
        },
        "Admin" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true
        },
        "Account" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true
        },
        "Employee" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true
        },
        "Workers" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true
        },
        "Other" :{
            "view_all_account_group":true,
            "create_account": true,
            "view_one_account": true,
            "update_account": true,
            "view_all_account": true,
            "delete_account": true
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
}