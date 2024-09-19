import React from 'react';
import { useNavigate } from 'react-router';
import TableComponents from '../components/global/TableComponents/TableComponents';
import CustomTooltip from "../components/global/Tooltip/CustomTooltip";
import UserAvatar from '../components/global/user/UserAvatar';
import { ENDPOINTS } from '../util/EndPoint';
 const Users = () => {

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
        selector: (row) => <UserAvatar user={row} />,
        sortable: false,
        wrap: true,
        maxWidth: '400px',
        minWidth: '250px'
    },

    {
      name: 'First Name',
      selector: (row) => row?.first_name,
      sortable: false,
  },
    {
      name: 'Last Name',
      selector: (row) => row?.last_name,
      sortable: false,
  },
    {
      name: 'Phone Number',
      selector: (row) => row?.phone_number,
      sortable: false,
  },
    {
      name: 'Role',
      selector: (row) => row?.role,
      sortable: false,
  },
    {
      name: 'Verified',
      selector: (row) => <CustomTooltip descriptionPro={row?.is_verified?"Yes":"No"} />,
        sortable: false,
  },
    {
      name: 'Block',
      selector: (row) => <CustomTooltip descriptionPro={row?.is_block?"Yes":"No"} />,
      sortable: false,
  },

    {
        name: 'Detail',
        selector: (row) => (
            <button className="btn btn-primary" onClick={() => {
              navigate(`/admin/user-detail?user_id=${row.id}`);
            }}>
                detail
            </button>
        ),
        sortable: false,
    },
];

  return (
    <div>
        <TableComponents
                title="Users List"
                endPoint={ENDPOINTS.PaginatedUsers}
                headers={columns}
            />
    </div>
  )
}

export default Users;
