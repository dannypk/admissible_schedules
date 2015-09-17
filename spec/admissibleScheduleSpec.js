/**
 * Created by daniel.pacurici on 17.09.2015.
 */

var parts = require('../app/admissible_schedules.js');

describe('admissible schedule dummy setup', function () {
    var carParts;
    beforeEach(function () {
        carParts = {
            1: {state: 0, dependencies: null}, 2: {state: 0, dependencies: null},
            3: {state: 0, dependencies: [1]}, 4: {state: 0, dependencies: [2, 3]},
            5: {state: 0, dependencies: [4]}, 6: {state: 0, dependencies: [4]},
            7: {state: 0, dependencies: [5]}, 8: {state: 0, dependencies: [5]},
            9: {state: 0, dependencies: [6]}
        };
    });

    describe('when product has dependencies', function () {
        var part, hasDependencies;
        beforeEach(function () {
            part = carParts[7];
            hasDependencies = parts.hasDependencies(part);
        });

        it("should return true", function () {
            expect(hasDependencies).toBe(true);
        });

        describe("and dependencies are not created, they are in state 0", function () {
            var part,
                canProcessBeforeProcessing,
                canProcessAfterProcessing,
                partState;

            beforeEach(function () {
                part = 7;
                canProcessBeforeProcessing = parts.canProcess(carParts, part);
                parts.process(carParts, part);
                canProcessAfterProcessing = parts.canProcess(carParts, part);
                partState = carParts[part].state;
            });

            it("should not be able to build the current part", function () {
                expect(canProcessBeforeProcessing).toBe(false);
            });

            describe("then it manufacture the dependencies", function () {
                it("should be able to process the current part", function () {
                    expect(canProcessAfterProcessing).toBe(true)
                });

                it("should manufacture the current part", function () {
                    expect(partState).toBe(1)
                })
            });
        });

        describe("and dependencies are created, they are in state 1", function () {
            var canProcess, part;
            beforeEach(function () {
                part = 7;
                parts.process(carParts, part);
                canProcess = parts.canProcess(carParts, part);
            });

            it("should be able to manufacture current part", function () {
                expect(canProcess).toBe(true);
            });
        });
    });

    describe("when product doesn't have dependencies", function () {
        var part, hasDependencies, partState;
        beforeEach(function () {
            part = 1;
            hasDependencies = parts.hasDependencies(carParts[part]);
            parts.process(carParts, part);
            partState = carParts[part].state;
        });

        it("should return false", function () {
            expect(hasDependencies).toBe(false);
        });

        it("should manufacture the current part", function () {
            expect(partState).toBe(1);
        })
    });

    describe('when list of products is provided', function () {
        var buildState;
        beforeEach(function () {
            parts.build(carParts);
            buildState = parts.checkBuildState(carParts);

        });

        it("should build all the parts", function () {
            expect(buildState).toBe(true);
        });
    });
});