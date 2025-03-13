import SectionFallback from "../components/SectionFallback";
import React from "react";

export default {
  title: "Section Fallback",
  component: SectionFallback,
};

export const SectionFallbackWithIcon = {
  args: {
    materialIconName: "event_busy",
    fallbackText: "導師暫無可預約時間",
  },
};
