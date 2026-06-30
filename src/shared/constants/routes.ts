export const ROUTES = {
  login:'/', dashboard:'/dashboard', maternity:'/maternity',
  settlement:'/settlement', leftNotice:'/left-notice',
  employees:'/employees', employee:(id:string)=>`/employees/${id}`,
  requisition:'/requisition', increment:'/increment', meeting:'/meeting',
  workerRights:'/worker-rights', workerGuideline:(fid:string)=>`/worker-guideline/${fid}`,
  reports:'/reports', grievance:'/grievance', authority:'/authority', database:'/admin/database',
} as const;
