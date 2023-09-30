import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Post } from './post.model';

@Injectable()
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postsCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&pageIndex=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: transformedPostsData.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string | null) {
    // return { ...this.posts.find((post) => post.id === id) };
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: any;
    }>(`http://localhost:3000/api/posts/${id}`);
  }

  // const id: string = post.id!; // 👈️ non-null assertion

  addPost(id: string, title: string, content: string, image: File) {
    // const post: Post = { id: null, title: title, content: content };
    const postData = new FormData();
    postData.append('id', id);
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: string; post: Post; maxPosts: number }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((responseData) => {
        this.router.navigate(['/']);
      });
    console.log(postData);
  }

  updatePost(
    id: string | null,
    title: string,
    content: string,
    image: File | string
  ) {
    // const post: Post = { id: id, title: title, content: content };
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
      };
    }
    this.http
      .put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe((response) => {
        // console.log(response);

        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string | null | undefined) {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
  }
}
