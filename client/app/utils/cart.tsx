import AuthService from "../services/auth.service";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  qty: number;
  mainImage?: string;
  extra?: any;
};

// 取得動態 key：若使用者登入，用 userId 區分；否則用 guest
const getCartKey = () => {
  const userData = AuthService.getCurrentUser();
  const userId = userData?.user?._id || "guest";
  return `cartItems_${userId}_v1`;
};

// 取出 cart
export const getCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(getCartKey());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error("getCart parse error:", e);
    return [];
  }
};

// 儲存 cart
export const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem(getCartKey(), JSON.stringify(items));
    return items;
  } catch (e) {
    console.error("saveCart error:", e);
    return items;
  }
};

// 加入購物車
export const addToCart = (item: Omit<CartItem, "qty"> & { qty?: number }) => {
  const items = getCart();
  const qtyToAdd = item.qty ?? 1;
  const idx = items.findIndex((it) => it.id === item.id);

  if (idx >= 0) {
    items[idx].qty += qtyToAdd;
    items[idx].price = item.price ?? items[idx].price;
    if (item.discountPrice !== undefined)
      items[idx].discountPrice = item.discountPrice;
    if (item.mainImage) items[idx].mainImage = item.mainImage;
  } else {
    items.push({
      id: item.id,
      name: item.name,
      price: item.price,
      discountPrice: item.discountPrice,
      qty: qtyToAdd,
      mainImage: item.mainImage,
      extra: item.extra ?? {},
    });
  }

  saveCart(items);
  return items;
};

// 移除一筆商品
export const removeFromCart = (id: string) => {
  const filtered = getCart().filter((it) => it.id !== id);
  saveCart(filtered);
  return filtered;
};

// 更新數量
export const updateQuantity = (id: string, qty: number) => {
  const items = getCart();
  const idx = items.findIndex((it) => it.id === id);
  if (idx === -1) return items;

  if (qty <= 0) return removeFromCart(id);

  items[idx].qty = qty;
  saveCart(items);
  return items;
};

// 清空購物車（登出或結帳後）
export const clearCart = () => {
  try {
    localStorage.removeItem(getCartKey());
    return [];
  } catch (e) {
    console.error("clearCart error:", e);
    return [];
  }
};

// 計算總商品數
export const getCartCount = () => {
  return getCart().reduce((s, it) => s + (it.qty || 0), 0);
};

// 計算總價
export const getCartTotal = () => {
  const total = getCart().reduce((sum, it) => {
    const unit = it.discountPrice ?? it.price ?? 0;
    return sum + unit * (it.qty || 0);
  }, 0);
  return Math.round((total + Number.EPSILON) * 100) / 100;
};
