import React, { useEffect, useState } from 'react';

import moment from 'moment';
import { Tab, Tabs } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import TableComponents from '../components/global/TableComponents/TableComponents';
import CustomTooltip from '../components/global/Tooltip/CustomTooltip';
import UserAvatar from '../components/global/user/UserAvatar';
import UserInfo from '../components/global/user/UserInfo';
import { apiPost } from '../util/ApiRequest';
import { ENDPOINTS } from '../util/EndPoint';
import { getParam } from '../util/Helper';
import { isLoaderState } from '../util/RecoilStore';

const UserDetail = () => {


  const [userId, setUserId] = useState(0);
  const [user, setUser] = useState({});
  const [isLoaderInfo, setIsLoaderInfo] = useRecoilState(isLoaderState);
  const navigate = useNavigate();
  const columnsReports = [
    {
        name: 'ID',
        selector: (row) => row.id,
        sortable: false,
        width: '60px'
    },

    {
      name: 'Message',
      selector: (row) => row?.text,
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

const columnsReported = [
  {
      name: 'ID',
      selector: (row) => row.id,
      sortable: false,
      width: '60px'
  },
  {
      name: 'User',
      selector: (row) => <UserAvatar user={row.reported_by} />,
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

  useEffect(() => {
    const userID = getParam("user_id")
    setUserId(userID);
    getUserInfo(userID);
  }, [userId]);

  const getUserInfo = (userId) => {
    setIsLoaderInfo(true)
    let body = {
      user_id: userId,
    };
    apiPost(
      ENDPOINTS.UserDetail,
      body,
      (res) => {
        setUser(res.data)
        setIsLoaderInfo(false);
      },
      (error) => {
        console.log(error, ' error');
        setIsLoaderInfo(false);
      },
    );
  };

  return (

    <div className="container-fluid   user-profile-nav-tabs">
      <h3 className='text-primary'>User Details</h3>

      <Tabs
        defaultActiveKey="user-info"
        className="mb-3"
      >
        <Tab eventKey="user-info" title="User Info">
        {user?.id > 0 && (
          <UserInfo user={user}/>
        )}
        </Tab>

        <Tab eventKey="reports" title="Reports">
          {user?.id > 0 &&(
            <TableComponents
              title={`Reports`}
              endPoint={ENDPOINTS.PaginatedReporting}
              headers={columnsReports}
              searchObject={{ user_id: user?.id }}
            />
          )}

        </Tab>
        <Tab eventKey="reported" title="Reported">
          {user?.id > 0 &&(
            <TableComponents
              title={`Reported`}
              endPoint={ENDPOINTS.PaginatedReported}
              headers={columnsReported}
              searchObject={{ user_id: user?.id }}
            />
          )}

        </Tab>

      </Tabs>
    </div >



  );
};

export default UserDetail