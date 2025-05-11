import Order from "../models/Order.js"
import Product from "../models/Product.js"

//Place Order COD: /api/order/cod
export const placeOrderCOD = async(req, res) =>{
    try {
        const {userId, items, address} = req.body
        if(!address || items.length === 0){
            res.json({success: false, message: "Invalid Data"})
        }

        // Calculate amount uwsing items
        let amount = await items.reduce(async(acc, item)=>{
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // Add Tax (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId, items, amount, address,
            paymentType: "COD"
        });

        return res.json({success: true, message: "Order Placed"})
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// Get Orders by userId: /api/order/user
export const getUserOrder = async(req, res) =>{
    try {
        const userId = req.user.id

        const orders = await Order.find({userId, $or: [{paymentType: "COD"}, {isPaid: true}]}).populate("items.product address").sort({createdAt: -1});
        return res.json({success: true, orders});
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}

// Get All Orders (Seller/Admin): /api/order/seller
export const getAllOrder = async(req, res) =>{
    try {
        const orders = await Order.find({$or: [{paymentType: "COD"}, {isPaid: true}]}).populate("items.product address").sort({createdAt: -1});

        return res.json({success: true, orders});
    } catch (error) {
        return res.json({success: false, message: error.message})
    }
}