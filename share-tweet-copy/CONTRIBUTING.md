# Share Tweet Copy Contributing Guide

Hi! Thank you for contributing.

## Pull Request
1. fork this repository.
2. git clone your fork repository.
3. open the repository with your IDE.
4. change the code your want, then commit, push, and open the PR request.

## Developing Guidelines
- `script.user.js`, the tampermonkey script, for every users, publish to greasyfork.
- `dev.user.js`, the debug script, for developer to debug, don't need publish.

When we is developing this tampermonkey script, don't care about script store(greasyfork), this's published online.
And We don't use the online script. I wish use the local script.

**If you have been install this tampermonkey script, disable that. Don't use the online script and local script in the same time.**

1. **Allow access to file URLs**: Make Tampermonkey can access file, [link](https://www.tampermonkey.net/faq.php#Q204).
2. **Config script path**: Update the `dev.user.js`, `@require` value is the `script.user.js` file path in your disk.
3. **Use dev script**: import the `dev.user.js` to tampermonkey, and update `script.user.js`.
4. **check is working**: browse the match link, use devtool's control panel to debug the script.
5. **happy coding**: ...

[link](https://www.tampermonkey.net/faq.php#Q204)

## Advanced

[Rapid development](https://www.tampermonkey.net/index.php?browser=chrome&locale=en#rapid-development): Use Tampermonkey Editors extension to edit the script at vscode.dev.

```
Requirements:
At the moment Tampermonkey BETA 4.19.6176+ is required (the stable version will follow)
```