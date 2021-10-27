<!-- use example link https://github.com/Andersonfrfilho/readme-template -->
<h1 align="center">
	<img alt="Logo" src=".github/logo.png" width="200px" />
</h1>

<h3 align="center">
  Cherry-Go Backend
</h3>

<p align="center">O Prazer indo até você</p>

<p align="center">
https://img.shields.io/circleci/token/YOURTOKEN/project/github/RedSparr0w/node-csgo-parser/master.svg
  <img alt="GitHub top language" src="https://img.shields.io/cherry-go/github/languages/top/Andersonfrfilho">

  <a href="https://www.linkedin.com/in/andersonfrfilho/">
    <img alt="Made by" src="https://img.shields.io/badge/made%20by-Anderson%20Fernandes-gree">
  </a>

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/Andersonfrfilho/cherry-go">

  <a href="https://github.com/Andersonfrfilho/cherry-go/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/Andersonfrfilho/cherry-go">
  </a>

  <a href="https://github.com/Andersonfrfilho/cherry-go/issues">
    <img alt="Repository issues" src="https://img.shields.io/github/issues/Andersonfrfilho/cherry-go">
  </a>

  <img alt="GitHub" src="https://img.shields.io/github/license/Andersonfrfilho/cherry-go">
</p>

<p align="center">
  <a href="#-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-contribute">How to contribute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

<p id="insomniaButton" align="center">
  <a href="" target="_blank"><img src="https://insomnia.rest/images/run.svg" alt="Run in Insomnia"></a>
</p>

## 👨🏻‍💻 About the project

- <p style="color: red;">Este projeto destinasse a ser um intermediario entre atendentes de campanina com clientes</p>

To see the **web back-office**, click here: [Cherry-Go Back-office Web](https://github/Andersonfrfilho/readme-template)</br>
To see the **web client**, click here: [Cherry-Go Web](https://github/Andersonfrfilho/readme-template)</br>
To see the **mobile client**, click here: [Cherry-Go Mobile](https://github/Andersonfrfilho/readme-template)

## 🚀 Technologies

Technologies that I used to develop this api

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/pt-br/)
- [Multer](https://github.com/expressjs/multer)
- [TypeORM](https://typeorm.io/#/)
- [JWT-token](https://jwt.io/)
- [uuid v4](https://github.com/thenativeweb/uuidv4/)
- [PostgreSQL](https://www.postgresql.org/)
- [Date-fns](https://date-fns.org/)
- [KafkaJs](https://kafka.js.org/)
- [Mongo](https://www.mongodb.com/pt-br)
- [Docker](https://www.docker.com/)
- [Docker-compose](https://docs.docker.com/compose/)
- [tsyringe](https://github.com/microsoft/tsyringe)
- [Joi](https://github.com/sideway/joi)
- [Celebrate](https://github.com/arb/celebrate)
- [Swagger](https://swagger.io/)
- [ReDoc](https://github.com/Redocly/redoc)
- [Redis](https://redis.io/)
- [Handlebars](https://handlebarsjs.com/)
- [Jest](https://jestjs.io/)
- [SuperTest](https://github.com/visionmedia/supertest)
- <del>[Husky](https://github.com/typicode/husky)</del>
- <del>[Commitlint](https://github.com/conventional-changelog/commitlint)</del>
- <del>[Commitizen](https://github.com/commitizen/cz-cli)</del>
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [EditorConfig](https://editorconfig.org/)

## 💻 Getting started

Import the `Insomnia.json` on Insomnia App or click on [Run in Insomnia](#insomniaButton) button

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Nvm](https://github.com/nvm-sh/nvm)
- [Yarn](https://classic.yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Docker/Docker-compose](https://www.docker.com/)


**Clone the project and access the folder**

```bash
$ git clone https://github.com/Andersonfrfilho/cherry-go && cd cherry-go
```

**Follow the steps below**

```bash
# Install the dependencies
$ yarn

# Create env config
$ make env-set

# Create the instances the project
$ make kafka

# Create the instances the project
$ make databases

# Once the services are running, run the migrations
$ make migration

# Opcional for seeds information database
$ yarn seeds:run

# To finish, run the api service
$ yarn dev:server

# Well done, project is started!
```

## 🤔 How to contribute

**Make a fork of this repository**

```bash
# Fork using GitHub official command line
# If you don't have the GitHub CLI, use the web site to do that.

$ gh repo fork Andersonfrfilho/cherry-go
```

**Follow the steps below**

```bash
# Clone your fork
$ git clone Andersonfrfilho/cherry-go && cd cherry-go

# Create a branch with your feature
$ git checkout -b my-feature

# Make the commit with your changes use :art: https://gitmoji.dev/
$ git commit -m ':sparkles: : My new feature'

# Send the code to your remote branch
$ git push origin my-feature
```

After your pull request is merged, you can delete your branch

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with 💜 &nbsp;by Anderson Fernandes 👋 &nbsp;[See my linkedin](https://www.linkedin.com/in/andersonfrfilho/)


## VsCode configuration:

```json
{
  //Defini o tema e icones
  "workbench.colorTheme": "Omni",
  "workbench.iconTheme": "material-icon-theme",
  "workbench.editor.enablePreview": false,
  "workbench.editor.labelFormat": "short",

  //Terminal
  "terminal.integrated.fontSize": 14,
  "terminal.integrated.shell.linux": "/bin/zsh",

  //Configura tamanho e familia da fonte
  "editor.fontFamily": "Fira Code",
  "editor.fontLigatures": true,
  "editor.fontSize": 16,
  "editor.renderLineHighlight": "gutter",
  "editor.parameterHints.enabled": false,
  "editor.tabSize": 2,
  "editor.rulers": [80, 120],
  "editor.lineHeight": 24,
  "editor.semanticHighlighting.enabled": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  //explorer
  "explorer.confirmDelete": false,
  "explorer.compactFolders": false,
  "explorer.confirmDragAndDrop": false,

  //breadcrumbs
  "breadcrumbs.enabled": true,

  //typescript
  "typescript.updateImportsOnFileMove.enabled": "never",

  //javascript
  "javascript.updateImportsOnFileMove.enabled": "never",

  // code Speell
  "cSpell.language": "en,pt,pt_BR",

  //emmet
  "emmet.syntaxProfiles": {
    "javascript": "jsx"
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },

  //material ui
  "material-icon-theme.folders.associations": {
    "infra": "app",
    "entities": "class",
    "schemas": "class",
    "typeorm": "database",
    "repositories": "mappings",
    "http": "container",
    "migrations": "tools",
    "modules": "components",
    "implementations": "core",
    "dtos": "typescript",
    "fakes": "mock",
    "websockets": "pipe",
    "protos": "pipe",
    "grpc": "pipe"
  },
  "material-icon-theme.files.associations": {
    "ormconfig.json": "database",
    "tsconfig.json": "tune",
    "*.proto": "3d"
  },
  //tabnine
  "tabnine.experimentalAutoImports": true,
}
```
## Run Container
  - windows
    ```.\MakeFile.bat all```

  - linux
    ```make all```

## Delete information seeds :seedling: :wastebasket:
run command:

```sql
DELETE FROM
  users_terms_accepts;
DELETE FROM
  appointments_addresses;
DELETE FROM
  appointments_addresses;
DELETE FROM
  transactions_events;
DELETE FROM
  transactions_itens;
DELETE FROM
  transactions;
DELETE FROM
  transports;
DELETE FROM
  appointments_providers_services;
DELETE FROM
  appointments_providers;
DELETE FROM
  appointments_clients;
DELETE FROM
  appointments;
DELETE FROM
  users_documents_images;
DELETE FROM
  tags_services;
DELETE FROM
  services;
DELETE FROM
  providers_images;
DELETE FROM
  users_profiles_images;
DELETE FROM
  providers_transports_types;
DELETE FROM
  providers_tags;
DELETE FROM
  providers_payments_types;
DELETE FROM
 providers_addresses;
DELETE FROM
 providers_availabilities_days;
DELETE FROM
 providers_availabilities_times;
DELETE FROM
  users_types_users;
DELETE FROM
  payments_types;
DELETE FROM
  transports_types;
DELETE FROM
  types_users;
DELETE FROM
  users_addresses;
DELETE FROM
  clients_tags;
DELETE FROM
  tags;
DELETE FROM
  images;
DELETE FROM
  addresses;
DELETE FROM
  users_phones;
DELETE FROM
  phones;
DELETE FROM
  users;
DELETE FROM
  migrations;
```

## Typeorm Migrations

run migration:
 yarn typeorm migrate:run
create migration:
 yarn typeorm migration:create --name createDocument

create seeders migration

  yarn seed:generate create "name"

# Run test specific
yarn test:unit "d:/project/cherry-go/src/shared/infra/typeorm/factories/AddressFactory.spec.ts -t "AddressesFactory Should be able to create factory an addresses"
# Docker
 - docker-compose -f .\apache-kafka\docker-compose.yaml up -d
 - docker-compose up -d


# Kubernetes
  -  create a image:
    -  ```docker build -t cherry-go-backend -f Dockerfile .```
  -  docker run cherry-go-backend
  -  create container --rm remove image
      - ```docker run -itd --network=cherry-go-backend_network-cherry-go-local -p 3333:3333 --name cherry-go-backend-api andersonfrfilho/cherry-go_api_backend:1.0.0```
