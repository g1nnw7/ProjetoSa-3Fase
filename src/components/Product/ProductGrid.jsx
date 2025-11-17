import React from 'react';
import ProductCard from './ProductCard.jsx';
import LoadingSkeleton from '../Skeleton/LoadingSkeleton.jsx';


export default function ProductGrid({ products, loading, onProductClick }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, index) => (
          <LoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center col-span-full py-20">
        <h3 className="text-2xl font-semibold text-gray-700">Nenhum produto encontrado</h3>
        <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou termo de busca.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onProductClick={onProductClick} 
        />
      ))}
    </div>
  );
}