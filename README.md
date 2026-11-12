# Chhaly CHHOEURNG Portfolio

A responsive, single-page portfolio for a graphic designer and video editor. It runs by opening `index.html` directly in a modern browser.

## Customize before publishing

- The Hero portrait uses `assets/images/chhaly-profile.png`; the About portrait uses `assets/images/chhaly-about.png`. Replace either image whenever needed.
- Replace each artwork in `assets/images/projects/` with portfolio images.
- Add verified experience, project totals, skill percentages, and education details in `index.html`.
- Update email, telephone, Telegram, Facebook, Instagram, and LinkedIn links.
- Replace `assets/documents/cv.pdf` with the real CV. The included file is a small, replaceable PDF placeholder.
- For videos, add a local MP4 or YouTube embed to the modal logic noted in `js/script.js`.

## Structure

```text
index.html
css/style.css
js/script.js
assets/images/          # portraits and project placeholder artwork
assets/documents/cv.pdf # replace with final CV
```

The design uses CSS variables in `css/style.css`, responsive CSS Grid/Flexbox layouts, Intersection Observer animations, and accessible dialog modals. Lucide icons and Google Fonts load from their public CDNs.

## MySQL / phpMyAdmin setup

The contact form now saves messages in MySQL via `api/contact.php`.

1. In phpMyAdmin, choose **Import** and import `database.sql`. This creates the `chhaly_portfolio` database and its `contact_messages` table.
2. Copy `api/config.php.example` to `api/config.php`, then update its database credentials if your MySQL account differs from the local XAMPP defaults.
3. Put this project under your PHP server's web directory (for XAMPP, normally `htdocs`) and open it through Apache, for example `http://localhost/Test%20Website/`. Do not open `index.html` directly from the filesystem.

You can see saved enquiries in phpMyAdmin: **chhaly_portfolio** → **contact_messages**.
