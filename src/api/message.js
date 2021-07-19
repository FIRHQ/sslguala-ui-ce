import httpUtil from "utils/request";

const CHANNEL = '/api/v1/msg_channels';

export function getChannelList(params) {
  return httpUtil.get(CHANNEL, params);
}

export function postChannel(params) {
  return httpUtil.post(CHANNEL, params);
}

export function bindChannelDomain(id, domainId) {
  return httpUtil.post(`${CHANNEL}/${id}/bind?domain_id=${domainId}`);
}

export function unbindChannelDomain(id, domainId) {
  return httpUtil.post(`${CHANNEL}/${id}/unbind?domain_id=${domainId}`);
}

export function deleteChannel(id) {
  return httpUtil.delete(`${CHANNEL}/${id}`);
}

export function trySendChannelMessage(id, domainId) {
  return httpUtil.post(`${CHANNEL}/${id}/try_send_message?domain_id=${domainId}`);
}

export function batchBindChannel(id, params) {
  return httpUtil.post(`${CHANNEL}/${id}/multiple_bind`, params);
}
