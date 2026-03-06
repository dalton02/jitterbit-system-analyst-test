import { app } from "./app";
import { niceEnv } from "./persistence/utils/env";

const port = niceEnv.PORT || 3000;

app.listen(port, () => console.log(`Running on port ${port}`));
