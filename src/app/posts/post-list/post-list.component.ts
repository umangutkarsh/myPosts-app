import { Component, Input } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent {
  // posts = [
  //   { title: 'Post 1', content: 'This is for testing' },
  //   { title: 'Post 2', content: 'This for testing 2' },
  //   { title: 'Post 3', content: 'This for testing 3' },
  // ];

  @Input() posts: Post[] = [];
}
