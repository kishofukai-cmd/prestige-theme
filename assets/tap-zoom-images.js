// 商品ページの説明の画像（ギャラリーの外）も、押したら商品画像と同じ拡大画面で開く（2026-10-20 KAPOK）
// 対象外: リンク・ボタンの中の画像、押すと別の動きをする画像（cursor: pointer）、幅150px未満の画像、Judge.me のレビュー写真
// 個別に外したい画像は、その画像か親の要素に data-no-zoom を付ける
import { PhotoSwipeLightbox } from "vendor";

const SKIP = 'product-gallery, a, button, label, summary, select, [role="button"], [role="tab"], [onclick], [data-no-zoom], product-card, .product-card, [class*="jdgm"], video, model-viewer, iframe';
const MIN_WIDTH = 150;

let lightbox;

const isZoomable = (img) => {
  if (!img || img.tagName !== "IMG" || !img.closest("main") || img.closest(SKIP)) {
    return false;
  }

  if (img.clientWidth < MIN_WIDTH || (img.naturalWidth && img.naturalWidth < MIN_WIDTH)) {
    return false;
  }

  return img.dataset.tapZoom !== undefined || getComputedStyle(img).cursor !== "pointer";
};

// srcset の中でいちばん大きい画像を使う（無ければ表示中の画像）
const bestSource = (img) => {
  let src = img.currentSrc || img.src, width = img.naturalWidth || img.clientWidth;

  (img.getAttribute("srcset") || "").split(",").forEach((candidate) => {
    const [url, descriptor] = candidate.trim().split(/\s+/);

    if (url && descriptor?.endsWith("w") && parseInt(descriptor) > width) {
      src = url;
      width = parseInt(descriptor);
    }
  });

  const ratio = img.naturalWidth && img.naturalHeight ? img.naturalHeight / img.naturalWidth : img.clientHeight / img.clientWidth;
  return { src, width, height: Math.round(width * ratio) };
};

const getLightbox = () => {
  if (lightbox) {
    return lightbox;
  }

  // 見た目と操作はテーマの商品画像の拡大（theme.js の product-gallery）に合わせる
  lightbox = new PhotoSwipeLightbox({
    pswpModule: () => import("photoswipe"),
    bgOpacity: 1,
    maxZoomLevel: 3,
    closeTitle: window.themeVariables?.strings?.closeGallery,
    zoomTitle: window.themeVariables?.strings?.zoomGallery,
    errorMsg: window.themeVariables?.strings?.errorGallery,
    arrowPrev: false,
    arrowNext: false,
    counter: false,
    close: false,
    zoom: false
  });

  lightbox.on("uiRegister", () => {
    lightbox.pswp.ui.registerElement({
      name: "close-button",
      className: "circle-button circle-button--xl hover:animate-icon-block",
      ariaLabel: window.themeVariables?.strings?.closeGallery,
      order: 2,
      isButton: true,
      html: `
        <svg aria-hidden="true" focusable="false" fill="none" width="16" class="icon" viewBox="0 0 16 16">
          <path d="m1 1 14 14M1 15 15 1" stroke="currentColor" stroke-width="1"/>
        </svg>
      `,
      onClick: () => lightbox.pswp.close()
    });
  });

  lightbox.addFilter("thumbEl", (thumbEl, data) => data.thumbnailElement);
  lightbox.init();
  return lightbox;
};

document.addEventListener("click", (event) => {
  const img = event.target;

  if (event.defaultPrevented || !isZoomable(img)) {
    return;
  }

  getLightbox().loadAndOpen(0, [{
    ...bestSource(img),
    msrc: img.currentSrc || img.src,
    alt: img.alt,
    thumbnailElement: img,
    thumbCropped: true
  }]);
});

// パソコンでは、拡大できる画像の上で虫めがねのカーソルにする
document.addEventListener("mouseover", (event) => {
  const img = event.target;

  if (img.tagName === "IMG" && img.dataset.tapZoom === undefined && isZoomable(img)) {
    img.dataset.tapZoom = "";
    img.style.cursor = "zoom-in";
  }
});
