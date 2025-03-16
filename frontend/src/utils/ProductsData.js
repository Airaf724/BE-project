import cap from "../assets/store/cap.png";
import kit from "../assets/store/leetcode_kit.png";
import notebook from "../assets/store/notebook.png"; // Fixed spelling from "notetbook"
import t_shirt from "../assets/store/t_shirt_promo.png";
import python from "../assets/udemy/python.webp";
import jsimage from "../assets/udemy/js.webp";
import image1 from "../assets/udemy/img1.webp";
export const products = [
  {
    id: 1,
    title: "100 Days of Code: Python",
    subtitle: "The Complete Python Pro Bootcamp",
    image: python,
    points: 7200,
  },
  {
    id: 2,
    title: "JavaScript for Beginners ",
    subtitle: "The Complete introduction to JS",
    image: jsimage,
    points: 6000,
  },
  {
    id: 3,
    title: "Ultimate AWS Certified Cloud",
    subtitle: "Cloud Practitioner CLF-C02 2025",
    image: image1,
    points: 1200,
  },
  {
    id: 4,
    title: "Kit Combo",
    subtitle: "Includes T-shirt, keychain, and coaster",
    image: kit,
    points: 10000,
  },
];
