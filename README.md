# lifter-hub-js


# Install the package

```
npm install git+https://github.com/IndiumSoftware-AppEngineering/lifter-hub-js.git
```

# Use the package

```
import { init } from "lifter-hub-js";

const hub = init();
hub.pull("welcome_message").then((prompt) => console.log(prompt));

```