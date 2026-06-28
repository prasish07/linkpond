export const PRESETS = [
  { label: "In 1 hour", offset: () => new Date(Date.now() + 60 * 60 * 1000) },
  {
    label: "Tonight at 9 PM",
    offset: () => {
      const d = new Date();
      d.setHours(21, 0, 0, 0);
      return d;
    },
  },
  {
    label: "Tomorrow morning (8 AM)",
    offset: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(8, 0, 0, 0);
      return d;
    },
  },
  {
    label: "Tomorrow evening (6 PM)",
    offset: () => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      d.setHours(18, 0, 0, 0);
      return d;
    },
  },
];

const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const formatReminderDate = (timestamp: number) => {
  const d = new Date(timestamp * 1000);
  const day = ordinal(d.getDate());
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  const time = d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" });
  return `${day} ${month}, ${year} at ${time}`;
};
