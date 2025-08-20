// AdsComponent.jsx (New Component)
import { useEffect } from "react";

const AdsComponent = ({ adSlot }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense push error:", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-8430285426081478" // Replace with your AdSense publisher ID
      data-ad-slot="3345221432" // Replace with your ad unit slot ID
      data-ad-format="auto"
      data-full-width-responsive="true"
    ></ins>
  );
};

export default AdsComponent;
