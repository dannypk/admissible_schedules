/**
 * Created by daniel.pacurici on 17.09.2015.
 */
module.exports = {
    hasDependencies: hasDependencies,
    canProcess: canProcess,
    process: process,
    build: build,
    checkBuildState: checkBuildState
};

function hasDependencies(part) {
    return (part.dependencies && part.dependencies.length > 0) > 0;
}

function canProcess(carParts, part) {
    var processable = true;
    if (!hasDependencies(carParts[part])) {
        return processable;
    }
    else {
        carParts[part].dependencies.forEach(function (dependency) {
            processable = processable && !!carParts[dependency].state;
        });
    }
    return processable;
}

function process(carParts, part) {
    if (carParts[part].state === 1) {
        return;
    }

    else if (!hasDependencies(carParts[part])) {
        carParts[part].state = 1;
        if (schedule.indexOf(part) === -1)
            schedule.push(part);
    }
    else {
        buildDependencies(carParts, part);
        if (schedule.indexOf(part) === -1)
            schedule.push(part);
        carParts[part].state = 1;
    }
}

function buildDependencies(carParts, part) {
    carParts[part].dependencies.forEach(function (dependency) {
        if (carParts[dependency].state === 1) {
            return;
        } else if (canProcess(carParts, dependency)) {
            carParts[dependency].state = 1;
        }
        else {
            process(carParts, dependency);
            carParts[dependency].state = 1;
        }
    });
}

function build(carParts) {
    for (var part in carParts) {
        part = Number(part);
        if (carParts.hasOwnProperty(part))
            process(carParts, part);
    }
    return schedule;
}

function checkBuildState(carParts) {
    var isBuild = true;
    for (var part in carParts) {
        if (carParts.hasOwnProperty(part)) {
            isBuild = isBuild && !!carParts[part].state;
        }
    }
    return isBuild;
}

var schedule = [];