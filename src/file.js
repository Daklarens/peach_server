const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class FileService {
  // Получаем расширение из base64 строки
  static getExtensionFromBase64(base64) {
    const matches = base64.match(/^data:image\/(\w+);base64,/);
    return matches ? `.${matches[1]}` : null;
  }

  // Генерируем случайное имя для файла
  static crName() {
    return Math.random().toString(36).substring(2, 15);
  }

  // Обработка изображения: удаление мета-тегов, изменение размера и сжатие
  static async processAndSaveImage(base64Image, outputDir) {
    const extension = FileService.getExtensionFromBase64(base64Image);
    
    if (!extension) {
      throw new Error('Invalid image format');
    }

    const imageData = base64Image.split(';base64,').pop();
    const filename = `image_${Date.now()}${FileService.crName()}${extension}`;
    const filepath = path.join(outputDir, filename);

    // Создаем буфер из base64 строки
    const imageBuffer = Buffer.from(imageData, 'base64');

    // Обработка изображения с помощью sharp
    await sharp(imageBuffer)
      .jpeg({ quality: 80, progressive: true }) // Сжимаем JPEG с качеством 80
      .toFile(filepath);

    return filename; // Возвращаем имя файла для дальнейшего использования
  }
}

module.exports = FileService;