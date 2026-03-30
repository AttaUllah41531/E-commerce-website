import React, { createContext, useContext, useState, useEffect } from 'react';
import { getItems, getSales } from '../services/api';

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

function getStockStatus(stock, minStock) {
  if (stock === 0)
    return {
      label: "Out of Stock",
      color: "bg-red-100 text-red-700 border-red-200",
    };
  if (stock < minStock)
    return {
      label: "Low Stock",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    };
  if (stock < minStock * 1.5)
    return {
      label: "Medium",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    };
  return {
    label: "In Stock",
    color: "bg-green-100 text-green-700 border-green-200",
  };
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  
  // Sorting
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Cart
  const [cart, setCart] = useState([]);

  // Fetch logic
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, salesData] = await Promise.all([
        getItems(),
        getSales()
      ]);
      setProducts(productsData);
      setSales(salesData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Derived State: Filtering & Sorting
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product._id && product._id.toString().includes(searchTerm));
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    const status = getStockStatus(product.stock, product.minStock);
    const matchesStatus =
      statusFilter === "All" || status.label === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Cart Actions
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product._id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return prevCart;
        }
        return prevCart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
            : item
        );
      }
      return [
        ...prevCart,
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          costPrice: product.costPrice || 0,
          quantity: 1,
          subtotal: product.price,
          stock: product.stock, // Added for quantity limits
        },
      ];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId, delta, maxStock) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          if (newQty > 0 && newQty <= maxStock) {
            return { ...item, quantity: newQty, subtotal: newQty * item.price };
          }
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const value = {
    products, setProducts,
    sales, setSales,
    loading,
    fetchData,
    categories,
    filteredProducts: sortedProducts, // We expose the sorted & filtered list
    searchTerm, setSearchTerm,
    categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    sortConfig, setSortConfig,
    currentPage, setCurrentPage,
    itemsPerPage, setItemsPerPage,
    cart, addToCart, removeFromCart, updateQuantity, clearCart,
    getStockStatus
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}
