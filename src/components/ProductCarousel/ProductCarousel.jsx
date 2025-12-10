import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";

function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Ícones
  function RigthIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 md:w-6 md:h-6 text-gray-600">
        <path fill="currentColor" d="M10.164 8.964a.9.9 0 0 1 1.272 0l2.4 2.4a.9.9 0 0 1 0 1.272l-2.4 2.4a.9.9 0 1 1-1.272-1.272L11.927 12l-1.763-1.764a.9.9 0 0 1 0-1.272"/>
      </svg>
    );
  }
  function LeftIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 md:w-6 md:h-6 text-gray-600">
        <path fill="currentColor" d="M13.836 8.964a.9.9 0 0 1 0 1.272L12.073 12l1.763 1.764a.9.9 0 1 1-1.273 1.272l-2.4-2.4a.9.9 0 0 1 0-1.272l2.4-2.4a.9.9 0 0 1 1.273 0"/>
      </svg>
    );
  }

  // Carregar produtos
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch("http://localhost:3000/products");
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.log("Erro ao carregar produtos:", error);
      }
    }
    loadProducts();
  }, []);

  const handleViewProduct = (categorySlug) => {
    navigate(categorySlug ? `/loja?category=${categorySlug}` : "/loja");
  };

  // Botões adaptados para mobile
  const NextArrow = ({ onClick }) => (
    <button
      className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 
      bg-white shadow-lg w-8 h-8 md:w-10 md:h-10 flex items-center justify-center 
      rounded-full hover:bg-gray-100"
      onClick={onClick}
    >
      <RigthIcon />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute -left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 
      bg-white shadow-lg w-8 h-8 md:w-10 md:h-10 flex items-center justify-center 
      rounded-full hover:bg-gray-100"
      onClick={onClick}
    >
      <LeftIcon />
    </button>
  );

  // CONFIG RESPONSIVA (mais refinada)
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 3,
    centerMode: true,
    centerPadding: "0px",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024, // tablet
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 768, // mobile
        settings: { slidesToShow: 1 }
      },
    ],
    appendDots: (dots) => (
      <div className="mt-6">
        <ul className="flex justify-center gap-2 md:gap-3">
          {dots.map((dot, i) => {
            const active = dot.props.className.includes("slick-active");
            return (
              <li key={i}>
                <button
                  onClick={dot.props.children.props.onClick}
                  className={`
                    rounded-full border-2 border-gray-500 transition-all
                    ${active 
                      ? "bg-gray-700 w-3 h-3 md:w-4 md:h-4" 
                      : "bg-gray-300 w-2.5 h-2.5 md:w-3 md:h-3"}
                  `}
                />
              </li>
            );
          })}
        </ul>
      </div>
    )
  };

  return (
    <div className="w-full py-8 md:py-10 px-4 md:px-8 bg-gray-50">
      <h1 className="text-2xl md:text-4xl text-center mb-6 text-black font-[Poppins]">
        Conheça nossos produtos!
      </h1>

      {products.length > 0 ? (
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id} className="px-2 md:px-4">
              <div
                className="bg-white font-[Poppins] shadow rounded-2xl p-4 md:p-6 
                text-center transition-all duration-500 hover:scale-105 hover:shadow-xl"
              >
                <img
                  src={
                    product.imageUrl.startsWith("/")
                      ? product.imageUrl
                      : `/${product.imageUrl.replace("public/", "")}`
                  }
                  alt={product.nome}
                  className="w-28 h-28 md:w-40 md:h-40 mx-auto object-contain"
                />

                <h3 className="text-base md:text-lg mt-3">{product.nome}</h3>

                <p className="text-gray-500 text-xs md:text-sm mt-1 line-clamp-2 h-10">
                  {product.descricao}
                </p>

                <p className="text-green-600 text-lg md:text-xl mt-2">
                  R$ {product.preco.toFixed(2)}
                </p>

                <button
                  onClick={() => handleViewProduct(product.category?.slug)}
                  className="mt-3 bg-green-500 hover:bg-green-600 text-white 
                    px-4 py-2 rounded-lg text-sm md:text-base"
                >
                  Ver Produto
                </button>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <p className="text-center text-gray-500">Carregando produtos...</p>
      )}
    </div>
  );
}

export default ProductCarousel;