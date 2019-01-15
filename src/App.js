import React, { useState, useEffect } from 'react';
import './App.css';

const useTodos = (initialState) => {
  const [todos, setTodos] = useState(initialState);

  const add = (text) => {
    setTodos([...todos, ...Array.isArray(text) ? [ ...text ] : [ { text, complete: false } ]]);
  }

  const remove = (index) => {
    todos.splice(index, 1)
    setTodos(todos);
  }

  const toggleComplete = (index) => {
    todos[index].completed = !todos[index].completed;
    setTodos(todos);
  }

  return [
    todos,
    { add, remove, toggleComplete }
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

const App = () => {
  const [input, setInput] = useState('')
  const [todos, { add, remove, toggleComplete }] = useTodos([])
  const {loading, data, error} = useFetch(`https://jsonplaceholder.typicode.com/todos`);

  useEffect(() => {
    if (loading) return;

    add(data.slice(0, 8).map(({ title, completed }) => ({ completed, text: title })));
  }, [loading])

  return (
    <div className="App">
      {loading ? <p>Loading...</p> : error ? <p>Error: <pre>{error.stack}</pre></p> : (
        <ul>
          {todos.map(({ completed, text }, i) => (
            <li key={i} className={completed ? 'completed' : ''}>
              {text}
              <button onClick={() => toggleComplete(i)}>{completed ? 'Uncomplete' : 'Complete'}</button>
              <button onClick={() => remove(i)}>X</button>
            </li>
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
    </div>
  );
}

export default App;
