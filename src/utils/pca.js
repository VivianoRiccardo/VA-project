const PCA = require('ml-pca');

/**
 * Performs PCA dimensionality reduction from any dimension to 2 dimensions.
 * @param {Array<Array<number>>} data - The input data as an array of arrays.
 * @returns {Array<Array<number>>} - The reduced data in 2 dimensions.
 */
export function reduceDimensionsPCA(data) {
  const pca = PCA(data);
  const reducedData = pca.predict(data, { nComponents: 2 });
  return reducedData.to2DArray();
}

module.exports = reduceDimensionsPCA