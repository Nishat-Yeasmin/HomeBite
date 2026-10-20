const CART_KEY = "homebite-cart";

export const getCart = () => {
  if (typeof window === "undefined") return [];

  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    return [];
  }
};

export const saveCart = (cart) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(CART_KEY, JSON.stringify(cart));

  window.dispatchEvent(new Event("homebite-cart-updated"));
};

export const addToCart = (food) => {
  const cart = getCart();

  const existingItem = cart.find(
    (item) => String(item.id) === String(food.id)
  );

  let updatedCart;

  if (existingItem) {
    updatedCart = cart.map((item) =>
      String(item.id) === String(food.id)
        ? {
            ...item,
            quantity: item.quantity + 1,
          }
        : item
    );
  } else {
    updatedCart = [
      ...cart,
      {
        id: food.id,
        name: food.name,
        price: Number(food.price),
        image: food.image,
        category: food.category || "Homemade Food",
        quantity: 1,
      },
    ];
  }

  saveCart(updatedCart);
};

export const updateCartQuantity = (id, quantity) => {
  const cart = getCart();

  const updatedCart = cart
    .map((item) =>
      String(item.id) === String(id)
        ? {
            ...item,
            quantity: Math.max(1, quantity),
          }
        : item
    )
    .filter((item) => item.quantity > 0);

  saveCart(updatedCart);
};

export const removeFromCart = (id) => {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => String(item.id) !== String(id)
  );

  saveCart(updatedCart);
};

export const clearCart = () => {
  saveCart([]);
};

export const getCartCount = () => {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
};