import React from 'react';
import { Table } from 'react-bootstrap';
import CustomTooltip from '../Tooltip/CustomTooltip';
import UserAvatar from './UserAvatar';

const UserInfo = ({user}) => {


  return (
    <div>
      <Table striped bordered hover className='user-detail-info-table border-primary'>
                  <tbody>
                    <tr>
                      <th>User</th>
                      <td> <UserAvatar user={user} /></td>
                    </tr>
                    <tr>
                      <th>Phone</th>
                      <td> {user?.phone_number}</td>
                    </tr>
                    <tr>
                      <th>Role</th>
                      <td> {user?.role}</td>
                    </tr>
                    <tr>
                      <th>Verified</th>
                      <td>
                      <CustomTooltip descriptionPro={user?.is_verified?"Yes":"No"} />
                      </td>
                    </tr>
                    <tr>
                      <th>Deleted</th>
                      <td>
                      <CustomTooltip descriptionPro={user?.is_deleted?"Yes":"No"} />
                      </td>
                    </tr>
                    <tr>
                      <th>Block</th>
                      <td> <CustomTooltip descriptionPro={user?.is_block?"Yes":"No"} />
                      </td>
                    </tr>
                    <tr>
                      <th>Status</th>
                      <td>
                      <CustomTooltip descriptionPro={user?.user_status?"Yes":"No"} />
                      </td>
                   </tr>
                  </tbody>
      </Table>
    </div>
  )
}

export default UserInfo