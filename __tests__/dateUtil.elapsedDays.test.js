import {jest} from '@jest/globals';

jest.useFakeTimers();

//Date d'aujourd'hui
var date =new Date();
var yesterday=new Date(Date.now()-1000*60*60*24);
var fiveDays=new Date(Date.now()-1000*60*60*24*5);


import {elapsedDays} from "../libs/dateUtil";

test("'aujourd'hui' est une date valide",()=>{
    expect(elapsedDays(date)).toBe("aujourd'hui");
});

test("'hier' est une date valide",()=>{
    expect(elapsedDays(yesterday)).toBe("hier");
});

test("'5 jours' est une date valide",()=>{
    expect(elapsedDays(fiveDays)).toBe("5 jours");
});

test("'-5 jours' est une date invalide",()=>{
    expect(elapsedDays(fiveDays)).not.toBe("-5 jours");
});
