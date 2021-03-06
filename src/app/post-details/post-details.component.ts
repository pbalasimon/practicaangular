import { PostService } from './../post.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { NativeWindow } from './../window';
import { Post } from './../post';
import { User } from './../user';
import { Category } from './../category';
import { Router } from '@angular/router';

@Component({
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  post: Post;
  @Output() whenUserSelected: EventEmitter<User> = new EventEmitter<User>();
  private readonly DEFAULT_ID_USER: number = 0;

  constructor(
    private _activatedRoute: ActivatedRoute,
    @Inject(NativeWindow) private _window, private _router: Router, private _postService: PostService) { }

  ngOnInit(): void {
    this._activatedRoute.data.subscribe((data: { post: Post }) => this.post = data.post);
    this._window.scrollTo(0, 0);
  }

  plainTextToHtml(text: string): string {
    return text ? `<p>${text.replace(/\n/gi, "</p><p>")}</p>` : '';
  }

  /*---------------------------------------------------------------------------------------------------------------|
   | ~~~ Red Path ~~~                                                                                              |
   |---------------------------------------------------------------------------------------------------------------|
   | Añade un manejador que navegue a la dirección correspondiente a los posts del autor indicado. Recuerda que    |
   | para hacer esto necesitas inyectar como dependencia el Router de la app. La ruta a navegar es '/posts/users', |
   | pasando como parámetro el identificador del autor.                                                            |
   |---------------------------------------------------------------------------------------------------------------*/

  notifyUserSelected(user: User): void {
    this.whenUserSelected.emit(user);
  }

  /*--------------------------------------------------------------------------------------------------------------------|
   | ~~~ Yellow Path ~~~                                                                                                |
   |--------------------------------------------------------------------------------------------------------------------|
   | Añade un manejador que navegue a la dirección correspondiente a los posts de la categoría indicada. Recuerda que   |
   | para hacer esto necesitas inyectar como dependencia el Router de la app. La ruta a navegar es '/posts/categories', |
   | pasando como parámetro el identificador de la categoría.                                                           |
   |--------------------------------------------------------------------------------------------------------------------*/
  goCategoryPosts(category: Category) {
    this._router.navigate(["/posts/categories", category.id]);
  }

  editStory(post: Post) {
    this._router.navigate([`/edit-story/${post.id}`]);
  }

  saveLike(post: Post) {

    if (post.likes.indexOf(this.DEFAULT_ID_USER) == -1) {
      this.post.likes.push(this.DEFAULT_ID_USER);
    } else {
      var index = this.post.likes.indexOf(this.DEFAULT_ID_USER);
      if (index > -1) {
        this.post.likes = this.post.likes.filter((id: number) => {
          return id !== this.DEFAULT_ID_USER;
        });
      }
    }

    this._postService
      .update(post)
      .subscribe((post: Post) => this.post = post);
  }

}
