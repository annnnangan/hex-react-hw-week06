import SectionFallback from "../components/SectionFallback";

export default {
  title: "Section Fallback",
  component: SectionFallback,
};

export const SectionFallbackWithIcon = {
  args: {
    materialIconName: "event_busy",
    fallbackText: "導師此星期暫無可預約時間",
  },
};
