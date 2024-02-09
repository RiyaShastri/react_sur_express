import React from 'react'

import HomeWrapper from './HomeWrapper'
import HeroSection from './components/HeroSection'
import ConversionSection from './components/ConversionSection'
import AboutSection from './components/AboutSection'
import StoresSection from './components/StoresSection'

const LandingPage = () => {
  return (
    <>
      <HomeWrapper>
        <HeroSection />
        <ConversionSection />
        <StoresSection />
        <AboutSection />
      </HomeWrapper>
    </>
  )
}

export default LandingPage
