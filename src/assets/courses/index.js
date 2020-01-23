import guelph from "./guelph";
import laurier from "./laurier";
import waterloo from "./waterloo";
import mcmaster from "./mcmaster";

export const schools = [
  {
    label: "University of Guelph",
    value: "UofG"
  },
  {
    label: "Wilfred Laurier University",
    value: "WLU"
  },
  {
    label: "University of Waterloo",
    value: "UW"
  },
  {
    label: "McMaster University",
    value: "MAC"
  }
];

export const courses = {
  UofG: guelph,
  WLU: laurier,
  UW: waterloo,
  MAC: mcmaster
};
