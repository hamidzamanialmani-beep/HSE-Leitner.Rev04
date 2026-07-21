راه‌اندازی AI Endpoint امن با Cloudflare Worker

دلیل استفاده از Worker
کلید OpenAI نباید داخل index.html، JavaScript مرورگر یا localStorage قرار بگیرد. Worker درخواست برنامه را دریافت می‌کند و کلید فقط به صورت Secret روی Cloudflare نگهداری می‌شود.

مراحل
1) Node.js و Wrangler را نصب کنید:
   npm install -g wrangler
2) وارد پوشه ai-worker شوید.
3) به Cloudflare وارد شوید:
   wrangler login
4) کلید OpenAI را به صورت Secret ثبت کنید:
   wrangler secret put OPENAI_API_KEY
5) Worker را منتشر کنید:
   wrangler deploy
6) آدرس خروجی را در بخش «افزودن واژه» برنامه وارد کنید و در انتهای آن /generate-card قرار دهید.
   نمونه:
   https://hse-leitner-ai.YOUR-SUBDOMAIN.workers.dev/generate-card

مدل
مدل پیش‌فرض در wrangler.toml برابر gpt-5-mini است. در صورت نیاز می‌توانید مقدار OPENAI_MODEL را تغییر دهید.

نکات
- استفاده از OpenAI API هزینه جداگانه دارد و اشتراک ChatGPT Plus به معنی اعتبار API نیست.
- نتیجه KI باید قبل از ذخیره از نظر اصطلاح فنی و منبع بررسی شود.
- برای استفاده سازمانی، Access-Control-Allow-Origin را از * به دامنه مشخص برنامه محدود کنید.
