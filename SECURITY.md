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

## 2FA:
```
Каждую аварийную ссылку можно использовать лишь раз.  
При переходе по аварийной ссылке двухфакторная аутентификация будет полностью отключена. kartemake.ru на 1 час.
```

### Аварийные ссылки:
```
https://kartemake.ru?llar_rescue=usLw94DWNE94H13lrdUO1fUycIfBBEul
https://kartemake.ru?llar_rescue=AFb89U52dTRoar33qvypfPEHdTC5Bli7
https://kartemake.ru?llar_rescue=iNH2aA68htTfVuWs8m3SH9z1tdfPCiYX
https://kartemake.ru?llar_rescue=NDXmvx0AQAQG21z2MABEdi3XM15zTVpc
https://kartemake.ru?llar_rescue=UXFrHQLg2pkI4qUmDV6N06rVydADqunA
https://kartemake.ru?llar_rescue=fFz8wRxAc7EM2P0kH3GCUmKTDvf5akP6
https://kartemake.ru?llar_rescue=hy37Ea8zAmeaAogdmM5wMlSbqNGYbHdk
https://kartemake.ru?llar_rescue=KGT7epibm8kcbsDaF34nPTFWvydRMLd4
https://kartemake.ru?llar_rescue=RMNkkOkU8VaobbaAcSQ9zMTDMSH9OgFM
https://kartemake.ru?llar_rescue=O9H3Fc0ByZOtFfFUkYBjOXoJ6E8uWwQv
```