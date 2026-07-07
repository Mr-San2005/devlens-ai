import { getProjectTasks } from "../tools/task.tool";

export const askProjectAgent = async (
  projectId: string
) => {

  const tasks =
    await getProjectTasks(projectId);

  return tasks;

};