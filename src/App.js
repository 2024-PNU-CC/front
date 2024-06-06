import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { v4 as uuidv4 } from 'uuid';
import './styles.css';

function App() {
  const [code, setCode] = useState('');
  const [compiledCode, setCompiledCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [requestId, setRequestId] = useState(null);
  const [resetFlag] = useState(null);

  const handleCompile = async (e) => {
    e.preventDefault();

    const uniqueId = uuidv4();
    setRequestId(uniqueId);  // 요청 ID 설정

    try {
      const response = await fetch('//cc.fiene.dev/api/my-endpoint/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: uniqueId,
          language: selectedLanguage,
          code: code
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setCompiledCode('Compiling...');
    } catch (error) {
      console.error('Error during compilation:', error);
      setCompiledCode('Error during compilation');
    }
  };

  useEffect(() => {
    const checkResult = async (uniqueId) => {
      try {
        const response = await fetch(`//cc.fiene.dev/api/result/${uniqueId}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.result) {
          setCompiledCode(data.result);
          return true; // 결과를 찾으면 true 반환
        } else {
          setCompiledCode('Result not ready yet, retrying...');
          return false; // 결과를 찾지 못하면 false 반환
        }
      } catch (error) {
        console.error('Error fetching result:', error);
        setCompiledCode('Error fetching result');
        return false; // 오류 발생 시 false 반환
      }
    };

    let interval;
    if (requestId) {
      interval = setInterval(async () => {
        const resultFound = await checkResult(requestId);
        if (resultFound) {
          clearInterval(interval); // 결과를 찾으면 반복 중지
        }
      }, 2000); // 2초마다 결과 체크
    }

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [requestId]);

  const handleReset = () => {
    if(resetFlag){
      clearInterval(resetFlag);
    }
    setRequestId(null); // 요청 ID 초기화
    setCode('// 코드를 입력하세요 //');
    setCompiledCode('');
    setSelectedLanguage('');
    setSelectedTheme('');
  }
  
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
                minimap: { enabled: false },
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto'
                }
              }}
              loading="잠시만 기다려주세요..."
              defaultValue="// 코드를 입력하세요 //"
            />
          </div>

          <button id="btn_submit" type="submit">컴파일</button>
          <button id="btn_reset" type="reset" onClick={handleReset}>초기화</button>

        </form>

        <div className="code_output">
          <label>컴파일 결과</label>
          {compiledCode && <pre>{compiledCode}</pre>}
        </div>
      </div>
    </div>
  );
}

export default App;