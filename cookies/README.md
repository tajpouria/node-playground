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

- expires, max-age

If not specified cookies will removed whenever browser is closed (session cookie)

expires _deprecated_ an expiry date for when a cookie gets deleted
max-age sets the time in **seconds** for when a cookie will be deleted (use this, it’s no longer 2009)
Internet Explorer (ie6, ie7, and ie8) does not support “max-age”, while (mostly) all browsers support expires

```js
const d = new Date();
d.setTime(d.getTime() + 5 * 60 * 1000);
document.cookie = `foo=bar; expires=${d.toGMTString()};`;

document.cookie = `foo=bar; max-age=${5 * 60}`;
```

- SameSite

  - Lax _default_ Cookies are allowed to be sent with top-level navigations and will be sent along with GET request initiated by third party website.

  - None Cookies will be sent in all contexts, i.e sending cross-origin is allowed.

  - Strict Cookies will only sent if the request was made from the same context

```js
document.cookie = "foo=bar; SameSite=Strict";
```

### Cookie types

Following is not official arrangement

- Session cookies: Cookies that not have expires or max-age property and will removed whenever browser is closed

- Permanent cookies: Cookies that have expires or max-age and will not removed whenever browser is closed

- HttpOnly cookies

If the HttpOnly flag (optional) is included in the **HTTP response** (server-side) header, the cookie cannot be accessed through client side script (again if the browser supports this flag)

```js
(_, res) => {
  res.setHeader("Set-Cookie", "http=only; HttpOnly;");
};
```

Client can not access this HttpOnly cookies through `document.cookie` but they are sent with each request

- Secure cookies

Only sent to site to `https` domains

```js
(_, res) => {
  res.setHeader(
    ("Set-Cookie": "id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure;")
  );
};
```

- Third party cookies

Third-party cookies are cookies that are set by a website other than the one you are currently on. For example, you can have a "Like" button on your website which will store a cookie on visitor's computer, that cookie can later be accessed by Facebook to identify visitor and see which websites he visited. Such cookie is considered to be a third-party cookie.

Another example would be an advertising service which also creates a third-party cookie to monitor which websites were visited by each user.

- Zombie cookies
