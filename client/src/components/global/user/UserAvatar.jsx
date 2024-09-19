import React from "react";
import Avatar from 'react-avatar';
import CatImg from "../../../assets/images/user.jpg";
import { BASE_IMG_URL } from "../../../util/EndPoint";


const UserAvatar = ({ user }) => {
    return (
        <div className="d-flex g-3  p-2 ">
            {user?.deleted_at == null && (
                <>
                    <Avatar className="rounded-2" title="asdsad" size={"50"}
                     src={user?.profile ? BASE_IMG_URL + user?.profile : CatImg} />
                    <div className="ms-2 align-self-center">
                        <h6 className="text-gray-800 mb-0">{user?.first_name} {user?.last_name}</h6>
                        <p className="text-gray-800 mb-0">{user?.email}</p>
                    </div>
                </>
            )}
        </div>
    )
}

export default UserAvatar