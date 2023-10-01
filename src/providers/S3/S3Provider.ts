import { S3, S3ClientConfig } from '@aws-sdk/client-s3';

import {
  S3ProviderDTO,
  SaveFormatDTO,
  S3FormatCreateBucketDTO,
} from './models/S3formatDTO';
import { AppError } from 'src/shared/handlers/AppError';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Provider implements S3ProviderDTO {
  private s3: S3;

  constructor() {
    try {
      this.s3 = new S3(this.awsS3Config() as S3ClientConfig);
    } catch (err) {
      console.log('An Error occured while trying to connect to S3: ', [err]);
      throw new AppError(`Connection with S3 is not available: ${err}`, 502);
    }
  }
  public get(key: string): string {
    const envirommentVariable = process.env[key];
    if (!envirommentVariable)
      throw new AppError('Enviromment variable not found', 500);
    else {
      return envirommentVariable;
    }
  }
  public awsS3Config(): S3ClientConfig {
    return {
      region: this.get('AWS_REGION'),
      credentials: {
        secretAccessKey: this.get('AWS_SECRET_ACCESS_KEY'),
        accessKeyId: this.get('AWS_ACCESS_KEY_ID'),
      },
    };
  }

  public async checkIfBucketExists(bucketName: string): Promise<boolean> {
    const buckets = await this.s3.listBuckets({});
    if (!buckets.Buckets) {
      return false;
    }
    const bucket = buckets.Buckets.find((bucket) => bucket.Name === bucketName);
    if (bucket) {
      console.log(`Bucket was found by the name of: ${bucket}`, [bucket]);
      return true;
    }
    return false;
  }
  public async createBucket({
    Bucket,
    ACL,
  }: S3FormatCreateBucketDTO): Promise<void> {
    const params: any = {};
    params.Bucket = Bucket;
    if (ACL) params.ACL = ACL;
    // params.ObjectOwnership = 'BucketOwnerEnforced';
    await this.s3.createBucket(params);
  }
  public async deleteObject(Bucket: string, Key: string): Promise<void> {
    try {
      await this.s3.deleteObject({ Bucket, Key });
      console.log(`An Object was deleted from bucket ${Bucket} of name: `, [
        Key,
      ]);
    } catch (error) {
      console.log(`Error on trying to delete object due to: ${error}`, [
        Bucket,
        Key,
      ]);
      throw new AppError(
        `Error while trying to delete previous user image: ${error}`,
        500,
      );
    }
  }
  public async saveInS3(bucket: SaveFormatDTO): Promise<string> {
    try {
      const bucketExists = await this.checkIfBucketExists(bucket.Bucket);

      if (!bucketExists)
        await this.createBucket({ Bucket: bucket.Bucket, ACL: bucket.ACL });
      await this.s3.putObject(bucket);
      const url = `https://${bucket.Bucket}.s3.amazonaws.com/${bucket.Key}`;
      console.log(
        `Object was uploaded to bucket: ${bucket.Bucket}. Check it on the url: ${url}`,
      );
      return url;
    } catch (err) {
      throw new AppError(
        `Error while trying to upload user image: ${err}`,
        500,
      );
    }
  }
}
