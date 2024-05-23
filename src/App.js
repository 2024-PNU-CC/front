// App.js
import React, { useState } from 'react';
import './styles.css';

function App() {
  const [code, setCode] = useState('');
  const [compiledCode, setCompiledCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const handleCompile = () => {
    // 여기서는 간단히 입력된 코드를 그대로 컴파일했다고 가정합니다.
    // 실제로는 선택된 언어에 따라 다른 컴파일러를 사용하거나 API를 호출할 수 있습니다.
    setCompiledCode(code);
  };

  return (
    <div className="App">
      <h1>코드 컴파일러</h1>

      <div className="language_select">
        <label htmlFor="language">언어를 선택하세요</label>
        <br></br>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">(언어 선택)</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="rust">Rust</option>
          <option value="go">Go</option>
        </select>
      </div>

      <div className="code-input">
        <h2>코드 입력</h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="코드를 입력하세요"
        ></textarea>
        <button onClick={handleCompile}>컴파일</button>
      </div>
      
      <div className="compiled-output">
        <h2>컴파일 결과</h2>
        <pre>{compiledCode}</pre>
      </div>
    </div>
  );
}

export default App;
