/**
 * Famous players per national team (display names for craque picker).
 * Keys match `home_team_name` / `away_team_name` from the World Cup catalog.
 */
export const TEAM_FAMOUS_PLAYERS: Record<string, readonly string[]> = {
  Algeria: ['Riyad Mahrez', 'Ismaël Bennacer', 'Youcef Atal'],
  Argentina: ['Lionel Messi', 'Julián Álvarez', 'Enzo Fernández'],
  Australia: ['Mathew Ryan', 'Harry Souttar', 'Mitchell Duke'],
  Austria: ['David Alaba', 'Marcel Sabitzer', 'Marko Arnautović'],
  Belgium: ['Kevin De Bruyne', 'Romelu Lukaku', 'Thibaut Courtois'],
  'Bosnia & Herzegovina': ['Edin Džeko', 'Miralem Pjanić', 'Sead Kolašinac'],
  'Bosnia-Herzegovina': ['Edin Džeko', 'Miralem Pjanić', 'Sead Kolašinac'],
  Brazil: ['Neymar', 'Vini Jr.', 'Rodrygo'],
  Brasil: ['Neymar', 'Vini Jr.', 'Rodrygo'],
  Cameroon: ['André Onana', 'Vincent Aboubakar', 'Bryan Mbeumo'],
  Canada: ['Alphonso Davies', 'Jonathan David', 'Cyle Larin'],
  'Cape Verde': ['Ryan Mendes', 'Jovane Cabral', 'Garry Rodrigues'],
  Chile: ['Alexis Sánchez', 'Arturo Vidal', 'Eduardo Vargas'],
  Colombia: ['James Rodríguez', 'Luis Díaz', 'Radamel Falcao'],
  'Costa Rica': ['Keylor Navas', 'Joel Campbell', 'Bryan Ruiz'],
  Croatia: ['Luka Modrić', 'Joško Gvardiol', 'Marko Livaja'],
  Curaçao: ['Leandro Bacuna', 'Cuco Martina', 'Elson Hooi'],
  'Czech Republic': ['Tomáš Souček', 'Patrik Schick', 'Vladimír Coufal'],
  Denmark: ['Christian Eriksen', 'Rasmus Højlund', 'Kasper Schmeichel'],
  Ecuador: ['Enner Valencia', 'Moisés Caicedo', 'Pervis Estupiñán'],
  Egypt: ['Mohamed Salah', 'Mohamed Elneny', 'Omar Marmoush'],
  England: ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka'],
  Inglaterra: ['Harry Kane', 'Jude Bellingham', 'Bukayo Saka'],
  Germany: ['Jamal Musiala', 'Florian Wirtz', 'Manuel Neuer'],
  Alemanha: ['Jamal Musiala', 'Florian Wirtz', 'Manuel Neuer'],
  Ghana: ['Mohammed Kudus', 'Thomas Partey', 'Jordan Ayew'],
  Greece: ['Konstantinos Tsimikas', 'Giorgos Masouras', 'Odysseas Vlachodimos'],
  Haiti: ['Duckens Nazon', 'Frantzdy Pierrot', 'Zachary Herivaux'],
  Iran: ['Mehdi Taremi', 'Sardar Azmoun', 'Alireza Jahanbakhsh'],
  Iraq: ['Mohanad Ali', 'Aymen Hussein', 'Zaid Mahdi'],
  'Ivory Coast': ['Nicolas Pépé', 'Sébastien Haller', 'Franck Kessié'],
  Japan: ['Takefusa Kubo', 'Kaoru Mitoma', 'Wataru Endo'],
  Jordan: ['Yazan Al-Naimat', 'Mousa Al-Taamari', 'Husam Al-Saabi'],
  Mexico: ['Guillermo Ochoa', 'Hirving Lozano', 'Raúl Jiménez'],
  Morocco: ['Achraf Hakimi', 'Youssef En-Nesyri', 'Sofyan Amrabat'],
  Netherlands: ['Virgil van Dijk', 'Cody Gakpo', 'Memphis Depay'],
  Holanda: ['Virgil van Dijk', 'Cody Gakpo', 'Memphis Depay'],
  'New Zealand': ['Chris Wood', 'Winston Reid', 'Marco Rojas'],
  Norway: ['Erling Haaland', 'Martin Ødegaard', 'Alexander Sørloth'],
  Panama: ['Aníbal Godoy', 'José Fajardo', 'Adalberto Carrasquilla'],
  Paraguay: ['Miguel Almirón', 'Gustavo Gómez', 'Antonio Sanabria'],
  Peru: ['Paolo Guerrero', 'André Carrillo', 'Gianluca Lapadula'],
  Poland: ['Robert Lewandowski', 'Piotr Zieliński', 'Wojciech Szczęsny'],
  Portugal: ['Cristiano Ronaldo', 'Bruno Fernandes', 'Bernardo Silva'],
  Qatar: ['Almoez Ali', 'Akram Afif', 'Hassan Al-Haydos'],
  Romania: ['Nicolae Stanciu', 'Florin Niță', 'Ianis Hagi'],
  'Saudi Arabia': ['Salem Al-Dawsari', 'Firas Al-Buraikan', 'Mohammed Al-Owais'],
  Scotland: ['Andy Robertson', 'Scott McTominay', 'John McGinn'],
  Senegal: ['Sadio Mané', 'Kalidou Koulibaly', 'Ismaïla Sarr'],
  Serbia: ['Aleksandar Mitrović', 'Dušan Vlahović', 'Sergej Milinković-Savić'],
  'South Africa': ['Percy Tau', 'Ronwen Williams', 'Themba Zwane'],
  'South Korea': ['Son Heung-min', 'Kim Min-jae', 'Lee Kang-in'],
  Spain: ['Pedri', 'Lamine Yamal', 'Álvaro Morata'],
  Espanha: ['Pedri', 'Lamine Yamal', 'Álvaro Morata'],
  Sweden: ['Victor Gyökeres', 'Dejan Kulusevski', 'Emil Forsberg'],
  Switzerland: ['Granit Xhaka', 'Xherdan Shaqiri', 'Manuel Akanji'],
  Tunisia: ['Wahbi Khazri', 'Youssef Msakni', 'Aïssa Mandi'],
  Turkey: ['Hakan Çalhanoğlu', 'Arda Güler', 'Kenan Yıldız'],
  USA: ['Christian Pulisic', 'Weston McKennie', 'Gio Reyna'],
  Uruguay: ['Luis Suárez', 'Darwin Núñez', 'Federico Valverde'],
  Uzbekistan: ['Eldor Shomurodov', 'Jasurbek Yakhshiboyev', 'Odil Khamrobekov'],
  Wales: ['Gareth Bale', 'Aaron Ramsey', 'Daniel James'],
  'DR Congo': ['Yoane Wissa', 'Cédric Bakambu', 'Chancel Mbemba'],
  'Democratic Republic of the Congo': [
    'Yoane Wissa',
    'Cédric Bakambu',
    'Chancel Mbemba',
  ],
  France: ['Kylian Mbappé', 'Antoine Griezmann', 'Ousmane Dembélé'],
  França: ['Kylian Mbappé', 'Antoine Griezmann', 'Ousmane Dembélé'],
}

export function famousPlayersForFixture(
  homeTeamName: string,
  awayTeamName: string
): string[] {
  const seen = new Set<string>()
  const out: string[] = []

  for (const name of [
    ...(TEAM_FAMOUS_PLAYERS[homeTeamName] ?? []),
    ...(TEAM_FAMOUS_PLAYERS[awayTeamName] ?? []),
  ]) {
    if (!seen.has(name)) {
      seen.add(name)
      out.push(name)
    }
  }

  return out
}
