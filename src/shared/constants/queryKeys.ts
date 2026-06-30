export const QK = {
  employees:   { root:['employees'] as const, all:(fid:string)=>['employees',fid] as const, detail:(fid:string,id:string)=>['employees',fid,id] as const },
  settlements: { root:['settlements'] as const, all:(fid:string)=>['settlements',fid] as const },
  maternity:   { root:['maternity'] as const,   all:(fid:string)=>['maternity',fid] as const },
  leftNotice:  { root:['leftnotice'] as const,  all:(fid:string)=>['leftnotice',fid] as const },
  requisitions:{ root:['requisitions'] as const, all:(fid:string)=>['requisitions',fid] as const },
  increments:  { root:['increments'] as const,  all:(fid:string)=>['increments',fid] as const },
  meetings:    { root:['meetings'] as const,     all:(fid:string)=>['meetings',fid] as const },
  grievances:  { root:['grievances'] as const,   all:(fid:string)=>['grievances',fid] as const },
  stats:       { root:['stats'] as const,        factory:(fid:string)=>['stats',fid] as const },
} as const;
