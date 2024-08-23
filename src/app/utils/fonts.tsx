import {Inter, JetBrains_Mono} from "next/font/google";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: [
        "100", 
        "200", 
        "300", 
        "400", 
        "500", 
        "600", 
        "700", 
        "800"],
  
});

const jetBrainsMono = JetBrains_Mono({
    variable: "--font-jetbrainsMono",
    subsets: ["latin"],
    weight: [
        "100", 
        "200", 
        "300", 
        "400", 
        "500", 
        "600", 
        "700", 
        "800"],

    
    });

const fontsVariable = { 
    inter: inter.variable, 
    jetBrainsMono: jetBrainsMono.variable };

export default fontsVariable;