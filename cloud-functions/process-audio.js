const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

admin.initializeApp();
const bucket = admin.storage().bucket();

exports.processAudio = functions.storage
  .object()
  .onFinalize(async (object) => {
    const filePath = object.name;
    const fileName = path.basename(filePath);
    
    if (!filePath.includes('recordings/') || !filePath.endsWith('.mp3')) {
      return null;
    }

    const tempFilePath = path.join('/tmp', fileName);
    const metadataFilePath = path.join('/tmp', `${fileName}.json`);

    // Download file
    await bucket.file(filePath).download({ destination: tempFilePath });

    // Process audio
    const duration = await new Promise((resolve) => {
      ffmpeg.ffprobe(tempFilePath, (err, metadata) => {
        resolve(Math.floor(metadata.format.duration));
      });
    });

    // Save metadata
    fs.writeFileSync(metadataFilePath, JSON.stringify({ duration }));

    // Upload metadata
    await bucket.upload(metadataFilePath, {
      destination: `${filePath}.meta`
    });

    // Cleanup
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(metadataFilePath);

    return true;
  });