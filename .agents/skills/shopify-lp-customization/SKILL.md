---
name: Shopify LP Customization Best Practices
description: Best practices and gotchas for creating custom Landing Pages (LPs) in Shopify, specifically around layouts, standard sections like footers, CSS variables, and styling overrides.
---
# Shopify LP Customization & Troubleshooting Guide

This skill documents crucial learnings from building custom Landing Pages (LPs) within a Shopify theme (specifically the Prestige theme or similar 2.0 themes).

## 1. Custom LP Layouts and Global Sections (Footer/Header)
When creating a dedicated layout for an LP (e.g., `layout/theme.musubi-lp.liquid`) to hide the default header/footer, you may later decide to add standard sections back (like `{% sections 'footer-group' %}`). 
**Warning:** Simply adding the section tag is often not enough and will lead to an unstyled section.

## 2. The Danger of Missing `css-variables`
If you include a global theme section in a custom LP layout, that section will intimately rely on the global theme's CSS and CSS variables.
- **Symptom:** The footer or section loses its background color, spacing, or typography (e.g., appearing as plain black text on a white background instead of the theme's dark scheme).
- **Solution:** Always ensure your custom layout's `<head>` includes the theme's CSS and variables if it renders global sections:
  ```liquid
  {%- render 'css-variables' -%}
  {%- render 'js-variables' -%}
  <script type="module" src="{{ 'vendor.min.js' | asset_url }}"></script>
  <script type="module" src="{{ 'theme.js' | asset_url }}"></script>
  {{- 'theme.css' | asset_url | stylesheet_tag: preload: true -}}
  ```

## 3. Forcing Specific Colors on Global Sections for a Single LP
Sometimes the global footer (e.g., dark brown) conflicts with the LP's design, and you want to force it to a different color (e.g., white) *only on that LP*.
- **Solution:** Do not edit the global `footer-group.json` or `settings_data.json` as it affects the entire store.
- Instead, add `!important` CSS overrides in the LP's specific stylesheet (e.g., `snippets/musubi-lp-styles.liquid`) to override the specific section:
  ```css
  /* Override global footer colors just for this LP */
  #shopify-section-footer-group .footer,
  .shopify-section-group-footer-group .footer,
  .footer {
    background-color: #ffffff !important;
    color: #1a1a1a !important;
  }
  .footer *,
  .footer svg {
    color: #1a1a1a !important;
    fill: currentColor !important;
    border-color: #e0e0e0 !important;
  }
  ```

## 4. CSS Image Centering Gotcha
When fixing image alignment issues across different media queries, it's easy to accidentally reset `margin: 0 auto;`.
- **Symptom:** An image perfectly centered on mobile gets aligned to the left side on desktop.
- **Cause:** Using `margin-left: 0; margin-right: 0;` inside a `@media (min-width: 768px)` query. This overrides the mobile `margin: 0 auto;`.
- **Solution:** Always explicitly use `margin-left: auto; margin-right: auto;` in the media query to safely preserve horizontal centering while resetting other margins.
