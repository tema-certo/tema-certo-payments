const {
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    AWS_ENDPOINT,
    AWS_BUCKET_ESSAY_HELPERS_DOCS_NAME,
    AWS_BUCKET_THEMES_IMAGES,
} = process.env;

export const s3Config = {
    bucketEssayHelpersDocsName: AWS_BUCKET_ESSAY_HELPERS_DOCS_NAME,
    bucketThemesImages: AWS_BUCKET_THEMES_IMAGES,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
    endpoint: AWS_ENDPOINT,
};
