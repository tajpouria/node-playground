return function()
  local key = ngx.var.http_user_agent
  if not key then
    ngx.log(ngx.ERR, "no user-agent found")
    return ngx.exit(400)
  end

  local redis = require "resty.redis"
  local red = redis:new()
  red:set_timeout(1000) -- 1 second

  local ok, err = red:connect("127.0.0.1", 6379)
  if not ok then
    ngx.log(ngx.ERR, "failed to connect to redis: ", err)
    return ngx.exit(500)
  end

  local host, err = red.get(key)
  if not host then
    ngx.log(ngx.ERR, "failed to get redis key: ", err)
    return ngx.exit(500)
  end
  
  if host == ngx.null then
    ngx.log(ngx.ERR, "no host found for key: ", key)
  end

  ngx.var.target = host
end
