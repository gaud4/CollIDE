import logo from './logo.svg';
import './App.css';
import Navbar from './components/navbar';
import Input from './components/input';
import Output from './components/output';
import TextEditor from './components/texteditor';
function App() {
  return (
    <div className="App">
     <Navbar/> 
     {/* <Navbar/> */}
     <div className="editor_io">
      <TextEditor/>
      <div className="IO">
        <Input></Input>
        <Output></Output>
      </div>
     </div>
    </div>
  );
}

export default App;
