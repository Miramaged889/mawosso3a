import React from 'react';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import LatestProjects from '../components/LatestProjects';
import LatestNews from '../components/LatestNews';

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <LatestProjects />
      <Categories />
      <LatestNews />
    </>
  );
};

export default Home;