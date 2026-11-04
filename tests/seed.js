localStorage.clear(); sessionStorage.clear();
localStorage.setItem("rd.resume", "OLD RESUME FROM AN EARLIER VERSION"); localStorage.setItem("rd.region", "ca");
const RES = "Priya Sharma\nToronto, ON\n" + "Built a RAG search tool over 12,000 shipping documents and cut lookup time by 40 percent for the operations team at a logistics company. ".repeat(4);
sessionStorage.setItem("rd.resume", RES); sessionStorage.setItem("rd.jd", "");
sessionStorage.setItem("rd.out", JSON.stringify({ outs: { review: REVIEW, letter: "Dear Ms. Lee,\n\nSincerely,\nPriya" }, keys: { review: RES.trim() + "\u0000", letter: RES.trim() + "\u0000" }, tab: "review" }));
