
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, MapPin, Phone, ChevronLeft, Info, X } from 'lucide-react';

/* Updated ECommerceApp.tsx with:
   - ribbon discount badge
   - combo tag moved to bottom area
   - checkout shows combo applied label
*/

/* Mock data */
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
    { id:1, Name:"KFC Hot & Crispy Chicken (2 Pc)", Rate:249, Discount:10, combo_quantity:3, combo_discount:15, Category:"Chicken", Stock:true, tags:["Spicy","Crispy","Best Seller"], image1:"https://via.placeholder.com/200x200/FF0000/FFFFFF?text=Hot+Crispy", image2:"", video:"" },
    { id:2, Name:"KFC Chicken Bucket (6 Pc)", Rate:599, Discount:50, combo_quantity:2, combo_discount:10, Category:"Bucket Meals", Stock:true, tags:["Sharing","Value Pack","Family"], image1:"https://via.placeholder.com/200x200/FF9900/FFFFFF?text=Chicken+Bucket", image2:"", video:"" },
    { id:3, Name:"KFC Chicken Popcorn Regular", Rate:129, Discount:0, combo_quantity:2, combo_discount:5, Category:"Snacks", Stock:true, tags:["Kids Favorite","Crispy","Snack"], image1:"https://via.placeholder.com/200x200/FF66CC/FFFFFF?text=Popcorn", image2:"", video:"" },
    { id:4, Name:"KFC Zinger Burger", Rate:169, Discount:0, combo_quantity:2, combo_discount:10, Category:"Burgers", Stock:true, tags:["Popular","Spicy","Bun"], image1:"https://via.placeholder.com/200x200/33CC33/FFFFFF?text=Zinger+Burger", image2:"", video:"" }
  ]
};

function applyDiscountsPerUnit(item:any, quantity:number) {
  const afterItem = item.Rate - (item.Rate * (item.Discount || 0) / 100);
  if (item.combo_quantity && quantity >= item.combo_quantity) {
    return afterItem - (afterItem * (item.combo_discount || 0) / 100);
  }
  return afterItem;
}

export default function ECommerceApp(){
  const [shopData, setShopData] = useState<any|null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showShopInfoModal, setShowShopInfoModal] = useState(false);
  const [showCartNotification, setShowCartNotification] = useState(false);

  useEffect(()=> {
    const params = new URLSearchParams(window.location.search);
    const user = params.get('customer_name');
    if (user) {
      fetch(`http://13.233.199.188:9000/getitems?shop_username=${encodeURIComponent(user)}`, { headers:{accept:'application/json'} })
        .then(r=>r.ok? r.json(): Promise.reject())
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
    const ex = cart.find(c=>c.id===product.id);
    if(ex) setCart(cart.map(c=> c.id===product.id? {...c, quantity:c.quantity+1}: c));
    else setCart([...cart, {...product, quantity:1}]);
    setShowCartNotification(true);
    setTimeout(()=> setShowCartNotification(false), 1200);
  }

  function updateQuantity(id:number, delta:number){
    setCart(cart.map(c=> c.id===id? {...c, quantity: Math.max(0, c.quantity+delta)}: c).filter(c=> c.quantity>0));
  }
  function removeFromCart(id:number){ setCart(cart.filter(c=> c.id !== id)); }

  const cartItemCount = cart.reduce((s,c)=> s + (c.quantity||0), 0);
  const cartTotal = cart.reduce((t,c)=> t + applyDiscountsPerUnit(c, c.quantity||1) * (c.quantity||1), 0);

  function handleCheckout(){ setShowCheckoutDialog(true); setConsentChecked(false); }

  function handleWhatsAppOrder(){
    if(!consentChecked) return;
    let msg=`Order from ${shopData.BusinessName}\n`;
    cart.forEach((c,idx)=> {
      const comboApplied = c.combo_quantity && c.quantity >= c.combo_quantity;
      const unit = applyDiscountsPerUnit(c, c.quantity||1);
      msg += `${idx+1}. ${c.Name} x ${c.quantity} = ₹${(unit*c.quantity).toFixed(2)}${comboApplied? ' (combo applied)':''}\n`;
    });
    msg += `Total: ₹${cartTotal.toFixed(2)}\nConvenience: ₹${shopData.ConvenienceFee}`;
    window.open(`https://wa.me/${shopData.MobileNo.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`, '_blank');
    setShowCheckoutDialog(false);
  }

  const filtered = shopData.Items.filter((p:any)=> (selectedCategory==='All' || p.Category===selectedCategory) && p.Name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {showCartNotification && <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded">Added</div>}

      <header className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-white flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{shopData.BusinessName}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-white/80" />
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search products..." className="pl-10 pr-4 py-2 rounded-lg text-black" />
          </div>
          <button onClick={()=>setShowCart(true)} className="relative">
            <ShoppingCart size={20} />
            {cartItemCount>0 && <span className="absolute -top-2 -right-2 bg-white text-blue-600 w-5 h-5 rounded-full flex items-center justify-center text-xs">{cartItemCount}</span>}
          </button>
        </div>
      </header>

      <div className="p-4">
        <div className="flex gap-3 mb-4">
          {categories.map(c=> <button key={c} onClick={()=>setSelectedCategory(c)} className={`px-3 py-1 rounded ${selectedCategory===c? 'bg-blue-600 text-white':'bg-gray-100'}`}>{c}</button>)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p:any)=>{
            const price = applyDiscountsPerUnit(p, 1);
            return (
              <div key={p.id} className="relative bg-white rounded-lg shadow p-4">
                {/* Ribbon */}
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

                {/* Combo moved to bottom area so button aligns */}
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

      {/* Cart view as modal-like */}
      {showCart && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Cart</h2>
              <div className="flex items-center gap-2">
                <button onClick={()=>setShowCart(false)} className="px-3 py-1 rounded bg-gray-100">Close</button>
                <button onClick={handleCheckout} className="px-3 py-1 rounded bg-blue-600 text-white">Checkout</button>
              </div>
            </div>

            {cart.length===0 ? (
              <div className="text-center text-gray-500">No items</div>
            ) : (
              <div className="space-y-3">
                {cart.map(c=>{
                  const unit = applyDiscountsPerUnit(c, c.quantity);
                  const comboApplied = c.combo_quantity && c.quantity >= c.combo_quantity;
                  return (
                    <div key={c.id} className="flex justify-between items-center border rounded p-3">
                      <div>
                        <div className="font-medium">{c.Name} x {c.quantity}</div>
                        {comboApplied && <div className="text-xs text-green-700">Combo applied: {c.combo_discount}%</div>}
                      </div>
                      <div>
                        <div>₹{(unit * c.quantity).toFixed(2)}</div>
                        <div className="flex items-center gap-2 mt-2">
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
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={consentChecked} onChange={e=>setConsentChecked(e.target.checked)} />
                  <span>I confirm this order</span>
                </label>

                <div className="flex gap-2">
                  <button onClick={()=>setShowCart(false)} className="flex-1 py-2 rounded border">Cancel</button>
                  <button onClick={handleWhatsAppOrder} className="flex-1 py-2 rounded bg-green-600 text-white" disabled={!consentChecked}>Send via WhatsApp</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Shop info modal */}
      {showShopInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
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
