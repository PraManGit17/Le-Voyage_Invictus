import React, { useRef } from "react";
import HeroSection from "../components/triplanners/HeroSection";
import TripCreationFlow from "../components/triplanners/TripCreationFlow";

const Workspace = () => {
  const tripFlowRef = useRef(null);

  const handleCreateSoloTrip = () => {
    tripFlowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div>
      <HeroSection onCreateTrip={handleCreateSoloTrip} />

      <div ref={tripFlowRef}>
        <TripCreationFlow />
      </div>
    </div>
  );
};

export default Workspace;