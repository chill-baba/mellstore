/**
 * Worldwide Countries & Dialing Codes Data + "Choose country" Bottom Sheet
 * Matches Mellstroy Casino UI Screenshot (Image 2) with smooth slide-up animation.
 */

window.WORLD_COUNTRIES = [
  {
    "name": "Russia (Россия)",
    "code": "RU",
    "dial": "+7",
    "flag": "🇷🇺"
  },
  {
    "name": "Ukraine (Україна)",
    "code": "UA",
    "dial": "+380",
    "flag": "🇺🇦"
  },
  {
    "name": "Kazakhstan (Казахстан)",
    "code": "KZ",
    "dial": "+7",
    "flag": "🇰🇿"
  },
  {
    "name": "Albania",
    "code": "AL",
    "dial": "+355",
    "flag": "🇦🇱"
  },
  {
    "name": "Algeria",
    "code": "DZ",
    "dial": "+213",
    "flag": "🇩🇿"
  },
  {
    "name": "American Samoa",
    "code": "AS",
    "dial": "+1",
    "flag": "🇦🇸"
  },
  {
    "name": "Andorra",
    "code": "AD",
    "dial": "+376",
    "flag": "🇦🇩"
  },
  {
    "name": "Angola",
    "code": "AO",
    "dial": "+244",
    "flag": "🇦🇴"
  },
  {
    "name": "Anguilla",
    "code": "AI",
    "dial": "+1264",
    "flag": "🇦🇮"
  },
  {
    "name": "Antigua and Barbuda",
    "code": "AG",
    "dial": "+1268",
    "flag": "🇦🇬"
  },
  {
    "name": "Argentina",
    "code": "AR",
    "dial": "+54",
    "flag": "🇦🇷"
  },
  {
    "name": "Armenia (Հայաստան)",
    "code": "AM",
    "dial": "+374",
    "flag": "🇦🇲"
  },
  {
    "name": "Aruba",
    "code": "AW",
    "dial": "+297",
    "flag": "🇦🇼"
  },
  {
    "name": "Australia",
    "code": "AU",
    "dial": "+61",
    "flag": "🇦🇺"
  },
  {
    "name": "Austria (Österreich)",
    "code": "AT",
    "dial": "+43",
    "flag": "🇦🇹"
  },
  {
    "name": "Azerbaijan (Azərbaycan)",
    "code": "AZ",
    "dial": "+994",
    "flag": "🇦🇿"
  },
  {
    "name": "Bahamas",
    "code": "BS",
    "dial": "+1242",
    "flag": "🇧🇸"
  },
  {
    "name": "Bahrain",
    "code": "BH",
    "dial": "+973",
    "flag": "🇧🇭"
  },
  {
    "name": "Bangladesh",
    "code": "BD",
    "dial": "+880",
    "flag": "🇧🇩"
  },
  {
    "name": "Barbados",
    "code": "BB",
    "dial": "+1246",
    "flag": "🇧🇧"
  },
  {
    "name": "Belarus (Беларусь)",
    "code": "BY",
    "dial": "+375",
    "flag": "🇧🇾"
  },
  {
    "name": "Belgium",
    "code": "BE",
    "dial": "+32",
    "flag": "🇧🇪"
  },
  {
    "name": "Belize",
    "code": "BZ",
    "dial": "+501",
    "flag": "🇧🇿"
  },
  {
    "name": "Benin",
    "code": "BJ",
    "dial": "+229",
    "flag": "🇧🇯"
  },
  {
    "name": "Bermuda",
    "code": "BM",
    "dial": "+1441",
    "flag": "🇧🇲"
  },
  {
    "name": "Bhutan",
    "code": "BT",
    "dial": "+975",
    "flag": "🇧🇹"
  },
  {
    "name": "Bolivia",
    "code": "BO",
    "dial": "+591",
    "flag": "🇧🇴"
  },
  {
    "name": "Bosnia and Herzegovina",
    "code": "BA",
    "dial": "+387",
    "flag": "🇧🇦"
  },
  {
    "name": "Botswana",
    "code": "BW",
    "dial": "+267",
    "flag": "🇧🇼"
  },
  {
    "name": "Brazil",
    "code": "BR",
    "dial": "+55",
    "flag": "🇧🇷"
  },
  {
    "name": "British Virgin Islands",
    "code": "VG",
    "dial": "+1284",
    "flag": "🇻🇬"
  },
  {
    "name": "Brunei",
    "code": "BN",
    "dial": "+673",
    "flag": "🇧🇳"
  },
  {
    "name": "Bulgaria",
    "code": "BG",
    "dial": "+359",
    "flag": "🇧🇬"
  },
  {
    "name": "Burkina Faso",
    "code": "BF",
    "dial": "+226",
    "flag": "🇧🇫"
  },
  {
    "name": "Burundi",
    "code": "BI",
    "dial": "+257",
    "flag": "🇧🇮"
  },
  {
    "name": "Cambodia",
    "code": "KH",
    "dial": "+855",
    "flag": "🇰🇭"
  },
  {
    "name": "Cameroon",
    "code": "CM",
    "dial": "+237",
    "flag": "🇨🇲"
  },
  {
    "name": "Canada",
    "code": "CA",
    "dial": "+1",
    "flag": "🇨🇦"
  },
  {
    "name": "Cape Verde",
    "code": "CV",
    "dial": "+238",
    "flag": "🇨🇻"
  },
  {
    "name": "Cayman Islands",
    "code": "KY",
    "dial": "+1345",
    "flag": "🇰🇾"
  },
  {
    "name": "Central African Republic",
    "code": "CF",
    "dial": "+236",
    "flag": "🇨🇫"
  },
  {
    "name": "Chad",
    "code": "TD",
    "dial": "+235",
    "flag": "🇹🇩"
  },
  {
    "name": "Chile",
    "code": "CL",
    "dial": "+56",
    "flag": "🇨🇱"
  },
  {
    "name": "China",
    "code": "CN",
    "dial": "+86",
    "flag": "🇨🇳"
  },
  {
    "name": "Colombia",
    "code": "CO",
    "dial": "+57",
    "flag": "🇨🇴"
  },
  {
    "name": "Comoros",
    "code": "KM",
    "dial": "+269",
    "flag": "🇰🇲"
  },
  {
    "name": "Congo",
    "code": "CG",
    "dial": "+242",
    "flag": "🇨🇬"
  },
  {
    "name": "Congo (DRC)",
    "code": "CD",
    "dial": "+243",
    "flag": "🇨🇩"
  },
  {
    "name": "Cook Islands",
    "code": "CK",
    "dial": "+682",
    "flag": "🇨🇰"
  },
  {
    "name": "Costa Rica",
    "code": "CR",
    "dial": "+506",
    "flag": "🇨🇷"
  },
  {
    "name": "Cote d'Ivoire",
    "code": "CI",
    "dial": "+225",
    "flag": "🇨🇮"
  },
  {
    "name": "Croatia",
    "code": "HR",
    "dial": "+385",
    "flag": "🇭🇷"
  },
  {
    "name": "Cuba",
    "code": "CU",
    "dial": "+53",
    "flag": "🇨🇺"
  },
  {
    "name": "Curacao",
    "code": "CW",
    "dial": "+599",
    "flag": "🇨🇼"
  },
  {
    "name": "Cyprus",
    "code": "CY",
    "dial": "+357",
    "flag": "🇨🇾"
  },
  {
    "name": "Czech Republic",
    "code": "CZ",
    "dial": "+420",
    "flag": "🇨🇿"
  },
  {
    "name": "Denmark",
    "code": "DK",
    "dial": "+45",
    "flag": "🇩🇰"
  },
  {
    "name": "Djibouti",
    "code": "DJ",
    "dial": "+253",
    "flag": "🇩🇯"
  },
  {
    "name": "Dominica",
    "code": "DM",
    "dial": "+1767",
    "flag": "🇩🇲"
  },
  {
    "name": "Dominican Republic",
    "code": "DO",
    "dial": "+1809",
    "flag": "🇩🇴"
  },
  {
    "name": "Ecuador",
    "code": "EC",
    "dial": "+593",
    "flag": "🇪🇨"
  },
  {
    "name": "Egypt",
    "code": "EG",
    "dial": "+20",
    "flag": "🇪🇬"
  },
  {
    "name": "El Salvador",
    "code": "SV",
    "dial": "+503",
    "flag": "🇸🇻"
  },
  {
    "name": "Equatorial Guinea",
    "code": "GQ",
    "dial": "+240",
    "flag": "🇬🇶"
  },
  {
    "name": "Eritrea",
    "code": "ER",
    "dial": "+291",
    "flag": "🇪🇷"
  },
  {
    "name": "Estonia",
    "code": "EE",
    "dial": "+372",
    "flag": "🇪🇪"
  },
  {
    "name": "Eswatini",
    "code": "SZ",
    "dial": "+268",
    "flag": "🇸🇿"
  },
  {
    "name": "Ethiopia",
    "code": "ET",
    "dial": "+251",
    "flag": "🇪🇹"
  },
  {
    "name": "Faroe Islands",
    "code": "FO",
    "dial": "+298",
    "flag": "🇫🇴"
  },
  {
    "name": "Fiji",
    "code": "FJ",
    "dial": "+679",
    "flag": "🇫🇯"
  },
  {
    "name": "Finland",
    "code": "FI",
    "dial": "+358",
    "flag": "🇫🇮"
  },
  {
    "name": "France",
    "code": "FR",
    "dial": "+33",
    "flag": "🇫🇷"
  },
  {
    "name": "French Guiana",
    "code": "GF",
    "dial": "+594",
    "flag": "🇬🇫"
  },
  {
    "name": "French Polynesia",
    "code": "PF",
    "dial": "+689",
    "flag": "🇵🇫"
  },
  {
    "name": "Gabon",
    "code": "GA",
    "dial": "+241",
    "flag": "🇬🇦"
  },
  {
    "name": "Gambia",
    "code": "GM",
    "dial": "+220",
    "flag": "🇬🇲"
  },
  {
    "name": "Georgia (საქართველო)",
    "code": "GE",
    "dial": "+995",
    "flag": "🇬🇪"
  },
  {
    "name": "Germany (Deutschland)",
    "code": "DE",
    "dial": "+49",
    "flag": "🇩🇪"
  },
  {
    "name": "Ghana",
    "code": "GH",
    "dial": "+233",
    "flag": "🇬🇭"
  },
  {
    "name": "Gibraltar",
    "code": "GI",
    "dial": "+350",
    "flag": "🇬🇮"
  },
  {
    "name": "Greece (Ελλάδα)",
    "code": "GR",
    "dial": "+30",
    "flag": "🇬🇷"
  },
  {
    "name": "Greenland",
    "code": "GL",
    "dial": "+299",
    "flag": "🇬🇱"
  },
  {
    "name": "Grenada",
    "code": "GD",
    "dial": "+1473",
    "flag": "🇬🇩"
  },
  {
    "name": "Guadeloupe",
    "code": "GP",
    "dial": "+590",
    "flag": "🇬🇵"
  },
  {
    "name": "Guam",
    "code": "GU",
    "dial": "+1671",
    "flag": "🇬🇺"
  },
  {
    "name": "Guatemala",
    "code": "GT",
    "dial": "+502",
    "flag": "🇬🇹"
  },
  {
    "name": "Guernsey",
    "code": "GG",
    "dial": "+44",
    "flag": "🇬🇬"
  },
  {
    "name": "Guinea",
    "code": "GN",
    "dial": "+224",
    "flag": "🇬🇳"
  },
  {
    "name": "Guinea-Bissau",
    "code": "GW",
    "dial": "+245",
    "flag": "🇬🇼"
  },
  {
    "name": "Guyana",
    "code": "GY",
    "dial": "+592",
    "flag": "🇬🇾"
  },
  {
    "name": "Haiti",
    "code": "HT",
    "dial": "+509",
    "flag": "🇭🇹"
  },
  {
    "name": "Honduras",
    "code": "HN",
    "dial": "+504",
    "flag": "🇭🇳"
  },
  {
    "name": "Hong Kong",
    "code": "HK",
    "dial": "+852",
    "flag": "🇭🇰"
  },
  {
    "name": "Hungary",
    "code": "HU",
    "dial": "+36",
    "flag": "🇭🇺"
  },
  {
    "name": "Iceland",
    "code": "IS",
    "dial": "+354",
    "flag": "🇮🇸"
  },
  {
    "name": "India",
    "code": "IN",
    "dial": "+91",
    "flag": "🇮🇳"
  },
  {
    "name": "Indonesia",
    "code": "ID",
    "dial": "+62",
    "flag": "🇮🇩"
  },
  {
    "name": "Iran",
    "code": "IR",
    "dial": "+98",
    "flag": "🇮🇷"
  },
  {
    "name": "Iraq",
    "code": "IQ",
    "dial": "+964",
    "flag": "🇮🇶"
  },
  {
    "name": "Ireland",
    "code": "IE",
    "dial": "+353",
    "flag": "🇮🇪"
  },
  {
    "name": "Isle of Man",
    "code": "IM",
    "dial": "+44",
    "flag": "🇮🇲"
  },
  {
    "name": "Israel",
    "code": "IL",
    "dial": "+972",
    "flag": "🇮🇱"
  },
  {
    "name": "Italy",
    "code": "IT",
    "dial": "+39",
    "flag": "🇮🇹"
  },
  {
    "name": "Jamaica",
    "code": "JM",
    "dial": "+1876",
    "flag": "🇯🇲"
  },
  {
    "name": "Japan",
    "code": "JP",
    "dial": "+81",
    "flag": "🇯🇵"
  },
  {
    "name": "Jersey",
    "code": "JE",
    "dial": "+44",
    "flag": "🇯🇪"
  },
  {
    "name": "Jordan",
    "code": "JO",
    "dial": "+962",
    "flag": "🇯🇴"
  },
  {
    "name": "Kenya",
    "code": "KE",
    "dial": "+254",
    "flag": "🇰🇪"
  },
  {
    "name": "Kiribati",
    "code": "KI",
    "dial": "+686",
    "flag": "🇰🇮"
  },
  {
    "name": "Kosovo",
    "code": "XK",
    "dial": "+383",
    "flag": "🇽🇰"
  },
  {
    "name": "Kuwait",
    "code": "KW",
    "dial": "+965",
    "flag": "🇰🇼"
  },
  {
    "name": "Kyrgyzstan (Кыргызстан)",
    "code": "KG",
    "dial": "+996",
    "flag": "🇰🇬"
  },
  {
    "name": "Laos",
    "code": "LA",
    "dial": "+856",
    "flag": "🇱🇦"
  },
  {
    "name": "Latvia",
    "code": "LV",
    "dial": "+371",
    "flag": "🇱🇻"
  },
  {
    "name": "Lebanon",
    "code": "LB",
    "dial": "+961",
    "flag": "🇱🇧"
  },
  {
    "name": "Lesotho",
    "code": "LS",
    "dial": "+266",
    "flag": "🇱🇸"
  },
  {
    "name": "Liberia",
    "code": "LR",
    "dial": "+231",
    "flag": "🇱🇷"
  },
  {
    "name": "Libya",
    "code": "LY",
    "dial": "+218",
    "flag": "🇱🇾"
  },
  {
    "name": "Liechtenstein",
    "code": "LI",
    "dial": "+423",
    "flag": "🇱🇮"
  },
  {
    "name": "Lithuania",
    "code": "LT",
    "dial": "+370",
    "flag": "🇱🇹"
  },
  {
    "name": "Luxembourg",
    "code": "LU",
    "dial": "+352",
    "flag": "🇱🇺"
  },
  {
    "name": "Macau",
    "code": "MO",
    "dial": "+853",
    "flag": "🇲🇴"
  },
  {
    "name": "Madagascar",
    "code": "MG",
    "dial": "+261",
    "flag": "🇲🇬"
  },
  {
    "name": "Malawi",
    "code": "MW",
    "dial": "+265",
    "flag": "🇲🇼"
  },
  {
    "name": "Malaysia",
    "code": "MY",
    "dial": "+60",
    "flag": "🇲🇾"
  },
  {
    "name": "Maldives",
    "code": "MV",
    "dial": "+960",
    "flag": "🇲🇻"
  },
  {
    "name": "Mali",
    "code": "ML",
    "dial": "+223",
    "flag": "🇲🇱"
  },
  {
    "name": "Malta",
    "code": "MT",
    "dial": "+356",
    "flag": "🇲🇹"
  },
  {
    "name": "Marshall Islands",
    "code": "MH",
    "dial": "+692",
    "flag": "🇲🇭"
  },
  {
    "name": "Martinique",
    "code": "MQ",
    "dial": "+596",
    "flag": "🇲🇶"
  },
  {
    "name": "Mauritania",
    "code": "MR",
    "dial": "+222",
    "flag": "🇲🇷"
  },
  {
    "name": "Mauritius",
    "code": "MU",
    "dial": "+230",
    "flag": "🇲🇺"
  },
  {
    "name": "Mexico",
    "code": "MX",
    "dial": "+52",
    "flag": "🇲🇽"
  },
  {
    "name": "Micronesia",
    "code": "FM",
    "dial": "+691",
    "flag": "🇫🇲"
  },
  {
    "name": "Moldova (Moldova)",
    "code": "MD",
    "dial": "+373",
    "flag": "🇲🇩"
  },
  {
    "name": "Monaco",
    "code": "MC",
    "dial": "+377",
    "flag": "🇲🇨"
  },
  {
    "name": "Mongolia",
    "code": "MN",
    "dial": "+976",
    "flag": "🇲🇳"
  },
  {
    "name": "Montenegro",
    "code": "ME",
    "dial": "+382",
    "flag": "🇲🇪"
  },
  {
    "name": "Montserrat",
    "code": "MS",
    "dial": "+1664",
    "flag": "🇲🇸"
  },
  {
    "name": "Morocco",
    "code": "MA",
    "dial": "+212",
    "flag": "🇲🇦"
  },
  {
    "name": "Mozambique",
    "code": "MZ",
    "dial": "+258",
    "flag": "🇲🇿"
  },
  {
    "name": "Myanmar",
    "code": "MM",
    "dial": "+95",
    "flag": "🇲🇲"
  },
  {
    "name": "Namibia",
    "code": "NA",
    "dial": "+264",
    "flag": "🇳🇦"
  },
  {
    "name": "Nauru",
    "code": "NR",
    "dial": "+674",
    "flag": "🇳🇷"
  },
  {
    "name": "Nepal",
    "code": "NP",
    "dial": "+977",
    "flag": "🇳🇵"
  },
  {
    "name": "Netherlands",
    "code": "NL",
    "dial": "+31",
    "flag": "🇳🇱"
  },
  {
    "name": "New Caledonia",
    "code": "NC",
    "dial": "+687",
    "flag": "🇳🇨"
  },
  {
    "name": "New Zealand",
    "code": "NZ",
    "dial": "+64",
    "flag": "🇳🇿"
  },
  {
    "name": "Nicaragua",
    "code": "NI",
    "dial": "+505",
    "flag": "🇳🇮"
  },
  {
    "name": "Niger",
    "code": "NE",
    "dial": "+227",
    "flag": "🇳🇪"
  },
  {
    "name": "Nigeria",
    "code": "NG",
    "dial": "+234",
    "flag": "🇳🇬"
  },
  {
    "name": "North Korea",
    "code": "KP",
    "dial": "+850",
    "flag": "🇰🇵"
  },
  {
    "name": "North Macedonia",
    "code": "MK",
    "dial": "+389",
    "flag": "🇲🇰"
  },
  {
    "name": "Norway",
    "code": "NO",
    "dial": "+47",
    "flag": "🇳🇴"
  },
  {
    "name": "Oman",
    "code": "OM",
    "dial": "+968",
    "flag": "🇴🇲"
  },
  {
    "name": "Pakistan",
    "code": "PK",
    "dial": "+92",
    "flag": "🇵🇰"
  },
  {
    "name": "Palau",
    "code": "PW",
    "dial": "+680",
    "flag": "🇵🇼"
  },
  {
    "name": "Palestine",
    "code": "PS",
    "dial": "+970",
    "flag": "🇵🇸"
  },
  {
    "name": "Panama",
    "code": "PA",
    "dial": "+507",
    "flag": "🇵🇦"
  },
  {
    "name": "Papua New Guinea",
    "code": "PG",
    "dial": "+675",
    "flag": "🇵🇬"
  },
  {
    "name": "Paraguay",
    "code": "PY",
    "dial": "+595",
    "flag": "🇵🇾"
  },
  {
    "name": "Peru",
    "code": "PE",
    "dial": "+51",
    "flag": "🇵🇪"
  },
  {
    "name": "Philippines",
    "code": "PH",
    "dial": "+63",
    "flag": "🇵🇭"
  },
  {
    "name": "Poland",
    "code": "PL",
    "dial": "+48",
    "flag": "🇵🇱"
  },
  {
    "name": "Portugal",
    "code": "PT",
    "dial": "+351",
    "flag": "🇵🇹"
  },
  {
    "name": "Puerto Rico",
    "code": "PR",
    "dial": "+1787",
    "flag": "🇵🇷"
  },
  {
    "name": "Qatar",
    "code": "QA",
    "dial": "+974",
    "flag": "🇶🇦"
  },
  {
    "name": "Reunion",
    "code": "RE",
    "dial": "+262",
    "flag": "🇷🇪"
  },
  {
    "name": "Romania",
    "code": "RO",
    "dial": "+40",
    "flag": "🇷🇴"
  },
  {
    "name": "Rwanda",
    "code": "RW",
    "dial": "+250",
    "flag": "🇷🇼"
  },
  {
    "name": "Saint Kitts and Nevis",
    "code": "KN",
    "dial": "+1869",
    "flag": "🇰🇳"
  },
  {
    "name": "Saint Lucia",
    "code": "LC",
    "dial": "+1758",
    "flag": "🇱🇨"
  },
  {
    "name": "Saint Vincent and the Grenadines",
    "code": "VC",
    "dial": "+1784",
    "flag": "🇻🇨"
  },
  {
    "name": "Samoa",
    "code": "WS",
    "dial": "+685",
    "flag": "🇼🇸"
  },
  {
    "name": "San Marino",
    "code": "SM",
    "dial": "+378",
    "flag": "🇸🇲"
  },
  {
    "name": "Sao Tome and Principe",
    "code": "ST",
    "dial": "+239",
    "flag": "🇸🇹"
  },
  {
    "name": "Saudi Arabia",
    "code": "SA",
    "dial": "+966",
    "flag": "🇸🇦"
  },
  {
    "name": "Senegal",
    "code": "SN",
    "dial": "+221",
    "flag": "🇸🇳"
  },
  {
    "name": "Serbia",
    "code": "RS",
    "dial": "+381",
    "flag": "🇷🇸"
  },
  {
    "name": "Seychelles",
    "code": "SC",
    "dial": "+248",
    "flag": "🇸🇨"
  },
  {
    "name": "Sierra Leone",
    "code": "SL",
    "dial": "+232",
    "flag": "🇸🇱"
  },
  {
    "name": "Singapore",
    "code": "SG",
    "dial": "+65",
    "flag": "🇸🇬"
  },
  {
    "name": "Sint Maarten",
    "code": "SX",
    "dial": "+1721",
    "flag": "🇸🇽"
  },
  {
    "name": "Slovakia",
    "code": "SK",
    "dial": "+421",
    "flag": "🇸🇰"
  },
  {
    "name": "Slovenia",
    "code": "SI",
    "dial": "+386",
    "flag": "🇸🇮"
  },
  {
    "name": "Solomon Islands",
    "code": "SB",
    "dial": "+677",
    "flag": "🇸🇧"
  },
  {
    "name": "Somalia",
    "code": "SO",
    "dial": "+252",
    "flag": "🇸🇴"
  },
  {
    "name": "South Africa",
    "code": "ZA",
    "dial": "+27",
    "flag": "🇿🇦"
  },
  {
    "name": "South Korea",
    "code": "KR",
    "dial": "+82",
    "flag": "🇰🇷"
  },
  {
    "name": "South Sudan",
    "code": "SS",
    "dial": "+211",
    "flag": "🇸🇸"
  },
  {
    "name": "Spain",
    "code": "ES",
    "dial": "+34",
    "flag": "🇪🇸"
  },
  {
    "name": "Sri Lanka",
    "code": "LK",
    "dial": "+94",
    "flag": "🇱🇰"
  },
  {
    "name": "Sudan",
    "code": "SD",
    "dial": "+249",
    "flag": "🇸🇩"
  },
  {
    "name": "Suriname",
    "code": "SR",
    "dial": "+597",
    "flag": "🇸🇷"
  },
  {
    "name": "Sweden",
    "code": "SE",
    "dial": "+46",
    "flag": "🇸🇪"
  },
  {
    "name": "Switzerland",
    "code": "CH",
    "dial": "+41",
    "flag": "🇨🇭"
  },
  {
    "name": "Syria",
    "code": "SY",
    "dial": "+963",
    "flag": "🇸🇾"
  },
  {
    "name": "Taiwan",
    "code": "TW",
    "dial": "+886",
    "flag": "🇹🇼"
  },
  {
    "name": "Tajikistan (Тоҷикистон)",
    "code": "TJ",
    "dial": "+992",
    "flag": "🇹🇯"
  },
  {
    "name": "Tanzania",
    "code": "TZ",
    "dial": "+255",
    "flag": "🇹🇿"
  },
  {
    "name": "Thailand",
    "code": "TH",
    "dial": "+66",
    "flag": "🇹🇭"
  },
  {
    "name": "Timor-Leste",
    "code": "TL",
    "dial": "+670",
    "flag": "🇹🇱"
  },
  {
    "name": "Togo",
    "code": "TG",
    "dial": "+228",
    "flag": "🇹🇬"
  },
  {
    "name": "Tonga",
    "code": "TO",
    "dial": "+676",
    "flag": "🇹🇴"
  },
  {
    "name": "Trinidad and Tobago",
    "code": "TT",
    "dial": "+1868",
    "flag": "🇹🇹"
  },
  {
    "name": "Tunisia",
    "code": "TN",
    "dial": "+216",
    "flag": "🇹🇳"
  },
  {
    "name": "Turkey",
    "code": "TR",
    "dial": "+90",
    "flag": "🇹🇷"
  },
  {
    "name": "Turkmenistan",
    "code": "TM",
    "dial": "+993",
    "flag": "🇹🇲"
  },
  {
    "name": "Turks and Caicos Islands",
    "code": "TC",
    "dial": "+1649",
    "flag": "🇹🇨"
  },
  {
    "name": "Tuvalu",
    "code": "TV",
    "dial": "+688",
    "flag": "🇹🇻"
  },
  {
    "name": "Uganda",
    "code": "UG",
    "dial": "+256",
    "flag": "🇺🇬"
  },
  {
    "name": "United Arab Emirates",
    "code": "AE",
    "dial": "+971",
    "flag": "🇦🇪"
  },
  {
    "name": "United Kingdom",
    "code": "GB",
    "dial": "+44",
    "flag": "🇬🇧"
  },
  {
    "name": "United States",
    "code": "US",
    "dial": "+1",
    "flag": "🇺🇸"
  },
  {
    "name": "Uruguay",
    "code": "UY",
    "dial": "+598",
    "flag": "🇺🇾"
  },
  {
    "name": "Uzbekistan (Oʻzbekiston)",
    "code": "UZ",
    "dial": "+998",
    "flag": "🇺🇿"
  },
  {
    "name": "Vanuatu",
    "code": "VU",
    "dial": "+678",
    "flag": "🇻🇺"
  },
  {
    "name": "Vatican City",
    "code": "VA",
    "dial": "+39",
    "flag": "🇻🇦"
  },
  {
    "name": "Venezuela",
    "code": "VE",
    "dial": "+58",
    "flag": "🇻🇪"
  },
  {
    "name": "Vietnam",
    "code": "VN",
    "dial": "+84",
    "flag": "🇻🇳"
  },
  {
    "name": "Yemen",
    "code": "YE",
    "dial": "+967",
    "flag": "🇾🇪"
  },
  {
    "name": "Zambia",
    "code": "ZM",
    "dial": "+260",
    "flag": "🇿🇲"
  },
  {
    "name": "Zimbabwe",
    "code": "ZW",
    "dial": "+263",
    "flag": "🇿🇼"
  }
];

/**
 * Open "Choose country" Bottom Sheet
 * @param {{ onSelect: (country: { name: string, code: string, dial: string, flag: string }) => void, currentDial?: string }} options
 */
window.openCountryPicker = function(options) {
  options = options || {};
  var existingBackdrop = document.getElementById("country-sheet-backdrop");
  var existingSheet = document.getElementById("country-bottom-sheet");
  if (existingBackdrop) existingBackdrop.remove();
  if (existingSheet) existingSheet.remove();

  var backdrop = document.createElement("div");
  backdrop.id = "country-sheet-backdrop";
  backdrop.className = "login-backdrop country-backdrop";
  backdrop.style.cssText = "z-index: 200049 !important;";

  var sheet = document.createElement("div");
  sheet.id = "country-bottom-sheet";
  sheet.className = "login-bottom-sheet country-bottom-sheet";
  sheet.style.cssText = "z-index: 200050 !important;";

  sheet.innerHTML = `
    <div class="login-sheet-header">
      <h3 class="login-sheet-title">Choose country</h3>
      <button type="button" class="login-sheet-close" id="btn-close-country-sheet" aria-label="Close">✕</button>
    </div>
    <div class="login-sheet-body" style="padding: 12px 18px 24px; display: flex; flex-direction: column;">
      <div class="country-sheet-search-wrap">
        <svg class="country-sheet-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input type="text" class="country-sheet-search-input" id="country-sheet-search" placeholder="Search" autocomplete="off" />
      </div>
      <div class="country-sheet-list-card" id="country-sheet-list"></div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);

  var searchInput = sheet.querySelector("#country-sheet-search");
  var listContainer = sheet.querySelector("#country-sheet-list");
  var closeBtn = sheet.querySelector("#btn-close-country-sheet");

  function renderList(query) {
    var q = (query || "").toLowerCase().trim();
    var filtered = window.WORLD_COUNTRIES.filter(function(c) {
      if (!q) return true;
      var cleanDial = c.dial.replace("+", "");
      var cleanQ = q.replace("+", "");
      return c.name.toLowerCase().includes(q) ||
             c.code.toLowerCase().includes(q) ||
             c.dial.includes(q) ||
             cleanDial.startsWith(cleanQ);
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = '<div class="country-picker-empty">No countries found</div>';
      return;
    }

    var html = "";
    filtered.forEach(function(c) {
      var isSelected = options.currentDial && (options.currentDial === c.dial);
      html += `
        <button type="button" class="country-row-item ${isSelected ? 'selected' : ''}" data-code="${c.code}" data-dial="${c.dial}">
          <span class="country-row-flag-circle">${c.flag}</span>
          <span class="country-row-dial">${c.dial}</span>
          <span class="country-row-name">${c.name}</span>
        </button>
      `;
    });
    listContainer.innerHTML = html;

    listContainer.querySelectorAll(".country-row-item").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var code = btn.getAttribute("data-code");
        var dial = btn.getAttribute("data-dial");
        var found = window.WORLD_COUNTRIES.find(function(c) { return c.code === code && c.dial === dial; });
        if (found && typeof options.onSelect === "function") {
          options.onSelect(found);
        }
        closeSheet();
      });
    });
  }

  function closeSheet(isFromPopstate) {
    if (typeof window.popModalHistory === "function") {
      window.popModalHistory("country-picker", isFromPopstate);
    }
    sheet.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    setTimeout(function() {
      if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    }, 320);
    document.removeEventListener("keydown", onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      closeSheet();
    }
  }

  closeBtn.addEventListener("click", function() { closeSheet(); });
  backdrop.addEventListener("click", function() { closeSheet(); });

  searchInput.addEventListener("input", function(e) {
    renderList(e.target.value);
  });

  document.addEventListener("keydown", onKeyDown);

  // Initial render & animate in matching login sheet animation
  renderList("");
  requestAnimationFrame(function() {
    backdrop.classList.add("is-visible");
    sheet.classList.add("is-open");
    if (typeof window.pushModalHistory === "function") {
      window.pushModalHistory("country-picker", function(fromPop) {
        closeSheet(fromPop);
      });
    }
    setTimeout(function() {
      try { searchInput.focus(); } catch (_) {}
    }, 100);
  });
};
