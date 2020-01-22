import guelph from "./guelph";
import laurier from "./laurier";

export const schools = [
  {
    label: "University of Guelph",
    value: "UofG"
  },
  {
    label: "Wilfred Laurier University",
    value: "WLU"
  }
];

export const courses = {
  UofG: guelph,
  WLU: laurier
};
