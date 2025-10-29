import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocumentationComponent } from '../../../common/layout/documentation/documentation.component';
import { DocumentationSectionComponent } from '../../../common/layout/documentation-section/documentation-section.component';
import { CodeBlockComponent } from '../../../common/components/code-block/code-block.component';

@Component({
  selector: 'use-parameters-page',
  imports: [
    DocumentationComponent,
    DocumentationSectionComponent,
    CodeBlockComponent,
  ],
  template: `
    <documentation>
      <ng-container documentation-title>useRouteParameter</ng-container>

      <ng-container documentation-description>
        A convenience function that returns a single route parameter as a
        signal. This is useful when you only need to access one specific
        parameter from the route.
      </ng-container>

      <documentation-section>
        <ng-container section-title>Usage</ng-container>

        <code-block [code]="code_usage_0" />

        <code-block [code]="code_usage_1" />

        <code-block [code]="code_usage_2" />
      </documentation-section>

      <documentation-section>
        <ng-container section-title>Source Code</ng-container>
        <code-block title="useRouteParameter Source" [code]="sourceCode" />
      </documentation-section>
    </documentation>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseParametersPageComponent {
  code_usage_0 = `import { Component, computed, inject } from '@angular/core';
import { useRouteParameter } from 'angular-reactive-primitives';

// Route: /products/:productId
@Component({
  selector: 'product-detail',
  template: \`
    <div class="product">
      @if (product(); as prod) {
        <h1>{{ prod.name }}</h1>
        <p>{{ prod.description }}</p>
        <p class="price">\${{ prod.price }}</p>
      } @else {
        <p>Loading...</p>
      }
    </div>
  \`,
})
export class ProductDetailComponent {
  productId = useRouteParameter<string>('productId');
  productService = inject(ProductService);

  product = resource({
    request: () => ({ id: this.productId() }),
    loader: ({ request }) => this.productService.getProduct(request.id),
  });
}`;

  code_usage_1 = `import { Component, inject } from '@angular/core';
import { useRouteParameter } from 'angular-reactive-primitives';

// Route: /users/:username
@Component({
  selector: 'user-profile',
  template: \`
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
  \`,
})
export class UserProfileComponent {
  username = useRouteParameter<string>('username');
  userService = inject(UserService);

  userResource = resource({
    request: () => ({ username: this.username() }),
    loader: ({ request }) =>
      this.userService.getUserByUsername(request.username),
  });
}`;

  code_usage_2 = `import { Component, computed, inject } from '@angular/core';
import { useRouteParameter } from 'angular-reactive-primitives';

// Route: /blog/:slug
@Component({
  selector: 'blog-post',
  template: \`
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
  \`,
})
export class BlogPostComponent {
  slug = useRouteParameter<string>('slug');
  blogService = inject(BlogService);

  post = resource({
    request: () => ({ slug: this.slug() }),
    loader: ({ request }) => this.blogService.getPostBySlug(request.slug),
  });
}`;

  sourceCode = `import { computed } from '@angular/core';
import { useRouteParams } from '../use-route-params/use-route-params.composable';

export const useRouteParameter = <T extends string | null | undefined>(
  paramName: string,
) => {
  const parameters = useRouteParams();

  return computed(() => parameters()[paramName] as T);
};
`;
}
