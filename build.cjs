const fs=require('node:fs'),esbuild=require('esbuild');
const wasm=fs.readFileSync(require.resolve('@jsquash/webp/codec/dec/webp_dec.wasm')).toString('base64');
fs.writeFileSync('webp-decoder-source.mjs',`import decode,{init} from '@jsquash/webp/decode.js';
const wasm=Buffer.from('${wasm}','base64');
let ready;
export default async function(bytes){
 if(!ready)ready=WebAssembly.compile(wasm).then(module=>init(module));
 await ready;return decode(bytes);
}`);
esbuild.buildSync({entryPoints:['webp-decoder-source.mjs'],bundle:true,platform:'node',format:'cjs',target:'node20',outfile:'webp-decoder.js',logLevel:'error'});
// The lazy WebP module is bundled separately with its WASM embedded, no filesystem/network loading.
esbuild.buildSync({entryPoints:['image-pipeline-source.cjs'],bundle:true,platform:'node',format:'cjs',target:'node20',external:['./webp-decoder.js'],outfile:'image-pipeline.js',logLevel:'error'});
