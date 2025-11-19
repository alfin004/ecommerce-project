import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, MapPin, Phone, ChevronLeft, Info } from 'lucide-react';

/**
 * ECommerceApp.tsx
 * - Uses KFC mock data by default (provided by user)
 * - If ?customer_name={shopusername} is present in URL, calls:
 *   http://13.233.199.188:9000/getitems?shop_username={shopusername}
 *   and uses that response (if valid)
 * - Shows an info button near the BusinessName; hover to see shop details
 * - Adds a description line (Category + tags) right below each product name
 */

/* 1) KFC mock data (user-provided) */
const kfcMock = {
  BusinessName: "KFC Chicken",
  BusinessType: "Restaurant",
  Address: "MG Road, Bangalore, Karnataka",
  MobileNo: "9876543210",
  Pincode: "560001",
  MapLocation: "https://www.google.com/maps/place/KFC+MG+Road+Bangalore",
  ShopUsername: "kfcblrmgroad",
  ConvenienceFee: 5,
  Items: [
    {
      id: 1,
      Name: "KFC Hot & Crispy Chicken (2 Pc)",
      Rate: 249,
      Discount: 0,
      combo_quantity: 3,
      combo_discount: 15,
      Category: "Chicken",
      Stock: true,
      tags: ["Spicy", "Crispy", "Best Seller"],
      image1: "https://via.placeholder.com/200x200/FF0000/FFFFFF?text=Hot+Crispy",
      image2: "https://via.placeholder.com/200x200/DD0000/FFFFFF?text=KFC+Chicken",
      video: ""
    },
    {
      id: 2,
      Name: "KFC Chicken Bucket (6 Pc)",
      Rate: 599,
      Discount: 50,
      combo_quantity: 2,
      combo_discount: 10,
      Category: "Bucket Meals",
      Stock: true,
      tags: ["Sharing", "Value Pack", "Family"],
      image1: "https://via.placeholder.com/200x200/FF9900/FFFFFF?text=Chicken+Bucket",
      image2: "https://via.placeholder.com/200x200/CC6600/FFFFFF?text=KFC+Bucket",
      video: ""
    },
    {
      id: 3,
      Name: "KFC Chicken Popcorn Regular",
      Rate: 129,
      Discount: 0,
      combo_quantity: 2,
      combo_discount: 5,
      Category: "Snacks",
      Stock: true,
      tags: ["Kids Favorite", "Crispy", "Snack"],
      image1: "https://via.placeholder.com/200x200/FF66CC/FFFFFF?text=Popcorn",
      image2: "https://via.placeholder.com/200x200/FF3388/FFFFFF?text=KFC+Popcorn",
      video: ""
    },
    {
      id: 4,
      Name: "KFC Zinger Burger",
      Rate: 169,
      Discount: 0,
      combo_quantity: 2,
      combo_discount: 10,
      Category: "Burgers",
      Stock: true,
      tags: ["Popular", "Spicy", "Bun"],
      image1: "https://via.placeholder.com/200x200/33CC33/FFFFFF?text=Zinger+Burger",
      image2: "https://via.placeholder.com/200x200/009933/FFFFFF?text=KFC+Zinger",
      video: ""
    }
  ]
};

export default function ECommerceApp() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [shopData, setShopData] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  // UI state for info tooltip
  const [showShopInfo, setShowShopInfo] = useState(false);

  useEffect(() => {
    // detect query param customer_name
    const params = new URLSearchParams(window.location.search);
    const shopUsernameFromQuery = params.get('customer_name');

    if (shopUsernameFromQuery) {
      // call the provided API and use its response if valid
      const url = `http://13.233.199.188:9000/getitems?shop_username=${encodeURIComponent(shopUsernameFromQuery)}`;
      fetch(url, { method: 'GET', headers: { accept: 'application/json' } })
        .then(async res => {
          if (!res.ok) {
            throw new Error(`API returned ${res.status}`);
          }
          const json = await res.json();
          // basic validation: it should contain BusinessName and Items array
          if (json && json.BusinessName && Array.isArray(json.Items)) {
            setShopData(json);
          } else {
            console.warn('API returned unexpected shape — using mock data');
            setShopData(kfcMock);
          }
        })
        .catch(err => {
          console.warn('Failed to fetch remote shop data, using mock. Error:', err.message);
          setShopData(kfcMock);
        });
    } else {
      // no query param — use local mock
      setShopData(kfcMock);
    }
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

  // categories derived from items
  const categories = ['All', ...Array.from(new Set(shopData.Items.map((item: any) => item.Category)))];

  /* CART helpers */
  const addToCart = (product: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!product.Stock) return;

    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      setCart(cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 1800);
  };

  const cartItemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const removeFromCart = (productId: number) => setCart(cart.filter(i => i.id !== productId));
  const updateQuantity = (productId: number, delta: number) =>
    setCart(cart.map(i => i.id === productId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));

  const cartTotal = cart.reduce((total, item) => {
    const discounted = item.Rate - (item.Rate * item.Discount / 100);
    return total + discounted * item.quantity;
  }, 0);

  const calculateDiscountedPrice = (rate: number, discount: number) => rate - (rate * discount / 100);

  const handleCheckout = () => {
    setShowCheckoutDialog(true);
    setConsentChecked(false);
  };

  const handleWhatsAppOrder = () => {
    if (!consentChecked) return;
    let message = `*New Order from ${shopData.BusinessName}*\n\n*Order Details:*\n`;
    cart.forEach((item: any, idx: number) => {
      const price = item.Rate - (item.Rate * item.Discount / 100);
      message += `\n${idx + 1}. ${item.Name}\n   Qty: ${item.quantity}\n   ₹${price.toFixed(2)} x ${item.quantity} = ₹${(price * item.quantity).toFixed(2)}\n`;
    });
    message += `\n*Subtotal:* ₹${cartTotal.toFixed(2)}`;
    message += `\n*Convenience Fee:* ₹${shopData.ConvenienceFee.toFixed(2)}`;
    message += `\n*Total:* ₹${(cartTotal + shopData.ConvenienceFee).toFixed(2)}`;

    const phone = shopData.MobileNo.replace(/\D/g, '');
    const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    setShowCheckoutDialog(false);
    setConsentChecked(false);
  };

  /* Filters */
  const filteredProducts = shopData.Items.filter((p: any) => {
    const matchesCategory = selectedCategory === 'All' || p.Category === selectedCategory;
    const matchesSearch = p.Name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  /* UI render: cart screen */
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
                    {cart.map(it => (
                      <div key={it.id} className="flex justify-between">
                        <span>{it.Name} x {it.quantity}</span>
                        <span>₹{((it.Rate - (it.Rate * it.Discount / 100)) * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-semibold text-gray-900 flex justify-between">
                      <span>Total:</span>
                      <span>₹{(cartTotal + shopData.ConvenienceFee).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm text-gray-700">I'm submitting this order through WhatsApp for the items I've chosen.</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setShowCheckoutDialog(false); setConsentChecked(false); }} className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={handleWhatsAppOrder} disabled={!consentChecked} className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-colors ${consentChecked ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>Send via WhatsApp</button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 py-6">
          <div className="flex items-center mb-4">
            <button onClick={() => setShowCart(false)} className="mr-4 text-white"><ChevronLeft size={24} /></button>
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
              <button onClick={() => setShowCart(false)} className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-8 py-3 rounded-xl font-semibold">Continue Shopping</button>
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
                          {item.Discount > 0 && <>
                            <span className="text-gray-400 line-through text-sm">₹{item.Rate}</span>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">{item.Discount}% OFF</span>
                          </>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-600 hover:text-blue-600 font-bold text-xl w-8 h-8 flex items-center justify-center">−</button>
                        <span className="font-semibold text-gray-900 w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-600 hover:text-blue-600 font-bold text-xl w-8 h-8 flex items-center justify-center">+</button>
                      </div>

                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Remove</button>
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
            <button onClick={handleCheckout} className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow">Proceed to Checkout</button>
          </div>
        )}
      </div>
    );
  }

  /* PRODUCT DETAILS VIEW */
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
          <button onClick={() => setSelectedProduct(null)} className="mr-4 text-gray-700"><ChevronLeft size={24} /></button>
          <h1 className="text-lg font-semibold flex-1">Product Details</h1>
          <button onClick={() => setShowCart(true)} className="relative">
            <ShoppingCart size={24} className="text-gray-700" />
            {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">{cartItemCount}</span>}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="bg-white px-6 py-6">
            <img src={selectedProduct.image1} alt={selectedProduct.Name} className="w-full h-64 object-contain mb-4 rounded-lg" />

            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900 flex-1">{selectedProduct.Name}</h2>
                {!selectedProduct.Stock && <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold ml-2">Out of Stock</span>}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {selectedProduct.tags.map((t: string, i: number) => <span key={i} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{t}</span>)}
              </div>

              <p className="text-sm text-gray-500 mb-3">{selectedProduct.Category}</p>

              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl font-bold text-blue-600">₹{discountedPrice.toFixed(2)}</div>
                {selectedProduct.Discount > 0 && <>
                  <div className="text-xl text-gray-400 line-through">₹{selectedProduct.Rate}</div>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">{selectedProduct.Discount}% OFF</div>
                </>}
              </div>

              {selectedProduct.combo_quantity > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                  <p className="text-orange-800 font-semibold text-sm mb-1">🎉 Combo Offer!</p>
                  <p className="text-orange-700 text-sm">Buy {selectedProduct.combo_quantity} or more, get {selectedProduct.combo_discount}% extra discount!</p>
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

            {selectedProduct.Stock && <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4"><p className="text-green-700 font-semibold text-sm">✓ Available Now</p></div>}
          </div>
        </div>

        <div className="bg-white border-t px-6 py-4">
          <button onClick={() => addToCart(selectedProduct)} disabled={!selectedProduct.Stock} className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-shadow ${selectedProduct.Stock ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>{selectedProduct.Stock ? 'Add to Cart' : 'Out of Stock'}</button>
        </div>
      </div>
    );
  }

  /* MAIN BROWSE VIEW */
  return (
    <div className="h-screen bg-gray-50 flex flex-col relative">
      {showCartNotification && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
          <ShoppingCart size={20} />
          <span className="font-semibold">Added to cart!</span>
        </div>
      )}

      {/* Header with shop name + info button */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 px-6 pt-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-2xl font-bold">{shopData.BusinessName}</h1>

            {/* Info button + hover panel */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowShopInfo(true)}
                onMouseLeave={() => setShowShopInfo(false)}
                onFocus={() => setShowShopInfo(true)}
                onBlur={() => setShowShopInfo(false)}
                className="ml-2 bg-white bg-opacity-10 hover:bg-opacity-20 p-1 rounded-full text-white"
                aria-label="Shop info"
                title="Shop info"
              >
                <Info size={16} />
              </button>

              {showShopInfo && (
                <div
                  onMouseEnter={() => setShowShopInfo(true)}
                  onMouseLeave={() => setShowShopInfo(false)}
                  className="absolute z-40 right-0 mt-2 w-72 bg-white text-gray-800 rounded-lg shadow-lg p-3 text-sm"
                >
                  <div className="font-semibold text-gray-900 mb-1">{shopData.BusinessName}</div>
                  <div className="text-gray-600"><strong>Type:</strong> {shopData.BusinessType}</div>
                  <div className="text-gray-600"><strong>Address:</strong> {shopData.Address}</div>
                  <div className="text-gray-600"><strong>Phone:</strong> {shopData.MobileNo}</div>
                  <div className="text-gray-600"><strong>Pincode:</strong> {shopData.Pincode}</div>
                  <div className="mt-2">
                    <a href={shopData.MapLocation} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open map</a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button onClick={() => setShowCart(true)} className="relative">
            <ShoppingCart className="text-white" size={24} />
            {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-white text-blue-600 text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">{cartItemCount}</span>}
          </button>
        </div>

        {/* Add a short description line under the business name (visible always) */}
        <div className="flex items-center justify-between text-blue-100 text-sm mb-2">
          <div className="flex items-center gap-2">
            <span>{shopData.BusinessType}</span>
            <span>•</span>
            <span>{shopData.Address}, {shopData.Pincode}</span>
          </div>
          <a href={shopData.MapLocation} target="_blank" rel="noopener noreferrer" className="bg-white bg-opacity-20 hover:bg-opacity-30 p-1.5 rounded-lg transition-all flex-shrink-0 ml-2">
            <MapPin size={16} className="text-white" />
          </a>
        </div>

        <a href={`tel:${shopData.MobileNo}`} className="flex items-center gap-2 text-blue-100 text-sm hover:text-white mb-4 w-fit">
          <Phone size={14} />
          <span>{shopData.MobileNo}</span>
        </a>

        <div className="relative">
          <Search className="absolute left-4 top-3 text-gray-400" size={18} />
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"/>
        </div>
      </div>

      <div className="bg-white px-6 py-3 shadow-sm">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat: any) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full font-medium whitespace-nowrap transition-all text-sm ${selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
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
                <div key={product.id} onClick={() => setSelectedProduct(product)} className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer ${!product.Stock ? 'opacity-60' : ''}`}>
                  <div className="flex gap-4 p-4">
                    <img src={product.image1} alt={product.Name} className="w-32 h-32 object-cover rounded-lg flex-shrink-0"/>

                    <div className="flex-1 flex flex-col">
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 text-base mb-1">{product.Name}</h3>

                        {/* 4) Description line from response JSON: show Category + tags */}
                        <div className="text-xs text-gray-500 mb-2">
                          <span className="font-medium">{product.Category}</span>
                          {product.tags && product.tags.length > 0 && <span>{' • '}{product.tags.slice(0,3).join(', ')}</span>}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {product.tags.map((tag: string, index: number) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">{tag}</span>
                          ))}
                        </div>

                        <p className="text-xs text-gray-500 mb-2">{/* old category removed from here - now shown as description above */}</p>
                      </div>

                      <div className="mt-auto">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-blue-600 font-bold text-xl">₹{discountedPrice.toFixed(2)}</span>
                          {product.Discount > 0 && <>
                            <span className="text-gray-400 line-through text-sm">₹{product.Rate}</span>
                            <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold">{product.Discount}% OFF</span>
                          </>}
                          {!product.Stock && <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold ml-auto">Out of Stock</span>}
                        </div>

                        {product.combo_quantity > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 mb-3">
                            <p className="text-orange-800 font-semibold text-xs">🎉 Buy {product.combo_quantity}+ get {product.combo_discount}% extra off!</p>
                          </div>
                        )}

                        <button onClick={(e) => addToCart(product, e)} disabled={!product.Stock} className={`w-full py-2 rounded-lg text-sm font-semibold ${product.Stock ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>{product.Stock ? 'Add to Cart' : 'Out of Stock'}</button>
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

/* end of file */
