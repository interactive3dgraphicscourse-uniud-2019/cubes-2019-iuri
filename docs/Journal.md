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