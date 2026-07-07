import { Request, Response } from "express";
import * as taskService from "./task.service";

export const createTask = async (
  req: Request,
  res: Response
) => {

  const task = await taskService.createTask(
    req.body.title,
    req.body.description,
    req.body.projectId,
    (req as any).user.id
  );

  res.status(201).json(task);
};

export const getProjectTasks = async (
  req: Request,
  res: Response
) => {

  const tasks = await taskService.getProjectTasks(
    req.params.projectId as string
  );

  res.json(tasks);
};
export const updateTaskStatus = async (
  req: Request,
  res: Response
) => {

  const task = await taskService.updateTaskStatus(

    req.params.taskId as string,

    req.body.status

  );

  res.json(task);

};

export const assignTask = async (
  req: Request,
  res: Response
) => {

  const task =
    await taskService.assignTask(

      req.params.taskId as string,

      req.body.assignedTo

    );

  res.json(task);

};