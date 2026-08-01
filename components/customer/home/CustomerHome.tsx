"use client";

import Categories from "./Categories";
import Equipments from "./Equipments";
import CustomerHeroSection from "./Hero";

const CustomerHome = () => {


  return (
    <main className="min-h-screen">
     <CustomerHeroSection/>
     <Categories/>
     <Equipments/>
    </main>
  );
};

export default CustomerHome;