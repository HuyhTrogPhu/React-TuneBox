import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8080/customer/cart';

export const addToLocalCart = (instrument, quantity) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingItemIndex = cart.findIndex(item => item.instrumentId === instrument.id);

  if (existingItemIndex >= 0) {
    // Cập nhật số lượng nếu sản phẩm đã có trong giỏ
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Thêm mới sản phẩm vào giỏ hàng với tất cả thông tin
    cart.push({ 
      instrumentId: instrument.id, 
      quantity, 
      name: instrument.name,
      costPrice: instrument.costPrice,
      image: instrument.image
    });
  }
  console.log(JSON.parse(localStorage.getItem('cart')));

  localStorage.setItem('cart', JSON.stringify(cart));
};


// Gửi giỏ hàng từ LocalStorage lên server sau khi đăng nhập
export const syncCartWithServer = async () => {
  let localCart = getLocalCart();
  if (localCart.length > 0) {
    try {
      const response = await axios.post(`${REST_API_BASE_URL}/sync`, localCart, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log("Cart synced with server:", response.data);
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  }
};

// Lấy giỏ hàng từ LocalStorage
export const getLocalCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart;

};

// Xóa sản phẩm khỏi giỏ hàng trong LocalStorage
export const removeFromLocalCart = (instrumentId) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.instrumentId !== instrumentId);
  localStorage.setItem('cart', JSON.stringify(cart));
};

// Xóa toàn bộ giỏ hàng khỏi LocalStorage
export const clearLocalCart = () => {
  localStorage.removeItem('cart');
};
