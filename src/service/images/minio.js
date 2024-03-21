export function getMinioPath(s3Path) {
    return `${window.S3_HOST}/${s3Path}`
}