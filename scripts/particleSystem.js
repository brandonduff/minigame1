/*jslint browser: true, white: true, plusplus: true */
/*global Random */
CarGame.particleSystem = function(spec) {
    'use strict';
    var that = {},
        nextName = 1,	// unique identifier for the next particle
        particles = {};

    that.emitterLifeTime = spec.emitterLifeTime;
    //------------------------------------------------------------------
    //
    // This creates one new particle
    //
    //------------------------------------------------------------------
    that.create = function() {
        var p = {
            image: spec.image,
            size: Random.nextGaussian(10, 4),
            center: {x: spec.center.x, y: spec.center.y},
            direction: Random.nextCircleVector(),
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev), // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),	// How long the particle should live, in seconds
            alive: 0	// How long the particle has been alive, in seconds
        };

        //
        // Ensure we have a valid size - gaussian numbers can be negative
        p.size = Math.max(1, p.size);
        //
        // Same thing with lifetime
        p.lifetime = Math.max(0.01, p.lifetime);
        //
        // Assign a unique name to each particle
        particles[nextName++] = p;
    };

    //------------------------------------------------------------------
    //
    // Update the state of all particles.  This includes remove any that
    // have exceeded their lifetime.
    //
    //------------------------------------------------------------------
    that.update = function(elapsedTime) {
        var removeMe = [],
            value,
            particle;

        that.emitterLifeTime -= elapsedTime;
        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];
                //
                // Update how long it has been alive
                particle.alive += elapsedTime;

                //
                // Update its position
                particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
                particle.center.y += (elapsedTime * particle.speed * particle.direction.y);

                //
                // Rotate proportional to its speed
                particle.rotation += particle.speed / 500;

                //
                // If the lifetime has expired, identify it for removal
                if (particle.alive > particle.lifetime) {
                    removeMe.push(value);
                }
            }
        }

        //
        // Remove all of the expired particles
        for (particle = 0; particle < removeMe.length; particle++) {
            delete particles[removeMe[particle]];
        }
        removeMe.length = 0;
    };

    //------------------------------------------------------------------
    //
    // Render all particles
    //
    //------------------------------------------------------------------
    that.draw = function() {
        var value,
            particle,
            canvas = document.getElementById('id-canvas'),
            context = canvas.getContext('2d');

        for (value in particles) {
            if (particles.hasOwnProperty(value)) {
                particle = particles[value];

                // Draw the particle
                context.save();

                context.translate(particle.center.x, particle.center.y);
                context.rotate(particle.rotation);
                context.translate(-particle.center.x, -particle.center.y);

                context.drawImage(
                    particle.image,
                    particle.center.x - particle.size/2,
                    particle.center.y - particle.size/2,
                    particle.size, particle.size);

                context.restore();
            }
        }
    };

    return that;
};