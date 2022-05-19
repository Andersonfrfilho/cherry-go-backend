import { app } from "@shared/infra/http/app";

import { version, name } from "../../../../package.json";

const port = Number(process.env.PORT);

app.listen(port, () =>
  console.log(
    `Application: ${name} \n port: ${port} \n version: ${version} \n Server is running!`
  )
);
