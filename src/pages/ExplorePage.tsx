import { Explore } from "../components/explore/Explore";
import { SEO } from "../components/shared/SEO";

const ExplorePage = () => {
  return (
    <div>
      <SEO
        title="Explore Samples"
        description="Browse and discover music samples from talented producers. Find the perfect beat, melody, or sound for your next project on Sampled marketplace."
        url="/explore"
        keywords="music samples, beat marketplace, producer samples, royalty-free music, music loops"
      />
      <Explore />
    </div>
  );
};

export default ExplorePage;
