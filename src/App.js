import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {

  const [repositories, setRepositories] = useState([]);
  const [title, setTitle]= useState('');
  const [url, setUrl]= useState('');
  const [techs, setTechs]= useState('');

  useEffect(() => {
    api.get('repositories').then(response => {
      // console.log(response);
      setRepositories(response.data);
    });
  },[]);

  async function handleAddRepository() {
    let listTechs = techs.split(',');
    listTechs = listTechs.map(tech => tech.trim());

    const response = await api.post('repositories', {
      title, url, techs: listTechs
    });

    setRepositories([...repositories, response.data]);
    // document.location.reload();
  }

  async function handleRemoveRepository(id) {
    // console.log(id);
    api.delete(`repositories/${id}`);
    
    // const repoIndex = repositories.findIndex( repository => repository.id === id );
    // const listRepositories = repositories.splice(repoIndex, 1);
    // setRepositories(listRepositories);
    // funciona no APP mas não passa no teste

    setRepositories(repositories.filter(
      repository => repository.id !== id
    ))
  }

  async function handleLike(id) {
    const response= await api.post(`repositories/${id}/like`);

    setRepositories(repositories.filter(
      repository => {
        if (repository.id === id) {
          repository.likes= response.data.likes;
        }
        return repository;
      }
    ));

  }

  return (
    <div>
      <ul data-testid="repository-list" id="repository-list" className="repositoryList">
        {repositories.map( repository => (
          <li key={repository.id} className="repository">
              <div className="title">
                <h3>{repository.title}</h3>
                <span>Likes: <button type="button" className="like-btn" onClick={() => {handleLike(repository.id)}}>{repository.likes}</button></span>
              </div>
              <p>{repository.url}</p>
              <ul>
                {repository.techs.map( (tech, i) => (
                  <li key={i}>{tech}</li>
                ))}
              </ul>
            <br />
            <button onClick={() => handleRemoveRepository(repository.id)}>Remover</button>
          </li>
        ))}
      </ul>

      <form>
        <h2>Repositório</h2>
        <input type="text" placeholder="Título" onChange={ event => setTitle(event.target.value)} />
        <input type="text" placeholder="url" onChange={ event => setUrl(event.target.value)}  />
        <input type="text" placeholder="Tecnologias" onChange={ event => setTechs(event.target.value)}  />
        <span className="small">Use a vírgula '<b>,</b>' para separar as tecnologias</span>
        <button type="button" onClick={handleAddRepository}>Adicionar</button>
      </form>

    </div>
  );
}

export default App;
