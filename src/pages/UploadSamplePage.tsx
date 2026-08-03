import UploadUI from "../components/upload/UploadSample";
import "../upload-sample.css";
import { SEO } from "../components/shared/SEO";

export const UploadSamplePage = () => {
  return (
    <div>
      <SEO
        title="Upload Sample"
        description="Upload your music samples to Sampled. Set your price, define licensing terms, and start earning royalties instantly on the Stellar blockchain."
        url="/upload-sample"
        keywords="upload music, sell beats, music licensing, producer platform, sell samples"
      />
      <UploadUI />
    </div>
  );
};
