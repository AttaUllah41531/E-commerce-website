import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Storefront } from "./pages/Storefront";

import { CartModal } from "./components/CartModal";
import { ProductModal } from "./components/ProductModal";
import { ReceiptModal } from "./components/ReceiptModal";
import { EditSaleModal } from "./components/EditSaleModal";
import { ExportModal } from "./components/ExportModal";
import { ShiftModal } from "./components/ShiftModal";
import { AuthGuardModal } from "./components/auth/AuthGuardModal";
import { useUser } from "./contexts/UserContext";
import { LoginView } from "./components/auth/LoginView";

import { useProducts } from "./contexts/ProductContext";
import { useShift } from "./contexts/ShiftContext";
import { 
  createItem, 
  updateItem, 
  deleteItem as apiDeleteItem, 
  createSale, 
  deleteSale, 
  updateSale,
  returnSale
} from "./services/api";

import { toast, Toaster } from "sonner";
import Swal from "sweetalert2";

export default function App() {
  const { user, loading: userLoading } = useUser();
  const { cart, clearCart, fetchData, sales } = useProducts();

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastSale, setLastSale] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isEditSaleModalOpen, setIsEditSaleModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [prefilledData, setPrefilledData] = useState(null);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authAction, setAuthAction] = useState({ callback: null, title: "", message: "" });

  if (userLoading) return null;
  if (!user) return <LoginView />;

  // Stats for Navbar
  const totalValue = 0; // or calculated natively from products
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisYear = new Date(today.getFullYear(), 0, 1);

  const filterSales = (minDate) => sales.filter(s => new Date(s.saleDate) >= minDate);
  const sumSales = (filtered) => filtered.filter(s => s.status !== 'returned').reduce((sum, sale) => sum + sale.totalAmount, 0);
  const sumProfit = (filtered) => filtered.filter(s => s.status !== 'returned').reduce((sum, sale) => sum + (sale.totalProfit || 0), 0);
  const sumReturns = (filtered) => filtered.filter(s => s.status === 'returned').reduce((sum, sale) => sum + sale.totalAmount, 0);

  const dailySalesList = filterSales(today);
  const monthlySalesList = filterSales(thisMonth);
  const yearlySalesList = filterSales(thisYear);

  // Handlers for Modals
  const handleAddProduct = async (productData) => {
    try {
      await createItem(productData);
      toast.success("Product added successfully!");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  // Anti-Theft Auth Helper
  const requireAuth = (callback, title, message) => {
    setAuthAction({ callback, title, message });
    setIsAuthModalOpen(true);
  };

  const handleEditProductSubmit = async (productData) => {
    requireAuth(async (pw) => {
      try {
        await updateItem(editingProduct._id, productData, pw);
        toast.success("Product updated successfully!");
        setIsEditModalOpen(false);
        fetchData();
      } catch (err) {
        toast.error(err.message || "Failed to update product");
      }
    }, "Authorize Update", "Owner permission required to edit stock/price.");
  };

  const handleDeleteProduct = async (id) => {
    requireAuth(async (pw) => {
      try {
        await apiDeleteItem(id, pw);
        toast.success("Product deleted successfully!");
        fetchData();
      } catch (err) {
        toast.error(err.message || "Failed to delete product");
      }
    }, "Authorize Deletion", "Owner permission required to delete inventory items.");
  };

  const checkoutCart = async () => {
    try {
      const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);
      const totalProfit = cart.reduce((sum, item) => sum + ((item.price - (item.costPrice || 0)) * item.quantity), 0);

      const saleData = {
        items: cart.map(({ productId, name, price, costPrice, quantity, subtotal }) => ({
          productId,
          name,
          price,
          costPrice,
          quantity,
          subtotal,
          profit: (price - (costPrice || 0)) * quantity
        })),
        totalAmount,
        totalProfit,
        cashierId: user.id
      };

      const newSale = await createSale(saleData);
      setLastSale(newSale);
      toast.success("Sale completed successfully!");
      clearCart();
      setIsCartOpen(false);
      fetchData();
      setTimeout(() => setIsReceiptOpen(true), 300);
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed. Please check stock levels.");
    }
  };

  const handleDeleteSale = async (saleId) => {
    requireAuth(async (pw) => {
      try {
        await deleteSale(saleId, pw);
        toast.success("Sale record deleted!");
        fetchData();
      } catch (err) {
        toast.error(err.message || "Unauthorized delete");
      }
    }, "Confirm Destruction", "Deleting a sale reverses stock. Owner password required.");
  };

  const handleReturnSale = async (saleId, reason) => {
    requireAuth(async (pw) => {
      try {
        await returnSale(saleId, { reason }, pw);
        toast.success("Sale returned & stock restored!");
        fetchData();
      } catch (err) {
        toast.error(err.message || "Unauthorized return");
      }
    }, "Authorize Return", "Marking a sale as returned will restore stock and adjust cash.");
  };

  const handleEditSaleSubmit = async (saleId, updatedItems) => {
    requireAuth(async (pw) => {
      try {
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
        const totalProfit = updatedItems.reduce((sum, item) => sum + ((item.price - (item.costPrice || 0)) * item.quantity), 0);
        await updateSale(saleId, { items: updatedItems, totalAmount, totalProfit }, pw);
        toast.success("Sale updated successfully!");
        setIsEditSaleModalOpen(false);
        fetchData();
      } catch (err) {
        toast.error("Update failed. Check stock or authorization.");
      }
    }, "Authorize Edit", "Modifying completed sales requires owner verification.");
  };

  return (
    <div className="flex bg-gray-50 min-h-screen w-full relative">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <Navbar 
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
          onCartClick={() => setIsCartOpen(true)}
          onAddProduct={() => setIsAddModalOpen(true)}
          onNewSale={() => setIsCartOpen(true)}
          onExport={() => setIsExportModalOpen(true)}
          onShiftClick={() => setIsShiftModalOpen(true)}
          dailySales={sumSales(dailySalesList)}
          monthlySales={sumSales(monthlySalesList)}
          yearlySales={sumSales(yearlySalesList)}
          dailyProfit={sumProfit(dailySalesList)}
          monthlyProfit={sumProfit(monthlySalesList)}
          yearlyProfit={sumProfit(yearlySalesList)}
        />
        
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-6">
          <Routes>
            <Route path="/" element={
              <AdminDashboard 
                onAddProduct={() => setIsAddModalOpen(true)}
                onEditProduct={(p) => { setEditingProduct(p); setIsEditModalOpen(true); }}
                onDeleteProduct={handleDeleteProduct}
                onViewProduct={(p) => { setEditingProduct(p); setIsViewModalOpen(true); }}
                onExport={() => setIsExportModalOpen(true)}
                onEditSale={(sale) => { setEditingSale(sale); setIsEditSaleModalOpen(true); }}
                onDeleteSale={handleDeleteSale}
                onReturnSale={handleReturnSale}
              />
            } />
            
            <Route path="/store" element={<Storefront onAdd={() => { setPrefilledData(null); setIsAddModalOpen(true); }} />} />
            <Route path="/store/category/:category" element={<Storefront onAdd={(cat) => { setPrefilledData({ category: cat }); setIsAddModalOpen(true); }} />} />
            <Route path="/store/status/:status" element={<Storefront onAdd={() => { setPrefilledData(null); setIsAddModalOpen(true); }} />} />
          </Routes>
          </div>
        </main>

        <Footer />
      </div>

      {/* Modals */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={checkoutCart}
      />

      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setPrefilledData(null);
        }}
        onSave={handleAddProduct}
        product={prefilledData}
        title="Add New Product"
        mode="add"
      />

      {editingProduct && (
        <>
          <ProductModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setTimeout(() => setEditingProduct(null), 300);
            }}
            onSave={handleEditProductSubmit}
            product={editingProduct}
            title="Edit Product"
            mode="edit"
          />

          <ProductModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setTimeout(() => setEditingProduct(null), 300);
            }}
            product={editingProduct}
            title="Product Details"
            mode="view"
          />
        </>
      )}

      {/* Receipt Modal */}
      <ReceiptModal 
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        sale={lastSale}
      />

      <EditSaleModal
        isOpen={isEditSaleModalOpen}
        onClose={() => setIsEditSaleModalOpen(false)}
        sale={editingSale}
        onSave={handleEditSaleSubmit}
      />

      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        products={useProducts().products}
        categories={useProducts().categories}
      />

      <ShiftModal 
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
      />

      <AuthGuardModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title={authAction.title}
        message={authAction.message}
        onConfirm={authAction.callback}
      />
    </div>
  );
}
