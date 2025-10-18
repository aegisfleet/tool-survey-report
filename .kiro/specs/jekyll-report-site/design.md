# Design Document

## Overview

JekyllとGitHub Pagesを使用した調査レポート公開システムの設計。このシステムは、指定されたディレクトリに配置されたMarkdownファイルを自動的にWebサイトとして公開し、GitHub Pagesでホスティングする。

## Architecture

### High-Level Architecture

```
Repository Structure:
├── _config.yml          # Jekyll configuration
├── _layouts/            # Page templates
│   ├── default.html
│   ├── report.html
│   └── home.html
├── _includes/           # Reusable components
│   ├── header.html
│   ├── footer.html
│   └── navigation.html
├── _sass/              # Stylesheet components
├── assets/             # CSS, JS, images
├── reports/            # Report Directory (Markdown files)
├── index.md            # Homepage
└── .github/
    └── workflows/
        └── pages.yml   # GitHub Actions for deployment

GitHub Pages Flow:
[Markdown Reports] → [Jekyll Build] → [Static HTML] → [GitHub Pages]
```

### Component Interaction

1. **Content Layer**: Markdown reports stored in `/reports/` directory
2. **Processing Layer**: Jekyll static site generator
3. **Presentation Layer**: HTML templates and CSS styling
4. **Deployment Layer**: GitHub Actions + GitHub Pages

## Components and Interfaces

### 1. Jekyll Configuration (`_config.yml`)

**Purpose**: Central configuration for site settings, plugins, and build options

**Key Settings**:
- Site metadata (title, description, author)
- Collections configuration for reports
- Plugin configuration (jekyll-feed, jekyll-sitemap)
- GitHub Pages compatibility settings
- Markdown processor settings

### 2. Layout Templates

#### Default Layout (`_layouts/default.html`)
- Base HTML structure
- Meta tags and SEO optimization
- Navigation integration
- Footer inclusion

#### Report Layout (`_layouts/report.html`)
- Extends default layout
- Report-specific formatting
- Metadata display (date, author, tags)
- Navigation between reports

#### Home Layout (`_layouts/home.html`)
- Landing page structure
- Report listing functionality
- Search integration

### 3. Report Collection

**Directory**: `/reports/`
**File Format**: Markdown with YAML front matter

**Front Matter Schema**:
```yaml
---
layout: report
title: "Report Title"
date: YYYY-MM-DD
author: "Author Name"
tags: [tag1, tag2]
description: "Brief description"
---
```

### 4. Navigation System

**Components**:
- Main navigation menu
- Report index/listing
- Tag-based filtering
- Search functionality

### 5. Styling System

**Structure**:
- SCSS-based styling in `_sass/`
- Responsive design principles
- Component-based CSS architecture
- Custom theme variables

## Data Models

### Report Model

```yaml
Report:
  title: string (required)
  date: date (required)
  author: string (optional)
  tags: array of strings (optional)
  description: string (optional)
  content: markdown (required)
  slug: string (auto-generated from filename)
```

### Site Configuration Model

```yaml
SiteConfig:
  title: string
  description: string
  baseurl: string
  url: string
  collections:
    reports:
      output: true
      permalink: "/reports/:name/"
```

## Error Handling

### Build Errors
- Invalid YAML front matter: Jekyll will skip the file and log warning
- Markdown parsing errors: Jekyll will attempt to render with fallback formatting
- Missing required fields: Default values will be used where possible

### Deployment Errors
- GitHub Actions failure: Retry mechanism with email notification
- Pages build failure: Detailed error logs in Actions tab
- Invalid configuration: Build will fail with descriptive error message

### Content Errors
- Missing images: Broken image placeholder with alt text
- Invalid links: Links will render but may be broken (handled by Jekyll)
- Malformed tables: Jekyll will attempt best-effort rendering

## Testing Strategy

### Local Development Testing
1. **Jekyll Serve**: Local development server for real-time preview
2. **Build Validation**: Ensure site builds without errors
3. **Link Checking**: Validate internal and external links
4. **Responsive Testing**: Test across different screen sizes

### Automated Testing
1. **GitHub Actions CI**: Automated build testing on push
2. **HTML Validation**: Check generated HTML for compliance
3. **Performance Testing**: Lighthouse CI for performance metrics

### Content Testing
1. **Sample Reports**: Create test reports with various formats
2. **Metadata Validation**: Ensure front matter is processed correctly
3. **Navigation Testing**: Verify all reports are accessible

## Deployment Strategy

### GitHub Pages Setup
1. **Repository Settings**: Enable GitHub Pages with source branch
2. **Custom Domain**: Optional custom domain configuration
3. **HTTPS**: Enforce HTTPS for security

### GitHub Actions Workflow
```yaml
name: Build and Deploy
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-ruby@v1
      - name: Build Jekyll site
        run: |
          bundle install
          bundle exec jekyll build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

## Security Considerations

### Content Security
- Sanitize user-generated content in Markdown
- Validate file uploads and naming conventions
- Implement proper access controls for repository

### Deployment Security
- Use GitHub's built-in security features
- Secure secrets management in GitHub Actions
- Regular dependency updates for Jekyll and plugins

## Performance Optimization

### Build Performance
- Incremental builds where possible
- Optimize image assets
- Minimize plugin usage
- Efficient Liquid templating

### Runtime Performance
- Static site advantages (fast loading)
- CDN delivery through GitHub Pages
- Optimized CSS and JavaScript
- Responsive image handling

## Maintenance and Monitoring

### Regular Maintenance
- Jekyll and dependency updates
- Theme and plugin updates
- Content review and cleanup
- Performance monitoring

### Monitoring
- GitHub Pages status monitoring
- Build success/failure notifications
- Analytics integration (Google Analytics)
- Error tracking and logging