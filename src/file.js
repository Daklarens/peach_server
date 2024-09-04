const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class FileService {
  // Генерируем случайное имя для файла
  static crName() {
    return Math.random().toString(36).substring(2, 15);
  }

  // Обработка изображения: удаление мета-тегов, изменение размера и сжатие
  static async processAndSaveImage(file, outputDir) {
    const filename = `image_${Date.now()}${FileService.crName()}${path.extname(file.originalname)}`;
    const filepath = path.join(outputDir, filename);

    // Обработка изображения с помощью sharp
    await sharp(file.buffer)
      .jpeg({ quality: 80, progressive: true }) // Сжимаем JPEG с качеством 80
      .toFile(filepath);

    return filename; // Возвращаем имя файла для дальнейшего использования
  }
}

module.exports = FileService;