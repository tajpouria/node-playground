## Setting cookies

1. Document.cookie

The Document property cookie lets you read and write cookies associated with the document. It serves as a getter and setter for the actual values of the cookies.

[ ./index.html ](./index.html)

```js
const allCookies = document.cookie;
document.cookie = newCookie;
```

2. set-cookie header

The can server **tells the client to store a cookie** by setting `set-cookie` header

```sh
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: cookie_name1=cookie_value1
Set-Cookie: cookie_name2=cookie_value2; expires=Sun, 16 Jul 3567 06:23:41 GMT
```

[./server.ts](./server.ts)

```ts
(_, res) => {
  res.setHeader("set-cookie", ["cookie_name1=cookie_value"]);
};
```

## Cookie properties

- Sent with every request as `Cookie` request header

```sh
GET / HTTP/1.1

Request headers

User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36

Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9


Cookie: hello=world; foo=bar; very=easy; server; from=server; another_one=from_server
```

- Scope

  - domain

  ```js
  // Only send to with requests to example.com
  document.cookie = "1=example.com; domain=example.com";

  // Only send to with requests to www.example.com
  document.cookie = "2=www.example.com; domain=www.example.com";

  // Send to with requests to both www.example.com, example.com
  document.cookie = "3=both; domain=.example.com";
  ```

  - path

```js
// Only send to with requests to domain/path-1
document.cookie = "path=1; path=/path-1";
```
