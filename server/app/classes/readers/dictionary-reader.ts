import { ScoreMapper } from '@app/classes/virtual-placement-logic/score-mapper';
import { JsonReader } from '@app/services/json-reader.service';
import { JsonObject } from 'swagger-ui-express';

const DEFAULT_DICTIONARY = 'dictionnaire-par-defaut.json';
export class DictionaryReader {
    private words: Map<string, number> = new Map<string, number>();
    // private letterValues = new LetterBank().produceValueMap();
    constructor(dictionaryName: string = DEFAULT_DICTIONARY) {
        const jsonReader = new JsonReader();
        const jsonData: JsonObject = jsonReader.getData(dictionaryName);
        if (jsonData === undefined) return;
        this.formWordsMap(jsonData.words);
    }
    hasWord(word: string) {
        return this.words.has(word);
    }
    /* computeWordScore(word: string) {
        let score = 0;
        for (const letter of word) {
            if (this.letterValues.get(letter)) {
                score += this.letterValues.get(letter) as number;
            }
        }
        return score;
    }*/
    getWordScore(word: string) {
        if (!this.words.has(word)) return undefined;
        return this.words.get(word);
    }
    getWords() {
        return this.words;
    }
    private formWordsMap(words: string) {
        for (const word of words) {
            this.words.set(word, ScoreMapper.computeWordScore(word));
        }
    }
}
