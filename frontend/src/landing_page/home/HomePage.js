import React from 'react';
import Hero from './Hero';
import Award from './Award';
import Pricing from './Pricing';
import Stats from './Stats';
import Education from './Education';
import Navbar from'../Navbar';
import Footer from'../Footer';
import OpenAccount from'../OpenAccount';

function HomePage() {
    return ( 
        <>
        <Navbar />
        <Hero />
        <Award />
        <Stats />
        <Pricing />
        <Education />
        <OpenAccount />
        
        </>
     );
}

export default HomePage;