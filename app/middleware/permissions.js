exports.permissions = {
    "Company" :{
        "Super Admin" :{
            "create_company":true,
            "update_company":true,
            "delete_company":true,
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true
        },
        "Admin" :{
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true
        },
        "Account" :{
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true
        },
        "Employee" :{
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true
        },
        "Workers" :{
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true
        },
        "Other" :{
            "view_all_company":true,
            "view_single_company":true,
            "set_default_comapny":true
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
            "view_all_userTOComapny":true,
        },
        "Admin" : {
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true,
            "view_all_userTOComapny":true,
        },
        "Account" : {
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true,
            "view_all_ClaimUser":true,
            "view_all_userTOComapny":true,
        },
        "Employee":{
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true,
            "view_all_userTOComapny":true,
        },
        "Workers":{
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true,
            "view_all_userTOComapny":true,
        },
        "Other":{
            "update_user":true,
            "reset_password":true,
            "view_user":true,
            "user_logout":true,
            "view_all_userTOComapny":true,
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
    // "Expense" : {
    //     "Super Admin" :{
    //         "create_expense":true,
    //         "update_expense":true,
    //         "delete_expense":true,
    //         "delete_expenseItem":true,
    //         "view_single_expense":true,
    //         "view_all_expense":true
    //     },
    //     "Admin" :{
    //         "create_expense":true,
    //         "update_expense":true,
    //         "delete_expense":true,
    //         "delete_expenseItem":true,
    //         "view_single_expense":true,
    //         "view_all_expense":true
    //     },
    //     "Account" :{
    //         "create_expense":true,
    //         "update_expense":true,
    //         "delete_expense":true,
    //         "delete_expenseItem":true,
    //         "view_single_expense":true,
    //         "view_all_expense":true
    //     },
    //     "Employee" :{
    //         "create_expense":true,
    //         "update_expense":true,
    //         "delete_expense":true,
    //         "delete_expenseItem":true,
    //         "view_single_expense":true,
    //         "view_all_expense":true
    //     },
    //     "Workers" :{
    //         "create_expense":true,
    //         "update_expense":true,
    //         "delete_expense":true,
    //         "delete_expenseItem":true,
    //         "view_single_expense":true,
    //         "view_all_expense":true
    //     },
    //     "Other" :{
    //         "create_expense":true,
    //         "update_expense":true,
    //         "delete_expense":true,
    //         "delete_expenseItem":true,
    //         "view_single_expense":true,
    //         "view_all_expense":true
    //     }
    // },
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
    // "Stock" : {
    //     "Super Admin" :{
    //         "create_stockitem":true,
    //         "view_all_stock":true,
    //     },
    //     "Admin" :{
    //         "create_stockitem":true,
    //         "view_all_stock":true,
    //     },
    //     "Account" :{
    //         "create_stockitem":true,
    //         "view_all_stock":true,
    //     },
    //     "Employee" :{
    //         "create_stockitem":true,
    //         "view_all_stock":true,
    //     },
    //     "Workers" :{
    //         "create_stockitem":true,
    //         "view_all_stock":true,
    //     },
    //     "Other" :{
    //         "create_stockitem":true,
    //         "view_all_stock":true,
    //     }
    // },
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
    // "Receipt" : {
    //     "Super Admin" :{
    //         "create_receipt":true,
    //         "update_receipt":true,
    //         "delete_receipt":true,
    //         "view_single_receipt":true,
    //         "view_all_receipt":true,
    //     },
    //     "Admin" :{
    //         "create_receipt":true,
    //         "update_receipt":true,
    //         "delete_receipt":true,
    //         "view_single_receipt":true,
    //         "view_all_receipt":true,
    //     },
    //     "Account" :{
    //         "create_receipt":true,
    //         "update_receipt":true,
    //         "delete_receipt":true,
    //         "view_single_receipt":true,
    //         "view_all_receipt":true,
    //     },
    //     "Employee" :{
    //         "create_receipt":true,
    //         "update_receipt":true,
    //         "delete_receipt":true,
    //         "view_single_receipt":true,
    //         "view_all_receipt":true,
    //     },
    //     "Workers" :{
    //         "create_receipt":true,
    //         "update_receipt":true,
    //         "delete_receipt":true,
    //         "view_single_receipt":true,
    //         "view_all_receipt":true,
    //     },
    //     "Other" :{
    //         "create_receipt":true,
    //         "update_receipt":true,
    //         "delete_receipt":true,
    //         "view_single_receipt":true,
    //         "view_all_receipt":true,
    //     }
    // },
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
        },
        "Admin" :{
            "View_customer_Ledger":true,
        },
        "Account" :{
            "View_customer_Ledger":true,
        },
        "Employee" :{
            "View_customer_Ledger":true,
        },
        "Workers" :{
            "View_customer_Ledger":true,
        },
        "Other" :{
            "View_customer_Ledger":true,
        },
    },
    "Vendor Ledger" : {
        "Super Admin" :{
            "View_vendor_Ledger":true,
        },
        "Admin" :{
            "View_vendor_Ledger":true,
        },
        "Account" :{
            "View_vendor_Ledger":true,
        },
        "Employee" :{
            "View_vendor_Ledger":true,
        },
        "Workers" :{
            "View_vendor_Ledger":true,
        },
        "Other" :{
            "View_vendor_Ledger":true,
        },
    },
    "Company Bank Details" : {
        "Super Admin" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true
        },
        "Admin" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true
        },
        "Account" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true
        },
        "Employee" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true
        },
        "Workers" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true
        },
        "Other" :{
            "create_company_bankDetails":true,
            "update_company_bankDetails":true,
            "delete_company_bankDetails":true,
            "view_company_bankDetails":true,
            "view_all_company_bankDetails":true
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
    "Customer Ledger Cash" : {
        "Super Admin" :{
            "View_Cash_customer_Ledger":true,
        },
        "Admin" :{
            "View_Cash_customer_Ledger":true,
        },
        "Account" :{
            "View_Cash_customer_Ledger":true,
        },
        "Employee" :{
            "View_Cash_customer_Ledger":true,
        },
        "Workers" :{
            "View_Cash_customer_Ledger":true,
        },
        "Other" :{
            "View_Cash_customer_Ledger":true,
        },
    },
    "Vendor Ledger Cash" : {
        "Super Admin" :{
            "View_Cash_vendor_Ledger":true,
        },
        "Admin" :{
            "View_Cash_vendor_Ledger":true,
        },
        "Account" :{
            "View_Cash_vendor_Ledger":true,
        },
        "Employee" :{
            "View_Cash_vendor_Ledger":true,
        },
        "Workers" :{
            "View_Cash_vendor_Ledger":true,
        },
        "Other" :{
            "View_Cash_vendor_Ledger":true,
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
            "view_claim_ledger":true,
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
            "view_claim_ledger":true,
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
            "view_claim_ledger":true,
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
            "view_claim_ledger":true,
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
            "view_claim_ledger":true,
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
            "view_claim_ledger":true,
            "view_claimBalance_ledger":true,
            "view_all_ClaimUser":true,
            "view_user_balance":true
        },
    },
    // "Permission":{
    //     "Super Admin": {
    //         "view_all_permissions":true,
    //     }
    // },
}