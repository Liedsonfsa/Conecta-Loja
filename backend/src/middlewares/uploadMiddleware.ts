import multer from 'multer';
import path from 'path';
import { Request } from 'express';

/**
 * Middleware de upload de imagens para produtos
 *
 * Configurações:
 * - Destino: uploads/products/
 * - Tipos aceitos: .jpg, .jpeg, .png, .webp
 * - Tamanho máximo: 5MB por arquivo
 * - Nomes únicos gerados automaticamente
 */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp + random + extensão original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `product-${uniqueSuffix}${extension}`);
  }
});

// Filtro para validar tipos de arquivo
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Apenas imagens são permitidas (jpeg, jpg, png, webp)'));
  }
};

// Configuração do multer
export const uploadProductImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Apenas 1 arquivo por vez
  }
});

/**
 * Middleware para upload de imagem de produto
 *
 * Uso em rotas:
 * router.post('/:id/upload-image', uploadProductImage.single('image'), uploadImage);
 *
 * No frontend (FormData):
 * const formData = new FormData();
 * formData.append('image', file);
 * fetch('/api/product/123/upload-image', { method: 'POST', body: formData });
 */
export const uploadSingleImage = uploadProductImage.single('image');

/**
 * Função utilitária para obter o caminho completo da imagem
 *
 * @param filename - Nome do arquivo salvo
 * @returns Caminho completo para acessar via URL
 */
export const getImagePath = (filename: string): string => {
  return `/uploads/products/${filename}`;
};

/**
 * Função utilitária para validar se um arquivo existe
 *
 * @param filename - Nome do arquivo
 * @returns true se o arquivo existe
 */
export const imageExists = (filename: string): boolean => {
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join('uploads/products/', filename);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
};
