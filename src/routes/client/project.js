const router = require('express').Router();

const { isUser } = require('../../middlewares/jwt');
const { middlewareHandler } = require('../../utils/promise');
const projectValidator = require('../../validators/client/project');
const projectController = require('../../controllers/client/project');

// /client/api/v1/projects
router
    .route('/')
    .all(middlewareHandler(isUser))
    .get(middlewareHandler(projectController.projectsList))
    .post(middlewareHandler(projectValidator.createProjectService), middlewareHandler(projectController.createProjectService));

router
    .route('/:id')
    .all(middlewareHandler(isUser))
    .delete(middlewareHandler(projectValidator.checkProjectId), middlewareHandler(projectController.deleteProject));

router
    .route('/:id/upload-files')
    .all(middlewareHandler(isUser))
    .post(middlewareHandler(projectValidator.checkProjectId), middlewareHandler(projectController.uploadProjectZipFile));

router
    .route('/:id/create')
    .all(middlewareHandler(isUser))
    .get(middlewareHandler(projectValidator.checkProjectId), middlewareHandler(projectController.verifyProject));

router
    .route('/:id/stats')
    .all(middlewareHandler(isUser))
    .delete(middlewareHandler(projectValidator.checkProjectId), middlewareHandler(projectController.projectStats));

router
    .route('/:id/inspect')
    .all(middlewareHandler(isUser))
    .delete(middlewareHandler(projectValidator.checkProjectId), middlewareHandler(projectController.projectInspect));

router
    .route('/:id/logs')
    .all(middlewareHandler(isUser))
    .delete(middlewareHandler(projectValidator.checkProjectId), middlewareHandler(projectController.projectLogs));

router
    .route('/:id/exec')
    .all(middlewareHandler(isUser))
    .delete(middlewareHandler(projectValidator.checkProjectId), middlewareHandler(projectValidator.execInProject), middlewareHandler(projectController.execInProject));

router
    .route('/:id/update/resources')
    .all(middlewareHandler(isUser))
    .put(middlewareHandler(projectValidator.updateProjectResources), middlewareHandler(projectController.updateProjectResources));

router
    .route('/:id/update/envs')
    .all(middlewareHandler(isUser))
    .put(middlewareHandler(projectValidator.updateProjectEnvs), middlewareHandler(projectController.updateProjectEnvs));

router
    .route('/images')
    .all(middlewareHandler(isUser))
    .get(middlewareHandler(projectController.readProjectsImages));

module.exports = router;