import {jest} from '@jest/globals';

jest.useFakeTimers();


import { checkEmail } from "../libs/checkUtil";

test("'monmail@gmail.com' est valide", () => {
    expect(checkEmail("monmail@gmail.com")).toBe(true);
});

test("'monmail@gmail' est invalide", () => {
    expect(checkEmail("monmail.com")).toBe(false);
});

test("'monmail' est invalide", () => {
    expect(checkEmail("monmail")).toBe(false);
});

