import React, { useState, useEffect } from 'react';
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

const App = () => {
  const [input, setInput] = useState('Add new todo!')
  const [isLoading, setLoading] = useState(true)
  const [todos, { add, remove }] = useTodos([])

  const getTodos = async (add) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos`)
      const json = await res.json()
      add(json.slice(0, 8).map(({ title }) => title));
      setLoading(false)
  };

  useEffect(() => {
    getTodos(add)
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {isLoading ? <p>Loading...</p> : (
          <ul>
            {todos.map((todo, i) => (
              <li key={todo}>{todo} <button onClick={() => remove(i)}>X</button></li>
            ))}
          </ul>
        )}
        <form onSubmit={(e) => e.preventDefault()}>
          <input value={input} onChange={(e) => setInput(e.target.value)}/>
          <button onClick={() => {
            add(input)
            setInput('')
          }}>Add</button>
        </form>
      </header>
    </div>
  );
}

export default App;
