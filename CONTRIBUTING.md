# Contributing

Thank you for helping job seekers. The most useful contributions are:

1. **Country rule corrections:** personal details, CV length, letter openings and closings, job boards. Please link an official or well-known source.
2. **Certification list updates:** a certification that has retired, been renamed or changed its requirements. Please link the issuer's page. The list is `CERTS` in `app.html`.
3. **Bug reports,** with the browser you used and what you expected to happen.

## Making a change

1. Edit `app.html`, not `index.html`, which is generated.
2. Run `./build.sh` to rebuild `index.html`.
3. Run `./tests/run.sh`. It needs Google Chrome and Node, and makes no AI calls.
4. Open a pull request saying what you changed and why.

Keep the page simple for non-technical visitors, and never let the AI invent facts about a candidate. Checks that protect accuracy belong in code, not only in the prompt.
