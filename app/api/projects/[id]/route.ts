import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const projectsFile = path.join(dataDir, 'projects.json');

async function getLocalProjects(): Promise<any[]> {
  try {
    const fileContent = await fs.readFile(projectsFile, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
}

async function saveLocalProjects(projects: any[]): Promise<void> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(projectsFile, JSON.stringify(projects, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Impossible d\'écrire les projets localement (environnement serverless) :', err);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Pousser vers le VPS
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      const authHeader = req.headers.get('authorization');
      await fetch(`${vpsApiUrl}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3500),
      });
    } catch {}

    const projects = await getLocalProjects();
    const index = projects.findIndex((p) => p._id === id || p.slug === id);

    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Projet introuvable.' }, { status: 404 });
    }

    projects[index] = {
      ...projects[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await saveLocalProjects(projects);

    return NextResponse.json({ success: true, message: 'Projet mis à jour avec succès.', data: projects[index] });
  } catch (error) {
    console.error('Erreur API projects PUT :', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la mise à jour.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Supprimer sur le VPS
    const vpsApiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.programactor.pro/api/v1';
    try {
      const authHeader = req.headers.get('authorization');
      await fetch(`${vpsApiUrl}/projects/${id}`, {
        method: 'DELETE',
        headers: authHeader ? { Authorization: authHeader } : {},
        signal: AbortSignal.timeout(3500),
      });
    } catch {}

    let projects = await getLocalProjects();
    const initialLen = projects.length;
    projects = projects.filter((p) => p._id !== id && p.slug !== id);

    if (projects.length === initialLen) {
      return NextResponse.json({ success: false, message: 'Projet introuvable.' }, { status: 404 });
    }

    await saveLocalProjects(projects);

    return NextResponse.json({ success: true, message: 'Projet supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur API projects DELETE :', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la suppression.' }, { status: 500 });
  }
}
