import {jest} from '@jest/globals';

jest.useFakeTimers();


import { checkUsername } from "../libs/checkUtil";

test("'Tom' est un nom d'utilisateur valide", () => {
    expect(checkUsername("Tom")).toBe(true);
});

test("'me' est un nom d'utilisateur invalide", () => {
    expect(checkUsername("me")).toBe(false);
}); 

test("'un_pseudo_bien_trop_long' est un nom d'utilisateur invalide", () => {
    expect(checkUsername("un_pseudo_bien_trop_long")).toBe(false);
});

