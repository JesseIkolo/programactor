import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, hashPassword } from '../models/User.model.js';
import { ENV } from '../config/env.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

// Générer l'Access Token (15 minutes)
function generateAccessToken(userId: string, email: string, role: string): string {
  return jwt.sign({ id: userId, email, role }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

// Générer le Refresh Token (7 jours)
function generateRefreshToken(userId: string): string {
  return jwt.sign({ id: userId }, ENV.JWT_REFRESH_SECRET, {
    expiresIn: ENV.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

// Option des cookies sécurisés
const cookieOptions = {
  httpOnly: true,
  secure: ENV.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
};

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401).json({
      success: false,
      message: 'Identifiants invalides.',
    });
    return;
  }

  // Vérifier si le compte est temporairement verrouillé
  if (user.lockUntil && user.lockUntil > new Date()) {
    res.status(403).json({
      success: false,
      message: 'Compte temporairement verrouillé pour des raisons de sécurité. Réessayez plus tard.',
    });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
    }
    await user.save();

    res.status(401).json({
      success: false,
      message: 'Identifiants invalides.',
    });
    return;
  }

  // Réinitialiser les tentatives
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();

  const accessToken = generateAccessToken(user._id.toString(), user.email, user.role);
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshTokenHash = refreshToken;
  await user.save();

  res.cookie('refreshToken', refreshToken, cookieOptions);

  res.json({
    success: true,
    message: 'Connexion réussie.',
    data: {
      token: accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    },
  });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(401).json({
      success: false,
      message: 'Aucun jeton de renouvellement trouvé.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, ENV.JWT_REFRESH_SECRET) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user || user.refreshTokenHash !== refreshToken) {
      res.status(403).json({
        success: false,
        message: 'Jeton de rafraîchissement révoqué ou invalide.',
      });
      return;
    }

    const newAccessToken = generateAccessToken(user._id.toString(), user.email, user.role);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshTokenHash = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    res.json({
      success: true,
      data: {
        token: newAccessToken,
      },
    });
  } catch (err: unknown) {
    res.status(403).json({
      success: false,
      message: 'Jeton de renouvellement expiré ou corrompu.',
    });
  }
}

export async function logout(req: AuthRequest, res: Response): Promise<void> {
  if (req.user) {
    await User.findByIdAndUpdate(req.user.id, { $unset: { refreshTokenHash: 1 } });
  }
  res.clearCookie('refreshToken', cookieOptions);
  res.json({
    success: true,
    message: 'Déconnexion réussie.',
  });
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.user?.id).select('-passwordHash -refreshTokenHash');
  if (!user) {
    res.status(404).json({ success: false, message: 'Utilisateur introuvable.' });
    return;
  }
  res.json({ success: true, data: user });
}

// Initialisation automatique du premier administrateur si la base est vierge
export async function seedInitialAdmin(): Promise<void> {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('[Seed] Création du premier compte administrateur...');
      const hashedPassword = await hashPassword(ENV.INITIAL_ADMIN_PASSWORD);
      await User.create({
        email: ENV.INITIAL_ADMIN_EMAIL.toLowerCase(),
        passwordHash: hashedPassword,
        name: ENV.INITIAL_ADMIN_NAME,
        role: 'SUPER_ADMIN',
      });
      console.log(`[Seed] Administrateur créé avec succès : ${ENV.INITIAL_ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error('[Seed] Erreur lors du seed administrateur :', err);
  }
}
