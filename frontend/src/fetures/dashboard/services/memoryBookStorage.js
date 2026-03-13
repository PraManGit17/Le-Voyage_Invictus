const DB_NAME = 'le-voyage-memory-book';
const STORE_NAME = 'trip-memory-books';
const DB_VERSION = 1;

const EMPTY_MEMORY_BOOK = {
  dayImages: {},
  dayCaptions: {},
  generatedPages: [],
  generatedAt: null,
};

const normalizeMemoryBook = (value = {}) => ({
  dayImages: value?.dayImages && typeof value.dayImages === 'object' ? value.dayImages : {},
  dayCaptions: value?.dayCaptions && typeof value.dayCaptions === 'object' ? value.dayCaptions : {},
  generatedPages: Array.isArray(value?.generatedPages) ? value.generatedPages : [],
  generatedAt: value?.generatedAt || null,
});

const hasIndexedDb = () => typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';

const openDatabase = () => new Promise((resolve, reject) => {
  if (!hasIndexedDb()) {
    reject(new Error('IndexedDB is not available in this browser.'));
    return;
  }

  const request = window.indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'tripId' });
    }
  };

  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('Failed to open memory book storage.'));
});

const runStoreRequest = async (mode, action) => {
  const db = await openDatabase();

  try {
    return await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      const request = action(store);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('IndexedDB request failed.'));
      transaction.onerror = () => reject(transaction.error || new Error('IndexedDB transaction failed.'));
      transaction.onabort = () => reject(transaction.error || new Error('IndexedDB transaction aborted.'));
    });
  } finally {
    db.close();
  }
};

export const buildMemoryBookMeta = (memoryBook = {}) => {
  const normalized = normalizeMemoryBook(memoryBook);
  const imageGroups = Object.values(normalized.dayImages);
  const photoCount = imageGroups.reduce((sum, images) => sum + (Array.isArray(images) ? images.length : 0), 0);
  const daysWithPhotos = imageGroups.filter((images) => Array.isArray(images) && images.length > 0).length;

  return {
    generatedAt: normalized.generatedAt,
    generatedPageCount: normalized.generatedPages.length,
    daysWithPhotos,
    photoCount,
  };
};

export const hasLegacyMemoryBookPayload = (memoryBook = {}) => {
  const normalized = normalizeMemoryBook(memoryBook);
  return Object.keys(normalized.dayImages).length > 0 || normalized.generatedPages.length > 0;
};

export const memoryBookStorage = {
  async getTripMemoryBook(tripId) {
    if (!tripId) {
      return { ...EMPTY_MEMORY_BOOK };
    }

    try {
      const record = await runStoreRequest('readonly', (store) => store.get(tripId));
      return normalizeMemoryBook(record?.data);
    } catch {
      return { ...EMPTY_MEMORY_BOOK };
    }
  },

  async saveTripMemoryBook(tripId, data) {
    if (!tripId) {
      return { ...EMPTY_MEMORY_BOOK };
    }

    const normalized = normalizeMemoryBook(data);
    await runStoreRequest('readwrite', (store) => store.put({
      tripId,
      data: normalized,
      updatedAt: new Date().toISOString(),
    }));
    return normalized;
  },

  async updateTripMemoryBook(tripId, updater) {
    const current = await this.getTripMemoryBook(tripId);
    const next = typeof updater === 'function'
      ? normalizeMemoryBook(updater(current))
      : normalizeMemoryBook({ ...current, ...updater });

    return this.saveTripMemoryBook(tripId, next);
  },
};