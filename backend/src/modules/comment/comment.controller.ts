import { Request, Response } from "express";

import * as commentService from "./comment.service";

export const createComment = async (
  req: Request,
  res: Response
) => {

  try {

    const comment = await commentService.createComment(

      req.body.message,

      req.body.task,

      (req as any).user.id

    );

    res.status(201).json(comment);

  } catch (error) {

    res.status(500).json({
      message: "Failed to create comment",
    });

  }

};

export const getCommentsByTask = async (
  req: Request,
  res: Response
) => {

  try {

    const comments =
      await commentService.getCommentsByTask(
        req.params.taskId as string
      );

    res.status(200).json(comments);

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch comments",
    });

  }

};