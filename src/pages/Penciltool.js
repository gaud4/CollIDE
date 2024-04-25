import React, { useState, useRef, useEffect } from 'react';

const Penciltool = () => {
  const [drawing, setDrawing] = useState(false);
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 });
  const contextRef = useRef(null);
  // const [canva, setCanva] = useState('');
   
  useEffect(() => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    ctx.lineCap = 'round';
    ctx.strokeStyle = 'white  ';
    ctx.lineWidth = 2;
    contextRef.current = ctx;
  }, []);

  const startDrawing = (event) => {
    setDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    setPrevPos({ x: offsetX, y: offsetY });
  };

  const finishDrawing = () => {
    setDrawing(false);
    // const json = JSON.stringify(this.points);
    // if(canva != json){
    //   setCanva(json)
    // }
  };

//   useEffect(() => {
//     console.log("Sdasdasdasd")
//     if (socketRef.current) {
//         socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
            
//             if (code !== null && code != editorRef.current.getValue() ) {
//                 console.log(roomId + code)
//                 editorRef.current.setValue(code);
//                 // socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//                 //     roomId,
//                 //     code,
//                 // });
//             }
//         });
//     }

//     return () => {
//         socketRef.current.off(ACTIONS.CODE_CHANGE);
//     };
// }, [socketRef.current]);

  const draw = (event) => {
    if (!drawing) return;
    const { offsetX, offsetY } = event.nativeEvent;

    contextRef.current.beginPath();
    contextRef.current.moveTo(prevPos.x, prevPos.y);
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    setPrevPos({ x: offsetX, y: offsetY });
  };

  return (
    <canvas
      id='canvas'
      width={window.innerWidth}
      height={window.innerHeight*0.9}
      onMouseDown={startDrawing}
      onMouseUp={finishDrawing}
      onMouseMove={draw}
    >
      Canvas
    </canvas>
  );
};

export default Penciltool;
