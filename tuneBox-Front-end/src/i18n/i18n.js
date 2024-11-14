import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {

  en: {
    translation: {
      // http://localhost:3000/Cart
      "cartTitle": "Cart",
      "homeTitle": "Home",
      "titleBig": "Cart",
      "items": "items",
      "textinCart": "Your cart is empty",
      "backToShop": "Back to shop",
      "titleBig2": "Total",
      "checkout": "Checkout",
      "cart_warning": "Please add products to cart!",
      "ok_button": "OK",
      // narbar
      "feed": "Feed",
      "shop": "Shop",
      "search": "Search",
      "create": "Create Track",
      "profile": "Profile",
      "logout": "Log out",
      "notification": "There are no announcements.",
      "delete": "Delete all viewed notifications",
      "no": "No instrument available",


      // http://localhost:3000/Cart
      "brandTitle": "Brands",
      "viewall": "View all",
      "cateTitle": "Categories",
      "sell": "Products",
      "conhang": "In stock",
      "hethang": "Out of stock",
      "saphhet": "Almost of stock",
      // http://localhost:3000/Shop
      "priceLe": "Price Level",
      "pmax": "Highest price",
      "pmin": "Lowest price",
      "nob": "There are no brands available",
      "apply": "Apply",


      //deatil pro
      "about": "About the product",
      "qty": "Quantity",
      "brandsame": "Similar products",
      "but": "Buy now, pay later",
      "ship": "Free shipping on all orders",
      "dnote1": "This product is out of stock, please choose another product!",
      "error": "Erorr",
      "succes": "Success",
      "dnote2": "The product has been added to the cart.",
      "dnote3": "Loading products...",
      "dnote4": "The product does not exist or cannot be found.",
      "dnote5": "Exceeded product quantity in stock",
      "dnote6": "This product is out of stock, please choose another product!",
      "dnote7": "Add to cart",
    }
  },
  vi: {
    translation: {

      // http://localhost:3000/Cart

      "cartTitle": "Giỏ hàng",
      "homeTitle": "Trang chủ",
      "titleBig": "Giỏ hàng",
      "items": "sản phẩm",
      "textinCart": "Giỏ hàng của bạn đang trống",
      "backToShop": "Quay về",
      "titleBig2": "Tổng cộng",
      "checkout": "Thanh toán",
      "cart_warning": "Vui lòng thêm sản phẩm vào giỏ hàng!",
      "ok_button": "Đồng ý",

      // narbar
      "feed": "Bản tin",
      "shop": "Cửa hàng",
      "search": "Tim kiếm",
      "create": "Tạo Track",
      "profile": "Trang cá nhân",
      "logout": "Đăng xuất",
      "notification": "Không có thông báo",

      "delete": "Xóa tất cả thông báo",
      // http://localhost:3000/HomeEcommerce
      "brandTitle": "Thương hiệu",
      "viewall": "Xem tất cả",
      "cateTitle": "Loại",
      "sell": "Sản phẩm",
      "conhang": "Còn hàng",
      "hethang": "Hết hàng",
      "saphhet": "Sắp hết hàng",
      "no": "Không có sản phẩm nào cả",

      // http://localhost:3000/Shop


      "priceLe": "Theo khoản giá",
      "pmax": "Giá cao nhất",
      "pmin": "Giá thấp nhất",
      "nob": "Không có thương hiệu nào",
      "apply": "Áp dụng",
      //  http://localhost:3000/DetailProduct/102
      "about": "Thông tin sản phẩm",
      "qty": "Số lượng",
      "brandsame": "Sản phẩm tương tự",
      "but": "Mua ngay trả sau",
      "ship": "Miễn phí giao hàng",

      "dnote1": "Sản phẩm này đã hết hàng, vui lòng chọn sản phẩm khác!",
      "error": "Lỗi",
      "succes": "Thành công",
      "dnote2": "Sản phẩm đã được thêm vào giỏ hàng.",
      "dnote3": "Đang tải sản phẩm...",
      "dnote4": "Sản phẩm không tồn tại hoặc không thể tìm thấy.",
      "dnote5": "Vượt quá số lượng sản phẩm trong kho",
      "dnote6": "Sản phẩm này đã hết hàng, vui lòng chọn sản phẩm khác!",
      "dnote7": "Thêm vào giỏ hàng", 
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
