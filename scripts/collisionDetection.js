CarGame.collisionDetection = (function() {
    /*
     * Take two objects with a position and radius and see if they collide
     */
    function detectCollision(obj1, obj2)
    {
        // Pythagorean theorem to find distance
        var distance = Math.sqrt(
            ((obj1.position.x - obj2.position.x) * (obj1.position.x - obj2.position.x)) +
            ((obj1.position.y - obj2.position.y) * (obj1.position.y - obj2.position.y))
        );
        return (distance < obj1.radius + obj2.radius);
    }

    return {
        detectCollision : detectCollision
    }
}());