import { useState, useEffect } from 'react'
import serverdata from "./server.jsx"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [name, setName] = useState('')
  const [update, setUpdate] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorcolour, setErrorColour] = useState('green')
  const namesToShow = persons.filter(person => person.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()))
  
  const hook = () => {
  console.log('yoghurt effect')
  serverdata
    .getAll()
    .then(response => {
      setPersons(response)
    })
    setUpdate(false)
  } 
  useEffect(hook, [update])

  const Deletetion = (name) =>{
    if(window.confirm("Delete " + name + " ?")){
      serverdata
      .deleteperson(name)
      setUpdate(true)
      console.log(update)
      setErrorMessage(
          `${name} was deleted`
      )
      setErrorColour(
          `green`
      )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
  }
  
  const Add = (event) =>{
    event.preventDefault()
    const person = {
    name: newName,
    number: newNumber
    }
    for(let i = 0; i< persons.length; ++i){
      if(persons[i].name.toLowerCase() == newName.toLowerCase() ){
        if(window.confirm(name + " is already added to phonebook, replace the old number with a new one?")){
          serverdata
            .update(newName, person)
            .catch(error => {
              setErrorMessage(
                 `${newName} has already been deleted from server`
              )
              setErrorColour(
                `red`
              )
              setTimeout(() => {
                  setErrorMessage(null)
              }, 5000)
            })
          setUpdate(true)
          setNewName("")
          setNewNumber("")
          return;
        }else {
        return;
       }
      }
    }
    serverdata
      .create(person)
      .then(response => {
      setPersons(persons.concat(response))
      setNewName("")
      setNewNumber("")
    })
    setErrorMessage(
          `${person.name} was added`
      )
      setErrorColour(
          `green`
      )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
  }

  const Handlenameinput = (event) => {
    setNewName(event.target.value)
  }

  const Handlenumberinput = (event) => {
    setNewNumber(event.target.value)
  }

  const Handlefilterinput = (event) => {
    setName(event.target.value)
    
  }
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} color={errorcolour} />
      <Filter filtervalue={name} filterinput={Handlefilterinput}/>
      <h2>add a new</h2>
      <Form namevalue={newName} namechange={Handlenameinput} 
        numbervalue={newNumber} numberchange={Handlenumberinput}
        onclick={Add}/>
      <h2>Numbers</h2>
      <div>
        <ul>
          {namesToShow.map(person => 
            <Show key={person.name} number={person.number} name={person.name} onClick={() => Deletetion(person.name)}/>
          )}
        </ul>
      </div>
    </div>
  )

}
  
const Filter = (props) =>{
  return(
    <>
    filter shown with: <input value={props.filtervalue} onChange={props.filterinput}></input>
    </>
  )
}

const Form = (props) => {
  return(
    <form>
        <div>
          name: <input value={props.namevalue} onChange={props.namechange}/>
        </div>
        <div>
          number: <input value={props.numbervalue} onChange={props.numberchange}/>
        </div>
        <div>
          <button type="submit" onClick={props.onclick}>add</button>
        </div>
      </form>
  )
}

const Show = (props) => {
  return (
    <li>
      {props.name} {props.number} <button onClick={props.onClick} >Delete</button>
    </li>
  )
}

const Notification = ({ message, color } ) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error" style={{color: color}}>
      {message}
    </div>
  )
}

export default App

