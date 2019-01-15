import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const useTodos = (initialState) => {
  const [todos, setTodos] = useState(initialState);

  const add = (text) => {
    setTodos([...todos, ...Array.isArray(text) ? [ ...text ] : [ text ]]);
  }

  const remove = (index) => {
    todos.splice(index, 1)
    setTodos(todos);
  }

  return [
    todos,
    { add, remove }
  ]
};

const defaultOpts = {};
const useFetch = (input, opts = defaultOpts) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const {
    readBody = body => body.json(),
    ...init
  } = opts;

  const request = async () => {
    setLoading(true);
    try {
      const response = await fetch(input, init);
      if (response.ok) {
        const body = await readBody(response);
        setData(body);
      } else {
        setError(new Error("Bad URL probs"));
      }
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    request();
  }, [input, opts]);
  return { error, loading, data };
};

const useModuleTimer = () => {
  // window.__START_TIME__
  const start = useRef(new Date());
  const [finished, setFinished] = useState()

  const markCompleted = () => {
    setFinished(new Date());
  };

  return [
    finished ? finished - start.current : false,
    markCompleted
  ]
}

const App = () => {
  const [input, setInput] = useState('')
  const [todos, { add, remove }] = useTodos([])
  const {loading, data, error} = useFetch(`https://jsonplaceholder.typicode.com/todos`);
  const [elapsedTime, markCompleted] = useModuleTimer();

  useEffect(() => {
    if (loading || error) return;

    add(data.slice(0, 8).map(({ title }) => title));
    markCompleted();
  }, [loading, error])

  return (
    <div className="App">
      {loading ? <p>Loading...</p> : error ? <p>Error: {error.message}</p> : (
        <ul>
          {todos.map((todo, i) => (
            <li key={i}>{todo} <button onClick={() => remove(i)}>X</button></li>
          ))}
        </ul>
      )}
      <form onSubmit={(e) => {
          e.preventDefault()
          if (!input) return;

          add(input);
          setInput('');
        }}>
        <input placeholder="Add todo..." value={input} onChange={(e) => setInput(e.target.value)}/>
        <button>Add</button>
      </form>
      {elapsedTime && <p>{elapsedTime}ms</p>}
    </div>
  );
}

export default App;
