import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import Login from "./components/Login";
import FileCreate from "./components/Home";
import FileOutput from "./components/HomeOutput";
import Signup from "./components/Signup";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";
import Penciltool from "./pages/Penciltool";
import { NextUIProvider } from "@nextui-org/react";
import WhiteBoard from "./pages/WhiteBoard";
import { AuthProvider } from "./context/AuthContext"; // Correct import

const App = () => {
  return (
    <NextUIProvider>
      <main className="dark text-foreground bg-background">
        <div>
          <Toaster
            position="top-right"
            toastOptions={{
              success: {
                theme: {
                  primary: "#4aed88",
                },
              },
            }}
          />
        </div>

        <BrowserRouter>
          <RecoilRoot>
            <AuthProvider>
              {" "}
              {/* Wrap your entire app with AuthProvider */}
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<Home />} />
                <Route path="/filecreate" element={<FileCreate />} />
                <Route path="/fileoutput" element={<FileOutput />} />
                <Route path="/editor/:roomId" element={<EditorPage />} />
                <Route path="/whiteboard/:roomId" element={<WhiteBoard />} />
              </Routes>
            </AuthProvider>
          </RecoilRoot>
        </BrowserRouter>
      </main>
    </NextUIProvider>
  );
};

export default App;
