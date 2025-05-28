import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [todo, setTodo] = useState([
    {
      id: Number(new Date()),
      content: "안녕하세요",
    },
  ]);
  return (
    <>
      <Clock />
      <StopWatch />
      <TodoInput setTodo={setTodo} />
      <TodoList todo={todo} setTodo={setTodo} />
    </>
  );
}

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return <div>{time.toLocaleTimeString()}</div>;
};

const formatTime = (seconds) => {
  const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");

  return `${hours} : ${minutes} : ${remainingSeconds}`;
};

const StopWatch = () => {
  const [time, setTime] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isOn]);

  return (
    <div>
      {formatTime(time)}
      <button onClick={() => setIsOn((prev) => !prev)}>
        {isOn ? "끄기" : "켜기"}
      </button>
      <button
        onClick={() => {
          clearInterval(timerRef.current);
          setTime(0);
          setIsOn(false);
        }}
      >
        리셋
      </button>
    </div>
  );
};

const RandomQuote = () => {
  // 명언들을 담을 배열 (나중에 API 같은 걸로 가져와도 좋아!)
  const quotes = [
    {
      text: "성공은 최종적인 것이 아니며, 실패는 치명적인 것이 아니다. 중요한 것은 계속하려는 용기이다.",
      author: "윈스턴 처칠",
    },
    { text: "우리가 무슨 생각을 하느냐가 우리가 되는 것이다.", author: "부처" },
    {
      text: "위대한 일을 하는 유일한 방법은 당신이 하는 일을 사랑하는 것이다.",
      author: "스티브 잡스",
    },
    {
      text: "미래는 현재 우리가 무엇을 하느냐에 달려 있다.",
      author: "마하트마 간디",
    },
    {
      text: "인생은 자전거를 타는 것과 같다. 균형을 잡으려면 계속 움직여야 한다.",
      author: "알베르트 아인슈타인",
    },
  ];

  // 현재 화면에 보여줄 랜덤 명언 상태
  const [randomQuote, setRandomQuote] = useState({ text: "", author: "" });

  // 컴포넌트가 처음 마운트될 때 (화면에 처음 나타날 때) 랜덤 명언 하나를 뽑아오자!
  useEffect(() => {
    selectRandomQuote(); // 함수 호출!
  }, []); // 빈 배열을 넣어주면 마운트될 때 딱 한 번만 실행돼.

  // 랜덤 명언을 선택하는 함수
  const selectRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length); // 명언 배열 길이만큼 랜덤 인덱스 생성
    setRandomQuote(quotes[randomIndex]); // 해당 인덱스의 명언으로 상태 업데이트!
  };

  return (
    <div
      style={{
        margin: "20px",
        padding: "15px",
        border: "1px solid #eee",
        borderRadius: "8px",
        maxWidth: "400px",
      }}
    >
      {" "}
      {/* 예쁘게 보이도록 간단한 스타일 추가 */}
      <h3>오늘의 명언 ✨</h3>
      <p style={{ fontStyle: "italic" }}>"{randomQuote.text}"</p>{" "}
      {/* 명언 내용 */}
      <p style={{ textAlign: "right", fontWeight: "bold" }}>
        - {randomQuote.author}
      </p>{" "}
      {/* 작가 이름 */}
      <button onClick={selectRandomQuote} style={{ marginTop: "10px" }}>
        다른 명언 보기
      </button>{" "}
      {/* 버튼 클릭 시 다른 명언 가져오기 */}
    </div>
  );
};

const Timer = () => {
  const [startTime, setStartTime] = useState(0);

  return (
    <div>
      <div>설정 시간: {formatTime(startTime)}</div>
      <input
        type="range"
        value={startTime}
        max="3600"
        onChange={(event) => setStartTime(Number(event.target.value))}
      />
    </div>
  );
};

const TodoInput = ({ setTodo }) => {
  const inputRef = useRef(null);

  const addTodo = () => {
    if (inputRef.current.value.trim() === "") {
      alert("할 일을 입력해주세요!");
      return;
    }

    const newTodo = {
      id: Number(new Date()),
      content: inputRef.current.value.trim(),
      isCompleted: false,
      isEditing: false,
    };
    setTodo((prev) => [...prev, newTodo]);
    inputRef.current.value = "";
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addTodo();
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        onKeyPress={handleKeyPress}
        placeholder="새 할 일을 입력하세요"
      />
      <button onClick={addTodo}>추가</button>
    </div>
  );
};

const TodoList = ({ todo, setTodo }) => {
  return (
    <ul>
      {todo.map((el) => (
        <Todo key={el.id} todo={el} setTodo={setTodo} />
      ))}
    </ul>
  );
};

const Todo = ({ todo, setTodo }) => {
  const [editText, setEditText] = useState(todo.content);
  const deleteTodo = () => {
    setTodo((prev) => prev.filter((el) => el.id !== todo.id));
  };

  const toggleComplete = () => {
    setTodo((prev) =>
      prev.map((el) =>
        el.id === todo.id ? { ...el, isCompleted: !el.isCompleted } : el
      )
    );
  };

  const toggleEditMode = () => {
    setTodo((prev) =>
      prev.map((el) =>
        el.id === todo.id ? { ...el, isEditing: !el.isEditing } : el
      )
    );
    if (!todo.isEditing) {
      setEditText(todo.content);
    }
  };

  const saveEdit = () => {
    if (editText.trim() === "") {
      alert("할 일을 입력해주세요!");
      return;
    }
    setTodo((prev) =>
      prev.map((el) =>
        el.id === todo.id
          ? { ...el, content: editText.trim(), isEditing: false }
          : el
      )
    );
  };

  const handleEditKeyPress = (event) => {
    if (event.key === "Enter") {
      saveEdit();
    }
  };

  return (
    <li
      key={todo.id}
      style={{ textDecoration: todo.isCompleted ? "line-through" : "none" }}
    >
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={toggleComplete}
      />
      {todo.isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={handleEditKeyPress}
          />
          <button onClick={saveEdit}>저장</button>
        </>
      ) : (
        <>
          <span>{todo.content}</span>
          <button onClick={toggleEditMode}>수정</button>
          <button onClick={deleteTodo}>삭제</button>
        </>
      )}
    </li>
  );
};

export default App;
