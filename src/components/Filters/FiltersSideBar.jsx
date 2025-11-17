import React from 'react';

export default function FiltersSidebar({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}) {
  

  const baseStyle = "w-full text-left p-3 rounded-lg transition-colors duration-200 text-gray-700";
  const activeStyle = "bg-green-100 text-green-700 font-semibold";
  const inactiveStyle = "hover:bg-gray-100";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 ">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Categorias</h3>
      <nav>
        <ul className="space-y-2 ">
          <li>
            <button
              onClick={() => onCategoryChange('all')}
              className={`${baseStyle} ${activeCategory === 'all' ? activeStyle : inactiveStyle} cursor-pointer`}
            >
              Todos os Produtos
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => onCategoryChange(category.slug)}
                className={`${baseStyle} ${activeCategory === category.slug ? activeStyle : inactiveStyle} cursor-pointer`}
              >
                {category.nome}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}