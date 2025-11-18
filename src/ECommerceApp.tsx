// This file is the uploaded ecommerce-app (3).tsx content, slightly adapted to fit a Vite/TS project.
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, MapPin, Phone, ChevronLeft, Tag } from 'lucide-react';

// Mock function to fetch shop data - in real app, this would be an API call
const fetchShopData = (shopUsername: string) => {
  const mockData = {
    "BusinessName": "Metro Accessories",
    "BusinessType": "Shop",
    "Address": "Velur, Thrissur",
    "MobileNo": "9400246236",
    "Pincode": "680601",
    "MapLocation": "https://www.google.com/maps/place/Metro+Accessories",
    "ShopUsername": "metrovelur",
    "ConvenienceFee": 5,
    "Items": [
      {
        "id": 1,
        "Name": "Heatex 5ltr",
        "Rate": 2350,
        "Discount": 0,
        "combo_quantity": 3,
        "combo_discount": 10,
        "Category": "Coolants",
        "Stock": true,
        "tags": ["Premium", "Long Lasting", "High Performance"],
        "image1": "https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=Heatex+5L",
        "image2": "https://via.placeholder.com/200x200/7C3AED/FFFFFF?text=Heatex+5L",
        "video": ""
      },
      {
        "id": 2,
        "Name": "Heatex 1.2ltr",
        "Rate": 1000,
        "Discount": 0,
        "combo_quantity": 0,
        "combo_discount": 0,
        "Category": "Coolants",
        "Stock": true,
        "tags": ["Compact", "Value Pack"],
        "image1": "https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=Heatex+1.2L",
        "image2": "https://via.placeholder.com/200x200/7C3AED/FFFFFF?text=Heatex+1.2L",
        "video": ""
      },
      {
        "id": 3,
        "Name": "Heatex 1ltr",
        "Rate": 530,
        "Discount": 0,
        "combo_quantity": 0,
        "combo_discount": 0,
        "Category": "Coolants",
        "Stock": true,
        "tags": ["Best Seller", "Economical"],
        "image1": "https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=Heatex+1L",
        "image2": "https://via.placeholder.com/200x200/7C3AED/FFFFFF?text=Heatex+1L",
        "video": ""
      },
      {
        "id": 4,
        "Name": "Silicon Clear",
        "Rate": 120,
        "Discount": 0,
        "combo_quantity": 0,
        "combo_discount": 0,
        "Category": "Sealants",
        "Stock": true,
        "tags": ["Weather Resistant", "Clear Finish"],
        "image1": "https://via.placeholder.com/200x200/10B981/FFFFFF?text=Silicon",
        "image2": "https://via.placeholder.com/200x200/059669/FFFFFF?text=Silicon",
        "video": ""
      },
      {
        "id": 5,
        "Name": "Silicone Weather Clear",
        "Rate": 250,
        "Discount": 20,
        "combo_quantity": 0,
        "combo_discount": 0,
        "Category": "Sealants",
        "Stock": true,
        "tags": ["Premium", "All Weather"],
        "image1": "https://via.placeholder.com/200x200/10B981/FFFFFF?text=Weather+Clear",
        "image2": "https://via.placeholder.com/200x200/059669/FFFFFF?text=Weather+Clear",
        "video": ""
      },
      {
        "id": 6,
        "Name": "Aldrop 8\"×12mm",
        "Rate": 120,
        "Discount": 0,
        "combo_quantity": 0,
        "combo_discount": 0,
        "Category": "Hardware Fittings",
        "Stock": true,
        "tags": ["Durable", "Standard Size"],
        "image1": "https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=Aldrop",
        "image2": "https://via.placeholder.com/200x200/D97706/FFFFFF?text=Aldrop",
        "video": ""
      },
      {
        "id": 7,
        "Name": "Inner Mica Off White",
        "Rate": 450,
        "Discount": 0,
        "combo_quantity": 0,
        "combo_discount": 0,
        "Category": "Laminates",
        "Stock": true,
        "tags": ["Elegant", "Scratch Resistant"],
        "image1": "https://via.placeholder.com/200x200/EC4899/FFFFFF?text=Mica",
        "image2": "https://via.placeholder.com/200x200/DB2777/FFFFFF?text=Mica",
        "video": ""
      },
      {
        "id": 8,
        "Name": "16mm 710 Plywood (21yr Warranty)",
        "Rate": 3950,
        "Discount": 0,
        "combo_quantity": 0,
        "combo_discount": 0,
        "Category": "Wood & Plywood",
        "Stock": true,
        "tags": ["Premium Quality", "21 Year Warranty", "Termite Proof"],
        "image1": "https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Plywood+21yr",
        "image2": "https://via.placeholder.com/200x200/A0522D/FFFFFF?text=Plywood+21yr",
        "video": ""
      },
      {
        "id": 9,
        "Name": "16mm 710 Plywood (10yr Warranty)",
        "Rate": 3350,
        "Discount": 0,
        "combo_quantity": 0,
        "combo_discount": 0,
        "Category": "Wood & Plywood",
        "Stock": true,
        "tags": ["Good Quality", "10 Year Warranty"],
        "image1": "https://via.placeholder.com/200x200/8B4513/FFFFFF?text=Plywood+10yr",
        "image2": "https://via.placeholder.com/200x200/A0522D/FFFFFF?text=Plywood+10yr",
        "video": ""
      },
      {
        "id": 10,
        "Name": "Panel Door",
        "Rate": 1850,
        "Discount": 0,
        "combo_quantity": 0,
        "combo_discount": 0,
        "Category": "Doors",
        "Stock": true,
        "tags": ["Stylish", "Durable"],
        "image1": "https://via.placeholder.com/200x200/6B7280/FFFFFF?text=Panel+Door",
        "image2": "https://via.placeholder.com/200x200/4B5563/FFFFFF?text=Panel+Door",
        "video": ""
      }
    ]
  };
  return mockData;
};

export default function ECommerceApp() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [shopData, setShopData] = useState<any|null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    const shopUsername = 'metrovelur';
    const data = fetchShopData(shopUsername);
    setShopData(data);
  }, []);

  if (!shopData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">🏪</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const categories = ['All', ...new Set(shopData.Items.map((item: any) => item.Category))];

  const addToCart = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!product.Stock) {
      return;
    }
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 2000);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((total, item) => {
    const discountedPrice = item.Rate - (item.Rate * item.Discount / 100);
    return total + (discountedPrice * item.quantity);
  }, 0);

  const calculateDiscountedPrice = (rate: number, discount: number) => {
    return rate - (rate * discount / 100);
  };

  const handleCheckout = () => {
    setShowCheckoutDialog(true);
    setConsentChecked(false);
  };

  const handleWhatsAppOrder = () => {
    if (!consentChecked) return;

    let message = `*New Order from ${shopData.BusinessName}*\n\n`;
    message += `*Order Details:*\n`;

    cart.forEach((item: any, index: number) => {
      const discountedPrice = item.Rate - (item.Rate * item.Discount / 100);
      message += `\n${index + 1}. ${item.Name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₹${discountedPrice.toFixed(2)} x ${item.quantity} = ₹${(discountedPrice * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*Subtotal:* ₹${cartTotal.toFixed(2)}`;
    message += `\n*Convenience Fee:* ₹${shopData.ConvenienceFee.toFixed(2)}`;
    message += `\n*Total Amount:* ₹${(cartTotal + shopData.ConvenienceFee).toFixed(2)}`;

    const phoneNumber = shopData.MobileNo.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');

    setShowCheckoutDialog(false);
    setConsentChecked(false);
  };

  const filteredProducts = shopData.Items.filter((p: any) => {
    const matchesCategory = selectedCategory === 'All' || p.Category === selectedCategory;
    const matchesSearch = p.Name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (showCart) {
    return (
      <div className="h-screen bg-gray-50 flex flex-col relative">
        {showCheckoutDialog && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Confirm Your Order</h2>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Your order will be sent via WhatsApp. The {shopData.BusinessType} will call or message you for confirmation and location. Final amount may vary.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Order Summary:</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.Name} x {item.quantity}</span>
                        <span>₹{((item.Rate - (item.Rate * item.Discount / 100)) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-semibold text-gray-900 flex justify-between">
                      <span>Total:</span>
                      <span>₹{(cartTotal + shopData.ConvenienceFee).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">
                    I'm submitting this order through WhatsApp for the items I've chosen.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCheckoutDialog(false);
                    setConsentChecked(false);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={!consentChecked}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${

                  consentChecked
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => setShowCart(false)}
              className="mr-4 text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-2xl font-bold flex-1">Shopping Cart</h1>
          </div>
          <p className="text-blue-100">{cartItemCount} {cartItemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some items to get started</p>
              <button 
                onClick={() => setShowCart(false)}
                className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-3 rounded-xl font-semibold"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => {
                const discountedPrice = calculateDiscountedPrice(item.Rate, item.Discount);
                return (
                  <div key={item.id} className="bg-white rounded-2xl shadow-md p-4">
                    <div className="flex gap-4 mb-3">
                      <img src={item.image1} alt={item.Name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.Name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{item.Category}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-bold">₹{discountedPrice.toFixed(2)}</span>
                          {item.Discount > 0 && (
                            <>
                              <span className="text-gray-400 line-through text-sm">₹{item.Rate}</span>
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                                {item.Discount}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-gray-600 hover:text-blue-600 font-bold text-xl w-8 h-8 flex items-center justify-center"
                        >
                          −
                        </button>
                        <span className="font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-gray-600 hover:text-blue-600 font-bold text-xl w-8 h-8 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="bg-white border-t px-6 py-6 shadow-lg">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Convenience Fee</span>
                <span className="font-semibold">₹{shopData.ConvenienceFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">₹{(cartTotal + shopData.ConvenienceFee).toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    );
  }

  if (selectedProduct) {
    const discountedPrice = calculateDiscountedPrice(selectedProduct.Rate, selectedProduct.Discount);

    return (
      <div className="h-screen bg-gray-50 flex flex-col relative">
        {showCartNotification && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            <ShoppingCart size={20} />
            <span className="font-semibold">Added to cart!</span>
          </div>
        )}

        <div className="bg-white px-4 py-4 flex items-center shadow-sm">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="mr-4 text-gray-700"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold flex-1">Product Details</h1>
          <button onClick={() => setShowCart(true)} className="relative">
            <ShoppingCart size={24} className="text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-white px-6 py-6">
            <img src={selectedProduct.image1} alt={selectedProduct.Name} className="w-full h-64 object-contain mb-4 rounded-lg" />

            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900 flex-1">{selectedProduct.Name}</h2>
                {!selectedProduct.Stock && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold ml-2">
                    Out of Stock
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {selectedProduct.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm text-gray-500 mb-3">{selectedProduct.Category}</p>

              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl font-bold text-blue-600">₹{discountedPrice.toFixed(2)}</div>
                {selectedProduct.Discount > 0 && (
                  <>
                    <div className="text-xl text-gray-400 line-through">₹{selectedProduct.Rate}</div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                      {selectedProduct.Discount}% OFF
                    </div>
                  </>
                )}
              </div>

              {selectedProduct.combo_quantity > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <p className="text-orange-800 font-semibold text-sm mb-1">🎉 Combo Offer!</p>
                  <p className="text-orange-700 text-sm">
                    Buy {selectedProduct.combo_quantity} or more, get {selectedProduct.combo_discount}% extra discount!
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                High-quality {selectedProduct.Name} from our premium collection. 
                Perfect for all your needs with excellent durability and performance.
              </p>
            </div>

            {selectedProduct.Stock && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-700 font-semibold text-sm">✓ Available Now</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-t px-6 py-4">
          <button 
            onClick={() => addToCart(selectedProduct)}
            disabled={!selectedProduct.Stock}
            className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-shadow ${selectedProduct.Stock ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {selectedProduct.Stock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col relative">
      {showCartNotification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <ShoppingCart size={20} />
          <span className="font-semibold">Added to cart!</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 pt-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-white text-2xl font-bold">{shopData.BusinessName}</h1>
          <button onClick={() => setShowCart(true)} className="relative">
            <ShoppingCart className="text-white" size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-blue-100 text-sm mb-2">
          <div className="flex items-center gap-2">
            <span>{shopData.BusinessType}</span>
            <span>•</span>
            <span>{shopData.Address}, {shopData.Pincode}</span>
          </div>
          <a 
            href={shopData.MapLocation} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-1.5 rounded-lg transition-all flex-shrink-0 ml-2"
          >
            <MapPin size={16} className="text-white" />
          </a>
        </div>

        <a 
          href={`tel:${shopData.MobileNo}`} 
          className="flex items-center gap-2 text-blue-100 text-sm hover:text-white mb-4 w-fit"
        >
          <Phone size={14} />
          <span>{shopData.MobileNo}</span>
        </a>

        <div className="relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
          />
        </div>
      </div>

      <div className="bg-white px-6 py-3 shadow-sm">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-medium whitespace-nowrap transition-all text-sm ${selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredProducts.map((product: any) => {
              const discountedPrice = calculateDiscountedPrice(product.Rate, product.Discount);

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer ${!product.Stock ? 'opacity-60' : ''}`}
                >
                  <div className="flex gap-4 p-4">
                    <img 
                      src={product.image1} 
                      alt={product.Name} 
                      className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 text-base mb-2">
                          {product.Name}
                        </h3>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {product.tags.map((tag: string, index: number) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <p className="text-xs text-gray-500 mb-2">{product.Category}</p>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-blue-600 font-bold text-xl">₹{discountedPrice.toFixed(2)}</span>
                          {product.Discount > 0 && (
                            <>
                              <span className="text-gray-400 line-through text-sm">₹{product.Rate}</span>
                              <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                                {product.Discount}% OFF
                              </span>
                            </>
                          )}
                          {!product.Stock && (
                            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold ml-auto">
                              Out of Stock
                            </span>
                          )}
                        </div>

                        {product.combo_quantity > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
                            <p className="text-orange-800 font-semibold text-xs">
                              🎉 Buy {product.combo_quantity}+ get {product.combo_discount}% extra off!
                            </p>
                          </div>
                        )}

                        <button 
                          onClick={(e) => addToCart(product, e)}
                          disabled={!product.Stock}
                          className={`w-full py-2 rounded-lg text-sm font-semibold ${product.Stock ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                          {product.Stock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
