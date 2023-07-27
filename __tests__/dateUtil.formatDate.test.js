import {jest} from '@jest/globals';

jest.useFakeTimers();

//Date d'aujourd'hui
var date =new Date(1681912416866);


import {formatDate} from "../libs/dateUtil";


test("'Mercredi 19 avril' est une date valide",()=>{
    expect(formatDate(date)).toBe("mercredi 19 avril");
});

test("'19 avril mercredi'est une date invalide",()=>{
    expect(formatDate(date)).not.toBe("19 avril mercredi");
});

test("'mercredi 42 avril' est une date invalide",()=>{
    expect(formatDate(date)).not.toBe("mercredi 42 avril");
});