

exports.create_creditNote = async(req,res) => {
    try {
        const {customerId,creditnoteno,creditdate,org_invoicedate,org_invoiceno,LL_RR_no,dispatchThrough,motorVehicleNo,destination,totalIgst,} = req.body;

    } catch (error) {
        console.log(error);
    return res
      .status(500)
      .json({ status: "false", message: "Internal Server Error" });
    }
}