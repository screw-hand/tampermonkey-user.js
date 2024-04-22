export function isTweetValid (tweetText) {
  const emojiPattern = /(\p{Emoji_Presentation}\p{Extended_Pictographic}?)/gu;
  const cjkPattern = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu;
  const urlPattern = /(http(s)?:\/\/[^\s]+)/g;

  // Normalize tweet text to NFC (canonical composition)
  tweetText = tweetText.normalize("NFC");

  // Count URLs as 23 characters each
  let urlCount = (tweetText.match(urlPattern) || []).length;
  let urlChars = urlCount * 23;

  // Count emojis and CJK characters
  let emojiCount = (tweetText.match(emojiPattern) || []).length;
  let cjkCount = (tweetText.match(cjkPattern) || []).length;

  // Adjust length for special characters
  let totalLength = tweetText.length + emojiCount + cjkCount + urlChars;

  return totalLength;
}
