# useRouteParameter

A convenience function that returns a single route parameter as a signal. This is useful when you only need to access one specific parameter from the route.

## Usage

### Single Parameter Access

```ts
import { Component, computed, inject } from '@angular/core';
import { useRouteParameter } from 'angular-reactive-primitives';

// Route: /products/:productId
@Component({
  selector: 'product-detail',
  template: `
    <div class="product">
      @if (product(); as prod) {
        <h1>{{ prod.name }}</h1>
        <p>{{ prod.description }}</p>
        <p class="price">${{ prod.price }}</p>
      } @else {
        <p>Loading...</p>
      }
    </div>
  `,
})
export class ProductDetailComponent {
  productId = useRouteParameter<string>('productId');
  productService = inject(ProductService);

  product = resource({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => this.productService.getProduct(request.id),
  });
}
```

### User Profile Page

```ts
import { Component, inject } from '@angular/core';
import { useRouteParameter } from 'angular-reactive-primitives';

// Route: /users/:username
@Component({
  selector: 'user-profile',
  template: `
    <div class="profile">
      <h1>@{{ username() }}</h1>
      @if (userResource.value(); as user) {
        <img [src]="user.avatar" [alt]="user.name" />
        <p>{{ user.bio }}</p>
        <div class="stats">
          <span>{{ user.followers }} followers</span>
          <span>{{ user.following }} following</span>
        </div>
      }
    </div>
  `,
})
export class UserProfileComponent {
  username = useRouteParameter<string>('username');
  userService = inject(UserService);

  userResource = resource({
    request: () => ({ username: this.username() }),
    loader: ({ request }) =>
      this.userService.getUserByUsername(request.username),
  });
}
```

### Blog Post with Slug

```ts
import { Component, computed, inject } from '@angular/core';
import { useRouteParameter } from 'angular-reactive-primitives';

// Route: /blog/:slug
@Component({
  selector: 'blog-post',
  template: `
    <article>
      @if (post(); as article) {
        <header>
          <h1>{{ article.title }}</h1>
          <time>{{ article.publishedAt | date }}</time>
        </header>
        <div [innerHTML]="article.content"></div>
        <footer>
          <a [routerLink]="['/blog']">← Back to blog</a>
        </footer>
      }
    </article>
  `,
})
export class BlogPostComponent {
  slug = useRouteParameter<string>('slug');
  blogService = inject(BlogService);

  post = resource({
    request: () => ({ slug: this.slug() }),
    loader: ({ request }) => this.blogService.getPostBySlug(request.slug),
  });
}
```
