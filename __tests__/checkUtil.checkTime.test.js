import {jest} from '@jest/globals';

jest.useFakeTimers();

import { checkTime } from "../libs/checkUtil";

test("'120' est valide", () => {
    expect(checkTime(120)).toBe(true);
});

test("'16' est invalide", () => {
    expect(checkTime(16)).toBe(false);
});

test("'200' est valide", () => {
    expect(checkTime(200)).toBe(false);
});


