'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "c670b3c965a2b2d73495027248b750f7",
"version.json": "6605d368f80cf618e36a4a71b9edfdc6",
"index.html": "686d4cb9f25228de251e77f52d907cc4",
"/": "686d4cb9f25228de251e77f52d907cc4",
"app_icon.png": "a1c05d0ef8ee1b60e5da258ba56efa52",
"main.dart.js": "42703f44b6c628ed7215c047977890c9",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"icons/app_icon_192.png": "37ed647faa7eee11228f94c59ac08b62",
"icons/app_icon.png": "a1c05d0ef8ee1b60e5da258ba56efa52",
"icons/app_icon_512.png": "9312b28621b28f0fcc14c223d5dafeab",
"manifest.json": "897980fda000188fd4e8f97dd4065fd5",
"assets/AssetManifest.json": "c533b7ab40acca816007fff11470d0fc",
"assets/NOTICES": "9ab773c00ff2fb52e513aebc7e6073c2",
"assets/FontManifest.json": "aba362dc3829492a647e62ba1a244da8",
"assets/AssetManifest.bin.json": "c838533679d25cea555baacbc9e2df62",
"assets/packages/mesh_gradient/shaders/animated_mesh_gradient.frag": "1890be5ac6e1b673019ee2604c2d59c5",
"assets/packages/mesh_gradient/shaders/point_mesh_gradient.frag": "6721e3c3c3b65cb49c2709c828288ffd",
"assets/packages/remixicon/fonts/Remix.ttf": "35ff0b36b529c4deb7c1f145d6e56062",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "8cc801ce62294e99a7d657b832c432ba",
"assets/fonts/MaterialIcons-Regular.otf": "ef24efa7c6b8425a4184ed2298afd98f",
"assets/assets/images/logos/uol/loog_uol_light.svg": "6411c2e1609bb94975ceaca033342c99",
"assets/assets/images/logos/uol/loog_uol_dark.svg": "ec1890f781f810a0d0f41902860d644a",
"assets/assets/fonts/roobert/RoobertTRIAL-Regular.ttf": "16623f174dba429347b771a792e07e18",
"assets/assets/fonts/roobert/RoobertTRIAL-SemiBoldItalic.ttf": "8461b1683dc4b37608bf5e3093bc2a27",
"assets/assets/fonts/roobert/RoobertTRIAL-Medium.ttf": "2fa9616a6c9d0fce3428533cbf2700b4",
"assets/assets/fonts/roobert/RoobertTRIAL-MediumItalic.ttf": "6ffd223fba515b079d8c4e590bb1e181",
"assets/assets/fonts/roobert/RoobertTRIAL-Bold.ttf": "ad2b39ba132987004161c0c1060d16b2",
"assets/assets/fonts/roobert/RoobertTRIAL-BoldItalic.ttf": "ee8534e601b7d4142e597bc6885cafce",
"assets/assets/fonts/roobert/RoobertTRIAL-HeavyItalic.ttf": "6f88f99f9a5d66048d7cf420e8c5f54a",
"assets/assets/fonts/roobert/RoobertTRIAL-SemiBold.ttf": "1365286d781fef5d5332eb4eaaf8f048",
"assets/assets/fonts/roobert/RoobertTRIAL-Heavy.ttf": "c68cc7410dca790a106b116922f98b45",
"assets/assets/fonts/roobert/RoobertTRIAL-RegularItalic.ttf": "0f0f4351689ee61abe191c8fadd0d99f",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
