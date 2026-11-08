// Run from /workspace/possibility after npm ci. Uses that portal's existing pinned sharp.
import {createRequire} from 'node:module';
const require=createRequire(process.cwd()+'/package.json');const sharp=require('sharp');
await sharp(process.argv[2]).webp({lossless:true,effort:6}).toFile(process.argv[3]);
