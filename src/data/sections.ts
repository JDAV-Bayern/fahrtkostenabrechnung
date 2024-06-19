import { JdavOrganisation, SectionData } from 'src/domain/section.model';

export const jdavStates: JdavOrganisation[] = [
  { id: 1, name: 'Baden-Württemberg' },
  { id: 2, name: 'Bayern' },
  { id: 3, name: 'Hessen' },
  { id: 4, name: 'Nord' },
  { id: 5, name: 'Nordost' },
  { id: 6, name: 'Nordrhein-Westfalen' },
  { id: 7, name: 'Rheinland-Pfalz/Saarland' },
  { id: 8, name: 'Sachsen' },
  { id: 9, name: 'Thüringen' },
  { id: 10, name: 'Sachsen-Anhalt' }
];

export const jdavRegions: JdavOrganisation[] = [
  { id: 1, name: 'München' },
  { id: 2, name: 'Westliches Oberbayern' },
  { id: 3, name: 'Östliches Oberbayern/Niederbayern' },
  { id: 4, name: 'Schwaben' },
  { id: 5, name: 'Nordbayern' }
];

/*
ID  State
1   Bayern
2   Baden-Württemberg
3   Hessen
4   Saarland
5   Nordrhein-Westfalen
6   Rheinland-Pfalz
7   Schleswig-Holstein
8   Berlin
9   Niedersachsen
10  Bremen
11  Hamburg
12  Mecklenburg-Vorpommern
13  Brandenburg
14  Sachsen-Anhalt
15  Sachsen
16  Thüringen
*/

export const sections: SectionData[] = [
  {
    id: 1001,
    name: 'Aachen',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1002,
    name: 'Achensee',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1003,
    name: 'Achental',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1004,
    name: 'Bad Aibling',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1005,
    name: 'Aichach',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1006,
    name: 'Akademische Sektion München',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1007,
    name: 'Allgäu-Immenstadt',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1008,
    name: 'Allgäu-Kempten',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1009,
    name: 'Alpenkranzl Erding',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1010,
    name: 'Alpenkranzl Holzkirchen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1011,
    name: 'Alpenland',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1012,
    name: 'ASS Saarbrücken',
    stateId: 4,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1013,
    name: 'Alpiner Ski-Club e.V. München',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1014,
    name: 'Amberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1015,
    name: 'Ammersee',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1016,
    name: 'Ansbach',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1017,
    name: 'Pfaffenhofen-Asch',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1018,
    name: 'Aschaffenburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1019,
    name: 'Augsburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1020,
    name: 'Aulendorf',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1022,
    name: 'Baar',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1023,
    name: 'Baden-Baden/Murgtal',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1024,
    name: 'Bamberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1025,
    name: 'Wuppertal',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1026,
    name: 'Bayerland',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1027,
    name: 'Bayreuth',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1028,
    name: 'Beckum',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1029,
    name: 'Berchtesgaden',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1030,
    name: 'Bergbund',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1031,
    name: 'Bergbund Rosenheim',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1032,
    name: 'Bergfreunde Rheydt',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1033,
    name: 'Bergfreunde Saar',
    stateId: 4,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1034,
    name: 'Bergfried',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1035,
    name: 'Alpenklub Berggeist',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1036,
    name: 'Bergland',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1037,
    name: 'Berlin',
    stateId: 8,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1038,
    name: 'Biberach',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1039,
    name: 'Bielefeld',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1040,
    name: 'Bochum',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1041,
    name: 'Bodenschneid',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1042,
    name: 'Bonn',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1043,
    name: 'Braunschweig',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1044,
    name: 'Bremen',
    stateId: 10,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1045,
    name: 'Brenztal',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1046,
    name: 'Breslau/Sitz Stuttgart',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1047,
    name: 'Burghausen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1048,
    name: 'Burgkirchen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1049,
    name: 'Celle',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1050,
    name: 'AlpinClub Berlin',
    stateId: 8,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1052,
    name: 'Coburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1053,
    name: 'Darmstadt-Starkenburg',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1054,
    name: 'Deggendorf',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1055,
    name: 'Lippe-Detmold',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1056,
    name: 'Deutscher Skiclub Nürnberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1057,
    name: 'Dillingen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1058,
    name: 'Donauwörth',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1059,
    name: 'Dortmund',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1060,
    name: 'Böblingen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1061,
    name: 'Düren',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1062,
    name: 'Düsseldorf',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1063,
    name: 'Duisburg',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1064,
    name: 'Ebersberg-Grafing',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1065,
    name: 'Ebingen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1066,
    name: 'Edelweiß München',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1067,
    name: 'Eger und Egerland',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1068,
    name: 'Eggenfelden',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1069,
    name: 'Eichstätt',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1071,
    name: 'Ettlingen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1072,
    name: 'Erlangen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1073,
    name: 'Essen',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1074,
    name: 'Firnland',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1075,
    name: 'Flensburg',
    stateId: 7,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1076,
    name: 'Forchheim',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1077,
    name: 'Frankenland',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1078,
    name: 'Frankenthal',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1079,
    name: 'Frankfurt/Main',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1080,
    name: 'Freiburg-Breisgau',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1081,
    name: 'Freilassing',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1082,
    name: 'Freising',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1083,
    name: 'Freudenstadt',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1084,
    name: 'Friedrichshafen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1085,
    name: 'Fürth',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1086,
    name: 'Füssen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1087,
    name: 'Fulda',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1089,
    name: 'Gangkofen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1090,
    name: 'Garmisch-Partenkirchen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1091,
    name: 'Geislingen/Steige',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1092,
    name: 'Gelsenkirchen',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1093,
    name: 'Geltendorf',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1094,
    name: 'Gersthofen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1095,
    name: 'Gießen-Oberhessen',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1097,
    name: 'Gleißental',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1099,
    name: 'Göttingen',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1100,
    name: 'Goslar',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1101,
    name: 'Greiz Sitz Marktredwitz',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1102,
    name: 'Bad Griesbach im Rottal',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1103,
    name: 'Guben',
    stateId: 13,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1104,
    name: 'Günzburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1105,
    name: 'Gummersbach',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1106,
    name: 'Gunzenhausen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1107,
    name: 'Haag',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1108,
    name: 'Hagen',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1109,
    name: 'Hochtaunus Oberursel',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1110,
    name: 'Hamburg und Niederelbe',
    stateId: 11,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1111,
    name: 'Hameln',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1112,
    name: 'Hanau',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1113,
    name: 'Hannover',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1114,
    name: 'Heidelberg',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1115,
    name: 'Heilbronn',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1116,
    name: 'Hersbruck',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1117,
    name: 'Bad Hersfeld',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1118,
    name: 'Hesselberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1119,
    name: 'Hildesheim',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1120,
    name: 'Hochland',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1121,
    name: 'Hochrhein',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1122,
    name: 'Hof',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1123,
    name: 'Hohenstaufen Göppingen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1124,
    name: 'Illertissen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1125,
    name: 'Ingolstadt',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1126,
    name: 'Isartal',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1127,
    name: 'Isny',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1128,
    name: 'Kaiserslautern',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1129,
    name: 'Kampenwand',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1130,
    name: 'Karlsbad',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1131,
    name: 'Karlsruhe',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1132,
    name: 'Kassel',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1133,
    name: 'Kattowitz',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1134,
    name: 'Kaufbeuren-Gablonz',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1135,
    name: 'Kelheim',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1136,
    name: 'Kiel',
    stateId: 7,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1137,
    name: 'Bad Kissingen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1138,
    name: 'Koblenz',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1139,
    name: 'Königsberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1140,
    name: 'Konstanz',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1141,
    name: 'Krefeld',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1142,
    name: 'Krumbach',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1143,
    name: 'Kulmbach',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1144,
    name: 'Lahr/Schwarzwald',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1145,
    name: 'Landau/Pfalz',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1146,
    name: 'Landsberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1147,
    name: 'Landshut',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1148,
    name: 'Lauf a.d.P.',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1149,
    name: 'Laufen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1150,
    name: 'Schongau',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1152,
    name: 'Leitzachtal',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1153,
    name: 'Lenggries',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1154,
    name: 'Leutkirch',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1155,
    name: 'Lichtenfels',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1156,
    name: 'Lindau',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1157,
    name: 'Lörrach',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1158,
    name: 'Ludwigsburg',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1159,
    name: 'Ludwigshafen am Rhein',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1160,
    name: 'Lübeck',
    stateId: 7,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1161,
    name: 'Lüdenscheid',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1163,
    name: 'Männer Turnverein München',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1164,
    name: 'Mainburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1165,
    name: 'Mainz',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1166,
    name: 'Mannheim',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1167,
    name: 'Marburg/Lahn',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1170,
    name: 'Memmingen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1171,
    name: 'Mering',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1172,
    name: 'Miesbach',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1173,
    name: 'Mindelheim',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1174,
    name: 'Minden/Westfalen',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1175,
    name: 'Mittelfranken',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1176,
    name: 'Mittenwald',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1177,
    name: 'Mönchengladbach',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1178,
    name: 'Moosburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1179,
    name: 'Mühldorf',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1180,
    name: 'Mülheim an der Ruhr',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1181,
    name: 'München',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1182,
    name: 'Münster/Westfalen',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1183,
    name: 'Murnau',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1184,
    name: 'Nahegau',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1186,
    name: 'Neuland',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1187,
    name: 'Neumarkt/Oberpfalz',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1188,
    name: 'Neuötting-Altötting',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1189,
    name: 'Neustadt/Coburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1190,
    name: 'Neustadt/Weinstraße',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1191,
    name: 'Neu-Ulm',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1193,
    name: 'Nördlingen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1194,
    name: 'Noris',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1195,
    name: 'Nürnberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1196,
    name: 'Oberer Neckar',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1197,
    name: 'Oberkochen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1198,
    name: 'Oberland',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1199,
    name: 'Oberstaufen-Lindenberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1200,
    name: 'Oberstdorf',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1201,
    name: 'Offenbach',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1202,
    name: 'Offenburg',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1203,
    name: 'Oldenburg',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1204,
    name: 'Osnabrück',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1205,
    name: 'Paderborn',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1206,
    name: 'Passau',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1207,
    name: 'Peißenberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1208,
    name: 'Peiting',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1209,
    name: 'Pfarrkirchen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1210,
    name: 'Pforzheim',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1211,
    name: 'Pfronten',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1212,
    name: 'Pirmasens',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1213,
    name: 'Plauen-Vogtland',
    stateId: 15,
    jdavStateId: 8,
    jdavRegionId: null
  },
  {
    id: 1214,
    name: 'Dinkelsbühl',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1216,
    name: 'Prien am Chiemsee',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1217,
    name: 'Ravensburg',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1218,
    name: 'Recklinghausen',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1219,
    name: 'Regensburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1220,
    name: 'Bad Reichenhall',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1221,
    name: 'Reutlingen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1222,
    name: 'Rheinland-Köln',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1223,
    name: 'Ringsee',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1224,
    name: 'Röthenbach',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1225,
    name: 'Rosenheim',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1226,
    name: 'Main-Spessart',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1227,
    name: 'Rothenburg o.d.T.',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1228,
    name: 'Rottal Neumarkt-St. Veit',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1229,
    name: 'Rüsselsheim',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1231,
    name: 'Bad Saulgau',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1232,
    name: 'Schliersee',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1233,
    name: 'Schorndorf',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1234,
    name: 'Schrobenhausen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1235,
    name: 'Schwabach',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1236,
    name: 'Schwaben',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1237,
    name: 'Schwabmünchen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1238,
    name: 'Schwäbisch Gmünd',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1239,
    name: 'Schwarzwald',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1240,
    name: 'Schweinfurt',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1241,
    name: 'SSV Ulm 1846',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1242,
    name: 'Selb',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1243,
    name: 'Siegburg',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1244,
    name: 'Siegerland',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1245,
    name: 'Sigmaringen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1247,
    name: 'Simbach/Inn',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1248,
    name: 'Sonneberg',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1249,
    name: 'Speyer',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1253,
    name: 'Starnberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1254,
    name: 'Straubing',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1255,
    name: 'Stuttgart',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1256,
    name: 'Sulzbach-Rosenberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1257,
    name: 'Tegernsee',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1258,
    name: 'Teisendorf',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1260,
    name: 'Tittmoning',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1261,
    name: 'Tölz',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1262,
    name: 'Traunstein',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1263,
    name: 'Treuchtlingen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1264,
    name: 'Trier',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1265,
    name: 'Trostberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1266,
    name: 'Tübingen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1267,
    name: 'Turner-Alpenkränzchen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1269,
    name: 'Tuttlingen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1270,
    name: 'Tutzing',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1271,
    name: 'Überlingen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1272,
    name: 'Ulm',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1273,
    name: 'Univ. Sportclub München',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1274,
    name: 'Vierseenland',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1275,
    name: 'Waakirchen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1276,
    name: 'Wangen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1277,
    name: 'Wasserburg am Inn',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1278,
    name: 'Weiden',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1279,
    name: 'Weiler',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1280,
    name: 'Weilheim',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1281,
    name: 'Weinheim/Bergstraße',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1282,
    name: 'Weißenburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1283,
    name: 'Weserland',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1284,
    name: 'Wetzlar',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1285,
    name: 'Wiesbaden',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1286,
    name: 'Wilhelmshaven',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1287,
    name: 'Witten',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1288,
    name: 'Wolfratshausen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1289,
    name: 'Worms',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1290,
    name: 'Würzburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1291,
    name: 'Zweibrücken',
    stateId: 6,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1293,
    name: 'Rottenburg',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1294,
    name: 'Friedberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1296,
    name: 'Taufkirchen/Vils',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1297,
    name: 'Zorneding',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1298,
    name: 'Otterfing',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1299,
    name: 'Bocholt',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1300,
    name: 'Solingen',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1301,
    name: 'Hochsauerland',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1303,
    name: 'Wildsteig',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1304,
    name: 'Bergbund Hausham',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1306,
    name: 'Mengen',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1307,
    name: 'Garching',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1308,
    name: 'Bad Waldsee',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1309,
    name: 'Karpaten',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1311,
    name: 'Bergfreunde München',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1312,
    name: 'Oy/Allgäu',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1313,
    name: 'Pfullendorf',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1314,
    name: 'Kronach/Frankenwald',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1315,
    name: 'Abenberg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1316,
    name: 'Bergfreunde Anhalt Dessau',
    stateId: 14,
    jdavStateId: 10,
    jdavRegionId: null
  },
  {
    id: 1317,
    name: 'Jena',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1318,
    name: 'Leipzig',
    stateId: 15,
    jdavStateId: 8,
    jdavRegionId: null
  },
  {
    id: 1319,
    name: 'Pößneck',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1320,
    name: 'Sächsischer Bergsteigerbund',
    stateId: 15,
    jdavStateId: 8,
    jdavRegionId: null
  },
  {
    id: 1321,
    name: 'Suhl',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1322,
    name: 'Thüringer Bergsteigerbund',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1323,
    name: 'Chemnitz',
    stateId: 15,
    jdavStateId: 8,
    jdavRegionId: null
  },
  {
    id: 1324,
    name: 'Halle/Saale',
    stateId: 14,
    jdavStateId: 10,
    jdavRegionId: null
  },
  {
    id: 1325,
    name: 'Gera',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1327,
    name: 'Zwickau',
    stateId: 15,
    jdavStateId: 8,
    jdavRegionId: null
  },
  {
    id: 1328,
    name: 'Ebersbach',
    stateId: 15,
    jdavStateId: 8,
    jdavRegionId: null
  },
  {
    id: 1329,
    name: 'Rostock',
    stateId: 12,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1330,
    name: 'Altenburg',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1332,
    name: 'Buchen-Odenwald',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1333,
    name: 'Zittau',
    stateId: 15,
    jdavStateId: 8,
    jdavRegionId: null
  },
  {
    id: 1334,
    name: 'Meiningen',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1335,
    name: 'Weimar',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1336,
    name: 'Wernigerode',
    stateId: 14,
    jdavStateId: 10,
    jdavRegionId: null
  },
  {
    id: 1337,
    name: 'Waltershausen-Gotha',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1338,
    name: 'Potsdam',
    stateId: 13,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1339,
    name: 'Brandenburger Tor',
    stateId: 8,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1340,
    name: 'Sedlitzer Bergfreunde',
    stateId: 13,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1341,
    name: 'Inselberg',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1342,
    name: 'Nordhausen',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1343,
    name: 'Akademische Sektion Dresden',
    stateId: 15,
    jdavStateId: 8,
    jdavRegionId: null
  },
  {
    id: 1344,
    name: 'Frankfurt/Oder',
    stateId: 13,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1345,
    name: 'Georgensgmünd',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1346,
    name: 'Feucht',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1348,
    name: 'Altdorf',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1349,
    name: 'Dingolfing',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1350,
    name: 'Magdeburg',
    stateId: 14,
    jdavStateId: 10,
    jdavRegionId: null
  },
  {
    id: 1351,
    name: 'Roth',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1352,
    name: 'Eifel',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1353,
    name: 'Feuchtwangen',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1354,
    name: 'Mecklenburgischer Bergsteigerclub',
    stateId: 12,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1356,
    name: 'Kaufering',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1357,
    name: 'Apolda',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1358,
    name: 'Bergbund Würzburg',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1359,
    name: 'Alexander von Humboldt',
    stateId: 8,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1360,
    name: 'AlpinClub e.V. Hannover',
    stateId: 9,
    jdavStateId: 4,
    jdavRegionId: null
  },
  {
    id: 1361,
    name: 'Herrieden',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1362,
    name: 'Sinsheim',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1363,
    name: 'Hochwald',
    stateId: 4,
    jdavStateId: 7,
    jdavRegionId: null
  },
  {
    id: 1364,
    name: 'Dresden',
    stateId: 15,
    jdavStateId: 8,
    jdavRegionId: null
  },
  {
    id: 1365,
    name: 'Erfurt Alpin',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1366,
    name: 'Südharz/Sangerhausen',
    stateId: 14,
    jdavStateId: 10,
    jdavRegionId: null
  },
  {
    id: 1367,
    name: 'Alpen.Net',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1368,
    name: 'Haar',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1369,
    name: 'Gay Outdoor Club',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1370,
    name: 'BSV Leipzig-Mitte',
    stateId: 15,
    jdavStateId: 8,
    jdavRegionId: null
  },
  {
    id: 1371,
    name: 'Klettersportverein Cottbus',
    stateId: 13,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1372,
    name: 'Hoher Fläming',
    stateId: 13,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1373,
    name: 'Bergfreunde Kleverland',
    stateId: 5,
    jdavStateId: 6,
    jdavRegionId: null
  },
  {
    id: 1374,
    name: 'AlpinClub Kassel',
    stateId: 3,
    jdavStateId: 3,
    jdavRegionId: null
  },
  {
    id: 1375,
    name: 'Markt Schwaben',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 2
  },
  {
    id: 1376,
    name: 'Lechbruck',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 4
  },
  {
    id: 1377,
    name: 'Aischtal',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 5
  },
  {
    id: 1378,
    name: 'Bergclub Ilmenau',
    stateId: 16,
    jdavStateId: 9,
    jdavRegionId: null
  },
  {
    id: 1379,
    name: 'Nagold',
    stateId: 2,
    jdavStateId: 1,
    jdavRegionId: null
  },
  {
    id: 1380,
    name: 'Alpinistenclub',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  },
  {
    id: 1381,
    name: 'Neuruppin',
    stateId: 13,
    jdavStateId: 5,
    jdavRegionId: null
  },
  {
    id: 1382,
    name: 'Stützpunkt Inntal',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1383,
    name: 'Gipfelkreuz',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 3
  },
  {
    id: 1384,
    name: 'Gay Alpin München',
    stateId: 1,
    jdavStateId: 2,
    jdavRegionId: 1
  }
];
