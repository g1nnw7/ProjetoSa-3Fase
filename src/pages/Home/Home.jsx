import React from 'react'
import Hero from '../../components/Hero/Hero'
import Section from '../../components/Section/Section'
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel'


function Home() {

  return (

    <>
      <Hero />
      <ProductCarousel />
      <Section
        title="Plano de Dieta Personalizado"
        description="Seu corpo é único, e sua alimentação também deve ser!
        Uma dieta personalizada melhora energia, bem-estar e resultados a longo prazo.
        Responda ao quiz e descubra o plano ideal para alcançar suas metas.!"
        buttonText="Saiba mais"
        imageSrc="/img/dietasection.jpg"
        url="/Quiz"
      />
      <Section
        title="Consumo Diário"
        description="Resultados reais vêm de hábitos consistentes — e monitorar sua ingestão é o passo decisivo.
        Com o consumo diário organizado, você melhora energia, foco e rendimento no treino.
        Inicie agora e veja como pequenos ajustes podem transformar seu desempenho."
        buttonText="Comece Agora"
        imageSrc="/img/acad.jpg"
        url="/calculadora"
        
      />
      <Section
        title="Nossos produtos"
        description="Aqui você encontra produtos feitos para quem busca desempenho de verdade.
        Ingredientes selecionados, segurança garantida e resultados que inspiram confiança.
        Conheça nossa linha e escolha o que vai impulsionar sua evolução."
        buttonText="Ver produtos"
        imageSrc="/img/pratileira.png"
        url="/loja"
      />
    </>
  )
}

export default Home