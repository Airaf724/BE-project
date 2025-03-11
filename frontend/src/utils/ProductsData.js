import cap from "../assets/store/cap.png";
import kit from "../assets/store/leetcode_kit.png";
import notebook from "../assets/store/notebook.png"; // Fixed spelling from "notetbook"
import t_shirt from "../assets/store/t_shirt_promo.png";

export const products = [
  {
    id: 1,
    title: "Event.io T-shirt",
    subtitle: "For Daily Coding Challenge",
    image: t_shirt,
    points: 7200,
  },
  {
    id: 2,
    title: "Event.io Cap",
    subtitle: "Stylish and comfortable",
    image: cap,
    points: 6000,
  },
  {
    id: 3,
    title: "Event.io Notebook",
    subtitle: "Big-O Notebook for your notes",
    image: notebook,
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
