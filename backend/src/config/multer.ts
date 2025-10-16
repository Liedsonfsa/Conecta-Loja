import multer from 'multer';
import path from 'path';

// Define a configuração de armazenamento dos arquivos
const storage = multer.diskStorage({
    // Define a pasta de destino dos uploads
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    // Define o nome do arquivo para evitar nomes duplicados
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

// Cria a instância do Multer com a configuração de armazenamento
const upload = multer({ storage });

export default upload;