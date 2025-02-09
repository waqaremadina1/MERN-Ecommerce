import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import {assets} from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify';
import axios from 'axios'

const PlaceOrder = () => {

const [method, setMethod] = useState('cod');
const { backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products, navigate } = useContext(ShopContext)

const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  street: "",
  city: "",
  state: "",
  zipcode: "",
  country: "",
  phone: ""
})

const onChangeHandler = (e) => {
  setFormData(formData => ({ ...formData, [e.target.name]: e.target.value }))
}

const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    let orderItems = []

    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          const itemInfo = structuredClone(products.find(product => product._id === items))
          if (itemInfo) {
            itemInfo.size = item
            itemInfo.quantity = cartItems[items][item]
            orderItems.push(itemInfo)
          }
        }
      }
    }

    let orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee
    }

    switch (method) {
      // api calls for cod
      case 'cod':

        const response = await axios.post(backendUrl + '/api/order/place', orderData, { headers: { token } })

        if (response.data.success) {
          setCartItems({})
          navigate('/orders')
          toast(response.data.message, 'success')
        } else {
          toast.error(response.data.messgae, 'error')
        }

        break;

      case 'stripe':

        const responseStripe = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
        if (responseStripe.data.success) {
          const { session_url } = responseStripe.data
          window.location.replace(session_url)
        } else {
          toast(responseStripe.data.message, 'error')
        }

        break;

      default:
        break;
    }

  } catch (error) {
    console.log(error)
    toast.error(error.message, 'error')
  }
}




  return (
    
    <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
    {/* --------left side------ */}
    <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
      <div className="text-xl sm:text-2xl my-3">
        <Title text1={'DELIVERY '} text2={'INFORMATION'} />
      </div>
      <div className="flex gap-3">
        <input required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First Name' onChange={onChangeHandler} name='firstName' value={formData.firstName} />
        <input required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last Name' onChange={onChangeHandler} name='lastName' value={formData.lastName} />
      </div>
      <input required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Email' onChange={onChangeHandler} name='email' value={formData.email} />
      <input required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' onChange={onChangeHandler} name='street' value={formData.street} />
      <div className="flex gap-3">
        <input required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City Name' onChange={onChangeHandler} name='city' value={formData.city} />
        <input required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' onChange={onChangeHandler} name='state' value={formData.state} />
      </div>
      <div className="flex gap-3">
        <input required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' onChange={onChangeHandler} name='zipcode' value={formData.zipcode} />
        <input required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' onChange={onChangeHandler} name='country' value={formData.country} />
      </div>
      <input required className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone Number' onChange={onChangeHandler} name='phone' value={formData.phone} />
    </div>
    {/* ------right side */}
    <div className="mt-8">
      <div className="mt-8 min-w-80">
        <CartTotal />
      </div>
      <div className="mt-12">
        <Title text1={'PAYMENT'} text2={'METHOD'} />
        {/*-----payment methdd */}
        <div className="flex gap-3 flex-col lg:flex-row">
          <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-400' : ''} `}></p>
            <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
          </div>

          <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''} `}></p>
            <p className='text-hray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
          </div>
        </div>
        <div className="w-full text-end mt-8">
          <button type='submit' className='bg-black text-white px-16 py-3 text-sm rounded-md cursor-pointer'  >PLACE ORDER</button>
        </div>
      </div>
    </div>
  </form>
  )
}

export default PlaceOrder