import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { query } from '../db/pool.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = '7d';

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export async function register(req, res, next) {
  try {
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const { rows } = await query(
      'INSERT INTO users(full_name, email, password_hash, role) VALUES($1, $2, $3, $4) RETURNING id, full_name, email, role',
      [full_name, email.toLowerCase(), hashed, 'player']
    );

    const user = rows[0];
    const token = generateToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    const { rows } = await query('SELECT id, full_name, email, role, password_hash FROM users WHERE email = $1', [
      email.toLowerCase()
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    delete user.password_hash;
    const token = generateToken(user);

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
}

export async function profile(req, res, next) {
  try {
    const { rows } = await query('SELECT id, full_name, email, role FROM users WHERE id = $1', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
}
