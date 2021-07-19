export default {
  updateProject(state, payload) {
    state.projectList = payload.projectList;
  },
  delProjectItem(state, payload) {
    state.projectList = state.projectList.filter((item) => item.id !== payload.id);
  },
  addProjectItem(state, payload) {
    const data = state.projectList;
    data.push(payload.data);
    state.projectList = data;
  },
  updateCurrentProjectId(state, payload) {
    state.currentProjectId = payload.currentProjectId;
  },
  updateProjectItemCount(state, payload) {
    const index = state.projectList.findIndex((item) => item.id === payload.id);
    const constProjectIndex = state.projectList.findIndex((item) => item.id == payload.currentProjectId);
    state.projectList[constProjectIndex].check_domains_count -= 1;
    state.projectList[index].check_domains_count += 1;
  },
};
