import React, { Component, useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';

const useTodos = (initialState) => {
  const [todos, setTodos] = useState(initialState);

  const add = (text) => {
    setTodos([...todos, text]);
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
  const [todos, { add, remove }] = useTodos(['Wash the car'])

  return (
    <div className="App">
      <header className="App-header">
        <ul>
          {todos.map((todo, i) => (
            <li>{todo} <button onClick={() => remove(i)}>X</button></li>
          ))}
        </ul>
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
