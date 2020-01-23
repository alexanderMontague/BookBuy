const guelphCourses = [
  { label: "ACCT (Accounting)", value: "ACCT" },
  { label: "AGR (Agriculture)", value: "AGR" },
  { label: "ANSC (Animal Science)", value: "ANSC" },
  { label: "ANTH (Anthropology)", value: "ANTH" },
  { label: "ARTH (Art History)", value: "ARTH" },
  { label: "ASCI (Arts and Science)", value: "ASCI" },
  { label: "BIOC (Biochemistry)", value: "BIOC" },
  { label: "BIOL (Biology)", value: "BIOL" },
  { label: "BIOM (Biomedical Science)", value: "BIOM" },
  { label: "BOT (Botany)", value: "BOT" },
  { label: "BUS (Business)", value: "BUS" },
  { label: "CHEM (Chemistry)", value: "CHEM" },
  { label: "CHIN (Chinese)", value: "CHIN" },
  { label: "CLAS (Classical Studies)", value: "CLAS" },
  { label: "CIS (Computing & Information Science)", value: "CIS" },
  { label: "COOP (Co-operative Education)", value: "COOP" },
  { label: "COST/MCS (Consumer Studies)", value: "COST/MCS" },
  { label: "CROP (Crop Science)", value: "CROP" },
  { label: "DRMA (Drama)", value: "DRMA" },
  { label: "ECON (Economics)", value: "ECON" },
  {
    label: "EDRD (Environmental Design & Rural Development)",
    value: "EDRD"
  },
  { label: "ENGG (Engineering)", value: "ENGG" },
  { label: "ENGL (English)", value: "ENGL" },
  { label: "ENVB (Environmental Biology)", value: "ENVB" },
  { label: "ENVM (Environmental Management)", value: "ENVM" },
  { label: "ENVS (Environmental Sciences)", value: "ENVS" },
  { label: "EQN (Equine)", value: "EQN" },
  { label: "EURO (European Studies)", value: "EURO" },
  { label: "FARE (Food, Agricultural and Resource Economics)", value: "FARE" },
  { label: "FOOD (Food Science)", value: "FOOD" },
  { label: "FREN (French Studies)", value: "FREN" },
  { label: "FIN (Financial)", value: "FIN" },
  { label: "FRHD (Family Relations and Human Development)", value: "FRHD" },
  { label: "GEOG (Geography)", value: "GEOG" },
  { label: "GEOL (Geology)", value: "GEOL" },
  { label: "GERM (German Studies)", value: "GERM" },
  { label: "GREK (Greek Studies)", value: "GREK" },
  { label: "HISP (Hispanic Studies)", value: "HISP" },
  { label: "HIST (History)", value: "HIST" },
  { label: "HK (Human Kinetics)", value: "HK" },
  { label: "HMN (Humanities)", value: "HMN" },
  { label: "HORT (Horticultural Science)", value: "HORT" },
  {
    label: "HROB (Human Resources and Organizational Behaviour)",
    value: "HROB"
  },
  { label: "HTM (Hospitality and Tourism Managment)", value: "HTM" },
  { label: "INDG (Indigenous)", value: "INDG" },
  { label: "IBIO (Intergrative Biology)", value: "IBIO" },
  { label: "IDEV (International Development)", value: "IDEV" },
  { label: "IPS (Interdisciplinary Physical Science)", value: "IPS" },
  { label: "ISS (Interdisciplinary Social Science)", value: "ISS" },
  { label: "ITAL (Italian)", value: "ITAL" },
  { label: "LARC (Landscape Architecture)", value: "LARC" },
  { label: "LAT (Latin)", value: "LAT" },
  { label: "LING (Linguistics)", value: "LING" },
  { label: "MATH (Mathematics)", value: "MATH" },
  { label: "MBG (Molecular Biology & Genetics)", value: "MBG" },
  { label: "MCB (Molecular and Cellular Biology)", value: "MCB" },
  { label: "MCS (Marketing and Consumer Studies)", value: "MCS" },
  { label: "MET (Meteorology)", value: "MET" },
  { label: "MGMT (Management)", value: "MGMT" },
  { label: "MICR (Microbiology)", value: "MICR" },
  { label: "MUSC (Music)", value: "MUSC" },
  { label: "NANO (Nanoscience)", value: "NANO" },
  { label: "NEUR (Neuroscience)", value: "NEUR" },
  { label: "NRS (Natural Resource Sciences)", value: "NRS" },
  { label: "NUTR (Nutrition)", value: "NUTR" },
  { label: "OAGR (Organic Agriculture)", value: "OAGR" },
  { label: "OPEN (Open Learning non-coded courses)", value: "OPEN" },
  { label: "PATH (Pathology)", value: "PATH" },
  { label: "PBIO (Plant Biology)", value: "PBIO" },
  { label: "PHIL (Philosophy)", value: "PHIL" },
  { label: "PHYS (Physics)", value: "PHYS" },
  { label: "PORT (Portugeuse)", value: "PORT" },
  { label: "POLS (Political Science)", value: "POLS" },
  { label: "POPM (Population Medicine)", value: "POPM" },
  { label: "PSYC (Psychology)", value: "PSYC" },
  { label: "REAL (Real Estate and Housing)", value: "REAL" },
  { label: "REXT (Rural Extension Studies)", value: "REXT" },
  { label: "SART (Studio Arts)", value: "SART" },
  { label: "SOAN (Sociology and Anthropology)", value: "SOAN" },
  { label: "SOC (Sociology)", value: "SOC" },
  { label: "SOIL (Soil Science)", value: "SOIL" },
  { label: "SPAN (Spanish)", value: "SPAN" },
  { label: "STAT (Statistics)", value: "STAT" },
  { label: "THST (Theatre Studies)", value: "THST" },
  { label: "TOX (Toxicology)", value: "TOX" },
  { label: "UNIV (Interdisciplinary University)", value: "UNIV" },
  { label: "VETM (Veterinary Medicine)", value: "VETM" },
  { label: "WMST (Women's Studies)", value: "WMST" },
  { label: "ZOO (Zoology)", value: "ZOO" }
];

export default guelphCourses;