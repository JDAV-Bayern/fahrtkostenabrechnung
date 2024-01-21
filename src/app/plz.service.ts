import { Injectable } from "@angular/core";
import { plzs } from "./plzs";


const states = { '05': 'Nordrhein-Westfalen', '03': 'Niedersachsen', '07': 'Rheinland-Pfalz', '10': 'Saarland', '08': 'Baden-Württemberg', '01': 'Schleswig-Holstein', '06': 'Hessen', '09': 'Bayern', '02': 'Hamburg', '16': 'Thüringen', '04': 'Bremen', '13': 'Mecklenburg-Vorpommern', '15': 'Sachsen-Anhalt', '12': 'Brandenburg', '14': 'Sachsen', '11': 'Berlin' }

@Injectable({
    providedIn: 'root'
})
export class PlzService {
    constructor() { }

    search(prefix: string) {
        if (prefix.length <= 3) {
            return [];
        }
        return plzs.filter(val => val[0].startsWith(prefix)).map(val => ({ plz: val[0], city: val[1], isBavaria: val[2] === '09' }));
    }
    exists(plz: string) {
        return plzs.some(val => val[0] === plz);
    }
}