# WSO2 API Gateway Client - JavaScript / Node

Detta är en exempelapplikation för att visa ett flöde för att konsumera API:er via Sundsvall kommuns API-gateway. 

Denna exempelapplikation konsumerar Sundsvall kommuns Incident-API, för att konsumera detta API krävs att din applikation godkänts för användande och du fått [client credentials](https://oauth.net/2/grant-types/client-credentials/). Det generalla flödet är detsamma för övriga av Sundsvall kommuns API:er.

Exempelapplikationen har ett GUI (Graphical User Interface) som byggts med [mustache](https://mustache.github.io/). En lista med filer och paket som behövs för att bygga klienten utan GUI finns längre ned i dokumentet.

Detta innefattar även hantering av Oauth2-tokens. 
Vi använder oss av Oauth2's grant type: [client credentials](https://oauth.net/2/grant-types/client-credentials/).
I denna applikation är en funktion skapad för att hämta och hantera token, det finns även npm-paket som sköter denna hantering, till exempel [client-oauth2](https://www.npmjs.com/package/client-oauth2).

## npm-paket

Den här applikationen använder följande npm-paket:

[express](https://www.npmjs.com/package/express) används för att skapa URI:er och leverera HTML-sidor till GUI.

[body-parser](https://www.npmjs.com/package/body-parser) används för att ta ut data från anrop mellan ändpunkter i GUI.

[multer](https://www.npmjs.com/package/multer) används för att hantera multipart/form-data mellan GUI och express, till exempel konvertera bilder till Base64-format.

[mustache-express](https://www.npmjs.com/package/mustache-express) används för att kunna leverera HTML-filer skapade med mustache via express.

[node-fetch](https://www.npmjs.com/package/node-fetch) används för att göra API-anrop. Det finns ett flertal npm-paket för att konsumera API:er, node-fetch har samma syntax som JavaScript i klientmiljöer, vilket gör anropen i exempelklienten mer generella. __Viktigt!__ Om anrop ska göras från en klient i webbläsare måste åtgärder tas för att skydda client credentials och token.

## Filer

_server.js_ är själva nodeservern och är den som laddas först, där sätts express upp med port, view engine och vilka filer som ska användas för ändpunkter. När servern först startas görs ett anrop för att hämta access_token via anropet
``simpleStorage.getToken().then(res => console.log("Got token"));``
 

_createErrand.js_, _displayErrandNr.js_, _displayError.js_ och _startPage.js_ innehåller de ändpunkter som används av GUI:t, får dessa görs de flesta API-anropen.

_simpleStorage.js_ är en väldigt förenklad lagring av data, där lagras token, sluttid för token samt en variabel för globala värden (i den här applikationen är det personId samt ärendenummer). I en skarp produktionsmiljö bör simpleStorage.js bytas ut mot sessionsvariabler eller annan metod för att säkert hantera data, simpleStorage.js används för att på enklaste möjliga sätt beskriva flödet med så få npm-paket som möjligt.

_APIFunctions.js_ innehåller funktioner med API-anrop, dessa går att byta om eller bygga om för att anropa andra ändpunkter i Sundsvall kommuns API. I APIFunctions.js läses två miljövariabler in
``const client_key = process.env.CLIENT_KEY;``
``const client_secret = process.env.CLIENT_SECRET;``
I en testmiljö kan bland annat [dotenv](https://www.npmjs.com/package/dotenv) användas för att hantera miljövariabler.

De dynamiska HTML-filer som används av mustache finns i mappen views.


## Flöde

När servern startas upp hämtas först en token via funktionen ``getToken()`` i _APIFunctions.js_, denna token lagras sedan i _simpleStorage.js_, tillsammans i anropet med token anges hur lång tid token gäller (i sekunder), ett Date-objekt skapas i _simpleStorage.js_ med nuvarande tid plus giltighetstiden för token minus 10 sekunder (för viss marginal).

När en ändpunkt anropas (till exempel _localhost:3001_ vid lokal testning) hämtas först token ut från _simpleStorage.js_, där kontrolleras först om aktuell tid är tidigare än det Date-objekt som skapats när token hämtats, om det är så skickas token, annars hämtas token på nytt (detta moment hanterar de eventuella npm-paket som används för hantering av Oauth2).

Token används sedan för att göra anrop mot Sundsvall kommuns API-gateway, den data som hämtas skrivs ut på sidorna med hjälp av mustache.

## Klient utan GUI

För att skapa en klient utan GUI behövs endast koden i filerna: 

_server.js_ 
_simpleStorage.js_
_APIFunctions.js_
_package-lock.json_
_package.json_ (efter ``npm install`` bör paket som inte används tas bort med ``npm remove``)

Endast paketet [node-fetch](https://www.npmjs.com/package/node-fetch) behövs (eller annan metod för att konsumera API:er).