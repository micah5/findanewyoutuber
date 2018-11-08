<template>
  
</template>

<script>

import moment from 'moment'

export default {
    name: 'user-summary',
    props: ['username', 'about', 'comments', 'submitted', 'isLoading'],
    data() {
        return {
            subreddits: {},
            commentKarma: 0,
            submittedKarma: 0,
            subredditCounts: [],
            wordCounts: [],
            daysComments: [],
            daysSubmitted: [],
            allDaysComments: [],
            allDaysSubmitted: [],
            numSubreddits: 10,
            numFrequentWords: 15,
            badWordIncidence: 0,
            niceWordIncidence: 0,
            readingLevel: 0,
            commentsSortedByScore: null
        }
    },
    computed: {
        topSubreddits() {
            if (this.isLoading) {
                this.newUser = true;
                return;
            }

            if (!this.comments.length || isNaN(this.numSubreddits)) return;

            // Only run once per user
            if (this.newUser) {
                this.commentsSortedByScore = this.comments.slice(0).sort((a, b) => b.data.score - a.data.score);
                this.subredditCounts = this.calculateSubredditCounts();
            }

            let counts = this.subredditCounts.slice(0);

            if (counts.length > this.numSubreddits)
                counts.length = this.numSubreddits;

            return counts;
        },
        mostFrequentlyUsedWords() {
            if (this.isLoading || !this.comments.length || isNaN(this.numFrequentWords)) return;

            // Only run once per user
            if (this.newUser) {
                this.wordCounts = this.calculateWordCounts();
                this.newUser = false;
            }

            let counts = this.wordCounts.slice(0);

            if (counts.length > this.numFrequentWords)
                counts.length = this.numFrequentWords;

            return counts;
        },
        totalComments() {
            return this.comments.length;
        },
        totalSubmitted() {
            return this.submitted.length;
        },
        karmaPerComment() {
            if (!this.comments.length) return 'N/A';
            return Math.round(this.commentKarma/this.comments.length);
        },
        karmaPerSubmitted() {
            if (!this.submitted.length) return 'N/A';
            return Math.round(this.submittedKarma/this.submitted.length);
        },
        mostUpvotedComment() {
            if (!this.commentsSortedByScore) return;
            return this.commentsSortedByScore[0].data;
        },
        mostDownvotedComment() {
            if (!this.commentsSortedByScore) return;
            return this.commentsSortedByScore[this.commentsSortedByScore.length - 1].data;
        },
        kindnessScore() {
            let con = this.controversialityScore;
            let bwi = this.badWordIncidence;
            let nwi = this.niceWordIncidence;
            if (nwi === 0)
                nwi = .01;
            let negativeBehaviour = Math.round(5 * con * bwi/nwi); // 20% controversilaity is full strength
            if (negativeBehaviour > 100)
                negativeBehaviour = 100;
            return 100 - negativeBehaviour;
        },
        controversialityScore() {
            return Math.round(10 * this.calculateControversiality())/10;
        },
        userLink() {
            return `https://www.reddit.com/u/${this.username}`;
        },
        textComplexity() {
            const levels = ['very low', 'low', 'medium', 'high', 'very high', 'very high'];
            return levels[Math.floor(this.readingLevel / 20)];
        },
        readingLevelStyle() {
            return `width: ${this.readingLevel}%`;
        }
    },
    methods: {
        calculateSubredditCounts() {

            // Reset values for each user.
            this.commentKarma = 0;
            this.submittedKarma = 0;
            this.subreddits = {};

            // days comments
            let days = this.createSequenceOfDays(
                moment(1000 * this.comments[this.comments.length - 1].data.created_utc).format('YYYY-MM-DD'), // most recent (end of arr)
                moment(1000 * this.comments[0].data.created_utc).format('YYYY-MM-DD') // earliest (beginning of arr)
            );

            let daysWithComments = [];
            let arrIndex = 0;

            // Comments
            this.comments.slice(0).reverse().forEach(item => {
                this.commentKarma += item.data.score;

                daysWithComments.push(item);
                let day = moment(1000 * item.data.created_utc).format('YYYY-MM-DD');

                // Find the day in "days" array of objects then add the values.
                // There can be multiple items in the array with the same day.

                let newIndex = days.findIndex(item => item.day === day);
                if (newIndex === arrIndex) {
                    newIndex++;
                }
                arrIndex = newIndex;

                if (days[arrIndex]) {
                    days[arrIndex].numComments += 1;
                    days[arrIndex].commentKarma += item.data.score;
                    days[arrIndex].avgControversy = this.calculateControversiality(daysWithComments);
                }

                if (this.subreddits.hasOwnProperty(item.data.subreddit)) {
                    this.subreddits[item.data.subreddit] += 1;
                } else {
                    this.subreddits[item.data.subreddit] = 1;
                }
            });

            this.allDaysComments = days.slice(0);

            arrIndex = 0; // reset
            days = []; // reset
            if (this.submitted.length) {
                days = this.createSequenceOfDays(
                    moment(1000 * this.submitted[this.submitted.length - 1].data.created_utc).format('YYYY-MM-DD'), // most recent (end of arr)
                    moment(1000 * this.submitted[0].data.created_utc).format('YYYY-MM-DD') // earliest (beginning of arr)
                );
            }

            // Submissions
            this.submitted.slice(0).reverse().forEach(item => {
                this.submittedKarma += item.data.score;

                let day = moment(1000 * item.data.created_utc).format('YYYY-MM-DD');

                let newIndex = days.findIndex(item => item.day === day);
                if (newIndex === arrIndex) {
                    newIndex++;
                }
                arrIndex = newIndex;

                if (days[arrIndex]) {
                    days[arrIndex].numSubmitted += 1;
                    days[arrIndex].submittedKarma += item.data.score;
                }

                if (this.subreddits.hasOwnProperty(item.data.subreddit)) {
                    this.subreddits[item.data.subreddit] += 1;
                } else {
                    this.subreddits[item.data.subreddit] = 1;
                }
            });

            this.allDaysSubmitted = days.slice(0);
            this.smoothGraph();
            this.cumulative();

            let subredditCounts = [];
            for (let subreddit in this.subreddits) {
                subredditCounts.push(
                    {
                        name: subreddit,
                        count: this.subreddits[subreddit]
                    }
                )
            }
            subredditCounts.sort((a, b) =>  b.count - a.count);

            return subredditCounts;
        },
        calculateWordCounts() {

            let text = '';
            let frequencies = [];

            this.comments.forEach(item => {
                text += item.data.body + ' ';
            });

            let words = text.split(/[^\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]+/);

            // English
            let stopWords = 'a about above across actually after afterwards again against all almost alone along already also although always am among amongst amoungst amount amp an and another any anyhow anyone anything anyway anywhere are aren around as at back basically be became because become becomes becoming been before beforehand behind being below beside besides between beyond bill bit both bottom but by call can cannot cant co com con could couldnt cry cuz de describe detail did didn didnt do doesn doesnt doing done dont down due during each eg eight either eleven else elsewhere empty enough etc even ever every everyone everything everywhere except few fifteen fify fill find fire first five for former formerly forty found four from front full further get gif give go going good got gt had has hasnt have he hence her here hereafter hereby herein hereupon hers herself him himself his how however http https hundred ie if in inc indeed instead interest into is isn it its itself jpeg jpg just keep know last latter latterly least less let like look looks lot ltd ly made make makes many may maybe me meanwhile might mine more moreover most mostly move much must my myself name namely nbsp need neither never nevertheless next nine no nobody none noone nor not nothing now nowhere of off often oh ok okay on once one only onto or org other others otherwise our ours ourselves out over own part per perhaps please png pretty probably put rather re really said same see seem seemed seeming seems serious several she should shouldn shouldnt show side since sincere six sixty so some somehow someone something sometime sometimes somewhere still such sure take ten than thanks that thats the their them themselves then thence there thereafter thereby therefore therein thereupon these they think third this those though three through throughout thru thus to together too top toward towards trying twelve twenty two u un under until up upon us using very via want wanted was we well were weren werent what whatever when whence whenever where whereafter whereas whereby wherein whereupon wherever whether which while whither who whoever whole wouldn whom whose why will with within without would www ye yea yeah yet you your yours yourself yourselves';

            // French
            stopWords += ' alors au aucuns aussi autre avant avec avoir bon car ce cela ces ceux chaque ci comme comment dans des du dedans dehors depuis devrait doit donc dos début elle elles en encore essai est et eu fait faites fois font hors ici il ils je juste la le les leur là ma maintenant mais mes mine moins mon mot même ni nommés notre nous ou où par parce pas peut peu plupart pour pourquoi quand que quel quelle quelles quels qui sa sans ses seulement si sien son sont sous soyez sujet sur ta tandis tellement tels tes ton tous tout trop très tu voient vont votre vous vu ça étaient état étions été être';

            // German
            stopWords += ' aber als am an auch auf aus bei bin bis bist da dadurch daher darum das daß dass dein deine dem den der des dessen deshalb die dies dieser dieses doch dort du durch ein eine einem einen einer eines er es euer eure für hatte hatten hattest hattet hier hinter ich ihr ihre im in ist ja jede jedem jeden jeder jedes jener jenes jetzt kann kannst können könnt machen mein meine mit muß mußt musst müssen müßt nach nachdem nein nicht nun oder seid sein seine sich sie sind soll sollen sollst sollt sonst soweit sowie und unser unsere unter vom von vor wann warum was weiter weitere wenn wer werde werden werdet weshalb wie wieder wieso wir wird wirst wo woher wohin zu zum zur über';

            // Spanish
            stopWords += ' un una unas unos uno sobre todo también tras otro algún alguno alguna algunos algunas ser es soy eres somos sois estoy esta estamos estais estan como en para atras porque por qué estado estaba ante antes siendo ambos pero por poder puede puedo podemos podeis pueden fui fue fuimos fueron hacer hago hace hacemos haceis hacen cada fin incluso primero desde conseguir consigo consigue consigues conseguimos consiguen ir voy va vamos vais van vaya gueno ha tener tengo tiene tenemos teneis tienen el la lo las los su aqui mio tuyo ellos ellas nos nosotros vosotros vosotras si dentro solo solamente saber sabes sabe sabemos sabeis saben ultimo largo bastante haces muchos aquellos aquellas sus entonces tiempo verdad verdadero verdadera cierto ciertos cierta ciertas intentar intento intenta intentas intentamos intentais intentan dos bajo arriba encima usar uso usas usa usamos usais usan emplear empleo empleas emplean ampleamos empleais valor muy era eras eramos eran modo bien cual cuando donde mientras quien con entre sin trabajo trabajar trabajas trabaja trabajamos trabajais trabajan podria podrias podriamos podrian podriais yo aquel';

            const badWords = ['fuck', 'fucking', 'fucked', 'ass', 'stupid', 'asshole', 'fucker', 'shit', 'shitty', 'bitch', 'dickhead', 'idiot',
                            'cunt', 'slut', 'sluts', 'whore', 'whores', 'nigger', 'niggers', 'terrible', 'awful', 'horrible', 'bad', 'prick',
                            'disgusting', 'gross', 'ugly', 'faggot', 'fag', 'fags', 'dumb', 'retard', 'retarded', 'retards', 'fat', 'cuck', 'cucks', 'cucked',
                            'brainwashed', 'bullshit', 'autist', 'autists', 'moron', 'morons', 'braindead', 'scum'];

            const niceWords = ['amazing', 'dope', 'lovely', 'sweet', 'thank', 'thanks', 'thankfully', 'appreciate', 'awesome', 'love', 'like', 'beautiful', 'gorgeous',
                            'accepting', 'adore', 'brilliant', 'happy', 'fantastic', 'generous', 'help', 'helpful', 'handsome', 'pretty', 'inspiring',
                            'cute', 'kindness', 'laugh', 'laughed', 'optimistic', 'perfect', 'peaceful', 'respect', 'smile', 'unreal', 'wholesome' ,'excellent',
                            'aww', 'friend', 'friendly', 'nice', 'haha', 'please', 'cool', 'interesting'];

            let saidABadWord = 0;
            let saidANiceWord = 0;
            let filteredWords = [];

            words.forEach(word => {
                word = word.toLowerCase();
                if (isNaN(parseFloat(word)) && !isFinite(word)) {
                    if (!stopWords.includes(word)) {
                        if (frequencies.hasOwnProperty(word)) {
                            frequencies[word] += 1;
                        } else {
                            frequencies[word] = 1;
                        }
                        if (badWords.includes(word)) {
                            saidABadWord++;
                        }
                        if (niceWords.includes(word)) {
                            saidANiceWord++;
                        }
                    }
                    filteredWords.push(word);
                }
            });

            this.readingLevel = this.calculateTextComplexity(text, filteredWords);
            this.badWordIncidence = 100 * saidABadWord/words.length;
            this.niceWordIncidence = 100 * saidANiceWord/words.length;

            let wordCounts = [];
            for (let word in frequencies) {
                wordCounts.push(
                    {
                        name: word,
                        frequency: frequencies[word]
                    }
                );
            }
            wordCounts.sort((a, b) =>  b.frequency - a.frequency);

            return wordCounts;
        },
        calculateTextComplexity(text, words) {

            function numSyllables(word) {
                word = word.toLowerCase();
                if (word.length <= 2) return 1;
                word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
                word = word.replace(/^y/, '');
                return word.match(/[aeiouy]{1,2}/g) ? word.match(/[aeiouy]{1,2}/g).length : 1;
            }

            let totalSyllables = 0;
            let totalSentences = 0;
            let sentenceRegex = new RegExp(/\w[.?!](\s|$)/g);
            while (sentenceRegex.exec(text) !== null) {
                totalSentences++;
            }
            words.forEach(word => {
                totalSyllables += numSyllables(word);
            });
            return 100 - Math.round(
                    206.835 - ( 1.015 * (words.length / totalSentences) + 84.6 * (totalSyllables / words.length) )
                );
        },
        createSequenceOfDays(beginning, end) {
            let days = [];

            const beginningMinusOneDay = moment(1000 * moment(beginning).unix() - 86457 * 1000).format('YYYY-MM-DD');
            const endPlusOneDay = moment(1000 * moment(end).unix() + 86457 * 1000).format('YYYY-MM-DD');
            let unix = 1000 * moment(beginningMinusOneDay).unix();

            while (moment(unix).format('YYYY-MM-DD') !== endPlusOneDay) {
                days.push({
                    day: moment(unix).format('YYYY-MM-DD'),
                    numComments: 0,
                    commentKarma: 0,
                    numSubmitted: 0,
                    submittedKarma: 0
                });
                unix += 1000 * 86457; // milliseconds in a day (avg seconds in ~365.24 days)
            }

            return days;
        },
        calculateControversiality(comments = this.comments.slice(0)) {
            if (!comments.length) return 'N/A';
            if (comments.length < 5) return 0;
            let count = 0;

            comments.forEach(item => {
                if (item.data.controversiality == 1) {
                    count += 1;
                }
            });
            return Math.round(100 * 100 * count / comments.length)/100;
        },
        subredditLink(subreddit) {
            return `https://www.reddit.com/r/${subreddit}/`;
        },
        googleLink(word) {
            return `https://www.google.com/search?q=${word}`;
        },
        percentageOf(val) {
            return Math.round(100 * val/(this.comments.length + this.submitted.length));
        },
        date(type, timestamp) {
            if (!timestamp) return;
            if (type === 'relative') {
                return moment(1000 * timestamp).fromNow();
            } else if (type === 'utc') {
                return moment(1000 * timestamp).format("MMM Do, YYYY");
            }
        },
        smoothGraph() {
            let numDays = this.allDaysComments.length;

            if (numDays < 50) {
                numDays = 50;
            }

            let smoothingFactor = Math.round(numDays/50);

            let counter = 0;
            let counterSubmitted = 0;
            let days = [];

            this.allDaysComments.forEach(day => {
                if (counter % smoothingFactor === 0) {
                    days.push(day);
                }
                counter++;
            });

            this.daysComments = days;

            // reset
            days = [];
            counter = 0;
            numDays = this.allDaysSubmitted.length;
            if (numDays < 50) {
                numDays = 50;
            }
            smoothingFactor = Math.round(numDays/50);

            this.allDaysSubmitted.forEach(day => {
                if (counter % smoothingFactor === 0) {
                    days.push(day);
                }
                counter++;
            });

            this.daysSubmitted = days;
        },
        cumulative() {
            let cumulativeNumComments = 0;
            let cumulativeCommentKarma = 0;
            let cumulativeNumSubmitted = 0;
            let cumulativeSubmittedKarma = 0;

            this.allDaysComments.forEach(day => {
                cumulativeNumComments += day.numComments;
                cumulativeCommentKarma += day.commentKarma;
                day.cumulativeNumComments = cumulativeNumComments;
                day.cumulativeCommentKarma = cumulativeCommentKarma;
            });

            this.allDaysSubmitted.forEach(day => {
                cumulativeNumSubmitted += day.numSubmitted;
                cumulativeSubmittedKarma += day.submittedKarma;
                day.cumulativeNumSubmitted = cumulativeNumSubmitted;
                day.cumulativeSubmittedKarma = cumulativeSubmittedKarma;
            });

        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

$text: #cad6e6;

input[type=range] {
  -webkit-appearance: none;
  margin: 10px 0;
  width: 100%;
  background: transparent;

  &:active {
      &::-webkit-slider-thumb {
          opacity: 1;
          transition: transform 0.2s ease;
          transform: scale(1.5);
      }
      &::-moz-range-thumb {
          opacity: 1;
          transition: transform 0.2s ease;
          transform: scale(1.5);
      }
      &::-ms-thumb {
          opacity: 1;
          transition: transform 0.2s ease;
          transform: scale(1.5);
      }
  }
}
input[type=range]:focus {
  outline: none;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 12.8px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  background: linear-gradient(135deg, #00bec7, #0073e8);
  border-radius: 25px;
  border: 0px solid #000101;
}
input[type=range]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  border: 0px solid #000000;
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background: white;
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -6px;
  opacity: 0.85;
}
input[type=range]:focus::-webkit-slider-runnable-track {
    background: linear-gradient(135deg, #00bec7, #0073e8);
}
input[type=range]::-moz-range-track {
  width: 100%;
  height: 12.8px;
  cursor: pointer;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  background: linear-gradient(135deg, #00bec7, #0073e8);
  border-radius: 25px;
  border: 0px solid #000101;
}
input[type=range]::-moz-range-thumb {
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  border: 0px solid #000000;
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background: white;
  cursor: pointer;
  opacity: 0.85;
}
input[type=range]::-ms-track {
  width: 100%;
  height: 12.8px;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  border-width: 39px 0;
  color: transparent;
}
input[type=range]::-ms-fill-lower {
    background: linear-gradient(135deg, #00bec7, #0073e8);
  border: 0px solid #000101;
  border-radius: 50px;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
}
input[type=range]::-ms-fill-upper {
    background: linear-gradient(135deg, #00bec7, #0073e8);
  border: 0px solid #000101;
  border-radius: 50px;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
}
input[type=range]::-ms-thumb {
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  border: 0px solid #000000;
  border-radius: 50%;
  height: 25px;
  width: 25px;
  background: white;
  cursor: pointer;
  opacity: 0.85;
}
input[type=range]:focus::-ms-fill-lower {
    background: linear-gradient(135deg, #00bec7, #0073e8);

}
input[type=range]:focus::-ms-fill-upper {
    background: linear-gradient(135deg, #00bec7, #0073e8);
}

.input-rangeslider {
    max-width: 400px;
    margin: 0 auto;
    margin-bottom: 1rem;
}

.comment {
    word-wrap: break-word;
}

.container {
    &--summary {
        padding: 0;
    }
}

ul {
    list-style-type: none;
    padding: 0;
}

hr {
    border-top: 1px solid rgba(255,255,255,.1);
    margin: 2rem 0;
}

section.summary {
    padding: 4rem 0 2rem;
    margin-bottom: 4rem;
    border-radius: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: rgba(0, 0, 0, 0.2);
    border-top: 3px solid #7755ff;
}

h2 {
    word-wrap: break-word;
    font-size: 2rem;
    font-weight: 300;
    text-align: center;
    margin-bottom: 1.25rem;
    font-weight: 500;
}
h3 {
    @extend h2;
    font-weight: 300;
    font-size: 1.75rem;
    margin-bottom: 1rem;
}

.controversiality {
    font-weight: 700;
    color: #ff5600;
}

p {
    font-size: 18px;
    color: $text !important;
}

a {
    transition: all 0.2s ease;
    &:hover {
        text-decoration: none;
        background-color: rgba(0,150,255,.1);
    }
}

.card {
    &--dark {
        cursor: pointer;
        background: rgba(0,0,0,0.5);
        box-shadow: 0 8px 40px -4px rgba(0, 0, 0, 0.5);
        margin: 0 0.5rem;
        padding: 0;
        border: none;
        margin-bottom: 1rem;
        border: 1px solid black;
        transition: all .2s ease;

        &:hover {
            background: linear-gradient(115deg, #ff79aa, #b743ff);
            box-shadow: 0 15px 100px -4px rgba(0, 0, 0, 0.7);
            color: white;
            transform: scale(1.1);
        }

        small {
            opacity: 0.8;
        }

    }
}

ul {
    li {
        &:hover {
            a {
                color: white;
                background: transparent;
            }
        }
        &:first-child {
            font-weight: 600;
            box-shadow: 0 5px 60px -2px rgba(0, 50, 150, 0.25);
            background: #0073e8;
            background: linear-gradient(135deg, #00bec7, #0073e8);
            color: white;

            a {
                display: inline-block;
                color: white;
            }
        }
    }
    a {
        color: $text;
        padding: .4rem 0.8rem;
    }
}

p {
    text-align: center;
    color: $text;
    margin: 0 0 2rem;

    small {
        opacity: 0.8;
    }
}

.gradient-uppercase {
    font-size: 1.75rem;
    text-transform: uppercase;
    color: #96efff !important;
    background: -webkit-linear-gradient(115deg, #108aff, #96efff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    border-radius: 30px;
    border: 1px solid #108aff;
    max-width: 300px;
    margin: 0 auto;
    margin-top: -0.5rem;
}

@media (min-width: 992px) {
    section.summary {
        padding: 5rem;
    }
}
</style>
