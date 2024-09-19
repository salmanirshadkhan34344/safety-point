import { useNavigate } from 'react-router-dom';
import TableComponents from '../components/global/TableComponents/TableComponents';
import UserAvatar from '../components/global/user/UserAvatar';
import { ENDPOINTS } from '../util/EndPoint';

import moment from "moment";
import React, { useState } from "react";
import { useRecoilState } from 'recoil';
import ImageAvatar from '../components/global/Image/ImageAvatar';
import CustomTooltip from '../components/global/Tooltip/CustomTooltip';
import { apiPost } from '../util/ApiRequest';
import { isLoaderState } from '../util/RecoilStore';

 const ContactUs = () => {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [reloadData, setReloadData] = useState(false);
  const [isLoaderInfo, setIsLoaderInfo] = useRecoilState(isLoaderState);




  const deleteReport = (status) => {
    setIsLoaderInfo(true);
    apiPost(
      ENDPOINTS.ReportDelete,
        {
          report_id:selectedItem?.source_id,
          status:status,
          reported_id:selectedItem?.id
        },
        (res) => {
          setReloadData(!reloadData)
          setIsLoaderInfo(false);
          setDeleteModal(false)
        },
        (error) => {
            console.log(error);
            setIsLoaderInfo(false);
            setDeleteModal(false)
        }
    );
};


  const columns = [
    {
        name: 'ID',
        selector: (row) => row.id,
        sortable: false,
        width: '60px'
    },
    {
      name: 'Email',
      selector: (row) => row?.email,
      sortable: false,
  },
    {
        name: 'Sender',
        selector: (row) => <UserAvatar user={row?.user} />,
        sortable: false,
        wrap: true,
        maxWidth: '400px',
        minWidth: '250px'
    },

    {
      name: 'Subject',
      selector: (row) => row?.subject,
      sortable: false,
  },
    {
      name: 'Message',
      selector: (row) => <CustomTooltip descriptionPro={row?.message} />,
      sortable: false,
  },
    {
      name: 'Image',
      selector: (row) => <ImageAvatar src={row?.file}/>,
      sortable: false,
  },


  {
    name: 'Created',
    selector: (row) => moment(row?.created_at).format("YYYY-MM-DD hh:mm:ss a"),
    sortable: false,
},




];


  return (
    <div>
        <TableComponents
             title="Contact us"
             endPoint={ENDPOINTS.ContactUsPaginated}
                headers={columns}
                reloadData={reloadData}
        />
         
    </div>
  )
}

export default ContactUs;
