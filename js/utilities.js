function SimpleCircleCollisionCheck(A, B) {
    let ACircle = { x: A.x, y: A.y };
    let BCircle = { x: B.x, y: B.y };
    if (A.width > A.height) {
        ACircle.radius = A.width/2;
    }else {
        ACircle.radius = A.height/2;
    }
    if (B.width > B.height) {
        BCircle.radius = B.width/2;
    }else {
        BCircle.radius = B.height/2;
    }

    let distSqr = ((ACircle.x - BCircle.x)*(ACircle.x - BCircle.x)) + ((ACircle.y - BCircle.y)*(ACircle.y - BCircle.y));
    let minDistSqr = (ACircle.radius + BCircle.radius)*(ACircle.radius + BCircle.radius);

    if (distSqr <= minDistSqr) {
        return true;
    }
}