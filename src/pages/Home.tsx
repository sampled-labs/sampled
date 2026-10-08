import { Header } from "../components/shared/Header";
import { About } from "../components/landing/About";
import { GetStarted } from "../components/landing/GetStarted";
import { Footer } from "../components/landing/Footer";
import { ReImagine } from "../components/landing/ReImagine";
import { SEO } from "../components/shared/SEO";
import ProjectHero from "../components/project-ui/ProjectHero";

export const Home = () => {
  return (
    <div className="font-sequel relative">
      <SEO
        url="/"
        keywords="music IP, royalty tokens, music licensing, blockchain music, Stellar, music marketplace, music NFT, artist royalties"
      />
      <div className="overflow-x-hidden">
        <Header />
        <ProjectHero />
        <About />
      </div>
      <ReImagine />
      <div className="overflow-x-hidden">
        <GetStarted />
        <Footer />
      </div>
    </div>
  );
};
