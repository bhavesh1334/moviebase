import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('aws.accessKeyId');
    const secretAccessKey = this.configService.get<string>(
      'aws.secretAccessKey',
    );
    const region = this.configService.get<string>('aws.region');
    const bucketName = this.configService.get<string>('aws.bucketName');

    if (!accessKeyId || !secretAccessKey || !region || !bucketName) {
      throw new Error(
        'Missing required AWS configuration. Please check your environment variables.',
      );
    }

    this.s3Client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      region,
    });
    this.bucketName = bucketName;
    this.region = region;
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      // Validate file type
      const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/jpg',
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
        );
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new BadRequestException(
          'File size too large. Maximum size is 5MB.',
        );
      }

      const key = `posters/${uuidv4()}-${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      // Construct the public URL
      const publicUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to upload file to S3');
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(fileUrl);
      if (key) {
        const command = new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        });
        await this.s3Client.send(command);
      }
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      // Don't throw error for deletion failures in most cases
    }
  }

  async generatePresignedUrl(
    key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const presignedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });

      return presignedUrl;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new BadRequestException('Failed to generate presigned URL');
    }
  }

  private extractKeyFromUrl(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const keyIndex =
        urlParts.findIndex((part) => part === this.bucketName) + 1;
      return keyIndex > 0 ? urlParts.slice(keyIndex).join('/') : null;
    } catch {
      return null;
    }
  }
}
