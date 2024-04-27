# Share Tweet Copy

Share Tweet Copy is a Tampermonkey userscript that allows users to copy the text of a tweet with a single click.


## About

The doc source link is [here](https://github.com/screw-hand/tampermonkey-user.js/blob/main/share-tweet-copy/README.md),
async with [greasyfork additional info](https://greasyfork.org/en/scripts/482936-share-tweet-copy#additional-info).

## Why?

I made this plugin because when we share a tweet, it usually just shows a link. This can feel cold and not very friendly. I wanted something better.
There is another tool called TabCopy that tries to make shared content look nicer. But, I found that it squashes the tweet's lines and doesn't look good.
So, I created `share-tweet-copy`. It's easy to use like TabCopy, but it keeps the tweet's original look. I think this makes sharing more fun and the tweets look nicer.


etc: `https://twitter.com/sama/status/1779517913654808676`.

Using TabCopy to share:
```
Sam Altman on X: "people have happily worked so hard to build stuff for you knowing they would never meet you just hoping that some of the people of the future would continue the quest and build the next branch of the tech tree" / X
https://twitter.com/sama/status/1779517913654808676
```

Using Share Tweet Copy to share:

```
Sam Altman (@sama)

people have happily worked so hard to build stuff for you knowing they would never meet you

just hoping that some of the people of the future would continue the quest and build the next branch of the tech tree

https://twitter.com/sama/status/1779517913654808676
```

## Features
- **One-click Copy**: Effortlessly copy the entire tweet text.
- **Clean Format**: Copy the text in a clean, quote-ready format.
- **Easy to Use**: No complicated setup required, just install and start copying tweets.

## Installation
1. If you haven't already, install the [Tampermonkey](https://www.tampermonkey.net/) extension for your browser.
2. Click [here to install Share Tweet Copy](https://greasyfork.org/scripts/482936-share-tweet-copy) or visit the Greasy Fork page and click "Install this script".
3. Once installed, the script will automatically work on Twitter's website.

## Usage
1. Navigate to a tweet on Twitter.com.
2. Find the clipboard icon (📋) next to the tweet details; click to copy.
3. Paste the text wherever needed.

## Screenshots
|base|hover|
|---|---|
|![base](https://raw.githubusercontent.com/screw-hand/tampermonkey-user.js/main/share-tweet-copy/docs/imgs/1-base.png)|![hover](https://raw.githubusercontent.com/screw-hand/tampermonkey-user.js/main/share-tweet-copy/docs/imgs/2-hover.png)|

|click|paste|
|---|---|
|![click](https://raw.githubusercontent.com/screw-hand/tampermonkey-user.js/main/share-tweet-copy/docs/imgs/3-click.png)|![paste](https://raw.githubusercontent.com/screw-hand/tampermonkey-user.js/main/share-tweet-copy/docs/imgs/4-paste.png)|

## Advanced

Friendly Integration with [Immersive Translate](https://immersivetranslate.com/): If you use Immersive Translate, the translated content can also be copied along.

```
Sam Altman (@sama)

people have happily worked so hard to build stuff for you knowing they would never meet you

just hoping that some of the people of the future would continue the quest and build the next branch of the tech tree

人们很高兴地努力工作为你创造东西，因为他们知道他们永远不会见到你

只是希望未来的一些人能够继续探索并建立科技树的下一个分支...

https://twitter.com/sama/status/1779517913654808676
```

## Roadmap
- [ ] refactor: use `main` function, more emeerate configuration objects, and [template syntax](https://www.tampermonkey.net/documentation.php) as the need as we can.
- [ ] repost tweet: add the `repost:` string with clipboard in begin. 
- [ ] replay tweet: add the `replay:` string with clipboard in begin. 
- [ ] options: show mode => setting "how to display copy button", `always` / `hover`
- [ ] options: copy mode => `text` / `image`
- [ ] options: shortcuts => if web is `https://twitter.com/[userid]/status/*`, can use shortcuts to copy with notification.
- [ ] issues template: feature request, bug.

## Contributing
Contributions are welcome! 
- For bug reports or suggestions, please [open an issue](https://github.com/screw-hand/tampermonkey-user.js/issues/new).
- For pull request, please make sure to read the [contributing guide](https://github.com/screw-hand/tampermonkey-user.js/blob/main/share-tweet-copy/CONTRIBUTING.md) before that.

## Tanks

- [TabCopy](https://tabcopy.com)
- [Immersive Translate](https://immersivetranslate.com/)