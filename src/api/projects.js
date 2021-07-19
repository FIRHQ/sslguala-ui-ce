import httpUtil from "utils/request";

const PROJECT = '/api/v1/projects';

export function getProjectList(params) {
  return httpUtil.get(PROJECT, params);
}

export function addProjecctItem(params) {
  return httpUtil.post(PROJECT, params);
}

export function delProjectItem(id) {
  return httpUtil.delete(`${PROJECT}/${id}`);
}

export function transferProject(id, params) {
  return httpUtil.post(`${PROJECT}/${id}/add_domains`, params);
}