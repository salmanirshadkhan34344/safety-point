import moment from "moment";
import React from "react";
import Avatar from "react-avatar";
import CatImg from "../../../assets/images/user.jpg";
import { BASE_IMG_URL } from "../../../util/EndPoint";
import ChildComments from "./ChildComments";

const Comment = ({ itemPro }) => {




  return (
    <>
      <div className="d-flex m-2 ">
        <Avatar className="rounded-2 border border-primary" title="asdsad" size={"50"}
          src={itemPro?.user?.profile ? BASE_IMG_URL + itemPro?.user?.profile : CatImg} />
        <div className="ms-2 align-self-center">
          <h6 className="poppins-bold  mb-0">{itemPro?.user?.first_name} {itemPro?.user?.last_name}
            <span className="font-10 ms-2 poppins-regular ">{moment(itemPro?.created_at).fromNow(true)}</span></h6>
          {itemPro?.text && (
            <p className="text-gray-800 mb-0">{itemPro?.text}</p>
          )}

          {!itemPro?.text && (
            <p className="text-gray-800 mb-0">-</p>
          )}
        </div>
      </div>

            <div className="ms-3">
              {itemPro?.child_comments?.length > 0 &&
                  itemPro?.child_comments.map((item, index) => (
                    <ChildComments itemChildPro={item} key={index} />
                  ))}
            </div>
    </>
  );
};

export default Comment;
