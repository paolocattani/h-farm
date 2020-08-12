export function getEnv(): string {
  return process.env.NODE_ENV!;
}
export function isProductionMode() {
  return process.env.NODE_ENV === 'production';
}

export function isDevMode() {
  return process.env.NODE_ENV == undefined || process.env.NODE_ENV == 'development' ? true : false;
}
