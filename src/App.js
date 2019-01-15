import React, { useState, useEffect } from 'react';
import './App.css';

const usePersistentStorage = () => {
  const [message, setMessage] = useState(false);

  const save = (payload) => {
    setTimeout(() => {
      setMessage(`Successfully saved ${payload} to a database.`);
    }, 1000);
  };

  return [
    message,
    save
  ];
};

const useTodos = (initialState) => {
  const [todos, setTodos] = useState(initialState);

  const add = (text) => {
    if (!text) return;
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
        setError(new Error(response.statusText));
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
  const [todos, { add, remove }] = useTodos([])
  const {loading, data, error} = useFetch(`https://jsonplaceholder.typicode.com/todos`);
  const [message, save] = usePersistentStorage(false);

  useEffect(() => {
    if (!message) return;
    alert(message);
  }, [message])

  useEffect(() => {
    if (loading || error) return;

    add(data.slice(0, 8).map(({ title }) => title));
  }, [loading, error])

  return (
    <div className="App">
      {loading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : (
        <ul>
          {todos.map((todo, i) => (
            <li key={todo}>{todo} <button onClick={() => remove(i)}>X</button></li>
          ))}
        </ul>
      )}
      <form onSubmit={(e) => {
        e.preventDefault()
        if (!input) return;

        add(input)
        save(input)
        setInput('')
      }}>
        <input placeholder="Add todo..." value={input} onChange={(e) => setInput(e.target.value)}/>
        <button>Add</button>
      </form>
    </div>
  );
}

export default App;

