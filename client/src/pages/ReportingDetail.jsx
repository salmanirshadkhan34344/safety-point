import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import ReportInfo from '../components/global/Reports/ReportInfo';
import TableComponents from '../components/global/TableComponents/TableComponents';
import Comment from '../components/global/comments/Comment';
import UserAvatar from '../components/global/user/UserAvatar';
import { ENDPOINTS } from '../util/EndPoint';
import { getParam } from '../util/Helper';



const ReportingDetail = () => {

  const [reportId, setReportId] = useState(0);

  useEffect(() => {
    const reportIds = getParam("report_id")
    if (reportIds> 0) {
      setReportId(reportIds)
    }

  }, []);

  const columnsComment = [
    {
      name: 'Comments',
      selector: (row) => <Comment itemPro={row} />,
      sortable: false,
      wrap: true,
      minWidth: '300px'
  },



  ];

  const columnslikes = [
    {
      name: 'Likes',
      selector: (row) => <UserAvatar user={row?.user} />,
      sortable: false,
      wrap: true,
      minWidth: '300px'
  },

];


  return (

    <div className="container-fluid user-profile-nav-tabs">
      <h3 className='text-primary'>Reports</h3>

      <Tabs
        defaultActiveKey="report-info"
        className="mb-3"
      >
        <Tab eventKey="report-info" title="Report info">
        {reportId > 0 && (
          <ReportInfo reportId={reportId} />
        )}
        </Tab>
        <Tab eventKey="comments" title="Comments">

          {reportId > 0 && (

            <TableComponents
              title={`comments`}
              endPoint={ENDPOINTS.PaginatedComments}
              headers={columnsComment}
              searchObject={{ report_id: reportId }}
            />
          )}

        </Tab>
        <Tab eventKey="like" title="Likes">
          {reportId > 0 && (
            <TableComponents
              title="Likes"
              endPoint={ENDPOINTS.Paginatedlikes}
              headers={columnslikes}
              searchObject={{ report_id: reportId }}
            />
          )}
        </Tab>

      </Tabs>
    </div >


  )
}

export default ReportingDetail