# راه‌اندازی HSE Leitner روی GitHub Pages

## نکته بسیار مهم
خود فایل ZIP را داخل GitHub قرار نده. ابتدا ZIP را Extract کن و سپس **محتویات داخل آن** را آپلود کن.

ساختار ریشه مخزن باید دقیقاً مانند زیر باشد:

```text
index.html
vocabulary.json
vocabulary.csv
manifest.webmanifest
sw.js
icon-192.svg
icon-512.svg
.nojekyll
ai-worker/
```

یعنی `index.html` نباید داخل پوشه‌ای مانند `HSE_Leitner_GitHub_Pages_Ready/` قرار گرفته باشد.

## فعال‌کردن GitHub Pages

1. یک Repository بساز و فایل‌های بالا را مستقیماً در شاخه `main` آپلود کن.
2. وارد `Settings` مخزن شو.
3. از منوی سمت چپ `Pages` را انتخاب کن.
4. در بخش `Build and deployment`، گزینه `Deploy from a branch` را انتخاب کن.
5. Branch را روی `main` و Folder را روی `/(root)` قرار بده.
6. گزینه `Save` را بزن.
7. آدرس منتشرشده در همان صفحه Pages نمایش داده می‌شود.

برای Repository معمولی، آدرس معمولاً این شکل را دارد:

```text
https://USERNAME.github.io/REPOSITORY-NAME/
```

## اگر صفحه قدیمی یا سفید دیده شد

- صفحه را یک‌بار در حالت Private/Incognito باز کن.
- اطلاعات سایت یا Service Worker نسخه قبلی را پاک کن.
- بررسی کن فایل `vocabulary.json` با همان حروف کوچک در ریشه مخزن موجود باشد.
- در تب `Actions` یا بخش `Pages` خطای انتشار را بررسی کن.
