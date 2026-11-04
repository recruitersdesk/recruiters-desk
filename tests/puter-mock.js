delete window.claude;
window.__p = { signIns: [], chats: [], downloads: [] };
window.puter = {
  auth: { _in: false, isSignedIn() { return this._in; }, async signIn(o) { __p.signIns.push(o); __p.sayAtSignIn = document.getElementById("say")?.textContent; await new Promise(r => setTimeout(r, 50)); this._in = true; return {}; } },
  ai: {
    async listModels() { return [{ id: "anthropic/claude-opus-5-5" }, { id: "anthropic/claude-sonnet-4-5" }, { id: "anthropic/claude-sonnet-5-5" }, "openai/gpt-5.5"]; },
    async chat(input, opts) {
      __p.chats.push({ input, opts });
      if (window.__pfail) throw { success: false, error: { code: "insufficient_funds", message: "Not enough funding" } };
      const text = "Here you go:\n```json\n" + JSON.stringify(input.includes("fit analysis") ? MATCH : REVIEW) + "\n```";
      return (async function* () { for (let i = 0; i < text.length; i += 150) yield { text: text.slice(i, i + 150) }; })();
    },
  },
};
URL.createObjectURL = (b) => { __p.lastBlob = b; return "blob:x"; };
HTMLAnchorElement.prototype.click = function () { if (this.download) __p.downloads.push(this.download); };
