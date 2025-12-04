import express from "express";
import authRouter from "./auth.router";
import cardnewsRouter from "./cardnews.router";
import dialoguesRouter from "./dialogues.router";
import modulesRouter from "./modules.router";
import projectsRouter from "./projects.router";
import projectWorkflowsRouter from "./projectWorkflows.router";
import quizesRouter from "./quizes.router";
import userProjectsRouter from "./userProjects.router";
import userQuizAnswersRouter from "./userQuizAnswers.router";
import userWorkflowAnswersRouter from "./userWorkflowAnswers.router";
import usersRouter from "./users.router";
import workflowStepsRouter from "./workflowSteps.router";

const router = express.Router();

export default (): express.Router => {
  authRouter(router);
  cardnewsRouter(router);
  dialoguesRouter(router);
  modulesRouter(router);
  projectsRouter(router);
  projectWorkflowsRouter(router);
  quizesRouter(router);
  userProjectsRouter(router);
  userQuizAnswersRouter(router);
  usersRouter(router);
  userWorkflowAnswersRouter(router);
  workflowStepsRouter(router);
  return router;
};
