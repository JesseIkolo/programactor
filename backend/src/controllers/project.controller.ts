import { Request, Response } from 'express';
import { Project } from '../models/Project.model.js';

export async function getProjects(req: Request, res: Response): Promise<void> {
  const { status = 'PUBLISHED' } = req.query;

  const query: any = {};
  if (status && status !== 'ALL') {
    query.status = status;
  }

  const projects = await Project.find(query).sort({ displayOrder: 1, createdAt: -1 });

  res.json({
    success: true,
    data: projects,
  });
}

export async function getProjectBySlug(req: Request, res: Response): Promise<void> {
  const { slug } = req.params;
  const project = await Project.findOne({ slug });

  if (!project) {
    res.status(404).json({ success: false, message: 'Projet introuvable.' });
    return;
  }

  res.json({ success: true, data: project });
}

export async function createProject(req: Request, res: Response): Promise<void> {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
}

export async function updateProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const project = await Project.findByIdAndUpdate(id, req.body, { new: true });

  if (!project) {
    res.status(404).json({ success: false, message: 'Projet introuvable.' });
    return;
  }

  res.json({ success: true, data: project });
}

export async function deleteProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const project = await Project.findByIdAndDelete(id);

  if (!project) {
    res.status(404).json({ success: false, message: 'Projet introuvable.' });
    return;
  }

  res.json({ success: true, message: 'Projet supprimé avec succès.' });
}
