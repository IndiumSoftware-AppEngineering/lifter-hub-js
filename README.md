# lifter-hub-js

# Build
```
npm run build
```

# Install the package

```
npm install git+https://github.com/IndiumSoftware-AppEngineering/lifter-hub-js.git
```

# Use the package

```
"use client";

import { init } from "lifter-hub-js";
import { useEffect, useState } from "react";

export default function Home() {
    const [prompt, setPrompt] = useState<string | null>(null);

    useEffect(() => {
        const hub = init({
            type: "sqlite", // or "postgres"
            sqlite: { path: "./prompts.db" },
            postgres: {
                user: "your_user",
                host: "localhost",
                database: "your_database",
                password: "your_password",
                port: 5432,
            },
        });

        // Fetch a prompt
        hub.pull("prompt_name").then(setPrompt);

        // Example of CRUD operations
        hub.create("prompt_name", "Prompt");
        hub.update("prompt_name", "New Prompt");
        hub.delete("prompt_name");
    }, []);

    return <div>{prompt || "Loading..."}</div>;
}


```