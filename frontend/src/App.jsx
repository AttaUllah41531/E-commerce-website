import { Routes, Route, Navigate } from "react-router-dom";

import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Storefront } from "./pages/Storefront";
import { TeamView } from "./pages/TeamView";

import { CartModal } from "./components/CartModal";
import { ProductModal } from "./components/ProductModal";
import { ReceiptModal } from "./components/ReceiptModal";
import { EditSaleModal } from "./components/EditSaleModal";
import { ExportModal } from "./components/ExportModal";
import { ShiftModal } from "./components/ShiftModal";
import { AuthGuardModal } from "./components/auth/AuthGuardModal";
import { useUser } from "./contexts/UserContext";
import { useModals } from "./contexts/ModalContext";
import { LoginView } from "./components/auth/LoginView";
import { SettingsView } from "./pages/SettingsView";

import { useProducts } from "./contexts/ProductContext";

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


export default function App() {
  const { user, isAdmin, loading: userLoading } = useUser();
  const { cart, clearCart, fetchData, sales } = useProducts();
  const { modals, activeData, openModal, closeModal } = useModals();

  if (userLoading) return null;
  if (!user) return <LoginView />;


  // Stats for Navbar
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisYear = new Date(today.getFullYear(), 0, 1);

  const filterSales = (minDate) => sales.filter(s => new Date(s.saleDate) >= minDate);
  const sumSales = (filtered) => filtered.filter(s => s.status !== 'returned').reduce((sum, sale) => sum + sale.totalAmount, 0);


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

  const handleEditProductSubmit = async (productData) => {
    requireAuth(async (pw) => {
      try {
        await updateItem(activeData.product._id, productData, pw, user?.role);
        toast.success("Product updated successfully!");
        closeModal("editProduct");
        fetchData();
      } catch (err) {
        toast.error(err.message || "Failed to update product");
      }
    }, "Authorize Update", "Owner permission required to edit stock/price.");
  };

  const handleDeleteProduct = async (id) => {
    requireAuth(async (pw) => {
      try {
        await apiDeleteItem(id, pw, user?.role);
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
        cashierId: user.id,
        cashierName: user.fullName
      };

      const newSale = await createSale(saleData);
      openModal("receipt", newSale);
      toast.success("Sale completed successfully!");
      clearCart();
      closeModal("cart");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed. Please check stock levels.");
    }
  };


  const handleDeleteSale = async (saleId) => {
    requireAuth(async (pw) => {
      try {
        await deleteSale(saleId, pw, user?.role);
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
        await returnSale(saleId, { reason }, pw, user?.role);
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
        await updateSale(saleId, { items: updatedItems, totalAmount, totalProfit }, pw, user?.role);
        toast.success("Sale updated successfully!");
        closeModal("editSale");
        fetchData();
      } catch (err) {
        toast.error("Update failed. Check stock or authorization.");
      }
    }, "Authorize Edit", "Modifying completed sales requires owner verification.");
  };

  // Modernized requireAuth helper
  const requireAuth = (callback, title, message) => {
    const role = user?.role?.toLowerCase();
    const isSystemAdmin = ['admin', 'system admin'].includes(role);

    if (isSystemAdmin) {
      return callback('');
    }
    openModal("auth", { callback, title, message });
  };


  return (
    <div className="flex bg-gray-50 dark:bg-[#030213] min-h-screen w-full relative">
      <Toaster position="top-right" richColors />

      {/* Sidebar Navigation */}
      <Sidebar isMobileOpen={modals.mobileMenu} onCloseMobile={() => closeModal("mobileMenu")} />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full relative">
        <Navbar
          cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
          onCartClick={() => openModal("cart")}
          onAddProduct={() => openModal("addProduct")}
          onNewSale={() => openModal("cart")}
          onExport={() => openModal("export")}
          onShiftClick={() => openModal("shift")}
          dailySales={sumSales(dailySalesList)}
          monthlySales={sumSales(monthlySalesList)}
          yearlySales={sumSales(yearlySalesList)}
          onMenuClick={() => openModal("mobileMenu")}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50 scrollbar-hide">
          <div className="max-w-7xl mx-auto space-y-6">
            <Routes>
              <Route path="/" element={
                <AdminDashboard
                  onAddProduct={() => openModal("addProduct")}
                  onEditProduct={(p) => openModal("editProduct", p)}
                  onDeleteProduct={handleDeleteProduct}
                  onViewProduct={(p) => openModal("viewProduct", p)}
                  onExport={() => openModal("export")}
                  onEditSale={(sale) => openModal("editSale", sale)}
                  onDeleteSale={handleDeleteSale}
                  onReturnSale={handleReturnSale}
                  onViewSale={(sale) => openModal("receipt", sale)}
                />
              } />

              <Route path="/store" element={<Storefront onAdd={() => openModal("addProduct")} />} />
              <Route path="/store/category/:category" element={<Storefront onAdd={(cat) => openModal("addProduct", { category: cat })} />} />
              <Route path="/store/status/:status" element={<Storefront onAdd={() => openModal("addProduct")} />} />
              <Route path="/settings" element={<SettingsView />} />
              <Route path="/team" element={isAdmin() ? <TeamView /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </main>


        <Footer />
      </div>

      {/* Modals */}
      <CartModal
        isOpen={modals.cart}
        onClose={() => closeModal("cart")}
        onCheckout={checkoutCart}
      />

      <ProductModal
        isOpen={modals.addProduct}
        onClose={() => closeModal("addProduct")}
        onSave={handleAddProduct}
        product={activeData.prefilledProduct}
        title="Add New Product"
        mode="add"
      />

      <ProductModal
        isOpen={modals.editProduct}
        onClose={() => closeModal("editProduct")}
        onSave={handleEditProductSubmit}
        product={activeData.product}
        title="Edit Product"
        mode="edit"
      />

      <ProductModal
        isOpen={modals.viewProduct}
        onClose={() => closeModal("viewProduct")}
        product={activeData.product}
        title="Product Details"
        mode="view"
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={modals.receipt}
        onClose={() => closeModal("receipt")}
        sale={activeData.sale}
      />

      <EditSaleModal
        isOpen={modals.editSale}
        onClose={() => closeModal("editSale")}
        sale={activeData.sale}
        onSave={handleEditSaleSubmit}
      />

      <ExportModal
        isOpen={modals.export}
        onClose={() => closeModal("export")}
        products={useProducts().products}
        sales={useProducts().sales}
        categories={useProducts().categories}
      />

      <ShiftModal
        isOpen={modals.shift}
        onClose={() => closeModal("shift")}
      />

      <AuthGuardModal
        isOpen={modals.auth}
        onClose={() => closeModal("auth")}
        title={activeData.authAction.title}
        message={activeData.authAction.message}
        onConfirm={activeData.authAction.callback}
      />

    </div>
  );
}
