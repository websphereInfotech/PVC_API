# PVC_API

This document provides a comprehensive overview of the PVC_API system, including its database models, their relationships, and the available API routes.

## 1. Database Models

### 1.1. User Model (`P_user`)

The `P_user` model represents users in the system.

- **`username`**: (String) The username of the user.
- **`email`**: (String) The email of the user.
- **`mobileno`**: (BigInt) The mobile number of the user.
- **`salary`**: (Integer) The salary of the user.
- **`password`**: (String) The hashed password of the user.
- **`role`**: (Enum) The role of the user. Possible values are defined in the `ROLE` constant.
- **`entryTime`**: (Time) The entry time of the user.
- **`exitTime`**: (Time) The exit time of the user.

### 1.2. Company Model (`P_company`)

The `P_company` model represents companies in the system.

- **`companyname`**: (String) The name of the company.
- **`gstnumber`**: (String) The GST number of the company.
- **`email`**: (String) The email of the company.
- **`mobileno`**: (BigInt) The mobile number of the company.
- **`address1`**: (String) The first line of the company's address.
- **`address2`**: (String) The second line of the company's address.
- **`pincode`**: (Integer) The pincode of the company's address.
- **`state`**: (String) The state of the company.
- **`city`**: (String) The city of the company.

### 1.3. System Settings Model (`P_systemSettings`)

The `P_systemSettings` model stores system-wide settings.

- **`companyId`**: (Integer) The ID of the company these settings belong to.
- **`field`**: (String) The name of the setting.
- **`value`**: (Text) The value of the setting.

### 1.4. Holiday Model (`P_holiday`)

The `P_holiday` model stores information about holidays.

- **`companyId`**: (Integer) The ID of the company this holiday belongs to.
- **`date`**: (String) The date of the holiday.
- **`name`**: (String) The name of the holiday.

### 1.5. Permissions Model (`P_permissions`)

The `P_permissions` model defines the permissions for different roles in the system.

- **`role`**: (String) The role to which the permission belongs.
- **`resource`**: (String) The resource that the permission applies to.
- **`permissionValue`**: (Boolean) The value of the permission (true for allowed, false for denied).
- **`permission`**: (String) A descriptive name for the permission.
- **`type`**: (Boolean) The type of the permission.
- **`companyId`**: (Integer) The ID of the company this permission belongs to.

### 1.6. BOM Model (`P_Bom`)

The `P_Bom` model represents a Bill of Materials (BOM), which is a list of the raw materials, sub-assemblies, intermediate assemblies, sub-components, parts, and the quantities of each needed to manufacture an end product.

- **`bomNo`**: (Integer) The BOM number.
- **`date`**: (DateOnly) The date of the BOM.
- **`weight`**: (Float) The weight of the product.
- **`createdBy`**: (Integer) The ID of the user who created the BOM.
- **`updatedBy`**: (Integer) The ID of the user who last updated the BOM.
- **`companyId`**: (Integer) The ID of the company this BOM belongs to.
- **`productId`**: (Integer) The ID of the finished product.
- **`qty`**: (Integer) The quantity of the finished product.
- **`unit`**: (String) The unit of measure for the finished product.
- **`totalQty`**: (Float) The total quantity of all items in the BOM.
- **`shift`**: (Enum) The worker shift.
- **`startTime`**: (Time) The start time of the production.
- **`endTime`**: (Time) The end time of the production.
- **`WastageId`**: (Integer) The ID of the wastage item.
- **`wastageQty`**: (Integer) The quantity of the wastage.

### 1.7. BOM Item Model (`P_BomItem`)

The `P_BomItem` model represents an item within a Bill of Materials (BOM).

- **`productId`**: (Integer) The ID of the product item.
- **`qty`**: (Float) The quantity of the product item.
- **`bomId`**: (Integer) The ID of the BOM this item belongs to.
- **`unit`**: (String) The unit of measure for the product item.

### 1.8. Salary Model (`P_Salary`)

The `P_Salary` model represents an employee's salary for a specific month.

- **`amount`**: (Integer) The salary amount.
- **`companyId`**: (Integer) The ID of the company this salary belongs to.
- **`userId`**: (Integer) The ID of the user this salary belongs to.
- **`monthStartDate`**: (DateOnly) The start date of the salary month.
- **`monthEndDate`**: (DateOnly) The end date of the salary month.
- **`payableAmount`**: (Integer) The amount of salary that is yet to be paid.

### 1.9. Salary Payment Model (`P_SalaryPayment`)

The `P_SalaryPayment` model represents a payment made towards an employee's salary.

- **`amount`**: (Integer) The amount of the salary payment.
- **`paymentType`**: (Enum) The type of the salary payment.
- **`date`**: (DateOnly) The date of the salary payment.
- **`companyBankId`**: (Integer) The ID of the company's bank account.
- **`salaryId`**: (Integer) The ID of the salary this payment is for.
- **`userBankId`**: (Integer) The ID of the user's bank account.

### 1.10. Account Model (`P_Account`)

The `P_Account` model represents a financial account within the system.

- **`accountName`**: (String) The name of the account.
- **`shortName`**: (String) A shorter name for the account.
- **`contactPersonName`**: (String) The name of the contact person for this account.
- **`companyId`**: (Integer) The ID of the company this account belongs to.
- **`x`**: (Integer) The ID of the account group this account belongs to.
- **`isActive`**: (Boolean) Whether the account is active or not.

### 1.11. Account Detail Model (`P_AccountDetails`)

The `P_AccountDetails` model stores additional details for an account.

- **`email`**: (String) The email address associated with the account.
- **`mobileNo`**: (BigInt) The mobile number associated with the account.
- **`panNo`**: (String) The PAN number of the account holder.
- **`creditPeriod`**: (Integer) The credit period for the account.
- **`address1`**: (String) The first line of the account's address.
- **`address2`**: (String) The second line of the account's address.
- **`pincode`**: (Integer) The pincode of the account's address.
- **`state`**: (String) The state of the account's address.
- **`city`**: (String) The city of the account's address.
- **`bankDetail`**: (Boolean) Whether bank details are available for this account.
- **`creditLimit`**: (Boolean) The credit limit for the account.
- **`balance`**: (Integer) The current balance of the account.
- **`cashOpeningBalance`**: (Integer) The opening balance for the cash ledger.
- **`gstNumber`**: (String) The GST number of the account.
- **`totalCredit`**: (BigInt) The total credit for the account.
- **`registrationType`**: (Enum) The registration type of the account.
- **`accountId`**: (Integer) The ID of the account these details belong to.
- **`accountNumber`**: (String) The bank account number.
- **`ifscCode`**: (String) The IFSC code of the bank.
- **`bankName`**: (String) The name of the bank.
- **`accountHolderName`**: (String) The name of the account holder.

### 1.12. Account Group Model (`P_AccountGroup`)

The `P_AccountGroup` model is used to group accounts together.

- **`name`**: (String) The name of the account group.
- **`companyId`**: (Integer) The ID of the company this account group belongs to.

### 1.13. Bank Balance Model (`P_BankBalance`)

The `P_BankBalance` model stores the balance for each bank account of a company.

- **`companyId`**: (Integer) The ID of the company.
- **`bankId`**: (Integer) The ID of the company's bank account.
- **`balance`**: (Integer) The current balance of the bank account.

### 1.14. Bank Ledger Model (`P_BankLedger`)

The `P_BankLedger` model is a record of all transactions for a specific bank account.

- **`companyId`**: (Integer) The ID of the company.
- **`bankId`**: (Integer) The ID of the company's bank account.
- **`receiptId`**: (Integer) The ID of the receipt associated with the transaction.
- **`paymentId`**: (Integer) The ID of the payment associated with the transaction.

### 1.15. Cashbook Model (`P_C_Cashbook`)

The `P_C_Cashbook` model is a record of all cash transactions for a company.

- **`C_paymentId`**: (Integer) The ID of the cash payment associated with the transaction.
- **`C_receiptId`**: (Integer) The ID of the cash receipt associated with the transaction.
- **`companyId`**: (Integer) The ID of the company.
- **`date`**: (DateOnly) The date of the transaction.

### 1.16. Cash Credit Note Model (`P_C_CreditNote`)

The `P_C_CreditNote` model represents a credit note for cash transactions.

- **`accountId`**: (Integer) The ID of the account.
- **`creditnoteNo`**: (Integer) The credit note number.
- **`creditdate`**: (DateOnly) The date of the credit note.
- **`LL_RR_no`**: (Integer) The LL/RR number.
- **`dispatchThrough`**: (String) The mode of dispatch.
- **`motorVehicleNo`**: (String) The motor vehicle number.
- **`destination`**: (String) The destination of the goods.
- **`mainTotal`**: (Float) The total amount of the credit note.
- **`totalQty`**: (Integer) The total quantity of items.
- **`companyId`**: (Integer) The ID of the company.
- **`createdBy`**: (Integer) The ID of the user who created the credit note.
- **`updatedBy`**: (Integer) The ID of the user who last updated the credit note.

### 1.17. Cash Credit Note Item Model (`P_C_CreditNoteItem`)

The `P_C_CreditNoteItem` model represents an item within a cash credit note.

- **`productId`**: (Integer) The ID of the product.
- **`mrp`**: (Float) The MRP of the product.
- **`qty`**: (Integer) The quantity of the product.
- **`rate`**: (Float) The rate of the product.
- **`unit`**: (String) The unit of measure for the product.

### 1.18. Daily Balance Model (`P_C_DailyBalance`)

The `P_C_DailyBalance` model stores the daily opening, debit, credit, and closing balances for a company.

- **`date`**: (DateOnly) The date for which the balance is recorded.
- **`openingBalance`**: (Decimal) The opening balance for the day.
- **`totalDebit`**: (Decimal) The total debit for the day.
- **`totalCredit`**: (Decimal) The total credit for the day.
- **`closingBalance`**: (Decimal) The closing balance for the day.
- **`companyId`**: (Integer) The ID of the company.

### 1.19. Cash Debit Note Model (`P_C_DebitNote`)

The `P_C_DebitNote` model represents a debit note for cash transactions.

- **`accountId`**: (Integer) The ID of the account.
- **`debitnoteno`**: (Integer) The debit note number.
- **`purchaseId`**: (Integer) The ID of the purchase.
- **`purchaseDate`**: (DateOnly) The date of the purchase.
- **`debitdate`**: (DateOnly) The date of the debit note.
- **`mainTotal`**: (Float) The total amount of the debit note.
- **`totalQty`**: (Integer) The total quantity of items.
- **`companyId`**: (Integer) The ID of the company.
- **`createdBy`**: (Integer) The ID of the user who created the debit note.
- **`updatedBy`**: (Integer) The ID of the user who last updated the debit note.

### 1.20. Cash Debit Note Item Model (`P_C_DebitNoteItem`)

The `P_C_DebitNoteItem` model represents an item within a cash debit note.

- **`productId`**: (Integer) The ID of the product.
- **`mrp`**: (Float) The MRP of the product.
- **`qty`**: (Integer) The quantity of the product.
- **`rate`**: (Float) The rate of the product.
- **`unit`**: (String) The unit of measure for the product.

### 1.21. Cash Ledger Model (`P_C_Ledger`)

The `P_C_Ledger` model is a record of all cash transactions for a specific account.

- **`accountId`**: (Integer) The ID of the account.
- **`companyId`**: (Integer) The ID of the company.
- **`purchaseId`**: (Integer) The ID of the purchase associated with the transaction.
- **`saleId`**: (Integer) The ID of the sale associated with the transaction.
- **`paymentId`**: (Integer) The ID of the payment associated with the transaction.
- **`receiptId`**: (Integer) The ID of the receipt associated with the transaction.
- **`debitNoId`**: (Integer) The ID of the debit note associated with the transaction.
- **`creditNoId`**: (Integer) The ID of the credit note associated with the transaction.
- **`date`**: (DateOnly) The date of the transaction.

### 1.22. Cash Order Processing Model (`P_C_orderProcessing`)

The `P_C_orderProcessing` model represents a customer order for cash transactions.

- **`accountId`**: (Integer) The ID of the account.
- **`date`**: (DateOnly) The date of the order.
- **`totalMrp`**: (Integer) The total MRP of the order.
- **`totalQty`**: (Integer) The total quantity of items in the order.
- **`createdBy`**: (Integer) The ID of the user who created the order.
- **`updatedBy`**: (Integer) The ID of the user who last updated the order.
- **`companyId`**: (Integer) The ID of the company.
- **`status`**: (Enum) The status of the order. Possible values are 'Open', 'Pending', and 'Closed'.
- **`orderProcessingNo`**: (Integer) The order processing number.

### 1.23. Cash Order Processing Item Model (`P_C_OrderProcessingItem`)

The `P_C_OrderProcessingItem` model represents an item within a cash order.

- **`productId`**: (Integer) The ID of the product.
- **`qty`**: (Integer) The quantity of the product.
- **`rate`**: (Integer) The rate of the product.
- **`mrp`**: (Integer) The MRP of the product.
- **`unit`**: (String) The unit of measure for the product.

### 1.24. Cash Payment Model (`P_C_Payment`)

The `P_C_Payment` model represents a payment made in cash.

- **`accountId`**: (Integer) The ID of the account.
- **`amount`**: (Integer) The amount of the payment.
- **`description`**: (String) A brief description of the payment.
- **`date`**: (DateOnly) The date of the payment.
- **`createdBy`**: (Integer) The ID of the user who created the payment.
- **`updatedBy`**: (Integer) The ID of the user who last updated the payment.
- **`companyId`**: (Integer) The ID of the company.
- **`paymentNo`**: (Integer) The payment number.

### 1.25. Cash Purchase Model (`P_C_purchaseCash`)

The `P_C_purchaseCash` model represents a purchase made in cash.

- **`accountId`**: (Integer) The ID of the account.
- **`date`**: (DateOnly) The date of the purchase.
- **`totalMrp`**: (Integer) The total MRP of the purchase.
- **`createdBy`**: (Integer) The ID of the user who created the purchase.
- **`updatedBy`**: (Integer) The ID of the user who last updated the purchase.
- **`companyId`**: (Integer) The ID of the company.
- **`purchaseNo`**: (Integer) The purchase number.

### 1.26. Cash Receipt Model (`P_C_Receipt`)

The `P_C_Receipt` model represents a receipt for a cash transaction.

- **`accountId`**: (Integer) The ID of the account.
- **`amount`**: (Integer) The amount of the receipt.
- **`description`**: (String) A brief description of the receipt.
- **`date`**: (DateOnly) The date of the receipt.
- **`createdBy`**: (Integer) The ID of the user who created the receipt.
- **`updatedBy`**: (Integer) The ID of the user who last updated the receipt.
- **`companyId`**: (Integer) The ID of the company.
- **`receiptNo`**: (Integer) The receipt number.
- **`isActive`**: (Boolean) Whether the receipt is active or not.

### 1.27. Cash Sales Invoice Model (`P_C_salesInvoice`)

The `P_C_salesInvoice` model represents a sales invoice for a cash transaction.

- **`accountId`**: (Integer) The ID of the account.
- **`date`**: (DateOnly) The date of the sales invoice.
- **`totalMrp`**: (Integer) The total MRP of the sales invoice.
- **`createdBy`**: (Integer) The ID of the user who created the sales invoice.
- **`updatedBy`**: (Integer) The ID of the user who last updated the sales invoice.
- **`companyId`**: (Integer) The ID of the company.
- **`saleNo`**: (Integer) The sales invoice number.

### 1.28. Wallet Ledger Model (`P_C_WalletLedger`)

The `P_C_WalletLedger` model is a record of all wallet transactions for a user.

- **`paymentId`**: (Integer) The ID of the payment associated with the transaction.
- **`receiptId`**: (Integer) The ID of the receipt associated with the transaction.
- **`claimId`**: (Integer) The ID of the claim associated with the transaction.
- **`companyId`**: (Integer) The ID of the company.
- **`userId`**: (Integer) The ID of the user.
- **`date`**: (DateOnly) The date of the transaction.
- **`isApprove`**: (Boolean) Whether the transaction is approved or not.
- **`approveDate`**: (DateOnly) The date of the approval.

### 1.29. Claim Model (`P_C_claim`)

The `P_C_claim` model represents a claim made by one user to another.

- **`fromUserId`**: (Integer) The ID of the user who made the claim.
- **`toUserId`**: (Integer) The ID of the user who received the claim.
- **`amount`**: (Integer) The amount of the claim.
- **`description`**: (String) A brief description of the claim.
- **`isApproved`**: (Boolean) Whether the claim is approved or not.
- **`purposeId`**: (Integer) The ID of the purpose of the claim.
- **`companyId`**: (Integer) The ID of the company.
- **`date`**: (DateOnly) The date of the claim.

### 1.30. Claim Ledger Model (`P_C_claimLedger`)

The `P_C_claimLedger` model is a record of all claim transactions.

- **`receiveId`**: (Integer) The ID of the receive cash associated with the transaction.
- **`claimId`**: (Integer) The ID of the claim associated with the transaction.
- **`userId`**: (Integer) The ID of the user.
- **`date`**: (DateOnly) The date of the transaction.
- **`companyId`**: (Integer) The ID of the company.

### 1.31. Company Balance Model (`P_C_companyBalance`)

The `P_C_companyBalance` model stores the cash balance for a company.

- **`companyId`**: (Integer) The ID of the company.
- **`balance`**: (Integer) The cash balance of the company.

### 1.32. Self Expense Model (`P_C_SelfExpense`)

The `P_C_SelfExpense` model represents a self-expense record for a user.

- **`date`**: (DateOnly) The date of the expense.
- **`amount`**: (Integer) The amount of the expense.
- **`description`**: (String) A brief description of the expense.
- **`userId`**: (Integer) The ID of the user.
- **`companyId`**: (Integer) The ID of the company.
- **`paymentId`**: (Integer) The ID of the payment associated with the expense.

### 1.33. User Balance Model (`P_C_userBalance`)

The `P_C_userBalance` model stores the balance and income for a user in a company.

- **`userId`**: (Integer) The ID of the user.
- **`companyId`**: (Integer) The ID of the company.
- **`balance`**: (Integer) The user's balance.
- **`incomes`**: (Integer) The user's income.

### 1.34. Item Category Model (`P_ItemCategory`)

The `P_ItemCategory` model represents a category for items.

- **`name`**: (String) The name of the item category.
- **`itemGroupId`**: (Integer) The ID of the item group this category belongs to.
- **`updatedBy`**: (Integer) The ID of the user who last updated the category.
- **`createdBy`**: (Integer) The ID of the user who created the category.
- **`companyId`**: (Integer) The ID of the company this category belongs to.

### 1.35. Item Group Model (`P_ItemGroup`)

The `P_ItemGroup` model is used to group item categories together.

- **`name`**: (String) The name of the item group.
- **`companyId`**: (Integer) The ID of the company this item group belongs to.
- **`updatedBy`**: (Integer) The ID of the user who last updated the group.
- **`createdBy`**: (Integer) The ID of the user who created the group.

### 1.36. Item Sub-Category Model (`P_ItemSubCategory`)

The `P_ItemSubCategory` model represents a sub-category for items.

- **`name`**: (String) The name of the item sub-category.
- **`itemCategoryId`**: (Integer) The ID of the item category this sub-category belongs to.
- **`updatedBy`**: (Integer) The ID of the user who last updated the sub-category.
- **`createdBy`**: (Integer) The ID of the user who created the sub-category.
- **`companyId`**: (Integer) The ID of the company this sub-category belongs to.

### 1.37. Ledger Model (`P_Ledger`)

The `P_Ledger` model is a record of all financial transactions for a specific account.

- **`accountId`**: (Integer) The ID of the account.
- **`companyId`**: (Integer) The ID of the company.
- **`purchaseInvId`**: (Integer) The ID of the purchase invoice associated with the transaction.
- **`saleInvId`**: (Integer) The ID of the sales invoice associated with the transaction.
- **`paymentId`**: (Integer) The ID of the payment associated with the transaction.
- **`receiptId`**: (Integer) The ID of the receipt associated with the transaction.
- **`debitNoId`**: (Integer) The ID of the debit note associated with the transaction.
- **`creditNoId`**: (Integer) The ID of the credit note associated with the transaction.
- **`date`**: (DateOnly) The date of the transaction.

### 1.38. Maintenance/Maintenance Type Junction Model (`P_MMaintenanceType`)

The `P_MMaintenanceType` model is a junction table that links the `P_Maintenance` and `P_MaintenanceType` models.

- **`maintenanceId`**: (Integer) The ID of the maintenance record.
- **`maintenanceTypeId`**: (Integer) The ID of the maintenance type.

### 1.39. Machine Model (`P_Machine`)

The `P_Machine` model represents a machine.

- **`name`**: (String) The name of the machine.
- **`machineNo`**: (Integer) The machine number.
- **`description`**: (Text) A description of the machine.
- **`companyId`**: (Integer) The ID of the company this machine belongs to.

### 1.40. Maintenance Model (`P_Maintenance`)

The `P_Maintenance` model represents a maintenance record for a machine.

- **`machineId`**: (Integer) The ID of the machine.
- **`date`**: (DateOnly) The date of the maintenance.
- **`type`**: (Enum) The type of the maintenance. Possible values are defined in the `MACHINE_SCHEDULE_TYPE` constant.
- **`updatedBy`**: (Integer) The ID of the user who last updated the maintenance record.
- **`createdBy`**: (Integer) The ID of the user who created the maintenance record.
- **`companyId`**: (Integer) The ID of the company this maintenance record belongs to.

### 1.41. Maintenance Item Model (`P_MaintenanceItem`)

The `P_MaintenanceItem` model represents an item used in a maintenance record.

- **`productId`**: (Integer) The ID of the product.
- **`qty`**: (Integer) The quantity of the product.

### 1.42. Maintenance Type Model (`P_MaintenanceType`)

The `P_MaintenanceType` model represents a type of maintenance.

- **`name`**: (String) The name of the maintenance type.
- **`updatedBy`**: (Integer) The ID of the user who last updated the maintenance type.
- **`createdBy`**: (Integer) The ID of the user who created the maintenance type.
- **`companyId`**: (Integer) The ID of the company this maintenance type belongs to.

### 1.43. Payment Model (`P_Payment`)

The `P_Payment` model represents a payment made.

- **`voucherno`**: (Integer) The voucher number.
- **`bankAccountId`**: (Integer) The ID of the bank account.
- **`paymentdate`**: (DateOnly) The date of the payment.
- **`mode`**: (Enum) The mode of payment. Possible values are 'Cheque', 'Net Banking', 'Cash', 'UPI', 'IMPS', 'NEFT', 'RTGS', 'Debit card', 'Credit card', 'Other'.
- **`accountId`**: (Integer) The ID of the account.
- **`amount`**: (Integer) The amount of the payment.
- **`createdBy`**: (Integer) The ID of the user who created the payment.
- **`updatedBy`**: (Integer) The ID of the user who last updated the payment.
- **`companyId`**: (Integer) The ID of the company.
- **`paymentType`**: (Enum) The type of the payment. Possible values are defined in the `PAYMENT_TYPE` constant.
- **`transactionType`**: (Enum) The type of the transaction. Possible values are defined in the `TRANSACTION_TYPE` constant.

### 1.44. Pro-Forma Invoice Model (`P_ProFormaInvoice`)

The `P_ProFormaInvoice` model represents a pro-forma invoice.

- **`ProFormaInvoice_no`**: (String) The pro-forma invoice number.
- **`date`**: (DateOnly) The date of the invoice.
- **`validtill`**: (DateOnly) The date the invoice is valid until.
- **`accountId`**: (Integer) The ID of the account.
- **`termsOfDelivery`**: (String) The terms of delivery.
- **`dispatchThrough`**: (String) The mode of dispatch.
- **`destination`**: (String) The destination of the goods.
- **`LL_RR_no`**: (Integer) The LL/RR number.
- **`motorVehicleNo`**: (String) The motor vehicle number.
- **`dispatchno`**: (Integer) The dispatch number.
- **`terms`**: (Enum) The payment terms. Possible values are 'Advance', 'Immediate', and 'Terms'.
- **`totalIgst`**: (Float) The total IGST amount.
- **`totalSgst`**: (Float) The total SGST amount.
- **`totalMrp`**: (Float) The total MRP amount.
- **`mainTotal`**: (Float) The total amount of the invoice.
- **`totalQty`**: (Integer) The total quantity of items.
- **`createdBy`**: (Integer) The ID of the user who created the invoice.
- **`updatedBy`**: (Integer) The ID of the user who last updated the invoice.
- **`companyId`**: (Integer) The ID of the company.

### 1.45. Pro-Forma Invoice Item Model (`P_ProFormaInvoiceItem`)

The `P_ProFormaInvoiceItem` model represents an item within a pro-forma invoice.

- **`rate`**: (Float) The rate of the product.
- **`qty`**: (Integer) The quantity of the product.
- **`productId`**: (Integer) The ID of the product.
- **`unit`**: (String) The unit of measure for the product.
- **`mrp`**: (Float) The MRP of the product.

### 1.46. Purchase Order Model (`P_PurchaseOrder`)

The `P_PurchaseOrder` model represents a purchase order.

- **`purchaseOrder_no`**: (String) The purchase order number.
- **`date`**: (DateOnly) The date of the order.
- **`validtill`**: (DateOnly) The date the order is valid until.
- **`accountId`**: (Integer) The ID of the account.
- **`termsOfDelivery`**: (String) The terms of delivery.
- **`dispatchThrough`**: (String) The mode of dispatch.
- **`destination`**: (String) The destination of the goods.
- **`LL_RR_no`**: (Integer) The LL/RR number.
- **`motorVehicleNo`**: (String) The motor vehicle number.
- **`dispatchno`**: (Integer) The dispatch number.
- **`terms`**: (Enum) The payment terms. Possible values are 'Advance', 'Immediate', and 'Terms'.
- **`totalIgst`**: (Float) The total IGST amount.
- **`totalSgst`**: (Float) The total SGST amount.
- **`totalMrp`**: (Float) The total MRP amount.
- **`mainTotal`**: (Float) The total amount of the order.
- **`totalQty`**: (Integer) The total quantity of items.
- **`createdBy`**: (Integer) The ID of the user who created the order.
- **`updatedBy`**: (Integer) The ID of the user who last updated the order.
- **`companyId`**: (Integer) The ID of the company.

### 1.47. Purchase Order Item Model (`P_PurchaseOrderItem`)

The `P_PurchaseOrderItem` model represents an item within a purchase order.

- **`productId`**: (Integer) The ID of the product.
- **`qty`**: (Integer) The quantity of the product.
- **`rate`**: (Integer) The rate of the product.
- **`mrp`**: (Integer) The MRP of the product.
- **`unit`**: (String) The unit of measure for the product.
- **`purchaseOrderId`**: (Integer) The ID of the purchase order this item belongs to.

### 1.48. Purchase Invoice Model (`P_purchaseInvoice`)

The `P_purchaseInvoice` model represents a purchase invoice.

- **`accountId`**: (Integer) The ID of the account.
- **`supplyInvoiceNo`**: (String) The supplier's invoice number.
- **`voucherno`**: (Integer) The voucher number.
- **`invoicedate`**: (DateOnly) The date of the invoice.
- **`duedate`**: (DateOnly) The due date of the invoice.
- **`totalIgst`**: (Float) The total IGST amount.
- **`totalSgst`**: (Float) The total SGST amount.
- **`totalMrp`**: (Float) The total MRP of the invoice.
- **`mainTotal`**: (Float) The total amount of the invoice.
- **`totalQty`**: (Integer) The total quantity of items.
- **`createdBy`**: (Integer) The ID of the user who created the invoice.
- **`updatedBy`**: (Integer) The ID of the user who last updated the invoice.
- **`companyId`**: (Integer) The ID of the company this invoice belongs to.

### 1.49. Purpose Model (`P_C_Purpose`)

The `P_C_Purpose` model represents the purpose of a claim.

- **`name`**: (String) The name of the purpose.
- **`companyId`**: (Integer) The ID of the company.
- **`updatedBy`**: (Integer) The ID of the user who last updated the purpose.
- **`createdBy`**: (Integer) The ID of the user who created the purpose.

### 1.50. Receipt Model (`P_Receipt`)

The `P_Receipt` model represents a receipt.

- **`voucherno`**: (Integer) The voucher number.
- **`bankAccountId`**: (Integer) The ID of the bank account.
- **`paymentdate`**: (DateOnly) The date of the receipt.
- **`mode`**: (Enum) The mode of payment. Possible values are 'Cheque', 'Net Banking', 'UPI', 'IMPS', 'NEFT', 'RTGS', 'Debit card', 'Credit card', 'Other'.
- **`accountId`**: (Integer) The ID of the account.
- **`amount`**: (Integer) The amount of the receipt.
- **`createdBy`**: (Integer) The ID of the user who created the receipt.
- **`updatedBy`**: (Integer) The ID of the user who last updated the receipt.
- **`companyId`**: (Integer) The ID of the company.
- **`paymentType`**: (Enum) The type of the payment. Possible values are defined in the `PAYMENT_TYPE` constant.
- **`transactionType`**: (Enum) The type of the transaction. Possible values are defined in the `TRANSACTION_TYPE` constant.

### 1.51. Wastage Model (`P_Wastage`)

The `P_Wastage` model represents a wastage record.

- **`name`**: (String) The name of the wastage.
- **`updatedBy`**: (Integer) The ID of the user who last updated the wastage record.
- **`createdBy`**: (Integer) The ID of the user who created the wastage record.
- **`companyId`**: (Integer) The ID of the company this wastage record belongs to.

### 1.52. Admin Token Model (`P_adminToken`)

The `P_adminToken` model stores authentication tokens for administrators.

- **`token`**: (Text) The authentication token.
- **`userId`**: (Integer) The ID of the user associated with the token.
- **`employeeId`**: (Integer) The ID of the employee associated with the token.

### 1.53. Attendance Model (`P_attendance`)

The `P_attendance` model records the attendance of employees.

- **`companyId`**: (Integer) The ID of the company.
- **`employeeId`**: (Integer) The ID of the employee.
- **`leaveId`**: (Integer) The ID of the leave, if applicable.
- **`date`**: (DateOnly) The date of the attendance record.
- **`status`**: (Enum) The attendance status. Possible values are 'Present' and 'Absent'.
- **`inTime`**: (Date) The time the employee clocked in.
- **`outTime`**: (Date) The time the employee clocked out.
- **`breakStart`**: (Date) The time the employee started their break.
- **`breakEnd`**: (Date) The time the employee ended their break.
- **`latePunch`**: (Boolean) Whether the employee clocked in late.
- **`overtimeHours`**: (Decimal) The number of overtime hours worked.
- **`workingHours`**: (Decimal) The total number of hours worked.
- **`approvedBy`**: (Integer) The ID of the user who approved the attendance record.
- **`approvedDate`**: (Date) The date the attendance record was approved.
- **`attendanceTypeId`**: (Integer) The ID of the attendance type.

### 1.54. Attendance Type Model (`P_attendance_type`)

The `P_attendance_type` model defines different types of attendance.

- **`companyId`**: (Integer) The ID of the company.
- **`code`**: (String) The code for the attendance type (e.g., 'P', 'M', 'BM'.
- **`description`**: (String) A description of the attendance type.
- **`salaryPerDay`**: (Decimal) The salary per day for this attendance type.

### 1.55. Bonus Configuration Model (`P_bonusConfiguration`)

The `P_bonusConfiguration` model stores the bonus configuration for a company.

- **`companyId`**: (Integer) The ID of the company.
- **`month`**: (String) The month for which the bonus is configured.
- **`duty0To50`**: (Integer) The bonus for 0-50% duty.
- **`duty51To75`**: (Integer) The bonus for 51-75% duty.
- **`duty76To90`**: (Integer) The bonus for 76-90% duty.
- **`duty91To100`**: (Integer) The bonus for 91-100% duty.
- **`dutyAbove100`**: (Integer) The bonus for duty above 100%.
- **`workingDays`**: (Integer) The number of working days in the month.

### 1.56. Employee Model (`P_employee`)

The `P_employee` model represents an employee in the system.

- **`companyId`**: (Integer) The ID of the company.
- **`firstName`**: (String) The first name of the employee.
- **`lastName`**: (String) The last name of the employee.
- **`email`**: (String) The email of the employee.
- **`password`**: (String) The hashed password of the employee.
- **`phoneNumber`**: (String) The phone number of the employee.
- **`address`**: (Text) The address of the employee.
- **`dob`**: (DateOnly) The date of birth of the employee.
- **`panNumber`**: (String) The PAN number of the employee.
- **`aadharNumber`**: (String) The Aadhar number of the employee.
- **`profilePicture`**: (Text) The URL of the employee's profile picture.
- **`bonus`**: (Decimal) The employee's bonus.
- **`overtime`**: (Decimal) The employee's overtime pay.
- **`shiftId`**: (Integer) The ID of the employee's shift.
- **`role`**: (String) The role of the employee.
- **`salaryPerDay`**: (Decimal) The employee's salary per day.
- **`hireDate`**: (DateOnly) The date the employee was hired.
- **`emergencyLeaves`**: (Integer) The number of emergency leaves the employee has.
- **`personalLeaves`**: (Integer) The number of personal leaves the employee has.
- **`referredBy`**: (Integer) The ID of the employee who referred this employee.
- **`isActive`**: (Boolean) Whether the employee is currently active.

### 1.57. Leave Model (`P_leave`)

The `P_leave` model represents a leave request from an employee.

- **`employeeId`**: (Integer) The ID of the employee.
- **`date`**: (DateOnly) The date of the leave.
- **`leaveType`**: (Enum) The type of leave. Possible values are 'Personal Leave' and 'Emergency Leave'.
- **`leaveDuration`**: (Enum) The duration of the leave. Possible values are 'First Half', 'Second Half', and 'Full Day'.
- **`reason`**: (Text) The reason for the leave.
- **`status`**: (Enum) The status of the leave request. Possible values are 'Pending', 'Approved', and 'Rejected'.
- **`approvedBy`**: (Integer) The ID of the user who approved the leave request.
- **`approvedDate`**: (Date) The date the leave request was approved.

### 1.58. Penalty Configuration Model (`P_penaltyConfiguration`)

The `P_penaltyConfiguration` model stores the penalty configuration for a company.

- **`companyId`**: (Integer) The ID of the company.
- **`type`**: (String) The type of penalty.
- **`firstPenalty`**: (Integer) The amount of the first penalty.
- **`secondPenalty`**: (Integer) The amount of the second penalty.
- **`thirdPenalty`**: (Integer) The amount of the third penalty.
- **`fourthPenalty`**: (Integer) The amount of the fourth penalty.
- **`fifthPenalty`**: (Integer) The amount of the fifth penalty.

### 1.59. Shift Model (`P_shift`)

The `P_shift` model represents a work shift.

- **`companyId`**: (Integer) The ID of the company.
- **`shiftName`**: (String) The name of the shift.
- **`shiftStartTime`**: (String) The start time of the shift.
- **`shiftEndTime`**: (String) The end time of the shift.
- **`breakStartTime`**: (String) The start time of the break.
- **`breakEndTime`**: (String) The end time of the break.
- **`maxOvertimeHours`**: (Integer) The maximum number of overtime hours allowed.

### 1.60. Product Model (`P_product`)

The `P_product` model represents a product or service.

- **`itemtype`**: (Enum) The type of item. Possible values are 'Product' and 'Service'.
- **`productname`**: (String) The name of the product.
- **`description`**: (String) A description of the product.
- **`itemGroupId`**: (Integer) The ID of the item group this product belongs to.
- **`itemCategoryId`**: (Integer) The ID of the item category this product belongs to.
- **`itemSubCategoryId`**: (Integer) The ID of the item sub-category this product belongs to.
- **`unit`**: (String) The unit of measure for the product.
- **`openingstock`**: (Boolean) Whether to track opening stock.
- **`nagativeqty`**: (Boolean) Whether to allow negative quantities.
- **`lowstock`**: (Boolean) Whether to track low stock.
- **`lowStockQty`**: (Integer) The low stock quantity threshold.
- **`purchaseprice`**: (Integer) The purchase price of the product.
- **`salesprice`**: (Integer) The sales price of the product.
- **`gstrate`**: (Integer) The GST rate for the product.
- **`HSNcode`**: (Integer) The HSN code for the product.
- **`cess`**: (Boolean) Whether cess is applicable.
- **`wastage`**: (Boolean) Whether the product is considered wastage.
- **`raw_material`**: (Boolean) Whether the product is a raw material.
- **`spare`**: (Boolean) Whether the product is a spare part.
- **`companyId`**: (Integer) The ID of the company this product belongs to.
- **`weight`**: (Float) The weight of the product.
- **`isActive`**: (Boolean) Whether the product is active.
- **`updatedBy`**: (Integer) The ID of the user who last updated the product.
- **`createdBy`**: (Integer) The ID of the user who created the product.

### 1.61. Stock Model (`P_stock`)

The `P_stock` model represents the stock of a product.

- **`productId`**: (Integer) The ID of the product.
- **`qty`**: (Decimal) The quantity of the product in stock.
- **`updatedBy`**: (Integer) The ID of the user who last updated the stock.

## 2. API Routes

### 2.1. User Routes (`/`)

- **`POST /create_user`**: Creates a new user.
- **`GET /get_all_user`**: Retrieves a list of all users.
- **`GET /get_all_company_user`**: Retrieves a list of all company users.
- **`GET /view_user/:id`**: Retrieves a specific user by their ID.
- **`DELETE /delete_user/:id`**: Deletes a user by their ID.
- **`PUT /update_user/:id`**: Updates a user's information by their ID.
- **`POST /user_login`**: Logs a user in.
- **`POST /reset_password/:id`**: Resets a user's password.
- **`POST /user_logout`**: Logs a user out.
- **`POST /check_user`**: Checks if a user exists.
- **`GET /add_user/:id`**: Adds a user to a company.
- **`GET /view_all_userTOComapny`**: Views all users in a company.
- **`DELETE /remove_company/:id`**: Removes a user from a company.
- **`POST /add_user_bank_account`**: Adds a bank account for a user.
- **`PUT /edit_user_bank_account/:accountId`**: Edits a user's bank account.
- **`DELETE /delete_user_bank_account/:accountId`**: Deletes a user's bank account.
- **`GET /view_user_bank_account/:accountId`**: Views a user's bank account.
- **`GET /view_all_user_bank_account/:userId`**: Views all bank accounts for a user.
- **`GET /wallet_approve/:id`**: Approves a user's wallet.
- **`GET /view_user_balance`**: Views a user's balance.

### 2.2. Pro-forma Invoice Routes (`/profromainvoice`)

- Routes for managing pro-forma invoices.

### 2.3. Debit Note Routes (`/debitnote`)

- Routes for managing debit notes.

### 2.4. Sales Invoice Routes (`/salesinvoice`)

- Routes for managing sales invoices.

### 2.5. Delivery Challan Routes (`/deliverychallan`)

- Routes for managing delivery challans.

### 2.6. Payment Routes (`/payment`)

- Routes for managing payments.

### 2.7. Item Routes (`/item`)

- Routes for managing items.

### 2.8. Purchase Order Routes (`/purchaseOrder`)

- Routes for managing purchase orders.

### 2.9. Purchase Invoice Routes (`/purchaseinvoice`)

This module handles the creation and management of purchase invoices, with separate functionalities for standard and cash-based transactions.

#### Standard Purchase Invoice

- **`POST /create_purchaseInvoice`**: Creates a new purchase invoice with tax details.
- **`PUT /update_purchaseInvoice/:id`**: Updates an existing purchase invoice.
- **`GET /get_all_purchaseInvoice`**: Retrieves all purchase invoices for the company.
- **`GET /view_purchaseInvoice/:id`**: Retrieves a single purchase invoice by its ID.
- **`DELETE /delete_purchaseInvoice/:id`**: Deletes a purchase invoice.
- **`GET /purchaseInvoice_pdf/:id`**: Generates a PDF of a specific purchase invoice.
- **`GET /purchaseInvoice_jpg/:id`**: Generates a JPG image of a specific purchase invoice.
- **`GET /purchaseInvoice_html/:id`**: Generates an HTML representation of a specific purchase invoice.
- **`GET /purchaseInvoice_excel/:id`**: Generates an Excel file for a single purchase invoice.
- **`GET /get_all_purchaseInvoice_excel`**: Generates an Excel file for a range of purchase invoices based on a date range.

#### Cash Purchase Invoice (Type C)

- **`POST /C_create_purchaseCash`**: Creates a new purchase invoice for cash transactions (no tax).
- **`PUT /C_update_purchaseCash/:id`**: Updates an existing cash purchase invoice.
- **`GET /C_get_all_purchaseCash`**: Retrieves all cash purchase invoices for the company.
- **`GET /C_view_purchaseCash/:id`**: Retrieves a single cash purchase invoice by its ID.
- **`DELETE /C_delete_purchaseCash/:id`**: Deletes a cash purchase invoice.
- **`GET /C_view_purchaseCash_pdf/:id`**: Generates a PDF of a specific cash purchase invoice.
- **`GET /C_view_purchaseCash_jpg/:id`**: Generates a JPG image of a specific cash purchase invoice.
- **`GET /C_purchaseCash_html/:id`**: Generates an HTML representation of a specific cash purchase invoice.
- **`GET /C_purchaseInvoice_excel/:id`**: Generates an Excel file for a single cash purchase invoice.
- **`GET /C_purchaseinvoice_all_excel`**: Generates an Excel file for a range of cash purchase invoices based on a date range.

### 2.10. Permission Routes (`/permission`)

This set of routes is used to manage user permissions.

- **`GET /`**: Retrieves a list of all permissions, grouped by role and resource.
- **`PUT /`**: Updates one or more permissions. Expects an array of permission objects in the request body, each with an `id` and a `permissionValue`.

### 2.11. Company Routes (`/company`)

This set of routes handles the management of companies.

- **`POST /create_company`**: Creates a new company. It initializes the company with default permissions, user balances, and other related data.
- **`PUT /update_company/:id`**: Updates an existing company's information.
- **`DELETE /delete_company/:id`**: Deletes a company. It prevents the deletion of a company that is currently set as the user's default.
- **`GET /get_all_company`**: Retrieves a list of all companies.
- **`GET /view_single_company/:id`**: Retrieves a single company by its ID, including its bank details.
- **`GET /set_default_comapny/:id`**: Sets a company as the user's default company. This updates the user's authentication token.
- **`GET /view_company_balance`**: Retrieves the balance of the current company.
- **`GET /view_company_cash_balance`**: Retrieves the cash balance of the current company.

### 2.12. Credit Note Routes (`/creditnote`)

This module handles the creation and management of credit notes, with separate functionalities for standard and cash-based transactions.

#### Standard Credit Note

- **`POST /create_creditNote`**: Creates a new credit note with tax details.
- **`PUT /update_creditNote/:id`**: Updates an existing credit note.
- **`GET /get_all_creditNote`**: Retrieves all credit notes for the company.
- **`GET /view_single_creditNote/:id`**: Retrieves a single credit note by its ID.
- **`DELETE /delete_creditNote/:id`**: Deletes a credit note.
- **`GET /creditNote_pdf/:id`**: Generates a PDF of a specific credit note.
- **`GET /creditNote_jpg/:id`**: Generates a JPG image of a specific credit note.
- **`GET /creditNote_html/:id`**: Generates an HTML representation of a specific credit note.
- **`GET /creditNote_single_excel/:id`**: Generates an Excel file for a single credit note.
- **`GET /creditNote_excel`**: Generates an Excel file for a range of credit notes based on a date range.

#### Cash Credit Note (Type C)

- **`POST /C_create_creditNote`**: Creates a new credit note for cash transactions (no tax).
- **`PUT /C_update_creditNote/:id`**: Updates an existing cash credit note.
- **`GET /C_get_all_creditNote`**: Retrieves all cash credit notes for the company.
- **`GET /C_view_single_creditNote/:id`**: Retrieves a single cash credit note by its ID.
- **`DELETE /C_delete_creditNote/:id`**: Deletes a cash credit note.
- **`GET /C_creditNote_pdf/:id`**: Generates a PDF of a specific cash credit note.
- **`GET /C_creditNote_jpg/:id`**: Generates a JPG image of a specific cash credit note.
- **`GET /C_creditNote_html/:id`**: Generates an HTML representation of a specific cash credit note.
- **`GET /C_creditNote_single_excel/:id`**: Generates an Excel file for a single cash credit note.
- **`GET /C_creditNote_excel`**: Generates an Excel file for a range of cash credit notes based on a date range.

### 2.13. Receipt Routes (`/receipt`)

This module manages the recording of receipts, distinguishing between cash and bank transactions.

#### Cash Receipts (Type C)

- **`POST /C_create_receiveCash`**: Records a cash receipt, updating daily and overall cash balances and creating ledger entries.
- **`GET /C_get_all_receiveCash`**: Retrieves all cash receipts for the current company.
- **`GET /C_view_receiveCash/:id`**: Retrieves a specific cash receipt by its ID.
- **`PUT /C_update_receiveCash/:id`**: Updates an existing cash receipt, recalculating balances and ledger entries.
- **`DELETE /C_delete_receiveCash/:id`**: Permanently deletes a cash receipt and reverses all associated financial entries.
- **`DELETE /C_soft_delete_receiveCash/:id`**: Marks a cash receipt as inactive without affecting financial records.

#### Bank/Cash Receipts (Standard)

- **`POST /create_receive_bank`**: Records a receipt for both bank and cash transactions, updating the relevant balances and creating ledger entries.
- **`PUT /update_receive_bank/:id`**: Updates a bank or cash receipt, adjusting balances and ledger entries accordingly.
- **`DELETE /delete_receive_bank/:id`**: Deletes a bank or cash receipt and reverses the corresponding financial transactions.
- **`GET /view_receive_bank/:id`**: Retrieves a single bank or cash receipt by its ID.
- **`GET /get_all_receive_bank`**: Retrieves all bank and cash receipts for the current company.

### 2.14. Claim Routes (`/claim`)

This module handles the creation, management, and approval of claims between users within a company.

- **`POST /create_claim`**: Creates a new claim from one user to another.
- **`PUT /update_claim/:id`**: Updates an existing claim.
- **`DELETE /delete_claim/:id`**: Deletes a claim.
- **`GET /view_myclaim`**: Retrieves all claims created by the current user.
- **`GET /view_reciveclaim`**: Retrieves all claims received by the current user.
- **`POST /isapproved_claim/:id`**: Approves or rejects a claim, adjusting user balances accordingly.
- **`GET /view_single_claim/:id`**: Retrieves a single claim by its ID.
- **`GET /get_all_ClaimUser`**: Retrieves a list of all users within the company that the current user can make a claim to.
- **`GET /view_wallet`**: Retrieves the current user's wallet information, including their balance.
- **`GET /view_all_wallet/:id`**: Retrieves the complete wallet history for a specific user, including all transactions and a closing balance.
- **`GET /view_balance`**: Retrieves the company's overall balance, including cash on hand, bank balance, and the sum of all user balances.

### 2.15. Company Bank Routes (`/companybank`)

This set of routes is used to manage the bank details associated with a company.

- **`POST /create_company_bankDetails`**: Creates a new bank account for a company. It also initializes a corresponding bank balance record.
- **`PUT /update_company_bankDetails/:id`**: Updates the details of an existing company bank account.
- **`DELETE /delete_company_bankDetails/:id`**: Deletes a company bank account.
- **`GET /view_company_bankDetails/:id`**: Retrieves the details of a specific company bank account.
- **`GET /view_all_company_bankDetails`**: Retrieves all bank accounts associated with the current company.

### 2.16. BOM Routes (`/bom`)

This module manages the Bill of Materials (BOM) for production.

- **`POST /create_bom`**: Creates a new BOM, deducting the required raw material stock and adding to the finished product stock.
- **`PUT /update_bom/:bomId`**: Updates an existing BOM, adjusting stock levels accordingly.
- **`GET /view_all_bom`**: Retrieves all BOMs for the company.
- **`GET /view_bom/:bomId`**: Retrieves a single BOM by its ID.
- **`DELETE /delete_bom/:bomId`**: Deletes a BOM and reverses the stock adjustments.
- **`DELETE /settlement_delete_bom/:bomId`**: Deletes a BOM without adjusting stock levels.

### 2.17. Stock Routes (`/stock`)

This module provides an overview of the current stock levels for all items.

- **`GET /view_all_item_stock`**: Retrieves a list of all items in stock, with optional filters for item group, category, sub-category, and a search term.
- **`GET /view_item_stock/:id`**: Retrieves the stock information for a single item by its ID.
- **`PUT /update_item_stock/:id`**: Updates the quantity of a specific stock item.

### 2.18. Notification Routes (`/notification`)

This module handles the retrieval of notifications for the current user and company.

- **`GET /view_all_notification`**: Retrieves all notifications for the current user's company. An optional query parameter `isFront` can be set to `true` to limit the results to the latest 5 notifications.

### 2.19. Salary Routes (`/salary`)

This module manages employee salaries and payments.

- **`GET /view_all_salary`**: Retrieves a list of all salaries for the company, grouped by month.
- **`POST /add_salary_payment/:salaryId`**: Adds a new salary payment for a specific salary.
- **`PUT /edit_salary_payment/:salaryPaymentId`**: Edits an existing salary payment.
- **`DELETE /delete_salary_payment/:salaryPaymentId`**: Deletes a salary payment.
- **`GET /view_all_salary_payment/:salaryId`**: Retrieves a list of all salary payments for a specific salary.
- **`GET /employee`**: Retrieves the details of the currently logged-in employee.

### 2.20. Machine Routes (`/machine`)

- Routes for managing machines.

### 2.21. Dashboard Routes (`/dashboard`)

- Routes for the main dashboard.

### 2.22. Item Group Routes (`/itemGroup`)

- Routes for managing item groups.

### 2.23. Item Category Routes (`/itemCategory`)

- Routes for managing item categories.

### 2.24. Item Sub-Category Routes (`/itemSubCategory`)

- Routes for managing item sub-categories.

### 2.25. Account Routes (`/account`)

- Routes for managing accounts.

### 2.26. Ledger Routes (`/ledger`)

- Routes for managing ledgers.

### 2.27. Machine Schedule Routes (`/schedule`)

- Routes for managing machine schedules.

### 2.28. Wastage Routes (`/wastage`)

- Routes for managing wastage.

### 2.29. Spare Part Routes (`/sparepart`)

- Routes for managing spare parts.

### 2.30. Maintenance Type Routes (`/maintenanceType`)

- Routes for managing maintenance types.

### 2.31. Purpose Routes (`/purpose`)

- Routes for managing purposes.

### 2.32. Maintenance Routes (`/maintenance`)

- Routes for managing maintenance records.

### 2.33. Shift Routes (`/shift`)

- Routes for managing shifts.

### 2.34. Bonus Configuration Routes (`/bonusConfiguration`)

- Routes for managing bonus configurations.

### 2.35. Penalty Configuration Routes (`/penaltyConfiguration`)

- Routes for managing penalty configurations.

### 2.36. Employee Routes (`/employee`)

- Routes for managing employees.

### 2.37. Leave Routes (`/leave`)

- Routes for managing leaves.

### 2.38. Attendance Routes (`/attendance`)

- Routes for managing attendance.

### 2.39. Attendance Type Routes (`/attendanceType`)

- Routes for managing attendance types.

### 2.40. System Settings Routes (`/systemSettings`)

- Routes for managing system settings.

### 2.41. Holiday Routes (`/holiday`)

- Routes for managing holidays.

### 2.42. Order Processing Routes (`/orderProcessing`)

This set of routes handles the creation, updating, and retrieval of customer orders.

- **`POST /`**: Creates a new order. Requires a valid `orderProcessingNo`, `accountId`, `date`, `totalMrp`, `totalQty`, and an array of `items` in the request body.
- **`PUT /:id`**: Updates an existing order. Requires a valid `orderProcessingNo`, `accountId`, `date`, `totalMrp`, `totalQty`, and an array of `items` in the request body.
- **`GET /`**: Retrieves a list of all orders for the company.
- **`GET /:id`**: Retrieves a specific order by its ID.
- **`PUT /status/:id`**: Updates the status of an order. The `status` can be one of 'Open', 'Pending', or 'Closed'.
- **`DELETE /:id`**: Deletes an order by its ID.
- **`GET /items`**: Retrieves a list of all items with their current stock, ordered quantity, and available quantity after order.

### 2.43. Self Expense Routes (`/selfExpense`)

- Routes for managing self expenses.