import { createContext, use, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({children}) => {

    const currency = import.meta.env.VITE_CURRENCY;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false);
    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState({})

    const fetchSeller = async()=>{  //fetch seller status
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true);
            }else{
                setIsSeller(false)
            }
        } catch (error) {
            setIsSeller(false)
        }
    }
    const fetchUser = async() =>{   //fetch user auth status, data, and cart items
        try {
            const {data} = await axios.get('/api/user/is-auth');
            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems);
            }
        } catch (error) {
            setUser(null)
            setCartItems({})
        }
    }
    const fetchProducts = async() =>{  //fetch products
        try {
            const {data} = await axios.get('api/product/list');
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const addToCart = (itemId) =>{  //add items to cart
        let cartData = structuredClone(cartItems)
        if(cartData[itemId]){
            cartData[itemId]++;
        }else{
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to cart")
    }
    const updateCartItems = (itemId, quantity)=>{  //update quantity in cart
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Cart Updated")
    }
    const removeFromCart = (itemId)=>{   //remove items from cart
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId]--;
            if(cartData[itemId]===0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from cart");
        setCartItems(cartData);
    }
    const getCartCount = ()=>{   //number of items in cart
        let totalCount =0;
        for(const item in cartItems){
            totalCount += cartItems[item];
        }
        return totalCount;
    }
    const getCartAmount = ()=>{
        let totalAmount = 0;
        for(const items in cartItems){
            let itemInfo = products.find((product)=> product._id===items);
            if(cartItems[items]>0){
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount*100)/100;
    }

    useEffect(() => {
        fetchUser();
        fetchSeller();
        fetchProducts();
    }, [])
    useEffect(() => {   //update cartItems in database
        const updateCart = async()=>{
            try {
                const {data} = await axios.post('/api/cart/update', {cartItems})
                if(!data.success){
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        }

        if(user){
            updateCart()
        }
    }, [cartItems])

    const value = {navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItems, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts, setCartItems}

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = ()=>{
    return useContext(AppContext);
}