var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-mVzmim/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// src/utils.ts
var allowedMethod = ["GET", "HEAD", "POST"];
async function parseRequest(request) {
  const url = new URL(request.url);
  if (request.method === "POST") {
    const contentType = request.headers.get("content-type");
    let data = {};
    try {
      if (contentType.includes("application/json")) {
        data = await request.json();
      } else if (contentType.includes("application/x-www-form-urlencoded")) {
        const formData = await request.formData();
        for (const [key, value] of formData.entries()) {
          data[key] = value;
        }
      } else {
        return url.href;
      }
      for (const key in data) {
        url.searchParams.set(key, data[key]);
      }
      return url.href;
    } catch (error) {
      return url.href;
    }
  }
  return url.href;
}
__name(parseRequest, "parseRequest");
function getParams(inputUrl) {
  const url = new URL(inputUrl);
  const urlParams = url.searchParams;
  const params = {
    path: url.pathname
  };
  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }
  return params;
}
__name(getParams, "getParams");
async function hitCoda(body) {
  const response = await fetch("https://order-sg.codashop.com/initPayment.action", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });
  return await response.json();
}
__name(hitCoda, "hitCoda");

// src/router/aov.ts
async function aov(id) {
  const body = `user.userId=${id}&voucherPricePoint.id=7946&voucherPricePoint.price=10000&shopLang=id_ID&voucherTypeName=AOV`;
  const data = await hitCoda(body);
  return {
    success: true,
    game: "Garena: AOV (Arena Of Valor)",
    id,
    name: data.confirmationFields.roles[0].role,
    server: data.confirmationFields.roles[0].server
  };
}
__name(aov, "aov");

// src/router/codm.ts
async function codm(id) {
  const body = `user.userId=${id}&voucherPricePoint.id=46129&voucherPricePoint.price=10000&shopLang=id_ID&voucherTypeName=CALL_OF_DUTY`;
  const data = await hitCoda(body);
  return {
    success: true,
    game: "Call Of Duty Mobile",
    id,
    name: data.confirmationFields.roles[0].role,
    server: data.confirmationFields.roles[0].server
  };
}
__name(codm, "codm");

// src/router/ff.ts
async function ff(id) {
  const request = await fetch(`https://gopay.co.id/games/v1/order/prepare/FREEFIRE?userId=${id}`);
  const data = await request.json();
  return {
    success: true,
    game: "Garena Free Fire",
    id,
    name: data.data
  };
}
__name(ff, "ff");

// src/router/gi.ts
async function gi(id) {
  let sn;
  let sv;
  const idStr = id.toString();
  if (idStr.startsWith("18") || idStr[0] === "8") {
    sn = "Asia";
    sv = "os_asia";
  } else {
    switch (idStr[0]) {
      case "6":
        sn = "America";
        sv = "os_usa";
        break;
      case "7":
        sn = "Europe";
        sv = "os_euro";
        break;
      case "9":
        sn = "SAR (Taiwan, Hong Kong, Macao)";
        sv = "os_cht";
        break;
      default:
        return {
          success: false,
          message: "Not found"
        };
    }
  }
  const body = `voucherPricePoint.id=116054&voucherPricePoint.price=16500&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=${sv}&voucherTypeName=GENSHIN_IMPACT&shopLang=id_ID`;
  const data = await hitCoda(body);
  if (data.confirmationFields.username) {
    return {
      success: true,
      game: "Genshin Impact",
      id,
      server: sn,
      name: data.confirmationFields.username
    };
  } else {
    return {
      success: false,
      message: "Not found"
    };
  }
}
__name(gi, "gi");

// src/router/hi.ts
async function hi(id) {
  const body = `voucherPricePoint.id=48250&voucherPricePoint.price=16500&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=&voucherTypeName=HONKAI_IMPACT&shopLang=id_ID`;
  const data = await hitCoda(body);
  if (data.confirmationFields.username) {
    return {
      success: true,
      game: "Honkai Impact 3rd",
      id,
      name: data.confirmationFields.username
    };
  } else {
    return {
      success: false,
      message: "Not found"
    };
  }
}
__name(hi, "hi");

// src/router/hsr.ts
async function hsr(id) {
  let sn;
  let sv;
  const idStr = id.toString();
  switch (idStr[0]) {
    case "6":
      sn = "America";
      sv = "prod_official_usa";
      break;
    case "7":
      sn = "Europe";
      sv = "prod_official_eur";
      break;
    case "8":
      sn = "Asia";
      sv = "prod_official_asia";
      break;
    case "9":
      sn = "SAR (Taiwan, Hong Kong, Macao)";
      sv = "prod_official_cht";
      break;
    default:
      return {
        success: false,
        message: "Not found"
      };
  }
  const body = `voucherPricePoint.id=855316&voucherPricePoint.price=16000&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=${sv}&voucherTypeName=HONKAI_STAR_RAIL&shopLang=id_ID`;
  const data = await hitCoda(body);
  if (data.confirmationFields.username) {
    return {
      success: true,
      game: "Honkai: Star Rail",
      id,
      server: sn,
      name: data.confirmationFields.username
    };
  } else {
    return {
      success: false,
      message: "Not found"
    };
  }
}
__name(hsr, "hsr");

// src/router/la.ts
async function la(id, zone) {
  const zoneLC = zone.toLowerCase();
  let sn;
  let sv;
  switch (true) {
    case zoneLC.includes("miskatown"):
      sn = "MiskaTown";
      sv = 500001;
      break;
    case zoneLC.includes("sandcastle"):
      sn = "SandCastle";
      sv = 500002;
      break;
    case zoneLC.includes("mouthswamp"):
      sn = "MouthSwamp";
      sv = 500003;
      break;
    case zoneLC.includes("redwoodtown"):
      sn = "RedwoodTown";
      sv = 500004;
      break;
    case zoneLC.includes("obelisk"):
      sn = "Obelisk";
      sv = 500005;
      break;
    case zoneLC.includes("newland"):
      sn = "NewLand";
      sv = 500006;
      break;
    case zoneLC.includes("chaosoutpost"):
      sn = "ChaosOutpost";
      sv = 500007;
      break;
    case zoneLC.includes("ironstride"):
      sn = "IronStride";
      sv = 500008;
      break;
    case zoneLC.includes("crystalthornsea"):
      sn = "CrystalthornSea";
      sv = 500009;
      break;
    case zoneLC.includes("fallforest"):
      sn = "FallForest";
      sv = 510001;
      break;
    case zoneLC.includes("mountsnow"):
      sn = "MountSnow";
      sv = 510002;
      break;
    case zoneLC.includes("nancycity"):
      sn = "NancyCity";
      sv = 520001;
      break;
    case zoneLC.includes("charlestown"):
      sn = "CharlesTown";
      sv = 520002;
      break;
    case zoneLC.includes("snowhighlands"):
      sn = "SnowHighlands";
      sv = 520003;
      break;
    case zoneLC.includes("santopany"):
      sn = "Santopany";
      sv = 520004;
      break;
    case zoneLC.includes("levincity"):
      sn = "LevinCity";
      sv = 520005;
      break;
    case zoneLC.includes("milestone"):
      sn = "MileStone";
      sv = 520006;
      break;
    case zoneLC.includes("chaoscity"):
      sn = "ChaosCity";
      sv = 520007;
      break;
    case zoneLC.includes("twinislands"):
      sn = "TwinIslands";
      sv = 520008;
      break;
    case zoneLC.includes("hopewall"):
      sn = "HopeWall";
      sv = 520009;
      break;
    case zoneLC.includes("labyrinthsea"):
      sn = "LabyrinthSea";
      sv = 520010;
      break;
    default:
      return {
        success: false,
        message: "Not found"
      };
  }
  const body = `voucherPricePoint.id=45713&voucherPricePoint.price=15000&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=${sv}&voucherTypeName=NETEASE_LIFEAFTER&shopLang=id_ID`;
  const data = await hitCoda(body);
  return {
    success: true,
    game: "LifeAfter",
    id,
    server: sn,
    name: data.confirmationFields.username
  };
}
__name(la, "la");

// src/router/lad.ts
async function lad(id) {
  const JWT1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkeW5hbWljU2t1SW5mbyI6IntcInNrdUlkXCI6XCIxXzEwMDBcIixcImV2ZW50UGFja2FnZVwiOlwiMFwiLFwiZGVub21JbWFnZVVybFwiOlwiaHR0cHM6Ly9jZG4xLmNvZGFzaG9wLmNvbS9pbWFnZXMvOTE2XzQ0Y2MyNmU3LWU3NDctNDk4NS04MzQ1LWZmODFjMGUwM2QxN19MT1ZFIEFORCBERUVQU1BBQ0VfaW1hZ2UvNjAgQ3J5c3RhbHMucG5nXCIsXCJkZW5vbU5hbWVcIjpcIjYwIENyeXN0YWxzXCIsXCJkZW5vbUNhdGVnb3J5TmFtZVwiOlwiQ3J5c3RhbFwiLFwidGFnc1wiOltdLFwiY291bnRyeTJOYW1lXCI6XCJJRFwiLFwibHZ0SWRcIjoxMTY4NCxcImRlZmF1bHRQcmljZVwiOjE5MDAwLjAsXCJkZWZhdWx0Q3VycmVuY3lcIjpcIklEUlwiLFwiYWRkaXRpb25hbEluZm9cIjp7XCJEeW5hbWljU2t1UHJvbW9EZXRhaWxcIjpcIm51bGxcIixcIkxveWFsdHlDdXJyZW5jeURldGFpbFwiOlwie1xcXCJwcmljaW5nU2NoZW1lXFxcIjpcXFwicGFpZF9jdXJyZW5jeVxcXCIsXFxcImxveWFsdHlFYXJuZWRBbW91bnRcXFwiOjAuMCxcXFwibG95YWx0eUJ1cm5lZEFtb3VudFxcXCI6MC4wfVwifX0ifQ.VsI9fduPyRDA1t_GOQ65cR88HJc_a93ROdy8Fsg8bEw";
  const JWT2 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkeW5hbWljU2t1SW5mbyI6IntcInBjSWRcIjoyMjcsXCJwcmljZVwiOjE5MDAwLjAsXCJjdXJyZW5jeVwiOlwiSURSXCIsXCJhcGlQcmljZVwiOjE5MDAwLjAsXCJhcGlQcmljZUN1cnJlbmN5XCI6XCJJRFJcIixcImRpc2NvdW50UHJpY2VcIjoxOTAwMC4wLFwicHJpY2VCZWZvcmVUYXhcIjoxNzExNy4wLFwidGF4QW1vdW50XCI6MTg4My4wLFwic2t1SWRcIjpcIjFfMTAwMFwiLFwibHZ0SWRcIjoxMTY4NH0ifQ.nAclaCSG5o2xD9ccUuWTn3g8nC8Z7_nIDtj_qbCyQ0M";
  const body = `voucherPricePoint.id=3&voucherPricePoint.price=19000&voucherPricePoint.variablePrice=0&user.userId=${id}&voucherTypeName=INFOLD_GAMES-LOVE_AND_DEEPSPACE&lvtId=11684&shopLang=id_ID&dynamicSkuToken=${JWT1}&pricePointDynamicSkuToken=${JWT2}`;
  const data = await hitCoda(body);
  if (data.confirmationFields.username) {
    return {
      success: true,
      game: "Love and Deepspace",
      id,
      name: data.confirmationFields.username
    };
  } else {
    return {
      success: false,
      message: "Not found"
    };
  }
}
__name(lad, "lad");

// src/router/mcgg.ts
async function mcgg(id, zone) {
  const body = `voucherPricePoint.id=997117&voucherPricePoint.price=1579&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=${zone}&voucherTypeName=106-MAGIC_CHESS&shopLang=id_ID`;
  const data = await hitCoda(body);
  if (data.confirmationFields.username) {
    return {
      success: true,
      game: "Magic Chess: Go Go",
      id,
      zone,
      name: data.confirmationFields.username
    };
  } else {
    return {
      success: false,
      message: "Not found"
    };
  }
}
__name(mcgg, "mcgg");

// src/router/ml.ts
async function ml(id, zone) {
  const request = await fetch(`https://mlbb-api.isan.eu.org/find?id=${id}&zone=${zone}`);
  const data = await request.json();
  return {
    success: true,
    game: "Mobile Legends: Bang Bang",
    id,
    server: zone,
    name: data.name,
    country: data.countryName
  };
}
__name(ml, "ml");

// src/router/pb.ts
async function pb(id) {
  const body = `voucherPricePoint.id=54700&voucherPricePoint.price=11000&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=&voucherTypeName=POINT_BLANK&shopLang=id_ID`;
  const data = await hitCoda(body);
  if (data.confirmationFields.username) {
    return {
      success: true,
      game: "Point Blank",
      id,
      name: data.confirmationFields.username
    };
  } else {
    return {
      success: false,
      message: "Not found"
    };
  }
}
__name(pb, "pb");

// src/router/pgr.ts
async function pgr(id, zone) {
  let sn;
  let sv;
  switch (zone.toLowerCase()) {
    case "ap":
      sn = "Asia-Pacific";
      sv = "5000";
      break;
    case "eu":
      sn = "Europe";
      sv = "5001";
      break;
    case "na":
      sn = "North America";
      sv = "5002";
      break;
    default:
      return {
        success: false,
        message: "Bad request"
      };
  }
  const body = `voucherPricePoint.id=259947&voucherPricePoint.price=15000&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=${sv}&voucherTypeName=PUNISHING_GRAY_RAVEN&shopLang=id_ID`;
  const data = await hitCoda(body);
  return {
    success: true,
    game: "Punishing: Gray Raven",
    id,
    server: sn,
    name: data.confirmationFields.username
  };
}
__name(pgr, "pgr");

// src/router/sm.ts
async function sus(id) {
  const body = `voucherPricePoint.id=256513&voucherPricePoint.price=16000&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=global-release&voucherTypeName=SAUSAGE_MAN&shopLang=id_ID`;
  const data = await hitCoda(body);
  return {
    success: true,
    game: "Sausage Man",
    id,
    name: data.confirmationFields.username
  };
}
__name(sus, "sus");

// src/router/sus.ts
async function sus2(id) {
  const body = `voucherPricePoint.id=266077&voucherPricePoint.price=13000&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=&voucherTypeName=SUPER_SUS&shopLang=id_ID`;
  const data = await hitCoda(body);
  return {
    success: true,
    game: "Super Sus",
    id,
    name: data.confirmationFields.username
  };
}
__name(sus2, "sus");

// src/router/valo.ts
async function valo(id) {
  const body = `voucherPricePoint.id=973634&voucherPricePoint.price=56000&voucherPricePoint.variablePrice=0&user.userId=${id}&voucherTypeName=VALORANT&voucherTypeId=109&gvtId=139&shopLang=id_ID`;
  const data = await hitCoda(body);
  if (data.success === true) {
    return {
      success: true,
      game: "VALORANT",
      id,
      server: "Indonesia",
      name: data.confirmationFields.username
    };
  } else if (data.errorCode === -200) {
    return {
      success: true,
      game: "VALORANT",
      id,
      name: id
    };
  } else {
    return {
      success: false,
      message: "Not found"
    };
  }
}
__name(valo, "valo");

// src/router/zzz.ts
async function zzz(id) {
  let sn;
  let sv;
  const idStr = id.toString().substring(0, 2);
  switch (idStr) {
    case "10":
      sn = "America";
      sv = "prod_gf_us";
      break;
    case "13":
      sn = "Asia";
      sv = "prod_gf_jp";
      break;
    case "15":
      sn = "Europe";
      sv = "prod_gf_eu";
      break;
    case "17":
      sn = "SAR (Taiwan, Hong Kong, Macao)";
      sv = "prod_gf_sg";
      break;
    default:
      return {
        success: false,
        message: "Bad request"
      };
  }
  const body = `voucherPricePoint.id=946399&voucherPricePoint.price=16000&voucherPricePoint.variablePrice=0&user.userId=${id}&user.zoneId=${sv}&voucherTypeName=ZENLESS_ZONE_ZERO&shopLang=id_ID`;
  const data = await hitCoda(body);
  return {
    success: true,
    game: "Zenless Zone Zero",
    id,
    server: sn,
    name: data.confirmationFields.username
  };
}
__name(zzz, "zzz");

// src/routing.ts
async function callAPI(url) {
  let { path, id, server, zone } = getParams(url);
  server = server || zone;
  if (!id) {
    return {
      success: false,
      message: "Bad request"
    };
  }
  try {
    switch (true) {
      case path.includes("/aov"):
        return await aov(Number(id));
      case path.includes("/codm"):
        return await codm(Number(id));
      case path.includes("/ff"):
        return await ff(Number(id));
      case path.includes("/gi"):
        return await gi(Number(id));
      case path.includes("/hi"):
        return await hi(Number(id));
      case path.includes("/hsr"):
        return await hsr(Number(id));
      case path.includes("/la"):
        return await la(Number(id), server);
      case path.includes("/ld"):
        return await lad(Number(id));
      case path.includes("/mcgg"):
        return await mcgg(Number(id), Number(server));
      case path.includes("/ml"):
        return await ml(Number(id), Number(server));
      case path.includes("/pb"):
        return await pb(id);
      case path.includes("/pgr"):
        return await pgr(Number(id), server);
      case path.includes("/sm"):
        return await sus(id);
      case path.includes("/sus"):
        return await sus2(Number(id));
      case path.includes("/valo"):
        return await valo(id);
      case path.includes("/zzz"):
        return await zzz(Number(id));
      default:
        return {
          success: false,
          message: "Bad request"
        };
    }
  } catch (error) {
    return {
      success: false,
      message: "Not found"
    };
  }
}
__name(callAPI, "callAPI");

// src/helpers.ts
async function serveResult(url) {
  const { decode } = getParams(url);
  let status = 200;
  const result = await callAPI(url);
  if (result.game === "Mobile Legends: Bang Bang")
    result.name.replace(/\u002B/g, "%20");
  if (result.name) {
    if (decode === null || decode === "true" || decode !== "false") {
      result.name = decodeURIComponent(result.name);
    }
  }
  if (result.message === "Bad request") {
    status = 400;
  }
  if (result.message === "Not found") {
    status = 404;
  }
  return Response.json(result, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": allowedMethod.join(", "),
      "Access-Control-Expose-Headers": "*",
      "Cache-Control": "public, max-age=30, s-maxage=43200, immutable",
      "X-Powered-By": "@ihsangan/valid"
    }
  });
}
__name(serveResult, "serveResult");

// src/handler.ts
async function checkCache(request) {
  const now = Date.now();
  if (allowedMethod.indexOf(request.method) === -1) {
    return Response.json({
      success: false,
      message: "Method not allowed"
    }, {
      status: 405,
      headers: {
        "Allow": allowedMethod.join(", "),
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": allowedMethod.join(", "),
        "X-Powered-By": "@ihsangan/valid"
      }
    });
  }
  const url = await parseRequest(request);
  const cache = caches.default;
  let response = await cache.match(url);
  if (!response) {
    response = await serveResult(url);
    await cache.put(url, response.clone());
  }
  response = new Response(response.body, response);
  response.headers.set("X-Response-Time", Date.now() - now);
  return response;
}
__name(checkCache, "checkCache");

// src/index.ts
var src_default = {
  fetch: async (request) => await checkCache(request)
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-mVzmim/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-mVzmim/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
