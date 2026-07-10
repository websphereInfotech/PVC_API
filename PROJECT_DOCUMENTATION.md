# PVC_API Project Documentation

Last reviewed: 2026-07-05

This file is the primary project reference. Before making code changes, read this document first, then update it immediately when behavior, structure, routes, configuration, models, or dependencies change.

## Recent Updates

- 2026-07-10: Re-enabled backend login reCAPTCHA verification. `POST /admin/user_login` now requires and verifies `recaptchaToken` when `RECAPTCHA_SECRET_KEY` is configured, matching the frontend login form behavior gated by `REACT_APP_RECAPTCHA_SITE_KEY`.
- 2026-07-10: Product pricing responses now include `priceList` and `discountPercent`. Price List is calculated as product weight * costing-setting multiplier, and Discount % is calculated from the difference between Price List and Final Value.
- 2026-07-10: Added an auth-free product pricing API at `GET /admin/costing-setting/product-pricing`. The endpoint requires `companyId` or `business_id`, optionally accepts `productId` and `search`/`productName`, and returns active product rows priced from their Item Type -> Item Group -> Item Category costing setting using the same formula as Product Costing: product weight * recipe/base value, selected pricing tier, then Ref/CD/TOD currency additions.
- 2026-07-09: Costing settings now normalize to Item Category scope. `GET/PUT /admin/costing-setting/scope` ignores submitted `itemSubCategoryId` and stores it as `NULL`, and migration `20260709002000-normalize-costing-settings-to-category-scope.js` clears existing subcategory-scoped costing rows so one recipe/settings set applies across all subcategories in a category.
- 2026-07-09: Added `discountBaseColumn` to costing settings through migration `20260709001000-add-discount-base-column-to-costing-settings.js`. The field stores which tier (`net`, `star`, `gold`, or `silver`) Product Costing should use when converting `Ref`, `CD`, and `TOD` percentages into currency amounts, and the API validates/formats the field with a default of `net`.
- 2026-07-09: Added migration `20260709000000-replace-costing-line-id-with-id.js` to remove the legacy `lineId` primary key from `costing_settings` and standardize the table on numeric `id`, matching the Sequelize `CostingSetting` model and frontend API contract.
- 2026-07-08: Costing settings are now scoped to the item hierarchy with nullable `itemTypeId`, `itemGroupId`, `itemCategoryId`, and `itemSubCategoryId` fields plus migration `20260708000000-add-hierarchy-to-costing-settings.js`. Added `GET /admin/costing-setting/scope` and `PUT /admin/costing-setting/scope` so Product Costing can load and upsert the setting for the currently selected Item Type -> Item Group -> Item Category -> Item Sub Category path. Responses include linked hierarchy labels and recipe detail.
- 2026-07-08: Raw Material and Recipe APIs now include dedicated detail routes, `GET /admin/raw-material/view/:id` and `GET /admin/recipe/view/:id`, so frontend view calls no longer collide with the company list routes. Create/update/delete/detail operations are scoped to the authenticated company, audit fields use the JWT `userId`, recipe updates return the updated record, and raw-material rate changes recalculate only recipes in the same company while supporting both legacy and current recipe item shapes.
- 2026-07-08: Item create/update validation now supports imported static pipe products where display names repeat across different size/weight/hierarchy combinations. Duplicate checks use product name plus item hierarchy, subcategory, size, and weight for active products. Sales price and weight validation allow zero, and HSN validation allows `0` in addition to 4/6/8 digit codes so imported placeholder costing values can be edited without false validation failures.
- 2026-07-07: Added a static pipe product import utility at `app/util/importStaticPipeProducts.js` with npm scripts `import-static-pipes:preview`, `import-static-pipes:apply`, `import-static-pipes:verify`, `import-static-pipes:normalize`, `import-static-pipes:sync-names`, and `import-static-pipes:cleanup-old`. It parses the provided TypeScript-style product constants, maps them into the reviewed pipe hierarchy, validates expected counts before apply, soft-disables current active products for the company inside a transaction, creates stock rows for new products, stores the static `size` plus existing product `weight`, sets imported `productname` to the same value as `description`, can verify/normalize the imported hierarchy afterward, and can transactionally remove old inactive products that are not referenced by business documents.
- 2026-07-07: Linked products/items directly to item types. `P_product` now uses nullable `itemTypeId` as the only item type field, with migrations `20260707000000-add-item-type-id-to-products.js` and `20260707001000-remove-product-itemtype-column.js`; the add-column migration creates missing item type master rows from existing product `itemtype` values before backfilling products. Create/update item validation requires `itemTypeId`, verifies that the item type exists for the current company, and verifies that the submitted group/category/subcategory belong to the selected Item Type -> Item Group -> Item Category path. Item view/list responses include the linked `itemType`.
- 2026-07-07: Added item type master APIs and the `/admin/itemType/view_all_itemType` compatibility alias for `/admin/itemType/get_all_itemType`. Item subcategory is optional during item create/update.

## Project Overview

PVC_API is a Node.js/Express backend for a PVC manufacturing and accounting system. It manages companies, users, roles, permissions, accounts, sales, purchases, payments, receipts, stock, production/BOM, maintenance, employee attendance/salary, cash wallets, order processing, and a loyalty-user integration.

The application exposes JSON APIs under `/admin`, uses MySQL through Sequelize models, generates invoice/ledger documents with EJS, PDF, image, and Excel tooling, and maintains both regular accounting records and a parallel cash-oriented `C_` model/API family.

## Technology Stack

- Runtime: Node.js
- Web framework: Express 4
- Database: MySQL via Sequelize 6 and mysql2
- Auth: JWT, bcrypt, token table persistence
- Validation: Joi middleware
- Templates/reports: EJS, html-pdf-node, Puppeteer, ExcelJS
- Jobs: node-cron
- Email: nodemailer
- Optional DB access: SSH tunnel via ssh2
- File uploads/static assets: multer and Express static serving

## Root Files and Folder Structure

```text
PVC_API/
  .env
  .gitignore
  .gitlab-ci.yml
  README.md
  PROJECT_DOCUMENTATION.md
  app.js
  application_summary.csv
  package.json
  package-lock.json
  app/
    config/
      config.js
      index.js
      secondaryIndex.js
      sshTunnel.js
    constant/
      common.js
      constant.js
      validate.js
      validation.js
    content/
      forget-password.html
    controller/
      account.js
      attendance.js
      attendanceType.js
      bom.js
      bonusConfiguration.js
      claim.js
      company.js
      companyBankDetails.js
      costingSetting.js
      creditNote.js
      dashboard.js
      debitNote.js
      deliveryChallan.js
      employee.js
      holiday.js
      item.js
      itemCategory.js
      itemGroup.js
      itemSubCategory.js
      itemType.js
      ledger.js
      leave.js
      Machine.js
      machineSchedule.js
      maintenance.js
      maintenanceType.js
      notification.js
      OrderProcessing.js
      payment.js
      penaltyConfiguration.js
      permissions.js
      ProFormaInvoice.js
      purchaseInvoice.js
      purchaseOrder.js
      purpose.js
      RawMaterial.js
      receipt.js
      recipe.js
      salary.js
      salesinvoice.js
      selfExpense.js
      shift.js
      sparePart.js
      stock.js
      systemSettings.js
      units.js
      user.js
      wastage.js
    middleware/
      adminAuth.js
      permissions.js
    migrations/
      20240801124129-update-bank-account-id.js
      20240803120000-add-deleted-at-to-settlement-models.js
      20260215110440-add-itemSubCategoryId-to-products.js
      20260523000000-add-accountId-to-loyalty-users.js
      20260706000000-create-costing-settings.js
      20260706001000-create-item-types-and-link-groups.js
      20260706002000-change-product-itemtype-to-string.js
      20260707000000-add-item-type-id-to-products.js
      20260707001000-remove-product-itemtype-column.js
      20260707002000-add-static-costing-fields-to-products.js
    models/
      Account.js
      AccountDetail.js
      AccountGroup.js
      admintoken.js
      attendance.js
      attendanceType.js
      BankBalance.js
      BankLedger.js
      bom.js
      bomItem.js
      bonusConfiguration.js
      C_Cashbook.js
      C_claim.js
      C_claimLedger.js
      C_companyBalance.js
      C_CreditNote.js
      C_CreditNoteItems.js
      C_DailyBalance.js
      C_DebitNote.js
      C_DebitNoteItems.js
      C_Ledger.js
      C_OrderProcessing.js
      C_OrderProcessingItem.js
      C_Payment.js
      C_purchaseCash.js
      C_purchseCashItem.js
      C_Receipt.js
      C_salesinvoice.js
      C_salesinvoiceItem.js
      C_selfExpense.js
      C_userBalance.js
      C_WalletLedger.js
      company.js
      companyBalance.js
      companyBankDetails.js
      companyCashBalance.js
      companyUser.js
      costingSetting.js
      creditNote.js
      creditNoteItem.js
      debitNote.js
      debitNoteItem.js
      deliverychallan.js
      deliverychallanitem.js
      employee.js
      employeeOvertime.js
      employeePunch.js
      employeeSalary.js
      holiday.js
      index.js
      ItemCategory.js
      ItemGroup.js
      ItemSubCategory.js
      ItemType.js
      Ledger.js
      leave.js
      loyaltyCity.js
      loyaltyComplaint.js
      loyaltyCoupon.js
      loyaltyCouponRedeem.js
      loyaltyDistrict.js
      loyaltyKycDetail.js
      loyaltyLanguage.js
      loyaltyModels.js
      loyaltyPersonalDetail.js
      loyaltyPointMaster.js
      loyaltyPointTransaction.js
      loyaltyState.js
      loyaltyUser.js
      Machine.js
      MachineSchedule.js
      MachineScheduleType.js
      Maintenance.js
      MaintenanenceItem.js
      MaintenanceType.js
      MMaintenanceType.js
      notification.js
      Payment.js
      penaltyConfiguration.js
      permission.js
      product.js
      ProFormaInvoice.js
      ProFormaInvoiceItem.js
      purchaseInvoice.js
      purchaseInvoiceItem.js
      PurchaseOrder.js
      PurchaseOrderItem.js
      Purpose.js
      RawMaterial.js
      Receipt.js
      recipe.js
      salary.js
      salaryPayment.js
      salesInvoice.js
      salesInvoiceitem.js
      shift.js
      stock.js
      systemSettings.js
      user.js
      userBankAccount.js
      Wastage.js
    route/
      account.js
      attendance.js
      attendanceType.js
      bom.js
      bonusConfiguration.js
      claim.js
      company.js
      companyBankdetails.js
      costingSetting.js
      creditnote.js
      dashboard.js
      debitnoteRoute.js
      DeliveryChallanRoute.js
      employee.js
      holiday.js
      index.js
      item.js
      itemCategory.js
      itemGroup.js
      itemSubCategory.js
      itemType.js
      ledger.js
      leave.js
      Machine.js
      machineSchedule.js
      maintenance.js
      maintenanceType.js
      notification.js
      orderProcessingRoute.js
      paymentRoute.js
      penaltyConfiguration.js
      permissions.js
      ProFormaInvoice.js
      purchaseInvoice.js
      purchaseOrder.js
      purpose.js
      RawMaterial.js
      receiptRoute.js
      recipe.js
      salary.js
      salesinvoiceRoute.js
      selfExpense.js
      shift.js
      sparePart.js
      stock.js
      systemSettings.js
      unit.js
      user.js
      wastage.js
    seeders/
      20240528111136-comapny.js
    util/
      cron.js
      helper.js
      loginThrottle.js
      permissions.js
      recaptcha.js
      seeder.js
      smtp-mails.js
      smtp-service.js
    views/
      accountCashLedger.ejs
      accountLedger.ejs
      creditNote.ejs
      creditNoteCash.ejs
      debitNote.ejs
      debitNoteCash.ejs
      purchaseCash.ejs
      purchaseInvoice.ejs
      saleInvoice.ejs
      salesCash.ejs
```

Generated/runtime folders:

- `node_modules/`: installed dependencies.
- `storage/`: request log files named by date, written by `app.js`.
- `app/public/profile-picture/`: expected static profile-picture directory; files are served from `/profile-picture/...`.

## Application Architecture

The app is a layered Express API:

1. `app.js` loads environment variables, creates the Express app, configures CORS, JSON parsing, EJS views, request logging, static profile-picture serving, cron jobs, routes, SSH tunnel, DB authentication, Sequelize sync, and the HTTP listener.
2. `app/route/index.js` mounts all route modules under `/admin`.
3. Route files bind URL paths to controller functions and authorization/validation middleware.
4. Controllers implement business workflows, query Sequelize models, create related ledger/stock/balance rows, and return JSON responses.
5. Models are Sequelize model definitions. Most model files import the shared Sequelize instance from `app/config/index.js` directly and define associations in the model file.
6. Utilities provide cron jobs, permission seeding, SMTP mail, OTP generation, login throttling, and optional reCAPTCHA verification.

Important wiring note: `app/config/index.js` is the runtime DB connection. `app/models/index.js` is a Sequelize CLI-style registry that expects `app/config/config.json`, which is not present. Runtime code generally imports individual model files directly, not `app/models/index.js`.

## Startup Flow

1. `dotenv` loads `.env`.
2. `require("./app/util/cron")` registers scheduled jobs.
3. CORS origins are read from `CORS_ORIGINS`.
4. JSON request bodies are enabled with `express.json()`.
5. Request logging appends JSON lines into `storage/DD-MM-YYYY.log`.
6. `/profile-picture` serves profile images.
7. `/admin` mounts all API routes.
8. `createTunnel()` opens a local SSH forward on `127.0.0.1:3307` if `SSH_HOST` is configured; otherwise it skips.
9. Sequelize authenticates and `sequelize.sync()` synchronizes models.
10. Server listens on `PORT`.

## End-to-End Application Flow

Typical authenticated request:

1. Client logs in with `POST /admin/user_login`.
2. Server validates credentials, bcrypt-compares the password, detects special cash login by `.C` password suffix, finds the user's default company, signs a JWT, and stores/updates it in `P_adminToken`.
3. Client sends the JWT in the `token` header.
4. Route middleware `adminAuth("Resource:permission")` verifies the JWT using `SECRET_KEY`, stores payload on `req.user`, and checks `P_permissions` for the user's role/company/resource/permission.
5. Controller scopes data by `req.user.companyId`, performs business validations, writes model records, updates ledgers/balances/stock when relevant, and returns JSON.

Most business objects are company-scoped. Controllers commonly use `req.user.companyId` and `req.user.userId` for ownership, auditing, and filtering.

## Database and Model Conventions

Most tables are prefixed with `P_`. Cash-specialized tables generally use `P_C_...` and model/controller/route methods prefixed with `C_`.

Core model families:

- Identity and tenancy: `P_user`, `P_company`, `P_companyUser`, `P_adminToken`, `P_permissions`.
- Accounts: `P_AccountGroup`, `P_Account`, `P_AccountDetails`.
- Products and stock: `P_product`, `P_stock`, item type/group/category/subcategory models.
- Sales and purchasing: pro-forma invoices, purchase orders, sales invoices, purchase invoices, delivery challans, debit notes, credit notes, and corresponding item tables.
- Accounting ledgers and balances: `P_Ledger`, `P_BankLedger`, `P_BankBalance`, `P_companyBalance`, `P_CompanyCashBalance`.
- Cash subsystem: `P_C_salesInvoice`, `P_C_purchaseCash`, `P_C_Payment`, `P_C_Receipt`, `P_C_Ledger`, `P_C_Cashbook`, `P_C_companyBalance`, `P_C_userBalance`, `P_C_WalletLedger`, `P_C_DailyBalance`, claims and self expenses.
- Production: `P_Bom`, `P_BomItem`, raw materials, recipes, costing settings, wastage, spare parts.
- Maintenance: machines, machine schedules, maintenance types, maintenance records, junction tables.
- HR: employee, shift, leave, attendance, attendance type, overtime, salary, salary payment, bonus/penalty configuration, holidays, employee punch data.
- Loyalty: users, geography, language, KYC/personal details, coupons, point masters/transactions, complaints.

Key relationships:

- `Company` has many users through `P_companyUser`; a company also owns accounts, account groups, products, balances, bank details, permissions, machines, production records, notifications, etc.
- `User` has many created/updated business records via `createdBy` and `updatedBy` associations.
- `AccountGroup` has many `Account`; `Account` has one `AccountDetail`.
- `ItemType` has many `ItemGroup`; `ItemGroup` has many `ItemCategory`; `ItemCategory` has many `ItemSubCategory`.
- Sales, purchases, pro-forma invoices, purchase orders, debit notes, credit notes, delivery challans, order processing, and cash equivalents have parent rows with child item rows.
- Product belongs to ItemType through `itemTypeId`, has one stock row, stores optional `size` plus existing `weight`, and is referenced by invoice/order/BOM/maintenance item rows.
- Regular `Ledger` links accounts to sales, purchases, payments, receipts, debit notes, and credit notes.
- `C_Ledger` links the same concepts for cash records.
- `BankLedger` links bank/cash flow rows to `Receipt`/`Payment` and company bank accounts.
- `C_Cashbook` tracks approved cash receipt/payment activity.
- `C_WalletLedger` tracks user wallet cash entries and approval status.
- `C_DailyBalance` stores daily opening/credit/debit/closing cash snapshots.
- Loyalty users can be linked to an `Account` through `accountId`.
- `CostingSetting` stores company costing rates and margins in `costing_settings`; it uses an auto-increment `id` as the primary link field, belongs to a company through `companyId`, can link to `Recipe` through `recipeId`, and records `createdBy`/`updatedBy` users.

Schema evolution:

- Migrations add `accountId` to loyalty users, `itemSubCategoryId` to products, settlement soft-delete support, and bank account ID changes.
- `20260706000000-create-costing-settings.js` creates the `costing_settings` table for product costing configuration.
- `20260706001000-create-item-types-and-link-groups.js` creates `P_ItemTypes` and links `P_ItemGroups.itemTypeId` to support the item type -> group -> category -> subcategory hierarchy.
- `20260706002000-change-product-itemtype-to-string.js` is a historical migration from the older enum field period.
- `20260707000000-add-item-type-id-to-products.js` adds nullable `P_products.itemTypeId`, creates missing `P_ItemTypes` rows from existing product `itemtype` values per company, and backfills products so item create/update can validate and return the exact Item Type relationship.
- `20260707001000-remove-product-itemtype-column.js` removes the legacy `P_products.itemtype` string column after `itemTypeId` became the source of truth.
- `20260707002000-add-static-costing-fields-to-products.js` adds nullable `size` to products for imported static pipe/product data. The static import utility also checks and creates this column during `--apply` because the historical migration queue can be blocked by older duplicate-column migrations.
- Runtime still calls `sequelize.sync()`, so model definitions are a live schema source as well.

## Important Business Logic

### Sales and Purchase Inventory

- Creating a sales invoice or sales cash invoice creates a ledger row, bulk-creates item rows, and decrements stock by item quantity.
- Updating a sales invoice restores previous item stock, applies new items, updates the ledger date/account, and removes deleted child items.
- Deleting a sales invoice restores item quantities before deleting rows.
- Creating a purchase invoice or purchase cash invoice creates a ledger row, bulk-creates item rows, and increments stock.
- Updating/deleting purchase flows reverse old quantities and apply/remove new quantities.

### Payments, Receipts, and Balances

- Regular receipts/payments can be `Cash` or `Bank`.
- Bank transactions update `companyBalance`, `BankBalance`, and `BankLedger`.
- Cash transactions update either company-level cash balances for Super Admin or `C_userBalance` for other users.
- Cash-specific `C_create_receiveCash` and `C_create_paymentCash` maintain `C_DailyBalance`, `C_Ledger`, `C_WalletLedger`, `C_Cashbook`, and user/company balances.
- Super Admin cash entries are approved immediately and written to `C_Cashbook`.
- Non-Super Admin cash entries are wallet entries until approval.
- `wallet_approve` approves wallet entries and creates cashbook rows.

### Ledgers and Reports

- `ledger.js` builds account ledgers, cash ledgers, passbooks, cashbooks, daybooks, and report exports with Sequelize includes and SQL literals.
- EJS templates under `app/views` are used for invoice/ledger HTML rendering.
- PDF/JPG/Excel endpoints return base64 document data.

### Production and Maintenance

- BOM records represent finished goods production from product items; BOM logic adjusts product and wastage stock.
- Static pipe product import is handled by `app/util/importStaticPipeProducts.js`. Dry-run mode reads the source constant file and reports hierarchy/product counts. Apply mode validates the expected 254 products, 1 item type, 7 groups, 22 categories, 44 subcategories, and no duplicate product keys before any product replacement. The replacement runs in one transaction: existing active products for the company are soft-disabled, missing item type/group/category/subcategory values are created or normalized to the reviewed names, products are inserted, and zero-quantity stock rows are created. Imported products use the source row name for both `productname` and `description`; size and weight remain separate fields so repeated product names across sizes are expected. If the transaction fails, the existing active product set remains usable. The reviewed item groups are `AGRI Pipes`, `SWR Pipes`, `UPVC Pipes`, `CPVC Pipes`, `Casing Pipes`, `Threaded Casing Pipes`, and `Half Round Pipes`; row `group` values become item subcategories. Cleanup mode syncs active product names, removes inactive products that are not referenced outside stock, deletes their stock rows, and prunes unused item hierarchy rows while preserving referenced inactive products for historical document integrity.
- Costing settings store material rates and margin percentages for each company. Fields include `id`, `companyId`, `resinRate`, `brassRate`, `profitMargin`, `multiplier`, `starMargin`, `goldMargin`, `silverMargin`, `refMargin`, `cdMargin`, `todMargin`, optional `recipeId`, `createdBy`, and `updatedBy`. API payloads may pass tier margins as `tierMargins.star`, `tierMargins.gold`, and `tierMargins.silver`; responses include the linked recipe as `recipeDetail`.
- Maintenance records consume stock items and can be linked to machines and maintenance types.
- Machine schedules support regular/preventive schedule types and daily/weekly/monthly frequencies.

### HR, Attendance, and Salary

- Attendance/leave/shift modules manage employee daily attendance, approval, and status.
- Cron jobs create attendance rows, calculate overtime, calculate monthly employee salary, reset monthly leave allowances, and process punch data.
- Bonus and penalty configurations are percentage/range based and used by salary calculation.

### Loyalty Order Integration

- `POST /admin/orderProcessing/create_loyalty_order` authenticates with `x-loyalty-api-key`.
- It validates the loyalty user, requires that the loyalty user has a mapped account, creates a `C_OrderProcessing` row and matching `ProFormaInvoice` in one transaction, and auto-generates order/pro-forma numbers.

## API Surface

Base URL prefix: `/admin`

Global response pattern:

- Success responses usually use `{ status: "true", message, data? }`.
- Failure responses usually use `{ status: "false", message }`.
- Document-generation endpoints commonly return base64 in `data`.

Authentication header:

```text
token: <jwt>
```

Major route groups:

| Prefix | Route file | Purpose |
| --- | --- | --- |
| `/` | `app/route/user.js` | User login/logout, user CRUD, company-user membership, bank accounts, wallet approval |
| `/company` | `app/route/company.js` | Company CRUD, default company, balances |
| `/permission` | `app/route/permissions.js` | View/update permission records |
| `/account` | `app/route/account.js` | Account groups, accounts, bank accounts, loyalty account linking |
| `/item`, `/itemType`, `/itemGroup`, `/itemCategory`, `/itemSubCategory` | item route files | Product/item master data and taxonomy |
| `/stock` | `app/route/stock.js` | Stock list, detail, manual stock update |
| `/profromainvoice` | `app/route/ProFormaInvoice.js` | Pro-forma invoices |
| `/salesinvoice` | `app/route/salesinvoiceRoute.js` | Regular and cash sales invoices, exports |
| `/purchaseinvoice` | `app/route/purchaseInvoice.js` | Regular and cash purchase invoices, exports |
| `/purchaseOrder` | `app/route/purchaseOrder.js` | Purchase orders |
| `/deliverychallan` | `app/route/DeliveryChallanRoute.js` | Delivery challans |
| `/debitnote`, `/creditnote` | note route files | Regular and cash debit/credit notes, exports |
| `/payment`, `/receive` | payment/receipt route files | Regular and cash payment/receipt workflows |
| `/ledger` | `app/route/ledger.js` | Account ledgers, cash ledgers, passbook, cashbook, daybook, settlements |
| `/claim` | `app/route/claim.js` | Cash claims, wallet and balance views |
| `/companybank` | `app/route/companyBankdetails.js` | Company bank details |
| `/bom` | `app/route/bom.js` | Bill of materials/production |
| `/machine`, `/schedule`, `/maintenance`, `/maintenanceType` | machine/maintenance route files | Machines, schedules, maintenance records/types |
| `/employee`, `/attendance`, `/attendanceType`, `/leave`, `/shift`, `/salary` | HR route files | Employee, attendance, leave, shift, salary |
| `/bonusConfiguration`, `/penaltyConfiguration`, `/holiday`, `/systemSettings` | config route files | HR and system settings |
| `/orderProcessing` | `app/route/orderProcessingRoute.js` | Cash order processing and loyalty order integration |
| `/selfExpense` | `app/route/selfExpense.js` | Cash self expenses |
| `/raw-material`, `/recipe`, `/costing-setting` | raw material/recipe/costing route files | Recipe, raw material, and costing setting management |
| `/dashboard` | `app/route/dashboard.js` | Sales/purchase/payment/receipt dashboard totals |
| `/notification` | `app/route/notification.js` | Notifications |
| `/purpose` | `app/route/purpose.js` | Claim/self-expense purposes |
| `/sparepart`, `/wastage` | route files | Spare part and wastage masters |

Representative endpoints:

- `POST /admin/user_login`: login with mobile/password. Password ending in `.C` creates a cash-mode token with `type: "C"`.
- `POST /admin/create_user`, `GET /admin/get_all_user`, `GET /admin/view_user/:id`, `PUT /admin/update_user/:id`, `DELETE /admin/delete_user/:id`.
- `POST /admin/salesinvoice/create_salesinvoice`, update/view/list/delete/export variants and corresponding `C_` cash endpoints.
- `POST /admin/purchaseinvoice/create_purchaseInvoice`, update/view/list/delete/export variants and corresponding `C_` cash endpoints.
- `POST /admin/payment/create_payment_bank` and `POST /admin/payment/C_create_paymentCash`.
- `POST /admin/receive/create_receive_bank` and `POST /admin/receive/C_create_receiveCash`.
- `POST /admin/orderProcessing/create_loyalty_order`: create a cash order-processing record and pro-forma invoice from a mapped loyalty user, protected by `x-loyalty-api-key`.
- `GET /admin/costing-setting/business/:businessId`, `GET /admin/costing-setting/:id`, `POST /admin/costing-setting`, `PUT /admin/costing-setting/:id`, `DELETE /admin/costing-setting/:id`: manage company costing settings by their own `id` primary key.
- `POST /admin/itemType/create_itemType`, `GET /admin/itemType/get_all_itemType`, `GET /admin/itemType/view_all_itemType`, `GET /admin/itemType/view_itemType/:id`, `PUT /admin/itemType/update_itemType/:id`, `DELETE /admin/itemType/delete_itemType/:id`: manage reusable item types. `view_all_itemType` is a compatibility alias for the list endpoint.
- `GET /admin/itemGroup/get_all_itemGroup_by_type/:typeId`: fetch item groups belonging to an item type.
- `POST /admin/item/create_item` and `PUT /admin/item/update_item/:id`: create/update items with `itemTypeId`; the controller validates that the selected group, category, and optional subcategory belong under the selected item type for the current company.
- Item create/update duplicate detection allows repeated display names when hierarchy, subcategory, size, or weight differs. `salesprice` and `weight` may be zero; `HSNcode` may be `0` for imported placeholder rows or a 4/6/8 digit code.

When adding or changing routes, update this section and the mounted prefix in the route table.

## Authentication and Authorization

Authentication:

- User login is mobile/password based.
- Passwords are hashed with bcrypt.
- JWTs are signed with `SECRET_KEY` and currently expire in 10 hours.
- The JWT payload includes `userId`, `role`, `type`, `username`, and `companyId`.
- Tokens are persisted in `P_adminToken`; middleware currently verifies the provided token directly. The DB token lookup is present but commented out.
- Login attempts are throttled in memory by `app/util/loginThrottle.js`.
- User login verifies Google reCAPTCHA through `app/util/recaptcha.js` when `RECAPTCHA_SECRET_KEY` is configured.

Authorization:

- Route middleware calls `adminAuth("Resource:permission")`.
- `adminAuth` reads the `token` header, verifies JWT, places decoded data on `req.user`, and checks `P_permissions`.
- For cash-mode token payloads (`type === "C"`), permission lookup omits the `type: false` filter.
- For regular tokens, lookup requires `type: false`.
- Permission seed data lives in `app/middleware/permissions.js`.
- `app/util/permissions.js` bulk-creates permission rows for a company and marks resources containing `Cash` as cash permissions.

Roles:

- `Super Admin`
- `Admin`
- `Account`
- `Employee`
- `Workers`
- `Other`

## Environment Variables and Configuration

Required/used variables:

| Variable | Purpose |
| --- | --- |
| `PORT` | HTTP server port |
| `NODE_ENV` | Selects DB config key; defaults to `development` |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | MySQL database name |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `SECRET_KEY` | JWT signing/verification secret |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `API_URL` | Base URL used for profile-picture URLs |
| `SMTP_HOST` | SMTP host |
| `SMTP_PORT` | SMTP port |
| `SMTP_SECURE` | `true` for secure SMTP |
| `SMTP_EMAIL` | SMTP username/from address |
| `SMTP_PASSWORD` | SMTP password |
| `SSH_HOST` | Optional SSH host; if absent tunnel is skipped |
| `SSH_PORT` | Optional SSH port, defaults to 22 |
| `SSH_USERNAME` | SSH username |
| `SSH_PASSWORD` | SSH password |
| `SECONDARY_DB_USERNAME` | Secondary DB username |
| `SECONDARY_DB_PASSWORD` | Secondary DB password |
| `SECONDARY_DB_NAME` | Secondary DB name |
| `SECONDARY_DB_HOST` | Secondary DB host |
| `SECONDARY_DB_PORT` | Secondary DB port |
| `RECAPTCHA_SECRET_KEY` | Optional reCAPTCHA server key |
| `LOGIN_THROTTLE_MAX_FAILURES` | Failed-login threshold |
| `LOGIN_THROTTLE_LOCK_MS` | Login lock duration in milliseconds |
| `LOYALTY_API_KEY` | Shared key for loyalty order integration |

Config files:

- `app/config/config.js`: Sequelize CLI-compatible config object sourced from env.
- `app/config/index.js`: runtime Sequelize instance.
- `app/config/secondaryIndex.js`: secondary DB config access.
- `app/config/sshTunnel.js`: optional SSH tunnel setup.

## Third-Party Integrations

- MySQL database with Sequelize models.
- SMTP email via nodemailer for forgot-password OTP emails.
- Optional Google reCAPTCHA verification utility.
- Optional SSH tunnel for remote database connectivity.
- Loyalty system integration through `LOYALTY_API_KEY` and `x-loyalty-api-key`.
- Puppeteer/html-pdf-node/ExcelJS for document exports.

## Utilities and Services

- `app/util/cron.js`: scheduled jobs for low stock notifications, salary accrual, attendance creation, overtime, monthly salary, leave settlement, and punch import processing.
- `app/util/helper.js`: OTP generation.
- `app/util/loginThrottle.js`: in-memory login failure tracking and lockout.
- `app/util/permissions.js`: company permission seeding.
- `app/util/recaptcha.js`: reCAPTCHA verification helper.
- `app/util/smtp-service.js`: nodemailer transporter and send helper.
- `app/util/smtp-mails.js`: forgot password email content and OTP flow.
- `app/util/seeder.js`: seed helper logic.

## Scheduled Jobs

Defined in `app/util/cron.js`:

- `lowStockNotificationJob`: daily at midnight, creates notifications for products below threshold.
- `employeeSalaryCountJob`: daily at midnight, accrues user salary into `P_Salary`.
- `addEmployeeAttendanceJob`: daily at 02:00, creates attendance rows for active employees.
- `calculateEmployeesOvertimeJob`: daily at 01:00, calculates previous-day overtime.
- `calculateEmployeesMonthlySalaryJob`: monthly on day 1 at 03:00, computes employee salary details.
- `employeesLeavesSettlementJob`: monthly on day 1 at 02:00, increments leave balances and resets overtime.
- `employeePunchingAttendance`: every 30 seconds, maps punch records into attendance updates.

## Coding Conventions and Project Guidelines

- Use CommonJS (`require`, `module.exports`).
- Route files should stay thin: mount middleware and delegate to controllers.
- Controllers currently return JSON directly and should keep company scoping through `req.user.companyId`.
- Use existing response style: string statuses `"true"`/`"false"` unless deliberately standardizing across the project.
- Use existing validation middleware from `app/constant/validate.js` and `app/constant/validation.js` for request payload checks.
- Preserve existing permission strings and add corresponding permission seed entries when adding protected routes.
- For company-scoped data, always filter by `companyId`.
- For auditable records, set `createdBy` and `updatedBy` using `req.user.userId`.
- Keep regular and cash flows synchronized when adding equivalent features. Cash routes/models usually use `C_` prefixes.
- When a transaction affects stock, ledger, balances, wallet ledger, cashbook, bank ledger, or daily balance, update all related records consistently.
- Prefer Sequelize transactions for multi-table workflows, especially where stock/balances/ledgers are updated together.
- Keep this file updated in the same change as code changes.

## Implementation Notes and Assumptions

- The application calls `sequelize.sync()` on startup. This can create/alter tables based on current models depending on Sequelize behavior and should be considered when changing model definitions.
- `app/models/index.js` is likely not used at runtime and references missing `config.json`; avoid relying on it unless fixed.
- `storage/*.log` contains request method, endpoint, body, and token header. Treat logs as sensitive.
- Password login allows a `.C` suffix for cash-mode login while stripping `.C` before bcrypt comparison.
- Permission resources containing `Cash` are treated as cash permissions during permission seeding.
- Several controllers use manual multi-step updates without transactions. Future high-risk balance/stock changes should consider adding Sequelize transactions.
- Some routes expose unauthenticated employee endpoints such as employee login/forgot password and some attendance/leave operations; verify intended exposure before changing auth.
- Some route files contain multiline route declarations and some endpoints are export/report variants. The route files remain the executable source for exact paths.

## Development Commands

```bash
npm install
npm start
npm run dev
npm run migrate-run
npm run import-static-pipes:preview
npm run import-static-pipes:apply
npm run import-static-pipes:verify
npm run import-static-pipes:normalize
npm run import-static-pipes:sync-names
npm run import-static-pipes:cleanup-old
npm run migrate-undo
npm run seeder-all
npm run seeder-undo
```

Current `npm test` is a placeholder that exits with an error.

## Future Development Checklist

Before changing code:

1. Read this `PROJECT_DOCUMENTATION.md`.
2. Inspect the relevant route, controller, model, validation, and permission files.
3. Identify side effects on stock, ledgers, balances, wallet/cashbook, bank ledgers, cron jobs, and document exports.
4. Make the code change.
5. Run the most relevant verification available.
6. Update this documentation immediately in the same change.

When adding a new feature:

- Add or update route documentation.
- Add or update model relationships and schema notes.
- Add permissions to `app/middleware/permissions.js` if the route is protected.
- Add validation middleware where applicable.
- Document environment variables or third-party dependencies.
- Document ledger/stock/balance effects.
