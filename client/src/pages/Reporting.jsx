import React from 'react';
import { useNavigate } from 'react-router-dom';
import TableComponents from '../components/global/TableComponents/TableComponents';
import CustomTooltip from '../components/global/Tooltip/CustomTooltip';
import UserAvatar from '../components/global/user/UserAvatar';
import { ENDPOINTS } from '../util/EndPoint';
import { reportType } from '../util/Helper';

 const Reporting = () => {

  const navigate = useNavigate();

  const columns = [
    {
        name: 'ID',
        selector: (row) => row.id,
        sortable: false,
        width: '60px'
    },
    {
        name: 'User',
        selector: (row) => <UserAvatar user={row.user} />,
        sortable: false,
        wrap: true,
        maxWidth: '400px',
        minWidth: '250px'
    },

    {
      name: 'Message',
      selector: (row) => row?.text,
      sortable: false,
  },
    {
      name: 'incident',
      selector: (row) => reportType(row?.incident_id),
      sortable: false,
  },
    {
      name: 'Location',
      selector: (row) => row?.location,
      sortable: false,
  },
  {
    name: 'Public',
    selector: (row) => <CustomTooltip descriptionPro={row?.is_public?"Yes":"No"} />,
      sortable: false,
},

    {
        name: 'Detail',
        selector: (row) => (
            <button className="btn btn-primary" onClick={() => {
              navigate(`/admin/reporting-detail?report_id=${row?.id}`);
            }}>
                detail
            </button>
        ),
        sortable: false,
    },


];


  return (
    <div className='container-fluid'>
        <TableComponents
                title="Reporting List"
                endPoint={ENDPOINTS.PaginatedReporting}
                headers={columns}
        />
    </div>
  )
}

export default Reporting;
