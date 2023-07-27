import {jest} from '@jest/globals';

jest.useFakeTimers();


import { checkPassword } from "../libs/checkUtil";

test("'123' est invalide", () => {
    expect(checkPassword("123")).toBe(false);
});

test("'azerty' est valide", () => {
    expect(checkPassword("azerty")).toBe(true);
});

