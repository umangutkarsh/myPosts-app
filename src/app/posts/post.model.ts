export interface Post {
  id?: string | null;
  title?: string;
  content?: string;
  imagePath?: string | File;
  creator: any;
}
