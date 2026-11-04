// The original Worker address (recruiters-desk-relay.*.workers.dev); the site now uses /api/relay on its own domain.
import { handle } from "./core.js";
export default { fetch: (req, env) => handle(req, env) };
