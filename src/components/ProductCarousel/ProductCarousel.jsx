import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function ProductCarousel() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();

        // ➜ Sua API retorna 1 objeto ou vários? 
        // Caso seja apenas 1 objeto, transformo em array:
        const arr = Array.isArray(data) ? data : [data];

        setProducts(arr);
      } catch (error) {
        console.log("Erro ao carregar produtos:", error);
      }
    }

    loadProducts();
  }, []);

  // SETAS PERSONALIZADAS
  const NextArrow = ({ onClick }) => (
    <button
      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow p-3 rounded-full hover:bg-gray-100"
      onClick={onClick}
    >
      ➜
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white shadow p-3 rounded-full hover:bg-gray-100"
      onClick={onClick}
    >
      ←
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 600,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full py-10 relative">
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-4">
            <div
              className="bg-white shadow rounded-2xl p-6 text-center transition-all duration-500 
              transform hover:scale-105 hover:shadow-xl"
            >
              <img
                src={`/${product.imageUrl.replace("public/", "")}`}
                alt={product.nome}
                className="w-40 h-40 mx-auto object-contain"
              />

              <h3 className="text-lg font-semibold mt-4">{product.nome}</h3>

              <p className="text-gray-500 text-sm mt-1">
                {product.descricao}
              </p>

              <p className="text-green-600 font-bold text-xl mt-3">
                R$ {product.preco}
              </p>

              <button className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg">
                Ver Produto
              </button>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default ProductCarousel;
