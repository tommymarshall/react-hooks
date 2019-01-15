import React from 'react'
import './App.css'

class App extends React.Component {
  state = {
    input: '',
    todos: []
  }

  componentDidMount() {
    fetch(`https://jsonplaceholder.typicode.com/todos`)
      .then((res) => res.json())
      .then((json) => json.slice(0, 8).map(({ title }) => title))
      .then((t) => this.add(t))
  }

  setInput = (input) => this.setState({ input })

  add = (text) => {
    const { todos } = this.state
    this.setState({
      todos: [...todos, ...Array.isArray(text) ? [ ...text ] : [ text ]]
    })
  }

  remove = (index) => {
    const { todos } = this.state
    todos.splice(index, 1)
    this.setState({ todos })
  }

  render() {
    const { input, todos } = this.state

    return (
      <div className="App">
        <ul>
          {todos.map((todo, i) =>
            <li key={i}>{todo} <button onClick={() => this.remove(i)}>X</button></li>
          )}
        </ul>
        <form onSubmit={(e) => {
          e.preventDefault()
          if (!input) return

          this.add(input)
          this.setInput('')
        }}>
          <input placeholder="Add new todo..." value={input} onChange={(e) => this.setInput(e.target.value)}/>
          <button>Add</button>
        </form>
      </div>
    )
  }
}

export default App
