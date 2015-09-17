/**
 * Created by daniel.pacurici on 17.09.2015.
 */
module.exports = {
    hasDependencies: hasDependencies,
    canProcess: canProcess,
    process: process
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
    if (!hasDependencies(carParts[part])) {
        carParts[part].state = 1;
    }
    else {
        buildDependencies(carParts, part);
        carParts[part].state = 1;
    }
}

function buildDependencies(carParts, part) {
    carParts[part].dependencies.forEach(function (dependency) {
        if (canProcess(carParts, dependency)) {
            carParts[dependency].state = 1;
        }
        else {
            process(carParts, dependency);
            carParts[dependency].state = 1;
        }
    });
}
