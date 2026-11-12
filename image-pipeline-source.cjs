'use strict';
const {Jimp,ResizeStrategy}=require('jimp');
const meta=require('./image-meta.js');
const MAX_PIXELS=64*1024*1024;
async function prepareImage(bytes,options={}) {
 const data=Buffer.from(bytes), info=meta.probeImage(data);
 if(!info?.width||!info?.height)throw new Error('Image dimensions could not be verified; use PNG, JPEG, GIF or WebP.');
 if(info.width*info.height>MAX_PIXELS)throw new Error('Image exceeds 64 megapixels. Export a smaller preview or crop before reading.');
 const detail=options.detail||'auto';if(!['auto','high'].includes(detail))throw new Error('detail must be auto or high');
 const edge=detail==='high'?4096:2048,budget=detail==='high'?1024*1024:512*1024;
 const crop=options.crop;
 if(crop && (!['x','y','width','height'].every(k=>Number.isSafeInteger(crop[k]))||crop.x<0||crop.y<0||crop.width<1||crop.height<1||crop.x+crop.width>info.width||crop.y+crop.height>info.height))throw new Error('crop must be a positive rectangle within original image pixel coordinates.');
 if(!crop&&info.mimeType!=='image/gif'&&data.length<=budget&&Math.max(info.width,info.height)<=edge)return {data,mimeType:info.mimeType,width:info.width,height:info.height,original:info,changed:false,detail};
 let img;
 if(info.mimeType==='image/webp'){
  const decode=require('./webp-decoder.js').default;const bitmap=await decode(data);img=Jimp.fromBitmap(bitmap);
 }else img=await Jimp.fromBuffer(data);
 if(crop)img.crop({x:crop.x,y:crop.y,w:crop.width,h:crop.height});
 const scale=Math.min(1,edge/Math.max(img.bitmap.width,img.bitmap.height));
 if(scale<1)img.resize({w:Math.max(1,Math.round(img.bitmap.width*scale)),h:Math.max(1,Math.round(img.bitmap.height*scale)),mode:ResizeStrategy.BICUBIC});
 let out=await img.getBuffer('image/png');let mimeType='image/png';
 if(out.length>budget){
  // Flatten transparency only in the JPEG derivative; the source is never changed.
  img=new Jimp({width:img.bitmap.width,height:img.bitmap.height,color:0xffffffff}).composite(img,0,0);
  mimeType='image/jpeg';
  for(let pass=0;pass<10;pass++){
   out=await img.getBuffer('image/jpeg',{quality:pass===0?88:pass===1?78:68});
   if(out.length<=budget)break;
   if(pass>=2)img.resize({w:Math.max(1,Math.round(img.bitmap.width*.8)),h:Math.max(1,Math.round(img.bitmap.height*.8)),mode:ResizeStrategy.BICUBIC});
  }
 }
 if(out.length>budget)throw new Error('Unable to prepare an image within the byte budget; request a smaller crop.');
 return {data:out,mimeType,width:img.bitmap.width,height:img.bitmap.height,original:info,changed:true,crop,detail,firstFrame:info.mimeType==='image/gif'};
}
module.exports={prepareImage};
