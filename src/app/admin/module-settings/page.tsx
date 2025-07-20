"use client";

import { useState, useEffect } from "react";
import { FaCog, FaTag, FaExclamationTriangle, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { PageContainer } from '@/components/ui/PageContainer';
import { useToast } from '@/components/ui/Toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface Category {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

interface Priority {
  id: string;
  name: string;
  displayName: string;
  level: number;
  color: string;
  isActive: boolean;
  createdAt: string;
}

export default function ModuleSettingsPage() {
  const [activeTab, setActiveTab] = useState<'categories' | 'priorities'>('categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showPriorityForm, setShowPriorityForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'category' | 'priority'} | null>(null);

  // Form data
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    isActive: true
  });

  const [priorityForm, setPriorityForm] = useState({
    name: '',
    level: 1,
    color: '#EF4444',
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesRes, prioritiesRes] = await Promise.all([
        fetch("/api/support/categories"),
        fetch("/api/support/priorities")
      ]);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || []);
      }

      if (prioritiesRes.ok) {
        const prioritiesData = await prioritiesRes.json();
        setPriorities(prioritiesData.priorities || []);
      }
    } catch (err: any) {
      setError(err.message || "Veriler yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // Category handlers
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingCategory 
        ? `/api/support/categories/${editingCategory.id}`
        : '/api/support/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });

             if (!res.ok) throw new Error('Destek kategorisi kaydedilemedi');
      
             addToast({
         message: editingCategory ? 'Destek kategorisi güncellendi' : 'Destek kategorisi oluşturuldu',
         type: 'success'
       });
      
      setShowCategoryForm(false);
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '', isActive: true });
      fetchData();
    } catch (err: any) {
      addToast({
        message: err.message || 'Bir hata oluştu',
        type: 'error'
      });
    }
  };

  const handleCategoryEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive
    });
    setShowCategoryForm(true);
  };

  // Priority handlers
  const handlePrioritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingPriority 
        ? `/api/support/priorities/${editingPriority.id}`
        : '/api/support/priorities';
      
      const method = editingPriority ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priorityForm)
      });

             if (!res.ok) throw new Error('Destek önceliği kaydedilemedi');
      
             addToast({
         message: editingPriority ? 'Destek önceliği güncellendi' : 'Destek önceliği oluşturuldu',
         type: 'success'
       });
      
      setShowPriorityForm(false);
      setEditingPriority(null);
      setPriorityForm({ name: '', level: 1, color: '#EF4444', isActive: true });
      fetchData();
    } catch (err: any) {
      addToast({
        message: err.message || 'Bir hata oluştu',
        type: 'error'
      });
    }
  };

  const handlePriorityEdit = (priority: Priority) => {
    setEditingPriority(priority);
    setPriorityForm({
      name: priority.name,
      level: priority.level,
      color: priority.color,
      isActive: priority.isActive
    });
    setShowPriorityForm(true);
  };

  // Delete handler
  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      const res = await fetch(`/api/support/${itemToDelete.type}s/${itemToDelete.id}`, {
        method: 'DELETE'
      });
      
             if (!res.ok) throw new Error(`${itemToDelete.type === 'category' ? 'Destek kategorisi' : 'Destek önceliği'} silinemedi`);
      
      addToast({
        message: `${itemToDelete.type === 'category' ? 'Destek kategorisi' : 'Destek önceliği'} silindi`,
        type: 'success'
      });
      
      setShowDeleteDialog(false);
      setItemToDelete(null);
      fetchData();
    } catch (err: any) {
      addToast({
        message: err.message || 'Bir hata oluştu',
        type: 'error'
      });
    }
  };

  const openDeleteDialog = (id: string, type: 'category' | 'priority') => {
    setItemToDelete({ id, type });
    setShowDeleteDialog(true);
  };

  const getLevelText = (level: number) => {
    switch (level) {
      case 1: return 'Düşük';
      case 2: return 'Normal';
      case 3: return 'Yüksek';
      case 4: return 'Acil';
      case 5: return 'Kritik';
      default: return 'Bilinmeyen';
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Yükleniyor...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Modül Ayarları</h1>
        <p className="text-gray-600">Sistem modüllerinin ayarlarını yönetin</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaTag className="inline mr-2" />
              Destek Talebi Kategorileri
            </button>
            <button
              onClick={() => setActiveTab('priorities')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'priorities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaExclamationTriangle className="inline mr-2" />
              Destek Talebi Öncelik Seviyeleri
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Destek Talebi Kategorileri</h2>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({ name: '', description: '', isActive: true });
                    setShowCategoryForm(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                                     <FaPlus /> Yeni Destek Kategorisi
                </button>
              </div>

                             {showCategoryForm && (
                 <div className="bg-gray-50 rounded-lg p-4 mb-4">
                   <h3 className="text-md font-semibold text-gray-800 mb-3">
                     {editingCategory ? 'Destek Kategorisi Düzenle' : 'Yeni Destek Kategorisi'}
                   </h3>
                  <form onSubmit={handleCategorySubmit} className="space-y-3">
                    <div>
                                             <label className="block text-sm font-medium text-gray-700 mb-1">
                         Destek Kategorisi Adı *
                       </label>
                      <input
                        type="text"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Açıklama
                      </label>
                      <textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        rows={2}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="categoryActive"
                        checked={categoryForm.isActive}
                        onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="categoryActive" className="ml-2 block text-sm text-gray-900">
                        Aktif
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingCategory ? 'Güncelle' : 'Oluştur'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCategoryForm(false);
                          setEditingCategory(null);
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-2">
                                 {categories.length === 0 ? (
                   <div className="text-center py-8 text-gray-500">
                     Henüz destek kategorisi oluşturulmamış
                   </div>
                ) : (
                  categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${category.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{category.displayName}</h4>
                          {category.description && (
                            <p className="text-sm text-gray-500">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCategoryEdit(category)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(category.id, 'category')}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Priorities Tab */}
          {activeTab === 'priorities' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Destek Talebi Öncelik Seviyeleri</h2>
                <button
                  onClick={() => {
                    setEditingPriority(null);
                    setPriorityForm({ name: '', level: 1, color: '#EF4444', isActive: true });
                    setShowPriorityForm(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                                     <FaPlus /> Yeni Destek Önceliği
                </button>
              </div>

                             {showPriorityForm && (
                 <div className="bg-gray-50 rounded-lg p-4 mb-4">
                   <h3 className="text-md font-semibold text-gray-800 mb-3">
                     {editingPriority ? 'Destek Önceliği Düzenle' : 'Yeni Destek Önceliği'}
                   </h3>
                  <form onSubmit={handlePrioritySubmit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
                           Destek Önceliği Adı *
                         </label>
                        <input
                          type="text"
                          value={priorityForm.name}
                          onChange={(e) => setPriorityForm({ ...priorityForm, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                                                 <label className="block text-sm font-medium text-gray-700 mb-1">
                           Öncelik Seviyesi *
                         </label>
                        <select
                          value={priorityForm.level}
                          onChange={(e) => setPriorityForm({ ...priorityForm, level: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                          <option value={1}>1 - Düşük</option>
                          <option value={2}>2 - Normal</option>
                          <option value={3}>3 - Yüksek</option>
                          <option value={4}>4 - Acil</option>
                          <option value={5}>5 - Kritik</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Renk
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={priorityForm.color}
                          onChange={(e) => setPriorityForm({ ...priorityForm, color: e.target.value })}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={priorityForm.color}
                          onChange={(e) => setPriorityForm({ ...priorityForm, color: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="#EF4444"
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="priorityActive"
                        checked={priorityForm.isActive}
                        onChange={(e) => setPriorityForm({ ...priorityForm, isActive: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="priorityActive" className="ml-2 block text-sm text-gray-900">
                        Aktif
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {editingPriority ? 'Güncelle' : 'Oluştur'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPriorityForm(false);
                          setEditingPriority(null);
                        }}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        İptal
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="space-y-2">
                                 {priorities.length === 0 ? (
                   <div className="text-center py-8 text-gray-500">
                     Henüz destek önceliği oluşturulmamış
                   </div>
                ) : (
                  priorities.map((priority) => (
                    <div
                      key={priority.id}
                      className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${priority.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: priority.color }}
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{priority.displayName}</h4>
                            <p className="text-sm text-gray-500">Seviye {priority.level} - {getLevelText(priority.level)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePriorityEdit(priority)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(priority.id, 'priority')}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Silme Onayı"
                 message={`Bu ${itemToDelete?.type === 'category' ? 'destek kategorisini' : 'destek önceliğini'} silmek istediğinizden emin misiniz?`}
        type="danger"
      />
    </PageContainer>
  );
} 