

export const BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const BASE_IMG_URL = process.env.REACT_APP_API_FILES_URL;
export const ENDPOINTS = {

  // User Login
  UserLogin: `${BASE_URL}api/auth/login`,

  // Dashboard Chart
  DashboardUserChart: `${BASE_URL}api/admin/chart-current-year-users`,
  DashboardReportingChart: `${BASE_URL}api/admin/chart-current-year-reporting`,
  DashboarCardHeader: `${BASE_URL}api/admin/card-header`,
  DashboardInfo: `${BASE_URL}api/admin/dashboard-info`,
  UpdateContent: `${BASE_URL}api/admin/update-content`,

  // Users
  PaginatedUsers: `${BASE_URL}api/admin/user-paginated`,
  UserDetail: `${BASE_URL}api/admin/user-detail`,


  // Reports
  PaginatedReported: `${BASE_URL}api/admin/reported-paginated`,
  PaginatedReporting: `${BASE_URL}api/admin/reporting-paginated`,
  ReportingDetail: `${BASE_URL}api/admin/reporting-detail`,
  PaginatedComments: `${BASE_URL}api/admin/reporting-comments-paginated`,
  Paginatedlikes: `${BASE_URL}api/admin/reporting-like-paginated`,
  ReportDelete: `${BASE_URL}api/admin/delete-report`,

  //contact 
  ContactUsPaginated: `${BASE_URL}api/admin/contact-us-paginated`,





};
