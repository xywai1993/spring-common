export interface FileManagerInterface {
  type: 'index' | 'select';
  fileType: 'all' | 'image' | 'audio' | 'video' | 'other';
  /**
   * 操作（ 'select'=选择文件 (默认) | 'upload'=直接上传 | 'directly'=原生上传 ）
   */
  action?: 'select' | 'upload' | 'directly';
  /**
   * 是否保存到文件管理可供选择 默认1，
   */
  savelog?: string | number;
  multiple?: boolean;
  max?: number;
  leng?: number;
}

export interface FileType {
  id: number;
  admin_id: number;
  group_id: number;
  filename: string;
  url: string;
  width: number;
  height: number;
  /**
   * "jpg"
   */
  extension: string;
  storage: string;
  filesize: number;
  /**
   * "image/jpeg"
   */
  mimetype: string;
  file_md5: string;
  created_at: string;
  updated_at: string;
}

export interface FileGroupType {
  id: number;
  name: string;
  weigh: number;
  created_at: string;
  updated_at: string;
}
