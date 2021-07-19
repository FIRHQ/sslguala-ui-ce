import httpUtil from "utils/request";

const DOMAIN_LIST = '/api/v1/check_domains';

export function getDomainList(params) {
  return httpUtil.get(DOMAIN_LIST, params);
}

export function getDomainDetails(params) {
  return httpUtil.get(`${DOMAIN_LIST}/${params['id']}`);
}

export function postDomain(params) {
  return httpUtil.post(DOMAIN_LIST, params);
}

export function delDomain(id) {
  return httpUtil.delete(`${DOMAIN_LIST}/${id}`);
}

export function refreshCheckDomain(id, params) {
  return httpUtil.post(`${DOMAIN_LIST}/${id}/check_now`, params);
}

export function validCheckDomain(domain) {
  return httpUtil.get(`${DOMAIN_LIST}/valid`, { domain: domain });
}

export function updateDomainInfo(id, params) {
  return httpUtil.put(`${DOMAIN_LIST}/${id}`, params);
}

export function batchCreateDomains(params) {
  return httpUtil.post(`${DOMAIN_LIST}/batch_create`, params);
}
