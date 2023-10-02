export interface SaveFormatDTO {
  Bucket: string;
  ACL?: string;
  Key: string;
  ContentType: string;
  Body: Buffer;
}

export interface S3FormatCreateBucketDTO {
  Bucket: string;
  ACL?: string;
}
export interface S3ProviderDTO {
  saveInS3(bucketParams: SaveFormatDTO): Promise<string>;
  awsS3Config(): void;
  checkIfBucketExists(bucketName: string): Promise<boolean>;
  createBucket({ Bucket, ACL }: S3FormatCreateBucketDTO): Promise<void>;
}
