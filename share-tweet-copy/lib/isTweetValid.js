export function isTweetValid(tweetText) {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const emojiPattern = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const cjkPattern = /[\u{4E00}-\u{9FFF}\u{3400}-\u{4DBF}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{F900}-\u{FAFF}\u{2F800}-\u{2FA1F}\u{AC00}-\u{D7AF}\u{1100}-\u{11FF}]/gu;


  // Normalize tweet text to NFC (canonical composition)
  tweetText = tweetText.normalize("NFC");

  // Replace URLs with a placeholder of 23 characters
  tweetText = tweetText.replace(urlPattern, ' '.repeat(23));

  // Count the emojis and CJK characters first and calculate their weighted length
  const emojiCount = (tweetText.match(emojiPattern) || []).length * 1;
  const cjkCount = (tweetText.match(cjkPattern) || []).length * 2;

  // Remove the emojis and CJK characters for final length calculation
  tweetText = tweetText.replace(emojiPattern, '').replace(cjkPattern, '');

  // Calculate the total length with the weighted characters
  const totalLength = tweetText.length + emojiCount + cjkCount;

  // Return the total length
  return totalLength;
}
