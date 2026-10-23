const path = require('path');
const { randomUUID } = require('crypto');
const sharp = require('sharp');
const { DeleteObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { createR2Client, getR2Config } = require('../config/r2');

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 8000;
const MAX_IMAGE_PIXELS = 40_000_000;
const SUPPORTED_FORMATS = new Set(['jpeg', 'png', 'webp']);

function invalidImage(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function buildPublicUrl(baseUrl, objectKey) {
  return `${baseUrl}/${objectKey.split('/').map(encodeURIComponent).join('/')}`;
}

function objectKeyFromUrl(imageUrl, userId, publicBaseUrl) {
  try {
    const expected = new URL(`${publicBaseUrl}/`);
    const actual = new URL(imageUrl);
    if (actual.origin !== expected.origin) return null;
    const prefix = `${expected.pathname.replace(/\/+$/, '')}/`;
    if (!actual.pathname.startsWith(prefix)) return null;
    const key = actual.pathname.slice(prefix.length).split('/').map(decodeURIComponent).join('/');
    if (!key.startsWith(`profile-pictures/${userId}/`) || !key.endsWith('.webp')) return null;
    return key;
  } catch {
    return null;
  }
}

async function processProfilePicture(file) {
  if (!file || !Buffer.isBuffer(file.buffer)) throw invalidImage('Please choose an image.');
  if (file.size > MAX_FILE_SIZE) throw invalidImage('Profile pictures must be 5 MB or smaller.');

  let metadata;
  try {
    metadata = await sharp(file.buffer, { failOn: 'error' }).metadata();
  } catch {
    throw invalidImage('The uploaded file is not a valid image.');
  }

  if (!SUPPORTED_FORMATS.has(metadata.format)) throw invalidImage('Only JPEG, PNG, and WebP images are supported.');
  if (!metadata.width || !metadata.height || metadata.width > MAX_IMAGE_DIMENSION || metadata.height > MAX_IMAGE_DIMENSION || metadata.width * metadata.height > MAX_IMAGE_PIXELS) {
    throw invalidImage('That image is too large to process.');
  }

  try {
    const output = await sharp(file.buffer, { failOn: 'error' })
      .rotate()
      .resize(512, 512, { fit: 'cover', position: 'attention' })
      .webp({ quality: 80 })
      .toBuffer();
    const outputMetadata = await sharp(output, { failOn: 'error' }).metadata();
    if (outputMetadata.format !== 'webp') throw new Error('Image conversion failed.');
    return output;
  } catch {
    throw invalidImage('The uploaded image could not be processed.');
  }
}

async function uploadProfilePicture(file, userId) {
  const imageBuffer = await processProfilePicture(file);
  const config = getR2Config();
  const objectKey = path.posix.join('profile-pictures', String(userId), `${randomUUID()}.webp`);
  const client = createR2Client();
  await client.send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: objectKey,
    Body: imageBuffer,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000, immutable',
  }));
  return { objectKey, url: buildPublicUrl(config.publicBaseUrl, objectKey), client, bucket: config.bucket };
}

async function deleteProfilePicture(upload, objectKey) {
  if (!objectKey) return;
  await upload.client.send(new DeleteObjectCommand({ Bucket: upload.bucket, Key: objectKey }));
}

async function deleteProfilePictureObject(objectKey) {
  if (!objectKey) return;
  const config = getR2Config();
  const client = createR2Client();
  await client.send(new DeleteObjectCommand({ Bucket: config.bucket, Key: objectKey }));
}

function getPreviousObjectKey(imageUrl, userId) {
  if (!imageUrl) return null;
  return objectKeyFromUrl(imageUrl, userId, getR2Config().publicBaseUrl);
}

module.exports = {
  MAX_FILE_SIZE,
  processProfilePicture,
  uploadProfilePicture,
  deleteProfilePicture,
  deleteProfilePictureObject,
  getPreviousObjectKey,
};
