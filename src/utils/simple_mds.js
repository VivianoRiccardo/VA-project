
const computeMDS = (distanceMatrix, learningRate = 0.1, maxIterations = 300) => {
    const n = distanceMatrix.length;
    
    // Initialize random positions in 2D
    let positions = Array.from({ length: n }, () => [Math.random(), Math.random()]);
    
    // Helper function to calculate the Euclidean distance between two points
    function euclideanDistance(pointA, pointB) {
        return Math.sqrt((pointA[0] - pointB[0]) ** 2 + (pointA[1] - pointB[1]) ** 2);
    }

    for (let iter = 0; iter < maxIterations; iter++) {
        // Initialize forces
        let forces = Array.from({ length: n }, () => [0, 0]);

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    let actualDist = euclideanDistance(positions[i], positions[j]);
                    let desiredDist = distanceMatrix[i][j];
                    let deltaDist = actualDist - desiredDist;

                    let force = deltaDist / (actualDist + 1e-9); // Prevent division by zero

                    // Update forces for both points i and j
                    forces[i][0] -= force * (positions[i][0] - positions[j][0]);
                    forces[i][1] -= force * (positions[i][1] - positions[j][1]);

                    forces[j][0] += force * (positions[i][0] - positions[j][0]);
                    forces[j][1] += force * (positions[i][1] - positions[j][1]);
                }
            }
        }

        // Apply forces to update positions
        for (let i = 0; i < n; i++) {
            positions[i][0] += learningRate * forces[i][0];
            positions[i][1] += learningRate * forces[i][1];
        }
    }

    // Normalize positions to [0, 1]
    /*
    const xCoords = positions.map(pos => pos[0]);
    const yCoords = positions.map(pos => pos[1]);

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    positions = positions.map(([x, y]) => [
        (x - minX) / (maxX - minX),
        (y - minY) / (maxY - minY)
    ]);
    */
    return positions;
}

export default computeMDS;