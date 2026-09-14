// RESPONSIBILITY: TypeScript definitions for backup_types
export type BackupStatus = 'completed' | 'in-progress' | 'failed';

export interface BackupRecord {
  id: string;
  filename: string;
  sizeBytes: number;
  status: BackupStatus;
  createdAt: string;
  type: 'manual' | 'automated';
}
