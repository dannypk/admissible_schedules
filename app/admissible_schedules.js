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

function process(carParts, part, schedule) {
    schedule = schedule || [];
    if (carParts[part].state === 1) {
        return;
    }

    else if (!hasDependencies(carParts[part])) {
        carParts[part].state = 1;
        if (schedule.indexOf(part) === -1)
            schedule.push(part);
    }
    else {
        schedule = buildDependencies(carParts, part, schedule);
        if (schedule.indexOf(part) === -1)
            schedule.push(part);
        carParts[part].state = 1;
    }
}

function buildDependencies(carParts, part, schedule) {
    schedule = schedule || [];
    carParts[part].dependencies.forEach(function (dependency) {
        if (carParts[dependency].state === 1) {
            return;
        } else if (canProcess(carParts, dependency)) {
            carParts[dependency].state = 1;
            if (schedule.indexOf(dependency) === -1)
                schedule.push(dependency);
        }
        else {
            process(carParts, dependency, schedule);
            carParts[dependency].state = 1;
            if (schedule.indexOf(dependency) === -1)
                schedule.push(dependency);
        }
    });
    return schedule;
}

function build(carParts) {
    var schedule = [];
    for (var part in carParts) {
        part = Number(part);
        if (carParts.hasOwnProperty(part))
            process(carParts, part, schedule);
    }
    console.log(schedule);
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