export function getMinioPath(s3Path) {
    return `${import.meta.env.VITE_S3_HOST}/${s3Path}`
}