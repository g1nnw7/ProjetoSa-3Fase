import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";



function ProductCarousel() {
  const [products, setProducts] = useState([]);

  function RigthIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" className="cursor-pointer">
      <path fill="currentColor" d="M10.164 8.964a.9.9 0 0 1 1.272 0l2.4 2.4a.9.9 0 0 1 0 1.272l-2.4 2.4a.9.9 0 1 1-1.272-1.272L11.927 12l-1.763-1.764a.9.9 0 0 1 0-1.272"/>
  </svg>
    );
  }
  function LeftIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" className="cursor-pointer">
      <path fill="currentColor" d="M13.836 8.964a.9.9 0 0 1 0 1.272L12.073 12l1.763 1.764a.9.9 0 1 1-1.273 1.272l-2.4-2.4a.9.9 0 0 1 0-1.272l2.4-2.4a.9.9 0 0 1 1.273 0"/>
  </svg>
    );
  }




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
      className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 "
      onClick={onClick}
    >
      <RigthIcon />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
      onClick={onClick}
    >
      <LeftIcon />
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
    <div className="w-full py-10 relative px-8 bg-gray-50">
      <h1 className="text-[3rem] text-center mb-6 text-[#000000] font-[Poppins]">Conheça nossos produtos!</h1>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} className="px-4">
            <div
              className="bg-white font-[Poppins] shadow rounded-2xl m-6 p-6 h-100 w-125 text-center transition-all duration-500 
              transform hover:scale-105 hover:shadow-xl "
            >
              <img
                src={`/${product.imageUrl.replace("public/", "")}`}
                alt={product.nome}
                className="w-40 h-40 mx-auto object-contain"
              />

              <h3 className="text-lg font-[Poppins]  mt-4">{product.nome}</h3>

              <p className="text-gray-500 text-sm mt-1">
                {product.descricao}
              </p>

              <p className="text-green-600 font-[Poppins] text-xl mt-3">
                R$ {product.preco.toFixed(2)}
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
