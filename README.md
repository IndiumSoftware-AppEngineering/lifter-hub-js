# Install the package lifter-hub-js

```
npm install lifter-hub-js
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
        const prompt = await hub.pull(id);
        // Example of CRUD operations
        await hub.create({
        prompt_type: "string",
        description: "string",
        system_message: "string",
        human_message: "string",
        structured_output: true, 
        output_format: "string", 
        });
        // Example of update 
        const updatedPrompt = await hub.updateFull({
        id: number,
        prompt_type: "string",
        description: "string",
        system_message: "string",
        human_message: "string",
        structured_output: true,
        output_format: "string",
        });
        // Example of delete
        hub.delete("id");
    }, []);

    return <div>{prompt || "Loading..."}</div>;
}


License

This project is licensed under the MIT License.

```
