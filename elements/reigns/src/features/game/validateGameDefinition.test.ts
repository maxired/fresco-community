import { Card } from "./types";
import { validateCards } from "./validateGameDefinition"

describe('validateGameDefinition', () => {
    describe('validateCards', () => {
        it('should throw if no cards', () => {
            expect(() => validateCards([])).toThrow();
        })
        
        it('should throw if weight less than 1', () => {
            expect(() => validateCards([{weight: 0} as Card])).toThrow();
        })

        it('should throw if weight higher than 100', () => {
            expect(() => validateCards([{weight: 101} as Card])).toThrow();
        })
    })
})