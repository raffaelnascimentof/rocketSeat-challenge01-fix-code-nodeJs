const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);
  if(!repository) return response.status(404).json({ error: "Repository not found" })

  request.repository = repository;
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
 
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const repository = request.repository;
  const { title, url, techs } = request.body;

  Object.assign(repository, {
    title,
    url,
    techs
  })

  return response.json(repository);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const repository = request.repository;

  const repositoryIndex = repositories.indexOf(repository);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const repository = request.repository;

  const likes = ++repository.likes;

  return response.json({likes: likes});
});

module.exports = app;
