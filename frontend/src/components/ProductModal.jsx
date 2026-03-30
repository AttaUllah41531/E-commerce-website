import { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2, Trash2 } from "lucide-react";
import { uploadImages } from "../services/api";

export function ProductModal({ isOpen, onClose, onSave, product, mode }) {
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: mode === "add" ? "" : (product.name || ""),
        category: product.category || "",
        stock: mode === "add" ? 0 : (product.stock || 0),
        minStock: mode === "add" ? 0 : (product.minStock || 0),
        price: mode === "add" ? 0 : (product.price || 0),
        costPrice: mode === "add" ? 0 : (product.costPrice || 0),
        images: mode === "add" ? [] : (product.images || []),
        description: mode === "add" ? "" : (product.description || ""),
        mfgDate: mode === "add" ? "" : (product.mfgDate ? new Date(product.mfgDate).toISOString().split('T')[0] : ""),
        expiryDate: mode === "add" ? "" : (product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : ""),
      });
    } else {
      setFormData({
        name: "",
        category: "",
        stock: 0,
        minStock: 0,
        price: 0,
        costPrice: 0,
        images: [],
        description: "",
      });
    }
    setErrors({});
    setSelectedImageIndex(0);
  }, [product, mode, isOpen]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (formData.stock < 0) {
      newErrors.stock = "Stock cannot be negative";
    }

    if (formData.minStock < 0) {
      newErrors.minStock = "Minimum stock cannot be negative";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const productData = {
      name: formData.name,
      category: formData.category,
      stock: formData.stock,
      minStock: formData.minStock,
      price: formData.price,
      costPrice: formData.costPrice,
      images: formData.images,
      description: formData.description,
      mfgDate: formData.mfgDate,
      expiryDate: formData.expiryDate,
      lastUpdated: today,
    };

    onSave(productData);
    onClose();
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const newImageUrls = await uploadImages(files);
      setFormData({ 
        ...formData, 
        images: [...formData.images, ...newImageUrls].slice(0, 5) // Limit to 5 images
      });
    } catch (error) {
      console.error("Upload failed details:", error.response?.data || error.message || error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleUrlAdd = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const url = e.target.value.trim();
      if (url && !formData.images.includes(url)) {
        setFormData({
          ...formData,
          images: [...formData.images, url].slice(0, 5)
        });
        e.target.value = '';
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-2xl w-full sm:max-w-lg max-h-[95vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === "add" ? "Add New Product" : mode === "edit" ? "Edit Product" : "Product Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={mode === "view"}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              } ${mode === "view" ? "bg-gray-50 border-gray-200" : ""}`}
              placeholder="Enter product name"
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category *
            </label>
            <input
              id="category"
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              disabled={mode === "view"}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              } ${mode === "view" ? "bg-gray-50 border-gray-200" : ""}`}
              placeholder="e.g., Electronics, Accessories"
            />

            {errors.category && (
              <p className="text-red-500 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Stock *
              </label>
              <input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stock: parseInt(e.target.value) || 0,
                  })
                }
                disabled={mode === "view"}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.stock ? "border-red-500" : "border-gray-300"
                } ${mode === "view" ? "bg-gray-50 border-gray-200" : ""}`}
                min="0"
              />

              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="minStock"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Min. Stock *
              </label>
              <input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minStock: parseInt(e.target.value) || 0,
                  })
                }
                disabled={mode === "view"}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.minStock ? "border-red-500" : "border-gray-300"
                } ${mode === "view" ? "bg-gray-50 border-gray-200" : ""}`}
                min="0"
              />

              {errors.minStock && (
                <p className="text-red-500 text-xs mt-1">{errors.minStock}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (PKR) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value) || 0,
                })
              }
              disabled={mode === "view"}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? "border-red-500" : "border-gray-300"
              } ${mode === "view" ? "bg-gray-50 border-gray-200" : ""}`}
              min="0"
              placeholder="Enter price in PKR"
            />

            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="mfgDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mfg. Date
              </label>
              <input
                id="mfgDate"
                type="date"
                value={formData.mfgDate}
                onChange={(e) =>
                  setFormData({ ...formData, mfgDate: e.target.value })
                }
                disabled={mode === "view"}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 ${mode === "view" ? "bg-gray-50 border-gray-200" : ""}`}
              />
            </div>

            <div>
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Expiry Date
              </label>
              <input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                disabled={mode === "view"}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 ${mode === "view" ? "bg-gray-50 border-gray-200" : ""}`}
              />
            </div>
          </div>

          {/* Cost Price */}
          <div>
            <label
              htmlFor="costPrice"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cost Price (PKR)
              <span className="ml-1 text-xs text-gray-400 font-normal">(what you paid)</span>
            </label>
            <input
              id="costPrice"
              type="number"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  costPrice: parseFloat(e.target.value) || 0,
                })
              }
              disabled={mode === "view"}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 border-gray-300 ${mode === "view" ? "bg-gray-50 border-gray-200" : ""}`}
              min="0"
              placeholder="Enter cost price in PKR"
            />
            {formData.costPrice > 0 && formData.price > 0 && (
              <p className="text-xs text-green-600 mt-1 font-medium">
                Profit margin: Rs. {(formData.price - formData.costPrice).toLocaleString('en-PK')} per unit
                ({Math.round(((formData.price - formData.costPrice) / formData.price) * 100)}%)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images ({formData.images.length}/5)
            </label>
            
            {/* Main Preview Area */}
            <div className="relative aspect-video mb-4 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center group">
              {formData.images.length > 0 ? (
                <img
                  src={formData.images[selectedImageIndex] || formData.images[0]}
                  alt="Product Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Upload className="w-10 h-10 mb-2" />
                  <p className="text-xs">No images uploaded</p>
                </div>
              )}
              
              {mode !== "view" && formData.images.length > 0 && (
                <button
                  type="button"
                  onClick={() => removeImage(selectedImageIndex)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                  title="Remove Current Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Thumbnails Gallery */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {formData.images.map((url, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative cursor-pointer aspect-square border-2 rounded-lg overflow-hidden transition-all duration-200 bg-gray-50 ${
                    selectedImageIndex === index ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {mode !== "view" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(index);
                      }}
                      className="absolute top-0.5 right-0.5 p-0.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              ))}
              
              {mode !== "view" && formData.images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-[8px] text-gray-500 mt-1">Add</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            
            {mode !== "view" && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Paste Image URL and press Enter"
                  onKeyDown={handleUrlAdd}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                />
                <Upload className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={mode === "view"}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] ${mode === "view" ? "bg-gray-50" : ""}`}
              placeholder="Enter product description..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${mode === "view" ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 font-medium" : ""}`}
            >
              {mode === "view" ? "Close" : "Cancel"}
            </button>
            {mode !== "view" && (
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {mode === "add" ? "Add Product" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
