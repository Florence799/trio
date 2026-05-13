// Simple Jaccard Similarity for text comparison
// For advanced usage, consider TF-IDF or Cosine Similarity libraries

const checkSimilarity = (text1, text2) => {
  const s1 = new Set(text1.toLowerCase().split(/\W+/));
  const s2 = new Set(text2.toLowerCase().split(/\W+/));
  
  const intersection = new Set([...s1].filter(x => s2.has(x)));
  const union = new Set([...s1, ...s2]);
  
  return (intersection.size / union.size) * 100;
};

module.exports = { checkSimilarity };
