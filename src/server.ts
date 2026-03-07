import { app } from "./app";
import { niceEnv } from "./core/persistence/utils/env";

const port = niceEnv.PORT || 3000;

app.listen(port, () => console.log(`Running on port ${port}`));
