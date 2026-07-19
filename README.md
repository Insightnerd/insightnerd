# InsightNerd

A technology publication covering AI, coding, data analytics, and software tools.

## Tech Stack

- **Jekyll** (static site generator, native GitHub Pages support)
- Hosted on **GitHub Pages** with custom domain **insightnerd.in**

## Local Development

1. Install [Ruby](https://rubyinstaller.org/) + [Jekyll](https://jekyllrb.com/docs/installation/windows/)
2. Run:
   ```
   bundle install
   bundle exec jekyll serve
   ```
3. Open `http://localhost:4000`

## Adding a New Article

1. Create a new file in `_posts/` with the format `YYYY-MM-DD-title-slug.html`
2. Add front matter:
   ```yaml
   ---
   layout: post
   title: "Your Article Title"
   date: YYYY-MM-DD
   categories: [category1, category2]
   author: "Author Name"
   reading_time: "X min read"
   excerpt: "Brief description for SEO and previews"
   ---
   ```
3. Write the article content (HTML supported)
4. Push to GitHub — the site builds automatically

## Structure

```
├── _config.yml          # Site configuration
├── _layouts/            # Page templates
├── _includes/           # Reusable components
├── _posts/              # Article content
├── assets/              # CSS, JS, images
├── pages/               # Static pages (about, contact)
├── categories/          # Category archive pages
├── index.html           # Homepage
├── 404.html             # Custom error page
├── CNAME                # Custom domain
└── robots.txt           # SEO
```
