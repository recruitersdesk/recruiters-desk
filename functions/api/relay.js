// Recruiter's Desk relay on the site's own domain: recruiters-desk.pages.dev/api/relay
import { handle } from "../../relay/core.js";
export const onRequest = ({ request, env }) => handle(request, env);
