// Present the actual depth-rasterized rig pixels; no substitute Canvas body drawing.
const images=new WeakMap();
export function drawRig(ctx,pixels,pose,x,y,scale=1,flip=false){
 let image=images.get(pixels);
 if(!image){const width=pixels.x1-pixels.x0+1,height=pixels.y1-pixels.y0+1;
  const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
  const data=new ImageData(width,height);
  for(let i=0;i<pixels.n;i++){const j=((pixels.ys[i]-pixels.y0)*width+pixels.xs[i]-pixels.x0)*4,c=pixels.color[i];data.data[j]=c&255;data.data[j+1]=(c>>>8)&255;data.data[j+2]=(c>>>16)&255;data.data[j+3]=c>>>24;}
  canvas.getContext('2d').putImageData(data,0,0);image=canvas;images.set(pixels,image);
 }
 ctx.save();ctx.imageSmoothingEnabled=false;ctx.translate(Math.round(x),Math.round(y));ctx.scale(flip?-scale:scale,scale);
 ctx.drawImage(image,pixels.x0+(pose.x??0),pixels.y0+(pose.y??0));ctx.restore();
}
