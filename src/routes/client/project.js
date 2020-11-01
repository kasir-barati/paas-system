const router = require('express').Router();

const { isUser } = require('../../middlewares/jwt');
const { asyncMiddlewareHandler } = require('../../utils/promise');
const projectValidator = require('../../validators/client/project');
const projectController = require('../../controllers/client/project');

// /client/api/v1/projects
router
    .route('/')
    .all(asyncMiddlewareHandler(isUser))
    .get(asyncMiddlewareHandler(projectController.projectsList))
    .post(asyncMiddlewareHandler(projectValidator.createProjectService), asyncMiddlewareHandler(projectController.createProjectService));

router
    .route('/:id')
    .all(asyncMiddlewareHandler(isUser))
    .delete(asyncMiddlewareHandler(projectValidator.checkProjectId), asyncMiddlewareHandler(projectController.deleteProject));

router
    .route('/:id/upload-files')
    .all(asyncMiddlewareHandler(isUser))
    .post(asyncMiddlewareHandler(projectValidator.checkProjectId), asyncMiddlewareHandler(projectController.uploadProjectZipFile));

router
    .route('/:id/create')
    .all(asyncMiddlewareHandler(isUser))
    .get(asyncMiddlewareHandler(projectValidator.checkProjectId), asyncMiddlewareHandler(projectController.verifyProject));

router
    .route('/:id/stats')
    .all(asyncMiddlewareHandler(isUser))
    .delete(asyncMiddlewareHandler(projectValidator.checkProjectId), asyncMiddlewareHandler(projectController.projectStats));

router
    .route('/:id/inspect')
    .all(asyncMiddlewareHandler(isUser))
    .delete(asyncMiddlewareHandler(projectValidator.checkProjectId), asyncMiddlewareHandler(projectController.projectInspect));

router
    .route('/:id/logs')
    .all(asyncMiddlewareHandler(isUser))
    .delete(asyncMiddlewareHandler(projectValidator.checkProjectId), asyncMiddlewareHandler(projectController.projectLogs));

router
    .route('/:id/exec')
    .all(asyncMiddlewareHandler(isUser))
    .delete(asyncMiddlewareHandler(projectValidator.checkProjectId), asyncMiddlewareHandler(projectValidator.execInProject), asyncMiddlewareHandler(projectController.execInProject));

router
    .route('/:id/update/resources')
    .all(asyncMiddlewareHandler(isUser))
    .put(asyncMiddlewareHandler(projectValidator.updateProjectResources), asyncMiddlewareHandler(projectController.updateProjectResources));

router
    .route('/:id/update/envs')
    .all(asyncMiddlewareHandler(isUser))
    .put(asyncMiddlewareHandler(projectValidator.updateProjectEnvs), asyncMiddlewareHandler(projectController.updateProjectEnvs));

router
    .route('/images')
    .all(asyncMiddlewareHandler(isUser))
    .get(asyncMiddlewareHandler(projectController.readProjectsImages));

module.exports = router;