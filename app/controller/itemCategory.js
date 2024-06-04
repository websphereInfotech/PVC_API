// const itemcategory = require("../models/itemcategory");
// const product = require("../models/product");

// exports.create_itemcategory = async (req, res) => {
//   try {
//     const { category, remarks, productId } = req.body;
//     const existingProduct = await product.findByPk(productId);
//     if (!existingProduct) {
//       return res
//         .status(404)
//         .json({ status: "false", message: "Product not found" });
//     }
//     const data = await itemcategory.create({
//       productId,
//       category,
//       remarks,
//     });
//     return res
//       .status(200)
//       .json({
//         status: "true",
//         message: "Item category created successfully",
//         data: data,
//       });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: "false", message: "Internal Server Error" });
//   }
// };
// exports.update_itemcategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { category, remarks } = req.body;

//     const item = await itemcategory.findByPk(id);
//     if (!item) {
//       return res.status(400).json({ message: "Item category not Found" });
//     }
//     await itemcategory.update(
//       {
//         category: category,
//         remarks: remarks,
//       },
//       {
//         where: { id: id },
//       }
//     );

//     const data = await itemcategory.findByPk(id);
//     return res
//       .status(200)
//       .json({
//         status: "true",
//         message: "Item category Update Successfully",
//         data: data,
//       });
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(500)
//       .json({ status: "false", message: "Internal Server Error" });
//   }
// };
// exports.view_itemcategory = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const data = await itemcategory.findOne({
//       where: { id },
//     });

//     if (!data) {
//       return res
//         .status(404)
//         .json({ status: "false", message: "Item category Not Found" });
//     }
//     return res
//       .status(200)
//       .json({
//         status: "true",
//         message: "Item category data fetch successfully",
//         data: data,
//       });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ status: "false", message: "Internal Server Error" });
//   }
// };
// exports.get_all_itemcategory = async (req, res) => {
//   try {
//     const data = await itemcategory.findAll();
//     if (data) {
//       return res
//         .status(200)
//         .json({
//           status: "true",
//           message: "All Item Category Show Successfully",
//           data: data,
//         });
//     } else {
//       return res
//         .status(404)
//         .json({ status: "false", message: "Item Category Not Found" });
//     }
//   } catch (error) {
//     console.log(error.message);
//     return res
//       .status(500)
//       .json({ status: "false", message: "Internal Server Error" });
//   }
// };
