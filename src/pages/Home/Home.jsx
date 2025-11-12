import React from 'react'
import Hero from '../../components/Hero/Hero'
import Section from '../../components/Section/Section'
import Footer from '../../components/Footer/Footer'


function Home() {
  return (
    <div>
      <Hero />
      <Section
        title="Plano de Dieta Personalizado"
        description="Faça o quiz e nós montamos o seu plano alimentar!"
        buttonText="Saiba mais"
        imageSrc="/img/dietasection.jpg"
        url="/Quiz"
      />
      <Section
        title="Cadastro de Alimentos"
        description="Nossa ferramenta possibilita a personalização dos alimentos e suas quantidades para maior conforto"
        buttonText="Ver produtos"
        imageSrc="/img/alimentoaqui.jpg"
        url="/alimentos"
        rowReverse
      />
      <Section
        title="Consumo Diário"
        description="Acompanhe seu consumo diário e potencialize seus resultados!"
        buttonText="Comece Agora"
        imageSrc="/img/acad.jpg"
        url="/quiz"
        />
      <Section
        title="Nossos produtos"
        description="Nossos produtos são desenvolvidos com tecnologia e respeito ao meio ambiente. Qualidade e design que inspiram."
        buttonText="Ver produtos"
        imageSrc="/img/whey.png"
        url="/produtos"
        rowReverse
      />
      <Footer />
    </div>

  )
}

export default Home