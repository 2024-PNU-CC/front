import React, { useState } from 'react';
import Editor from '@monaco-editor/react'
import './styles.css';

function App() {
  const [code, setCode] = useState('');
  const [compiledCode, setCompiledCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');

  const handleCompile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://cc.fiene.dev/send_code/', {
        credentials: 'include',
        method: 'POST',
        // mode: 'no-cors',
        body: JSON.stringify({
          language: selectedLanguage,
          code: code,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCompiledCode(data.compiledCode);
    } catch (error) {
      console.error('Error during compilation:', error);
      setCompiledCode('Error during compilation');
    }
  };

  return (
    <div className="App">
      <h1>코드 컴파일러</h1>

      <div id="whole">
        <form onSubmit={handleCompile} method='post'>
          <div className="form_input">
            <label htmlFor="id_language">언어를 선택하세요</label>
            <select
              id="id_language"
              name="language"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              <option value="default">(언어 선택)</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              <option value="rust">Rust</option>
              <option value="go">Go</option>
            </select>
          </div>

          <div className="form_input">
            <label htmlFor="id_theme">테마를 선택하세요</label>
            <select
              id="id_theme"
              name="theme"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
            >
              <option value="light">Light version</option>
              <option value="vs-dark">Dark version</option>
            </select>
          </div>

          <div className="form_input">
            <label>코드를 입력하세요</label>
            <Editor
              theme={selectedTheme}
              height="40vh"
              language={selectedLanguage || 'plaintext'}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                fontSize: 15,
                fontWeight: 'bold',
                minimap: {enabled: false},
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto'
                }
              }}
              loading="잠시만 기다려주세요..."
              defaultValue="// 코드를 입력하세요 //"/>
          </div>
          
          <button id="btn_submit" type="submit">컴파일</button>
          <button id="btn_reset" type="reset" onClick={() => setCode('// 코드를 입력하세요 //')}>초기화</button>

        </form>

        <div className="code_output">
          <label>컴파일 결과</label>
          <pre>{compiledCode}</pre>
        </div>
      </div>
      
    </div>
  );
}

export default App;
