import axios from "axios";

export const getBookInfo = async isbn => {
  return (await axios(
    `https://www.googleapis.com/books/v1/volumes?q=${isbn}+isbn:${isbn}`
  )).data;
};
