import React from "react";
import Avatar from "react-avatar";
import CatImg from "../../../assets/images/user.jpg";
import { BASE_IMG_URL } from "../../../util/EndPoint";
const ImageAvatar = ({ src }) => {
  return (
    <>
      {src && (
        <Avatar className="rounded-2" title="asdsad" size={"50"}
          src={BASE_IMG_URL + src} />
      )}

      {!src && (
        <p>-</p>
      )}


    </>
  );
};

export default ImageAvatar;
