/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#3B1A14",           // Top bar & footer dark maroon-brown
          cream: "#FDE6CC",          // Header background peach cream
          rust: "#9E3F26",           // Nav bar / primary accent terracotta rust
          terracotta: "#B5532F",     // Button color warm terracotta
          "terracotta-dark": "#943F20", // Button hover state
          bg: "#F6E7DC",             // Page background soft blush cream
          heading: "#7A2A17",        // Headings deep maroon
          cta: "#1A0D0A",            // Dark CTA section
          card: "#FFFFFF",           // Card white
          muted: "#6B5854",          // Muted text
          border: "#E2C9B8",         // Soft border
          ring: "#D87955"            // Focus ring
        }
      },
      fontFamily: {
        sans: ["var(--font-hind-siliguri)", "Hind Siliguri", "SolaimanLipi", "system-ui", "sans-serif"],
        serif: ["var(--font-heading)", "Noto Serif Bengali", "Tiro Bangla", "serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(59, 26, 20, 0.08)",
        elevated: "0 10px 30px -4px rgba(59, 26, 20, 0.12)",
      }
    },
  },
  plugins: [],
};
