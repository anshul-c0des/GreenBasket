import User from "../models/User.js";

// Update Cart Data: /api/cart/update
export const updateCart = async(req, res)=>{
    try {
        const userId = req.user.id;
        const { cartItems} = req.body;
        console.log("Received cartItems in backend:", cartItems);
        await User.findByIdAndUpdate(userId, {cartItems});
        const result = await User.findByIdAndUpdate(userId, { cartItems }, { new: true });
        console.log("Update result:", result);
        res.json({success: true, message: "Cart Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    } 

}