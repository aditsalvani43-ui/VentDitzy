function BratVortexGenerator() {
  const [text, setText] = React.useState("");
  const [selectedEmojis, setSelectedEmojis] = React.useState([]);
  const [fontSize, setFontSize] = React.useState(120);
  const previewRef = React.useRef(null);

  const EMOJIS = ["🤭","😂","😍","🤩","😊","😜","😹","🐶","🌸","⭐"];

  function toggleEmoji(e) {
    setSelectedEmojis(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e]);
  }

  function generateCanvasImage() {
    const width = 1200, height = 1200;
    const c = document.createElement("canvas");
    c.width = width; c.height = height;
    const ctx = c.getContext("2d");

    const g = ctx.createLinearGradient(0,0,0,height);
    g.addColorStop(0,"#e6f7ff");
    g.addColorStop(1,"#ffffff");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,width,height);

    const pad = 60, cardW = width - pad*2, cardH = height - pad*2;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    roundRect(ctx,pad,pad,cardW,cardH,32,true,false);
    ctx.strokeStyle = "rgba(0,150,255,0.18)";
    ctx.lineWidth = 6;
    roundRect(ctx,pad+6,pad+6,cardW-12,cardH-12,28,false,true);

    ctx.fillStyle = "#000";
    ctx.textBaseline = "top";
    const lines = wrapText(ctx, text || " ", cardW-140, fontSize, `bold ${fontSize}px system-ui, 'Segoe UI Emoji'`);
    let y = pad+80;
    ctx.font = `bold ${fontSize}px system-ui, 'Segoe UI Emoji'`;
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 6;
    lines.forEach(line => { ctx.fillText(line, pad+60, y); y += fontSize*0.95; });

    const emojiY = pad + cardH - 140, startX = pad+60, gap=90;
    ctx.font = `96px system-ui, 'Segoe UI Emoji'`; ctx.shadowBlur=0;
    selectedEmojis.forEach((em,i)=>ctx.fillText(em,startX+i*gap,emojiY));

    return c;
  }

  function roundRect(ctx,x,y,w,h,r,fill,stroke) {
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
    if(fill) ctx.fill(); if(stroke) ctx.stroke();
  }

  function wrapText(ctx,text,maxWidth,fontSize,fontSpec) {
    if(fontSpec) ctx.font=fontSpec;
    const words=text.split(/\\s+/), lines=[]; let current=\"\";
    words.forEach(word=>{const test=current?current+\" \"+word:word;
      const metrics=ctx.measureText(test);
      if(metrics.width>maxWidth&&current){lines.push(current);current=word;}else{current=test;}});
    if(current) lines.push(current); return lines;
  }

  function onGenerate() {
    const canvas = generateCanvasImage();
    const url = canvas.toDataURL("image/png");
    if(previewRef.current){
      previewRef.current.style.backgroundImage = `url(${url})`;
      previewRef.current.style.backgroundSize = "contain";
      previewRef.current.style.backgroundRepeat = "no-repeat";
      previewRef.current.style.backgroundPosition = "center";
    }
  }

  function onDownload() {
    const canvas = generateCanvasImage();
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "brat-message.png";
    link.click();
  }

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <div className="max-w-md w-full rounded-3xl shadow-2xl p-8 bg-white">
        <h1 className="text-4xl font-extrabold text-sky-500 mb-2">Brat Vortex</h1>
        <p className="text-sky-400 mb-6">Buat pesan brat dengan gaya yang unik dan menarik</p>

        <label className="block text-sky-500 font-semibold mb-2">Masukkan Teks:</label>
        <textarea
          className="w-full border-2 border-sky-200 rounded-lg p-4 h-36 resize-none"
          placeholder="Ketik pesan brat kamu di sini..."
          maxLength={500}
          value={text}
          onChange={e=>setText(e.target.value)}
        />
        <div className="text-right text-sm text-sky-300 mt-1">{text.length}/500 karakter</div>

        <div className="mt-6">
          <div className="text-sky-500 font-semibold mb-2">Tambahkan Emoji:</div>
          <div className="grid grid-cols-5 gap-3">
            {EMOJIS.map(em=>(
              <button key={em} onClick={()=>toggleEmoji(em)}
                className={`p-3 rounded-xl shadow-inner border-2 ${selectedEmojis.includes(em) ? 'ring-4 ring-sky-200' : 'bg-sky-50'}`}>
                <span style={{fontSize:28}}>{em}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={onGenerate} className="flex-1 py-3 bg-gradient-to-r from-sky-400 to-sky-500 text-white rounded-xl shadow-lg font-semibold">
            Generate Brat Message
          </button>
          <button onClick={onDownload} className="px-4 py-3 bg-white border-2 border-sky-200 rounded-xl shadow-sm text-sky-500 font-semibold">
            Download Gambar
          </button>
        </div>

        <div className="mt-8">
          <div className="text-sky-500 font-semibold mb-3">Hasil Gambar</div>
          <div ref={previewRef} className="w-full h-72 rounded-lg border-4 border-dashed border-sky-200 bg-white flex items-center justify-center">
            {!text && selectedEmojis.length===0 && <div className="text-sky-200">Preview akan muncul di sini</div>}
          </div>
        </div>

        <footer className="mt-6 text-center text-sky-300 text-sm">© 2025 Brat Message Generator | Dibuat oleh Iky Vortex</footer>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<BratVortexGenerator />);
