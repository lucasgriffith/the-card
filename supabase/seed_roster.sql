-- WWE Roster Seed Data for The Card
-- Generated from wwe_roster_data_2026.sql
-- Total: ~175 wrestlers across Raw, SmackDown, and NXT

-- ============================================================
-- WRESTLERS
-- ============================================================

INSERT INTO wrestlers (name, slug, brand, image_url, height, weight, finisher, hometown, debut_date, is_active) VALUES

-- RAW MEN (39)
('Akira Tozawa', 'akira-tozawa', 'raw', NULL, '5''7"', 156, 'Top-Rope Senton', 'Kobe, Japan', NULL, true),
('Austin Theory', 'austin-theory', 'raw', NULL, '6''1"', 220, 'A-Town Down', 'Atlanta, Georgia', NULL, true),
('Brock Lesnar', 'brock-lesnar', 'raw', NULL, '6''3"', 290, 'F-5; Kimura Lock', 'Minneapolis, Minnesota', NULL, true),
('Bron Breakker', 'bron-breakker', 'raw', NULL, '6''0"', 250, 'Spear; Breakkensteiner', 'Atlanta, Georgia', NULL, true),
('Bronson Reed', 'bronson-reed', 'raw', NULL, '6''0"', 330, 'Tsunami; Jagged Edge', 'Black Forest, South Australia', NULL, true),
('Brutus Creed', 'brutus-creed', 'raw', NULL, NULL, 285, 'Brutus Ball', 'Lexington, Ohio', NULL, true),
('CM Punk', 'cm-punk', 'raw', NULL, '6''2"', 218, 'Go To Sleep (GTS)', 'Chicago, Illinois', NULL, true),
('Cruz Del Toro', 'cruz-del-toro', 'raw', NULL, '5''7"', 190, 'Gamengiri; Phoenix Splash', 'Cordoba, Veracruz, Mexico', NULL, true),
('Dominik Mysterio', 'dominik-mysterio', 'raw', NULL, '6''1"', 200, 'Frog Splash', 'San Diego, California', NULL, true),
('Dragon Lee', 'dragon-lee', 'raw', NULL, '5''7"', 165, 'Operation Dragon', 'Tala, Jalisco, Mexico', NULL, true),
('El Grande Americano', 'el-grande-americano', 'raw', NULL, '6''3"', 220, 'Running Headbutt', 'Gulf of America', NULL, true),
('Erik', 'erik', 'raw', NULL, '6''1"', 238, 'Death Rowe; Ragnarok', 'Cleveland, Ohio', NULL, true),
('Finn Balor', 'finn-balor', 'raw', NULL, '5''11"', 190, 'Coup de Grace; 1916', 'Bray, County Wicklow, Ireland', NULL, true),
('Grayson Waller', 'grayson-waller', 'raw', NULL, NULL, 204, 'Rolling Thunder Stunner', 'Sydney, Australia', NULL, true),
('GUNTHER', 'gunther', 'raw', NULL, '6''4"', 250, 'The Last Symphony; Powerbomb', 'Vienna, Austria', NULL, true),
('Ivar', 'ivar', 'raw', NULL, '6''2"', 350, 'Samoan Driver; Doomsault', 'Lynn, Massachusetts', NULL, true),
('JD McDonagh', 'jd-mcdonagh', 'raw', NULL, '5''10"', 194, 'Devil Inside', 'Bray, County Wicklow, Ireland', NULL, true),
('Je''Von Evans', 'jevon-evans', 'raw', NULL, '6''5"', 195, 'OG Cutter', 'Greensboro, North Carolina', NULL, true),
('Jey Uso', 'jey-uso', 'raw', NULL, '6''2"', 242, 'Uso Splash', 'San Francisco, California', NULL, true),
('Jimmy Uso', 'jimmy-uso', 'raw', NULL, '6''3"', 251, 'Uso Splash', 'San Francisco, California', NULL, true),
('Joaquin Wilde', 'joaquin-wilde', 'raw', NULL, '5''8"', 180, 'Wilde Thing', 'Chicago, Illinois', NULL, true),
('Julius Creed', 'julius-creed', 'raw', NULL, NULL, 235, 'Unnecessary Clothesline', 'Lexington, Ohio', NULL, true),
('Kofi Kingston', 'kofi-kingston', 'raw', NULL, '6''0"', 212, 'Trouble in Paradise', 'Ghana, West Africa', NULL, true),
('LA Knight', 'la-knight', 'raw', NULL, '6''1"', 240, 'Blunt Force Trauma (BFT)', 'Los Angeles, California', NULL, true),
('Logan Paul', 'logan-paul', 'raw', NULL, '6''2"', 220, 'Paulverizer; Paul From Grace', 'Dorado Beach, Puerto Rico', NULL, true),
('Otis', 'otis', 'raw', NULL, '5''10"', 330, 'World''s Strongest Slam; Caterpillar', 'Superior, Wisconsin', NULL, true),
('Penta', 'penta', 'raw', NULL, '5''11"', 207, 'Mexican Destroyer; Penta Driver', 'Ecatepec, Mexico', NULL, true),
('Pete Dunne', 'pete-dunne', 'raw', NULL, '5''10"', 205, 'The Bitter End', 'Birmingham, England', NULL, true),
('Rey Mysterio', 'rey-mysterio', 'raw', NULL, '5''6"', 175, '619; Frog Splash', 'San Diego, California', NULL, true),
('Roman Reigns', 'roman-reigns', 'raw', NULL, '6''3"', 265, 'Spear', 'Pensacola, Florida', NULL, true),
('Rusev', 'rusev', 'raw', NULL, '6''0"', 270, 'The Accolade', 'Plovdiv, Bulgaria', NULL, true),
('Seth Rollins', 'seth-rollins', 'raw', NULL, '6''1"', 225, 'The Stomp (Curb Stomp)', 'Davenport, Iowa', NULL, true),
('Sheamus', 'sheamus', 'raw', NULL, '6''3"', 267, 'Brogue Kick; Cloverleaf', 'Dublin, Ireland', NULL, true),
('Xavier Woods', 'xavier-woods', 'raw', NULL, '5''11"', 205, 'Limit Break', 'Atlanta, Georgia', NULL, true),
('Bravo Americano', 'bravo-americano', 'raw', NULL, '5''7"', 175, 'Tyler Driver ''97', 'Gulf of America', NULL, true),
('Rayo Americano', 'rayo-americano', 'raw', NULL, '5''10"', 205, 'The Bitter End', 'Gulf of America', NULL, true),
('Original El Grande Americano', 'original-el-grande-americano', 'raw', NULL, '5''8"', 202, 'Diving Headbutt', 'Gulf of America', NULL, true),
('Oba Femi', 'oba-femi', 'raw', NULL, '6''6"', 310, 'Fall From Grace', 'Lagos, Nigeria', NULL, true),
('Danhausen', 'danhausen', 'raw', NULL, '6''7"', 300, NULL, 'Someplace Far Away', NULL, true),

-- RAW WOMEN (19)
('AJ Lee', 'aj-lee', 'raw', NULL, '5''2"', NULL, 'Black Widow; Shining Wizard', 'Union City, New Jersey', NULL, true),
('Asuka', 'asuka', 'raw', NULL, '5''3"', NULL, 'Asuka Lock; Empress Kick', 'Osaka, Japan', NULL, true),
('Bayley', 'bayley', 'raw', NULL, '5''6"', NULL, 'Rose Plant; Bayley Elbow Drop', 'San Jose, California', NULL, true),
('Becky Lynch', 'becky-lynch', 'raw', NULL, '5''6"', NULL, 'Dis-arm-her; Manhandle Slam', 'Dublin, Ireland', NULL, true),
('Brie Bella', 'brie-bella', 'raw', NULL, '5''6"', NULL, 'Bella Buster', 'San Diego, California', NULL, true),
('Ivy Nile', 'ivy-nile', 'raw', NULL, NULL, NULL, 'Dragon Sleeper; Diamond Chain Lock', 'Knoxville, Tennessee', NULL, true),
('IYO SKY', 'iyo-sky', 'raw', NULL, '5''1"', NULL, 'Over The Moonsault', 'Tokyo, Japan', NULL, true),
('Kairi Sane', 'kairi-sane', 'raw', NULL, '5''9"', NULL, 'InSane Elbow', 'Yamaguchi, Japan', NULL, true),
('Liv Morgan', 'liv-morgan', 'raw', NULL, '5''3"', NULL, 'ObLIVion', 'Elmwood Park, New Jersey', NULL, true),
('Lyra Valkyria', 'lyra-valkyria', 'raw', NULL, NULL, NULL, 'The Nightwing; Frog Splash', 'Dublin, Ireland', NULL, true),
('Maxxine Dupri', 'maxxine-dupri', 'raw', NULL, NULL, NULL, 'Cyclone Suplex', 'Sacramento, California', NULL, true),
('Naomi', 'naomi', 'raw', NULL, '5''5"', NULL, 'Split-Legged Moonsault', 'Orlando, Florida', NULL, true),
('Nattie', 'nattie', 'raw', NULL, '5''5"', NULL, 'Sharpshooter', 'Calgary, Alberta, Canada', NULL, true),
('Nikki Bella', 'nikki-bella', 'raw', NULL, '5''6"', NULL, 'Rack Attack 2.0', 'Scottsdale, Arizona', NULL, true),
('Raquel Rodriguez', 'raquel-rodriguez', 'raw', NULL, '6''0"', NULL, 'Tejana Bomb', 'Rio Grande Valley, Texas', NULL, true),
('Rhea Ripley', 'rhea-ripley', 'raw', NULL, '5''7"', NULL, 'Riptide; Prism', 'Adelaide, South Australia', NULL, true),
('Roxanne Perez', 'roxanne-perez', 'raw', NULL, NULL, NULL, 'Pop Rox', 'Laredo, Texas', NULL, true),
('Stephanie Vaquer', 'stephanie-vaquer', 'raw', NULL, NULL, NULL, 'SVB; Corkscrew Moonsault', 'San Fernando, Chile', NULL, true),
('Zoey Stark', 'zoey-stark', 'raw', NULL, NULL, NULL, 'Z-360', 'Las Vegas, Nevada', NULL, true),

-- SMACKDOWN MEN (37)
('Aleister Black', 'aleister-black', 'smackdown', NULL, NULL, 215, 'Black Mass; Dark Ritual', 'Amsterdam, Netherlands', NULL, true),
('Alex Shelley', 'alex-shelley', 'smackdown', NULL, '5''10"', 210, 'Shell Shock; Sliced Bread #2', 'Detroit, Michigan', NULL, true),
('Angel', 'angel', 'smackdown', NULL, '5''9"', 205, 'Wing Clipper', 'Monterrey, Mexico', NULL, true),
('Angelo Dawkins', 'angelo-dawkins', 'smackdown', NULL, '6''5"', 260, 'Sky High; The Anointment', 'Cincinnati, Ohio', NULL, true),
('Apollo Crews', 'apollo-crews', 'smackdown', NULL, '6''1"', 240, 'Spin-Out Powerbomb', 'Stone Mountain, Georgia', NULL, true),
('Axiom', 'axiom', 'smackdown', NULL, '5''8"', 185, 'Golden Ratio', 'Madrid, Spain', NULL, true),
('Berto', 'berto', 'smackdown', NULL, '6''1"', 220, 'Aztec Press; Rings of Saturn', 'Monterrey, Mexico', NULL, true),
('Bo Dallas', 'bo-dallas', 'smackdown', NULL, '6''1"', 234, 'Sister Abigail', NULL, NULL, true),
('Carmelo Hayes', 'carmelo-hayes', 'smackdown', NULL, '5''10"', 210, 'Nothing But Net; First 48', 'Boston, Massachusetts', NULL, true),
('Chris Sabin', 'chris-sabin', 'smackdown', NULL, NULL, 202, 'Cradle Shock', 'Detroit, Michigan', NULL, true),
('Cody Rhodes', 'cody-rhodes', 'smackdown', NULL, '6''2"', 222, 'Cross Rhodes; Cody Cutter', 'Atlanta, Georgia', NULL, true),
('Damian Priest', 'damian-priest', 'smackdown', NULL, '6''5"', 249, 'South of Heaven; Razor''s Edge', 'New York City', NULL, true),
('Dexter Lumis', 'dexter-lumis', 'smackdown', NULL, '6''2"', 239, 'The Silencer; Top-Rope Splash', 'Recluse, Wyoming', NULL, true),
('Drew McIntyre', 'drew-mcintyre', 'smackdown', NULL, '6''5"', 275, 'Claymore; Future Shock', 'Ayr, Scotland', NULL, true),
('Elton Prince', 'elton-prince', 'smackdown', NULL, NULL, NULL, 'Big Boot', 'Grays, England', NULL, true),
('Erick Rowan', 'erick-rowan', 'smackdown', NULL, '6''8"', 315, 'Iron Claw', NULL, NULL, true),
('Ilja Dragunov', 'ilja-dragunov', 'smackdown', NULL, '5''10"', 210, 'H-Bomb; Torpedo Moscow', 'Moscow, Russia', NULL, true),
('Jacob Fatu', 'jacob-fatu', 'smackdown', NULL, '6''2"', 291, 'Double Springboard Moonsault', 'Sacramento, California', NULL, true),
('JC Mateo', 'jc-mateo', 'smackdown', NULL, '5''10"', 264, 'Tour of the Islands', 'Honolulu, Hawaii', NULL, true),
('Joe Gacy', 'joe-gacy', 'smackdown', NULL, NULL, 235, 'Upside Down', 'Batsto, New Jersey', NULL, true),
('Johnny Gargano', 'johnny-gargano', 'smackdown', NULL, '5''10"', 199, 'Garga-No Escape', 'Cleveland, Ohio', NULL, true),
('Kevin Owens', 'kevin-owens', 'smackdown', NULL, NULL, NULL, 'Pop-up Powerbomb; Stunner', NULL, NULL, true),
('Kit Wilson', 'kit-wilson', 'smackdown', NULL, NULL, 210, 'Bearhug Spinebuster', 'Buckinghamshire, England', NULL, true),
('Matt Cardona', 'matt-cardona', 'smackdown', NULL, '6''2"', 230, 'Rough Ryder', 'Long Island, New York', NULL, true),
('The Miz', 'the-miz', 'smackdown', NULL, '6''2"', 221, 'Skull Crushing Finale', 'Hollywood, California', NULL, true),
('Montez Ford', 'montez-ford', 'smackdown', NULL, '6''0"', 232, 'From the Heavens (Frog Splash)', 'Chicago, Illinois', NULL, true),
('Nathan Frazer', 'nathan-frazer', 'smackdown', NULL, NULL, 182, 'Phoenix Splash', 'Isle of Jersey', NULL, true),
('R-Truth', 'r-truth', 'smackdown', NULL, '6''2"', 220, 'Attitude Adjustment', 'Charlotte, North Carolina', NULL, true),
('Randy Orton', 'randy-orton', 'smackdown', NULL, '6''5"', 280, 'RKO; Punt Kick', 'St Louis, Missouri', NULL, true),
('Rey Fenix', 'rey-fenix', 'smackdown', NULL, '5''10"', 182, 'Mexican Muscle Buster', 'Ecatepec, Mexico', NULL, true),
('Sami Zayn', 'sami-zayn', 'smackdown', NULL, '6''1"', 212, 'Helluva Kick', 'Montreal, Quebec, Canada', NULL, true),
('Shinsuke Nakamura', 'shinsuke-nakamura', 'smackdown', NULL, '6''2"', 220, 'Kinshasa', 'Kyoto, Japan', NULL, true),
('Solo Sikoa', 'solo-sikoa', 'smackdown', NULL, '6''2"', 250, 'Samoan Spike', 'Las Vegas, Nevada', NULL, true),
('Talla Tonga', 'talla-tonga', 'smackdown', NULL, '6''9"', 265, 'Chokeslam', 'Kissimmee, Florida', NULL, true),
('Tama Tonga', 'tama-tonga', 'smackdown', NULL, NULL, 220, 'Cut Throat', 'Island of Tonga', NULL, true),
('Tonga Loa', 'tonga-loa', 'smackdown', NULL, NULL, NULL, 'Kamigoye; Samoan Driver', NULL, NULL, true),
('Trick Williams', 'trick-williams', 'smackdown', NULL, '6''4"', 240, 'Trick Shot', 'Columbia, South Carolina', NULL, true),

-- SMACKDOWN WOMEN (18)
('Alba Fyre', 'alba-fyre', 'smackdown', NULL, '5''8"', NULL, 'Swanton Bomb; Gory Bomb', 'Glasgow, Scotland', NULL, true),
('Alexa Bliss', 'alexa-bliss', 'smackdown', NULL, '5''1"', NULL, 'Abigail DDT; Twisted Bliss', 'Columbus, Ohio', NULL, true),
('B-Fab', 'b-fab', 'smackdown', NULL, NULL, NULL, 'Hangman X-Factor; Swinging Flatliner', 'Canton, Ohio', NULL, true),
('Bianca Belair', 'bianca-belair', 'smackdown', NULL, '5''7"', NULL, 'K.O.D. (Kiss of Death)', 'Knoxville, Tennessee', NULL, true),
('Candice LeRae', 'candice-lerae', 'smackdown', NULL, NULL, NULL, 'Wicked Stepsister', 'Riverside, California', NULL, true),
('Charlotte Flair', 'charlotte-flair', 'smackdown', NULL, '5''10"', NULL, 'Figure-Eight; Natural Selection', 'The Queen City', NULL, true),
('Chelsea Green', 'chelsea-green', 'smackdown', NULL, NULL, NULL, 'Unpretty-Her', 'Vancouver, British Columbia, Canada', NULL, true),
('Giulia', 'giulia', 'smackdown', NULL, NULL, NULL, 'Northern Lights Bomb; Arrivederci', 'Tokyo, Japan', NULL, true),
('Jade Cargill', 'jade-cargill', 'smackdown', NULL, NULL, NULL, 'Jaded', 'Vero Beach, Florida', NULL, true),
('Jordynne Grace', 'jordynne-grace', 'smackdown', NULL, NULL, NULL, 'The Direct Effect', 'Austin, Texas', NULL, true),
('Kiana James', 'kiana-james', 'smackdown', NULL, NULL, NULL, '401(k); Deal Breaker', 'Sioux City, Iowa', NULL, true),
('Lash Legend', 'lash-legend', 'smackdown', NULL, '6''0"', NULL, 'Lash Extension; Legendary Bomb', 'Atlanta, Georgia', NULL, true),
('Michin', 'michin', 'smackdown', NULL, '5''7"', NULL, 'Eat Defeat', 'Fontana, California', NULL, true),
('Nia Jax', 'nia-jax', 'smackdown', NULL, '6''0"', NULL, 'The Annihilator', 'San Diego, California', NULL, true),
('Nikki Cross', 'nikki-cross', 'smackdown', NULL, '5''0"', NULL, 'Fisherman''s Neckbreaker; The Purge', 'Glasgow, Scotland', NULL, true),
('Piper Niven', 'piper-niven', 'smackdown', NULL, NULL, NULL, 'Viper Bomb', 'Ayrshire, Scotland', NULL, true),
('Tiffany Stratton', 'tiffany-stratton', 'smackdown', NULL, NULL, NULL, 'Prettiest Moonsault Ever', 'Prior Lake, Minnesota', NULL, true),
('Zelina', 'zelina', 'smackdown', NULL, NULL, NULL, 'Code Red', 'Queens, New York', NULL, true),

-- NXT MEN (42)
('Andre Chase', 'andre-chase', 'nxt', NULL, '6''2"', 222, 'Hammerlock Flatliner', 'Draper, North Carolina', NULL, true),
('Brad Baylor', 'brad-baylor', 'nxt', NULL, '6''3"', 215, 'Diving Elbow Drop', 'Fairfield, Connecticut', NULL, true),
('Bronco Nima', 'bronco-nima', 'nxt', NULL, '6''5"', 300, NULL, 'Oakland, California', NULL, true),
('Brooks Jensen', 'brooks-jensen', 'nxt', NULL, '6''5"', 250, 'Southern Lariat; DDT', 'Randburn, Alabama', NULL, true),
('Channing "Stacks" Lorenzo', 'channing-stacks-lorenzo', 'nxt', NULL, NULL, 206, 'Cement Shoes', 'Albany, New York', NULL, true),
('Charlie Dempsey', 'charlie-dempsey', 'nxt', NULL, NULL, 208, 'Butterfly Suplex; Dragon Suplex', 'Blackpool, England', NULL, true),
('Cutler James', 'cutler-james', 'nxt', NULL, NULL, 255, NULL, NULL, NULL, true),
('Dion Lennox', 'dion-lennox', 'nxt', NULL, '6''2"', 253, NULL, 'Federal Way, Washington', NULL, true),
('EK Prosper', 'ek-prosper', 'nxt', NULL, '6''0"', 190, NULL, 'Orlando, Florida', NULL, true),
('Elio LeFleur', 'elio-lefleur', 'nxt', NULL, NULL, 187, NULL, 'Paris, France', NULL, true),
('Ethan Page', 'ethan-page', 'nxt', NULL, '6''2"', 240, 'Twisted Grin; Ego''s Edge', 'Hamilton, Ontario, Canada', NULL, true),
('Hank Walker', 'hank-walker', 'nxt', NULL, NULL, 290, 'Flying Fridge', 'Hampstead, North Carolina', NULL, true),
('Jackson Drake', 'jackson-drake', 'nxt', NULL, NULL, 188, 'The Unaliving', 'Greensboro, North Carolina', NULL, true),
('Jasper Troy', 'jasper-troy', 'nxt', NULL, '6''6"', 340, 'Black Hole Slam', 'Huffman, Texas', NULL, true),
('Joe Hendry', 'joe-hendry', 'nxt', NULL, '6''2"', 252, 'Standing Ovation', 'Edinburgh, Scotland', NULL, true),
('Josh Briggs', 'josh-briggs', 'nxt', NULL, '6''8"', 290, 'Clothesline From Hell; Big Boot', 'Nothing, Arizona', NULL, true),
('Kale Dixon', 'kale-dixon', 'nxt', NULL, '6''3"', 220, 'Running Blockbuster', 'Hartland, Michigan', NULL, true),
('Keanu Carver', 'keanu-carver', 'nxt', NULL, '6''2"', 290, 'Sky High', 'Washington, DC', NULL, true),
('Lexis King', 'lexis-king', 'nxt', NULL, '6''1"', 220, 'The Coronation', 'Cincinnati, Ohio', NULL, true),
('Lucien Price', 'lucien-price', 'nxt', NULL, '6''3"', 245, NULL, 'Washington, DC', NULL, true),
('Malik Blade', 'malik-blade', 'nxt', NULL, '6''0"', 200, 'Frog Splash', 'Orlando, Florida', NULL, true),
('Myles Borne', 'myles-borne', 'nxt', NULL, NULL, 225, 'Borne Again', 'Wilmington, North Carolina', NULL, true),
('Niko Vance', 'niko-vance', 'nxt', NULL, '6''2"', 260, 'Diving Headbutt', 'Prescott, Arizona', NULL, true),
('Noam Dar', 'noam-dar', 'nxt', NULL, '5''9"', 178, 'Elbow Galactico; Nova Roller', 'Ayr, Scotland', NULL, true),
('Osiris Griffin', 'osiris-griffin', 'nxt', NULL, '6''3"', 290, NULL, 'Loves Park, Illinois', NULL, true),
('Ricky Saints', 'ricky-saints', 'nxt', NULL, '6''0"', 210, 'Tornado DDT; Rochambeau', 'New Orleans, Louisiana', NULL, true),
('Ricky Smokes', 'ricky-smokes', 'nxt', NULL, '6''2"', 199, 'Ripcord Neckbreaker', 'Saugus, Massachusetts', NULL, true),
('Saquon Shugars', 'saquon-shugars', 'nxt', NULL, '6''1"', 222, NULL, 'Washington, DC', NULL, true),
('Shawn Spears', 'shawn-spears', 'nxt', NULL, NULL, NULL, NULL, NULL, NULL, true),
('Shiloh Hill', 'shiloh-hill', 'nxt', NULL, '6''3"', 252, 'Whisper To The Beast', 'Northfield, New Hampshire', NULL, true),
('Sean Legacy', 'sean-legacy', 'nxt', NULL, '5''11"', 210, 'Shambles', 'Augusta, Georgia', NULL, true),
('Tank Ledger', 'tank-ledger', 'nxt', NULL, '6''0"', 301, 'Running Powerslam', 'Darien, Illinois', NULL, true),
('Tavion Heights', 'tavion-heights', 'nxt', NULL, NULL, 260, 'Spinning Belly-to-Belly Suplex', 'Fountain, Colorado', NULL, true),
('Tony D''Angelo', 'tony-dangelo', 'nxt', NULL, NULL, 253, 'Dead to Rights; Spinebuster', 'Chicago, Illinois', NULL, true),
('Uriah Connors', 'uriah-connors', 'nxt', NULL, '6''1"', 200, 'Diving Elbow Drop', 'Atlanta, Georgia', NULL, true),
('Dante Chen', 'dante-chen', 'nxt', NULL, '6''0"', 227, 'The Chentle Touch', 'Singapore', NULL, true),
('Luca Crusifino', 'luca-crusifino', 'nxt', NULL, '6''2"', 246, 'Case Closed', 'Pittsburgh, Pennsylvania', NULL, true),
('Aaron Rourke', 'aaron-rourke', 'nxt', NULL, NULL, 208, 'Over The Rainbow', 'Sparkle City', NULL, true),
('Kam Hendrix', 'kam-hendrix', 'nxt', NULL, '6''4"', 257, 'Lights, Camera, Action', 'Sacramento, California', NULL, true),
('Lince Dorado', 'lince-dorado', 'nxt', NULL, '5''7"', 170, 'Shooting Star Press', 'San Juan, Puerto Rico', NULL, true),
('Drake Morreaux', 'drake-morreaux', 'nxt', NULL, '6''6"', 290, NULL, 'Baton Rouge, Louisiana', NULL, true),
('Trill London', 'trill-london', 'nxt', NULL, '6''2"', 205, NULL, 'Yonkers, New York', NULL, true),

-- NXT WOMEN (20)
('Arianna Grace', 'arianna-grace', 'nxt', NULL, NULL, NULL, NULL, 'Toronto, Ontario, Canada', NULL, true),
('Blake Monroe', 'blake-monroe', 'nxt', NULL, NULL, NULL, 'Glamour Shot', 'London, England', NULL, true),
('Fallon Henley', 'fallon-henley', 'nxt', NULL, NULL, NULL, 'Hoe Down', 'Chelsea, Michigan', NULL, true),
('Izzi Dame', 'izzi-dame', 'nxt', NULL, NULL, NULL, 'Dame Over', 'Buchanan, Michigan', NULL, true),
('Jacy Jayne', 'jacy-jayne', 'nxt', NULL, NULL, NULL, 'Rolling Encore', 'Tampa, Florida', NULL, true),
('Jaida Parker', 'jaida-parker', 'nxt', NULL, NULL, NULL, 'Hipnotic', 'Port St Lucie, Florida', NULL, true),
('Karmen Petrovic', 'karmen-petrovic', 'nxt', NULL, NULL, NULL, 'Petrifier', 'Toronto, Ontario, Canada', NULL, true),
('Kelani Jordan', 'kelani-jordan', 'nxt', NULL, '5''5"', NULL, 'Split-legged Moonsault; Frog Splash', 'Boynton Beach, Florida', NULL, true),
('Kendal Grey', 'kendal-grey', 'nxt', NULL, NULL, NULL, 'Shades of Grey; Cross Armbreaker', 'Las Vegas, Nevada', NULL, true),
('Lainey Reid', 'lainey-reid', 'nxt', NULL, NULL, NULL, 'Running Knee', 'Gadsden, Alabama', NULL, true),
('Lola Vice', 'lola-vice', 'nxt', NULL, NULL, NULL, 'Spinning Back Fist', 'Miami, Florida', NULL, true),
('Nikkita Lyons', 'nikkita-lyons', 'nxt', NULL, NULL, NULL, 'Lyons'' Roar', 'Los Angeles, California', NULL, true),
('Sol Ruca', 'sol-ruca', 'nxt', NULL, NULL, NULL, 'Sol Snatcher', 'Honolulu, Hawaii', NULL, true),
('Tatum Paxley', 'tatum-paxley', 'nxt', NULL, NULL, NULL, 'Cemetery Drive; Psycho Trap', 'Dallas, Texas', NULL, true),
('Thea Hail', 'thea-hail', 'nxt', NULL, NULL, NULL, 'Kimura Lock', 'Pittsburgh, Pennsylvania', NULL, true),
('Tyra Mae Steele', 'tyra-mae-steele', 'nxt', NULL, NULL, NULL, 'German Suplex', 'Katy, Texas', NULL, true),
('Wendy Choo', 'wendy-choo', 'nxt', NULL, '5''2"', NULL, 'Dirt Nap', 'The City That Never Sleeps', NULL, true),
('Wren Sinclair', 'wren-sinclair', 'nxt', NULL, NULL, NULL, 'The Final Wrench', 'Dallas, Texas', NULL, true),
('Zaria', 'zaria', 'nxt', NULL, NULL, NULL, 'F-6', 'Adelaide, South Australia', NULL, true),
('Adriana Rizzo', 'adriana-rizzo', 'nxt', NULL, NULL, NULL, 'Taste of Rizzoto', 'Albertville, Minnesota', NULL, true);

-- ============================================================
-- CHAMPIONSHIP REIGNS (current holders - singles titles only)
-- ============================================================

INSERT INTO championship_reigns (championship_id, wrestler_id, won_date) VALUES
((SELECT id FROM championships WHERE slug = 'undisputed-wwe-championship'), (SELECT id FROM wrestlers WHERE slug = 'cody-rhodes'), '2026-03-06');

INSERT INTO championship_reigns (championship_id, wrestler_id, won_date) VALUES
((SELECT id FROM championships WHERE slug = 'world-heavyweight-championship'), (SELECT id FROM wrestlers WHERE slug = 'cm-punk'), '2025-11-01');

INSERT INTO championship_reigns (championship_id, wrestler_id, won_date) VALUES
((SELECT id FROM championships WHERE slug = 'wwe-womens-championship'), (SELECT id FROM wrestlers WHERE slug = 'jade-cargill'), '2025-11-01');

INSERT INTO championship_reigns (championship_id, wrestler_id, won_date) VALUES
((SELECT id FROM championships WHERE slug = 'womens-world-championship'), (SELECT id FROM wrestlers WHERE slug = 'stephanie-vaquer'), '2025-09-20');

INSERT INTO championship_reigns (championship_id, wrestler_id, won_date) VALUES
((SELECT id FROM championships WHERE slug = 'intercontinental-championship'), (SELECT id FROM wrestlers WHERE slug = 'penta'), '2026-03-02');

INSERT INTO championship_reigns (championship_id, wrestler_id, won_date) VALUES
((SELECT id FROM championships WHERE slug = 'united-states-championship'), (SELECT id FROM wrestlers WHERE slug = 'sami-zayn'), '2026-03-27');
