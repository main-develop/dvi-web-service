import localFont from "next/font/local";

const ddin = localFont({
  src: [
    {
      path: "../../public/fonts/D-DIN.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/D-DIN-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/D-DIN-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ddin",
  display: "swap",
});

export default ddin;
