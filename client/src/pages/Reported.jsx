import { useNavigate } from 'react-router-dom';
import TableComponents from '../components/global/TableComponents/TableComponents';
import UserAvatar from '../components/global/user/UserAvatar';
import { ENDPOINTS } from '../util/EndPoint';

import moment from "moment";
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useRecoilState } from 'recoil';
import { apiPost } from '../util/ApiRequest';
import { isLoaderState } from '../util/RecoilStore';

 const Reported = () => {
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
        name: 'Reported by',
        selector: (row) => <UserAvatar user={row?.reported_by} />,
        sortable: false,
        wrap: true,
        maxWidth: '400px',
        minWidth: '250px'
    },

    {
      name: 'Reported to',
      selector: (row) => <UserAvatar user={row?.reported_report?.user} />,
      sortable: false,
      wrap: true,
      maxWidth: '400px',
      minWidth: '250px'
  },

    {
      name: 'Message',
      selector: (row) => row?.message,
      sortable: false,
  },


  {
    name: 'Reported At',
    selector: (row) => moment(row?.created_at).format("YYYY-MM-DD hh:mm:ss a"),
    sortable: false,
},

  {
    name: 'Actions',
    selector: (row) => (
        <button className="btn btn-primary" onClick={() => {
          setDeleteModal(true)
          setSelectedItem(row)
        }}>
        Approve
        </button>
    ),
    sortable: false,
  },
{
  name: 'Detail',
  selector: (row) => (
      <button className="btn btn-primary" onClick={() => {
        navigate(`/admin/reporting-detail?report_id=${row?.source_id}`);
      }}>
          detail
      </button>
  ),
  sortable: false,
},

];


const handleClose = () => setDeleteModal(false);
  return (
    <div>
        <TableComponents
                title="Reported List"
                endPoint={ENDPOINTS.PaginatedReported}
                headers={columns}
                reloadData={reloadData}
        />
            <Modal size="sm" show={deleteModal} onHide={handleClose}>
              <Modal.Header closeButton className='bg-primary text-white'>
                <Modal.Title>Report Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>Do you want to approve this report?</Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={() => deleteReport('reject')}>
                  Reject
                </Button>
                <Button variant="secondary"  onClick={() => deleteReport('accept')}>
                  Approve
                </Button>
              </Modal.Footer>
            </Modal>
    </div>
  )
}

export default Reported;
