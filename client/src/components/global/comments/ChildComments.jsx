import React from "react";
import Avatar from "react-avatar";
import CatImg from "../../../assets/images/user.jpg";
import { BASE_IMG_URL } from "../../../util/EndPoint";
import moment from "moment";

function ChildComments ({ itemChildPro }) {
  return (
    <>
      <div className="d-flex m-2 rounded-2 border border-primary p-2 custom-box-shadow">
        <Avatar className="rounded-2 border border-primary" title="asdsad" size={"50"}
          src={itemChildPro?.user?.profile ? BASE_IMG_URL + itemChildPro?.user?.profile : CatImg} />
        <div className="ms-2 align-self-center">
          <h6 className="poppins-bold  mb-0">{itemChildPro?.user?.first_name} {itemChildPro?.user?.last_name}
            <span className="font-10 ms-2 poppins-regular ">{moment(itemChildPro?.created_at).fromNow(true)}</span></h6>
          {itemChildPro?.text && (
            <p className="text-gray-800 mb-0">{itemChildPro?.text}</p>
          )}

          {!itemChildPro?.text && (
            <p className="text-gray-800 mb-0">-</p>
          )}
        </div>
      </div>

    </>
  );
}

export default ChildComments;
