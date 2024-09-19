import moment from "moment";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useRecoilState } from "recoil";
import { apiPost } from "../../../util/ApiRequest";
import { ENDPOINTS } from "../../../util/EndPoint";
import { isLoaderState } from "../../../util/RecoilStore";
import ImageAvatar from "../Image/ImageAvatar";
import UserAvatar from "../user/UserAvatar";


const ReportInfo = ({reportId}) => {

  const [isLoaderInfo, setIsLoaderInfo] = useRecoilState(isLoaderState);

  const [item, setItem] = useState(0);


  useEffect(() => {
    if(reportId> 0){
      getItem(reportId)
    }

  }, [reportId]);

  const getItem = (itemId) => {
    setIsLoaderInfo(true)
    let body = {
      report_id : itemId,
    };
    apiPost(
      ENDPOINTS.ReportingDetail,
      body,
      (res) => {
        setIsLoaderInfo(false)
        setItem(res.data);
      },
      (error) => {
        setIsLoaderInfo(false)
        console.log(error, ' error');
      },
    );
  };


  return (
    <>
      <div>
      <Table striped bordered hover className='user-detail-info-table border-primary'>
                  <tbody>
                    <tr>
                      <th>User</th>
                      <td> <UserAvatar user={item?.user} /></td>
                    </tr>
                    <tr>
                      <th>Message</th>
                      <td> {item?.text}</td>
                    </tr>
                    <tr>
                      <th>Priority</th>
                      <td> {item?.priority}</td>
                    </tr>
                    <tr>
                      <th>Location</th>
                      <td> {item?.location}</td>
                    </tr>
                    <tr>
                      <th>Comments</th>
                      <td> {item?.comments_count?item?.comments_count.comments_count:0}</td>
                    </tr>
                    <tr>
                      <th>Likes</th>
                      <td> {item?.likes_count?item?.likes_count.likes_count:0}</td>
                    </tr>
                    <tr>
                      <th>Share</th>
                      <td> {item?.share_count?item?.share_count.share_count:0}</td>
                    </tr>
                    <tr>
                      <th>Images</th>
                      <td>  <ImageAvatar src={item?.images}/></td>
                    </tr>
                      <tr>
                      <th>Created</th>
                      <td>{moment(item?.created_at).format("YYYY-MM-DD hh:mm:ss a")}</td>
                    </tr>
                      {/* <tr>
                      <th  className="my-auto">Loacation Map</th>
                      <td>
                        {item && (
                         <CustomGoogleMap item={item} />
                        )}
                       </td>
                    </tr> */}

                  </tbody>
                </Table>
                </div>
    </>
  );
};

export default ReportInfo;
