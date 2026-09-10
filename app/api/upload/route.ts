import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Aucun fichier transmis.' }, { status: 400 });
    }

    // Vérification type MIME (Images uniquement)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'Format non supporté. Utilisez JPG, PNG, WebP ou SVG.' },
        { status: 400 }
      );
    }

    // Taille max 10MB en entrée
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'Fichier trop lourd (maximum 10 Mo).' },
        { status: 400 }
      );
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const rawExt = path.extname(file.name) || '.jpg';
    const cleanName = path.basename(file.name, rawExt).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    let outputBuffer: Buffer;
    let finalExt = '.webp';

    if (file.type === 'image/svg+xml') {
      outputBuffer = inputBuffer;
      finalExt = '.svg';
    } else if (file.type === 'image/gif') {
      outputBuffer = inputBuffer;
      finalExt = '.gif';
    } else {
      // Compression & optimisation automatique WebP max 1600px
      outputBuffer = await sharp(inputBuffer)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toBuffer();
    }

    const filename = `${cleanName}-${Date.now()}${finalExt}`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, outputBuffer);

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      sizeBytes: outputBuffer.length,
    });
  } catch (error) {
    console.error('Erreur upload API :', error);
    return NextResponse.json({ success: false, message: "Erreur lors de l'enregistrement et de l'optimisation de l'image." }, { status: 500 });
  }
}
