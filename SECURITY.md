Итог по безопасности K·ART·MAKE

Закрыто:
- HTTPS и редиректы;
- основные security headers;
- REST user enumeration;
- XML-RPC методы;
- DISALLOW_FILE_EDIT;
- защита от brute-force через Limit Login Attempts Reloaded;
- проверка пользователей WordPress;
- PHP-файлы в uploads отсутствуют;
- права wp-content — 700;
- WordPress / плагины / тема актуальны;
- checksum-проверка плагинов — 4/4 успешно;
- wp-config.php исправлен с 666 → 600;
- .env, .user.ini, .git и служебные файлы наружу не раскрываются;
- directory listing отсутствует;
- исходники PHP наружу не отдаются;
- резервное копирование выполняется средствами хостинга.
