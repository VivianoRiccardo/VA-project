import { Matrix } from "ml-matrix";
const seedrandom = require("seedrandom");
/**
 * @fileoverview Functions for solving a Multidimensional Scaling problem with
 * gradient descent (optionally with momentum) or the Gauss-Newton algorithm.
 *
 * The two central functions are getMdsCoordinatesWithGradientDescent(...) and
 * getMdsCoordinatesWithGaussNewton(...).
 *
 * Dependencies:
 * - The ml-matrix library for computing matrix manipulations, see
 *   https://github.com/mljs/matrix.
 *   Version used: 6.4.1
 * - seedrandom, see https://github.com/davidbau/seedrandom.
 *   Version used: 3.0.5
 */

/**
 * Solves a Multidimensional Scaling problem with gradient descent.
 *
 * If momentum is != 0, the update is:
 *
 * accumulation = momentum * accumulation + gradient
 * parameters -= learning_rate * accumulation
 *
 * like in TensorFlow and PyTorch.
 *
 * In the returned object, coordinates is a matrix of shape (n, 2) containing
 * the solution.
 *
 * @param {!Matrix} distances - matrix of shape (n, n) containing the
 *   distances between n points.
 * @param {!number} lr - learning rate to use.
 * @param {!number} maxSteps - maximum number of update steps.
 * @param {!number} minLossDifference - if the absolute difference between the
 *   losses of the current and the previous optimization step is smaller than
 *   this value, the function will return early.
 * @param {!number} momentum - momentum of the gradient descent. Set this value
 *   to zero to disable momentum.
 * @param {!number} logEvery - if larger than zero, this value determines the
 *   steps between logs to the console.
 * @returns {{coordinates: Matrix, lossPerStep: number[]}}
 */
function getMdsCoordinatesWithGradientDescent(
  distances,
  learning_rate = 50,
  max_steps = 12
) {
  const minLossDifference = 1e-7;
  const momentum = 0;
  const logEvery = 0;
  const numCoordinates = distances.rows;
  console.log("get initial mds coordinates");
  let coordinates = getInitialMdsCoordinates(numCoordinates);

  const lossPerStep = [];
  let accumulation = null;

  for (let step = 0; step < max_steps; step++) {
    const loss = getMdsLoss(distances, coordinates);
    lossPerStep.push(loss);

    // Check if we should early stop.
    if (lossPerStep.length > 1) {
      const lossPrev = lossPerStep[lossPerStep.length - 2];
      if (Math.abs(lossPrev - loss) < minLossDifference) {
        return { coordinates: coordinates, lossPerStep: lossPerStep };
      }
    }

    if (logEvery > 0 && step % logEvery === 0) {
      console.log(`Step: ${step}, loss: ${loss}`);
    }

    // Apply the gradient for each coordinate.
    for (let coordIndex = 0; coordIndex < numCoordinates; coordIndex++) {
      const gradient = getGradientForCoordinate(
        distances,
        coordinates,
        coordIndex
      );

      if (momentum === 0 || accumulation == null) {
        accumulation = gradient;
      } else {
        accumulation = Matrix.add(Matrix.mul(accumulation, momentum), gradient);
      }
      const update = Matrix.mul(accumulation, learning_rate);
      const updatedCoordinates = Matrix.sub(
        coordinates.getRowVector(coordIndex),
        update
      );
      coordinates.setRow(coordIndex, updatedCoordinates);
    }
  }

  return { coordinates: coordinates, lossPerStep: lossPerStep };
}

/**
 * Solves a Multidimensional Scaling problem with the Gauss-Newton algorithm.
 *
 * In the returned object, coordinates is a matrix of shape (n, 2) containing
 * the solution.
 *
 * @param {!Matrix} distances - matrix of shape (n, n) containing the
 *   distances between n points.
 * @param {!number} lr - learning rate / alpha to use.
 * @param {!number} maxSteps - maximum number of update steps.
 * @param {!number} minLossDifference - if the absolute difference between the
 *   losses of the current and the previous optimization step is smaller than
 *   this value, the function will return early.
 * @param {!number} logEvery - if larger than zero, this value determines the
 *   steps between logs to the console.
 * @returns {{coordinates: Matrix, lossPerStep: number[]}}
 */
function getMdsCoordinatesWithGaussNewton(
  distances,
  { lr = 0.1, maxSteps = 200, minLossDifference = 1e-7, logEvery = 0 } = {}
) {
  const numCoordinates = distances.rows;
  let coordinates = getInitialMdsCoordinates(numCoordinates);
  const dimensions = coordinates.columns;

  const lossPerStep = [];

  for (let step = 0; step < maxSteps; step++) {
    const loss = getMdsLoss(distances, coordinates);
    lossPerStep.push(loss);

    // Check if we should early stop.
    if (lossPerStep.length > 1) {
      const lossPrev = lossPerStep[lossPerStep.length - 2];
      if (Math.abs(lossPrev - loss) < minLossDifference) {
        return { coordinates: coordinates, lossPerStep: lossPerStep };
      }
    }

    if (logEvery > 0 && step % logEvery === 0) {
      console.log(`Step: ${step}, loss: ${loss}`);
    }

    // Apply the update.
    const { residuals, jacobian } = getResidualsWithJacobian(
      distances,
      coordinates
    );
    const update = Matrix.pseudoInverse(jacobian).mmul(residuals);
    for (let coordIndex = 0; coordIndex < numCoordinates; coordIndex++) {
      for (let dimension = 0; dimension < dimensions; dimension++) {
        const updateIndex = coordIndex * dimensions + dimension;
        const paramValue = coordinates.get(coordIndex, dimension);
        const updateDelta = lr * update.get(updateIndex, 0);
        const updatedValue = paramValue - updateDelta;
        coordinates.set(coordIndex, dimension, updatedValue);
      }
    }
  }

  return { coordinates: coordinates, lossPerStep: lossPerStep };
}

/**
 * Initializes the solution by sampling from a uniform distribution, which
 * only allows distances in [0, 1].
 *
 * @param {!number} numCoordinates - the number of points in the solution.
 * @param {!number} dimensions - the number of dimensions of each point.
 * @param {!number} seed - seed for the random number generator.
 * @returns {Matrix}
 */
function getInitialMdsCoordinates(numCoordinates, dimensions = 2, seed = 0) {
  const random = seedrandom(seed);
  const randomUniform = Matrix.rand(numCoordinates, dimensions, {
    random: random,
  });
  return Matrix.div(randomUniform, Math.sqrt(dimensions));
}

/**
 * Returns the loss of a given solution to the Multidimensional Scaling
 * problem by computing the mean squared difference between target distances
 * and distances between points in the solution.
 *
 * @param {!Matrix} distances - matrix of shape (n, n) containing the
 *   distances between n points, defining the MDS problem.
 * @param {!Matrix} coordinates - a matrix of shape (n, d) containing
 *   the solution, for example given by getMdsCoordinatesWithGaussNewton(...).
 *   d is the number of dimensions.
 * @returns {number}
 */
function getMdsLoss(distances, coordinates) {
  // Average the squared differences of target distances and predicted
  // distances.
  let loss = 0;
  const normalizer = Math.pow(coordinates.rows, 2);
  for (let coordIndex1 = 0; coordIndex1 < coordinates.rows; coordIndex1++) {
    for (let coordIndex2 = 0; coordIndex2 < coordinates.rows; coordIndex2++) {
      if (coordIndex1 === coordIndex2) continue;

      const coord1 = coordinates.getRowVector(coordIndex1);
      const coord2 = coordinates.getRowVector(coordIndex2);
      const target = distances.get(coordIndex1, coordIndex2);
      const predicted = Matrix.sub(coord1, coord2).norm();
      loss += Math.pow(target - predicted, 2) / normalizer;
    }
  }
  return loss;
}

/**
 * Returns the residuals and the Jacobian matrix for performing one step of the
 * Gauss-Newton algorithm.
 *
 * The residuals are returned in a flattened vector as (target - predicted) /
 * numCoordinates. The flattened vector is ordered based on iterating the
 * matrix given by distances in row-major order. We divide by coordinates.rows,
 * so that the sum of squared residuals equals the MDS loss, which involves a
 * division by coordinates.rows ** 2.
 *
 * The element of the Jacobian at row i and column j should contain the
 * partial derivative of the i-th residual w.r.t. the j-th coordinate. The
 * coordinates are indexed in row-major order, such that in two dimensions,
 * the 5th zero-based index corresponds to the second coordinate of the third
 * point.
 *
 * @param {!Matrix} distances - matrix of shape (n, n) containing the
 *   distances between n points, defining the MDS problem.
 * @param {!Matrix} coordinates - a matrix of shape (n, d) containing
 *   the current solution, where d is the number of dimensions.
 * @returns {{jacobian: Matrix, residuals: Matrix}}
 */
function getResidualsWithJacobian(distances, coordinates) {
  const residuals = [];
  const numCoordinates = coordinates.rows;
  const dimensions = coordinates.columns;
  const jacobian = Matrix.zeros(
    numCoordinates * numCoordinates,
    numCoordinates * dimensions
  );

  for (let coordIndex1 = 0; coordIndex1 < numCoordinates; coordIndex1++) {
    for (let coordIndex2 = 0; coordIndex2 < numCoordinates; coordIndex2++) {
      if (coordIndex1 === coordIndex2) {
        residuals.push(0);
        // The gradient for all coordinates is zero, so we can skip
        // this row of the Jacobian.
        continue;
      }

      // Compute the residual.
      const coord1 = coordinates.getRowVector(coordIndex1);
      const coord2 = coordinates.getRowVector(coordIndex2);
      const squaredDifferenceSum = Matrix.sub(coord1, coord2).pow(2).sum();
      const predicted = Math.sqrt(squaredDifferenceSum);
      const target = distances.get(coordIndex1, coordIndex2);
      const residual = (target - predicted) / numCoordinates;
      residuals.push(residual);

      // Compute the gradient w.r.t. the first coordinate only. The
      // second coordinate is seen as a constant.
      const residualWrtPredicted = -1 / numCoordinates;
      const predictedWrtSquaredDifferenceSum =
        0.5 / Math.sqrt(squaredDifferenceSum);
      const squaredDifferenceSumWrtCoord1 = Matrix.mul(
        Matrix.sub(coord1, coord2),
        2
      );
      const residualWrtCoord1 = Matrix.mul(
        squaredDifferenceSumWrtCoord1,
        residualWrtPredicted * predictedWrtSquaredDifferenceSum
      );

      // Set the corresponding indices in the Jacobian.
      const rowIndex = numCoordinates * coordIndex1 + coordIndex2;
      for (let dimension = 0; dimension < dimensions; dimension++) {
        const columIndex = dimensions * coordIndex1 + dimension;
        const jacobianEntry = jacobian.get(rowIndex, columIndex);
        const entryUpdated =
          jacobianEntry + residualWrtCoord1.get(0, dimension);
        jacobian.set(rowIndex, columIndex, entryUpdated);
      }
    }
  }
  return {
    residuals: Matrix.columnVector(residuals),
    jacobian: jacobian,
  };
}

/**
 * Returns the gradient of the loss w.r.t. to a specific point in the
 * given solution.
 *
 * The returned matrix has the shape (1, d), where d is the number of
 * dimensions.
 *
 * @param {!Matrix} distances - matrix of shape (n, n) containing the
 *   distances between n points, defining the MDS problem.
 * @param {!Matrix} coordinates - a matrix of shape (n, d) containing
 *   the current solution, where d is the number of dimensions.
 * @param {!number} coordIndex - index of the point for which the gradient
 *   shall be computed.
 * @returns {Matrix}
 */
function getGradientForCoordinate(distances, coordinates, coordIndex) {
  const coord = coordinates.getRowVector(coordIndex);
  const normalizer = Math.pow(coordinates.rows, 2);
  let gradient = Matrix.zeros(1, coord.columns);

  for (
    let otherCoordIndex = 0;
    otherCoordIndex < coordinates.rows;
    otherCoordIndex++
  ) {
    if (coordIndex === otherCoordIndex) continue;

    const otherCoord = coordinates.getRowVector(otherCoordIndex);
    const squaredDifferenceSum = Matrix.sub(coord, otherCoord).pow(2).sum();
    const predicted = Math.sqrt(squaredDifferenceSum);
    const targets = [
      distances.get(coordIndex, otherCoordIndex),
      distances.get(otherCoordIndex, coordIndex),
    ];

    for (const target of targets) {
      const lossWrtPredicted = (-2 * (target - predicted)) / normalizer;
      const predictedWrtSquaredDifferenceSum =
        0.5 / Math.sqrt(squaredDifferenceSum);
      const squaredDifferenceSumWrtCoord = Matrix.mul(
        Matrix.sub(coord, otherCoord),
        2
      );
      const lossWrtCoord = Matrix.mul(
        squaredDifferenceSumWrtCoord,
        lossWrtPredicted * predictedWrtSquaredDifferenceSum
      );
      gradient = Matrix.add(gradient, lossWrtCoord);
    }
  }

  return gradient;
}

export default getMdsCoordinatesWithGradientDescent;
