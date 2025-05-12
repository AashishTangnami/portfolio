import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    screens: {
      xxs: "320px",
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    fontFamily: {
      primary: "var(--font-jetbrainsMono)",
      sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
    },
    extend: {

      colors:{
        primary: '#f3f3f3',
        secondary: '#424242',
        text_primary: '#f7f7f7',
        primarycard : "#686868",

        // Following color scheme can be used for dynamic color change
        nav_text_color : '#f7f7f7',
        nav_bg_color : '#1B2021',
        nav_hover_color : '#f7f7f7',

        aboutme_text_color : '#f7f7f7',
        aboutme_bg_color : '#1B2021',
        aboutme_hover_color : '#f7f7f7',
        aboutme_card_color : '#686868',
        aboutme_card_hover_color : '#f7f7f7',


        experience_text_color : '#f7f7f7',
        experience_bg_color : '#1B2021',
        experience_border_color : '#f7f7f7',


        project_text_color : '#f7f7f7',
        project_bg_color : '#1B2021',
        project_icon_color : '#f7f7f7',
        project_icon_hover_color : '#f7f7f7',
        project_card_color : '#686868',
        project_card_hover_color : '#f7f7f7',
        project_card_description_color : '#f7f7f7',
        project_card_title_color : '#f7f7f7',
        project_techstack_color : '#f7f7f7',

        contactme_icon_color : '#f7f7f7',
        contactme_icon_hover_color : '#f7f7f7',
        contactme_text_color : '#f7f7f7',
        contactme_icon_text_color : '#f7f7f7',

        button_text_color : '#f7f7f7',
        button_bg_color : '#1B2021',
        button_hover_color : '#f7f7f7',
        button_hover_bg_color : '#686868',

        // #EAE7DC, #D8C3A5, #8E8D8A, #E98074, #E85A4F -> MINIMAL AND WARM
        // #19181A, #479761, #CEBC81, #A16E83, #B19F9E -> MODERN AND MINIMAL

        // accent:{
        //   DEFAULT : '#00ff99',
        //   hover: '#00e187', for text - >"#FAFAFA",

        // }, '#141010', primarycard : "#f2f2f2",
        // #1995AD, #A1D6E2, #F1F1F2, #C4DFE6, #66A5AD -> OCEANIC


      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
