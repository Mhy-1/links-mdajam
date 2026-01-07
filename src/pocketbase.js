import PocketBase from 'pocketbase';
import { config } from './config';

const pb = new PocketBase(config.pocketbaseUrl);

// Helper for file URLs
export const getFileUrl = (record, filename) =>
  filename ? pb.files.getURL(record, filename) : '';

export { pb };
export default pb;
