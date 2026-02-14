import * as memoryTransactionStorage from './adapters/memoryTransactionStorage.js';
import * as memoryCategoryStorage from './adapters/memoryCategoryStorage.js';
import * as fileTransactionStorage from './adapters/fileTransactionStorage.js';
import * as fileCategoryStorage from './adapters/fileCategoryStorage.js';

const STORAGE = process.env.STORAGE || 'memory';

export const transactionStorage =
  STORAGE === 'file' ? fileTransactionStorage : memoryTransactionStorage;
export const categoryStorage =
  STORAGE === 'file' ? fileCategoryStorage : memoryCategoryStorage;
