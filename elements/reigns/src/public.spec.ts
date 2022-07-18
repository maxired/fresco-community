import { validateCards } from "./features/game/validateGameDefinition"
import demo from '../public/games/demo.json';
import gdpr from '../public/games/gdpr.json';
import { Card } from "./features/game/types";


describe('validation of public json', () => {

    describe('demo.json validation',() => {

        it('should not throw', () => {
            expect(()=> validateCards(demo.cards as any as Card[])).not.toThrow()
        })
    })

    describe('gdpr.json validation',() => {

        it('should not throw', () => {
            expect(()=> validateCards(gdpr.cards)).not.toThrow()
        })
    })
})