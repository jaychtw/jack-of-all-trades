import {readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
for(const line of (await readFile('docs/artwork/SHA256SUMS.txt','utf8')).trim().split('\n')){const [hash,path]=line.split(/\s+/);if(createHash('sha256').update(await readFile(path)).digest('hex')!==hash)throw Error('Artwork mismatch: '+path);console.log('Verified',path);}
