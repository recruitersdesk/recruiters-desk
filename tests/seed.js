localStorage.clear();
const RES = "Priya Sharma\nToronto, ON\n" + "Built a RAG search tool over 12,000 shipping documents and cut lookup time by 40 percent for the operations team at a logistics company. ".repeat(4);
localStorage.setItem("rd.resume", RES); localStorage.setItem("rd.jd", "");
localStorage.setItem("rd.out", JSON.stringify({ outs: { review: REVIEW, letter: "Dear Ms. Lee,\n\nSincerely,\nPriya" }, keys: { review: RES.trim() + "\u0000", letter: RES.trim() + "\u0000" }, tab: "review" }));
