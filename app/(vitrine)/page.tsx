import Hero from "@/components/vitrine/Hero";
import Inspiration from "@/components/vitrine/Inspiration";
import Mission from "@/components/vitrine/Mission";
import Vision from "@/components/vitrine/Vision";
import Offres from "@/components/vitrine/Offres";
import Produits from "@/components/vitrine/Produits";
import Temoignages from "@/components/vitrine/Temoignages";
import Stats from "@/components/vitrine/Stats";
import CtaBanner from "@/components/vitrine/CtaBanner";
import Blog from "@/components/vitrine/Blog";
import Contact from "@/components/vitrine/Contact";

export default function VitrinePage() {
  return (
    <>
      <Hero />
      <Inspiration />
      <Mission />
      <Vision />
      <Offres />
      <Produits />
      <Temoignages />
      <Stats />
      <CtaBanner />
      <Blog />
      <Contact />
    </>
  );
}
