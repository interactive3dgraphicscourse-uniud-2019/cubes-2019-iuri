# Diario di sviluppo

## Sinossi

Nel seguente documento saranno riportate tutte le fasi dello sviluppo del progetto _Boxes_  per il corso di _Interactive 3D Graphics_ dell'_Università degli Studi di Udine_ con particolare attenzione sulle scelte progettuali effettate, sui problemi incontrati e le rispettive soluzioni.

Il progetto verterà sulla realizzazione di una scena 3D composta unicamente da cubi bianchi di varie dimensioni prendendo ispirazione da alcuni ambienti del videogioco _NieR: Automata_ come la
_Copied City_ ([esempio 1](https://i.pinimg.com/originals/20/b8/c5/20b8c50b9ab9b90f5bef86c0ce2d386d.jpg), [esempio2](https://steamuserimages-a.akamaihd.net/ugc/947341295631366587/AB7D5149E653F0F5018483E310B4545002E49A48/)) o la _Tower_ (di cui purtroppo non ho trovato esempi da linkare direttamente, lascio comunque una [pagina](https://lparchive.org/NieR-Automata/Update%20135/) in cui è possibile vederne varie viste dell'interno).
Per ottenere quindi il risultato voluto (il gioco di luci ombre che rende belli questi ambienti) si utilizzerà il codice di partenza contenente un semplice lightset (che verrà opportunamente modificato).

## 26/03/2019 - Giorno 1: organizzazione del lavoro

Lo sviluppo del progetto sarà organizzato, in linea di massima, come segue:

1. Design della scena su carta e UDK;
2. Calcolo delle operazioni rotazione, traslazione e scalatura necessarie;
3. Ricostruzione della scena con three.js;
4. Ottimizzazione della scena;
5. Studio delle animazioni della scena;
6. Implementazione delle animazioni;
7. Validazione del risultato;
8. Eventuali extra per migliorare la resa finale (da definire);

I dettagli delle varie fasi verranno aggiunti di volta in volta all'elenco.

## 27/03/2019 - Giorno 2: inizio design della scena 3D

Nella presente giornata è iniziato il lavoro di design della scena 3D effettuato avvalendosi di UDK (Unreal Developtment Kit) e bozzetti su carta.

In questa prima giornata si è iniziata a comporre l'isola flottante più grande delle due che comporranno andando a definire la forma e la disposizione delle colonne che formano il primo edificio che si trova sopra quest'isola nonchè definendo dimensioni e posizione dei muri dello stesso.

Inizialmente l'idea era di costruire l'intero edifico completo (vedi bozzetti sotto) per poi andarlo a "anticare" eliminando delle parti in modo da dare l'impressione di una costruzione in rovina, purtroppo però il tempo disponibile è troppo poco per questo tipo di approccio quindi si proseguirà a definire l'edificio direttamente nella sua forma definitiva.
L'idea è di finire il design della scena su UDK e iniziare a portarlo su threejs entro domenica 31/03/2019 al fine di avere sufficiente tempo per dedicarsi, appunto, al porting della scena su threejs e alla realizzazione delle animazioni dei cubi flottanti nonchè allo studio di alcune soluzioni di illuminazione per rendere la scena più piacevole da vedere.

Si annotano di seguito alcune idee pensate in corso d'opera:

* Per la realizzazione del pavimento della zona centrale del primo edifico si è pensato di relaizzare una griglia di parallelepipedi adiacenti (in modo da coprire tutta l'area necessaria) con stessa larghezza e profondità andando a variarne leggermente e casualmente l'altezza intorno ad un valore medio uguale per tutti: in questo modo si può ottenere l'effetto di un pavimento tassellato e sconnesso;
* Per la realizzazione della parte inferiore dell'isola flottante si utilizzerà un approccio analogo a quello precedente ovvero si considererà un griglia di parallelepipedi la cui altezza sarà modulata da una funzione gaussiana bidimensionale (così da ottenere la forma visibile nei bozzetti);
* I cubi flottanti potrebbero essere generati casualmente all'inizializzazione della scena (evitando ovviamente che vadano ad intersecarsi con gli edfici o le isole flottanti).

### Bozzetti:
Varie viste dell'edifico della prima isola
![Edificio in rovina](RuinedBuilding1.jpg)

Schema con per avere un'idea di come dovrebbe venire la parte inferiore delle isole flottanti (estendere ovviamente in 3D)
![Parte inferiore isola](FloatingIsland1.jpg)

## 28/03/2019 - Giorno 3: organizzazione della scena e inizio implementazione

Dopo aver ragionato sull'efficacia dell'approccio "design su UDK e trasposizione su three.js" e a fronte di alcuni test effettuati su three.js, si decide di eliminare il design preliminare su UDK per focalizzarsi sulla relizzazione diretta della scena in javascript.
Per semplificare tale lavoro è stata scelta la seguente organizzazione gerarchica della scena che permette di ridurre al massimo i gradi di libertà dei singoli oggetti (nel senso di renderne posizioni e rotazioni il più relative possibile) in modo da rendere semplice calcolarne le posizioni all'interno della scena (si passa dal dover calcolare posizioni assolute, che risulta piuttosto difficile vista la complicatezza della scena in oggetto, a posizioni relative che permettono un minor "sforzo" e quindi accelerano lo sviluppo):

![Gerarchia scena semplificata](SceneHierarchy.png)

Seguendo quanto detto nel paragrafo precedente si è proceduto all'implementazione della scena in javascript andando, inoltre, a porre le basi per la struttura stessa del codice (aggiungedo il file sorgente SceneActors.js che conterrà tutti i costruttori e le variabili relative agli oggetti in scena, successivamente si andranno a spostare le funzioni ausiliarie, ora contenute in questo stesso file, in un sorgente apposito per rendere il codice più ordinato).
Attualmente la prima isola flottante è completa di colonne (rotte e intere), pavimento "dissestato" e parte inferiore generata tramite una funzione gaussiana.
Durante il testing di questa versione del codice si è notato, però, che le prestazioni vengono notevolmente influenzate dall'abilitazione delle ombre per i vari oggetti che compongno la scena, si è proceduto, quindi, ad un confronto dei risultati ottenuti con o senza ombre (vedi immagini sotto):

![Versione con ombre](IslandShadows.png)
![Versione senza ombre](IslandNoShadows.png)
NOTA: queste immagini si riferiscono ad una versione vecchia senza ancora la parte inferiore dell'isola.

Si vede chiaramente come la prima sembri più realistica ma si nota anche come la seconda dia maggiormente la sensazione di "mondo digitale" che si intende dare alla scena.

Si manterrà quindi la versione senza ombre fino alla fine dello sviluppo della versione di base del software, nel caso poi avanzi tempo per cercare di migliorare l'accuratezza dell'illuminazione (oltre alle "semplici" ombre) si andrà a riutilizzare la versione ombreggiata.
Un ulteriore modifica apportata al codice (dovuta a dei test fatti con le ombre) è stata separare i materiali delle varie parti della scena (in precedenza era presente un solo materiale): questo è stato necessario a causa di un bug di threejs nella gestione delle ombre che da problemi quand uno stesso materiale è utilizzato sia per oggetti che ricevono le ombre sia per oggetti che non le ricevono.

## 29/03/2019 - Giorno 4:

Dopo alcuni ragionamenti sulla struttura da dare ai file sorgenti dell'applicazione si è arrivati alla conclusione che non ha senso averne di vari separati in quanto ci si troverebbe poi a doverli includere uno ad uno nel file html finale: per garantire una migliore portabilità dell'applicazione le funzioni che la compongono verrano quindi inserite in un unico file WhiteChapel.js; grazie a questo approccio gli oggetti della scena 3D "dichiarati" in questo file potranno essere riutilizzati in altri progetti threejs senza dover includere uno alla volta i relativi file sorgente.