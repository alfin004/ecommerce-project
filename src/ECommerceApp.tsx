
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, ChevronLeft, Info, X } from 'lucide-react';

/**
 Updates:
 - Checkout opens as a full-page instead of modal (with Back and Close buttons)
 - Checkbox is placed at the top of the checkout text
 - Button text changed to "Send Order via WhatsApp"
 - Cart becomes a responsive drawer on mobile (full screen) to avoid invisibility
 - Searchbar responsive: full width on mobile, constrained on desktop
 - Green notification z-index increased so it's visible
*/

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
    { id:1, Name:"KFC Hot & Crispy Chicken (2 Pc)", Rate:249, Discount:10, combo_quantity:3, combo_discount:15, Category:"Chicken", Stock:true, tags:["Spicy","Crispy","Best Seller"], image1:"https://cdn.pixabay.com/photo/2022/04/25/16/34/food-7156399_1280.png" },
    { id:2, Name:"KFC Chicken Bucket (6 Pc)", Rate:599, Discount:50, combo_quantity:2, combo_discount:10, Category:"Bucket Meals", Stock:true, tags:["Sharing","Value Pack","Family"], image1:"https://cdn.pixabay.com/photo/2013/07/13/01/24/chicken-155680_1280.png" },
    { id:3, Name:"KFC Chicken Popcorn Regular", Rate:129, Discount:0, combo_quantity:2, combo_discount:5, Category:"Snacks", Stock:true, tags:["Kids Favorite","Crispy","Snack"], image1:"https://cdn.pixabay.com/photo/2022/10/16/15/42/popcorn-7525406_1280.png" },
    { id:4, Name:"KFC Zinger Burger", Rate:169, Discount:0, combo_quantity:2, combo_discount:10, Category:"Burgers", Stock:true, tags:["Popular","Spicy","Bun"], image1:"https://cdn.pixabay.com/photo/2023/06/28/10/27/hamburger-8094087_1280.png" }
  ]
};

function applyDiscountsPerUnit(item:any, quantity:number) {
  const afterItem = item.Rate - (item.Rate * (item.Discount || 0) / 100);
  if (item.combo_quantity && quantity >= item.combo_quantity) {
    return afterItem - (afterItem * (item.combo_discount || 0) / 100);
  }
  return afterItem;
}

export default function ECommerceApp() {
  const [shopData, setShopData] = useState<any|null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckoutPage, setShowCheckoutPage] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showShopInfoModal, setShowShopInfoModal] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);

  useEffect(()=> {
    const params = new URLSearchParams(window.location.search);
    const user = params.get('customer_name');
    if (user) {
      fetch(`https://api.zentroxs.online/getitems?shop_username=${encodeURIComponent(user)}`, { headers:{accept:'application/json'} })
        .then(r=> r.ok ? r.json() : Promise.reject())
        .then(json=> setShopData(json))
        .catch(()=> setShopData(kfcMock));
    } else {
      setShopData(kfcMock);
    }
  },[]);

  if(!shopData) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  const categories = ['All', ...Array.from(new Set(shopData.Items.map((i:any)=> i.Category)))];

  function addToCart(product:any, e?:React.MouseEvent){
    if(e) e.stopPropagation();
    if(!product.Stock) return;
    const ex = cart.find(c=> c.id === product.id);
    if(ex) setCart(cart.map(c=> c.id===product.id ? {...c, quantity:c.quantity+1} : c));
    else setCart([...cart, {...product, quantity:1}]);
    setShowCartNotification(true);
    setTimeout(()=> setShowCartNotification(false), 1400);
  }

  function updateQuantity(id:number, delta:number){
    setCart(cart.map(c=> c.id===id ? {...c, quantity: Math.max(0, c.quantity+delta)} : c).filter(c=> c.quantity>0));
  }
  function removeFromCart(id:number){ setCart(cart.filter(c=> c.id !== id)); }

  const cartItemCount = cart.reduce((s,c)=> s + (c.quantity||0), 0);
  const cartTotal = cart.reduce((t,c)=> t + applyDiscountsPerUnit(c, c.quantity||1) * (c.quantity||1), 0);

  function openCheckoutPage(){
    setShowCheckoutPage(true);
  }

  function handleWhatsAppOrder(){
    if(!consentChecked) return;
    let msg = `Order for ${shopData.BusinessName}\n\n`;
    cart.forEach((c, idx) => {
      const comboApplied = c.combo_quantity && c.quantity >= c.combo_quantity;
      const unit = applyDiscountsPerUnit(c, c.quantity || 1);
      const lineTotal = unit * (c.quantity || 1);
      msg += `${idx+1}. ${c.Name}: ₹${unit.toFixed(2)} × ${c.quantity} = ₹${lineTotal.toFixed(2)}${comboApplied ? ' (combo applied)' : ''}\n`;
    });
    msg += `\nSubtotal: ₹${cartTotal.toFixed(2)}`;
    msg += `\nConvenience: ₹${shopData.ConvenienceFee.toFixed(2)}`;
    msg += `\nTotal: ₹${(cartTotal + shopData.ConvenienceFee).toFixed(2)}`;
    window.open(`https://wa.me/${shopData.MobileNo.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`, '_blank');
    setShowCheckoutPage(false);
    setConsentChecked(false);
  }

  const filtered = shopData.Items.filter((p:any)=> (selectedCategory==='All' || p.Category===selectedCategory) && p.Name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* notification - higher z-index so it's always visible */}
      {showCartNotification && <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded z-50 shadow-lg">Added to cart</div>}

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-white flex items-center gap-4">
        <div className="text-2xl font-bold">{shopData.BusinessName}</div>

        {/* responsive search: full width on mobile, limited on desktop */}
        <div className="flex-1">
          <div className="max-w-full md:max-w-lg mx-auto">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-3 text-gray-400" />
              <input
                value={searchQuery}
                onChange={e=>setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-black"
                style={{ minWidth: 0 }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={()=>setShowCart(true)} className="relative">
            <ShoppingCart size={20} />
            {cartItemCount>0 && <span className="absolute -top-2 -right-2 bg-white text-blue-600 w-5 h-5 rounded-full flex items-center justify-center text-xs">{cartItemCount}</span>}
          </button>
        </div>
      </header>

      {/* Categories */}
      <div className="p-4">
        <div className="flex gap-3 mb-4 overflow-x-auto">
          {categories.map(c=> <button key={c} onClick={()=>setSelectedCategory(c)} className={`px-3 py-1 rounded ${selectedCategory===c? 'bg-blue-600 text-white':'bg-gray-100'}`}>{c}</button>)}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p:any)=>{
            const price = applyDiscountsPerUnit(p, 1);
            return (
              <div key={p.id} className="relative bg-white rounded-lg shadow p-4">
                {p.Discount>0 && (
                  <div className="absolute left-0 top-0 -translate-x-3 -translate-y-3">
                    <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded transform rotate-12 shadow">
                      {p.Discount}% OFF
                    </div>
                  </div>
                )}

                <img src={p.image1} alt={p.Name} className="w-full h-36 object-cover rounded mb-3" />
                <h3 className="font-semibold">{p.Name}</h3>
                <p className="text-xs text-gray-500">{p.Category} • {p.tags?.slice(0,3).join(', ')}</p>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-blue-600 font-bold text-lg">₹{price.toFixed(2)}</div>
                    {p.Discount>0 && <div className="text-gray-400 line-through text-sm">₹{p.Rate}</div>}
                  </div>
                </div>

                <div className="mt-4">
                  {p.combo_quantity>0 && (
                    <div className="mb-3">
                      <div className="bg-orange-50 border border-orange-200 rounded p-2 text-xs text-orange-800">
                        🎉 Buy {p.combo_quantity}+ get {p.combo_discount}% extra off (on top of item discount)
                      </div>
                    </div>
                  )}

                  <button onClick={(e)=>addToCart(p,e)} className="w-full bg-blue-600 text-white py-2 rounded">{p.Stock? 'Add to Cart':'Out of Stock'}</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart modal / drawer */}
      {showCart && (
        <div className="fixed inset-0 z-40 flex">
          {/* overlay hidden on small screens to allow full-screen drawer */}
          <div className="hidden md:block flex-1 bg-black bg-opacity-40" onClick={()=>setShowCart(false)} />
          <div className="w-full md:w-96 bg-white shadow-lg p-4 overflow-auto h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Cart</h2>
              <div className="flex items-center gap-2">
                <button onClick={()=>setShowCart(false)} className="px-3 py-1 rounded bg-gray-100">Close</button>
                <button onClick={openCheckoutPage} className="px-3 py-1 rounded bg-blue-600 text-white">Checkout</button>
              </div>
            </div>

            {cart.length===0 ? (
              <div className="text-center text-gray-500">No items</div>
            ) : (
              <div className="space-y-3">
                {cart.map(c=>{
                  const unit = applyDiscountsPerUnit(c, c.quantity||1);
                  const comboApplied = c.combo_quantity && c.quantity >= c.combo_quantity;
                  return (
                    <div key={c.id} className="flex justify-between items-center border rounded p-3">
                      <div>
                        <div className="font-medium">{c.Name}: ₹{unit.toFixed(2)} × {c.quantity}</div>
                        {comboApplied && <div className="text-xs text-green-700 font-semibold">Combo applied: {c.combo_discount}%</div>}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₹{(unit * c.quantity).toFixed(2)}</div>
                        <div className="flex items-center gap-2 mt-2 justify-end">
                          <button onClick={()=>updateQuantity(c.id,-1)} className="px-2 py-1 bg-gray-100 rounded">-</button>
                          <span>{c.quantity}</span>
                          <button onClick={()=>updateQuantity(c.id,1)} className="px-2 py-1 bg-gray-100 rounded">+</button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-between font-semibold">
                  <div>Subtotal</div>
                  <div>₹{cartTotal.toFixed(2)}</div>
                </div>
                <div className="flex justify-between">
                  <div>Convenience</div>
                  <div>₹{shopData.ConvenienceFee.toFixed(2)}</div>
                </div>
                <div className="flex justify-between font-bold">
                  <div>Total</div>
                  <div>₹{(cartTotal + shopData.ConvenienceFee).toFixed(2)}</div>
                </div>

                {/* Checkbox at top of the confirmation text area - updated per request */}
                <div className="mt-2">
                  <label className="flex items-center gap-2 mb-2">
                    <input type="checkbox" checked={consentChecked} onChange={e=>setConsentChecked(e.target.checked)} />
                    <span className="text-sm">I understand that my order will be sent directly to the vendor via WhatsApp. Final prices may vary and the order is considered confirmed only after vendor acknowledges it.</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button onClick={()=>setShowCart(false)} className="flex-1 py-2 rounded border">Cancel</button>
                  <button onClick={openCheckoutPage} className="flex-1 py-2 rounded bg-green-600 text-white" disabled={!consentChecked}>Send Order via WhatsApp</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout as full page */}
      {showCheckoutPage && (
        <div className="fixed inset-0 z-50 bg-white overflow-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={()=>{ setShowCheckoutPage(false); setShowCart(true); }} className="px-3 py-1 rounded bg-gray-100">Back</button>
              <h2 className="text-lg font-semibold">Checkout</h2>
            </div>
            <button onClick={()=>{ setShowCheckoutPage(false); setShowCart(false); }} className="px-3 py-1 rounded bg-gray-100">Close</button>
          </div>

          {cart.length===0 ? (
            <div className="text-center text-gray-500">No items</div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Checkbox at top of text (per request) */}
              <div className="p-4 bg-gray-50 rounded">
                <label className="flex items-start gap-3">
                  <input type="checkbox" checked={consentChecked} onChange={e=>setConsentChecked(e.target.checked)} className="mt-1" />
                  <div>
                    <p className="text-sm text-gray-700">I understand that my order will be sent directly to the vendor via WhatsApp. Final prices may vary and the order is considered confirmed only after vendor acknowledges it.</p>
                  </div>
                </label>
              </div>

              {cart.map(c=>{
                const unit = applyDiscountsPerUnit(c, c.quantity||1);
                const comboApplied = c.combo_quantity && c.quantity >= c.combo_quantity;
                return (
                  <div key={c.id} className="border rounded p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{c.Name}: ₹{unit.toFixed(2)} × {c.quantity}</div>
                      {comboApplied && <div className="text-xs text-green-700 font-semibold mt-1">Combo applied: {c.combo_discount}%</div>}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">₹{(unit * c.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between font-semibold">
                <div>Subtotal</div>
                <div>₹{cartTotal.toFixed(2)}</div>
              </div>
              <div className="flex justify-between">
                <div>Convenience</div>
                <div>₹{shopData.ConvenienceFee.toFixed(2)}</div>
              </div>
              <div className="flex justify-between font-bold">
                <div>Total</div>
                <div>₹{(cartTotal + shopData.ConvenienceFee).toFixed(2)}</div>
              </div>

              <div className="flex gap-2">
                <button onClick={()=>{ setShowCheckoutPage(false); }} className="flex-1 py-2 rounded border">Back</button>
                <button onClick={handleWhatsAppOrder} className="flex-1 py-2 rounded bg-green-600 text-white" disabled={!consentChecked}>Send Order via WhatsApp</button>
              </div>
            </div>
          )}
        </div>
      )}

      {showShopInfoModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <button className="absolute right-4 top-4" onClick={()=>setShowShopInfoModal(false)}><X /></button>
            <h3 className="text-lg font-semibold mb-2">{shopData.BusinessName}</h3>
            <div className="text-sm text-gray-700 mb-1"><strong>Type:</strong> {shopData.BusinessType}</div>
            <div className="text-sm text-gray-700 mb-1"><strong>Address:</strong> {shopData.Address}</div>
            <div className="text-sm text-gray-700 mb-1"><strong>Phone:</strong> {shopData.MobileNo}</div>
          </div>
        </div>
      )}
    </div>
  );
}
