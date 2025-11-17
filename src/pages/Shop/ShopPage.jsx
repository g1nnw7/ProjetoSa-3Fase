import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FiltersSidebar from '../../components//Filters/FiltersSideBar';
import ProductGrid from '../../components/Product/ProductGrid';
import SearchBar from '../../components/Search/SearchBar';
import Modal from '../../components/Modal/Modal'; 
import ProductDetails from '../../components/Product/ProductDetail';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    sort: 'relevance',
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      if (filters.sort !== 'relevance') {
        params.append('sort', filters.sort);
      }
      
      const response = await axios.get(`${API_URL}/products?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };
    fetchCategories();
  }, []);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  };

  const handleSearch = useCallback(
    debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 500),
    []
  );

  const handleCategoryChange = (categorySlug) => {
    setFilters(prev => ({ ...prev, category: categorySlug, search: '' }));
  };

  const handleSortChange = (sortValue) => {
    setFilters(prev => ({ ...prev, sort: sortValue }));
  };

  // Funções de controle do modal
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (

    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
        
        {/* Título */}
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h1 className="text-4xl font-bold text-green-500">Nossos Produtos</h1>
          <p className="text-lg text-gray-600 mt-2">Encontre os melhores suplementos e alimentos para sua dieta.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-1/4 lg:w-1/5 md:sticky top-8 h-fit">
            <FiltersSidebar 
              categories={categories}
              activeCategory={filters.category}
              onCategoryChange={handleCategoryChange}
            />
          </aside>

          {/* Grid Principal */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <SearchBar onSearch={handleSearch} />
              <select 
                value={filters.sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full md:w-auto border border-gray-300 rounded-lg p-2 pr-8
                           focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="relevance">Relevância</option>
                <option value="price_asc">Preço: Menor para Maior</option>
                <option value="price_desc">Preço: Maior para Menor</option>
              </select>
            </div>

            <ProductGrid 
              products={products} 
              loading={loading} 
              onProductClick={handleOpenModal} 
            />
          </main>
        </div>
      </div>

      <Modal isOpen={!!selectedProduct} onClose={handleCloseModal}>
        {selectedProduct && (
          <ProductDetails 
            product={selectedProduct} 
            onCloseAfterAdd={handleCloseModal} 
          />
        )}
      </Modal>
    </div>
  );
}