/**
 * Created by daniel.pacurici on 17.09.2015.
 */

var parts = require('../app/admissible_schedules.js');

describe('admissible schedule setup', function () {
    var carParts;
    beforeEach(function () {
        carParts = {
            1: {state: 0, dependencies: null}, 2: {state: 0, dependencies: [1, 4]},
            3: {state: 0, dependencies: [2]}, 4: {state: 0, dependencies: [5]},
            5: {state: 0, dependencies: [6]}, 6: {state: 0, dependencies: null}
        };
    });

    describe('when product has dependencies', function () {
        var part, hasDependencies;
        beforeEach(function () {
            part = carParts[2];
            hasDependencies = parts.hasDependencies(part);
        });

        it("should return true", function () {
            expect(hasDependencies).toBe(true);
        });

        describe("and dependencies are in state 0", function () {
            var part,
                canProcessBeforeProcessing,
                canProcessAfterProcessing;

            beforeEach(function () {
                part = 2;
                canProcessBeforeProcessing = parts.canProcess(carParts, part);
                parts.process(carParts, part);
                canProcessAfterProcessing = parts.canProcess(carParts, part);
            });

            it("should return false", function () {
                expect(canProcessBeforeProcessing).toBe(false);
            });

            it("should 'manufacture' the dependencies parts", function () {
                expect(canProcessAfterProcessing).toBe(true)
            })

        });

        describe("and dependencies are in state 1", function () {
            var canProcess, part;
            beforeEach(function () {
                carParts[1].state = 1;
                carParts[4].state = 1;
                part = 2;
                canProcess = parts.canProcess(carParts, part);
            });

            it("should return true", function () {
                expect(canProcess).toBe(true);
            });
        });
    });

    describe("product doesn't have dependencies", function () {
        var part, hasDependencies;
        beforeEach(function () {
            part = carParts[1];
            hasDependencies = parts.hasDependencies(part);
        });

        it("should return false", function () {
            expect(hasDependencies).toBe(false);
        })
    });
});

