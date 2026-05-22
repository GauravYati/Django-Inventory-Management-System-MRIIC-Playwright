import path from 'path';

export type RuntimeConfig = {
  repoRoot: string;
  djangoProjectDir: string;
  pythonPath: string;
  baseURL: string;
};

export function getRuntimeConfig(): RuntimeConfig {
  const repoRoot = process.env.MRIIC_REPO_ROOT ?? path.resolve(__dirname, '..', '..', '..', 'Django-Inventory-Management-System-MRIIC-');

  return {
    repoRoot,
    djangoProjectDir: process.env.MRIIC_DJANGO_PROJECT_DIR ?? path.join(repoRoot, 'inventoryProject'),
    pythonPath: process.env.MRIIC_PYTHON ?? path.join(repoRoot, 'p1', 'Scripts', 'python.exe'),
    baseURL: process.env.BASE_URL ?? 'http://127.0.0.1:8000'
  };
}
