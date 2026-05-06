"use client";
// React + Canvas + Sound + Gesture Version (Final Boss Mode)

import React, { useEffect, useRef, useState } from "react";

const players = ["P1","P2","P3","P4"];

export default function NotebookGame(){ const canvasRef = useRef(null); const [scores,setScores] = useState([[],[],[],[]]); const [round,setRound] = useState(0); const [winner,setWinner] = useState(null);

// 🎵 sound const playSound = ()=>{ const ctx = new (window.AudioContext||window.webkitAudioContext)(); const osc = ctx.createOscillator(); osc.type='triangle'; osc.frequency.value=600; osc.connect(ctx.destination); osc.start(); setTimeout(()=>osc.stop(),80); }

// ✏️ canvas handwriting const drawScore = (ctx,x,y,text)=>{ ctx.font="18px Caveat"; ctx.fillStyle="#222"; for(let i=0;i<text.length;i++){ setTimeout(()=>{ ctx.fillText(text[i],x+i*10,y + Math.random()2); }, i60); } }

const renderCanvas = ()=>{ const canvas = canvasRef.current; const ctx = canvas.getContext("2d");

ctx.clearRect(0,0,canvas.width,canvas.height);

// notebook lines
for(let i=40;i<canvas.height;i+=30){
  ctx.strokeStyle="rgba(0,0,255,0.15)";
  ctx.beginPath();
  ctx.moveTo(0,i+Math.random());
  ctx.lineTo(canvas.width,i+Math.random());
  ctx.stroke();
}

// draw players + scores
players.forEach((p,i)=>{
  let x = 30 + i*80;
  ctx.fillText(p,x,20);

  scores[i].forEach((s,idx)=>{
    drawScore(ctx,x,50+idx*30,String(s));
  });
});

}

useEffect(()=>{ renderCanvas(); },[scores]);

// 🃏 physics cards const [cards,setCards]=useState([]);

const spawnCards=()=>{ let newCards = Array.from({length:4}).map(()=>({ x:Math.random()*300, y:-50, vx:(Math.random()-0.5)*2, vy:2+Math.random()*2, rot:Math.random()*360 })); setCards(newCards); }

useEffect(()=>{ const interval = setInterval(()=>{ setCards(prev=>prev.map(c=>({ ...c, x:c.x + c.vx, y:c.y + c.vy, vy:c.vy + 0.2 // gravity }))); },16); return ()=>clearInterval(interval); },[]);

// 👉 gesture (swipe) const handleSwipe = (e)=>{ if(e.touches){ nextRound(); } }

const nextRound = ()=>{ playSound(); setRound(r=>r+1);

setScores(prev=> prev.map(arr=>[
  ...arr,
  Math.floor(Math.random()*50+10)
]));

spawnCards();

if(round===5){
  const totals = scores.map(a=>a.reduce((x,y)=>x+y,0));
  const max = Math.max(...totals);
  setWinner(players[totals.indexOf(max)]);
}

}

return ( <div onTouchStart={handleSwipe} style={{padding:20,background:'#f4efe6',height:'100vh'}}> <canvas ref={canvasRef} width={360} height={500} style={{background:'#fdfaf3',borderRadius:10}}/>

{/* cards */}
  {cards.map((c,i)=>(
    <div key={i} style={{
      position:'absolute',
      width:60,height:80,
      background:'#fff',
      left:c.x,top:c.y,
      transform:`rotate(${c.rot}deg)`,
      boxShadow:'2px 3px 8px rgba(0,0,0,0.3)',
      clipPath:'polygon(6% 0, 100% 3%, 94% 100%, 0 96%)'
    }}/>
  ))}

  <button onClick={nextRound} style={{marginTop:20,width:'100%'}}>Next Round</button>

  {winner && (
    <h2 style={{textAlign:'center'}}>🏆 {winner} wins</h2>
  )}
</div>

); }
