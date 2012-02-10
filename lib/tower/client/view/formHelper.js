
$.fn.serializeParams = function(coerce) {
  return $.serializeParams($(this).serialize(), coerce);
};

$.serializeParams = function(params, coerce) {
  var array, coerce_types, cur, i, index, item, key, keys, keys_last, obj, param, val, _len;
  obj = {};
  coerce_types = {
    "true": !0,
    "false": !1,
    "null": null
  };
  array = params.replace(/\+/g, " ").split("&");
  for (index = 0, _len = array.length; index < _len; index++) {
    item = array[index];
    param = item.split("=");
    key = decodeURIComponent(param[0]);
    val = void 0;
    cur = obj;
    i = 0;
    keys = key.split("][");
    keys_last = keys.length - 1;
    if (/\[/.test(keys[0]) && /\]$/.test(keys[keys_last])) {
      keys[keys_last] = keys[keys_last].replace(/\]$/, "");
      keys = keys.shift().split("[").concat(keys);
      keys_last = keys.length - 1;
    } else {
      keys_last = 0;
    }
    if (param.length === 2) {
      val = decodeURIComponent(param[1]);
      if (coerce) {
        val = (val && !isNaN(val) ? +val : (val === "undefined" ? undefined : (coerce_types[val] !== undefined ? coerce_types[val] : val)));
      }
      if (keys_last) {
        while (i <= keys_last) {
          key = (keys[i] === "" ? cur.length : keys[i]);
          cur = cur[key] = (i < keys_last ? cur[key] || (keys[i + 1] && isNaN(keys[i + 1]) ? {} : []) : val);
          i++;
        }
      } else {
        if ($.isArray(obj[key])) {
          obj[key].push(val);
        } else if (obj[key] !== undefined) {
          obj[key] = [obj[key], val];
        } else {
          obj[key] = val;
        }
      }
    } else {
      if (key) obj[key] = (coerce ? undefined : "");
    }
  }
  return obj;
};
