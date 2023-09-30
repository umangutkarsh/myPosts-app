export interface Post {
  id?: string | null | Blob;
  title: string;
  content: string;
  imagePath: string | File;
  creator: any;
}
