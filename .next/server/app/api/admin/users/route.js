"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/admin/users/route";
exports.ids = ["app/api/admin/users/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fusers%2Froute&page=%2Fapi%2Fadmin%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fusers%2Froute.ts&appDir=%2FUsers%2Femyildiran%2FDesktop%2FClinikoop-1%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Femyildiran%2FDesktop%2FClinikoop-1&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fusers%2Froute&page=%2Fapi%2Fadmin%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fusers%2Froute.ts&appDir=%2FUsers%2Femyildiran%2FDesktop%2FClinikoop-1%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Femyildiran%2FDesktop%2FClinikoop-1&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_emyildiran_Desktop_Clinikoop_1_src_app_api_admin_users_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/admin/users/route.ts */ \"(rsc)/./src/app/api/admin/users/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/users/route\",\n        pathname: \"/api/admin/users\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/users/route\"\n    },\n    resolvedPagePath: \"/Users/emyildiran/Desktop/Clinikoop-1/src/app/api/admin/users/route.ts\",\n    nextConfigOutput,\n    userland: _Users_emyildiran_Desktop_Clinikoop_1_src_app_api_admin_users_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/admin/users/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRnVzZXJzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhZG1pbiUyRnVzZXJzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYWRtaW4lMkZ1c2VycyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmVteWlsZGlyYW4lMkZEZXNrdG9wJTJGQ2xpbmlrb29wLTElMkZzcmMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGZW15aWxkaXJhbiUyRkRlc2t0b3AlMkZDbGluaWtvb3AtMSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDc0I7QUFDbkc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jbGluaWtvb3AvPzBjYjEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL2VteWlsZGlyYW4vRGVza3RvcC9DbGluaWtvb3AtMS9zcmMvYXBwL2FwaS9hZG1pbi91c2Vycy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYWRtaW4vdXNlcnMvcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hZG1pbi91c2Vyc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYWRtaW4vdXNlcnMvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvZW15aWxkaXJhbi9EZXNrdG9wL0NsaW5pa29vcC0xL3NyYy9hcHAvYXBpL2FkbWluL3VzZXJzL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hZG1pbi91c2Vycy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fusers%2Froute&page=%2Fapi%2Fadmin%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fusers%2Froute.ts&appDir=%2FUsers%2Femyildiran%2FDesktop%2FClinikoop-1%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Femyildiran%2FDesktop%2FClinikoop-1&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/admin/users/route.ts":
/*!******************************************!*\
  !*** ./src/app/api/admin/users/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_authOptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/authOptions */ \"(rsc)/./src/lib/authOptions.ts\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_5__);\n\n\n\n\n\n\nasync function GET(request) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_2__.getServerSession)(_lib_authOptions__WEBPACK_IMPORTED_MODULE_3__.authOptions);\n    if (!session || !session.user?.isSuperAdmin) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Yetkisiz\"\n        }, {\n            status: 403\n        });\n    }\n    const users = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.clinicUser.findMany({\n        include: {\n            clinic: {\n                select: {\n                    id: true,\n                    name: true\n                }\n            }\n        },\n        orderBy: {\n            createdAt: \"desc\"\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        users\n    });\n}\nasync function POST(request) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_2__.getServerSession)(_lib_authOptions__WEBPACK_IMPORTED_MODULE_3__.authOptions);\n    if (!session || !session.user?.isSuperAdmin) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Yetkisiz\"\n        }, {\n            status: 403\n        });\n    }\n    const body = await request.json();\n    const { name, email, role, clinicId, permissions } = body;\n    if (!name || !email || !role || !clinicId) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Eksik alanlar\"\n        }, {\n            status: 400\n        });\n    }\n    // Aynı klinikte aynı e-posta ile kullanıcı var mı?\n    const existing = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.clinicUser.findFirst({\n        where: {\n            email,\n            clinicId\n        }\n    });\n    if (existing) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            message: \"Bu e-posta ile zaten kullanıcı var\"\n        }, {\n            status: 409\n        });\n    }\n    // Geçici şifre oluştur (kullanıcı ilk girişte değiştirecek)\n    const tempPassword = (0,crypto__WEBPACK_IMPORTED_MODULE_4__.randomBytes)(8).toString(\"hex\");\n    const hashedPassword = await bcryptjs__WEBPACK_IMPORTED_MODULE_5___default().hash(tempPassword, 12);\n    // Kullanıcıyı oluştur\n    const newUser = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.clinicUser.create({\n        data: {\n            name,\n            email,\n            password: hashedPassword,\n            role,\n            clinicId,\n            permissions: role === \"CUSTOM\" ? JSON.stringify(permissions) : undefined,\n            isActive: false\n        }\n    });\n    // SMTP/email entegrasyonu için alan (şimdilik konsola yaz)\n    // Canlıya geçişte burası SMTP ile değiştirilecek\n    console.log(`Yeni kullanıcı oluşturuldu: ${email}`);\n    console.log(`Geçici şifre: ${tempPassword}`);\n    // TODO: SMTP/email entegrasyonu için kodu güncelle (bkz: README)\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        message: \"Kullanıcı oluşturuldu\",\n        userId: newUser.id\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hZG1pbi91c2Vycy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUF3RDtBQUN0QjtBQUNXO0FBQ0c7QUFDWDtBQUNQO0FBRXZCLGVBQWVNLElBQUlDLE9BQW9CO0lBQzVDLE1BQU1DLFVBQVUsTUFBTU4sMkRBQWdCQSxDQUFDQyx5REFBV0E7SUFDbEQsSUFBSSxDQUFDSyxXQUFXLENBQUVBLFFBQVFDLElBQUksRUFBVUMsY0FBYztRQUNwRCxPQUFPVixxREFBWUEsQ0FBQ1csSUFBSSxDQUFDO1lBQUVDLFNBQVM7UUFBVyxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUNsRTtJQUVBLE1BQU1DLFFBQVEsTUFBTWIsMkNBQU1BLENBQUNjLFVBQVUsQ0FBQ0MsUUFBUSxDQUFDO1FBQzdDQyxTQUFTO1lBQ1BDLFFBQVE7Z0JBQUVDLFFBQVE7b0JBQUVDLElBQUk7b0JBQU1DLE1BQU07Z0JBQUs7WUFBRTtRQUM3QztRQUNBQyxTQUFTO1lBQUVDLFdBQVc7UUFBTztJQUMvQjtJQUVBLE9BQU92QixxREFBWUEsQ0FBQ1csSUFBSSxDQUFDO1FBQUVHO0lBQU07QUFDbkM7QUFFTyxlQUFlVSxLQUFLakIsT0FBb0I7SUFDN0MsTUFBTUMsVUFBVSxNQUFNTiwyREFBZ0JBLENBQUNDLHlEQUFXQTtJQUNsRCxJQUFJLENBQUNLLFdBQVcsQ0FBRUEsUUFBUUMsSUFBSSxFQUFVQyxjQUFjO1FBQ3BELE9BQU9WLHFEQUFZQSxDQUFDVyxJQUFJLENBQUM7WUFBRUMsU0FBUztRQUFXLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ2xFO0lBRUEsTUFBTVksT0FBTyxNQUFNbEIsUUFBUUksSUFBSTtJQUMvQixNQUFNLEVBQUVVLElBQUksRUFBRUssS0FBSyxFQUFFQyxJQUFJLEVBQUVDLFFBQVEsRUFBRUMsV0FBVyxFQUFFLEdBQUdKO0lBRXJELElBQUksQ0FBQ0osUUFBUSxDQUFDSyxTQUFTLENBQUNDLFFBQVEsQ0FBQ0MsVUFBVTtRQUN6QyxPQUFPNUIscURBQVlBLENBQUNXLElBQUksQ0FBQztZQUFFQyxTQUFTO1FBQWdCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ3ZFO0lBRUEsbURBQW1EO0lBQ25ELE1BQU1pQixXQUFXLE1BQU03QiwyQ0FBTUEsQ0FBQ2MsVUFBVSxDQUFDZ0IsU0FBUyxDQUFDO1FBQ2pEQyxPQUFPO1lBQUVOO1lBQU9FO1FBQVM7SUFDM0I7SUFDQSxJQUFJRSxVQUFVO1FBQ1osT0FBTzlCLHFEQUFZQSxDQUFDVyxJQUFJLENBQUM7WUFBRUMsU0FBUztRQUFxQyxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUM1RjtJQUVBLDREQUE0RDtJQUM1RCxNQUFNb0IsZUFBZTdCLG1EQUFXQSxDQUFDLEdBQUc4QixRQUFRLENBQUM7SUFDN0MsTUFBTUMsaUJBQWlCLE1BQU05QixvREFBVyxDQUFDNEIsY0FBYztJQUV2RCxzQkFBc0I7SUFDdEIsTUFBTUksVUFBVSxNQUFNcEMsMkNBQU1BLENBQUNjLFVBQVUsQ0FBQ3VCLE1BQU0sQ0FBQztRQUM3Q0MsTUFBTTtZQUNKbEI7WUFDQUs7WUFDQWMsVUFBVUw7WUFDVlI7WUFDQUM7WUFDQUMsYUFBYUYsU0FBUyxXQUFXYyxLQUFLQyxTQUFTLENBQUNiLGVBQWVjO1lBQy9EQyxVQUFVO1FBQ1o7SUFDRjtJQUVBLDJEQUEyRDtJQUMzRCxpREFBaUQ7SUFDakRDLFFBQVFDLEdBQUcsQ0FBQyxDQUFDLDRCQUE0QixFQUFFcEIsTUFBTSxDQUFDO0lBQ2xEbUIsUUFBUUMsR0FBRyxDQUFDLENBQUMsY0FBYyxFQUFFYixhQUFhLENBQUM7SUFDM0MsaUVBQWlFO0lBRWpFLE9BQU9qQyxxREFBWUEsQ0FBQ1csSUFBSSxDQUFDO1FBQUVDLFNBQVM7UUFBeUJtQyxRQUFRVixRQUFRakIsRUFBRTtJQUFDO0FBQ2xGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY2xpbmlrb29wLy4vc3JjL2FwcC9hcGkvYWRtaW4vdXNlcnMvcm91dGUudHM/NjBkYyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvZGInO1xuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGhPcHRpb25zJztcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0KSB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcbiAgaWYgKCFzZXNzaW9uIHx8ICEoc2Vzc2lvbi51c2VyIGFzIGFueSk/LmlzU3VwZXJBZG1pbikge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6ICdZZXRraXNpeicgfSwgeyBzdGF0dXM6IDQwMyB9KTtcbiAgfVxuXG4gIGNvbnN0IHVzZXJzID0gYXdhaXQgcHJpc21hLmNsaW5pY1VzZXIuZmluZE1hbnkoe1xuICAgIGluY2x1ZGU6IHtcbiAgICAgIGNsaW5pYzogeyBzZWxlY3Q6IHsgaWQ6IHRydWUsIG5hbWU6IHRydWUgfSB9LFxuICAgIH0sXG4gICAgb3JkZXJCeTogeyBjcmVhdGVkQXQ6ICdkZXNjJyB9LFxuICB9KTtcblxuICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyB1c2VycyB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpO1xuICBpZiAoIXNlc3Npb24gfHwgIShzZXNzaW9uLnVzZXIgYXMgYW55KT8uaXNTdXBlckFkbWluKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogJ1lldGtpc2l6JyB9LCB7IHN0YXR1czogNDAzIH0pO1xuICB9XG5cbiAgY29uc3QgYm9keSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuICBjb25zdCB7IG5hbWUsIGVtYWlsLCByb2xlLCBjbGluaWNJZCwgcGVybWlzc2lvbnMgfSA9IGJvZHk7XG5cbiAgaWYgKCFuYW1lIHx8ICFlbWFpbCB8fCAhcm9sZSB8fCAhY2xpbmljSWQpIHtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBtZXNzYWdlOiAnRWtzaWsgYWxhbmxhcicgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgfVxuXG4gIC8vIEF5bsSxIGtsaW5pa3RlIGF5bsSxIGUtcG9zdGEgaWxlIGt1bGxhbsSxY8SxIHZhciBtxLE/XG4gIGNvbnN0IGV4aXN0aW5nID0gYXdhaXQgcHJpc21hLmNsaW5pY1VzZXIuZmluZEZpcnN0KHtcbiAgICB3aGVyZTogeyBlbWFpbCwgY2xpbmljSWQgfSxcbiAgfSk7XG4gIGlmIChleGlzdGluZykge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IG1lc3NhZ2U6ICdCdSBlLXBvc3RhIGlsZSB6YXRlbiBrdWxsYW7EsWPEsSB2YXInIH0sIHsgc3RhdHVzOiA0MDkgfSk7XG4gIH1cblxuICAvLyBHZcOnaWNpIMWfaWZyZSBvbHXFn3R1ciAoa3VsbGFuxLFjxLEgaWxrIGdpcmnFn3RlIGRlxJ9pxZ90aXJlY2VrKVxuICBjb25zdCB0ZW1wUGFzc3dvcmQgPSByYW5kb21CeXRlcyg4KS50b1N0cmluZygnaGV4Jyk7XG4gIGNvbnN0IGhhc2hlZFBhc3N3b3JkID0gYXdhaXQgYmNyeXB0Lmhhc2godGVtcFBhc3N3b3JkLCAxMik7XG5cbiAgLy8gS3VsbGFuxLFjxLF5xLEgb2x1xZ90dXJcbiAgY29uc3QgbmV3VXNlciA9IGF3YWl0IHByaXNtYS5jbGluaWNVc2VyLmNyZWF0ZSh7XG4gICAgZGF0YToge1xuICAgICAgbmFtZSxcbiAgICAgIGVtYWlsLFxuICAgICAgcGFzc3dvcmQ6IGhhc2hlZFBhc3N3b3JkLFxuICAgICAgcm9sZSxcbiAgICAgIGNsaW5pY0lkLFxuICAgICAgcGVybWlzc2lvbnM6IHJvbGUgPT09ICdDVVNUT00nID8gSlNPTi5zdHJpbmdpZnkocGVybWlzc2lvbnMpIDogdW5kZWZpbmVkLFxuICAgICAgaXNBY3RpdmU6IGZhbHNlLCAvLyDEsGxrIGdpcmnFn3RlIGFrdGlmbGXFn2VjZWtcbiAgICB9LFxuICB9KTtcblxuICAvLyBTTVRQL2VtYWlsIGVudGVncmFzeW9udSBpw6dpbiBhbGFuICjFn2ltZGlsaWsga29uc29sYSB5YXopXG4gIC8vIENhbmzEsXlhIGdlw6dpxZ90ZSBidXJhc8SxIFNNVFAgaWxlIGRlxJ9pxZ90aXJpbGVjZWtcbiAgY29uc29sZS5sb2coYFllbmkga3VsbGFuxLFjxLEgb2x1xZ90dXJ1bGR1OiAke2VtYWlsfWApO1xuICBjb25zb2xlLmxvZyhgR2XDp2ljaSDFn2lmcmU6ICR7dGVtcFBhc3N3b3JkfWApO1xuICAvLyBUT0RPOiBTTVRQL2VtYWlsIGVudGVncmFzeW9udSBpw6dpbiBrb2R1IGfDvG5jZWxsZSAoYmt6OiBSRUFETUUpXG5cbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgbWVzc2FnZTogJ0t1bGxhbsSxY8SxIG9sdcWfdHVydWxkdScsIHVzZXJJZDogbmV3VXNlci5pZCB9KTtcbn0gIl0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsInByaXNtYSIsImdldFNlcnZlclNlc3Npb24iLCJhdXRoT3B0aW9ucyIsInJhbmRvbUJ5dGVzIiwiYmNyeXB0IiwiR0VUIiwicmVxdWVzdCIsInNlc3Npb24iLCJ1c2VyIiwiaXNTdXBlckFkbWluIiwianNvbiIsIm1lc3NhZ2UiLCJzdGF0dXMiLCJ1c2VycyIsImNsaW5pY1VzZXIiLCJmaW5kTWFueSIsImluY2x1ZGUiLCJjbGluaWMiLCJzZWxlY3QiLCJpZCIsIm5hbWUiLCJvcmRlckJ5IiwiY3JlYXRlZEF0IiwiUE9TVCIsImJvZHkiLCJlbWFpbCIsInJvbGUiLCJjbGluaWNJZCIsInBlcm1pc3Npb25zIiwiZXhpc3RpbmciLCJmaW5kRmlyc3QiLCJ3aGVyZSIsInRlbXBQYXNzd29yZCIsInRvU3RyaW5nIiwiaGFzaGVkUGFzc3dvcmQiLCJoYXNoIiwibmV3VXNlciIsImNyZWF0ZSIsImRhdGEiLCJwYXNzd29yZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ1bmRlZmluZWQiLCJpc0FjdGl2ZSIsImNvbnNvbGUiLCJsb2ciLCJ1c2VySWQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/admin/users/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/authOptions.ts":
/*!********************************!*\
  !*** ./src/lib/authOptions.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./src/lib/db.ts\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"E-posta\",\n                    type: \"email\",\n                    placeholder: \"mail@klinik.com\"\n                },\n                password: {\n                    label: \"Şifre\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) return null;\n                // Önce User (süper admin) modelinde ara\n                const user = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (user) {\n                    const isValid = await bcryptjs__WEBPACK_IMPORTED_MODULE_2___default().compare(credentials.password, user.password);\n                    if (!isValid) return null;\n                    return {\n                        id: user.id,\n                        email: user.email,\n                        name: user.name,\n                        role: user.role,\n                        clinicId: null,\n                        isSuperAdmin: true\n                    };\n                }\n                // Sonra ClinicUser (klinik kullanıcıları) modelinde ara\n                const clinicUser = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.clinicUser.findFirst({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (clinicUser) {\n                    const isValid = await bcryptjs__WEBPACK_IMPORTED_MODULE_2___default().compare(credentials.password, clinicUser.password);\n                    if (!isValid) return null;\n                    return {\n                        id: clinicUser.id,\n                        email: clinicUser.email,\n                        name: clinicUser.name,\n                        role: clinicUser.role,\n                        clinicId: clinicUser.clinicId,\n                        isSuperAdmin: false\n                    };\n                }\n                return null;\n            }\n        })\n    ],\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 24 * 60 * 60\n    },\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                const u = user;\n                token.role = u.role;\n                token.clinicId = u.clinicId;\n                token.isSuperAdmin = u.isSuperAdmin;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session.user) {\n                session.user.role = token.role;\n                session.user.clinicId = token.clinicId;\n                session.user.isSuperAdmin = token.isSuperAdmin;\n            }\n            return session;\n        }\n    },\n    pages: {\n        signIn: \"/login\",\n        signOut: \"/logout\",\n        error: \"/login\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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cz9jMzk1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRBdXRoT3B0aW9ucyB9IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgQ3JlZGVudGlhbHNQcm92aWRlciBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzJztcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0AvbGliL2RiJztcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEF1dGhVc2VyIHtcbiAgaWQ6IHN0cmluZztcbiAgZW1haWw6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICByb2xlOiBzdHJpbmc7XG4gIGNsaW5pY0lkOiBzdHJpbmcgfCBudWxsO1xuICBpc1N1cGVyQWRtaW46IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xuICBwcm92aWRlcnM6IFtcbiAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcbiAgICAgIG5hbWU6ICdDcmVkZW50aWFscycsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogJ0UtcG9zdGEnLCB0eXBlOiAnZW1haWwnLCBwbGFjZWhvbGRlcjogJ21haWxAa2xpbmlrLmNvbScgfSxcbiAgICAgICAgcGFzc3dvcmQ6IHsgbGFiZWw6ICfFnmlmcmUnLCB0eXBlOiAncGFzc3dvcmQnIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHJldHVybiBudWxsO1xuICAgICAgICAvLyDDlm5jZSBVc2VyIChzw7xwZXIgYWRtaW4pIG1vZGVsaW5kZSBhcmFcbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgICAgIHdoZXJlOiB7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9LFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKHVzZXIpIHtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpO1xuICAgICAgICAgIGlmICghaXNWYWxpZCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXG4gICAgICAgICAgICBuYW1lOiB1c2VyLm5hbWUsXG4gICAgICAgICAgICByb2xlOiB1c2VyLnJvbGUsXG4gICAgICAgICAgICBjbGluaWNJZDogbnVsbCxcbiAgICAgICAgICAgIGlzU3VwZXJBZG1pbjogdHJ1ZSxcbiAgICAgICAgICB9IGFzIEF1dGhVc2VyO1xuICAgICAgICB9XG4gICAgICAgIC8vIFNvbnJhIENsaW5pY1VzZXIgKGtsaW5payBrdWxsYW7EsWPEsWxhcsSxKSBtb2RlbGluZGUgYXJhXG4gICAgICAgIGNvbnN0IGNsaW5pY1VzZXIgPSBhd2FpdCBwcmlzbWEuY2xpbmljVXNlci5maW5kRmlyc3Qoe1xuICAgICAgICAgIHdoZXJlOiB7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9LFxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGNsaW5pY1VzZXIpIHtcbiAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIGNsaW5pY1VzZXIucGFzc3dvcmQpO1xuICAgICAgICAgIGlmICghaXNWYWxpZCkgcmV0dXJuIG51bGw7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGlkOiBjbGluaWNVc2VyLmlkLFxuICAgICAgICAgICAgZW1haWw6IGNsaW5pY1VzZXIuZW1haWwsXG4gICAgICAgICAgICBuYW1lOiBjbGluaWNVc2VyLm5hbWUsXG4gICAgICAgICAgICByb2xlOiBjbGluaWNVc2VyLnJvbGUsXG4gICAgICAgICAgICBjbGluaWNJZDogY2xpbmljVXNlci5jbGluaWNJZCxcbiAgICAgICAgICAgIGlzU3VwZXJBZG1pbjogZmFsc2UsXG4gICAgICAgICAgfSBhcyBBdXRoVXNlcjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIHNlc3Npb246IHtcbiAgICBzdHJhdGVneTogJ2p3dCcsXG4gICAgbWF4QWdlOiAzMCAqIDI0ICogNjAgKiA2MCwgLy8gMzAgZ8O8blxuICB9LFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICBjb25zdCB1ID0gdXNlciBhcyBBdXRoVXNlcjtcbiAgICAgICAgdG9rZW4ucm9sZSA9IHUucm9sZTtcbiAgICAgICAgdG9rZW4uY2xpbmljSWQgPSB1LmNsaW5pY0lkO1xuICAgICAgICB0b2tlbi5pc1N1cGVyQWRtaW4gPSB1LmlzU3VwZXJBZG1pbjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICBpZiAoc2Vzc2lvbi51c2VyKSB7XG4gICAgICAgIChzZXNzaW9uLnVzZXIgYXMgYW55KS5yb2xlID0gdG9rZW4ucm9sZTtcbiAgICAgICAgKHNlc3Npb24udXNlciBhcyBhbnkpLmNsaW5pY0lkID0gdG9rZW4uY2xpbmljSWQ7XG4gICAgICAgIChzZXNzaW9uLnVzZXIgYXMgYW55KS5pc1N1cGVyQWRtaW4gPSB0b2tlbi5pc1N1cGVyQWRtaW47XG4gICAgICB9XG4gICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9LFxuICB9LFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogJy9sb2dpbicsXG4gICAgc2lnbk91dDogJy9sb2dvdXQnLFxuICAgIGVycm9yOiAnL2xvZ2luJyxcbiAgfSxcbiAgc2VjcmV0OiBwcm9jZXNzLmVudi5ORVhUQVVUSF9TRUNSRVQsXG59OyAiXSwibmFtZXMiOlsiQ3JlZGVudGlhbHNQcm92aWRlciIsInByaXNtYSIsImJjcnlwdCIsImF1dGhPcHRpb25zIiwicHJvdmlkZXJzIiwibmFtZSIsImNyZWRlbnRpYWxzIiwiZW1haWwiLCJsYWJlbCIsInR5cGUiLCJwbGFjZWhvbGRlciIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwidXNlciIsImZpbmRVbmlxdWUiLCJ3aGVyZSIsImlzVmFsaWQiLCJjb21wYXJlIiwiaWQiLCJyb2xlIiwiY2xpbmljSWQiLCJpc1N1cGVyQWRtaW4iLCJjbGluaWNVc2VyIiwiZmluZEZpcnN0Iiwic2Vzc2lvbiIsInN0cmF0ZWd5IiwibWF4QWdlIiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJ1IiwicGFnZXMiLCJzaWduSW4iLCJzaWduT3V0IiwiZXJyb3IiLCJzZWNyZXQiLCJwcm9jZXNzIiwiZW52IiwiTkVYVEFVVEhfU0VDUkVUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/authOptions.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/db.ts":
/*!***********************!*\
  !*** ./src/lib/db.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2RiLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxHQUFFO0FBRWxFLElBQUlJLElBQXlCLEVBQWNILGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NsaW5pa29vcC8uL3NyYy9saWIvZGIudHM/OWU0ZiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcclxuXHJcbmNvbnN0IGdsb2JhbEZvclByaXNtYSA9IGdsb2JhbFRoaXMgYXMgdW5rbm93biBhcyB7XHJcbiAgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWRcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHByaXNtYSA9IGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPz8gbmV3IFByaXNtYUNsaWVudCgpXHJcblxyXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA9IHByaXNtYSAiXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2xvYmFsRm9yUHJpc21hIiwiZ2xvYmFsVGhpcyIsInByaXNtYSIsInByb2Nlc3MiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/db.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@opentelemetry","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/bcryptjs","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fusers%2Froute&page=%2Fapi%2Fadmin%2Fusers%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fusers%2Froute.ts&appDir=%2FUsers%2Femyildiran%2FDesktop%2FClinikoop-1%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Femyildiran%2FDesktop%2FClinikoop-1&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();