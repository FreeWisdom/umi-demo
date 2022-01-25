import request from '@/utils/request';

export async function getPlanList(payload: any) {
  const {
    planName: name,
    creatTime,
    status: calculateStatus,
    planType,
    pageNum,
    pageSize,
  } = payload;

  if (creatTime) {
    return request(
      `/blank/plan/list/pageQuery?name=${name}&calculateStatus=${calculateStatus}&pageNum=${pageNum}&pageSize=${pageSize}&planType=${planType}&createTime=${creatTime}`,
      {
        method: 'GET',
      },
    );
  } else {
    return request(
      `/blank/plan/list/pageQuery?name=${name}&calculateStatus=${calculateStatus}&pageNum=${pageNum}&pageSize=${pageSize}&planType=${planType}`,
      {
        method: 'GET',
      },
    );
  }
}

export async function startCalculate(payload: any) {
  return request(`/blank/plan/calculate/${payload}`, {
    method: 'POST',
  });
}

export async function stopCalculate(payload: any) {
  return request(`/blank/plan/stopCalculate/${payload}`, {
    method: 'PUT',
  });
}

export async function handleCopyPlan(payload: any) {
  return request(`/blank/plan/copyPlan?planId=${payload}`, {
    method: 'GET',
  });
}

export async function handleDeletePlan(payload: any) {
  return request(`/blank/plan/${payload}`, {
    method: 'DELETE',
  });
}

export async function handleAddPlan(payload: any) {
  return request(`/blank/plan/createPlan?planType=${payload}`, {
    method: 'GET',
  });
}

export async function handleDownloadPlan(payload: any) {
  return request(`/blank/plan/export/${payload}`, {
    method: 'GET',
  });
}
