import { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, Trash2, AlertCircle, ShoppingBag, ShieldCheck } from "lucide-react";
import { uploadImages } from "../services/api";

export function ProductModal({ isOpen, onClose, onSave, product, mode, categories = [] }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: 0,
    minStock: 0,
    price: 0,
    costPrice: 0,
    images: [],
    description: "",
    mfgDate: "",
    expiryDate: "",
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const fileInputRef = useRef(null);

  // Sync form with product prop
  useEffect(() => {
    if (isOpen) {
      if (product && mode !== "add") {
        setFormData({
          name: product.name || "",
          category: product.category || "",
          stock: product.stock || 0,
          minStock: product.minStock || 0,
          price: product.price || 0,
          costPrice: product.costPrice || 0,
          images: product.images || [],
          description: product.description || "",
          mfgDate: product.mfgDate ? new Date(product.mfgDate).toISOString().split('T')[0] : "",
          expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : "",
        });
        setIsNewCategory(false);
      } else {
        setFormData({
          name: "", category: "", stock: 0, minStock: 0,
          price: 0, costPrice: 0, images: [], description: "",
          mfgDate: "", expiryDate: ""
        });
        setIsNewCategory(categories.length <= 1);
      }
      setErrors({});
      setSelectedImageIndex(0);
    }
  }, [product, mode, isOpen, categories]);

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === "number" ? (parseFloat(value) || 0) : value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      lastUpdated: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const newImageUrls = await uploadImages(files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImageUrls].slice(0, 5)
      }));
    } catch (error) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Container with stable width to prevent collapse */}
      <div className="relative w-full max-w-xl min-w-[320px] bg-white rounded-[2.5rem] shadow-premium overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90svh]">

        {/* Header - Sticky */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-black text-dark tracking-tight">
              {mode === "add" ? "New Product" : mode === "edit" ? "Edit Product" : "View Product"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 custom-scrollbar">

          {/* Main Info Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Product Name *</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                disabled={mode === "view"}
                className={`w-full bg-slate-50 border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-primary/40 transition-all`}
                placeholder="Product name"
              />
              {errors.name && <p className="text-red-500 text-[10px] font-bold pl-1 uppercase tracking-tighter">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Category *</label>
              {isNewCategory ? (
                <div className="flex gap-2">
                  <input
                    id="category"
                    type="text"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={mode === "view"}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-primary/40 transition-all"
                    placeholder="Enter new category..."
                  />
                  {categories.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewCategory(false);
                        setFormData(p => ({ ...p, category: categories[1] }));
                      }}
                      className="px-4 bg-slate-100 hover:bg-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all"
                    >
                      Pick Draft
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={mode === "view"}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-primary/40 transition-all appearance-none cursor-pointer"
                  >
                    {categories.filter(c => c !== "All").map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {mode !== "view" && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewCategory(true);
                        setFormData(p => ({ ...p, category: "" }));
                      }}
                      className="px-4 bg-primary/10 text-primary hover:bg-primary/20 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all"
                    >
                      New
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Price (PKR) *</label>
              <input
                id="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                disabled={mode === "view"}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-primary/40 transition-all"
              />
            </div>
          </div>

          {/* Stock Group */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-muted uppercase tracking-widest">Current Stock</label>
              <input id="stock" type="number" value={formData.stock} onChange={handleChange} disabled={mode === "view"} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-bold outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-muted uppercase tracking-widest">Min. Alert</label>
              <input id="minStock" type="number" value={formData.minStock} onChange={handleChange} disabled={mode === "view"} className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm font-bold outline-none" />
            </div>
          </div>

          {/* Dates Group */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-[2rem] border border-blue-100/50">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest pl-1">Mfg. Date</label>
              <input id="mfgDate" type="date" value={formData.mfgDate} onChange={handleChange} disabled={mode === "view"} className="w-full bg-white border border-blue-200/50 rounded-xl py-2.5 px-3 text-[11px] font-bold outline-none focus:border-blue-400 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-red-600 uppercase tracking-widest pl-1">Expiry Date</label>
              <input id="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} disabled={mode === "view"} className="w-full bg-white border border-red-200/50 rounded-xl py-2.5 px-3 text-[11px] font-bold outline-none focus:border-red-400 transition-all" />
            </div>
          </div>

          {/* Image Section */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Gallery ({formData.images.length}/5)</label>
            <div className="relative aspect-video bg-slate-100 rounded-[2rem] overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
              {formData.images.length > 0 ? (
                <img src={formData.images[selectedImageIndex]} alt="Preview" className="w-full h-full object-contain bg-white" />
              ) : (
                <div className="text-center text-slate-400">
                  <Upload className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">No images yet</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {formData.images.map((img, idx) => (
                <div key={idx} className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-primary' : 'border-transparent opacity-60'}`} onClick={() => setSelectedImageIndex(idx)}>
                  <img src={img} className="w-full h-full object-cover" />
                  {mode !== "view" && (
                    <button type="button" onClick={() => setFormData(p => ({ ...p, images: p.images.filter((_, i) => i !== idx) }))} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-md p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {mode !== "view" && formData.images.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-16 h-16 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400">
                  {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                </button>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" multiple className="hidden" />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest pl-1">Description</label>
            <textarea id="description" value={formData.description} onChange={handleChange} disabled={mode === "view"} className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-primary/40 transition-all min-h-[100px] resize-none" placeholder="Product details..." />
          </div>
        </form>

        {/* Footer - Sticky */}
        <div className="p-6 border-t border-slate-100 bg-white flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 py-4 px-4 bg-slate-100 hover:bg-slate-200 text-dark rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
            {mode === "view" ? "Close" : "Cancel"}
          </button>
          {mode !== "view" && (
            <button type="submit" onClick={handleSubmit} className="flex-1 py-4 px-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-premium transition-all">
              {mode === "add" ? "Create Product" : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}