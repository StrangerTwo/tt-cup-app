import fs from "node:fs";

import { getOpenapi } from "../api/api";

const yaml = await getOpenapi();
fs.writeFileSync("src/api/api.yaml", yaml);

fs.rmSync("src/api/model", { recursive: true, force: true });
