# 📮MailBox - collect mail with Cloudflare + Huno + D1 database

[Cloudflare D1 Doc](https://developers.cloudflare.com/d1/get-started/)

## Setup

### Log in

```bash
npx wrangler login
```

```
npx wrangler d1 create <DATABASE_NAME>

---------
✅ Successfully created DB '<DATABASE_NAME>'

[[d1_databases]]
binding = "DB" # available in your Worker on env.DB
database_name = "<DATABASE_NAME>"
database_id = "<unique-ID-for-your-database>"

```

### Bind Worker to D1 database

in **wrangler.toml**

```
[[d1_databases]]
binding = "DB" # available in your Worker on env.DB
database_name = "<DATABASE_NAME>"
database_id = "<unique-ID-for-your-database>"
```

### init database

```
npm run initSql
```


### Deploy

```
$ npm run deploy

> analytics_with_cloudflare@0.0.0 deploy
> wrangler deploy

Proxy environment variables detected. We'll use your proxy for fetch requests.
 ⛅️ wrangler 3.22.5
-------------------
Your worker has access to the following bindings:
- D1 Databases:
  - DB: mail_collect_db (<unique-ID-for-your-database>)
Total Upload: 25.64 KiB / gzip: 9.46 KiB
Uploaded mail-collect (1.04 sec)
Published mail-collect (0.45 sec)
  https://mail-collect.xxxxx.workers.dev
Current Deployment ID: xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Use

check `use-demo.html`


## query data:


```
npx wrangler d1 execute mail_collect_db  --command="SELECT * FROM t_address" --local

npx wrangler d1 execute mail_collect_db  --command="SELECT * FROM t_mail" --local
```