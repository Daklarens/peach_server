const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class FileService {
  // Генерируем случайное имя для файла
  static crName() {
    return Math.random().toString(36).substring(2, 15);
  }

  // Проверяем существование выходной директории и создаем ее, если она не существует
  static ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Обработка изображения: удаление мета-тегов, изменение размера и сжатие
  static async processAndSaveImage(file, outputDir) {
    // Убедимся, что выходная директория существует
    FileService.ensureDirectoryExists(outputDir);

    // Генерируем новое имя файла
    const filename = `image_${Date.now()}_${FileService.crName()}${path.extname(file.originalname)}`;
    const filepath = path.join(outputDir, filename);

    try {
      // Обрабатываем изображение с помощью sharp
      const image = sharp(file.path); // Инициализация sharp с файлом
      
      // Получение метаданных (необязательно)
      const metadata = await image.metadata();

      // Применяем нужные преобразования к изображению
      await image
        .jpeg({ quality: 80, progressive: true }) // Сжимаем JPEG с качеством 80
        .toFile(filepath); // Сохраняем обработанное изображение

      // Удаляем оригинальный загруженный файл
      fs.unlinkSync(file.path);

      return filename; // Возвращаем новое имя файла для дальнейшего использования
    } catch (error) {
      console.error('Ошибка при обработке изображения:', error);
      throw new Error('Ошибка обработки изображения');
    }
  }
}

module.exports = FileService;