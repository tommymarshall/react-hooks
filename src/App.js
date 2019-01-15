import React, { useState, useEffect } from 'react';
import './App.css';

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

const App = () => {
  const [input, setInput] = useState('')
  const [todos, { add, remove }] = useTodos([])

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/todos`)
      .then((res) => res.json())
      .then((json) => json.slice(0, 8).map(({ title }) => title))
      .then((t) => add(t));
  }, [])

  return (
    <div className="App">
      <ul>
        {todos.map((todo, i) => (
          <li key={i}>{todo} <button onClick={() => remove(i)}>X</button></li>
        ))}
      </ul>
      <form onSubmit={(e) => {
        e.preventDefault()
        if (!input) return;

        add(input);
        setInput('');
      }>
        <input placeholder="Add new todo..." value={input} onChange={(e) => setInput(e.target.value)}/>
        <button>Add</button>
      </form>
    </div>
  );
}

export default App;
