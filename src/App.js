import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import Login from './components/Login'
import FileCreate from './components/Home'
import FileOutput from './components/HomeOutput'
import Signup from './components/Signup'
import './App.css'
import { Toaster } from 'react-hot-toast';
import { RecoilRoot } from 'recoil';
import Penciltool from './pages/Penciltool'
import {NextUIProvider} from "@nextui-org/react";
import WhiteBoard from './pages/WhiteBoard';

const App = () => {
  return (
    <NextUIProvider>
      <main className="dark text-foreground bg-background">
      <div>
        <Toaster 
          position='top-right'
          toastOptions={{
            success: {
              theme: {
                primary: '#4aed88', 
              },
            },
          }} >
        </Toaster>
      </div>

      <BrowserRouter>
                <RecoilRoot>
                    <Routes>
                        <Route path="/" element={<Login />}></Route>
                        <Route path="/signup" element={<Signup />}></Route>
                        <Route path="/home" element={<Home />}></Route>
                        <Route path="/filecreate" element={<FileCreate />}></Route>
                        <Route path="/fileoutput" element={<FileOutput />}></Route>
                        <Route
                            path="/editor/:roomId"
                            element={<EditorPage />}
                        ></Route>
                        <Route path="/whiteboard/:roomId" element={<WhiteBoard/>}></Route>
                    </Routes>
                </RecoilRoot>
      </BrowserRouter>

      </main>
    </NextUIProvider>
    // <Penciltool/>
  );
}

export default App;






// import React from 'react'
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import EditorPage from './pages/EditorPage';
// import './App.css'
// import { Toaster } from 'react-hot-toast';
// import { RecoilRoot } from 'recoil';
// import Penciltool from './pages/Penciltool'
// import {NextUIProvider} from "@nextui-org/react";
// import WhiteBoard from './pages/WhiteBoard';

// const App = () => {
//   return (
//     <NextUIProvider>
//       <main className="dark text-foreground bg-background">
//       <div>
//         <Toaster 
//           position='top-right'
//           toastOptions={{
//             success: {
//               theme: {
//                 primary: '#4aed88', 
//               },
//             },
//           }} >
//         </Toaster>
//       </div>

//       <BrowserRouter>
//                 <RecoilRoot>
//                     <Routes>
//                         <Route path="/" element={<Home />}></Route>
//                         <Route
//                             path="/editor/:roomId"
//                             element={<EditorPage />}
//                         ></Route>
//                         <Route path="/whiteboard/:roomId" element={<WhiteBoard/>}></Route>
//                     </Routes>
//                 </RecoilRoot>
//       </BrowserRouter>

//       </main>
//     </NextUIProvider>
//     // <Penciltool/>
//   );
// }

// export default App;















// import './App.css'
// import Home from "./components/Home"
// import HomeOutput from "./components/HomeOutput"
// import Login from "./components/Login"
// import Signup from "./components/Signup"
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { useState } from 'react';

// function App() {
//   return (
//     <div className="App">
//       <Router>
//         <Routes>
//           <Route path="/" element={<Login/>}/>
//           <Route path="/signup" element={<Signup/>}/>
//           <Route path="/home" element={<Home/>}/>
//           <Route path="/HomeOutput" element={<HomeOutput/>}/>
//         </Routes>
//       </Router>
//     </div>
//   );
// }

// export default App;