import { Router } from 'express';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Consultation publique
router.get('/projects', getProjects);
router.get('/projects/:slug', getProjectBySlug);

// Gestion administrative (CRUD)
router.post('/projects', requireAuth, createProject);
router.put('/projects/:id', requireAuth, updateProject);
router.delete('/projects/:id', requireAuth, deleteProject);

export default router;
