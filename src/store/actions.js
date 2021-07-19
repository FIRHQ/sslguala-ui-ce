import { getProjectList } from "api/projects";

export default {
  async updateProjectList(ctx) {
    const { data } = await getProjectList();
    ctx.commit("updateProject", {
      projectList: data,
    });
  },
};
