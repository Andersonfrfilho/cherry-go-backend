docker run --name database_ignite -e POSTGRES_PASSWORD=ignite -e POSTGRES_USER=docker -e POSTGRES_DB=rentx -p 5432:5432 -d postgres
docker run --name mongodb -p 27017:27017 -d -t mongo


colors pickers:

https://logo.shapefactory.co/checkout?q=Y2hlcnJ5LWdvLFBhaW50ZWRQYXJhZGlzZSxCb2xkLDAsbm9ybWFsLDEyMzY3ODgsY2hlcnJ5LHNpbXBsZQ%3D%3D&a=45090E&b=D13D4B

https://pigment.shapefactory.co/?a=45090E&b=D13D4B
https://pigment.shapefactory.co/?a=DC2349&b=F0F5FF
https://pigment.shapefactory.co/?d=3&a=BF4874&b=EDFFFF
Database diagram

https://dbdiagram.io/d/604a358bfcdcb6230b23b25c

* Migration - MongoDB
* Implementar Kafka
* health check

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
## Typeorm Migrations

run migration:
 yarn typeorm migrate:run
create migration:
 yarn typeorm migration:create --name createDocument

create seeders migration

  yarn seed:generate create "name"
