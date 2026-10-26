// Tiny IndexedDB wrapper. Photos of her clothes live here, on her device only.
const NAME = "lounge";
const STORES = ["closet"];

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(NAME, 1);
    req.onupgradeneeded = () => {
      for (const s of STORES) if (!req.result.objectStoreNames.contains(s)) req.result.createObjectStore(s, { keyPath: "id" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run(store, mode, op) {
  const d = await open();
  return new Promise((resolve, reject) => {
    const t = d.transaction(store, mode);
    const req = op(t.objectStore(store));
    t.oncomplete = () => resolve(req?.result);
    t.onerror = () => reject(t.error);
  });
}

export const db = {
  all: (store) => run(store, "readonly", (o) => o.getAll()).catch(() => []),
  put: (store, value) => run(store, "readwrite", (o) => o.put(value)),
  del: (store, id) => run(store, "readwrite", (o) => o.delete(id)),
};
