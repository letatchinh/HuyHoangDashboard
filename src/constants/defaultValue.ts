export const BASE_URL = process.env.REACT_APP_BASE_URL;

export const DEFAULT_UPLOAD_ACTION = `${BASE_URL}/api/v1/file`;
export const MAX_UPLOAD_FILE_SIZE_IN_MB = 2;

export const MAX_LIMIT = 200;

export const STATUS = {
    ACTIVE : "ACTIVE",
    INACTIVE : "INACTIVE",
}
