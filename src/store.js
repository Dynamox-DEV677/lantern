// Local first: every tap is written here before anything touches the network.
// Stores: kv (settings), cuts (this phone's log), queue (reports waiting to send).

const NAME = 'lantern';
const VERSION = 1;
let dbp = null;

function open() {
  if (!dbp) {
    dbp = new Promise((resolve, reject) => {
      const req = indexedDB.open(NAME, VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        db.createObjectStore('kv');
        db.createObjectStore('cuts', { keyPath: 'id' });
        db.createObjectStore('queue', { keyPath: 'seq', autoIncrement: true });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbp;
}

// Run fn against the named stores in one transaction; resolves when it commits.
async function run(stores, mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(stores, mode);
    const s = Object.fromEntries([].concat(stores).map((n) => [n, tx.objectStore(n)]));
    const req = fn(s);
    tx.oncomplete = () => resolve(req instanceof IDBRequest ? req.result : undefined);
    tx.onerror = tx.onabort = () => reject(tx.error);
  });
}

export const kvGet = (key) => run('kv', 'readonly', (s) => s.kv.get(key));
export const kvSet = (key, value) => run('kv', 'readwrite', (s) => s.kv.put(value, key));
export const cutsAll = () => run('cuts', 'readonly', (s) => s.cuts.getAll());
export const queueAll = () => run('queue', 'readonly', (s) => s.queue.getAll());
export const queueDelete = (seq) => run('queue', 'readwrite', (s) => s.queue.delete(seq));

// The cut and its report go in together, so one can never be saved without the other.
export const saveCut = (cut, op) =>
  run(['cuts', 'queue'], 'readwrite', (s) => {
    s.cuts.put(cut);
    if (op) s.queue.add(op);
  });

export const removeCut = (id, dropSeq, op) =>
  run(['cuts', 'queue'], 'readwrite', (s) => {
    s.cuts.delete(id);
    if (dropSeq != null) s.queue.delete(dropSeq);
    if (op) s.queue.add(op);
  });

export const clearAll = () =>
  run(['kv', 'cuts', 'queue'], 'readwrite', (s) => {
    s.kv.clear();
    s.cuts.clear();
    s.queue.clear();
  });
